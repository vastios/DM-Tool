/**
 * PgViewManager.js
 * ─────────────────────────────────────────────────────────────
 * Gestione della vista (UI) per il modulo PG Manager.
 * 
 * Layout a due colonne:
 * - Sinistra (25%): Lista compatta PG con pulsante "Nuovo PG"
 * - Destra (75%): Dettaglio PG o Wizard o messaggio vuoto
 * 
 * @author DM Tool
 * @version 2.1.0 - Aggiunto sistema tratti/privilegi con tooltip
 */

import { 
    ABILITY_NAMES, 
    ABILITY_KEY_TO_PROPERTY,
    PROPERTY_TO_ABILITY_KEY,
    ABILITY_ABBREVIATIONS,
    SKILL_ABILITY_MAP,
    ALL_SKILLS,
    CONDITIONS,
    calculateModifier,
    ALL_SPELLCASTERS
} from './PgConstants.js';
import { linkifyConditions } from '../../../../utils/htmlHelpers.js';
import { linkifyCampaignReferences, getAutocompleteSuggestions } from '../../../../utils/campaignLinker.js';
import { 
    classSpellList, 
    spellLevelsByClass, 
    getMaxSpellLevel,
    getCasterType,
    getCasterTypeDescription,
    getMaxSpellsKnown,
    isKnownCaster,
    isPreparedCaster,
    getSpellSlots
} from '../../../../database/classSpells.js';
import { getRaceTraitsWithDescriptions } from '../../../../database/traitDescriptions.js';

// Mappatura indici classi (inglese) -> nomi italiani
const CLASS_NAME_IT = {
    'barbarian': null,  // Non incantatore
    'bard': 'Bardo',
    'cleric': 'Chierico',
    'druid': 'Druido',
    'fighter': null,    // Non incantatore
    'monk': null,       // Non incantatore
    'paladin': 'Paladino',
    'ranger': 'Ranger',
    'rogue': null,      // Non incantatore
    'sorcerer': 'Stregone',
    'warlock': 'Warlock',
    'wizard': 'Mago'
};

export class PgViewManager {
    
    // ========================================================================
    // COSTRUTTORE
    // ========================================================================
    
    constructor(container) {
        this.container = container;
        console.log('🎨 [PgViewManager] Inizializzato.');
    }
    
    // ========================================================================
    // LAYOUT PRINCIPALE A DUE COLONNE
    // ========================================================================
    
    renderMainLayout(pcs, selectedPgId, rightPanelContent = null) {
        console.log('🎨 [PgViewManager] Render layout principale');
        
        this.container.innerHTML = `
            <div class="pg-main-layout">
                <aside class="pg-sidebar">
                    <div class="pg-sidebar-header">
                        <h3>👥 Personaggi</h3>
                        <button class="btn btn-primary btn-sm" id="btn-new-pg">
                            + Nuovo
                        </button>
                    </div>
                    <div class="pg-sidebar-list">
                        ${pcs.length === 0 
                            ? this.renderEmptySidebar() 
                            : pcs.map(pg => this.renderSidebarCard(pg, pg.id === selectedPgId)).join('')
                        }
                    </div>
                </aside>
                
                <main class="pg-content">
                    ${rightPanelContent || this.renderEmptyState()}
                </main>
            </div>
        `;
    }
    
    renderEmptySidebar() {
        return `
            <div class="sidebar-empty">
                <p>Nessun PG</p>
                <p class="hint">Clicca "Nuovo" per crearne uno</p>
            </div>
        `;
    }
    
    renderSidebarCard(pg, isSelected) {
        const hp = pg.hp || { current: 0, max: 0, temp: 0 };
        const hpPercent = hp.max > 0 ? Math.round((hp.current / hp.max) * 100) : 0;
        
        let hpClass = 'healthy';
        if (hpPercent <= 25) hpClass = 'critical';
        else if (hpPercent <= 50) hpClass = 'wounded';
        
        return `
            <div class="pg-sidebar-card ${isSelected ? 'selected' : ''}" data-pg-id="${pg.id}">
                <div class="card-main">
                    <div class="card-info">
                        <span class="card-name">${pg.name || 'Senza Nome'}</span>
                        <span class="card-class">${pg.className || pg.class || '?'} Lv.${pg.level || 1}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-icon-sm" data-action="edit" data-pg-id="${pg.id}" title="Modifica">✏️</button>
                        <button class="btn-icon-sm" data-action="combat" data-pg-id="${pg.id}" title="Aggiungi al Combat">⚔️</button>
                        <button class="btn-icon-sm btn-danger" data-action="delete" data-pg-id="${pg.id}" title="Elimina">🗑️</button>
                    </div>
                </div>
                <div class="card-player">${pg.playerName || 'Nessun giocatore'}</div>
                <div class="card-hp-bar">
                    <div class="hp-fill ${hpClass}" style="width: ${hpPercent}%"></div>
                </div>
            </div>
        `;
    }
    
    renderEmptyState() {
        return `
            <div class="pg-empty-content">
                <div class="empty-icon">📜</div>
                <h3>Seleziona un Personaggio</h3>
                <p>Clicca su un PG dalla lista a sinistra per visualizzarne i dettagli.</p>
                <p>Oppure crea un nuovo personaggio cliccando "Nuovo".</p>
            </div>
        `;
    }
    
    // ========================================================================
    // WIZARD DI CREAZIONE
    // ========================================================================
    
    renderWizard(step, pgData, databases, errors = []) {
        console.log(`🎨 [PgViewManager] Render wizard step ${step}`);
        
        return `
            <div class="pg-wizard">
                <div class="wizard-header">
                    ${this.renderWizardSteps(step)}
                    <h2 class="wizard-title">${this.getStepTitle(step)}</h2>
                </div>
                
                ${errors.length > 0 ? this.renderErrorBox(errors) : ''}
                
                <div class="wizard-content">
                    ${this.renderStepContent(step, pgData, databases)}
                </div>
                
                <div class="wizard-footer">
                    <button class="btn btn-secondary" id="btn-prev" ${step === 1 ? 'disabled' : ''}>
                        ← Indietro
                    </button>
                    <button class="btn btn-secondary" id="btn-cancel">
                        Annulla
                    </button>
                    <button class="btn btn-primary" id="btn-next">
                        ${step === 6 ? '💾 Salva' : 'Avanti →'}
                    </button>
                </div>
            </div>
        `;
    }
    
    renderWizardSteps(currentStep) {
        const steps = [
            { num: 1, label: 'Identità' },
            { num: 2, label: 'Statistiche' },
            { num: 3, label: 'Competenze' },
            { num: 4, label: 'Incantesimi' },
            { num: 5, label: 'Note' },
            { num: 6, label: 'Riepilogo' }
        ];
        
        return `
            <div class="wizard-steps">
                ${steps.map(s => `
                    <div class="wizard-step ${s.num === currentStep ? 'active' : ''} ${s.num < currentStep ? 'completed' : ''}">
                        <div class="step-circle">${s.num < currentStep ? '✓' : s.num}</div>
                        <span class="step-label">${s.label}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    getStepTitle(step) {
        const titles = {
            1: 'Step 1: Identità del Personaggio',
            2: 'Step 2: Punteggi Caratteristica',
            3: 'Step 3: Competenze e Abilità',
            4: 'Step 4: Incantesimi',
            5: 'Step 5: Note e Background',
            6: 'Riepilogo del Personaggio'
        };
        return titles[step] || 'Step sconosciuto';
    }
    
    renderErrorBox(errors) {
        return `
            <div class="error-box">
                <div class="error-header">⚠️ Errori</div>
                <ul class="error-list">${errors.map(e => `<li>${e}</li>`).join('')}</ul>
            </div>
        `;
    }
    
    renderStepContent(step, pgData, databases) {
        switch (step) {
            case 1: return this.renderStep1Identity(pgData, databases);
            case 2: return this.renderStep2Abilities(pgData, databases);
            case 3: return this.renderStep3Proficiencies(pgData, databases);
            case 4: return this.renderStep4Spells(pgData, databases);
            case 5: return this.renderStep5Notes(pgData);
            case 6: return this.renderStep6Summary(pgData, databases);
            default: return '<p>Step non valido</p>';
        }
    }
    
    // ========================================================================
    // METODI HELPER PER TRATTI E PRIVILEGI
    // ========================================================================
    
    /**
     * Crea un tag con tooltip per tratti/privilegi
     */
    renderTraitTag(name, description, type = 'trait') {
        const escapedDesc = this.escapeHtml(description || '');
        const truncatedDesc = escapedDesc.length > 300 
            ? escapedDesc.substring(0, 300) + '...' 
            : escapedDesc;
        
        return `
            <span class="trait-tag ${type}" data-tooltip="${truncatedDesc}">
                ${name}
            </span>
        `;
    }
    
    /**
     * Ottiene i privilegi di classe in base al livello
     */
    getClassPrivileges(selectedClass, level) {
        if (!selectedClass || !selectedClass.tabella_progressione) return [];
        
        const privileges = [];
        const table = selectedClass.tabella_progressione;
        
        for (let i = 0; i < Math.min(level, 20); i++) {
            const rowData = table[i];
            if (rowData && rowData.privilegi) {
                rowData.privilegi.forEach(priv => {
                    // Evita duplicati
                    if (!privileges.find(p => p.nome === priv)) {
                        privileges.push({
                            nome: priv,
                            livello: rowData.livello,
                            descrizione: selectedClass.descrizione_privilegi?.[priv] || ''
                        });
                    }
                });
            }
        }
        
        return privileges;
    }
    
    /**
     * Ottiene i privilegi della sottoclasse in base al livello
     */
    getSubclassPrivileges(selectedClass, level) {
        if (!selectedClass || !selectedClass.sottoclasse) return [];
        
        const privileges = [];
        const subclassPrivs = selectedClass.sottoclasse.privilegi;
        
        if (!subclassPrivs) return privileges;
        
        Object.entries(subclassPrivs).forEach(([livello, data]) => {
            const livNum = parseInt(livello);
            if (livNum <= level) {
                // Se è un array (più privilegi allo stesso livello)
                if (Array.isArray(data)) {
                    data.forEach(d => {
                        privileges.push({
                            nome: d.nome,
                            livello: livNum,
                            descrizione: d.descrizione || ''
                        });
                    });
                } else {
                    privileges.push({
                        nome: data.nome,
                        livello: livNum,
                        descrizione: data.descrizione || ''
                    });
                }
            }
        });
        
        return privileges;
    }
    
    /**
     * Ottiene i tratti raziali con descrizioni dal database traitDescriptions.js
     */
    getRacialTraits(selectedRace) {
        if (!selectedRace) return [];
        
        // Usa la funzione del database per ottenere tratti con descrizioni
        return getRaceTraitsWithDescriptions(selectedRace);
    }
    
    /**
     * Renderizza il selettore della sottoclasse con controllo livello
     */
    renderSubclassSelect(pgData, databases) {
        const { selectedClass } = databases;
        
        // Se non c'è una classe selezionata
        if (!selectedClass) {
            return `
                <select id="pg-subclass" class="form-control" disabled>
                    <option value="">-- Seleziona prima una classe --</option>
                </select>
            `;
        }
        
        // Ottieni le sottoclassi dalla classe (sia chiave italiana che inglese)
        const subclassOptions = selectedClass.sottoclassi || selectedClass.subclasses || [];
        
        // Se non ci sono sottoclassi disponibili
        if (subclassOptions.length === 0) {
            return `
                <select id="pg-subclass" class="form-control" disabled>
                    <option value="">-- Nessuna sottoclasse disponibile --</option>
                </select>
            `;
        }
        
        // Determina il livello minimo per la sottoclasse
        const currentLevel = pgData.level || 1;
        const minLevel = this.getSubclassMinLevel(selectedClass);
        
        // Se il livello è insufficiente
        if (currentLevel < minLevel) {
            return `
                <div class="subclass-locked">
                    <select id="pg-subclass" class="form-control" disabled>
                        <option value="">🔒 Disponibile dal Liv. ${minLevel}</option>
                    </select>
                    <span class="subclass-hint">Attualmente al Liv. ${currentLevel}</span>
                </div>
            `;
        }
        
        // Mostra le opzioni della sottoclasse
        return `
            <select id="pg-subclass" class="form-control">
                <option value="">-- Opzionale --</option>
                ${subclassOptions.map(s => `
                    <option value="${s.nome}" ${pgData.subclass === s.nome ? 'selected' : ''}>${s.nome}</option>
                `).join('')}
            </select>
        `;
    }
    
    /**
     * Determina il livello minimo per scegliere la sottoclasse
     */
    getSubclassMinLevel(selectedClass) {
        if (!selectedClass) return 1;
        
        // Nomi comuni dei privilegi che introducono la sottoclasse
        const subclassKeywords = [
            'Cammino', 'Tradizione', 'College', 'Dominio', 'Cerchio', 
            'Archetipo', 'Monachesimo', 'Giuramento', 'Conclave', 
            'Origine', 'Patrono', 'Sottoclasse'
        ];
        
        // Cerca nella tabella progressione
        const table = selectedClass.tabella_progressione || [];
        for (const row of table) {
            if (row.privilegi) {
                for (const priv of row.privilegi) {
                    if (subclassKeywords.some(k => priv.includes(k))) {
                        return row.livello || 1;
                    }
                }
            }
        }
        
        // Default per classe
        const index = selectedClass.index;
        if (['sorcerer', 'warlock', 'cleric'].includes(index)) {
            return 1;
        }
        if (['wizard'].includes(index)) {
            return 2;
        }
        return 3;
    }
    
    /**
     * Renderizza la sezione tratti e privilegi
     */
    renderTraitsAndPrivileges(pgData, databases) {
        const { selectedRace, selectedClass, selectedBackground } = databases;
        const level = pgData.level || 1;
        
        let html = '<div class="traits-privileges-panel">';
        
        // Tratti Raziali
        if (selectedRace) {
            const racialTraits = this.getRacialTraits(selectedRace);
            html += `
                <div class="tp-section">
                    <h4>🌍 Tratti Raziali</h4>
                    <div class="tp-tags">
                        ${racialTraits.length > 0 
                            ? racialTraits.map(t => this.renderTraitTag(t.nome, t.descrizione, 'racial')).join('')
                            : '<span class="no-traits">Nessun tratto definito</span>'
                        }
                    </div>
                </div>
            `;
        }
        
        // Privilegi di Classe
        if (selectedClass) {
            const classPrivs = this.getClassPrivileges(selectedClass, level);
            html += `
                <div class="tp-section">
                    <h4>⚔️ Privilegi di Classe (Liv. ${level})</h4>
                    <div class="tp-tags">
                        ${classPrivs.length > 0 
                            ? classPrivs.map(p => this.renderTraitTag(p.nome, p.descrizione, 'class')).join('')
                            : '<span class="no-traits">Nessun privilegio</span>'
                        }
                    </div>
                </div>
            `;
            
            // Privilegi Sottoclasse
            if (pgData.subclass || selectedClass.sottoclasse) {
                const subclassPrivs = this.getSubclassPrivileges(selectedClass, level);
                if (subclassPrivs.length > 0) {
                    html += `
                        <div class="tp-section">
                            <h4>🔮 ${pgData.subclass || selectedClass.sottoclasse?.nome || 'Sottoclasse'}</h4>
                            <div class="tp-tags">
                                ${subclassPrivs.map(p => this.renderTraitTag(p.nome, p.descrizione, 'subclass')).join('')}
                            </div>
                        </div>
                    `;
                }
            }
        }
        
        // Privilegi del Background
        if (selectedBackground && selectedBackground.privilegio) {
            const priv = selectedBackground.privilegio;
            html += `
                <div class="tp-section">
                    <h4>📖 Privilegio del Background</h4>
                    <div class="tp-tags">
                        ${this.renderTraitTag(priv.nome, priv.descrizione, 'background')}
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }
    
    // ========================================================================
    // STEP 1: IDENTITÀ
    // ========================================================================
    
    renderStep1Identity(pgData, databases) {
        const { races, classes, alignments, backgrounds } = databases;
        
        return `
            <div class="wizard-form">
                <div class="form-section">
                    <h3>Dati Anagrafici</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="pg-name">Nome Personaggio *</label>
                            <input type="text" id="pg-name" value="${this.escapeHtml(pgData.name || '')}" 
                                   placeholder="Nome del personaggio" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="pg-player">Nome Giocatore</label>
                            <input type="text" id="pg-player" value="${this.escapeHtml(pgData.playerName || '')}" 
                                   placeholder="Chi gioca questo PG?" class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="pg-race">Razza *</label>
                            <select id="pg-race" class="form-control">
                                <option value="">-- Seleziona --</option>
                                ${(races || []).map(r => `
                                    <option value="${r.index}" ${pgData.race === r.index ? 'selected' : ''}>${r.classe || r.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="pg-class">Classe *</label>
                            <select id="pg-class" class="form-control">
                                <option value="">-- Seleziona --</option>
                                ${(classes || []).map(c => `
                                    <option value="${c.index}" ${pgData.class === c.index ? 'selected' : ''}>${c.classe || c.name}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="pg-subclass">Sottoclasse</label>
                            ${this.renderSubclassSelect(pgData, databases)}
                        </div>
                        <div class="form-group">
                            <label for="pg-level">Livello *</label>
                            <input type="number" id="pg-level" value="${pgData.level || 1}" min="1" max="20" class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="pg-background">Background</label>
                            <select id="pg-background" class="form-control">
                                <option value="">-- Seleziona --</option>
                                ${(backgrounds || []).map(b => `
                                    <option value="${b.index}" ${pgData.background === b.index ? 'selected' : ''}>${b.nome}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="pg-alignment">Allineamento</label>
                            <select id="pg-alignment" class="form-control">
                                <option value="">-- Seleziona --</option>
                                ${Object.keys(alignments || {}).map(a => `
                                    <option value="${a}" ${pgData.alignment === a ? 'selected' : ''}>${a}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                </div>
                
                ${this.renderRaceClassInfo(pgData, databases)}
            </div>
        `;
    }
    
    renderRaceClassInfo(pgData, databases) {
        const { selectedRace, selectedClass } = databases;
        if (!selectedRace && !selectedClass) return '';
        
        let html = '<div class="info-panel">';
        
        if (selectedRace) {
            const bonuses = selectedRace.ability_bonuses || [];
            const speed = selectedRace.speed || selectedRace.velocita || '9';
            const size = selectedRace.size || selectedRace.taglia || 'Media';
            
            html += `
                <div class="info-section">
                    <h4>🌍 ${selectedRace.classe || selectedRace.name}</h4>
                    <p>Velocità: ${speed}m | Taglia: ${size}</p>
                    <p>Bonus: ${bonuses.map(b => `${b.ability_score?.name || b.caratteristica} +${b.bonus}`).join(', ') || 'Nessuno'}</p>
                </div>
            `;
        }
        
        if (selectedClass) {
            const className = selectedClass.classe || selectedClass.name;
            html += `
                <div class="info-section">
                    <h4>⚔️ ${className}</h4>
                    <p>Dado Vita: ${selectedClass.dado_vita || 'd' + selectedClass.hit_die}</p>
                    <p>Primaria: ${selectedClass.caratteristica_primaria || 'N/D'}</p>
                    <p>TS: ${selectedClass.saving_throws?.map(st => st.name).join(', ') || selectedClass.competenze?.tiri_salvezza?.join(', ') || 'Nessuno'}</p>
                </div>
            `;
        }
        
        html += '</div>';
        
        // Aggiungi sezione tratti e privilegi
        html += this.renderTraitsAndPrivileges(pgData, databases);
        
        return html;
    }
    
    // ========================================================================
    // STEP 2: CARATTERISTICHE
    // ========================================================================
    
    renderStep2Abilities(pgData, databases) {
        const { selectedRace } = databases;
        const bonuses = selectedRace?.ability_bonuses || [];
        
        return `
            <div class="wizard-form">
                <div class="form-section">
                    <h3>Punteggi Caratteristica</h3>
                    <p class="form-description">Inserisci i punteggi base. I bonus razziali sono applicati automaticamente.</p>
                    
                    <div class="abilities-grid">
                        ${this.renderAbilityInputs(pgData, bonuses)}
                    </div>
                </div>
                
                ${this.renderHpPreview(pgData, databases)}
                
                <div class="ability-roll-section">
                    <button class="btn btn-secondary btn-sm" id="btn-roll-abilities">🎲 Genera Casuali</button>
                    <button class="btn btn-secondary btn-sm" id="btn-standard-array">📊 Standard Array</button>
                </div>
            </div>
        `;
    }
    
    renderAbilityInputs(pgData, racialBonuses) {
        const keys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        
        return keys.map(key => {
            const property = ABILITY_KEY_TO_PROPERTY[key];
            const baseScore = pgData.abilities?.[property] || 10;
            const bonus = racialBonuses.find(b => b.ability_score?.index === key)?.bonus || 0;
            const totalScore = baseScore + bonus;
            const modifier = calculateModifier(totalScore);
            
            return `
                <div class="ability-box">
                    <label class="ability-label">${ABILITY_NAMES[key]} (${key.toUpperCase()})</label>
                    <div class="ability-input-group">
                        <button class="btn btn-mini" data-ability="${key}" data-action="decrease">−</button>
                        <input type="number" id="ability-${key}" value="${baseScore}" min="1" max="20" class="ability-input">
                        <button class="btn btn-mini" data-ability="${key}" data-action="increase">+</button>
                    </div>
                    ${bonus !== 0 ? `<div class="racial-bonus">Razza: ${bonus > 0 ? '+' : ''}${bonus}</div>` : ''}
                    <div class="ability-result">
                        <span class="total">Tot: ${totalScore}</span>
                        <span class="mod ${modifier >= 0 ? 'pos' : 'neg'}">${modifier >= 0 ? '+' : ''}${modifier}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderHpPreview(pgData, databases) {
        const { selectedClass } = databases;
        if (!selectedClass) return '<div class="hp-preview disabled"><p>Seleziona una classe</p></div>';
        
        const hitDieSize = selectedClass.hit_die || parseInt(selectedClass.dado_vita?.replace('d', '') || 8);
        const conMod = calculateModifier(pgData.abilities?.constitution || 10);
        const level = pgData.level || 1;
        const avgPerLevel = Math.floor(hitDieSize / 2) + 1;
        const calculatedHp = hitDieSize + (avgPerLevel * (level - 1)) + (conMod * level);
        
        // Usa sempre il valore calcolato come default nel box
        // L'utente può modificare manualmente se necessario
        const displayHp = calculatedHp;
        
        return `
            <div class="hp-preview">
                <h4>❤️ Punti Ferita</h4>
                <div class="hp-edit-row">
                    <div class="hp-calc">
                        <span class="hp-formula">Calcolati: ${calculatedHp} PF (d${hitDieSize} + ${conMod >= 0 ? '+' : ''}${conMod} COS × ${level})</span>
                    </div>
                    <div class="hp-manual">
                        <label for="pg-max-hp">PF Massimi (editabile):</label>
                        <input type="number" id="pg-max-hp" value="${displayHp}" min="1" class="form-control hp-input">
                    </div>
                </div>
            </div>
        `;
    }
    
    // ========================================================================
    // STEP 3: COMPETENZE
    // ========================================================================
    
    renderStep3Proficiencies(pgData, databases) {
        const { selectedClass, selectedRace, selectedBackground } = databases;
        
        if (!selectedClass) {
            return '<div class="wizard-form"><div class="warning-box"><p>⚠️ Seleziona prima una classe.</p></div></div>';
        }
        
        // Estrai competenze dal background
        const bgSkills = selectedBackground?.competenze?.abilita || [];
        const bgTools = selectedBackground?.competenze?.strumenti || [];
        
        // Estrai competenze dalla classe
        const classArmor = selectedClass.competenze?.armature || [];
        const classWeapons = selectedClass.competenze?.armi || [];
        const classTools = selectedClass.competenze?.strumenti || [];
        
        // Competenze abilità dalla classe (da selezionare)
        const numChoices = selectedClass.proficiency_choices?.[0]?.choose || 2;
        const availableSkills = this.extractAvailableSkills(selectedClass.proficiency_choices?.[0]);
        
        // Skill selezionate dall'utente
        const selectedSkills = pgData.skills || [];
        const selectedCount = selectedSkills.length;
        
        // Calcola bonus competenza
        const profBonus = pgData.proficiencyBonus || 2;
        
        return `
            <div class="wizard-form">
                <!-- Tiri Salvezza -->
                <div class="form-section">
                    <h3>🛡️ Tiri Salvezza</h3>
                    <div class="saving-throws-list">
                        ${(selectedClass.saving_throws || []).map(st => `
                            <span class="prof-tag auto">✓ ${st.name}</span>
                        `).join('') || 
                        (selectedClass.competenze?.tiri_salvezza || []).map(ts => `
                            <span class="prof-tag auto">✓ ${ts}</span>
                        `).join('') || '<span>Nessuno</span>'}
                    </div>
                </div>
                
                <!-- Armature e Scudi -->
                <div class="form-section">
                    <h3>🦺 Armature e Scudi</h3>
                    <div class="prof-list">
                        ${this.renderProfList(classArmor)}
                    </div>
                </div>
                
                <!-- Armi -->
                <div class="form-section">
                    <h3>⚔️ Armi</h3>
                    <div class="prof-list">
                        ${this.renderProfList(classWeapons)}
                    </div>
                </div>
                
                <!-- Abilità -->
                <div class="form-section">
                    <h3>🎯 Abilità</h3>
                    
                    ${bgSkills.length > 0 ? `
                        <div class="bg-skills-info">
                            <span class="bg-label">📖 Dal Background (${selectedBackground?.nome || ''}):</span>
                            <div class="bg-skills-list">
                                ${bgSkills.map(s => `<span class="prof-tag background">✓ ${s}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="skill-counter-box ${selectedCount > numChoices ? 'over-limit' : ''}">
                        <div class="counter-label">Competenze da classe (scegli ${numChoices}):</div>
                        <div class="counter-value">
                            <span class="selected-num">${selectedCount}</span>
                            <span class="separator">/</span>
                            <span class="max-num">${numChoices}</span>
                        </div>
                        ${selectedCount > numChoices ? `<span class="counter-warning">⚠️ ${selectedCount - numChoices} abilità oltre il limite</span>` : ''}
                    </div>
                    
                    <div class="skills-grid with-bonus">
                        ${availableSkills.map(skill => {
                            const skillIndex = selectedSkills.indexOf(skill);
                            const isSelectedByUser = skillIndex !== -1;
                            const isFromBackground = bgSkills.includes(skill);
                            const isDoubleProf = isFromBackground && isSelectedByUser;
                            
                            // Calcola bonus
                            const ability = SKILL_ABILITY_MAP[skill];
                            const abilityKey = PROPERTY_TO_ABILITY_KEY[ability];
                            const racialBonus = (selectedRace?.ability_bonuses || []).find(b => b.ability_score?.index === abilityKey)?.bonus || 0;
                            const abilityScore = (pgData.abilities?.[ability] || 10) + racialBonus;
                            const abilityMod = calculateModifier(abilityScore);
                            
                            // Determina se è competente (da background, da classe o entrambi)
                            const isProficient = isFromBackground || isSelectedByUser;
                            const totalBonus = abilityMod + (isProficient ? profBonus : 0);
                            
                            // Classe CSS
                            let skillClass = '';
                            if (isDoubleProf) {
                                skillClass = 'double-prof';
                            } else if (isFromBackground) {
                                skillClass = 'from-background';
                            } else if (isSelectedByUser && skillIndex >= numChoices) {
                                skillClass = 'over-limit';
                            } else if (isSelectedByUser) {
                                skillClass = 'selected';
                            }
                            
                            const abbr = ABILITY_NAMES[ability]?.substring(0, 3).toUpperCase() || '';
                            
                            return `
                                <label class="skill-cb ${skillClass}">
                                    <input type="checkbox" 
                                           data-skill="${skill}" 
                                           ${isSelectedByUser || isFromBackground ? 'checked' : ''} 
                                           ${isFromBackground ? 'disabled' : ''}>
                                    <span class="sk-name">${skill}</span>
                                    <span class="sk-abbr">(${abbr})</span>
                                    <span class="sk-bonus ${totalBonus >= 0 ? 'pos' : 'neg'}">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                                </label>
                            `;
                        }).join('')}
                    </div>
                    
                    <div class="skill-legend">
                        <span class="legend-item"><span class="dot green"></span> Da classe</span>
                        <span class="legend-item"><span class="dot blue"></span> Da background</span>
                        <span class="legend-item"><span class="dot purple"></span> Doppia competenza</span>
                        <span class="legend-item"><span class="dot orange"></span> Oltre limite</span>
                    </div>
                </div>
                
                <!-- Strumenti -->
                <div class="form-section">
                    <h3>🔧 Strumenti</h3>
                    ${bgTools.length > 0 ? `
                        <div class="prof-subsection">
                            <span class="sub-label">📖 Dal Background:</span>
                            <div class="prof-list inline">
                                ${bgTools.map(t => `<span class="prof-tag background">✓ ${t}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${classTools.length > 0 && !classTools.includes('Nessuno') ? `
                        <div class="prof-subsection">
                            <span class="sub-label">⚔️ Dalla Classe:</span>
                            <div class="prof-list inline">
                                ${classTools.map(t => `<span class="prof-tag auto">✓ ${t}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${bgTools.length === 0 && (classTools.length === 0 || classTools.includes('Nessuno')) ? `
                        <p class="no-prof">Nessuna competenza in strumenti</p>
                    ` : ''}
                </div>
                
                <!-- Lingue -->
                <div class="form-section">
                    <h3>🗣️ Lingue</h3>
                    <div class="languages-row">
                        <span>Automatiche: </span>
                        ${(selectedRace?.languages || []).map(l => `<span class="prof-tag auto">✓ ${l.name}</span>`).join('') || '<span>Comune</span>'}
                    </div>
                    <div class="form-group" style="margin-top: 0.5rem;">
                        <input type="text" id="pg-extra-languages" value="${pgData.extraLanguages || ''}" 
                               placeholder="Altre lingue (separate da virgola)" class="form-control">
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderizza una lista di competenze come tag
     */
    renderProfList(items) {
        if (!items || items.length === 0) {
            return '<span class="no-prof">Nessuna</span>';
        }
        return items.map(item => `<span class="prof-tag auto">✓ ${item}</span>`).join('');
    }
    
    extractAvailableSkills(proficiencyChoice) {
        if (!proficiencyChoice?.from?.options) return ALL_SKILLS;
        return proficiencyChoice.from.options
            .map(opt => (opt.item?.name || '').replace('Abilità: ', '').trim())
            .filter(name => name && SKILL_ABILITY_MAP[name]);
    }
    
    // ========================================================================
    // STEP 4: INCANTESIMI
    // ========================================================================
    
    renderStep4Spells(pgData, databases) {
        const { selectedClass } = databases;
        
        const classNameIt = CLASS_NAME_IT[selectedClass?.index];
        
        if (!selectedClass || !classNameIt) {
            return `
                <div class="wizard-form">
                    <div class="info-box">
                        <h4>⚔️ Non Incantatore</h4>
                        <p>La classe selezionata non è un'incantatrice. Procedi oltre.</p>
                    </div>
                </div>
            `;
        }
        
        const classSpellsByLevel = spellLevelsByClass[classNameIt];
        
        if (!classSpellsByLevel || Object.keys(classSpellsByLevel).length === 0) {
            return `
                <div class="wizard-form">
                    <div class="warning-box">
                        <h4>⚠️ Incantesimi non trovati</h4>
                        <p>Non ci sono incantesimi definiti per ${classNameIt}.</p>
                    </div>
                </div>
            `;
        }
        
        const knownSpells = pgData.spellcasting?.spellsKnown || [];
        const pgLevel = pgData.level || 1;
        const maxSpellLevel = getMaxSpellLevel(classNameIt, pgLevel);
        
        // Determina il tipo di incantatore
        const casterType = getCasterType(classNameIt);
        const casterDesc = getCasterTypeDescription(classNameIt);
        const maxKnown = getMaxSpellsKnown(classNameIt, pgLevel);
        const isKnown = isKnownCaster(classNameIt);
        const isPrepared = isPreparedCaster(classNameIt);
        
        // Ottieni gli slot incantesimi
        const spellSlots = getSpellSlots(classNameIt, pgLevel);
        
        // Conta incantesimi selezionati per livello
        const countByLevel = {};
        let totalCantrips = 0;
        let totalNonCantrips = 0;
        knownSpells.forEach(spell => {
            for (const [level, spells] of Object.entries(classSpellsByLevel)) {
                if (spells.includes(spell)) {
                    countByLevel[level] = (countByLevel[level] || 0) + 1;
                    if (parseInt(level) === 0) totalCantrips++;
                    else totalNonCantrips++;
                    break;
                }
            }
        });
        
        // Calcola trucchetti massimi
        const maxCantrips = this.getMaxCantripsKnown(classNameIt, pgLevel);
        
        // Calcola incantesimi preparati/preparabili per i preparatori
        const spellAbility = this.getSpellcastingAbilityForClass(classNameIt);
        const abilityKey = this.abilityNameToKey(spellAbility);
        const abilityScore = (pgData.abilities?.[abilityKey] || 10);
        const abilityMod = calculateModifier(abilityScore);
        const preparedCount = abilityMod + pgLevel;
        
        // Verifica se ha superato il limite
        const isOverLimit = maxKnown !== null && totalNonCantrips > maxKnown;
        const overBy = isOverLimit ? totalNonCantrips - maxKnown : 0;
        const isCantripsOver = maxCantrips !== null && totalCantrips > maxCantrips;
        const cantripsOverBy = isCantripsOver ? totalCantrips - maxCantrips : 0;
        
        // Etichette dei livelli
        const levelLabels = {
            0: 'Trucchetti',
            1: '1° Livello',
            2: '2° Livello',
            3: '3° Livello',
            4: '4° Livello',
            5: '5° Livello',
            6: '6° Livello',
            7: '7° Livello',
            8: '8° Livello',
            9: '9° Livello'
        };
        
        // Renderizza tabella slot incantesimi
        let slotsHtml = '';
        if (casterType !== 'none') {
            const slotsToShow = Object.entries(spellSlots)
                .filter(([level, count]) => count > 0 && parseInt(level) <= maxSpellLevel)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
            
            if (slotsToShow.length > 0) {
                slotsHtml = `
                    <div class="spell-slots-box">
                        <h4>🔮 Slot Incantesimi Disponibili</h4>
                        <div class="slots-grid">
                            ${slotsToShow.map(([level, count]) => `
                                <div class="slot-item">
                                    <span class="slot-level">${levelLabels[level]}</span>
                                    <span class="slot-count">${count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }
        
        // Counter per trucchetti
        let counterHtml = '';
        if (maxCantrips !== null) {
            counterHtml += `
                <div class="spells-known-counter ${isCantripsOver ? 'over-limit' : ''}">
                    <div class="counter-row">
                        <span class="counter-label">✨ Trucchetti:</span>
                        <span class="counter-value">
                            <strong>${totalCantrips}</strong> / ${maxCantrips}
                        </span>
                    </div>
                    ${isCantripsOver ? `
                        <div class="counter-warning">
                            ⚠️ Hai superato il limite di ${cantripsOverBy} trucchett${cantripsOverBy > 1 ? 'i' : 'o'}!
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Counter incantesimi per classi "known" (Bardo, Stregone, Warlock)
        if (isKnown && maxKnown !== null) {
            counterHtml += `
                <div class="spells-known-counter ${isOverLimit ? 'over-limit' : ''}">
                    <div class="counter-row">
                        <span class="counter-label">📚 Incantesimi Conosciuti:</span>
                        <span class="counter-value">
                            <strong>${totalNonCantrips}</strong> / ${maxKnown}
                        </span>
                    </div>
                    ${isOverLimit ? `
                        <div class="counter-warning">
                            ⚠️ Hai superato il limite di ${overBy} incantesim${overBy > 1 ? 'i' : 'o'}!
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Per i preparatori (Mago, Chierico, Druido, Paladino, Ranger)
        if (isPrepared) {
            // Per il Mago: mostra incantesimi nel libro (INT mod + livello)
            if (classNameIt === 'Mago') {
                // Un Mago di 1° livello inizia con 6 incantesimi di 1° livello nel grimorio
                const startingSpells = pgLevel === 1 ? 6 : Math.max(1, preparedCount);
                counterHtml += `
                    <div class="spells-prepared-info">
                        <div class="prepared-row">
                            <span class="prepared-label">📚 Incantesimi nel Grimorio (1° liv):</span>
                            <span class="prepared-value"><strong>${startingSpells}</strong></span>
                        </div>
                        <div class="prepared-row">
                            <span class="prepared-label">🔮 Incantesimi Preparabili:</span>
                            <span class="prepared-value"><strong>${Math.max(1, preparedCount)}</strong> (${pgLevel} liv + ${abilityMod >= 0 ? '+' : ''}${abilityMod} INT)</span>
                        </div>
                        <p class="prepared-hint">Seleziona ${startingSpells} incantesimi di 1° livello per il tuo grimorio. Puoi preparare ${Math.max(1, preparedCount)} incantesimi dopo un riposo lungo.</p>
                    </div>
                `;
            } else {
                counterHtml += `
                    <div class="spells-prepared-info">
                        <div class="prepared-row">
                            <span class="prepared-label">📖 Incantesimi Preparabili:</span>
                            <span class="prepared-value"><strong>${Math.max(1, preparedCount)}</strong> (${pgLevel} liv + ${abilityMod >= 0 ? '+' : ''}${abilityMod} ${spellAbility.substring(0, 3).toUpperCase()})</span>
                        </div>
                        <p class="prepared-hint">Puoi cambiare gli incantesimi preparati dopo un riposo lungo.</p>
                    </div>
                `;
            }
        }
        
        // Renderizza sezioni per ogni livello accessibile
        let sectionsHtml = '';
        
        // Calcola limite per incantesimi di 1° livello per Mago
        const maxLevel1Spells = (classNameIt === 'Mago' && pgLevel === 1) ? 6 : null;
        const isOverLevel1 = maxLevel1Spells !== null && (countByLevel[1] || 0) > maxLevel1Spells;
        
        for (let level = 0; level <= maxSpellLevel; level++) {
            const spells = classSpellsByLevel[level] || [];
            if (spells.length === 0) continue;
            
            const selectedCount = countByLevel[level] || 0;
            const slotsForLevel = spellSlots[level] || 0;
            
            // Per ogni livello, mostra il max selezionabile
            let maxForLevel = spells.length;
            if (level === 0 && maxCantrips !== null) {
                maxForLevel = maxCantrips;
            } else if (level === 1 && maxLevel1Spells !== null) {
                maxForLevel = maxLevel1Spells;
            } else if (level > 0 && isKnown && maxKnown !== null) {
                // Per known casters, non c'è un limite per livello ma un totale
                maxForLevel = null;
            }
            
            let counterText = '';
            if (level === 0) {
                counterText = `<span class="spells-counter ${isCantripsOver ? 'over-limit' : ''}">Selezionati: <strong>${selectedCount}</strong> / ${maxCantrips || '∞'}</span>`;
            } else if (level === 1 && maxLevel1Spells !== null) {
                counterText = `<span class="spells-counter ${isOverLevel1 ? 'over-limit' : ''}">Selezionati: <strong>${selectedCount}</strong> / ${maxLevel1Spells}</span>`;
            } else if (maxForLevel !== null) {
                counterText = `<span class="spells-counter">Selezionati: <strong>${selectedCount}</strong> / ${maxForLevel}</span>`;
            } else {
                counterText = `<span class="spells-counter">Selezionati: <strong>${selectedCount}</strong></span>`;
            }
            
            sectionsHtml += `
                <div class="spells-level-section">
                    <div class="spells-level-header">
                        <h4>${levelLabels[level]}</h4>
                        ${counterText}
                        ${level > 0 && slotsForLevel > 0 ? `<span class="slots-badge">${slotsForLevel} slot</span>` : ''}
                    </div>
                    <div class="spells-level-grid">
                        ${spells.map(spellName => {
                            const isSelected = knownSpells.includes(spellName);
                            return `
                                <label class="spell-cb ${isSelected ? 'selected' : ''}">
                                    <input type="checkbox" data-spell="${spellName}" data-level="${level}" ${isSelected ? 'checked' : ''}>
                                    <span class="sk-name">${spellName}</span>
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        // Livelli non ancora accessibili
        let lockedHtml = '';
        for (let level = maxSpellLevel + 1; level <= 9; level++) {
            const spells = classSpellsByLevel[level] || [];
            if (spells.length === 0) continue;
            
            lockedHtml += `
                <div class="spells-level-section locked">
                    <div class="spells-level-header">
                        <h4>🔒 ${levelLabels[level]}</h4>
                        <span class="spells-locked-hint">Disponibile dal livello ${this.getLevelForSpellLevel(classNameIt, level)}</span>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="wizard-form">
                <div class="form-section">
                    <h3>🔮 Incantesimi di ${classNameIt}</h3>
                    
                    <div class="caster-type-info ${casterType}">
                        <span class="caster-type-badge">${this.getCasterTypeLabel(casterType)}</span>
                        <p class="caster-desc">${casterDesc}</p>
                    </div>
                    
                    ${slotsHtml}
                    ${counterHtml}
                    
                    <div class="spells-summary">
                        <p>Totale selezionati: <strong>${knownSpells.length}</strong> (${totalCantrips} trucchetti + ${totalNonCantrips} incantesimi)</p>
                        <p class="hint">Livello PG: ${pgLevel} | Livello incantesimi max: ${levelLabels[maxSpellLevel]}</p>
                    </div>
                    
                    <div class="spells-accordion">
                        ${sectionsHtml}
                        ${lockedHtml}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Helper per trovare il livello PG necessario per un livello incantesimo
    getLevelForSpellLevel(className, spellLevel) {
        for (let lvl = 1; lvl <= 20; lvl++) {
            if (getMaxSpellLevel(className, lvl) >= spellLevel) {
                return lvl;
            }
        }
        return '?';
    }
    
    /**
     * Ottiene l'etichetta del tipo di incantatore
     */
    getCasterTypeLabel(casterType) {
        const labels = {
            'pact': '🔮 Pact Magic',
            'known': '📚 Incantesimi Conosciuti',
            'prepared': '📖 Incantesimi Preparati',
            'none': '⚔️ Non Incantatore'
        };
        return labels[casterType] || 'Sconosciuto';
    }
    
    /**
     * Ottiene la caratteristica da usare per incantesimi per una classe
     */
    getSpellcastingAbilityForClass(classNameIt) {
        const mapping = {
            'Bardo': 'charisma',
            'Chierico': 'wisdom',
            'Druido': 'wisdom',
            'Mago': 'intelligence',
            'Paladino': 'charisma',
            'Ranger': 'wisdom',
            'Stregone': 'charisma',
            'Warlock': 'charisma'
        };
        return mapping[classNameIt] || 'intelligence';
    }
    
    /**
     * Converte il nome della caratteristica nella chiave della proprietà
     */
    abilityNameToKey(abilityName) {
        const mapping = {
            'strength': 'strength',
            'dexterity': 'dexterity',
            'constitution': 'constitution',
            'intelligence': 'intelligence',
            'wisdom': 'wisdom',
            'charisma': 'charisma'
        };
        return mapping[abilityName] || 'intelligence';
    }
    
    /**
     * Ottiene il numero massimo di trucchetti conosciuti per classe e livello
     */
    getMaxCantripsKnown(className, pgLevel) {
        const cantripsByLevel = {
            'Bardo': { 1: 2, 4: 3, 10: 4 },
            'Chierico': { 1: 3 },
            'Druido': { 1: 2 },
            'Mago': { 1: 3, 10: 4 },
            'Paladino': null,
            'Ranger': null,
            'Stregone': { 1: 4 },
            'Warlock': { 1: 2, 4: 3, 10: 4 }
        };
        
        const classData = cantripsByLevel[className];
        if (classData === null || classData === undefined) return null;
        
        const levels = Object.keys(classData).map(Number).sort((a, b) => b - a);
        for (const lvl of levels) {
            if (pgLevel >= lvl) return classData[lvl];
        }
        return classData[1] || null;
    }
    
    // ========================================================================
    // STEP 5: NOTE
    // ========================================================================
    
    renderStep5Notes(pgData) {
        return `
            <div class="wizard-form">
                <div class="form-section">
                    <h3>Background e Note</h3>
                    <p class="form-description">Usa @ per linkare elementi della campagna (es. @NomePNG, @Luogo)</p>
                    <div class="form-group">
                        <label for="pg-backstory">Storia del Personaggio</label>
                        <textarea id="pg-backstory" rows="5" class="form-control tag-autocomplete" 
                                  placeholder="Origini, motivazioni...">${this.escapeHtml(pgData.backstory || '')}</textarea>
                        <div class="autocomplete-dropdown" id="autocomplete-pg-backstory"></div>
                    </div>
                    <div class="form-group">
                        <label for="pg-notes">Note</label>
                        <textarea id="pg-notes" rows="3" class="form-control tag-autocomplete" 
                                  placeholder="Appunti, obbiettivi...">${this.escapeHtml(pgData.notes || '')}</textarea>
                        <div class="autocomplete-dropdown" id="autocomplete-pg-notes"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ========================================================================
    // STEP 6: RIEPILOGO
    // ========================================================================
    
    renderStep6Summary(pgData, databases) {
        const { selectedRace, selectedClass } = databases;
        const bonuses = selectedRace?.ability_bonuses || [];
        
        return `
            <div class="wizard-form">
                <div class="summary-header">
                    <h2>${pgData.name || 'Nome PG'}</h2>
                    <p>${pgData.raceName || selectedRace?.classe || selectedRace?.name || ''} ${pgData.className || selectedClass?.classe || selectedClass?.name || ''} Lv.${pgData.level || 1}</p>
                </div>
                
                <div class="summary-grid">
                    <div class="sum-section">
                        <h4>Caratteristiche</h4>
                        <div class="sum-abilities">
                            ${['str', 'dex', 'con', 'int', 'wis', 'cha'].map(key => {
                                const prop = ABILITY_KEY_TO_PROPERTY[key];
                                const base = pgData.abilities?.[prop] || 10;
                                const bonus = bonuses.find(b => b.ability_score?.index === key)?.bonus || 0;
                                const total = base + bonus;
                                const mod = calculateModifier(total);
                                return `<div class="sum-ab"><strong>${key.toUpperCase()}</strong>: ${total} (${mod >= 0 ? '+' : ''}${mod})</div>`;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="sum-section">
                        <h4>Combattimento</h4>
                        <p><strong>HP:</strong> ${pgData.hp?.max || 0}</p>
                        <p><strong>CA:</strong> ${pgData.armorClass || 10}</p>
                        <p><strong>Velocità:</strong> ${pgData.speed || 9}m</p>
                        <p><strong>Competenza:</strong> +${pgData.proficiencyBonus || 2}</p>
                    </div>
                    
                    <div class="sum-section">
                        <h4>Competenze</h4>
                        <p><strong>TS:</strong> ${(pgData.savingThrows || []).join(', ') || '-'}</p>
                        <p><strong>Abilità:</strong> ${(pgData.skills || []).join(', ') || '-'}</p>
                    </div>
                </div>
                
                <!-- Tratti e Privilegi nel Riepilogo -->
                ${this.renderTraitsAndPrivileges(pgData, databases)}
                
                ${pgData.backstory ? `<div class="sum-section full"><h4>Background</h4><p>${linkifyConditions(this.escapeHtml(pgData.backstory))}</p></div>` : ''}
            </div>
        `;
    }
    
    // ========================================================================
    // SCHEDA PG DETTAGLIO
    // ========================================================================
    
    renderCharacterSheet(pg, databases) {
        console.log('🎨 [PgViewManager] Render scheda:', pg.name);
        
        const hp = pg.hp || { current: 0, max: 0, temp: 0 };
        const abilities = pg.abilities || {
            strength: 10, dexterity: 10, constitution: 10,
            intelligence: 10, wisdom: 10, charisma: 10
        };
        
        const ABILITY_IT = {
            str: 'FOR', dex: 'DES', con: 'COS',
            int: 'INT', wis: 'SAG', cha: 'CAR'
        };
        
        const CLASS_IMAGE_MAP = {
            'barbarian': 'barbaro', 'bard': 'bardo', 'cleric': 'chierico',
            'druid': 'druido', 'fighter': 'guerriero', 'monk': 'monaco',
            'paladin': 'paladino', 'ranger': 'ranger', 'rogue': 'ladro',
            'sorcerer': 'stregone', 'warlock': 'warlock', 'wizard': 'mago'
        };
        
        const classIndex = (pg.class || '').toLowerCase();
        const classImageName = CLASS_IMAGE_MAP[classIndex] || classIndex;
        const classImagePath = `/assets/classes/${classImageName}.png`;
        
        // Ottieni tratti e privilegi per la scheda - cerca dal PG corrente, NON dalle variabili del wizard
        const pgClass = databases.classes?.find(c => c.index === pg.class);
        const pgRace = databases.races?.find(r => r.index === pg.race);
        const classPrivs = pgClass ? this.getClassPrivileges(pgClass, pg.level || 1) : [];
        const subclassPrivs = pgClass ? this.getSubclassPrivileges(pgClass, pg.level || 1) : [];
        const racialTraits = this.getRacialTraits(pgRace);
        
        return `
            <div class="pg-sheet">
                <!-- HEADER -->
                <div class="sheet-header">
                    <div class="header-left">
                        <h2 class="char-name">${pg.name || 'Senza Nome'}</h2>
                        <p class="char-class-info">${pg.raceName || pg.race || ''} ${pg.className || pg.class || ''} Lv.${pg.level || 1}</p>
                        <p class="char-player">giocato da: ${pg.playerName || 'Nessun giocatore'}</p>
                    </div>
                    <img class="class-icon" src="${classImagePath}" alt="${pg.className || 'Classe'}" onerror="this.style.display='none'">
                </div>
                
                <div class="sheet-body">
                    <!-- RIGA 1: Identità + Combattimento -->
                    <div class="sheet-row-top">
                        <div class="sheet-section section-identity">
                            <h3>Identità</h3>
                            <div class="identity-cols">
                                <div class="id-col">
                                    <span class="id-label">Background</span>
                                    <span class="id-value">${pg.backgroundName || pg.background || '-'}</span>
                                </div>
                                <div class="id-col">
                                    <span class="id-label">Allineamento</span>
                                    <span class="id-value">${pg.alignment || '-'}</span>
                                </div>
                                <div class="id-col">
                                    <span class="id-label">Livello</span>
                                    <span class="id-value">${pg.level || 1}</span>
                                </div>
                                <div class="id-col">
                                    <span class="id-label">Competenza</span>
                                    <span class="id-value">+${pg.proficiencyBonus || 2}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sheet-section section-combat">
                            <h3>Combattimento</h3>
                            <div class="combat-grid">
                                <div class="combat-stat">
                                    <label>HP</label>
                                    <div class="hp-input-group">
                                        <input type="number" id="hp-current" value="${hp.current}" min="0" max="${hp.max}">
                                        <span>/ ${hp.max}</span>
                                        ${hp.temp > 0 ? `<span class="temp">(+${hp.temp})</span>` : ''}
                                    </div>
                                </div>
                                <div class="combat-stat">
                                    <label>CA</label>
                                    <span class="big-val">${pg.armorClass || 10}</span>
                                </div>
                                <div class="combat-stat">
                                    <label>Iniziativa</label>
                                    <span class="big-val">${pg.initiative >= 0 ? '+' : ''}${pg.initiative || 0}</span>
                                </div>
                                <div class="combat-stat">
                                    <label>Velocità</label>
                                    <span class="big-val">${pg.speed || 9}m</span>
                                </div>
                                <div class="combat-stat">
                                    <label>Dado Vita</label>
                                    <span class="big-val">${pg.hitDice?.current ?? pg.level}/${pg.hitDice?.total ?? pg.level}d${pgClass?.hit_die || pg.hitDice?.size?.replace('d', '') || 8}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- RIGA 2: Caratteristiche + Abilità -->
                    <div class="sheet-row-middle">
                        <div class="sheet-section section-abilities">
                            <h3>Caratteristiche</h3>
                            <div class="abilities-col">
                                ${['str', 'dex', 'con', 'int', 'wis', 'cha'].map(key => {
                                    const prop = ABILITY_KEY_TO_PROPERTY[key];
                                    const score = abilities[prop] || 10;
                                    const mod = calculateModifier(score);
                                    const hasSave = (pg.savingThrows || []).includes(key.toUpperCase());
                                    
                                    return `
                                        <div class="ability-block ${hasSave ? 'has-save' : ''}">
                                            <span class="ab-name">${ABILITY_IT[key]}</span>
                                            <span class="ab-score">${score}</span>
                                            <span class="ab-mod">${mod >= 0 ? '+' : ''}${mod}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        
                        <div class="sheet-section section-skills">
                            <h3>Abilità</h3>
                            ${this.renderSkillList(pg, abilities)}
                        </div>
                    </div>
                    
                    <!-- RIGA: Tratti e Privilegi -->
                    <div class="sheet-row-traits">
                        ${racialTraits.length > 0 ? `
                            <div class="sheet-section section-traits">
                                <h3>🌍 Tratti Raziali</h3>
                                <div class="traits-list">
                                    ${racialTraits.map(t => this.renderTraitTag(t.nome, t.descrizione, 'racial')).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${classPrivs.length > 0 ? `
                            <div class="sheet-section section-privileges">
                                <h3>⚔️ Privilegi di Classe</h3>
                                <div class="privileges-list">
                                    ${classPrivs.map(p => this.renderTraitTag(p.nome, p.descrizione, 'class')).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${subclassPrivs.length > 0 ? `
                            <div class="sheet-section section-subclass">
                                <h3>🔮 ${pgClass?.sottoclasse?.nome || 'Sottoclasse'}</h3>
                                <div class="subclass-privs-list">
                                    ${subclassPrivs.map(p => this.renderTraitTag(p.nome, p.descrizione, 'subclass')).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- RIGA: Inventario -->
                    <div class="sheet-row-inventory">
                        ${this.renderInventorySection(pg, pgClass)}
                    </div>
                    
                    <!-- RIGA 3: Background e Note -->
                    <div class="sheet-row-bottom">
                        ${pg.backstory ? `
                            <div class="sheet-section section-backstory">
                                <h3>Background</h3>
                                <div class="note-content">
                                    <p>${linkifyCampaignReferences(linkifyConditions(this.escapeHtml(pg.backstory)))}</p>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${pg.notes ? `
                            <div class="sheet-section section-notes">
                                <h3>Note</h3>
                                <div class="note-content">
                                    <p>${linkifyCampaignReferences(linkifyConditions(this.escapeHtml(pg.notes)))}</p>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- RIGA 4: Incantesimi (in fondo) -->
                    ${pg.spellcasting ? `
                        <div class="sheet-row-spells">
                            ${this.renderSpellBlock(pg)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    renderSkillList(pg, abilities) {
        const profBonus = pg.proficiencyBonus || 2;
        const skills = pg.skills || [];
        
        const ABILITY_IT_ABBR = {
            strength: 'FOR', dexterity: 'DES', constitution: 'COS',
            intelligence: 'INT', wisdom: 'SAG', charisma: 'CAR'
        };
        
        const half = Math.ceil(ALL_SKILLS.length / 2);
        const leftSkills = ALL_SKILLS.slice(0, half);
        const rightSkills = ALL_SKILLS.slice(half);
        
        const renderSkill = (skill) => {
            const ability = SKILL_ABILITY_MAP[skill];
            const prop = ABILITY_KEY_TO_PROPERTY[ability];
            const score = abilities[prop] || 10;
            let mod = calculateModifier(score);
            const hasProf = skills.includes(skill);
            if (hasProf) mod += profBonus;
            const abbr = ABILITY_IT_ABBR[ability] || '';
            
            return `
                <div class="skill-item ${hasProf ? 'prof' : ''}">
                    <span class="sk-icon">${hasProf ? '⚔' : '·'}</span>
                    <span class="sk-name">${skill}</span>
                    <span class="sk-abbr">${abbr}</span>
                    <span class="sk-val">${mod >= 0 ? '+' : ''}${mod}</span>
                </div>
            `;
        };
        
        return `
            <div class="skills-list-2col">
                <div class="skills-col">
                    ${leftSkills.map(renderSkill).join('')}
                </div>
                <div class="skills-col">
                    ${rightSkills.map(renderSkill).join('')}
                </div>
            </div>
        `;
    }
    
    renderSpellBlock(pg) {
        return `
            <div class="sheet-section">
                <h3>Incantesimi</h3>
                <p class="spell-info">
                    CD: <strong>${pg.spellcasting.spellSaveDC || 0}</strong> | 
                    Attacco: <strong>+${pg.spellcasting.spellAttackBonus || 0}</strong>
                </p>
                <div class="spells-known-list">
                    ${(pg.spellcasting.spellsKnown || []).map(s => `<span class="spell-tag">${s}</span>`).join('') || '<span>Nessuno</span>'}
                </div>
            </div>
        `;
    }
    
    /**
     * Renderizza la sezione Inventario nella scheda PG
     */
    renderInventorySection(pg, pgClass) {
        // Equipaggiamento dalla classe (con scelte applicate)
        const classEquipment = pgClass?.equipaggiamento || [];
        const equipmentChoices = pg.equipmentChoices || {};
        
        // Processa l'equipaggiamento con le scelte
        const processedEquipment = this.processEquipmentWithChoices(classEquipment, equipmentChoices);
        
        // Equipaggiamento extra
        const extraEquipment = pg.extraEquipment || '';
        
        // Oro
        const treasure = pg.treasure || {};
        
        if (processedEquipment.length === 0 && !extraEquipment) {
            return '';
        }
        
        return `
            <div class="sheet-section section-inventory">
                <h3>🎒 Inventario</h3>
                
                ${processedEquipment.length > 0 ? `
                    <div class="equipment-list">
                        ${processedEquipment.map(item => `
                            <span class="equip-tag">${this.escapeHtml(item)}</span>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${extraEquipment ? `
                    <div class="extra-equipment">
                        <p>${linkifyCampaignReferences(this.escapeHtml(extraEquipment))}</p>
                    </div>
                ` : ''}
                
                ${treasure.gp || treasure.sp || treasure.ep || treasure.cp || treasure.pp ? `
                    <div class="treasure-row">
                        ${treasure.pp ? `<span class="treasure-tag pp">${treasure.pp} pp</span>` : ''}
                        ${treasure.gp ? `<span class="treasure-tag gp">${treasure.gp} mo</span>` : ''}
                        ${treasure.ep ? `<span class="treasure-tag ep">${treasure.ep} me</span>` : ''}
                        ${treasure.sp ? `<span class="treasure-tag sp">${treasure.sp} ma</span>` : ''}
                        ${treasure.cp ? `<span class="treasure-tag cp">${treasure.cp} mr</span>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Processa l'equipaggiamento applicando le scelte salvate
     */
    processEquipmentWithChoices(equipmentList, choices) {
        if (!Array.isArray(equipmentList)) return [];
        
        return equipmentList.map((item, index) => {
            const choiceKey = `class-${index}`;
            const choice = choices[choiceKey];
            
            // Verifica se è una scelta (a)/(b)
            const choiceMatch = item.match(/^\(a\)\s*(.+?)\s*o\s*\(b\)\s*(.+)$/i);
            if (choiceMatch && choice) {
                if (choice === 'a') return choiceMatch[1].trim();
                if (choice === 'b') return choiceMatch[2].trim();
            }
            
            // Verifica scelte multiple
            const multiMatch = item.match(/\(([a-z])\)\s*([^()]+?)(?=\s*(?:\([a-z]\)|$))/gi);
            if (multiMatch && multiMatch.length > 1 && choice) {
                for (const opt of multiMatch) {
                    const m = opt.match(/\(([a-z])\)\s*(.+)/i);
                    if (m && m[1].toLowerCase() === choice.toLowerCase()) {
                        return m[2].trim();
                    }
                }
            }
            
            return item;
        }).filter(Boolean);
    }
    
    // ========================================================================
    // UTILITÀ
    // ========================================================================
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showLoading() {
        return `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Caricamento...</p>
            </div>
        `;
    }
    
    showError(message) {
        return `
            <div class="error-container">
                <h3>❌ Errore</h3>
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    }
}

console.log('🎨 [PgViewManager] Modulo caricato.');