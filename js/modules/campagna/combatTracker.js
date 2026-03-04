// modules/combatTracker.js

import { getCombatState, 
    clearCombat, 
    updateMonsterProperty, 
    removeMonsterFromCombat, 
    subscribe, 
    startCombat, 
    nextTurn, 
    useSpellSlot,
} from '../../../stateManager.js';
import { spellDatabase } from '../../../database/spells.js';
import { rollDice } from '../../../utils/dice.js';
import { linkifyConditions } from '../../../utils/htmlHelpers.js';
import { showToast } from '../../../utils/toast.js';

// --- CACHE PER LE STATISTICHE RIUTILIZZABILI ---
const resistancesCache = {};
const savesCache = {};
const speedCache = {};

// --- VARIABILI DI STATO LOCALE ---
let previousRound = 0;
let eventListenersAdded = false;

// --- FUNZIONI HELPER PER FORMATTARE LE STATISTICHE ---
function formatResistances(monster) {
    const cacheKey = `${monster.damage_immunities?.join('-')}-${monster.damage_resistances?.join('-')}-${monster.damage_vulnerabilities?.join('-')}`;
    if (resistancesCache[cacheKey]) return resistancesCache[cacheKey];

    const immunities = monster.damage_immunities?.join(', ') || 'Nessuna';
    const resistances = monster.damage_resistances?.join(', ') || 'Nessuna';
    const vulnerabilities = monster.damage_vulnerabilities?.join(', ') || 'Nessuna';
    
    const result = `
        <p><strong>Immunità:</strong> ${immunities}</p>
        <p><strong>Resistenze:</strong> ${resistances}</p>
        <p><strong>Vulnerabilità:</strong> ${vulnerabilities}</p>
    `;
    resistancesCache[cacheKey] = result;
    return result;
}

function formatSaves(monster) {
    if (!monster.proficiencies) return 'Nessuno';
    const cacheKey = monster.proficiencies.map(p => p.proficiency.name).join('-');
    if (savesCache[cacheKey]) return savesCache[cacheKey];

    const saves = {};
    monster.proficiencies.forEach(p => {
        if (p.proficiency.name.startsWith("Tiro Salvezza")) {
            const saveName = p.proficiency.name.split(": ")[1].substring(0, 3);
            saves[saveName] = p.value >= 0 ? `+${p.value}` : `${p.value}`;
        }
    });
    
    const positiveSaves = Object.entries(saves)
        .map(([name, bonus]) => `${name} ${bonus}`)
        .join(', ');
    
    const result = positiveSaves.length > 0 ? positiveSaves : 'Nessuno';
    savesCache[cacheKey] = result;
    return result;
}

function formatSpeed(monster) {
    const cacheKey = Object.keys(monster.speed || {}).join('-');
    if (speedCache[cacheKey]) return speedCache[cacheKey];

    const result = Object.entries(monster.speed || {}).map(([key, value]) => {
        const label = key === 'walk' || key === 'camminare' ? 'Camminata' : key.charAt(0).toUpperCase() + key.slice(1);
        return `${label} ${value}`;
    }).join(', ');
    
    speedCache[cacheKey] = result || '0 ft.';
    return result;
}

function formatSpecialActions(monster) {
    const actions = [];
    if (monster.special_abilities) actions.push(...monster.special_abilities);
    if (monster.legendary_actions) actions.push(...monster.legendary_actions);
    if (monster.reactions) actions.push(...monster.reactions);
    
    if (actions.length === 0) return 'Nessuna';
    return actions.map(action => {
        const cleanDesc = action.desc.replace(/'/g, "&apos;");
        return `<span class="special-action-link" data-name="${action.name}" data-desc="${cleanDesc}">${action.name}</span>`;
    }).join(', ');
}

function formatSpellsForCombat(combatant) {
    if (!combatant.spellState) return '';
    const { cantrips, preparedSpells, remainingSlots } = combatant.spellState;
    let html = '<div class="combatant-spells"><h5>Incantesimi</h5>';

    const findSpell = (name) => {
        const key = name.trim().toLowerCase();
        return Object.values(spellDatabase).find(s => s.name.toLowerCase() === key);
    };

    if (cantrips?.length > 0) {
        html += '<div class="spell-section"><h6>Trucchetti</h6>';
        html += cantrips.map(c => {
            const s = findSpell(c.name);
            if (!s) return '';
            const cleanDesc = s.description.replace(/'/g, "&apos;");
            return `<span class="special-action-link" data-name="${s.name}" data-desc="${cleanDesc}">${s.name}</span>`;
        }).filter(Boolean).join(', ');
        html += '</div>';
    }

    if (preparedSpells?.length > 0) {
        html += '<div class="spell-section"><h6>Preparati</h6>';
        html += `<div class="spell-slots-info">Slots: ${Object.entries(remainingSlots).map(([l, c]) => `L${l}: ${c}`).join(' | ')}</div>`;
        html += '<div class="spell-buttons">';
        preparedSpells.forEach(p => {
            const sData = findSpell(p.name);
            if (!sData) return;
            const isDisabled = remainingSlots[sData.level] <= 0;
            html += `<button class="spell-btn" ${isDisabled ? 'disabled' : ''} data-monster-id="${combatant.id}" data-spell-level="${sData.level}" title="${sData.name}">${sData.name}</button>`;
        });
        html += '</div></div>';
    }
    return html + '</div>';
}

// --- OGGETTO PRINCIPALE ---
const CombatTracker = {
    render(containerElement) {
        containerElement.innerHTML = `
            <div class="combat-tracker-container">
                <div class="tracker-header">
                    <h2>Combat Tracker</h2>
                    <div class="header-controls">
                        <div class="round-counter">
                            <label>Round:</label>
                            <input type="number" id="round-input" value="0" min="0">
                        </div>
                        <button id="start-combat-btn" class="action-btn">Inizia</button>
                        <button id="next-turn-btn" class="action-btn">Prossimo Turno</button>
                        <button id="clear-combat-btn" class="reset-filters-btn">Svuota</button>
                    </div>
                </div>
                <div class="combat-main-layout">
                    <div class="combatant-order-column">
                        <h3>Iniziativa</h3>
                        <div id="combatants-order-list" class="combatant-order-list"></div>
                    </div>
                    <div class="combatant-detail-column"></div>
                </div>
            </div>
        `;

        const orderList = containerElement.querySelector('#combatants-order-list');
        const detailColumn = containerElement.querySelector('.combatant-detail-column');
        const roundInput = containerElement.querySelector('#round-input');

        const setupEventListeners = () => {
            if (eventListenersAdded) return;

            containerElement.querySelector('#start-combat-btn').addEventListener('click', () => {
                startCombat();
                showToast('Inizio!', 'success');
            });

            containerElement.querySelector('#next-turn-btn').addEventListener('click', nextTurn);

            containerElement.querySelector('#clear-combat-btn').addEventListener('click', () => {
                if (confirm('Svuotare il combattimento?')) clearCombat();
            });

            // Delegation per colonna dettagli
            detailColumn.addEventListener('click', (e) => {
                const card = e.target.closest('.combatant-card');
                if (!card) return;
                const mId = parseFloat(card.dataset.id);

                if (e.target.classList.contains('remove-combatant-btn')) {
                    removeMonsterFromCombat(mId);
                } else if (e.target.classList.contains('attack-btn')) {
                    const attack = JSON.parse(e.target.dataset.attack.replace(/&apos;/g, "'"));
                    const hit = rollDice('1d20') + attack.attack_bonus;
                    const dmg = attack.damage?.map(d => `${rollDice(d.damage_dice)} ${d.damage_type.name}`).join(' + ') || 'N/A';
                    document.getElementById(`results-${mId}`).innerHTML += `<p><strong>${attack.name}</strong>: 🎯 ${hit} | 💥 ${dmg}</p>`;
                } else if (e.target.classList.contains('spell-btn')) {
                    useSpellSlot(mId, parseInt(e.target.dataset.spellLevel, 10));
                } else if (e.target.classList.contains('condition-dropdown-toggle')) {
                    card.querySelector('.condition-dropdown-menu').classList.toggle('show');
                } else if (e.target.classList.contains('condition-item')) {
                    const cond = e.target.dataset.condition;
                    const combatant = getCombatState().find(m => m.id === mId);
                    if (combatant && !combatant.conditions?.includes(cond)) {
                        const newConds = [...(combatant.conditions || []), cond];
                        updateMonsterProperty(mId, 'conditions', newConds);
                    }
                } else if (e.target.classList.contains('remove-condition')) {
                    const cond = e.target.closest('.condition-badge').dataset.condition;
                    const combatant = getCombatState().find(m => m.id === mId);
                    updateMonsterProperty(mId, 'conditions', combatant.conditions.filter(c => c !== cond));
                }
            });

            detailColumn.addEventListener('change', (e) => {
                const card = e.target.closest('.combatant-card');
                if (!card) return;
                const mId = parseFloat(card.dataset.id);
                const val = e.target.value;

                if (e.target.classList.contains('hp-input')) updateMonsterProperty(mId, 'currentHp', parseInt(val, 10));
                if (e.target.classList.contains('initiative-input')) updateMonsterProperty(mId, 'initiative', parseInt(val, 10));
            });

            // Hover Tooltip
            detailColumn.addEventListener('mouseover', (e) => {
                if (e.target.classList.contains('special-action-link')) {
                    const { name, desc } = e.target.dataset;
                    const tip = document.createElement('div');
                    tip.className = 'ability-tooltip';
                    tip.innerHTML = `<h4>${name}</h4><p>${desc}</p>`;
                    document.body.appendChild(tip);
                    const rect = e.target.getBoundingClientRect();
                    tip.style.left = `${rect.left + window.scrollX}px`;
                    tip.style.top = `${rect.bottom + window.scrollY + 5}px`;
                }
            });

            detailColumn.addEventListener('mouseout', (e) => {
                if (e.target.classList.contains('special-action-link')) {
                    document.querySelectorAll('.ability-tooltip').forEach(t => t.remove());
                }
            });

            eventListenersAdded = true;
        };

        const renderUI = (combatants, currentRound, currentTurnMonsterId, initiativeOrder) => {
            if (combatants.length === 0) {
                orderList.innerHTML = '<p>Vuoto</p>';
                detailColumn.innerHTML = '<p>Aggiungi mostri per iniziare.</p>';
                return;
            }

            // Logica ordinamento
            const sorted = (currentRound === 0) 
                ? [...combatants].sort((a,b) => (b.initiative || 0) - (a.initiative || 0))
                : initiativeOrder;

            // Render Lista Ordine
            orderList.innerHTML = sorted.map(c => `
                <div class="combatant-order-item ${c.id === currentTurnMonsterId ? 'active-turn' : ''}">
                    <strong>${c.customName}</strong><br><small>Iniz: ${c.initiative || 0}</small>
                </div>
            `).join('');

            // Render Dettaglio Attivo
            const active = combatants.find(c => c.id === currentTurnMonsterId);
            if (active && currentRound > 0) {
                const conditionList = ["Accecato", "Affascinato", "Afferrato", "Assordato", "Avvelenato", "Inabile", "Intralciato", "Invisibile", "Paralizzato", "Pietrificato", "Prono", "Spaventato", "Stordito", "Svenuto"];
                
                detailColumn.innerHTML = `
                    <div class="combatant-card" data-id="${active.id}">
                        <h4>${active.customName} (CR ${active.challenge_rating})</h4>
                        <div class="stat-row">
                            HP: <input type="number" class="hp-input" value="${active.currentHp}"> / ${active.maxHp}
                            AC: ${active.armor_class[0]?.value || 10}
                            Init: <input type="number" class="initiative-input" value="${active.initiative || ''}">
                        </div>
                        <div class="conditions-area">
                            ${(active.conditions || []).map(c => `<span class="condition-badge" data-condition="${c}">${c} <i class="remove-condition">×</i></span>`).join('')}
                        </div>
                        <div class="actions-area">
                            <h5>Azioni</h5>
                            ${(active.actions || []).filter(a => a.attack_bonus !== undefined).map(a => `
                                <button class="attack-btn" data-attack='${JSON.stringify(a).replace(/'/g, "&apos;")}'>${a.name}</button>
                            `).join('')}
                        </div>
                        <div id="results-${active.id}" class="results-box"></div>
                        ${formatSpellsForCombat(active)}
                        <div class="dropdown-container">
                             <button class="condition-dropdown-toggle">Add Condition</button>
                             <div class="condition-dropdown-menu">
                                ${conditionList.map(cl => `<div class="condition-item" data-condition="${cl}">${cl}</div>`).join('')}
                             </div>
                        </div>
                        <button class="remove-combatant-btn">Rimuovi dal Combattimento</button>
                    </div>
                `;
            }
        };

        subscribe((combatants, currentRound, currentTurnMonsterId, initiativeOrder) => {
            if (currentRound > previousRound && currentRound > 1) {
                showToast(`Round ${currentRound}`, 'info');
            }
            previousRound = currentRound;
            if (roundInput) roundInput.value = currentRound;

            renderUI(combatants, currentRound, currentTurnMonsterId, initiativeOrder);
            setupEventListeners();
        });
    }
};

export default CombatTracker;