/**
 * PgViewManager.js
 * ─────────────────────────────────────────────────────────────
 * Gestione della vista (UI) per il modulo PG Manager.
 * 
 * Layout a due colonne:
 * - Sinistra (25%): Lista compatta PG con pulsante "Nuovo PG"
 * - Desta (75%): Dettaglio PG o Wizard o messaggio vuoto
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
    calculateModifier,
    escapeHtml
} from './PgConstants.js';
import { renderStep5Inventory } from './PgStep5Inventory.js';
import { renderStep6Notes } from './PgStep6Notes.js';
import { renderStep7Summary } from './PgStep7Summary.js';
import { renderStep2Abilities } from './PgStep2Abilities.js';
import { renderStep1Identity } from './PgStep1Identity.js';
import { renderStep3Proficiencies } from './PgStep3Proficiencies.js';
import { renderStep4Spells } from './PgStep4Spells.js';
import { 
    renderCharacterSheet, 
    renderTraitsAndPrivileges
} from './PgCharacterSheet.js';

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
                    <!-- Tooltip Panel - Copre la lista PG -->
                    <div class="trait-tooltip-overlay" id="trait-tooltip-overlay">
                        <div class="trait-tooltip-header">
                            <span class="tooltip-name" id="tooltip-name">-</span>
                            <span class="tooltip-type" id="tooltip-type">-</span>
                        </div>
                        <div class="trait-tooltip-body" id="tooltip-body">
                            Passa il mouse su un tratto o privilegio...
                        </div>
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
                        <span class="card-name">${escapeHtml(pg.name || 'Senza Nome')}</span>
                        <span class="card-class">${escapeHtml(pg.className || pg.class || '?')} Lv.${pg.level || 1}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-icon-sm" data-action="edit" data-pg-id="${pg.id}" title="Modifica">✏️</button>
                        <button class="btn-icon-sm btn-level-up" data-action="level-up" data-pg-id="${pg.id}" title="Aumenta Livello">⬆️</button>
                        <button class="btn-icon-sm" data-action="combat" data-pg-id="${pg.id}" title="Aggiungi al Combat">⚔️</button>
                        <button class="btn-icon-sm btn-danger" data-action="delete" data-pg-id="${pg.id}" title="Elimina">🗑️</button>
                    </div>
                </div>
                <div class="card-player">${escapeHtml(pg.playerName || 'Nessun giocatore')}</div>
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
                        ${step === 7 ? '💾 Salva' : 'Avanti →'}
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
            { num: 5, label: 'Inventario' },
            { num: 6, label: 'Note' },
            { num: 7, label: 'Riepilogo' }
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
            5: 'Step 5: Inventario ed Equipaggiamento',
            6: 'Step 6: Note e Background',
            7: 'Riepilogo del Personaggio'
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
            case 1: return renderStep1Identity(pgData, databases, renderTraitsAndPrivileges(pgData, databases));
            case 2: return renderStep2Abilities(pgData, databases);
            case 3: return renderStep3Proficiencies(pgData, databases);
            case 4: return renderStep4Spells(pgData, databases);
            case 5: return renderStep5Inventory(pgData, databases);
            case 6: return renderStep6Notes(pgData);
            case 7: return renderStep7Summary(pgData, databases, renderTraitsAndPrivileges(pgData, databases));
            default: return '<p>Step non valido</p>';
        }
    }
    
    // ========================================================================
    // SCHEDA PG DETTAGLIO
    // ========================================================================
    
    renderCharacterSheet(pg, databases) {
        // Delega alla funzione nel modulo PgCharacterSheet
        return renderCharacterSheet(pg, databases);
    }

    // ========================================================================
    // LEVEL-UP WIZARD
    // ========================================================================

    /**
     * Renderizza il level-up wizard nel pannello destro.
     * @param {number} step - Lo step corrente (1 o 2)
     * @param {Object} levelUpData - Dati del level-up (incluso pg, currentLevel, newLevel, hasSpellStep, renderStep callback)
     * @returns {string} HTML
     */
    renderLevelUpWizard(step, levelUpData) {
        const pg = levelUpData.pg;
        const currentLevel = levelUpData.currentLevel;
        const newLevel = levelUpData.newLevel;
        const hasSpells = levelUpData.hasSpellStep;
        const totalSteps = hasSpells ? 2 : 1;
        const isLastStep = step >= totalSteps;

        return `
            <div class="pg-wizard level-up-wizard">
                <div class="wizard-header">
                    <div class="wizard-steps">
                        <div class="wizard-step active">
                            <div class="step-circle">${step > 1 ? '✓' : '1'}</div>
                            <span class="step-label">HP &amp; Caratteristiche</span>
                        </div>
                        ${hasSpells ? `
                        <div class="wizard-step ${step >= 2 ? 'active' : ''}">
                            <div class="step-circle">2</div>
                            <span class="step-label">Incantesimi</span>
                        </div>` : ''}
                    </div>
                    <h2 class="wizard-title">
                        ⬆️ Level Up: ${escapeHtml(pg.name)} — ${escapeHtml(pg.className || pg.class)}
                        <span class="level-change-display">
                            <span class="level-old">Lv.${currentLevel}</span>
                            <span class="level-arrow">→</span>
                            <span class="level-new">Lv.${newLevel}</span>
                        </span>
                    </h2>
                </div>
                <div class="wizard-content">
                    ${levelUpData.renderStep ? levelUpData.renderStep(step) : ''}
                </div>
                <div class="wizard-footer">
                    <button class="btn btn-secondary" id="btn-prev" ${step === 1 ? 'disabled' : ''}>
                        ← Indietro
                    </button>
                    <button class="btn btn-secondary" id="btn-cancel">
                        Annulla
                    </button>
                    <button class="btn btn-primary" id="btn-next">
                        ${isLastStep ? '✅ Conferma Level Up' : 'Avanti →'}
                    </button>
                </div>
            </div>
        `;
    }
    
    // ========================================================================
    // UTILITÀ
    // ========================================================================
    
    showLoading() {
        return `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Caricamento...</p>
            </div>
        `;
    }
}

console.log('🎨 [PgViewManager] Modulo caricato.');