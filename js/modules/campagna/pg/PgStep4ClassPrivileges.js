/**
 * PgStep4ClassPrivileges.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza lo Step 4 del wizard: Privilegi di Classe.
 *
 * Contenuto:
 *   1. Tabella di progressione PHB-style (righe 1 → livello corrente)
 *   2. Selettore Sottoclasse (Patrono per Warlock)
 *   3. Selettore Dono del Patto (Warlock liv. 3+)
 *   4. Mostra privilegi della sottoclasse con descrizioni
 *   5. Mostra privilegi di classe con descrizioni
 *
 * @author DM Tool
 * @version 1.0.0
 */

import { escapeHtml, getSubclassMinLevel } from './PgConstants.js';

// ============================================================================
// RENDERING: TABELLA PROGRESSIONE PHB-STYLE
// ============================================================================

/**
 * Renderizza la tabella di progressione della classe in stile PHB.
 * Mostra tutte le righe da 1 fino al livello corrente del PG.
 * Le righe oltre il livello corrente sono mostrate in collasso (locked).
 *
 * @param {Object} classData - Dati della classe
 * @param {number} pgLevel - Livello attuale del PG
 * @returns {string} HTML della tabella
 */
function renderClassProgressionTable(classData, pgLevel) {
    if (!classData?.tabella_progressione) return '';

    const table = classData.tabella_progressione;
    const className = classData.classe || classData.name || 'Classe';

    // Determina quali colonne extra mostrare in base alla classe
    const extraColumns = getClassSpecificColumns(classData);

    return `
        <div class="class-progression-section">
            <h4>📊 Tabella di Progressione — ${escapeHtml(className)}</h4>
            <p class="section-hint">
                Mostra i privilegi guadagnati a ciascun livello. Le righe evidenziate sono già acquisite (fino al liv. ${pgLevel}).
            </p>
            <div class="table-wrapper">
                <table class="progression-table-phb">
                    <thead>
                        <tr>
                            <th>Liv.</th>
                            <th>Bonus</th>
                            ${extraColumns.map(c => `<th>${c.label}</th>`).join('')}
                            <th>Privilegi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${table.map(row => {
                            const isAcquired = row.livello <= pgLevel;
                            const isCurrent = row.livello === pgLevel;
                            return `
                                <tr class="${isCurrent ? 'current-level' : isAcquired ? 'acquired' : 'locked'}">
                                    <td class="lvl-cell">${row.livello}</td>
                                    <td class="prof-cell">+${row.bonus_competenza}</td>
                                    ${extraColumns.map(c => `
                                        <td>${row[c.key] !== undefined && row[c.key] !== 0 ? row[c.key] : '—'}</td>
                                    `).join('')}
                                    <td class="features-cell">
                                        ${(row.privilegi || []).map(p => `
                                            <span class="priv-tag" title="${escapeHtml(getClassFeatureDescription(classData, p))}">${escapeHtml(p)}</span>
                                        `).join(' ')}
                                        ${(row.privilegi || []).length === 0 ? '<span class="no-feature">—</span>' : ''}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Ottiene le colonne extra specifiche per classe da mostrare nella tabella.
 * Mappa il nome della classe alle sue colonne specifiche (es. Ira per Barbaro, Ki per Monaco).
 */
function getClassSpecificColumns(classData) {
    const index = classData?.index;
    const columns = [];
    switch (index) {
        case 'barbarian':
            columns.push({ key: 'ire', label: 'Ira' });
            columns.push({ key: 'danno_ira', label: 'Danni Ira' });
            break;
        case 'bard':
            columns.push({ key: 'ispirazione_dado', label: 'Ispirazione' });
            columns.push({ key: 'canto_riposo_dado', label: 'Canto Riposo' });
            columns.push({ key: 'incantesimi_conosciuti', label: 'Inc. Conosc.' });
            break;
        case 'cleric':
            columns.push({ key: 'incantesimi_preparati', label: 'Inc. Prep.' });
            break;
        case 'druid':
            columns.push({ key: 'incantesimi_preparati', label: 'Inc. Prep.' });
            break;
        case 'fighter':
            // Fighter ha solo ASI extra (nessuna colonna specifica)
            break;
        case 'monk':
            columns.push({ key: 'arti_marziali', label: 'Arti Marz.' });
            columns.push({ key: 'ki', label: 'Ki' });
            columns.push({ key: 'movimento_senza_armatura', label: 'Movimento' });
            break;
        case 'paladin':
            columns.push({ key: 'punti_paladino', label: 'Punti Pal.' });
            columns.push({ key: 'incantesimi_preparati', label: 'Inc. Prep.' });
            break;
        case 'ranger':
            columns.push({ key: 'bersaglio_favorito', label: 'Bers. Fav.' });
            columns.push({ key: 'nemico_prescelto', label: 'Nemico Pres.' });
            columns.push({ key: 'incantesimi_conosciuti', label: 'Inc. Conosc.' });
            break;
        case 'rogue':
            columns.push({ key: 'attacco_furtivo', label: 'Att. Furtivo' });
            break;
        case 'sorcerer':
            columns.push({ key: 'punti_stregoneria', label: 'Punti Streg.' });
            columns.push({ key: 'incantesimi_meta', label: 'Inc. Meta.' });
            columns.push({ key: 'incantesimi_conosciuti', label: 'Inc. Conosc.' });
            break;
        case 'warlock':
            columns.push({ key: 'slot_incantesimo', label: 'Slot' });
            columns.push({ key: 'livello_slot', label: 'Liv. Slot' });
            columns.push({ key: 'suppliche_conosciute', label: 'Suppliche' });
            columns.push({ key: 'incantesimi_conosciuti', label: 'Inc. Conosc.' });
            break;
        case 'wizard':
            columns.push({ key: 'incantesimi_conosciuti', label: 'Inc. Conosc.' });
            break;
    }
    // Aggiungi sempre trucchetti e slot incantesimo se presenti
    if (classData?.tabella_progressione?.[0]?.trucchetti_conosciuti !== undefined) {
        columns.unshift({ key: 'trucchetti_conosciuti', label: 'Trucchetti' });
    }
    return columns;
}

/**
 * Ottiene la descrizione di un privilegio di classe dal database.
 */
function getClassFeatureDescription(classData, featureName) {
    const desc = classData?.descrizione_privilegi?.[featureName];
    if (!desc) return featureName;
    if (typeof desc === 'string') return desc;
    return desc.descrizione_completa || desc.riassunto || featureName;
}

// ============================================================================
// RENDERING: SELETTORI SOTTOCLASSE E DONO DEL PATTO
// ============================================================================

/**
 * Renderizza il selettore della sottoclasse con controllo livello.
 */
function renderSubclassSelect(pgData, selectedClass) {
    if (!selectedClass) {
        return `
            <select id="pg-subclass" class="form-control" disabled>
                <option value="">-- Seleziona prima una classe --</option>
            </select>
        `;
    }

    const subclassOptions = selectedClass.sottoclassi || selectedClass.subclasses || [];
    if (subclassOptions.length === 0) {
        return `
            <select id="pg-subclass" class="form-control" disabled>
                <option value="">-- Nessuna sottoclasse disponibile --</option>
            </select>
        `;
    }

    const currentLevel = pgData.level || 1;
    const minLevel = getSubclassMinLevel(selectedClass);
    const isWarlock = selectedClass.index === 'warlock';
    const subclassLabel = isWarlock ? 'Patrono Ultraterreno' : 'Sottoclasse';

    if (currentLevel < minLevel) {
        return `
            <div class="subclass-locked">
                <select id="pg-subclass" class="form-control" disabled>
                    <option value="">🔒 ${subclassLabel} disponibile dal Liv. ${minLevel}</option>
                </select>
                <span class="subclass-hint">Attualmente al Liv. ${currentLevel}</span>
            </div>
        `;
    }

    return `
        <select id="pg-subclass" class="form-control">
            <option value="">-- Scegli ${isWarlock ? 'un patrono' : 'una sottoclasse'} --</option>
            ${subclassOptions.map(s => `
                <option value="${s.nome}" ${pgData.subclass === s.nome ? 'selected' : ''}>${escapeHtml(s.nome)}</option>
            `).join('')}
        </select>
    `;
}

/**
 * Renderizza il selettore del Dono del Patto (solo Warlock).
 */
function renderPactBoonSelect(pgData, selectedClass) {
    if (!selectedClass || selectedClass.index !== 'warlock') return '';

    const doni = selectedClass.doni_del_patto;
    if (!doni || doni.length === 0) return '';

    const currentLevel = pgData.level || 1;

    if (currentLevel < 3) {
        return `
            <div class="pact-boon-locked">
                <select id="pg-pact-boon" class="form-control" disabled>
                    <option value="">🔒 Disponibile dal Liv. 3</option>
                </select>
                <span class="subclass-hint">Attualmente al Liv. ${currentLevel}</span>
            </div>
        `;
    }

    return `
        <select id="pg-pact-boon" class="form-control">
            <option value="">-- Scegli un dono --</option>
            ${doni.map(d => `
                <option value="${d.nome}" ${pgData.pactBoon === d.nome ? 'selected' : ''}>${escapeHtml(d.nome)}</option>
            `).join('')}
        </select>
    `;
}

// ============================================================================
// RENDERING: DETTAGLI SOTTOCLASSE
// ============================================================================

/**
 * Renderizza i dettagli della sottoclasse selezionata (privilegi fino al livello corrente).
 */
function renderSubclassDetails(pgData, selectedClass) {
    if (!selectedClass || !pgData.subclass) return '';

    const subclassData = (selectedClass.sottoclassi || []).find(s => s.nome === pgData.subclass);
    if (!subclassData) return '';

    const pgLevel = pgData.level || 1;
    let html = `
        <div class="subclass-details-section">
            <h4>🌟 ${escapeHtml(subclassData.nome)}</h4>
            <p class="subclass-desc">${escapeHtml(subclassData.descrizione || '')}</p>
    `;

    // Mostra privilegi della sottoclasse fino al livello corrente
    if (subclassData.privilegi) {
        const privEntries = Object.entries(subclassData.privilegi)
            .map(([lvl, data]) => ({ lvl: parseInt(lvl), data }))
            .sort((a, b) => a.lvl - b.lvl);

        for (const { lvl, data } of privEntries) {
            if (lvl > pgLevel) continue; // Solo privilegi già acquisiti
            const isAcquired = lvl <= pgLevel;
            const nome = Array.isArray(data) ? data.map(d => d.nome).join(', ') : (data.nome || `Liv. ${lvl}`);
            const desc = Array.isArray(data)
                ? data.map(d => d.descrizione).join('\n\n')
                : (data.descrizione || '');

            html += `
                <div class="subclass-feature-block ${isAcquired ? 'acquired' : 'locked'}">
                    <div class="feature-header">
                        <span class="level-badge">Liv. ${lvl}</span>
                        <strong>${escapeHtml(nome)}</strong>
                    </div>
                    <p class="feature-desc">${escapeHtml(desc)}</p>
                </div>
            `;
        }
    }

    // Mostra incantesimi ampliati del patrono (warlock)
    if (subclassData.patron_spells) {
        html += `
            <div class="patron-spells-block">
                <h5>📜 Incantesimi Ampliati</h5>
                <p class="section-hint">Aggiunti automaticamente alla lista incantesimi. Sono sempre conosciuti e non conteggiati nel limite.</p>
        `;
        for (const [spellLvl, spells] of Object.entries(subclassData.patron_spells)) {
            const accessibleAt = getMinLevelForSpellLevel(parseInt(spellLvl), selectedClass.index);
            const isAccessible = pgLevel >= accessibleAt;
            html += `
                <div class="patron-spell-row ${isAccessible ? '' : 'locked'}">
                    <span class="spell-level">${spellLvl}°:</span>
                    <span class="spell-list">${spells.map(escapeHtml).join(', ')}</span>
                    ${!isAccessible ? `<span class="locked-lvl">(dal liv. ${accessibleAt})</span>` : ''}
                </div>
            `;
        }
        html += `</div>`;
    }

    // Mostra incantesimi di dominio/giuramento (cleric/paladin)
    if (subclassData.incantesimi_di_dominio || subclassData.incantesimi_di_giuramento) {
        const domainSpells = subclassData.incantesimi_di_dominio || subclassData.incantesimi_di_giuramento;
        html += `
            <div class="patron-spells-block">
                <h5>📜 Incantesimi di ${selectedClass.index === 'cleric' ? 'Dominio' : 'Giuramento'}</h5>
                <p class="section-hint">Aggiunti automaticamente e sempre preparati.</p>
        `;
        for (const [reqLvl, spells] of Object.entries(domainSpells)) {
            const isAccessible = pgLevel >= parseInt(reqLvl);
            html += `
                <div class="patron-spell-row ${isAccessible ? '' : 'locked'}">
                    <span class="spell-level">Liv. ${reqLvl}:</span>
                    <span class="spell-list">${spells.map(escapeHtml).join(', ')}</span>
                    ${!isAccessible ? `<span class="locked-lvl">(bloccato)</span>` : ''}
                </div>
            `;
        }
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

/**
 * Ottiene il livello minimo PG per accedere a un dato livello di incantesimo.
 */
function getMinLevelForSpellLevel(spellLevel, classIndex) {
    if (classIndex === 'warlock') {
        // Warlock: 1°=1, 2°=3, 3°=5, 4°=7, 5°=9
        return { 1: 1, 2: 3, 3: 5, 4: 7, 5: 9 }[spellLevel] || 1;
    }
    // Full casters: 1°=1, 2°=3, 3°=5, 4°=7, 5°=9
    return { 1: 1, 2: 3, 3: 5, 4: 7, 5: 9 }[spellLevel] || 1;
}

// ============================================================================
// RENDERING: DONO DEL PATTO DETTAGLI
// ============================================================================

function renderPactBoonDetails(pgData, selectedClass) {
    if (!pgData.pactBoon || !selectedClass?.doni_del_patto) return '';

    const dono = selectedClass.doni_del_patto.find(d => d.nome === pgData.pactBoon);
    if (!dono) return '';

    return `
        <div class="pact-boon-details-section">
            <h4>🗡️ ${escapeHtml(dono.nome)}</h4>
            <p class="pact-boon-desc">${escapeHtml(dono.descrizione || '')}</p>
        </div>
    `;
}

// ============================================================================
// RENDERING: LISTA PRIVILEGI DI CLASSE ACQUISITI
// ============================================================================

function renderClassFeaturesList(pgData, selectedClass) {
    if (!selectedClass?.tabella_progressione) return '';

    const pgLevel = pgData.level || 1;
    const table = selectedClass.tabella_progressione;

    // Raccogli tutti i privilegi unici acquisiti fino al livello corrente
    const acquiredFeatures = new Map(); // nome -> livello di acquisizione
    for (let i = 0; i < Math.min(pgLevel, table.length); i++) {
        const row = table[i];
        if (row.privilegi) {
            for (const priv of row.privilegi) {
                if (!acquiredFeatures.has(priv)) {
                    acquiredFeatures.set(priv, row.livello);
                }
            }
        }
    }

    if (acquiredFeatures.size === 0) return '';

    let html = `
        <div class="class-features-list-section">
            <h4>✨ Privilegi di Classe Acquisiti</h4>
            <div class="features-list">
    `;

    for (const [featureName, lvl] of acquiredFeatures) {
        const desc = getClassFeatureDescription(selectedClass, featureName);
        html += `
            <div class="feature-item">
                <div class="feature-header">
                    <span class="level-badge">Liv. ${lvl}</span>
                    <strong>${escapeHtml(featureName)}</strong>
                </div>
                <p class="feature-desc">${escapeHtml(desc)}</p>
            </div>
        `;
    }

    html += `</div></div>`;
    return html;
}

// ============================================================================
// ENTRY POINT
// ============================================================================

/**
 * Renderizza lo Step 4: Privilegi di Classe
 * @param {Object} pgData - Dati del personaggio
 * @param {Object} databases - Database con classe selezionata
 * @returns {string} HTML dello step
 */
export function renderStep4ClassPrivileges(pgData, databases) {
    const { selectedClass } = databases;

    if (!selectedClass) {
        return `
            <div class="wizard-form">
                <div class="info-box">
                    <h4>⚠️ Classe non selezionata</h4>
                    <p>Torna allo <strong>Step 1</strong> per selezionare una classe.</p>
                </div>
            </div>
        `;
    }

    const className = selectedClass.classe || selectedClass.name;
    const isWarlock = selectedClass.index === 'warlock';

    return `
        <div class="wizard-form">
            <div class="form-section">
                <h3>⚔️ Privilegi di Classe — ${escapeHtml(className)}</h3>
                <p class="step-intro">
                    Configura le scelte specifiche della tua classe e visualizza i privilegi acquisiti fino al livello ${pgData.level || 1}.
                </p>

                <!-- 1. TABELLA PROGRESSIONE -->
                ${renderClassProgressionTable(selectedClass, pgData.level || 1)}

                <!-- 2. SOTTOCLASSE / PATRONO -->
                <div class="subclass-select-section">
                    <h4>${isWarlock ? '🔮 Patrono Ultraterreno' : '🌟 Sottoclasse'}</h4>
                    <p class="section-hint">
                        ${isWarlock
                            ? 'Scegli il patrono ultraterreno con cui hai stretto il patto. Determina incantesimi ampliati e privilegi ai livelli 1, 6, 10, 14.'
                            : 'Scegli la specializzazione della tua classe. Determina privilegi aggiuntivi ai livelli chiave.'
                        }
                    </p>
                    ${renderSubclassSelect(pgData, selectedClass)}
                </div>

                <!-- 3. DONO DEL PATTO (solo Warlock) -->
                ${isWarlock ? `
                    <div class="pact-boon-select-section">
                        <h4>🗡️ Dono del Patto</h4>
                        <p class="section-hint">
                            Scegli uno dei tre doni: Patto della Catena (famiglio), Patto della Lama (arma magica), Patto del Tomo (libro dei trucchetti).
                        </p>
                        ${renderPactBoonSelect(pgData, selectedClass)}
                    </div>
                ` : ''}

                <!-- 4. DETTAGLI SOTTOCLASSE -->
                ${renderSubclassDetails(pgData, selectedClass)}

                <!-- 5. DETTAGLI DONO DEL PATTO -->
                ${renderPactBoonDetails(pgData, selectedClass)}

                <!-- 6. PRIVILEGI DI CLASSE ACQUISITI -->
                ${renderClassFeaturesList(pgData, selectedClass)}
            </div>
        </div>
    `;
}

console.log('📋 [PgStep4ClassPrivileges] Modulo caricato v1.0.0');
