// js/modules/compendio/classList.js
import { classDatabase } from '../../../database/classDatabase.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';

// --- FUNZIONI HELPER ---
function formatArray(arr) {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return 'Nessuna';
    return arr.join(', ');
}

function formatSavingThrows(savingThrowsArray) {
    if (!savingThrowsArray || !Array.isArray(savingThrowsArray)) return 'Nessuno';
    return savingThrowsArray.map(st => st.name).join(', ');
}

function formatProficiencyChoices(choices) {
    if (!choices || !Array.isArray(choices)) return '';
    
    return choices.map(choice => {
        const numChoices = choice.choose || 0;
        const options = choice.from?.options || [];
        const skillNames = options
            .map(opt => (opt.item?.name || '').replace('Abilità: ', ''))
            .filter(name => name);
        
        return `<p class="choice-text"><em>Scegli ${numChoices} tra: ${skillNames.join(', ')}</em></p>`;
    }).join('');
}

function formatEquipment(equipment) {
    if (!equipment || !Array.isArray(equipment)) return '<p><em>Nessuno.</em></p>';
    return equipment.map(eq => `<li>${escapeHtml(String(eq))}</li>`).join('');
}

function formatHitPoints(pf) {
    if (!pf) return '';
    return `
        <div class="details-section">
            <h3>❤️ Punti Ferita</h3>
            <div class="hp-info">
                <p><strong>Dado Vita:</strong> ${escapeHtml(String(pf.dado_vita || ''))}</p>
                <p><strong>1° Livello:</strong> ${escapeHtml(String(pf.pf_livello_1 || ''))}</p>
                <p><strong>Livelli Successivi:</strong> ${escapeHtml(String(pf.pf_livelli_successivi || ''))}</p>
            </div>
        </div>
    `;
}

function formatSpellcasting(incantazione, classIndex) {
    if (!incantazione) return '';
    
    // Non mostrare sezione per classi senza incantesimi
    const nonCasterClasses = ['barbarian', 'fighter', 'monk', 'rogue'];
    if (nonCasterClasses.includes(classIndex)) return '';
    
    // Mappatura nomi campi -> etichette italiane (con varianti)
    const fieldMappings = {
        'caratteristica_da_incantatore': { label: 'Caratteristica da Incantatore', variants: ['caratteristica_da_incantatore', 'caratteristica_da_incantatore', 'caratteristica_da_incantatore'] },
        'caratteristica_da_incantatore': { label: 'Caratteristica da Incantatore', variants: ['caratteristica_da_incantatore', 'caratteristica_da_incantatore', 'caratteristica_da_incantatore'] },
        'cd_tiro_salvezza': { label: 'CD Tiro Salvezza', variants: ['cd_tiro_salvezza', 'cd_tiro_salvezza', 'cd_tiro_salvezza', 'cd_tiro_salvezza'] },
        'modificatore_attacco': { label: 'Modificatore Attacco', variants: ['modificatore_attacco', 'modificatore_attacco', 'modificatore_attacco'] },
        'focus_incantamento': { label: 'Focus Incantamento', variants: ['focus_incantamento', 'focus_incantamento', 'focus_incantamento', 'focus_incantamento'] },
        'focus_da_incantatore': { label: 'Focus Incantamento', variants: ['focus_da_incantatore', 'focus_da_incantatore'] },
        'preparazione_incantesimi': { label: 'Preparazione Incantesimi', variants: ['preparazione_incantesimi', 'preparazione_incantesimi'] },
        'rituali': { label: 'Incantesimi Rituali', variants: ['rituali', 'rituali'] }
    };
    
    // Ordine preferito dei campi
    const fieldOrder = [
        'caratteristica_da_incantatore',
        'caratteristica_da_incantatore',
        'cd_tiro_salvezza',
        'cd_tiro_salvezza',
        'modificatore_attacco',
        'modificatore_attacco',
        'focus_incantamento',
        'focus_da_incantatore',
        'preparazione_incantesimi',
        'rituali'
    ];
    
    // Trova il valore per un campo, cercando tra le varianti
    function findValue(key) {
        if (incantazione[key] !== undefined) return incantazione[key];
        const mapping = fieldMappings[key];
        if (mapping && mapping.variants) {
            for (const variant of mapping.variants) {
                if (incantazione[variant] !== undefined) return incantazione[variant];
            }
        }
        return null;
    }
    
    // Genera righe ordinando per fieldOrder
    const processedKeys = new Set();
    const fields = fieldOrder
        .filter(key => {
            if (processedKeys.has(key)) return false;
            const value = findValue(key);
            if (value !== null) {
                processedKeys.add(key);
                return true;
            }
            return false;
        })
        .map(key => {
            const value = findValue(key);
            const mapping = fieldMappings[key];
            let displayValue = value;
            // Formatta booleani
            if (typeof value === 'boolean') {
                displayValue = value ? 'Sì' : 'No';
            }
            const label = mapping ? mapping.label : key.replace(/_/g, ' ');
            return `<p><strong>${label}:</strong> ${escapeHtml(String(displayValue))}</p>`;
        })
        .join('');
    
    if (!fields) return '';
    
    return `
        <div class="details-section">
            <h3>🔮 Proprietà Incantatore</h3>
            <div class="spellcasting-info">
                ${fields}
            </div>
        </div>
    `;
}

// === TABELLA PROGRESSIONE CLASSE ===
// Mostra: Livello, Bonus, Privilegi + colonne specifiche della classe
function formatProgressionTable(tabella, classIndex) {
    if (!tabella || !Array.isArray(tabella)) return '<p>Nessuna tabella di progressione.</p>';
    
    // Colonne specifiche per classe (da mostrare nella tabella progressione)
    // Rimosse colonne vuote secondo indicazioni utente
    const classSpecificColumns = {
        'barbarian': ['ire', 'danno_ira'],
        'bard': [], // Rimosse Ispirazione e Canto Riposo (vuote)
        'rogue': ['attacco_furtivo'],
        'monk': ['arti_marziali', 'ki', 'movimento_senza_armatura'],
        'sorcerer': ['punti_stregoneria'], // Rimosso Inc. Meta (vuota)
        'warlock': [], // Solo Livello, Bonus, Privilegi
        'paladin': [], // Rimossi Punti Pal. e Inc. Prep. (vuote)
        'ranger': [], // Rimossi Bers. Fav. e Nemico Pres. (vuote)
        'fighter': [],
        'cleric': [], // Rimosso Inc. Prep. (vuoto)
        'druid': [], // Rimosso Inc. Prep. (vuoto)
        'wizard': [] // Rimossi Inc. Conosc. e Inc. Prep.
    };
    
    // Mappatura nomi colonne per visualizzazione
    const columnNames = {
        'ire': 'Ira',
        'danno_ira': 'Danni Ira',
        'ispirazione_dado': 'Ispirazione',
        'canto_riposo_dado': 'Canto Riposo',
        'attacco_furtivo': 'Att. Furtivo',
        'arti_marziali': 'Arti Marziali',
        'ki': 'Punti Ki',
        'movimento_senza_armatura': 'Movimento',
        'punti_stregoneria': 'Punti Streg.',
        'incantesimi_meta': 'Inc. Meta.',
        'slot_incantesimo': 'Slot',
        'livello_slot': 'Liv. Slot',
        'suppliche_conosciute': 'Suppliche',
        'punti_paladino': 'Punti Pal.',
        'incantesimi_preparati': 'Inc. Prep.',
        'bersaglio_favorito': 'Bers. Fav.',
        'nemico_prescelto': 'Nemico Pres.',
        'incantesimi_conosciuti': 'Inc. Conosc.'
    };
    
    // Determina quali colonne extra mostrare per questa classe
    const extraColumns = classSpecificColumns[classIndex] || [];
    
    // Genera header colonne extra
    const extraHeaders = extraColumns.map(key => 
        `<th>${columnNames[key] || key.replace(/_/g, ' ')}</th>`
    ).join('');
    
    // Genera righe
    const rows = tabella.map(row => {
        const extraCells = extraColumns.map(key => 
            `<td>${row[key] !== undefined ? row[key] : '—'}</td>`
        ).join('');
        
        const privilegi = row.privilegi || [];
        const privilegiText = privilegi.length > 0 
            ? privilegi.map(p => `<span class="priv-tag">${escapeHtml(String(p))}</span>`).join(' ')
            : '—';
        
        return `
            <tr>
                <td>${row.livello}</td>
                <td>+${row.bonus_competenza}</td>
                ${extraCells}
                <td class="priv-cell">${privilegiText}</td>
            </tr>
        `;
    }).join('');
    
    return `
        <table class="progression-table">
            <thead>
                <tr>
                    <th>Liv.</th>
                    <th>Bonus</th>
                    ${extraHeaders}
                    <th>Privilegi</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}

// === TABELLA INCANTESIMI STANDARD ===
// Per Bardo, Chierico, Druido, Mago, Paladino, Ranger, Stregone
function formatSpellTable(tabella, classIndex) {
    if (!tabella || !Array.isArray(tabella)) return '';
    
    // Verifica se la classe ha dati sugli incantesimi
    const hasSpellData = tabella.some(row => 
        row.trucchetti_conosciuti !== undefined ||
        row.incantesimi_conosciuti !== undefined ||
        row.incantesimi_preparati !== undefined ||
        row.slot_1 !== undefined ||
        row.trucchetti !== undefined ||
        row.slot_incantesimi !== undefined
    );
    
    if (!hasSpellData) return '';
    
    // Configurazione specifica per classe
    const spellTableConfig = {
        'bard': { showTrucchetti: true, showIncantesimi: true, incantesimiLabel: 'Incantesimi' },
        'cleric': { showTrucchetti: true, showIncantesimi: false, incantesimiLabel: '' },
        'druid': { showTrucchetti: true, showIncantesimi: false, incantesimiLabel: '' },
        'wizard': { showTrucchetti: true, showIncantesimi: false, incantesimiLabel: '' }, // Trucchetti invece di Incantesimi
        'paladin': { showTrucchetti: false, showIncantesimi: false, incantesimiLabel: '' },
        'ranger': { showTrucchetti: false, showIncantesimi: true, incantesimiLabel: 'Incantesimi' },
        'sorcerer': { showTrucchetti: true, showIncantesimi: true, incantesimiLabel: 'Incantesimi' }
    };
    
    const config = spellTableConfig[classIndex] || { showTrucchetti: true, showIncantesimi: true, incantesimiLabel: 'Incantesimi' };
    
    // Trova il livello massimo di slot usato
    const maxSlotLevel = [9, 8, 7, 6, 5, 4, 3, 2, 1].find(lvl => 
        tabella.some(row => row[`slot_${lvl}`] !== undefined && row[`slot_${lvl}`] > 0)
    ) || 0;
    
    // Per Paladin e Ranger, massimo 5° e 4° livello
    const actualMaxSlot = classIndex === 'paladin' ? Math.min(maxSlotLevel, 5) : 
                          classIndex === 'ranger' ? Math.min(maxSlotLevel, 4) : 
                          maxSlotLevel;
    
    const slotLevels = [];
    for (let i = 1; i <= Math.max(actualMaxSlot, 1); i++) {
        slotLevels.push(i);
    }
    
    // Header colonne slot
    const slotHeaders = slotLevels.map(lvl => `<th>${lvl}°</th>`).join('');
    
    // Genera righe
    const rows = tabella.map(row => {
        // Trucchetti
        const trucchettiCell = config.showTrucchetti 
            ? `<td>${row.trucchetti_conosciuti || row.trucchetti || '—'}</td>` 
            : '';
        
        // Incantesimi conosciuti
        let incantesimiCell = '';
        if (config.showIncantesimi && config.incantesimiLabel) {
            incantesimiCell = `<td>${row.incantesimi_conosciuti || '—'}</td>`;
        }
        
        // Slot
        const slotCells = slotLevels.map(lvl => 
            `<td>${row[`slot_${lvl}`] !== undefined ? row[`slot_${lvl}`] : '—'}</td>`
        ).join('');
        
        return `
            <tr>
                <td>${row.livello}</td>
                ${trucchettiCell}
                ${incantesimiCell}
                ${slotCells}
            </tr>
        `;
    }).join('');
    
    // Header
    const trucchettiHeader = config.showTrucchetti ? '<th>Trucchetti</th>' : '';
    const incantesimiHeader = config.showIncantesimi && config.incantesimiLabel ? 
        `<th>${config.incantesimiLabel}</th>` : '';
    
    return `
        <div class="details-section">
            <h3>📖 Progressione Incantesimi</h3>
            <div class="table-wrapper">
                <table class="spell-table">
                    <thead>
                        <tr>
                            <th>Liv.</th>
                            ${trucchettiHeader}
                            ${incantesimiHeader}
                            ${slotHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// === TABELLA INCANTESIMI WARLOCK (SPECIALE) ===
// Colonne: Trucchetti Conosciuti, Incantesimi Conosciuti, Slot, Livello Slot, Invocazioni
function formatWarlockSpellTable(tabella) {
    if (!tabella || !Array.isArray(tabella)) return '';
    
    const rows = tabella.map(row => {
        return `
            <tr>
                <td>${row.livello}</td>
                <td>${row.trucchetti_conosciuti || '—'}</td>
                <td>${row.incantesimi_conosciuti || '—'}</td>
                <td>${row.slot_incantesimo || '—'}</td>
                <td>${row.livello_slot || '—'}</td>
                <td>${row.suppliche_conosciute || '—'}</td>
            </tr>
        `;
    }).join('');
    
    return `
        <div class="details-section">
            <h3>📖 Progressione Incantesimi</h3>
            <div class="table-wrapper">
                <table class="spell-table">
                    <thead>
                        <tr>
                            <th>Liv.</th>
                            <th>Trucchetti</th>
                            <th>Incantesimi</th>
                            <th>Slot</th>
                            <th>Liv. Slot</th>
                            <th>Invocazioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function formatSubclasses(subclasses) {
    if (!subclasses || !Array.isArray(subclasses) || subclasses.length === 0) return '';
    
    return subclasses.map(sub => {
        let privilegiHtml = '';
        if (sub.privilegi) {
            privilegiHtml = Object.entries(sub.privilegi).map(([livello, data]) => {
                let nome = '', descrizione = '';
                if (data && typeof data === 'object') {
                    nome = String(data.nome || `Livello ${livello}`);
                    descrizione = String(data.descrizione || '');
                }
                return `
                    <div class="subclass-priv-level">
                        <span class="level-badge">Liv. ${livello.replace('_b', '')}</span>
                        <div class="subclass-priv-item">
                            <strong>${escapeHtml(nome)}</strong>
                            <p>${escapeHtml(descrizione)}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        return `
            <div class="subclass-card featured">
                <h4>${escapeHtml(String(sub.nome || ''))}</h4>
                <p class="subclass-card-desc">${escapeHtml(String(sub.descrizione || ''))}</p>
                ${privilegiHtml ? `<div class="subclass-privilegi">${privilegiHtml}</div>` : ''}
            </div>
        `;
    }).join('');
}

function formatPrivilegi(privilegi) {
    if (!privilegi || Object.keys(privilegi).length === 0) return '<p>Nessun privilegio descritto.</p>';
    
    return Object.entries(privilegi).map(([nome, desc]) => {
        let descText = '';
        if (typeof desc === 'string') {
            descText = desc;
        } else if (desc && typeof desc === 'object') {
            const full = desc.descrizione_completa;
            const summary = desc.riassunto;
            descText = (typeof full === 'string') ? full : ((typeof summary === 'string') ? summary : '');
        }
        
        return `
            <div class="privilegio-block">
                <h4 class="privilegio-name">${escapeHtml(String(nome))}</h4>
                <p class="privilegio-desc">${escapeHtml(String(descText))}</p>
            </div>
        `;
    }).join('');
}

function formatSottoclassePrivilegi(privilegi) {
    if (!privilegi || Object.keys(privilegi).length === 0) return '';
    
    return Object.entries(privilegi).map(([livello, data]) => {
        if (Array.isArray(data)) {
            const items = data.map(d => `
                <div class="subclass-priv-item">
                    <strong>${escapeHtml(String(d.nome || ''))}</strong>
                    <p>${escapeHtml(String(d.descrizione || ''))}</p>
                </div>
            `).join('');
            return `
                <div class="subclass-priv-level">
                    <span class="level-badge">Liv. ${livello}</span>
                    ${items}
                </div>
            `;
        }
        
        return `
            <div class="subclass-priv-level">
                <span class="level-badge">Liv. ${livello}</span>
                <div class="subclass-priv-item">
                    <strong>${escapeHtml(String(data.nome || ''))}</strong>
                    <p>${escapeHtml(String(data.descrizione || ''))}</p>
                </div>
            </div>
        `;
    }).join('');
}

function formatIncantesimiDominio(incantesimi) {
    if (!incantesimi || Object.keys(incantesimi).length === 0) return '';
    
    return Object.entries(incantesimi).map(([livello, spells]) => `
        <div class="domain-spells-row">
            <span class="spell-level">${livello}° liv.:</span>
            <span class="spell-list">${Array.isArray(spells) ? spells.join(', ') : spells}</span>
        </div>
    `).join('');
}

const ClassList = {
    render(containerElement) {
        containerElement.innerHTML = `
            <style>
                .monster-list-item {
                    cursor: pointer;
                }
            </style>
            <div class="class-list-container-three-col">
                <div class="class-list-column">
                    <h2>Classi</h2>
                    <input type="text" id="class-search" class="list-search" placeholder="Cerca una classe...">
                    <ul id="class-full-list-three-col" class="class-full-list-three-col"></ul>
                </div>

                <div class="class-details-column-three-col">
                    <div id="class-details-content">
                        <p style="text-align: center; color: #8a7d60; margin-top: 3rem;">
                            Seleziona una classe per visualizzarne i dettagli.
                        </p>
                    </div>
                </div>

                <div class="subclass-list-column-three-col">
                    <h2>Sottoclassi</h2>
                    <div id="subclass-list-content">
                        <p style="text-align: center; color: #8a7d60; margin-top: 3rem;">
                            Seleziona una classe per vedere le sue sottoclassi.
                        </p>
                    </div>
                </div>
            </div>
        `;

        const listElement = containerElement.querySelector('#class-full-list-three-col');
        const detailsElement = containerElement.querySelector('#class-details-content');
        const subclassListElement = containerElement.querySelector('#subclass-list-content');
        const searchInput = containerElement.querySelector('#class-search');

        const renderClassList = (searchTerm = '') => {
            const filteredClasses = classDatabase.filter(cls =>
                cls.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (cls.descrizione_breve && cls.descrizione_breve.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            listElement.innerHTML = filteredClasses.length === 0 
                ? '<li class="empty-list">Nessuna classe trovata.</li>'
                : filteredClasses.map(cls => `
                    <li class="monster-list-item" data-index="${cls.index}">
                        <h3>${cls.classe}</h3>
                        <p><em>${cls.dado_vita} | ${cls.caratteristica_primaria}</em></p>
                    </li>
                `).join('');
        };

        const renderClassDetails = (classIndex) => {
            const cls = classDatabase.find(c => c.index === classIndex);
            if (!cls) return;

            const competenze = cls.competenze || {};
            
            // Determina quale tabella incantesimi usare
            let spellTableHtml = '';
            if (classIndex === 'warlock') {
                spellTableHtml = formatWarlockSpellTable(cls.tabella_progressione);
            } else {
                spellTableHtml = formatSpellTable(cls.tabella_progressione, classIndex);
            }
            
            const detailsHTML = `
                <div class="class-full-details">
                    <!-- HEADER -->
                    <div class="class-details-header">
                        <h2>${cls.classe}</h2>
                        <p class="class-tagline">${escapeHtml(String(cls.descrizione_breve || ''))}</p>
                        <div class="class-meta">
                            <span class="meta-item"><strong>Dado Vita:</strong> ${cls.dado_vita}</span>
                            <span class="meta-item"><strong>Primaria:</strong> ${cls.caratteristica_primaria}</span>
                        </div>
                    </div>
                    
                    <!-- COMPETENZE -->
                    <div class="details-section">
                        <h3>⚔️ Competenze</h3>
                        <div class="competenze-grid">
                            <div class="comp-item">
                                <strong>Armature:</strong>
                                <span>${formatArray(competenze.armature)}</span>
                            </div>
                            <div class="comp-item">
                                <strong>Armi:</strong>
                                <span>${formatArray(competenze.armi)}</span>
                            </div>
                            <div class="comp-item">
                                <strong>Strumenti:</strong>
                                <span>${competenze.strumenti || 'Nessuno'}</span>
                            </div>
                            <div class="comp-item">
                                <strong>Tiri Salvezza:</strong>
                                <span>${formatSavingThrows(cls.saving_throws)}</span>
                            </div>
                        </div>
                        <div class="comp-item full-width">
                            <strong>Abilità:</strong>
                            <span>${escapeHtml(String(competenze.abilita || 'Nessuna'))}</span>
                            ${formatProficiencyChoices(cls.proficiency_choices)}
                        </div>
                    </div>
                    
                    <!-- PUNTI FERITA -->
                    ${formatHitPoints(cls.punti_ferita)}
                    
                    <!-- EQUIPAGGIAMENTO -->
                    <div class="details-section">
                        <h3>🎒 Equipaggiamento Iniziale</h3>
                        <ul class="equipment-list">
                            ${formatEquipment(cls.equipaggiamento || cls.equipaggiamento_iniziale)}
                        </ul>
                    </div>
                    
                    <!-- TABELLA PROGRESSIONE -->
                    <div class="details-section">
                        <h3>📈 Progressione di Classe</h3>
                        <div class="table-wrapper">
                            ${formatProgressionTable(cls.tabella_progressione, cls.index)}
                        </div>
                    </div>
                    
                    <!-- TABELLA INCANTESIMI -->
                    ${spellTableHtml}
                    
                    <!-- INCANTAZIONE -->
                    ${formatSpellcasting(cls.incantazione, cls.index)}
                    
                    <!-- PRIVILEGI -->
                    <div class="details-section">
                        <h3>✨ Privilegi di Classe</h3>
                        <div class="privilegi-container">
                            ${formatPrivilegi(cls.descrizione_privilegi)}
                        </div>
                    </div>
                    
                    <!-- SOTTOCLASSI -->
                    ${cls.sottoclassi && cls.sottoclassi.length > 0 ? `
                        <div class="details-section subclass-section">
                            <h3>🔮 Sottoclassi</h3>
                            <div class="subclasses-container">
                                ${formatSubclasses(cls.sottoclassi)}
                            </div>
                        </div>
                    ` : cls.sottoclasse ? `
                        <div class="details-section subclass-section">
                            <h3>🔮 ${cls.sottoclasse.nome}</h3>
                            <p class="subclass-desc">${escapeHtml(String(cls.sottoclasse.descrizione || ''))}</p>
                            
                            ${cls.sottoclasse.incantesimi_di_dominio ? `
                                <div class="domain-spells">
                                    <h4>Incantesimi di Dominio</h4>
                                    ${formatIncantesimiDominio(cls.sottoclasse.incantesimi_di_dominio)}
                                </div>
                            ` : ''}
                            
                            <div class="subclass-privilegi">
                                <h4>Privilegi della Sottoclasse</h4>
                                ${formatSottoclassePrivilegi(cls.sottoclasse.privilegi)}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            detailsElement.innerHTML = detailsHTML;
        };
        
        const renderSubclassList = (classIndex) => {
            const cls = classDatabase.find(c => c.index === classIndex);
            if (!cls) {
                subclassListElement.innerHTML = `<p class="subclass-card-empty">Classe non trovata.</p>`;
                return;
            }
            
            if (cls.sottoclassi && cls.sottoclassi.length > 0) {
                const html = cls.sottoclassi.map((sub, idx) => `
                    <div class="subclass-card ${idx === 0 ? 'featured' : ''}">
                        ${idx === 0 ? '<div class="subclass-badge">Principale</div>' : ''}
                        <h4>${escapeHtml(String(sub.nome || ''))}</h4>
                        <p class="subclass-card-desc">${escapeHtml(String(sub.descrizione || '').substring(0, 100))}${String(sub.descrizione || '').length > 100 ? '...' : ''}</p>
                        ${sub.privilegi ? `
                            <div class="subclass-levels">
                                ${Object.keys(sub.privilegi).map(liv => 
                                    `<span class="level-dot" title="Livello ${liv.replace('_b', '')}">${liv.replace('_b', '')}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('');
                subclassListElement.innerHTML = html;
                return;
            }
            
            if (!cls.subclasses || cls.subclasses.length === 0) {
                subclassListElement.innerHTML = `<p class="subclass-card-empty">Nessuna sottoclasse definita.</p>`;
                return;
            }

            const defaultSubclass = cls.sottoclasse;
            
            let html = '';
            
            if (defaultSubclass) {
                html += `
                    <div class="subclass-card featured">
                        <div class="subclass-badge">Predefinita</div>
                        <h4>${defaultSubclass.nome}</h4>
                        <p class="subclass-card-desc">${escapeHtml(String(defaultSubclass.descrizione || ''))}</p>
                        <div class="subclass-levels">
                            ${Object.keys(defaultSubclass.privilegi || {}).map(liv => 
                                `<span class="level-dot" title="Livello ${liv}">${liv}</span>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }
            
            html += cls.subclasses
                .filter(sub => !defaultSubclass || sub.name !== defaultSubclass.nome)
                .map(sub => `
                    <div class="subclass-card">
                        <h4>${sub.name}</h4>
                        <p>Archetipo per ${cls.classe}</p>
                    </div>
                `).join('');

            subclassListElement.innerHTML = html;
        };

        listElement.addEventListener('click', (e) => {
            const li = e.target.closest('.monster-list-item');
            if (li) {
                const classIndex = li.dataset.index;
                renderClassDetails(classIndex);
                renderSubclassList(classIndex);
                
                listElement.querySelectorAll('.monster-list-item').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
            }
        });

        searchInput.addEventListener('input', (e) => renderClassList(e.target.value));

        renderClassList();
    }
};

export default ClassList;
