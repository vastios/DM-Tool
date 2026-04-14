// js/modules/combatTracker.js

import { 
    subscribe, 
    getCombatState, 
    nextTurn, 
    startCombat, 
    clearCombat, 
    updateMonsterProperty,
} from '../../../stateManager.js';
import { conditionsDatabase } from '../../conditions.js';
import { rollDice } from '../../../utils/dice.js';
import { showToast } from '../../../utils/toast.js';
import { linkifyConditions, escapeHtml } from '../../../utils/htmlHelpers.js';

const CombatTracker = {
    render(containerElement) {
        // Inizializza lo stato locale del modulo
        let combatants = [];
        let currentRound = 0;
        let currentTurnMonsterId = null;
        let initiativeOrder = [];

        // --- FUNZIONI DI RENDERING ---

        // Renderizza l'intero layout del tracker
        const render = () => {
            containerElement.innerHTML = `
                <div class="combat-tracker-container">
                    <div class="tracker-header">
                        <div class="header-controls">
                            <div class="round-counter">
                                <label for="round-input">Round:</label>
                                <input type="number" id="round-input" value="${currentRound}" min="0">
                            </div>
                            <button id="start-combat-btn" class="action-btn" ${currentRound > 0 ? 'disabled' : ''}>Inizia Combattimento</button>
                            <button id="next-turn-btn" class="action-btn" ${currentRound === 0 ? 'disabled' : ''}>Prossimo Turno</button>
                            <button id="clear-combat-btn" class="action-btn danger">Svuota Tracker</button>
                        </div>
                    </div>
                    <div class="combat-main-layout">
                        <div class="combatant-order-column">
                            <h3>Ordine di Iniziativa</h3>
                            <ul id="combatant-order-list" class="combatant-order-list"></ul>
                        </div>
                        <div class="combatant-detail-column">
                            <div id="combatant-detail-view">
                                <p>Seleziona un combattente o inizia un nuovo combattimento.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            setupEventListeners();
            renderOrderList();
            renderDetailView();
        };

        // Renderizza la lista dell'ordine di iniziativa (colonna sinistra)
        const renderOrderList = () => {
            const orderList = containerElement.querySelector('#combatant-order-list');
            if (!orderList) return;

            orderList.innerHTML = '';
            if (initiativeOrder.length === 0) {
                orderList.innerHTML = '<p style="text-align:center; color:#888;">Nessun combattente in lista.</p>';
                return;
            }

            initiativeOrder.forEach(combatant => {
                const li = document.createElement('li');
                li.className = 'combatant-order-item';
                if (combatant.id === currentTurnMonsterId) {
                    li.classList.add('active-turn');
                }
                li.dataset.combatantId = combatant.id;

                const hpPercentage = (combatant.currentHp / combatant.maxHp) * 100;
                const hpColor = hpPercentage > 50 ? '#28a745' : hpPercentage > 25 ? '#ffc107' : '#dc3545';

                li.innerHTML = `
                    <div class="order-name">${escapeHtml(combatant.customName)}</div>
                    <div class="order-stats">
                        <span class="order-initiative">INI: ${combatant.initiative}</span>
                        <span class="order-hp" style="color: ${hpColor};">PF: ${combatant.currentHp}/${combatant.maxHp}</span>
                    </div>
                    <div class="order-conditions">
                        ${combatant.conditions.map(cond => `<span class="condition-badge">${cond}</span>`).join('')}
                    </div>
                `;
                orderList.appendChild(li);
            });
        };

        // Renderizza i dettagli del combattente attivo (colonna destra)
        const renderDetailView = () => {
            const detailView = containerElement.querySelector('#combatant-detail-view');
            if (!detailView) return;

            const activeCombatant = combatants.find(c => c.id === currentTurnMonsterId);

            if (!activeCombatant) {
                detailView.innerHTML = `<p style="text-align: center; margin-top: 3rem;">Nessun combattente attivo o nessun combattimento in corso.</p>`;
                return;
            }

            const getModString = (score) => (score >= 10 ? '+' : '') + Math.floor((score - 10) / 2);
            const ac = activeCombatant.armor_class[0]?.value || 'N/A';

            detailView.innerHTML = `
                <div class="combatant-card active-turn">
                    <div class="combatant-header">
                        <input type="text" class="custom-name-input" value="${escapeHtml(activeCombatant.customName)}" data-monster-id="${activeCombatant.id}">
                        <span class="combatant-cr">CR ${activeCombatant.challenge_rating}</span>
                    </div>
                    <div class="combatant-stats">
                        <div class="stat-input hp">
                            <label>PF:</label>
                            <input type="number" class="current-hp-input" value="${activeCombatant.currentHp}" data-monster-id="${activeCombatant.id}">
                            <span class="hp-separator">/</span>
                            <span class="max-hp">${activeCombatant.maxHp}</span>
                        </div>
                        <div class="stat-input">
                            <label>CA:</label>
                            <span>${ac}</span>
                        </div>
                    </div>
                    <div class="combatant-quick-info">
                        <div class="info-section">
                            <h6>Tipologia</h6>
                            <p>${activeCombatant.size} ${activeCombatant.type}, ${activeCombatant.alignment}</p>
                        </div>
                        <div class="info-section">
                            <h6>Percezione</h6>
                            <p>${activeCombatant.senses['Percezione passiva'] || 'N/A'}</p>
                        </div>
                    </div>
                    <div class="combatant-abilities-grid">
                        <div><strong>FOR</strong> ${activeCombatant.strength} (${getModString(activeCombatant.strength)})</div>
                        <div><strong>DES</strong> ${activeCombatant.dexterity} (${getModString(activeCombatant.dexterity)})</div>
                        <div><strong>COS</strong> ${activeCombatant.constitution} (${getModString(activeCombatant.constitution)})</div>
                        <div><strong>INT</strong> ${activeCombatant.intelligence} (${getModString(activeCombatant.intelligence)})</div>
                        <div><strong>SAG</strong> ${activeCombatant.wisdom} (${getModString(activeCombatant.wisdom)})</div>
                        <div><strong>CAR</strong> ${activeCombatant.charisma} (${getModString(activeCombatant.charisma)})</div>
                    </div>
                    
                    <div class="combatant-details">
                        ${renderActionsSection(activeCombatant)}
                        ${renderSpellsSection(activeCombatant)}
                        ${renderConditionsSection(activeCombatant)}
                    </div>
                </div>
            `;
        };

        // Helper per renderizzare la sezione Azioni
        const renderActionsSection = (combatant) => {
            if (!combatant.actions || combatant.actions.length === 0) return '';

            let html = `
                <div class="combatant-attacks">
                    <h5>Azioni</h5>
                    <div class="attack-buttons">
            `;
            
            combatant.actions.forEach(action => {
                html += `<button class="attack-btn" data-action-name="${escapeHtml(action.name)}">${escapeHtml(action.name)}</button>`;
            });

            html += `
                    </div>
                    <div class="attack-results-container"></div>
                </div>
            `;
            return html;
        };

        // Helper per renderizzare la sezione Incantesimi
        const renderSpellsSection = (combatant) => {
            if (!combatant.spellState) return '';

            let html = `
                <div class="combatant-spells">
                    <h5>Incantesimi</h5>
            `;

            // Slot rimanenti
            if (combatant.spellState.remainingSlots) {
                html += '<div class="spell-slots-info">';
                for (const level in combatant.spellState.remainingSlots) {
                    if (level > 0) {
                        html += `Liv. ${level}: ${combatant.spellState.remainingSlots[level]}/${combatant.spellState.slots[level]} | `;
                    }
                }
                html += '</div>';
            }

            // Pulsanti incantesimi
            if (combatant.spellState.preparedSpells && combatant.spellState.preparedSpells.length > 0) {
                html += '<div class="spell-buttons">';
                combatant.spellState.preparedSpells.forEach(spell => {
                    html += `<button class="spell-btn" data-spell-name="${escapeHtml(spell.name)}">${escapeHtml(spell.name)}</button>`;
                });
                html += '</div>';
            }
            
            html += '</div>';
            return html;
        };

        // Helper per renderizzare la sezione Condizioni
        const renderConditionsSection = (combatant) => {
            const allConditions = Object.keys(conditionsDatabase);
            
            let html = `
                <div class="combatant-special-actions">
                    <h5>Condizioni</h5>
                    <div class="condition-dropdown-container">
                        <button class="condition-dropdown-toggle">Aggiungi Condizione</button>
                        <div class="condition-dropdown-menu">
            `;
            
            allConditions.forEach(condition => {
                html += `<div class="condition-item" data-condition="${condition}">${condition}</div>`;
            });

            html += `
                        </div>
                    </div>
                    <div class="active-conditions-container">
            `;

            combatant.conditions.forEach(condition => {
                html += `<span class="condition-badge">${condition} <span class="remove-condition" data-condition="${condition}">×</span></span>`;
            });

            html += `
                    </div>
                </div>
            `;
            return html;
        };


        // --- FUNZIONI DI GESTIONE EVENTI ---

        const setupEventListeners = () => {
            // Header buttons
            containerElement.querySelector('#start-combat-btn')?.addEventListener('click', () => {
                startCombat();
                showToast("Combattimento iniziato!", 'success');
            });

            containerElement.querySelector('#next-turn-btn')?.addEventListener('click', () => {
                nextTurn();
            });

            containerElement.querySelector('#clear-combat-btn')?.addEventListener('click', () => {
                if (confirm("Sei sicuro di voler svuotare il tracker? Questa azione non può essere annullata.")) {
                    clearCombat();
                    showToast("Tracker svuotato.", 'warning');
                }
            });

            containerElement.querySelector('#round-input')?.addEventListener('change', (e) => {
                // Nota: questo aggiorna solo l'input, non lo stato globale.
                // Per aggiornare lo stato globale, bisognerebbe chiamare una funzione apposita in stateManager
                // o gestirlo tramite la sottoscrizione. Per ora, lo lascio come semplice modifica UI.
                // updateMonsterProperty(null, 'round', parseInt(e.target.value, 10)); 
            });
            
            // Click sulla lista ordine
            containerElement.querySelector('#combatant-order-list')?.addEventListener('click', (e) => {
                const li = e.target.closest('.combatant-order-item');
                if (li) {
                    const clickedId = li.dataset.combatantId;
                    // Aggiorna il turno attivo per mostrare i dettagli di quel combattente
                    // Nota: questo non aggiorna lo stato globale, solo la vista
                    currentTurnMonsterId = clickedId;
                    renderDetailView();
                }
            });

            // Eventi delegati nel dettaglio (per input e bottoni dinamici)
            containerElement.querySelector('#combatant-detail-view')?.addEventListener('click', handleDetailViewClick);
            containerElement.querySelector('#combatant-detail-view')?.addEventListener('change', handleDetailViewChange);
            containerElement.querySelector('#combatant-detail-view')?.addEventListener('input', handleDetailViewInput);
        };

        const handleDetailViewClick = (e) => {
            const combatantId = e.target.closest('.combatant-card')?.dataset.monsterId || currentTurnMonsterId;
            
            // Bottoni azione
            if (e.target.classList.contains('attack-btn')) {
                const actionName = e.target.dataset.actionName;
                const combatant = combatants.find(c => c.id === combatantId);
                const action = combatant.actions.find(a => a.name === actionName);
                if (action) {
                    performAttack(action, combatant);
                }
            }

            // Bottoni incantesimo
            if (e.target.classList.contains('spell-btn')) {
                const spellName = e.target.dataset.spellName;
                const combatant = combatants.find(c => c.id === combatantId);
                const spell = combatant.spellState.preparedSpells.find(s => s.name === spellName);
                if (spell) {
                    castSpell(spell, combatant);
                }
            }

            // Rimozione condizione
            if (e.target.classList.contains('remove-condition')) {
                const condition = e.target.dataset.condition;
                updateMonsterProperty(combatantId, 'conditions', combatantId ? 
                    combatants.find(c => c.id === combatantId).conditions.filter(c => c !== condition) : 
                    []);
            }
        };
        
        const handleDetailViewChange = (e) => {
            const combatantId = e.target.dataset.monsterId;
            if (e.target.classList.contains('current-hp-input')) {
                const newHp = parseInt(e.target.value, 10);
                updateMonsterProperty(combatantId, 'currentHp', newHp);
            }
        };

        const handleDetailViewInput = (e) => {
            if (e.target.classList.contains('custom-name-input')) {
                const combatantId = e.target.dataset.monsterId;
                updateMonsterProperty(combatantId, 'customName', e.target.value);
            }
        };

        // --- FUNZIONI DI LOGICA DI GIOCO ---

        const performAttack = (action, combatant) => {
            const resultsContainer = containerElement.querySelector('.attack-results-container');
            if (!resultsContainer) return;

            let attackRoll = rollDice('1d20');
            let damageRoll = 0;
            let damageText = '';

            if (action.attack_bonus !== undefined) {
                const bonus = action.attack_bonus >= 0 ? `+${action.attack_bonus}` : `${action.attack_bonus}`;
                attackRoll += action.attack_bonus;
                const resultText = attackRoll >= 20 ? 'COLPO CRITICO!' : (attackRoll === 1 ? 'FALLIMENTO CRITICO!' : `Tiro per colpire: ${attackRoll}`);
                
                if (action.damage && action.damage.length > 0) {
                    action.damage.forEach(d => {
                        const dmg = rollDice(d.damage_dice);
                        damageRoll += dmg;
                        damageText += `${dmg} danni da ${d.damage_type.name} `;
                    });
                    if (attackRoll === 1) damageText = "Nessun danno (fallimento critico).";
                }

                const resultHtml = `
                    <p>
                        <span class="attack-name">${action.name}:</span> 
                        <span class="attack-to-hit">${resultText}</span>
                        <br>${damageText}
                    </p>
                `;
                resultsContainer.innerHTML = resultHtml + resultsContainer.innerHTML;
            }
        };

        const castSpell = (spell, combatant) => {
            const resultsContainer = containerElement.querySelector('.attack-results-container');
            if (!resultsContainer) return;
            
            const spellLevel = spell.level;
            if (spellLevel > 0) {
                const slots = combatant.spellState.remainingSlots;
                if (slots[spellLevel] > 0) {
                    // Questa logica è più complessa, stateManager non ha una funzione dedicata per questo
                    // Per ora, mostriamo solo una notifica. Una implementazione completa richiederebbe
                    // di aggiornare lo stato spellState nel combatant.
                    showToast(`${combatant.customName} lancia ${spell.name}. (Gestione slot da implementare)`, 'info');
                } else {
                    showToast(`Slot di livello ${spellLevel} esauriti per ${combatant.customName}.`, 'error');
                    return;
                }
            }
            
            const resultHtml = `<p><span class="attack-name">${spell.name}:</span> Lanciato.</p>`;
            resultsContainer.innerHTML = resultHtml + resultsContainer.innerHTML;
        };


        // --- SOTTOSCRIZIONE ALLO STATO GLOBALE ---
        // Questa è la funzione magica che tiene il modulo sincronizzato con stateManager.js
        const onStateChange = (newCombatants, newRound, newTurnId, newInitiativeOrder) => {
            combatants = newCombatants;
            currentRound = newRound;
            currentTurnMonsterId = newTurnId;
            initiativeOrder = newInitiativeOrder;
            
            // Aggiorna l'input del round se l'utente non lo sta modificando
            const roundInput = containerElement.querySelector('#round-input');
            if (roundInput && document.activeElement !== roundInput) {
                roundInput.value = currentRound;
            }

            renderOrderList();
            renderDetailView();
        };

        subscribe(onStateChange);

        // Render iniziale
        render();
    }
};

export default CombatTracker;