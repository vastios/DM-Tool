/**
 * PgStep4ClassChoices.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza le sezioni specifiche delle classi (NON Warlock, che ha il suo modulo).
 *
 * Classi gestite:
 *   - Barbaro:  solo sottoclasse (gestita in Step 1, niente qui)
 *   - Bardo:    Maestria (liv.3 +2, liv.10 +2), Segreti Magici (liv.6 Sapienza, liv.10/14/18)
 *   - Chierico: Incantesimi di Dominio (auto-aggiunti, read-only)
 *   - Druido:   Forma Selvatica info (read-only)
 *   - Guerriero: Stile di Combattimento (liv.1), +1 al liv.10 se Campione
 *   - Monaco:   info Ki/Arti Marziali (read-only, già in tabella progressione)
 *   - Paladino: Stile di Combattimento (liv.2), Incantesimi di Giuramento (auto)
 *   - Ranger:   Nemico Prescelto (liv.1, +1 liv.6/14), Terreno Prescelto (liv.1, +1 liv.6/10),
 *               Stile di Combattimento (liv.2), opzioni Cacciatore (liv.3/7/15 se sottoclasse Cacciatore)
 *   - Ladro:    Maestria (liv.1 +2, liv.6 +2)
 *   - Stregone: Ascendenza Draconica (liv.1 se Lineaggio Drago), Metamagia (liv.3 +2, liv.10 +1, liv.17 +1)
 *   - Mago:     Maestria degli Incantesimi (liv.18: 1° + 2° livello)
 *
 * @author DM Tool
 * @version 1.0.0
 */

import { escapeHtml } from './PgConstants.js';
import { spellLevelsByClass } from '../../../../database/classSpells.js';

// Abilità selezionabili per Maestria (Expertise)
const EXPERTISE_SKILLS = [
    'Acrobazia', 'Addestrare Animali', 'Arcano', 'Atletica', 'Furtività',
    'Indagare', 'Inganno', 'Intimidire', 'Intuizione', 'Medicina',
    'Natura', 'Percezione', 'Persuasione', 'Rappresentazione', 'Religione', 'Sopravvivenza'
];

/**
 * Helper: quante Maestrie dovrebbe avere il PG in base a classe e livello.
 */
function getExpectedExpertise(className, pgLevel) {
    if (className === 'Bardo') {
        // 2 al liv.3, +2 al liv.10 → totale 4 al liv.10+
        if (pgLevel < 3) return 0;
        return pgLevel >= 10 ? 4 : 2;
    }
    if (className === 'Ladro') {
        // 2 al liv.1, +2 al liv.6 → totale 4 al liv.6+
        if (pgLevel < 1) return 0;
        return pgLevel >= 6 ? 4 : 2;
    }
    return 0;
}

/**
 * Helper: quanti Segreti Magici dovrebbe avere il Bardo.
 */
function getExpectedMagicalSecrets(pgLevel, subclass) {
    let total = 0;
    if (pgLevel >= 10) total += 2;
    if (pgLevel >= 14) total += 2;
    if (pgLevel >= 18) total += 2;
    // Sapienza: 2 extra al liv.6
    if (subclass === 'Collegio della Sapienza' && pgLevel >= 6) total += 2;
    return total;
}

/**
 * Helper: quanti Stili di Combattimento dovrebbe avere il PG.
 */
function getExpectedFightingStyles(className, pgLevel, subclass) {
    let base = 0;
    if (className === 'Guerriero') {
        if (pgLevel >= 1) base = 1;
        // Campione: +1 al liv.10
        if (subclass === 'Campione' && pgLevel >= 10) base = 2;
    } else if (className === 'Paladino') {
        if (pgLevel >= 2) base = 1;
    } else if (className === 'Ranger') {
        if (pgLevel >= 2) base = 1;
    }
    return base;
}

/**
 * Helper: quanti Nemici Prescelti dovrebbe avere il Ranger.
 */
function getExpectedFavoredEnemies(pgLevel) {
    if (pgLevel >= 14) return 3;
    if (pgLevel >= 6) return 2;
    if (pgLevel >= 1) return 1;
    return 0;
}

/**
 * Helper: quanti Terreni Prescelti dovrebbe avere il Ranger.
 */
function getExpectedFavoredTerrains(pgLevel) {
    if (pgLevel >= 10) return 3;
    if (pgLevel >= 6) return 2;
    if (pgLevel >= 1) return 1;
    return 0;
}

/**
 * Helper: quante Metamagie dovrebbe avere lo Stregone.
 */
function getExpectedMetamagics(pgLevel) {
    if (pgLevel >= 17) return 4;
    if (pgLevel >= 10) return 3;
    if (pgLevel >= 3) return 2;
    return 0;
}

// ============================================================================
// RENDERING
// ============================================================================

/**
 * Sezione: Stile di Combattimento (Fighter, Paladin, Ranger).
 */
function renderFightingStyleSection(pgData, selectedClass) {
    const stili = selectedClass.stili_combattimento;
    if (!stili || stili.length === 0) return '';

    const className = selectedClass.classe || selectedClass.name;
    const pgLevel = pgData.level || 1;
    const expected = getExpectedFightingStyles(className, pgLevel, pgData.subclass);

    if (expected === 0) {
        // Verifica livello minimo richiesto
        const minLvl = className === 'Guerriero' ? 1 : 2;
        if (pgLevel < minLvl) {
            return `
                <div class="warlock-section class-choice-section locked">
                    <h4>⚔️ Stile di Combattimento</h4>
                    <p class="locked-msg">🔒 Disponibile dal livello ${minLvl}.</p>
                </div>
            `;
        }
    }

    const selected = (pgData.scelte_permanenti?.stili_combattimento) || [];
    const isComplete = selected.length === expected;
    const isOver = selected.length > expected;

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>⚔️ Stile di Combattimento</h4>
                <span class="counter-badge ${isOver ? 'over-limit' : isComplete ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${expected}
                </span>
            </div>
            <p class="section-hint">
                Scegli <strong>${expected}</strong> stile${expected > 1 ? 'i' : ''} di combattimento.
                ${expected === 2 ? '<em>(il secondo deriva dal privilegio Campione al liv.10)</em>' : ''}
            </p>
            ${isOver ? `<div class="level-warning">⚠️ Superato il limite di ${expected}!</div>` : ''}

            <div class="choices-grid">
                ${stili.map(s => {
                    const isSelected = selected.includes(s.nome);
                    return `
                        <label class="choice-cb ${isSelected ? 'selected' : ''}">
                            <input type="checkbox" data-fighting-style="${escapeHtml(s.nome)}"
                                   ${isSelected ? 'checked' : ''}>
                            <div class="choice-body">
                                <strong class="choice-name">${escapeHtml(s.nome)}</strong>
                                <p class="choice-desc">${escapeHtml(s.descrizione)}</p>
                            </div>
                        </label>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Sezione: Ascendenza Draconica (Stregone Lineaggio Drago).
 */
function renderDragonAncestrySection(pgData, selectedClass) {
    if (pgData.subclass !== 'Lineaggio Drago') return '';

    const patronoData = (selectedClass.sottoclassi || []).find(s => s.nome === 'Lineaggio Drago');
    if (!patronoData?.dragon_types) return '';

    const selected = pgData.scelte_permanenti?.ascendenza_draconica || '';

    return `
        <div class="warlock-section class-choice-section">
            <h4>🐉 Ascendenza Draconica</h4>
            <p class="section-hint">
                Scegli il tipo di drago da cui discendi. Determina resistenza ai danni e tipo di danno potenziato.
            </p>
            <select class="form-control dragon-select" data-dragon-ancestry>
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

/**
 * Sezione: Metamagia (Stregone).
 */
function renderMetamagicSection(pgData, selectedClass) {
    const pgLevel = pgData.level || 1;
    if (pgLevel < 3) {
        return `
            <div class="warlock-section class-choice-section locked">
                <h4>✨ Metamagia</h4>
                <p class="locked-msg">🔒 Disponibile dal livello 3.</p>
            </div>
        `;
    }

    const metamagiaCatalog = selectedClass.metamagia;
    if (!metamagiaCatalog) return '';

    const expected = getExpectedMetamagics(pgLevel);
    const selected = (pgData.scelte_permanenti?.metamagia) || [];
    const isComplete = selected.length === expected;
    const isOver = selected.length > expected;

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>✨ Metamagia</h4>
                <span class="counter-badge ${isOver ? 'over-limit' : isComplete ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${expected}
                </span>
            </div>
            <p class="section-hint">
                Scegli <strong>${expected}</strong> opzioni di Metamagia per modificare i tuoi incantesimi
                spendendo Punti Stregoneria.
            </p>
            ${isOver ? `<div class="level-warning">⚠️ Superato il limite di ${expected}!</div>` : ''}

            <div class="choices-grid">
                ${Object.entries(metamagiaCatalog).map(([nome, data]) => {
                    const isSelected = selected.includes(nome);
                    return `
                        <label class="choice-cb ${isSelected ? 'selected' : ''}">
                            <input type="checkbox" data-metamagic="${escapeHtml(nome)}"
                                   ${isSelected ? 'checked' : ''}>
                            <div class="choice-body">
                                <strong class="choice-name">${escapeHtml(nome)}</strong>
                                <span class="inv-prereq ok">Costo: ${escapeHtml(data.costo)}</span>
                                <p class="choice-desc">${escapeHtml(data.descrizione)}</p>
                            </div>
                        </label>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Sezione: Maestria (Bardo, Ladro).
 */
function renderExpertiseSection(pgData, selectedClass) {
    const className = selectedClass.classe || selectedClass.name;
    const pgLevel = pgData.level || 1;
    const expected = getExpectedExpertise(className, pgLevel);
    if (expected === 0) return '';

    const minLvl = className === 'Bardo' ? 3 : 1;
    if (pgLevel < minLvl) {
        return `
            <div class="warlock-section class-choice-section locked">
                <h4>🎯 Maestria</h4>
                <p class="locked-msg">🔒 Disponibile dal livello ${minLvl}.</p>
            </div>
        `;
    }

    const selected = (pgData.scelte_permanenti?.maestria) || [];
    const isComplete = selected.length === expected;
    const isOver = selected.length > expected;

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>🎯 Maestria</h4>
                <span class="counter-badge ${isOver ? 'over-limit' : isComplete ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${expected}
                </span>
            </div>
            <p class="section-hint">
                Scegli <strong>${expected}</strong> abilità (o strumenti da ladro) in cui hai competenza:
                il tuo bonus di competenza viene raddoppiato per queste scelte.
            </p>
            ${isOver ? `<div class="level-warning">⚠️ Superato il limite di ${expected}!</div>` : ''}

            <div class="choices-grid expertise-grid">
                ${EXPERTISE_SKILLS.map(skill => {
                    const isSelected = selected.includes(skill);
                    return `
                        <label class="choice-cb compact ${isSelected ? 'selected' : ''}">
                            <input type="checkbox" data-expertise="${escapeHtml(skill)}"
                                   ${isSelected ? 'checked' : ''}>
                            <span class="choice-name">${escapeHtml(skill)}</span>
                        </label>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Sezione: Segreti Magici (Bardo).
 */
function renderMagicalSecretsSection(pgData, selectedClass) {
    const className = selectedClass.classe || selectedClass.name;
    if (className !== 'Bardo') return '';

    const pgLevel = pgData.level || 1;
    const expected = getExpectedMagicalSecrets(pgLevel, pgData.subclass);
    if (expected === 0) {
        return `
            <div class="warlock-section class-choice-section locked">
                <h4>🔮 Segreti Magici</h4>
                <p class="locked-msg">🔒 Disponibili dal livello 10 (o 6 con Collegio della Sapienza).</p>
            </div>
        `;
    }

    const selected = (pgData.scelte_permanenti?.segreti_magici) || [];
    const isComplete = selected.length === expected;
    const isOver = selected.length > expected;

    // Mostra tutti gli incantesimi di qualsiasi classe (esclusi trucchetti)
    const allSpells = [];
    for (const cls in spellLevelsByClass) {
        for (let lvl = 1; lvl <= 9; lvl++) {
            const spells = spellLevelsByClass[cls]?.[lvl] || [];
            spells.forEach(s => {
                if (!allSpells.find(x => x.name === s)) {
                    allSpells.push({ name: s, level: lvl });
                }
            });
        }
    }
    allSpells.sort((a, b) => a.name.localeCompare(b.name, 'it'));

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>🔮 Segreti Magici</h4>
                <span class="counter-badge ${isOver ? 'over-limit' : isComplete ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${expected}
                </span>
            </div>
            <p class="section-hint">
                Scegli <strong>${expected}</strong> incantesimi da qualsiasi classe. Sono sempre considerati conosciuti e non
                conteggiati nel tuo limite di incantesimi conosciuti.
            </p>
            ${isOver ? `<div class="level-warning">⚠️ Superato il limite di ${expected}!</div>` : ''}

            <div class="magical-secrets-grid">
                ${allSpells.map(s => {
                    const isSelected = selected.includes(s.name);
                    return `
                        <label class="choice-cb compact ${isSelected ? 'selected' : ''}" title="${escapeHtml(s.name)} — ${s.level}° livello">
                            <input type="checkbox" data-magical-secret="${escapeHtml(s.name)}"
                                   ${isSelected ? 'checked' : ''}>
                            <span class="choice-name">${escapeHtml(s.name)}</span>
                            <span class="spell-lvl-mini">${s.level}°</span>
                        </label>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Sezione: Nemico Prescelto (Ranger).
 */
function renderFavoredEnemySection(pgData, selectedClass) {
    if (!selectedClass.tipi_nemico_prescelto) return '';

    const pgLevel = pgData.level || 1;
    if (pgLevel < 1) return '';

    const expected = getExpectedFavoredEnemies(pgLevel);
    const selected = (pgData.scelte_permanenti?.nemici_prescelti) || [];
    const isComplete = selected.length === expected;
    const isOver = selected.length > expected;

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>🎯 Nemico Prescelto</h4>
                <span class="counter-badge ${isOver ? 'over-limit' : isComplete ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${expected}
                </span>
            </div>
            <p class="section-hint">
                Scegli <strong>${expected}</strong> tipo/i di creatura. Hai vantaggio sui tiri di Sopravvivenza
                per traccearle e su Indagare per ricordare informazioni su di esse. Impari anche una lingua del nemico.
            </p>
            ${isOver ? `<div class="level-warning">⚠️ Superato il limite di ${expected}!</div>` : ''}

            <div class="choices-grid">
                ${selectedClass.tipi_nemico_prescelto.map(t => {
                    const isSelected = selected.includes(t.nome);
                    return `
                        <label class="choice-cb ${isSelected ? 'selected' : ''}">
                            <input type="checkbox" data-favored-enemy="${escapeHtml(t.nome)}"
                                   ${isSelected ? 'checked' : ''}>
                            <div class="choice-body">
                                <strong class="choice-name">${escapeHtml(t.nome)}</strong>
                                <p class="choice-desc">${escapeHtml(t.descrizione)}</p>
                            </div>
                        </label>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Sezione: Terreno Prescelto (Ranger).
 */
function renderFavoredTerrainSection(pgData, selectedClass) {
    if (!selectedClass.tipi_terreno_prescelto) return '';

    const pgLevel = pgData.level || 1;
    if (pgLevel < 1) return '';

    const expected = getExpectedFavoredTerrains(pgLevel);
    const selected = (pgData.scelte_permanenti?.terreni_prescelti) || [];
    const isComplete = selected.length === expected;
    const isOver = selected.length > expected;

    return `
        <div class="warlock-section class-choice-section">
            <div class="section-header">
                <h4>🌲 Terreno Prescelto</h4>
                <span class="counter-badge ${isOver ? 'over-limit' : isComplete ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${expected}
                </span>
            </div>
            <p class="section-hint">
                Scegli <strong>${expected}</strong> tipo/i di terreno. In quel terreno: non puoi essere smarrito,
                hai vantaggio alle prove di Intelligenza e Saggezza, e puoi muoverti furtivamente a velocità normale.
            </p>
            ${isOver ? `<div class="level-warning">⚠️ Superato il limite di ${expected}!</div>` : ''}

            <div class="choices-grid">
                ${selectedClass.tipi_terreno_prescelto.map(t => {
                    const isSelected = selected.includes(t.nome);
                    return `
                        <label class="choice-cb ${isSelected ? 'selected' : ''}">
                            <input type="checkbox" data-favored-terrain="${escapeHtml(t.nome)}"
                                   ${isSelected ? 'checked' : ''}>
                            <div class="choice-body">
                                <strong class="choice-name">${escapeHtml(t.nome)}</strong>
                                <p class="choice-desc">${escapeHtml(t.descrizione)}</p>
                            </div>
                        </label>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Sezione: Opzioni Cacciatore (Ranger sottoclasse Cacciatore, scelta singola a liv. 3/7/15).
 */
function renderHunterOptionsSection(pgData, selectedClass) {
    if (pgData.subclass !== 'Cacciatore') return '';

    const cacciatore = (selectedClass.sottoclassi || []).find(s => s.nome === 'Cacciatore');
    if (!cacciatore?.opzioni_cacciatore) return '';

    const pgLevel = pgData.level || 1;
    const scelte = pgData.scelte_permanenti || {};

    const levels = [
        { lvl: 3,  field: 'preda_cacciatore',  label: 'Preda del Cacciatore' },
        { lvl: 7,  field: 'difesa_cacciatore',  label: 'Difesa del Cacciatore' },
        { lvl: 15, field: 'cacciatore_supremo', label: 'Cacciatore Supremo' }
    ];

    return `
        <div class="warlock-section class-choice-section">
            <h4>🏹 Opzioni del Cacciatore</h4>
            <p class="section-hint">
                Scegli un'opzione per ciascuno dei livelli chiave del Cacciatore (3, 7, 15).
            </p>
            ${levels.map(({ lvl, field, label }) => {
                const optData = cacciatore.opzioni_cacciatore[String(lvl)];
                const current = scelte[field] || '';
                if (pgLevel < lvl) {
                    return `
                        <div class="hunter-option-row locked">
                            <label class="arcanum-label">${label}</label>
                            <select class="form-control" disabled>
                                <option>🔒 Disponibile dal liv. ${lvl}</option>
                            </select>
                        </div>
                    `;
                }
                return `
                    <div class="hunter-option-row">
                        <label class="arcanum-label">${label}</label>
                        <select class="form-control hunter-select" data-hunter-option="${escapeHtml(field)}">
                            <option value="">-- Scegli un'opzione --</option>
                            ${optData.opzioni.map(o => `
                                <option value="${escapeHtml(o.nome)}" ${current === o.nome ? 'selected' : ''}>
                                    ${escapeHtml(o.nome)}
                                </option>
                            `).join('')}
                        </select>
                        <p class="choice-hint">${escapeHtml(optData.opzioni.find(o => o.nome === current)?.descrizione || 'Seleziona per vedere la descrizione.')}</p>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

/**
 * Sezione: Incantesimi di Dominio (Chierico) — read-only, auto-aggiunti.
 */
function renderDomainSpellsSection(pgData, selectedClass) {
    if (!pgData.subclass) return '';
    const dominio = (selectedClass.sottoclassi || []).find(s => s.nome === pgData.subclass);
    if (!dominio?.incantesimi_di_dominio) return '';

    const pgLevel = pgData.level || 1;
    // Domain spells sono a liv. 1/3/5/7/9 per chierico, liv. 3/5/9/13/17 per paladino
    const accessMap = (selectedClass.index === 'cleric')
        ? { 1: 1, 3: 3, 5: 5, 7: 7, 9: 9 }
        : { 3: 3, 5: 5, 9: 9, 13: 13, 17: 17 };

    const accessible = [];
    const locked = [];
    for (const [reqLvl, spellLvl] of Object.entries(accessMap)) {
        if (pgLevel >= parseInt(reqLvl)) {
            accessible.push({ spellLvl, spells: dominio.incantesimi_di_dominio[reqLvl] || [] });
        } else {
            locked.push({ reqLvl: parseInt(reqLvl), spells: dominio.incantesimi_di_dominio[reqLvl] || [] });
        }
    }

    return `
        <div class="warlock-section class-choice-section patron-expanded-spells">
            <h4>📜 Incantesimi di ${selectedClass.index === 'cleric' ? 'Dominio' : 'Giuramento'}</h4>
            <p class="section-hint">
                Aggiunti automaticamente alla tua lista incantesimi. Sono sempre preparati e non conteggiati nel limite.
                ${selectedClass.index === 'cleric' ? 'Dominio' : 'Giuramento'}: <strong>${escapeHtml(pgData.subclass)}</strong>
            </p>
            <div class="patron-spells-list">
                ${accessible.map(({ spellLvl, spells }) => `
                    <div class="patron-spell-row">
                        <span class="spell-level">${spellLvl}°:</span>
                        <span class="spell-list">${spells.map(escapeHtml).join(', ')}</span>
                    </div>
                `).join('')}
                ${locked.length > 0 ? `
                    <div class="locked-levels">
                        ${locked.map(({ reqLvl }) => `<span class="locked-lvl">🔒 Liv. ${reqLvl}</span>`).join(' ')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Sezione: Maestria degli Incantesimi (Mago liv.18).
 */
function renderSpellMasterySection(pgData, selectedClass) {
    const pgLevel = pgData.level || 1;
    if (pgLevel < 18) {
        return `
            <div class="warlock-section class-choice-section locked">
                <h4>📘 Maestria degli Incantesimi</h4>
                <p class="locked-msg">🔒 Disponibile dal livello 18.</p>
            </div>
        `;
    }

    const wizardSpells = spellLevelsByClass['Mago'] || {};
    const spells1 = wizardSpells[1] || [];
    const spells2 = wizardSpells[2] || [];
    const scelte = pgData.scelte_permanenti || {};

    return `
        <div class="warlock-section class-choice-section">
            <h4>📘 Maestria degli Incantesimi</h4>
            <p class="section-hint">
                Scegli un incantesimo di 1° livello e uno di 2° livello dal tuo grimorio.
                Puoi lanciarli a volontà senza spendere slot incantesimo.
            </p>
            <div class="arcanum-grid">
                <div class="arcanum-row">
                    <label class="arcanum-label">Incantesimo 1° livello</label>
                    <select class="form-control arcanum-select" data-spell-mastery="1">
                        <option value="">-- Scegli --</option>
                        ${spells1.map(s => `
                            <option value="${escapeHtml(s)}" ${scelte.maestria_incantesimi_1 === s ? 'selected' : ''}>${escapeHtml(s)}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="arcanum-row">
                    <label class="arcanum-label">Incantesimo 2° livello</label>
                    <select class="form-control arcanum-select" data-spell-mastery="2">
                        <option value="">-- Scegli --</option>
                        ${spells2.map(s => `
                            <option value="${escapeHtml(s)}" ${scelte.maestria_incantesimi_2 === s ? 'selected' : ''}>${escapeHtml(s)}</option>
                        `).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// ENTRY POINT
// ============================================================================

/**
 * Renderizza tutte le sezioni specifiche della classe (NON Warlock).
 * @param {Object} pgData
 * @param {Object} databases
 * @returns {string} HTML o stringa vuota se non applicabile
 */
export function renderClassChoicesStep4Sections(pgData, databases) {
    const { selectedClass } = databases;
    if (!selectedClass || selectedClass.index === 'warlock') return '';

    const className = selectedClass.classe || selectedClass.name;
    const pgLevel = pgData.level || 1;

    let html = '<div class="warlock-step4-container class-choices-container">';

    // Header informativo
    html += `
        <div class="warlock-info-banner">
            <h3>⚔️ Scelte di Classe — ${escapeHtml(className)}</h3>
            <p>
                Livello: <strong>${pgLevel}</strong> ·
                Sottoclasse: <strong>${escapeHtml(pgData.subclass || '— non scelta —')}</strong>
            </p>
        </div>
    `;

    // Dispatch in base alla classe
    switch (selectedClass.index) {
        case 'barbarian':
            // Nessuna scelta attiva (solo sottoclasse in Step 1)
            html += `
                <div class="warlock-section class-choice-section">
                    <h4>⚔️ Barbaro</h4>
                    <p class="section-hint">Nessuna scelta specifica oltre alla sottoclasse (Step 1) e ai privilegi automatici.</p>
                    <p class="section-hint"> Risorse: <strong>Ira</strong> (${pgLevel >= 20 ? 'illimitata' : Math.ceil(pgLevel / 4) + 1} usi/riposo lungo), <strong>Danno Ira</strong> +${pgLevel >= 16 ? 4 : pgLevel >= 9 ? 3 : 2}.</p>
                </div>
            `;
            break;

        case 'bard':
            html += renderExpertiseSection(pgData, selectedClass);
            html += renderMagicalSecretsSection(pgData, selectedClass);
            break;

        case 'cleric':
            html += renderDomainSpellsSection(pgData, selectedClass);
            break;

        case 'druid':
            html += `
                <div class="warlock-section class-choice-section">
                    <h4>🌿 Forma Selvatica</h4>
                    <p class="section-hint">
                        Puoi trasformarti in una bestia di GS ${pgLevel >= 8 ? '1 (con nuoto/volo)' : pgLevel >= 4 ? '1/2 (con nuoto)' : '1/4'}.
                        Usi: <strong>2 per riposo breve</strong>. Durata: fino a mezz'ora per GS.
                    </p>
                </div>
            `;
            break;

        case 'fighter':
            html += renderFightingStyleSection(pgData, selectedClass);
            break;

        case 'monk':
            html += `
                <div class="warlock-section class-choice-section">
                    <h4>👊 Arti Marziali</h4>
                    <p class="section-hint">
                        Dado Arti Marziali: <strong>${pgLevel >= 17 ? '1d10' : pgLevel >= 11 ? '1d8' : pgLevel >= 5 ? '1d6' : '1d4'}</strong> ·
                        Punti Ki: <strong>${pgLevel}</strong> ·
                        Movimento senza armatura: <strong>+${pgLevel >= 18 ? 9 : pgLevel >= 14 ? 7.5 : pgLevel >= 10 ? 6 : pgLevel >= 6 ? 4.5 : 3}m</strong>
                    </p>
                </div>
            `;
            break;

        case 'paladin':
            html += renderFightingStyleSection(pgData, selectedClass);
            html += renderDomainSpellsSection(pgData, selectedClass);
            break;

        case 'ranger':
            html += renderFavoredEnemySection(pgData, selectedClass);
            html += renderFavoredTerrainSection(pgData, selectedClass);
            html += renderFightingStyleSection(pgData, selectedClass);
            html += renderHunterOptionsSection(pgData, selectedClass);
            break;

        case 'rogue':
            html += renderExpertiseSection(pgData, selectedClass);
            html += `
                <div class="warlock-section class-choice-section">
                    <h4>🗡️ Attacco Furtivo</h4>
                    <p class="section-hint">
                        Danno Attacco Furtivo: <strong>${Math.ceil(pgLevel / 2)}d6</strong> una volta per turno
                        con vantaggio o con alleato vicino al bersaglio.
                    </p>
                </div>
            `;
            break;

        case 'sorcerer':
            html += renderDragonAncestrySection(pgData, selectedClass);
            html += renderMetamagicSection(pgData, selectedClass);
            break;

        case 'wizard':
            html += renderSpellMasterySection(pgData, selectedClass);
            break;

        default:
            // classe non gestita
            break;
    }

    html += '</div>';
    return html;
}

console.log('📋 [PgStep4ClassChoices] Modulo caricato v1.0.0');
