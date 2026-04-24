/**
 * PgLevelUpManager.js
 * ─────────────────────────────────────────────────────────────
 * Gestore dedicato alla modalità Level-Up (salita di livello).
 * 
 * Estratto da PgController.js per ridurre la complessità del God Object.
 * Gestisce il wizard di level-up a 2 step:
 *   Step 1: HP, ASI, Features, info spell slot
 *   Step 2: Selezione incantesimi (trucchetti, nuovi, scambio)
 * 
 * @author DM Tool
 * @version 1.0.0 - Estratto da PgController
 */

import { 
    calculateProficiencyBonus, 
    calculateModifier, 
    calculateSpellSlots, 
    calculateAvailableASI,
    ABILITY_KEY_TO_PROPERTY,
    ALL_SPELLCASTERS
} from './PgConstants.js';
import { showToast } from '../../../../utils/toast.js';

export class PgLevelUpManager {
    
    constructor(ctx, callbacks) {
        this.ctx = ctx;  // { container, dataManager, databases, spellHelpers }
        this.callbacks = callbacks;  // { setSelectedPgId: (id) => ... }
        
        this.data = null;
        this.step = 1;
        this.pgId = null;
        this.isActive = false;
        
        this._renderCallback = null;  // set by main controller
    }
    
    setRenderCallback(cb) { this._renderCallback = cb; }
    _render() { if (this._renderCallback) this._renderCallback(); }
    
    // ========================================================================
    // SPELLCASTING ABILITY
    // ========================================================================
    
    getSpellcastingAbility(classIndex) {
        const mapping = {
            'bard': 'charisma', 'cleric': 'wisdom', 'druid': 'wisdom',
            'paladin': 'charisma', 'ranger': 'wisdom',
            'sorcerer': 'charisma', 'warlock': 'charisma', 'wizard': 'intelligence'
        };
        return mapping[classIndex] || 'intelligence';
    }
    
    // ========================================================================
    // LEVEL-UP WIZARD: FLUSSO PRINCIPALE
    // ========================================================================

    /**
     * Avvia il level-up wizard per un PG.
     */
    startLevelUp(pgId) {
        const pg = this.ctx.dataManager.getById(pgId);
        if (!pg) {
            showToast('PG non trovato.', 'error');
            return;
        }

        if ((pg.level || 1) >= 20) {
            showToast('Il PG è già al livello massimo (20).', 'warning');
            return;
        }

        const currentLevel = pg.level || 1;
        const newLevel = currentLevel + 1;
        const classData = this.ctx.databases.classes?.find(c => c.index === pg.class);

        if (!classData) {
            showToast('Classe del PG non trovata nel database.', 'error');
            return;
        }

        // Calcola cosa cambia
        const changes = this._calculateLevelUpChanges(pg, classData, currentLevel, newLevel);

        // Determina se c'è uno step incantesimi
        const hasSpellStep = !!(changes.cantrips || changes.spellsKnown ||
            changes.wizardNewSpellCount > 0 ||
            (changes.newSpellLevelsAccessible && changes.newSpellLevelsAccessible.length > 0) ||
            changes.canSwapSpells);

        this.data = {
            pg,
            currentLevel,
            newLevel,
            classData,
            ...changes,
            hasSpellStep,
            renderStep: (step) => this._renderLevelUpStep(step)
        };

        this.isActive = true;
        this.pgId = pgId;
        this.step = 1;
        if (this.callbacks?.setSelectedPgId) {
            this.callbacks.setSelectedPgId(pgId);
        }
        this._render();
    }

    /**
     * Passa allo step successivo del level-up wizard.
     */
    levelUpNextStep() {
        const data = this.data;
        if (!data) return;

        // Se siamo allo step 1 e non c'è uno step spell, conferma direttamente
        if (this.step === 1 && !data.hasSpellStep) {
            this.confirmLevelUp();
            return;
        }

        // Se siamo allo step 1 con spell, passa allo step 2
        if (this.step === 1) {
            this.step = 2;
            this._render();
            return;
        }

        // Se siamo all'ultimo step, conferma
        const totalSteps = data.hasSpellStep ? 2 : 1;
        if (this.step >= totalSteps) {
            this.confirmLevelUp();
        }
    }

    /**
     * Passa allo step precedente del level-up wizard.
     */
    levelUpPrevStep() {
        if (this.step > 1) {
            this.step--;
            this._render();
        }
    }

    /**
     * Annulla il level-up e torna alla visualizzazione PG.
     */
    cancelLevelUp() {
        this.isActive = false;
        this.data = null;
        this.pgId = null;
        this.step = 1;
        this._render();
    }

    /**
     * Conferma e salva il level-up.
     */
    confirmLevelUp() {
        const data = this.data;
        if (!data) return;

        const pgId = this.pgId;
        const pg = this.ctx.dataManager.getById(pgId);
        if (!pg) return;

        const classData = this.ctx.databases.classes?.find(c => c.index === pg.class);
        if (!classData) return;

        // Validazione selezioni spell
        if (data.cantrips && data.selectedNewCantrips.length !== data.cantrips) {
            showToast(`Devi selezionare esattamente ${data.cantrips} truccett${data.cantrips > 1 ? 'i' : 'o'} nuovo${data.cantrips > 1 ? 'i' : ''}.`, 'warning');
            return;
        }
        const expectedNewSpells = data.isWizard ? data.wizardNewSpellCount : (data.spellsKnown || 0);
        if (expectedNewSpells > 0 && data.selectedNewSpells.length !== expectedNewSpells) {
            showToast(`Devi selezionare esattamente ${expectedNewSpells} incantesim${expectedNewSpells > 1 ? 'i' : 'o'} nuov${expectedNewSpells > 1 ? 'i' : 'o'}.`, 'warning');
            return;
        }

        // 1. Aggiorna livello
        const updates = {
            level: data.newLevel,
            proficiencyBonus: calculateProficiencyBonus(data.newLevel)
        };

        // 2. Aggiorna HP (incrementale)
        const hpGain = Math.max(1, data.hp.totalGain);
        updates.hp = {
            current: (pg.hp?.current || 0) + hpGain,
            max: (pg.hp?.max || 0) + hpGain,
            temp: pg.hp?.temp || 0
        };

        // 3. Aggiorna dadi vita
        updates.hitDice = {
            total: data.newLevel,
            current: data.newLevel,
            size: `d${classData.hit_die}`
        };

        // 4. Aggiorna ASI (somma i nuovi a quelli esistenti)
        const oldASI = { ...(pg._asiBonuses || { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }) };
        const newASI = { ...oldASI };
        for (const [prop, val] of Object.entries(data.modalASI)) {
            newASI[prop] = (newASI[prop] || 0) + val;
        }
        updates._asiBonuses = newASI;

        // Applica i nuovi ASI alle abilità
        const newAbilities = { ...(pg.abilities || {}) };
        for (const [prop, val] of Object.entries(data.modalASI)) {
            if (val) {
                newAbilities[prop] = Math.min(20, (newAbilities[prop] || 10) + val);
            }
        }
        updates.abilities = newAbilities;

        // 5. Aggiorna spell slots e spellcasting (se incantatore)
        if (ALL_SPELLCASTERS.includes(classData.index)) {
            const spellAbility = this.getSpellcastingAbility(classData.index);
            const abilityScore = newAbilities[spellAbility] || 10;
            const spellSlots = calculateSpellSlots(classData.index, data.newLevel);

            // Aggiorna lista incantesimi conosciuti
            let updatedSpellsKnown = [...(pg.spellcasting?.spellsKnown || [])];

            // Normalizza a oggetti { name, level }
            updatedSpellsKnown = updatedSpellsKnown.map(s => {
                if (typeof s === 'string') {
                    const lvl = this._findSpellLevel(s, data.classSpellsByLevel || {});
                    return { name: s, level: lvl };
                }
                return s;
            });

            // Aggiungi nuovi trucchetti
            for (const spell of data.selectedNewCantrips) {
                updatedSpellsKnown.push({ name: spell.name, level: 0 });
            }

            // Aggiungi nuovi incantesimi (known casters, warlock, mago)
            for (const spell of data.selectedNewSpells) {
                updatedSpellsKnown.push({ name: spell.name, level: spell.level });
            }

            // Gestisci scambio (Bardo, Stregone)
            if (data.swappedOut && data.swappedIn) {
                updatedSpellsKnown = updatedSpellsKnown.filter(s =>
                    (typeof s === 'string' ? s : s.name) !== data.swappedOut
                );
                const newSpellLevel = this._findSpellLevel(data.swappedIn, data.classSpellsByLevel || {});
                updatedSpellsKnown.push({ name: data.swappedIn, level: newSpellLevel });
            }

            updates.spellcasting = {
                ...(pg.spellcasting || {}),
                ability: spellAbility,
                spellSaveDC: 8 + updates.proficiencyBonus + calculateModifier(abilityScore),
                spellAttackBonus: updates.proficiencyBonus + calculateModifier(abilityScore),
                slots: spellSlots,
                spellsKnown: updatedSpellsKnown
            };
        }

        // 6. Ricalcola iniziativa
        updates.initiative = calculateModifier(newAbilities.dexterity);

        // Salva
        this.ctx.dataManager.update(pgId, updates);
        if (this.callbacks?.setSelectedPgId) {
            this.callbacks.setSelectedPgId(pgId);
        }

        showToast(`${pg.name} è salito al livello ${data.newLevel}!`, 'success');

        // Resetta stato level-up
        this.isActive = false;
        this.data = null;
        this.pgId = null;
        this.step = 1;
        this._render();
    }

    // ========================================================================
    // LEVEL-UP WIZARD: RENDERING
    // ========================================================================

    /**
     * Dispatch alla renderizzazione dello step corretto.
     */
    _renderLevelUpStep(step) {
        if (step === 2) {
            return this._renderLevelUpStep2Spells();
        }
        return this._renderLevelUpStep1HP();
    }

    /**
     * Renderizza lo Step 1 del level-up wizard: HP, ASI, Features, info spell slot.
     * @returns {string} HTML
     */
    _renderLevelUpStep1HP() {
        const data = this.data;
        if (!data) return '';
        const pg = data.pg;
        const isNewASI = data.asi.newPoints > 0;
        const hasNewFeatures = data.newFeatures.length > 0 || data.newSubclassFeatures.length > 0;
        const hasSpellChanges = data.spellSlots || data.cantrips || data.spellsKnown ||
            (data.newSpellLevelsAccessible && data.newSpellLevelsAccessible.length > 0) ||
            (data.wizardNewSpellCount > 0) ||
            (data.canSwapSpells);

        const hpChoice = data.hp.choice;
        const hpGainText = hpChoice === 'roll'
            ? ` (Tiro: ${data.hp.rolled}${data.hp.conMod >= 0 ? '+' + data.hp.conMod : data.hp.conMod})`
            : '';
        const newCurrent = (pg.hp?.current || 0) + data.hp.totalGain;
        const newMax = (pg.hp?.max || 0) + data.hp.totalGain;

        const allocatedASI = Object.values(data.modalASI).reduce((s, v) => s + v, 0);
        const remainingASI = data.asi.newPoints - allocatedASI;

        return `
            <div class="level-up-body">
                ${data.profBonus.changed ? `
                    <div class="lu-section">
                        <h4>🎯 Bonus di Competenza</h4>
                        <div class="lu-stat-change">
                            <span>+${data.profBonus.old}</span>
                            <span class="lu-arrow">→</span>
                            <span class="lu-highlight">+${data.profBonus.new}</span>
                        </div>
                    </div>
                ` : ''}

                <div class="lu-section">
                    <h4>❤️ Punti Ferita</h4>
                    <p class="lu-desc">Guadagni PF per il nuovo livello (d${data.hp.hitDie} + ${data.hp.conMod >= 0 ? '+' : ''}${data.hp.conMod} COS):</p>
                    <div class="lu-hp-choice">
                        <button class="btn btn-sm ${hpChoice === 'average' ? 'btn-primary' : 'btn-secondary'}"
                                data-hp-choice="average">
                            📊 Media: +${data.hp.totalGain} PF
                        </button>
                        <button class="btn btn-sm ${hpChoice === 'roll' ? 'btn-primary' : 'btn-secondary'}"
                                data-hp-choice="roll">
                            🎲 Tira il dado (1d${data.hp.hitDie}${data.hp.conMod >= 0 ? '+' + data.hp.conMod : data.hp.conMod})
                        </button>
                    </div>
                    <div class="lu-hp-result">
                        HP attuali: <strong>${pg.hp?.current || 0}/${pg.hp?.max || 0}</strong>
                        → Nuovi: <strong>${newCurrent}/${newMax}</strong>${hpGainText}
                    </div>
                </div>

                ${isNewASI ? `
                    <div class="lu-section lu-asi-section">
                        <h4>📈 Miglioramento Punteggi di Caratteristica</h4>
                        <p class="lu-desc">Hai <strong>${data.asi.newPoints} punti</strong> da distribuire (+2 a una o +1 a due caratteristiche).</p>
                        <div class="lu-asi-points">
                            <span>Punti rimanenti: <strong class="lu-asi-remaining">${remainingASI}/${data.asi.newPoints}</strong></span>
                        </div>
                        <div class="lu-asi-grid">
                            ${['str', 'dex', 'con', 'int', 'wis', 'cha'].map(key => {
                                const prop = ABILITY_KEY_TO_PROPERTY[key];
                                const oldASI = (pg._asiBonuses || {})[prop] || 0;
                                const newASI = data.modalASI[prop] || 0;
                                const totalScore = (pg.abilities?.[prop] || 10) + oldASI + newASI;
                                const mod = calculateModifier(totalScore);
                                return `
                                    <div class="lu-asi-item">
                                        <span class="lu-asi-name">${key.toUpperCase()}</span>
                                        <span class="lu-asi-score">${totalScore}${newASI > 0 ? `<span class="lu-asi-added">+${newASI}</span>` : ''}</span>
                                        <span class="lu-asi-mod">${mod >= 0 ? '+' : ''}${mod}</span>
                                        <div class="lu-asi-buttons">
                                            <button class="btn btn-mini" data-asi-ability="${prop}" data-asi-action="decrease">−</button>
                                            <button class="btn btn-mini" data-asi-ability="${prop}" data-asi-action="increase">+</button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}

                ${hasNewFeatures ? `
                    <div class="lu-section">
                        <h4>⚔️ Nuovi Privilegi di Classe</h4>
                        <div class="lu-features">
                            ${data.newFeatures.map(f => `
                                <div class="lu-feature-tag class-feature">⚔️ ${f}</div>
                            `).join('')}
                            ${data.newSubclassFeatures.map(f => `
                                <div class="lu-feature-tag subclass-feature">🌟 ${f.nome || f}</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${hasSpellChanges ? `
                    <div class="lu-section">
                        <h4>✨ Incantesimi</h4>
                        <p class="lu-hint">Vedi il prossimo step per gestire gli incantesimi.</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Renderizza lo Step 2 del level-up wizard: selezione incantesimi.
     * @returns {string} HTML
     */
    _renderLevelUpStep2Spells() {
        const data = this.data;
        if (!data) return '';

        const { classNameIt, classSpellsByLevel, casterType, isWizard, canSwapSpells,
                newSpellLevelsAccessible, currentKnownSpells, cantrips, spellsKnown,
                wizardNewSpellCount, classData, newLevel } = data;

        if (!classSpellsByLevel) {
            return '<p>Nessun dato incantesimi disponibile.</p>';
        }

        const levelLabels = {
            0: 'Trucchetti', 1: '1° Livello', 2: '2° Livello', 3: '3° Livello',
            4: '4° Livello', 5: '5° Livello', 6: '6° Livello',
            7: '7° Livello', 8: '8° Livello', 9: '9° Livello'
        };

        let html = '';

        // --- Nuovi slot ---
        if (data.spellSlots) {
            html += `<div class="lu-section"><h4>✨ Nuovi Slot Incantesimo</h4>`;
            html += '<div class="lu-spell-slots">';
            for (const [lvl, count] of Object.entries(data.spellSlots)) {
                html += `<span class="lu-slot-tag">+${count} slot ${levelLabels[lvl]}</span>`;
            }
            html += '</div></div>';
        }

        // --- Nuovi livelli di incantesimo accessibili ---
        if (newSpellLevelsAccessible.length > 0) {
            html += '<div class="lu-section lu-new-spell-levels">';
            html += '<h4>🔓 Nuovi Livelli Sbloccati</h4>';
            for (const lvl of newSpellLevelsAccessible) {
                const spells = classSpellsByLevel[lvl] || [];
                html += `<div class="lu-spell-level-block">`;
                html += `<h5>${levelLabels[lvl]} <span class="lu-spell-count">(${spells.length} incantesimi)</span></h5>`;
                html += '<div class="lu-spell-tags">';
                for (const spell of spells) {
                    const isKnown = currentKnownSpells.includes(spell);
                    html += `<span class="lu-spell-tag ${isKnown ? 'already-known' : 'new-available'}" data-spell-name="${spell}" data-spell-level="${lvl}">${spell}</span>`;
                }
                html += '</div></div>';
            }
            html += '</div>';
        }

        // --- Selezione nuovi trucchetti ---
        if (cantrips && cantrips > 0 && classSpellsByLevel[0]) {
            const allCantrips = classSpellsByLevel[0];
            const selectedCantripNames = data.selectedNewCantrips.map(s => s.name);
            const availableCantrips = allCantrips.filter(c => !currentKnownSpells.includes(c));

            html += '<div class="lu-section lu-cantrip-selection">';
            html += `<h4>✨ Scegli ${cantrips} nuovo${cantrips > 1 ? 'i' : ''} truccetto${cantrips > 1 ? 'i' : ''}</h4>`;
            html += `<p class="lu-hint">Trucchetti attuali: ${currentKnownSpells.filter(s => (classSpellsByLevel[0] || []).includes(s)).length}/${data.maxCantripsNew}</p>`;
            html += `<div class="lu-spell-counter">Selezionati: <strong class="lu-cantrip-count">${data.selectedNewCantrips.length}</strong> / ${cantrips}</div>`;
            html += '<div class="lu-spell-select-grid lu-cantrip-grid">';
            for (const cantrip of availableCantrips) {
                const isSelected = selectedCantripNames.includes(cantrip);
                html += `<label class="lu-spell-cb ${isSelected ? 'selected' : ''}" data-lu-spell="${cantrip}" data-lu-level="0">`;
                html += `<input type="checkbox" data-lu-spell-input="${cantrip}" data-lu-level="0" ${isSelected ? 'checked' : ''}>`;
                html += `<span class="lu-spell-cb-name">${cantrip}</span>`;
                html += '</label>';
            }
            html += '</div></div>';
        }

        // --- Selezione nuovi incantesimi (Known casters: Bardo, Stregone, Warlock) ---
        if (spellsKnown && spellsKnown > 0 && (casterType === 'known' || casterType === 'warlock')) {
            const maxLevel = this._getMaxSpellLevelForClass(classNameIt, newLevel);

            let warlockEffectiveLevel = maxLevel;
            if (casterType === 'warlock') {
                const newSlots = calculateSpellSlots(classData.index, newLevel);
                for (let l = 9; l >= 1; l--) {
                    if (newSlots[l]?.max > 0) { warlockEffectiveLevel = l; break; }
                }
            }

            const selectedSpellNames = data.selectedNewSpells.map(s => s.name);

            html += '<div class="lu-section lu-new-spells-selection">';
            html += `<h4>📖 Scegli ${spellsKnown} nuovo${spellsKnown > 1 ? 'i' : ''} incantesimo${spellsKnown > 1 ? 'i' : ''}</h4>`;
            html += `<p class="lu-hint">Incantesimi conosciuti: ${currentKnownSpells.filter(s => s && !this._isCantrip(s, classSpellsByLevel)).length}/${data.maxSpellsKnownNew}</p>`;
            html += `<div class="lu-spell-counter">Selezionati: <strong class="lu-new-spell-count">${data.selectedNewSpells.length}</strong> / ${spellsKnown}</div>`;

            for (let lvl = 1; lvl <= (casterType === 'warlock' ? warlockEffectiveLevel : maxLevel); lvl++) {
                const spells = classSpellsByLevel[lvl] || [];
                if (spells.length === 0) continue;
                const available = spells.filter(s => !currentKnownSpells.includes(s));
                if (available.length === 0) continue;

                html += '<div class="lu-spell-level-block">';
                html += `<h5>${levelLabels[lvl]} <span class="lu-spell-count">(${available.length} disponibili)</span></h5>`;
                html += '<div class="lu-spell-select-grid">';
                for (const spell of available) {
                    const isSelected = selectedSpellNames.includes(spell);
                    html += `<label class="lu-spell-cb ${isSelected ? 'selected' : ''}" data-lu-spell="${spell}" data-lu-level="${lvl}">`;
                    html += `<input type="checkbox" data-lu-spell-input="${spell}" data-lu-level="${lvl}" ${isSelected ? 'checked' : ''}>`;
                    html += `<span class="lu-spell-cb-name">${spell}</span>`;
                    html += '</label>';
                }
                html += '</div></div>';
            }
            html += '</div>';
        }

        // --- Selezione incantesimi grimorio (Mago) ---
        if (isWizard && wizardNewSpellCount > 0) {
            const maxLevel = this._getMaxSpellLevelForClass('Mago', newLevel);
            const selectedSpellNames = data.selectedNewSpells.map(s => s.name);

            html += '<div class="lu-section lu-wizard-spellbook">';
            html += `<h4>📖 Aggiungi ${wizardNewSpellCount} incantesimo${wizardNewSpellCount > 1 ? 'i' : ''} al grimorio</h4>`;
            html += `<p class="lu-hint">Grimorio: ${currentKnownSpells.filter(s => s && !this._isCantrip(s, classSpellsByLevel)).length}/${data.maxSpellsKnownNew}</p>`;
            html += `<div class="lu-spell-counter">Selezionati: <strong class="lu-wizard-count">${data.selectedNewSpells.length}</strong> / ${wizardNewSpellCount}</div>`;

            for (let lvl = 1; lvl <= maxLevel; lvl++) {
                const spells = classSpellsByLevel[lvl] || [];
                if (spells.length === 0) continue;
                const available = spells.filter(s => !currentKnownSpells.includes(s));
                if (available.length === 0) continue;

                html += '<div class="lu-spell-level-block">';
                html += `<h5>${levelLabels[lvl]} <span class="lu-spell-count">(${available.length} disponibili)</span></h5>`;
                html += '<div class="lu-spell-select-grid">';
                for (const spell of available) {
                    const isSelected = selectedSpellNames.includes(spell);
                    html += `<label class="lu-spell-cb ${isSelected ? 'selected' : ''}" data-lu-spell="${spell}" data-lu-level="${lvl}">`;
                    html += `<input type="checkbox" data-lu-spell-input="${spell}" data-lu-level="${lvl}" ${isSelected ? 'checked' : ''}>`;
                    html += `<span class="lu-spell-cb-name">${spell}</span>`;
                    html += '</label>';
                }
                html += '</div></div>';
            }
            html += '</div>';
        }

        // --- Scambio incantesimi (Bardo, Stregone) ---
        if (canSwapSpells) {
            const maxLevel = this._getMaxSpellLevelForClass(classNameIt, newLevel);
            const swapLabel = classNameIt === 'Bardo' ? 'Bardo' : 'Stregone';

            const outLevel = data.swappedOut ? this._findSpellLevel(data.swappedOut, classSpellsByLevel) : null;

            html += '<div class="lu-section lu-swap-section">';
            html += `<h4>🔄 Scambio Incantesimo (${swapLabel})</h4>`;
            html += '<p class="lu-hint">Puoi sostituire un incantesimo conosciuto con un altro della tua lista di classe.</p>';

            html += '<div class="lu-swap-column">';
            html += '<h6>Rimuovi:</h6>';
            html += '<div class="lu-swap-list">';
            const knownNonCantrips = currentKnownSpells.filter(s => s && !this._isCantrip(s, classSpellsByLevel));
            if (knownNonCantrips.length > 0) {
                for (const spell of knownNonCantrips) {
                    const spellLvl = this._findSpellLevel(spell, classSpellsByLevel);
                    const isSel = data.swappedOut === spell;
                    html += `<span class="lu-swap-item lu-swap-out-item ${isSel ? 'selected' : ''}" data-swap-out="${spell}" data-swap-out-level="${spellLvl}">${spell} ${spellLvl > 0 ? `(${levelLabels[spellLvl] || 'lv.'+spellLvl})` : ''}</span>`;
                }
            } else {
                html += '<p class="lu-hint">Nessun incantesimo da cui scegliere.</p>';
            }
            html += '</div></div>';

            html += '<div class="lu-swap-column">';
            html += '<h6>Aggiungi:</h6>';
            html += '<div class="lu-swap-list">';
            for (let lvl = 1; lvl <= maxLevel; lvl++) {
                const spells = classSpellsByLevel[lvl] || [];
                for (const spell of spells) {
                    const isKnown = currentKnownSpells.includes(spell);
                    const isSel = data.swappedIn === spell;
                    const isDisabled = outLevel !== null && lvl > outLevel;
                    html += `<span class="lu-swap-item lu-swap-in-item ${isKnown ? 'already-known' : ''} ${isSel ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" data-swap-in="${spell}" data-swap-in-level="${lvl}">${spell} (${levelLabels[lvl]})</span>`;
                }
            }
            html += '</div></div>';

            html += '<div class="lu-swap-actions">';
            html += '<button class="btn btn-sm btn-secondary" data-lu-action="clear-swap">🗑️ Resetta scambio</button>';
            html += '</div>';
            html += '</div>';
        }

        // --- Nota per prepared casters ---
        if (casterType === 'prepared' && !cantrips && !isWizard && !newSpellLevelsAccessible.length) {
            html += '<div class="lu-section"><p class="lu-desc">Nessun cambiamento agli incantesimi.</p>';
            html += '<p class="lu-hint">Conosci tutti gli incantesimi della tua lista. La gestione della preparazione avviene in-game.</p></div>';
        }

        return html;
    }
    
    // ========================================================================
    // LEVEL-UP WIZARD: CALCOLO CAMBIAMENTI
    // ========================================================================

    /**
     * Calcola tutti i cambiamenti per il level up
     */
    _calculateLevelUpChanges(pg, classData, currentLevel, newLevel) {
        const oldProfBonus = calculateProficiencyBonus(currentLevel);
        const newProfBonus = calculateProficiencyBonus(newLevel);
        
        // Nuovi privilegi guadagnati al livello newLevel
        const lvlData = classData.tabella_progressione?.[newLevel - 1];
        const newFeatures = lvlData?.privilegi || [];
        
        // Nuovi privilegi di sottoclasse
        let newSubclassFeatures = [];
        if (pg.subclass && classData.sottoclassi) {
            const sc = classData.sottoclassi.find(s => s.nome === pg.subclass);
            if (sc?.privilegi?.[String(newLevel)]) {
                newSubclassFeatures = [sc.privilegi[String(newLevel)]];
            }
        }

        // ASI: calcola totali vecchi e nuovi
        const oldASITotal = calculateAvailableASI(classData, currentLevel);
        const newASITotal = calculateAvailableASI(classData, newLevel);
        const newASIPoints = newASITotal - oldASITotal; // Punti nuovi guadagnati
        const oldASIUsed = Object.values(pg._asiBonuses || {}).reduce((s, v) => s + (v || 0), 0);
        const availableASIToAllocate = newASIPoints; // Solo i nuovi punti

        // HP incrementali
        const hitDieSize = classData.hit_die;
        const racialBonuses = pg._racialBonuses || this.ctx.databases.races?.find(r => r.index === pg.race)?.ability_bonuses || [];
        const asiBonuses = pg._asiBonuses || {};
        const totalCon = (pg.abilities?.constitution || 10) + (racialBonuses.find(b => b.ability_score?.index === 'con')?.bonus || 0) + (asiBonuses.constitution || 0);
        const conMod = calculateModifier(totalCon);
        const avgHpGain = Math.floor(hitDieSize / 2) + 1;
        const hpGain = avgHpGain + conMod;

        // === SPELL DATA ===
        const classMap = {
            'bard': 'Bardo', 'cleric': 'Chierico', 'druid': 'Druido',
            'paladin': 'Paladino', 'ranger': 'Ranger', 'sorcerer': 'Stregone',
            'warlock': 'Warlock', 'wizard': 'Mago'
        };
        const classNameIt = classMap[classData.index] || null;
        const classSpellsByLevel = this.ctx.databases.spellLevelsByClass?.[classNameIt] || null;
        
        let spellSlotChanges = null;
        let cantripsChange = null;
        let spellsKnownChange = null;
        let newSpellLevelsAccessible = []; // Nuovi livelli di incantesimo sbloccati
        let casterType = 'none'; // 'known' | 'prepared' | 'warlock' | 'none'
        let canSwapSpells = false;
        let isWizard = false;
        let wizardNewSpellCount = 0;
        let maxCantripsNew = null;
        let maxSpellsKnownNew = null;
        let maxCantripsOld = null;
        let maxSpellsKnownOld = null;
        
        // Incantesimi attualmente conosciuti dal PG
        const currentKnownSpells = (pg.spellcasting?.spellsKnown || []).map(s => typeof s === 'string' ? s : s.name);
        
        if (ALL_SPELLCASTERS.includes(classData.index) && classSpellsByLevel) {
            casterType = this.ctx.spellHelpers?.getCasterType(classNameIt) || 'none';
            isWizard = classNameIt === 'Mago';
            canSwapSpells = ['Bardo', 'Stregone'].includes(classNameIt);
            
            // Spell slots
            const oldSlots = calculateSpellSlots(classData.index, currentLevel);
            const newSlots = calculateSpellSlots(classData.index, newLevel);
            
            const diff = {};
            for (const [level, slots] of Object.entries(newSlots)) {
                const old = oldSlots[level]?.max || 0;
                const nv = slots.max || 0;
                if (nv > old) {
                    diff[level] = nv - old;
                }
            }
            if (Object.keys(diff).length > 0) {
                spellSlotChanges = diff;
            }

            // Nuovi livelli di incantesimo accessibili
            const oldMaxLevel = this.ctx.spellHelpers?.spellLevelsByClass ? 
                this._getMaxSpellLevelForClass(classNameIt, currentLevel) : 0;
            const newMaxLevel = this._getMaxSpellLevelForClass(classNameIt, newLevel);
            for (let lvl = oldMaxLevel + 1; lvl <= newMaxLevel; lvl++) {
                if (classSpellsByLevel[lvl]?.length > 0) {
                    newSpellLevelsAccessible.push(lvl);
                }
            }
            
            // Trucchetti
            if (this.ctx.spellHelpers?.getMaxCantripsKnown) {
                maxCantripsOld = this.ctx.spellHelpers.getMaxCantripsKnown(classNameIt, currentLevel);
                maxCantripsNew = this.ctx.spellHelpers.getMaxCantripsKnown(classNameIt, newLevel);
                if (maxCantripsOld !== null && maxCantripsNew !== null && maxCantripsNew > maxCantripsOld) {
                    cantripsChange = maxCantripsNew - maxCantripsOld;
                }
            }
            
            // Incantesimi conosciuti
            if (isWizard) {
                // Mago: grimorio = 6 + 2*(livello-1)
                const oldBook = 6 + (currentLevel - 1) * 2;
                const newBook = 6 + (newLevel - 1) * 2;
                wizardNewSpellCount = newBook - oldBook; // Sempre 2
                maxSpellsKnownOld = oldBook;
                maxSpellsKnownNew = newBook;
            } else if (casterType === 'known' && this.ctx.spellHelpers?.getMaxSpellsKnown) {
                maxSpellsKnownOld = this.ctx.spellHelpers.getMaxSpellsKnown(classNameIt, currentLevel);
                maxSpellsKnownNew = this.ctx.spellHelpers.getMaxSpellsKnown(classNameIt, newLevel);
                if (maxSpellsKnownOld !== null && maxSpellsKnownNew !== null && maxSpellsKnownNew > maxSpellsKnownOld) {
                    spellsKnownChange = maxSpellsKnownNew - maxSpellsKnownOld;
                }
            } else if (casterType === 'warlock') {
                // Warlock: incantesimi conosciuti dalla tabella progressione
                const oldLvlData = classData.tabella_progressione?.[currentLevel - 1];
                const oldKnown = oldLvlData?.incantesimi_conosciuti ?? 0;
                const newKnown = lvlData?.incantesimi_conosciuti ?? 0;
                if (newKnown > oldKnown) {
                    spellsKnownChange = newKnown - oldKnown;
                    maxSpellsKnownOld = oldKnown;
                    maxSpellsKnownNew = newKnown;
                }
            }
        }

        return {
            profBonus: { old: oldProfBonus, new: newProfBonus, changed: oldProfBonus !== newProfBonus },
            newFeatures,
            newSubclassFeatures,
            asi: { newPoints: newASIPoints, total: newASITotal, oldUsed: oldASIUsed },
            hp: { avgGain: avgHpGain, totalGain: hpGain, conMod, hitDie: hitDieSize, choice: 'average' },
            spellSlots: spellSlotChanges,
            cantrips: cantripsChange,
            spellsKnown: spellsKnownChange,
            // Nuovi dati spell
            classNameIt,
            classSpellsByLevel,
            casterType,
            isWizard,
            canSwapSpells,
            newSpellLevelsAccessible,
            wizardNewSpellCount,
            currentKnownSpells,
            maxCantripsOld,
            maxCantripsNew,
            maxSpellsKnownOld,
            maxSpellsKnownNew,
            // Stato selezioni nel modal
            selectedNewCantrips: [],
            selectedNewSpells: [],
            swappedOut: null,   // Nome incantesimo rimosso
            swappedIn: null,    // Nome incantesimo aggiunto
            // Stato corrente ASI allocation nel modal (per i nuovi punti)
            modalASI: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }
        };
    }
    
    // ========================================================================
    // LEVEL-UP WIZARD: HELPER SPELL
    // ========================================================================
    
    /**
     * Helper: ottiene il livello max di incantesimo per classe e livello PG
     */
    _getMaxSpellLevelForClass(classNameIt, pgLevel) {
        const halfCasters = ['Paladino', 'Ranger'];
        if (halfCasters.includes(classNameIt)) {
            // Half casters: max spell level by pg level
            const table = { 1:0, 2:1, 3:1, 4:1, 5:2, 6:2, 7:2, 8:2, 9:3, 10:3,
                11:3, 12:3, 13:4, 14:4, 15:4, 16:4, 17:5, 18:5, 19:5, 20:5 };
            return table[pgLevel] || 0;
        }
        // Full casters
        const table = { 1:1, 2:1, 3:2, 4:2, 5:3, 6:3, 7:4, 8:4, 9:5, 10:5,
            11:6, 12:6, 13:7, 14:7, 15:8, 16:8, 17:9, 18:9, 19:9, 20:9 };
        return table[pgLevel] || 0;
    }
    
    /**
     * Helper: verifica se un incantesimo è un trucco
     */
    _isCantrip(spellName, classSpellsByLevel) {
        return (classSpellsByLevel[0] || []).includes(spellName);
    }
    
    /**
     * Helper: trova il livello di un incantesimo nella lista classe
     */
    _findSpellLevel(spellName, classSpellsByLevel) {
        for (let lvl = 0; lvl <= 9; lvl++) {
            if ((classSpellsByLevel[lvl] || []).includes(spellName)) return lvl;
        }
        return 0;
    }
    
    // ========================================================================
    // LEVEL-UP WIZARD: GESTIONE EVENTI
    // ========================================================================

    /**
     * Gestisce il toggle selezione incantesimo/trucco nel level-up wizard.
     */
    _handleWizardSpellToggle(spellLabel) {
        const data = this.data;
        if (!data) return;

        const spellName = spellLabel.dataset.luSpell;
        const spellLevel = parseInt(spellLabel.dataset.luLevel) || 0;
        const isCantrip = spellLevel === 0;

        if (isCantrip) {
            const max = data.cantrips || 0;
            const idx = data.selectedNewCantrips.findIndex(s => s.name === spellName);
            if (idx >= 0) {
                data.selectedNewCantrips.splice(idx, 1);
            } else {
                if (data.selectedNewCantrips.length >= max) {
                    showToast(`Hai già selezionato ${max} truccett${max > 1 ? 'i' : 'o'}. Deseleziona uno prima.`, 'warning');
                    return;
                }
                data.selectedNewCantrips.push({ name: spellName, level: 0 });
            }
        } else {
            const max = data.isWizard ? data.wizardNewSpellCount : (data.spellsKnown || 0);
            const idx = data.selectedNewSpells.findIndex(s => s.name === spellName);
            if (idx >= 0) {
                data.selectedNewSpells.splice(idx, 1);
            } else {
                if (data.selectedNewSpells.length >= max) {
                    showToast(`Hai già selezionato ${max} incantesim${max > 1 ? 'i' : 'o'}. Deseleziona uno prima.`, 'warning');
                    return;
                }
                data.selectedNewSpells.push({ name: spellName, level: spellLevel });
            }
        }

        this._render();
    }

    /**
     * Gestisce la selezione dell'incantesimo da rimuovere nello swap (wizard).
     */
    _handleWizardSwapOut(swapOutItem) {
        const data = this.data;
        if (!data) return;

        const spellName = swapOutItem.dataset.swapOut;

        // Se era già selezionato, deseleziona
        if (data.swappedOut === spellName) {
            data.swappedOut = null;
            data.swappedIn = null;
        } else {
            data.swappedOut = spellName;
            data.swappedIn = null;
        }

        this._render();
    }

    /**
     * Gestisce la selezione dell'incantesimo da aggiungere nello swap (wizard).
     */
    _handleWizardSwapIn(swapInItem) {
        const data = this.data;
        if (!data) return;

        const spellName = swapInItem.dataset.swapIn;
        const spellLevel = parseInt(swapInItem.dataset.swapInLevel) || 0;

        if (!data.swappedOut) {
            showToast('Prima seleziona l\'incantesimo da rimuovere.', 'warning');
            return;
        }

        const outLevel = this._findSpellLevel(data.swappedOut, data.classSpellsByLevel || {});
        if (spellLevel > outLevel) {
            showToast(`Puoi scegliere solo incantesimi di livello ${outLevel} o inferiore.`, 'warning');
            return;
        }

        // Se era già selezionato, deseleziona
        if (data.swappedIn === spellName) {
            data.swappedIn = null;
        } else {
            data.swappedIn = spellName;
        }

        this._render();
    }

    /**
     * Resetta lo scambio incantesimi (wizard).
     */
    _handleWizardClearSwap() {
        const data = this.data;
        if (!data) return;
        data.swappedOut = null;
        data.swappedIn = null;
        this._render();
    }

    /**
     * Gestisce la scelta HP (media o tiro) nel wizard.
     */
    _handleWizardHpChoice(button) {
        const data = this.data;
        if (!data) return;

        const choice = button.dataset.hpChoice;
        if (choice === 'roll') {
            const roll = Math.floor(Math.random() * data.hp.hitDie) + 1;
            data.hp.totalGain = roll + data.hp.conMod;
            data.hp.choice = 'roll';
            data.hp.rolled = roll;
        } else {
            data.hp.totalGain = data.hp.avgGain + data.hp.conMod;
            data.hp.choice = 'average';
            delete data.hp.rolled;
        }

        this._render();
    }

    /**
     * Gestisce ASI nel wizard.
     */
    _handleWizardASI(button) {
        const data = this.data;
        if (!data) return;

        const prop = button.dataset.asiAbility;
        const action = button.dataset.asiAction;
        const allocated = Object.values(data.modalASI).reduce((s, v) => s + v, 0);
        const maxPoints = data.asi.newPoints;

        if (action === 'increase') {
            if (allocated >= maxPoints) {
                showToast('Hai distribuito tutti i punti ASI disponibili.', 'warning');
                return;
            }
            data.modalASI[prop] = (data.modalASI[prop] || 0) + 1;
        } else {
            if ((data.modalASI[prop] || 0) <= 0) return;
            data.modalASI[prop]--;
        }

        this._render();
    }
}

console.log('⬆️ [PgLevelUpManager] Modulo caricato.');
