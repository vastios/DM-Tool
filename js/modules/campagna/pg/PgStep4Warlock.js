/**
 * PgStep4Warlock.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza le sezioni specifiche Warlock da iniettare nello Step 4.
 *
 * Contiene:
 *   1. Incantesimi ampliati del patrono (auto-aggiunti, read-only)
 *   2. Suppliche Occulte (Eldritch Invocations) — selezionabili con prerequisiti
 *   3. Arcanum Mistico — selezione incantesimi di 6°/7°/8°/9° livello
 *   4. Trucchetti bonus del Patto del Tomo (se pactBoon === "Patto del Tomo")
 *
 * @author DM Tool
 * @version 1.0.0
 */

import { escapeHtml } from './PgConstants.js';
import { spellLevelsByClass } from '../../../../database/classSpells.js';
import {
    checkInvocationPrereq,
    getMaxWarlockInvocations
} from './WarlockInvocations.js';

/**
 * @deprecated Usare checkInvocationPrereq da WarlockInvocations.js
 * Wrapper per retrocompatibilità con il codice esistente in questo file.
 */
function checkInvocationPrereqLocal(supplica, pgData) {
    return checkInvocationPrereq(supplica, pgData);
}

/**
 * @deprecated Usare getMaxWarlockInvocations da WarlockInvocations.js
 */
function getMaxInvocations(pgLevel) {
    return getMaxWarlockInvocations(pgLevel);
}


/**
 * Ottiene la lista di tutti i trucchetti di qualsiasi classe (per Patto del Tomo).
 * @returns {Array<string>}
 */
function getAllCantripsForPactTome() {
    const all = new Set();
    for (const className in spellLevelsByClass) {
        const cantrips = spellLevelsByClass[className]?.[0];
        if (Array.isArray(cantrips)) {
            cantrips.forEach(c => all.add(c));
        }
    }
    return Array.from(all).sort((a, b) => a.localeCompare(b, 'it'));
}

/**
 * Ottiene gli incantesimi warlock di un dato livello (per Arcanum).
 * @param {number} spellLevel - 6, 7, 8 o 9
 * @returns {Array<string>}
 */
function getWarlockSpellsByLevel(spellLevel) {
    return spellLevelsByClass['Warlock']?.[spellLevel] || [];
}

/**
 * Renderizza la sezione "Incantesimi ampliati del patrono" (read-only).
 * @param {Object} patronoData - Oggetto patrono da warlock.sottoclassi
 * @param {number} pgLevel
 * @returns {string}
 */
function renderPatronExpandedSpells(patronoData, pgLevel) {
    if (!patronoData?.patron_spells) return '';

    // Determina quali livelli sono accessibili in base al livello PG
    // Warlock: liv. 1-2 → 1°, 3-4 → 2°, 5-6 → 3°, 7-8 → 4°, 9+ → 5°
    const maxLvlAccessible = pgLevel >= 9 ? 5 :
                              pgLevel >= 7 ? 4 :
                              pgLevel >= 5 ? 3 :
                              pgLevel >= 3 ? 2 : 1;

    const rows = Object.entries(patronoData.patron_spells)
        .filter(([lvl]) => parseInt(lvl) <= maxLvlAccessible)
        .map(([lvl, spells]) => `
            <div class="patron-spell-row">
                <span class="spell-level">${lvl}°:</span>
                <span class="spell-list">${spells.map(escapeHtml).join(', ')}</span>
            </div>
        `).join('');

    const lockedRows = Object.entries(patronoData.patron_spells)
        .filter(([lvl]) => parseInt(lvl) > maxLvlAccessible)
        .map(([lvl]) => `<span class="locked-lvl">🔒 ${lvl}° (dal liv. ${lvl === '2' ? 3 : lvl === '3' ? 5 : lvl === '4' ? 7 : 9})</span>`)
        .join(' ');

    return `
        <div class="warlock-section patron-expanded-spells">
            <h4>📜 Incantesimi Ampliati del Patrono</h4>
            <p class="section-hint">
                Aggiunti automaticamente alla tua lista incantesimi. Non conteggiati nel limite di incantesimi conosciuti.
                Patrono: <strong>${escapeHtml(patronoData.nome)}</strong>
            </p>
            <div class="patron-spells-list">
                ${rows}
                ${lockedRows ? `<div class="locked-levels">${lockedRows}</div>` : ''}
            </div>
        </div>
    `;
}

/**
 * Renderizza la sezione "Suppliche Occulte" (Eldritch Invocations).
 * @param {Object} pgData
 * @param {Object} warlockClass - Dati della classe warlock
 * @returns {string}
 */
function renderEldritchInvocations(pgData, warlockClass) {
    const suppliche = warlockClass.suppliche_occulte || [];
    const pgLevel = pgData.level || 1;
    const maxInvocations = getMaxInvocations(pgLevel);
    const selected = pgData.eldritchInvocations || [];

    // Se livello troppo basso
    if (pgLevel < 2) {
        return `
            <div class="warlock-section eldritch-invocations locked">
                <h4>📖 Suppliche Occulte</h4>
                <p class="locked-msg">🔒 Disponibili dal livello 2.</p>
            </div>
        `;
    }

    // Dividi suppliche in "disponibili" e "bloccate per prerequisiti"
    const available = [];
    const locked = [];
    suppliche.forEach(s => {
        const check = checkInvocationPrereq(s, pgData);
        if (check.ok) available.push(s);
        else locked.push({ supplica: s, reason: check.reason });
    });

    const isOver = selected.length > maxInvocations;
    const isAtLimit = selected.length === maxInvocations;

    return `
        <div class="warlock-section eldritch-invocations">
            <div class="section-header">
                <h4>📖 Suppliche Occulte</h4>
                <span class="counter-badge ${isOver ? 'over-limit' : isAtLimit ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${maxInvocations}
                </span>
            </div>
            <p class="section-hint">
                Facoltà mistiche perpetue. Scegline <strong>${maxInvocations}</strong> tra quelle disponibili.
                Le opzioni bloccate richiedono prerequisiti specifici (patrono/dono/livello).
            </p>
            ${isOver ? `<div class="level-warning">⚠️ Supplimeto superato di ${selected.length - maxInvocations}!</div>` : ''}

            <div class="invocations-grid">
                ${available.map(s => `
                    <label class="invocation-cb ${selected.includes(s.nome) ? 'selected' : ''}">
                        <input type="checkbox" data-invocation="${escapeHtml(s.nome)}" 
                               ${selected.includes(s.nome) ? 'checked' : ''}>
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
                        ${locked.map(({ supplica: s, reason }) => `
                            <div class="locked-invocation">
                                <strong>${escapeHtml(s.nome)}</strong>
                                <span class="inv-prereq locked">${escapeHtml(reason)}</span>
                                <p class="inv-desc">${escapeHtml(s.descrizione)}</p>
                            </div>
                        `).join('')}
                    </div>
                </details>
            ` : ''}
        </div>
    `;
}

/**
 * Renderizza la sezione "Arcanum Mistico".
 * @param {Object} pgData
 * @returns {string}
 */
function renderMysticArcanum(pgData) {
    const pgLevel = pgData.level || 1;
    const arcanum = pgData.mysticArcanum || {};

    // Tabella livelli arcanum: 11→6°, 13→7°, 15→8°, 17→9°
    const arcanumLevels = [
        { spellLevel: 6, minPgLevel: 11, label: '6° Livello' },
        { spellLevel: 7, minPgLevel: 13, label: '7° Livello' },
        { spellLevel: 8, minPgLevel: 15, label: '8° Livello' },
        { spellLevel: 9, minPgLevel: 17, label: '9° Livello' }
    ];

    const unlocked = arcanumLevels.filter(a => pgLevel >= a.minPgLevel);
    const locked = arcanumLevels.filter(a => pgLevel < a.minPgLevel);

    if (unlocked.length === 0) {
        return `
            <div class="warlock-section mystic-arcanum locked">
                <h4>✨ Arcanum Mistico</h4>
                <p class="locked-msg">🔒 Disponibile dall'11° livello (6° livello incantesimo).</p>
            </div>
        `;
    }

    return `
        <div class="warlock-section mystic-arcanum">
            <h4>✨ Arcanum Mistico</h4>
            <p class="section-hint">
                Segreto magico rivelato dal tuo patrono. Ogni Arcanum può essere lanciato <strong>una volta</strong>
                senza spendere slot; si recupera con un riposo lungo.
            </p>
            <div class="arcanum-grid">
                ${unlocked.map(a => {
                    const spells = getWarlockSpellsByLevel(a.spellLevel);
                    const current = arcanum[a.spellLevel] || '';
                    return `
                        <div class="arcanum-row">
                            <label class="arcanum-label">Arcanum ${a.label}</label>
                            <select class="form-control arcanum-select" data-arcanum="${a.spellLevel}">
                                <option value="">-- Scegli un incantesimo --</option>
                                ${spells.map(s => `
                                    <option value="${escapeHtml(s)}" ${current === s ? 'selected' : ''}>${escapeHtml(s)}</option>
                                `).join('')}
                            </select>
                        </div>
                    `;
                }).join('')}
            </div>
            ${locked.length > 0 ? `
                <div class="locked-arcanum">
                    ${locked.map(a => `<span class="locked-lvl">🔒 ${a.label} (dal liv. ${a.minPgLevel})</span>`).join(' ')}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Renderizza la sezione "Trucchetti del Patto del Tomo" (solo se dono = Patto del Tomo).
 * @param {Object} pgData
 * @returns {string}
 */
function renderPactTomeCantrips(pgData) {
    if (pgData.pactBoon !== 'Patto del Tomo') return '';

    const selected = pgData.pactTomeCantrips || [];
    const allCantrips = getAllCantripsForPactTome();
    const maxCantrips = 3;
    const isOver = selected.length > maxCantrips;
    const isAtLimit = selected.length === maxCantrips;

    return `
        <div class="warlock-section pact-tome-cantrips">
            <div class="section-header">
                <h4>📕 Trucchetti del Libro delle Ombre</h4>
                <span class="counter-badge ${isOver ? 'over-limit' : isAtLimit ? 'at-limit' : ''}">
                    <strong>${selected.length}</strong> / ${maxCantrips}
                </span>
            </div>
            <p class="section-hint">
                Scegli <strong>3 trucchetti</strong> da qualsiasi lista di incantesimi. Sono sempre preparati
                e non conteggiati tra i tuoi trucchetti da warlock.
            </p>
            ${isOver ? `<div class="level-warning">⚠️ Superato il limite di ${maxCantrips}!</div>` : ''}

            <div class="tome-cantrips-grid">
                ${allCantrips.map(c => `
                    <label class="spell-cb ${selected.includes(c) ? 'selected' : ''}">
                        <input type="checkbox" data-tome-cantrip="${escapeHtml(c)}" 
                               ${selected.includes(c) ? 'checked' : ''}>
                        <span class="sk-name">${escapeHtml(c)}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Entry point: renderizza tutte le sezioni warlock da iniettare nello Step 4.
 * @param {Object} pgData
 * @param {Object} databases
 * @returns {string} HTML delle sezioni, o stringa vuota se non è un warlock
 */
export function renderWarlockStep4Sections(pgData, databases) {
    const { selectedClass } = databases;
    if (!selectedClass || selectedClass.index !== 'warlock') return '';

    const pgLevel = pgData.level || 1;
    const patronoData = (selectedClass.sottoclassi || []).find(
        s => s.nome === pgData.subclass
    );

    let html = '<div class="warlock-step4-container">';

    // Header warlock
    html += `
        <div class="warlock-info-banner">
            <h3>🔮 Magia del Patto (Warlock)</h3>
            <p>
                Patrono: <strong>${escapeHtml(pgData.subclass || '— non scelto —')}</strong> ·
                Dono del Patto: <strong>${escapeHtml(pgData.pactBoon || '— non scelto —')}</strong>
            </p>
            ${(!pgData.subclass || (pgLevel >= 3 && !pgData.pactBoon)) ? `
                <p class="warn">
                    ⚠️ Torna allo <strong>Step 1</strong> per ${!pgData.subclass ? 'scegliere il patrono' : 'scegliere il dono del patto'}.
                </p>
            ` : ''}
        </div>
    `;

    // 1. Incantesimi ampliati del patrono
    if (patronoData) {
        html += renderPatronExpandedSpells(patronoData, pgLevel);
    }

    // 2. Suppliche occulte (da liv. 2)
    html += renderEldritchInvocations(pgData, selectedClass);

    // 3. Arcanum mistico (da liv. 11)
    html += renderMysticArcanum(pgData);

    // 4. Trucchetti del Patto del Tomo (solo se dono = Patto del Tomo)
    html += renderPactTomeCantrips(pgData);

    html += '</div>';
    return html;
}

console.log('📋 [PgStep4Warlock] Modulo caricato v1.0.0');
