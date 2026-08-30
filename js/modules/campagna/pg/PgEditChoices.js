/**
 * PgEditChoices.js
 * ─────────────────────────────────────────────────────────────
 * Modal per modificare le scelte permanenti di un PG esistente
 * senza dover rifare l'intero wizard di creazione.
 *
 * Funzionalità:
 *   - Apre un modal con tutte le sezioni di scelta permanenti per la classe del PG
 *   - Permette di aggiungere/rimuovere opzioni entro i limiti di livello
 *   - Salva direttamente nel dataManager (no wizard)
 *   - Reimposta il pulsante di chiusura alla conferma
 *
 * Classi gestite:
 *   - Warlock: Suppliche occulte, Arcanum Mistico, Trucchetti Patto del Tomo, Dono del Patto
 *   - Fighter/Paladin/Ranger: Stili di Combattimento
 *   - Stregone: Ascendenza Draconica, Metamagia
 *   - Bardo/Ladro: Maestria, Segreti Magici (Bardo)
 *   - Ranger: Nemico/Terreno Prescelto, Opzioni Cacciatore
 *   - Mago: Maestria degli Incantesimi
 *
 * @author DM Tool
 * @version 1.0.0
 */

import { escapeHtml } from './PgConstants.js';
import { spellLevelsByClass } from '../../../../database/classSpells.js';
import { showToast } from '../../../../utils/toast.js';
import {
    checkInvocationPrereq,
    getMaxWarlockInvocations as getMaxWarlockInvocationsShared
} from './WarlockInvocations.js';

// Abilità per Maestria
const EXPERTISE_SKILLS = [
    'Acrobazia', 'Addestrare Animali', 'Arcano', 'Atletica', 'Furtività',
    'Indagare', 'Inganno', 'Intimidire', 'Intuizione', 'Medicina',
    'Natura', 'Percezione', 'Persuasione', 'Rappresentazione', 'Religione', 'Sopravvivenza'
];

// === HELPER: limiti per livello/classe ===

function getMaxWarlockInvocations(pgLevel) {
    return getMaxWarlockInvocationsShared(pgLevel);
}

function getMaxFightingStyles(classIndex, pgLevel, subclass) {
    if (classIndex === 'fighter') {
        if (pgLevel < 1) return 0;
        return (subclass === 'Campione' && pgLevel >= 10) ? 2 : 1;
    }
    if (classIndex === 'paladin') return pgLevel >= 2 ? 1 : 0;
    if (classIndex === 'ranger')  return pgLevel >= 2 ? 1 : 0;
    return 0;
}

function getMaxMetamagics(pgLevel) {
    if (pgLevel >= 17) return 4;
    if (pgLevel >= 10) return 3;
    if (pgLevel >= 3) return 2;
    return 0;
}

function getMaxExpertise(classNameIt, pgLevel) {
    if (classNameIt === 'Bardo') {
        if (pgLevel < 3) return 0;
        return pgLevel >= 10 ? 4 : 2;
    }
    if (classNameIt === 'Ladro') {
        if (pgLevel < 1) return 0;
        return pgLevel >= 6 ? 4 : 2;
    }
    return 0;
}

function getMaxMagicalSecrets(pgLevel, subclass) {
    let total = 0;
    if (pgLevel >= 10) total += 2;
    if (pgLevel >= 14) total += 2;
    if (pgLevel >= 18) total += 2;
    if (subclass === 'Collegio della Sapienza' && pgLevel >= 6) total += 2;
    return total;
}

function getMaxFavoredEnemies(pgLevel) {
    if (pgLevel >= 14) return 3;
    if (pgLevel >= 6) return 2;
    if (pgLevel >= 1) return 1;
    return 0;
}

function getMaxFavoredTerrains(pgLevel) {
    if (pgLevel >= 10) return 3;
    if (pgLevel >= 6) return 2;
    if (pgLevel >= 1) return 1;
    return 0;
}

// === VERIFICA PREREQUISITI WARLOCK INVOCATIONS ===
// La funzione checkInvocationPrereq è importata da WarlockInvocations.js

// === RENDERING: SEZIONI ===

function renderWarlockSections(pg, selectedClass, draft) {
    const lvl = pg.level || 1;
    let html = '';

    // --- Dono del Patto ---
    const doni = selectedClass.doni_del_patto || [];
    if (doni.length > 0) {
        html += `
            <div class="warlock-section class-choice-section">
                <h4>🗡️ Dono del Patto</h4>
                <select class="form-control dragon-select" data-edit-pact-boon>
                    <option value="">-- Scegli un dono --</option>
                    ${doni.map(d => `
                        <option value="${escapeHtml(d.nome)}" ${draft.pactBoon === d.nome ? 'selected' : ''}>${escapeHtml(d.nome)}</option>
                    `).join('')}
                </select>
                ${draft.pactBoon ? `
                    <p class="choice-hint">${escapeHtml(doni.find(d => d.nome === draft.pactBoon)?.descrizione || '')}</p>
                ` : ''}
            </div>
        `;
    }

    // --- Suppliche Occulte ---
    if (lvl >= 2) {
        const suppliche = selectedClass.suppliche_occulte || [];
        const max = getMaxWarlockInvocations(lvl);
        const selected = draft.eldritchInvocations || [];

        const available = suppliche.filter(s => checkInvocationPrereq(s, pg).ok);
        const locked = suppliche.filter(s => !checkInvocationPrereq(s, pg).ok);

        html += `
            <div class="warlock-section class-choice-section">
                <div class="section-header">
                    <h4>📖 Suppliche Occulte</h4>
                    <span class="counter-badge ${selected.length > max ? 'over-limit' : selected.length === max ? 'at-limit' : ''}">
                        <strong>${selected.length}</strong> / ${max}
                    </span>
                </div>
                <p class="section-hint">Seleziona fino a <strong>${max}</strong> suppliche. Le modifiche vengono salvate al click su "Salva".</p>
                <div class="invocations-grid">
                    ${available.map(s => `
                        <label class="invocation-cb ${selected.includes(s.nome) ? 'selected' : ''}">
                            <input type="checkbox" data-edit-invocation="${escapeHtml(s.nome)}" ${selected.includes(s.nome) ? 'checked' : ''}>
                            <div class="invocation-body">
                                <strong class="inv-name">${escapeHtml(s.nome)}</strong>
                                ${s.prerequisito ? `<span class="inv-prereq ok">${escapeHtml(s.prerequisito)}</span>` : ''}
                                <p class="inv-desc">${escapeHtml(s.descrizione)}</p>
                            </div>
                        </label>
                    `).join('')}
                </div>
                ${locked.length > 0 ? `
                    <details class="locked-invocations">
                        <summary>🔒 Suppliche bloccate (${locked.length})</summary>
                        <div class="locked-list">
                            ${locked.map(s => {
                                const check = checkInvocationPrereq(s, pg);
                                return `
                                    <div class="locked-invocation">
                                        <strong>${escapeHtml(s.nome)}</strong>
                                        <span class="inv-prereq locked">${escapeHtml(check.reason)}</span>
                                        <p class="inv-desc">${escapeHtml(s.descrizione)}</p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </details>
                ` : ''}
            </div>
        `;
    }

    // --- Arcanum Mistico ---
    const arcanumLevels = [11, 13, 15, 17].filter(reqLvl => lvl >= reqLvl);
    if (arcanumLevels.length > 0) {
        const spellLvlMap = { 11: 6, 13: 7, 15: 8, 17: 9 };
        const warlockSpells = spellLevelsByClass['Warlock'] || {};
        const levelLabels = { 6: '6° Livello', 7: '7° Livello', 8: '8° Livello', 9: '9° Livello' };

        html += `
            <div class="warlock-section class-choice-section">
                <h4>✨ Arcanum Mistico</h4>
                <p class="section-hint">Ogni Arcanum può essere lanciato una volta senza slot; si recupera con riposo lungo.</p>
                <div class="arcanum-grid">
                    ${arcanumLevels.map(reqLvl => {
                        const spellLvl = spellLvlMap[reqLvl];
                        const spells = warlockSpells[spellLvl] || [];
                        const current = draft.mysticArcanum?.[spellLvl] || '';
                        return `
                            <div class="arcanum-row">
                                <label class="arcanum-label">Arcanum ${levelLabels[spellLvl]}</label>
                                <select class="form-control arcanum-select" data-edit-arcanum="${spellLvl}">
                                    <option value="">-- Scegli un incantesimo --</option>
                                    ${spells.map(s => `
                                        <option value="${escapeHtml(s)}" ${current === s ? 'selected' : ''}>${escapeHtml(s)}</option>
                                    `).join('')}
                                </select>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // --- Trucchetti Patto del Tomo ---
    if (draft.pactBoon === 'Patto del Tomo') {
        const allCantrips = new Set();
        for (const cls in spellLevelsByClass) {
            const cantrips = spellLevelsByClass[cls]?.[0] || [];
            cantrips.forEach(c => allCantrips.add(c));
        }
        const cantripsArray = Array.from(allCantrips).sort((a, b) => a.localeCompare(b, 'it'));
        const selected = draft.pactTomeCantrips || [];

        html += `
            <div class="warlock-section class-choice-section">
                <div class="section-header">
                    <h4>📕 Trucchetti del Libro delle Ombre</h4>
                    <span class="counter-badge ${selected.length > 3 ? 'over-limit' : selected.length === 3 ? 'at-limit' : ''}">
                        <strong>${selected.length}</strong> / 3
                    </span>
                </div>
                <p class="section-hint">Scegli 3 trucchetti da qualsiasi lista. Sono sempre preparati.</p>
                <div class="tome-cantrips-grid">
                    ${cantripsArray.map(c => `
                        <label class="spell-cb ${selected.includes(c) ? 'selected' : ''}">
                            <input type="checkbox" data-edit-tome-cantrip="${escapeHtml(c)}" ${selected.includes(c) ? 'checked' : ''}>
                            <span class="sk-name">${escapeHtml(c)}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    return html;
}

function renderFightingStyleSection(pg, selectedClass, draft) {
    const stili = selectedClass.stili_combattimento;
    if (!stili || stili.length === 0) return '';

    const className = selectedClass.classe || selectedClass.name;
    const max = getMaxFightingStyles(selectedClass.index, pg.level || 1, pg.subclass);
    if (max === 0) return '';

    const selected = draft.scelte_permanenti.stili_combattimento || [];

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>⚔️ Stile di Combattimento</h4>
                <span class="counter-badge ${selected.length > max ? 'over-limit' : selected.length === max ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${max}
                </span>
            </div>
            <p class="section-hint">Scegli ${max} stile/i di combattimento per ${className}.</p>
            <div class="choices-grid">
                ${stili.map(s => `
                    <label class="choice-cb ${selected.includes(s.nome) ? 'selected' : ''}">
                        <input type="checkbox" data-edit-fighting-style="${escapeHtml(s.nome)}" ${selected.includes(s.nome) ? 'checked' : ''}>
                        <div class="choice-body">
                            <strong class="choice-name">${escapeHtml(s.nome)}</strong>
                            <p class="choice-desc">${escapeHtml(s.descrizione)}</p>
                        </div>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

function renderMetamagicSection(pg, selectedClass, draft) {
    const lvl = pg.level || 1;
    if (lvl < 3) return '';
    const metamagiaCatalog = selectedClass.metamagia;
    if (!metamagiaCatalog) return '';

    const max = getMaxMetamagics(lvl);
    const selected = draft.scelte_permanenti.metamagia || [];

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>✨ Metamagia</h4>
                <span class="counter-badge ${selected.length > max ? 'over-limit' : selected.length === max ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${max}
                </span>
            </div>
            <p class="section-hint">Scegli ${max} opzioni di Metamagia.</p>
            <div class="choices-grid">
                ${Object.entries(metamagiaCatalog).map(([nome, data]) => `
                    <label class="choice-cb ${selected.includes(nome) ? 'selected' : ''}">
                        <input type="checkbox" data-edit-metamagic="${escapeHtml(nome)}" ${selected.includes(nome) ? 'checked' : ''}>
                        <div class="choice-body">
                            <strong class="choice-name">${escapeHtml(nome)}</strong>
                            <span class="inv-prereq ok">Costo: ${escapeHtml(data.costo)}</span>
                            <p class="choice-desc">${escapeHtml(data.descrizione)}</p>
                        </div>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

function renderDragonAncestrySection(pg, selectedClass, draft) {
    if (pg.subclass !== 'Lineaggio Drago') return '';
    const patronoData = (selectedClass.sottoclassi || []).find(s => s.nome === 'Lineaggio Drago');
    if (!patronoData?.dragon_types) return '';

    const selected = draft.scelte_permanenti.ascendenza_draconica || '';

    return `
        <div class="warlock-section class-choice-section">
            <h4>🐉 Ascendenza Draconica</h4>
            <p class="section-hint">Determina resistenza ai danni e tipo di danno potenziato.</p>
            <select class="form-control dragon-select" data-edit-dragon-ancestry>
                <option value="">-- Scegli un drago --</option>
                ${patronoData.dragon_types.map(d => `
                    <option value="${escapeHtml(d.nome)}" ${selected === d.nome ? 'selected' : ''}>
                        ${escapeHtml(d.nome)} (${escapeHtml(d.tipo_danno)})
                    </option>
                `).join('')}
            </select>
        </div>
    `;
}

function renderExpertiseSection(pg, selectedClass, draft) {
    const classNameIt = selectedClass.classe || selectedClass.name;
    const expected = getMaxExpertise(classNameIt, pg.level || 1);
    if (expected === 0) return '';

    const selected = draft.scelte_permanenti.maestria || [];

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>🎯 Maestria</h4>
                <span class="counter-badge ${selected.length > expected ? 'over-limit' : selected.length === expected ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${expected}
                </span>
            </div>
            <p class="section-hint">Scegli ${expected} abilità per raddoppiarne il bonus competenza.</p>
            <div class="choices-grid expertise-grid">
                ${EXPERTISE_SKILLS.map(skill => `
                    <label class="choice-cb compact ${selected.includes(skill) ? 'selected' : ''}">
                        <input type="checkbox" data-edit-expertise="${escapeHtml(skill)}" ${selected.includes(skill) ? 'checked' : ''}>
                        <span class="choice-name">${escapeHtml(skill)}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

function renderMagicalSecretsSection(pg, selectedClass, draft) {
    const classNameIt = selectedClass.classe || selectedClass.name;
    if (classNameIt !== 'Bardo') return '';

    const expected = getMaxMagicalSecrets(pg.level || 1, pg.subclass);
    if (expected === 0) return '';

    const selected = draft.scelte_permanenti.segreti_magici || [];
    const allSpells = new Set();
    for (const cls in spellLevelsByClass) {
        for (let lvl = 1; lvl <= 9; lvl++) {
            const spells = spellLevelsByClass[cls]?.[lvl] || [];
            spells.forEach(s => allSpells.add(s));
        }
    }
    const spellsArray = Array.from(allSpells).sort((a, b) => a.localeCompare(b, 'it'));

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>🔮 Segreti Magici</h4>
                <span class="counter-badge ${selected.length > expected ? 'over-limit' : selected.length === expected ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${expected}
                </span>
            </div>
            <p class="section-hint">Scegli ${expected} incantesimi da qualsiasi classe.</p>
            <div class="magical-secrets-grid">
                ${spellsArray.map(s => `
                    <label class="choice-cb compact ${selected.includes(s) ? 'selected' : ''}">
                        <input type="checkbox" data-edit-magical-secret="${escapeHtml(s)}" ${selected.includes(s) ? 'checked' : ''}>
                        <span class="choice-name">${escapeHtml(s)}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

function renderFavoredEnemySection(pg, selectedClass, draft) {
    if (!selectedClass.tipi_nemico_prescelto) return '';
    const expected = getMaxFavoredEnemies(pg.level || 1);
    if (expected === 0) return '';

    const selected = draft.scelte_permanenti.nemici_prescelti || [];

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>🎯 Nemico Prescelto</h4>
                <span class="counter-badge ${selected.length > expected ? 'over-limit' : selected.length === expected ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${expected}
                </span>
            </div>
            <p class="section-hint">Scegli ${expected} tipo/i di creatura.</p>
            <div class="choices-grid">
                ${selectedClass.tipi_nemico_prescelto.map(t => `
                    <label class="choice-cb ${selected.includes(t.nome) ? 'selected' : ''}">
                        <input type="checkbox" data-edit-favored-enemy="${escapeHtml(t.nome)}" ${selected.includes(t.nome) ? 'checked' : ''}>
                        <div class="choice-body">
                            <strong class="choice-name">${escapeHtml(t.nome)}</strong>
                            <p class="choice-desc">${escapeHtml(t.descrizione)}</p>
                        </div>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

function renderFavoredTerrainSection(pg, selectedClass, draft) {
    if (!selectedClass.tipi_terreno_prescelto) return '';
    const expected = getMaxFavoredTerrains(pg.level || 1);
    if (expected === 0) return '';

    const selected = draft.scelte_permanenti.terreni_prescelti || [];

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>🌲 Terreno Prescelto</h4>
                <span class="counter-badge ${selected.length > expected ? 'over-limit' : selected.length === expected ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${expected}
                </span>
            </div>
            <p class="section-hint">Scegli ${expected} tipo/i di terreno.</p>
            <div class="choices-grid">
                ${selectedClass.tipi_terreno_prescelto.map(t => `
                    <label class="choice-cb ${selected.includes(t.nome) ? 'selected' : ''}">
                        <input type="checkbox" data-edit-favored-terrain="${escapeHtml(t.nome)}" ${selected.includes(t.nome) ? 'checked' : ''}>
                        <div class="choice-body">
                            <strong class="choice-name">${escapeHtml(t.nome)}</strong>
                            <p class="choice-desc">${escapeHtml(t.descrizione)}</p>
                        </div>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

function renderHunterOptionsSection(pg, selectedClass, draft) {
    if (pg.subclass !== 'Cacciatore') return '';
    const cacciatore = (selectedClass.sottoclassi || []).find(s => s.nome === 'Cacciatore');
    if (!cacciatore?.opzioni_cacciatore) return '';

    const lvl = pg.level || 1;
    const levels = [
        { lvl: 3,  field: 'preda_cacciatore',  label: 'Preda del Cacciatore' },
        { lvl: 7,  field: 'difesa_cacciatore',  label: 'Difesa del Cacciatore' },
        { lvl: 15, field: 'cacciatore_supremo', label: 'Cacciatore Supremo' }
    ];

    return `
        <div class="warlock-section class-choice-section">
            <h4>🏹 Opzioni del Cacciatore</h4>
            <p class="section-hint">Scegli un'opzione per ciascun livello chiave.</p>
            ${levels.map(({ lvl: reqLvl, field, label }) => {
                const optData = cacciatore.opzioni_cacciatore[String(reqLvl)];
                const current = draft.scelte_permanenti[field] || '';
                if (lvl < reqLvl) {
                    return `
                        <div class="hunter-option-row locked">
                            <label class="arcanum-label">${label}</label>
                            <select class="form-control" disabled>
                                <option>🔒 Disponibile dal liv. ${reqLvl}</option>
                            </select>
                        </div>
                    `;
                }
                return `
                    <div class="hunter-option-row">
                        <label class="arcanum-label">${label}</label>
                        <select class="form-control hunter-select" data-edit-hunter-option="${escapeHtml(field)}">
                            <option value="">-- Scegli un'opzione --</option>
                            ${optData.opzioni.map(o => `
                                <option value="${escapeHtml(o.nome)}" ${current === o.nome ? 'selected' : ''}>${escapeHtml(o.nome)}</option>
                            `).join('')}
                        </select>
                        <p class="choice-hint">${escapeHtml(optData.opzioni.find(o => o.nome === current)?.descrizione || 'Seleziona per vedere la descrizione.')}</p>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderSpellMasterySection(pg, selectedClass, draft) {
    const lvl = pg.level || 1;
    if (lvl < 18) return '';

    const wizardSpells = spellLevelsByClass['Mago'] || {};
    const spells1 = wizardSpells[1] || [];
    const spells2 = wizardSpells[2] || [];

    return `
        <div class="warlock-section class-choice-section">
            <h4>📘 Maestria degli Incantesimi</h4>
            <p class="section-hint">Incantesimi lanciabili a volontà senza slot.</p>
            <div class="arcanum-grid">
                <div class="arcanum-row">
                    <label class="arcanum-label">Incantesimo 1° livello</label>
                    <select class="form-control arcanum-select" data-edit-spell-mastery="1">
                        <option value="">-- Scegli --</option>
                        ${spells1.map(s => `
                            <option value="${escapeHtml(s)}" ${draft.scelte_permanenti.maestria_incantesimi_1 === s ? 'selected' : ''}>${escapeHtml(s)}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="arcanum-row">
                    <label class="arcanum-label">Incantesimo 2° livello</label>
                    <select class="form-control arcanum-select" data-edit-spell-mastery="2">
                        <option value="">-- Scegli --</option>
                        ${spells2.map(s => `
                            <option value="${escapeHtml(s)}" ${draft.scelte_permanenti.maestria_incantesimi_2 === s ? 'selected' : ''}>${escapeHtml(s)}</option>
                        `).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;
}

// === ENTRY POINT: renderizza l'intero modal ===

/**
 * Renderizza il modal completo di modifica scelte permanenti.
 * @param {Object} pg - PG corrente
 * @param {Object} selectedClass - Dati classe
 * @param {Object} draft - Stato draft (copia di pg con modifiche non salvate)
 * @returns {string} HTML del modal
 */
export function renderChoicesEditorModal(pg, selectedClass, draft) {
    if (!selectedClass) {
        return `
            <div class="choices-editor-modal">
                <div class="choices-editor-content">
                    <div class="choices-editor-header">
                        <h3>⚙️ Modifica Scelte</h3>
                        <button class="btn btn-secondary btn-sm" data-close-choices-editor>✕</button>
                    </div>
                    <p>Classe non trovata.</p>
                </div>
            </div>
        `;
    }

    const className = selectedClass.classe || selectedClass.name;
    let sectionsHtml = '';

    // === Dispatch in base alla classe ===
    if (selectedClass.index === 'warlock') {
        sectionsHtml = renderWarlockSections(pg, selectedClass, draft);
    } else {
        switch (selectedClass.index) {
            case 'barbarian':
                sectionsHtml = `
                    <div class="warlock-section class-choice-section">
                        <h4>⚔️ Barbaro</h4>
                        <p class="section-hint">Il Barbaro non ha scelte permanenti specifiche da modificare (solo sottoclasse nel wizard).</p>
                    </div>
                `;
                break;
            case 'bard':
                sectionsHtml += renderExpertiseSection(pg, selectedClass, draft);
                sectionsHtml += renderMagicalSecretsSection(pg, selectedClass, draft);
                break;
            case 'cleric':
                sectionsHtml = `
                    <div class="warlock-section class-choice-section">
                        <h4>📜 Incantesimi di Dominio</h4>
                        <p class="section-hint">Aggiunti automaticamente in base al dominio. Non modificabili qui.</p>
                    </div>
                `;
                break;
            case 'druid':
                sectionsHtml = `
                    <div class="warlock-section class-choice-section">
                        <h4>🌿 Forma Selvatica</h4>
                        <p class="section-hint">Il Druido non ha scelte permanenti specifiche da modificare (solo Circolo nel wizard).</p>
                    </div>
                `;
                break;
            case 'fighter':
                sectionsHtml = renderFightingStyleSection(pg, selectedClass, draft);
                break;
            case 'monk':
                sectionsHtml = `
                    <div class="warlock-section class-choice-section">
                        <h4>👊 Monaco</h4>
                        <p class="section-hint">Il Monaco non ha scelte permanenti specifiche da modificare (solo Tradizione nel wizard).</p>
                    </div>
                `;
                break;
            case 'paladin':
                sectionsHtml = renderFightingStyleSection(pg, selectedClass, draft);
                break;
            case 'ranger':
                sectionsHtml = renderFavoredEnemySection(pg, selectedClass, draft);
                sectionsHtml += renderFavoredTerrainSection(pg, selectedClass, draft);
                sectionsHtml += renderFightingStyleSection(pg, selectedClass, draft);
                sectionsHtml += renderHunterOptionsSection(pg, selectedClass, draft);
                break;
            case 'rogue':
                sectionsHtml = renderExpertiseSection(pg, selectedClass, draft);
                break;
            case 'sorcerer':
                sectionsHtml = renderDragonAncestrySection(pg, selectedClass, draft);
                sectionsHtml += renderMetamagicSection(pg, selectedClass, draft);
                break;
            case 'wizard':
                sectionsHtml = renderSpellMasterySection(pg, selectedClass, draft);
                break;
        }
    }

    return `
        <div class="choices-editor-modal" id="choices-editor-modal">
            <div class="choices-editor-content">
                <div class="choices-editor-header">
                    <h3>⚙️ Modifica Scelte — ${escapeHtml(className)}</h3>
                    <button class="btn btn-secondary btn-sm" data-close-choices-editor title="Chiudi senza salvare">✕</button>
                </div>
                <div class="choices-editor-body">
                    <div class="warlock-info-banner">
                        <p><strong>${escapeHtml(pg.name || 'PG')}</strong> · Liv. ${pg.level || 1} · Sottoclasse: ${escapeHtml(pg.subclass || '—')}</p>
                        <p class="section-hint">Le modifiche sono salvate solo al click su "Salva Modifiche".</p>
                    </div>
                    ${sectionsHtml}
                </div>
                <div class="choices-editor-footer">
                    <button class="btn btn-secondary" data-close-choices-editor>Annulla</button>
                    <button class="btn btn-primary" data-save-choices-editor>💾 Salva Modifiche</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Crea uno stato draft iniziale copiando le scelte permanenti dal PG.
 * @param {Object} pg
 * @returns {Object} Draft
 */
export function createChoicesDraft(pg) {
    return {
        pactBoon: pg.pactBoon || '',
        eldritchInvocations: [...(pg.eldritchInvocations || [])],
        mysticArcanum: { ...(pg.mysticArcanum || {}) },
        pactTomeCantrips: [...(pg.pactTomeCantrips || [])],
        scelte_permanenti: {
            stili_combattimento: [...(pg.scelte_permanenti?.stili_combattimento || [])],
            metamagia: [...(pg.scelte_permanenti?.metamagia || [])],
            ascendenza_draconica: pg.scelte_permanenti?.ascendenza_draconica || '',
            maestria: [...(pg.scelte_permanenti?.maestria || [])],
            segreti_magici: [...(pg.scelte_permanenti?.segreti_magici || [])],
            nemici_prescelti: [...(pg.scelte_permanenti?.nemici_prescelti || [])],
            terreni_prescelti: [...(pg.scelte_permanenti?.terreni_prescelti || [])],
            preda_cacciatore: pg.scelte_permanenti?.preda_cacciatore || '',
            difesa_cacciatore: pg.scelte_permanenti?.difesa_cacciatore || '',
            cacciatore_supremo: pg.scelte_permanenti?.cacciatore_supremo || '',
            maestria_incantesimi_1: pg.scelte_permanenti?.maestria_incantesimi_1 || '',
            maestria_incantesimi_2: pg.scelte_permanenti?.maestria_incantesimi_2 || ''
        }
    };
}

/**
 * Converte il draft in updates da passare al dataManager.
 * @param {Object} draft
 * @returns {Object} Updates
 */
export function draftToUpdates(draft) {
    const updates = {
        pactBoon: draft.pactBoon || '',
        eldritchInvocations: draft.eldritchInvocations || [],
        mysticArcanum: draft.mysticArcanum || {},
        pactTomeCantrips: draft.pactTomeCantrips || [],
        scelte_permanenti: draft.scelte_permanenti
    };
    return updates;
}

console.log('⚙️ [PgEditChoices] Modulo caricato v1.0.0');
