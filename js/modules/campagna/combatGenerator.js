// modules/combatGenerator.js

import { monsterDatabase } from '../../../database/monsterDatabase.js';
import { addMonsterToCombat } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js'; // <<< NUOVO IMPORT

// --- SOGLIE DI XP PER LA CREAZIONE DI INCONTRI (Basate sul Manuale del Dungeon Master) ---
// Le chiavi sono i livelli dei personaggi (1-20)
const xpThresholds = {
    1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
    2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
    3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
    4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
    5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
    6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
    7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
    8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
    9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
    10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
    11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
    12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
    13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 }, // Nota: c'era un errore nel DMG, corretto in errata
    14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
    15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
    16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
    17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
    18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
    19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
    20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 }
};

// --- MOLTIPLICATORI PER L'XP AGGIUSTATO ---
// Basati sul numero di mostri nell'incontro
const xpMultipliers = {
    1: 1,
    2: 1.5,
    '3-6': 2,
    '7-10': 2.5,
    '11-14': 3,
    '15+': 4
};

const CombatGenerator = {
    render(containerElement) {
        // --- 1. OTTIENE I TIPI DI MOSTRI UNICI PER IL FILTRO ---
        const monsterTypes = [...new Set(monsterDatabase.map(m => m.type))].sort();

        containerElement.innerHTML = `
            <div class="combat-generator-container">
                <h2>Generatore di Combattimenti</h2>
                <div class="generator-inputs">
                    <div class="input-group">
                        <label for="party-level">Livello Medio Gruppo:</label>
                        <input type="number" id="party-level" min="1" max="20" value="5">
                    </div>
                    <div class="input-group">
                        <label for="party-size">Numero di Giocatori:</label>
                        <input type="number" id="party-size" min="1" max="10" value="4">
                    </div>
                    <div class="input-group">
                        <label for="encounter-difficulty">Difficoltà:</label>
                        <select id="encounter-difficulty">
                            <option value="easy">Facile</option>
                            <option value="medium" selected>Media</option>
                            <option value="hard">Difficile</option>
                            <option value="deadly">Mortale</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="monster-type-filter">Tipo di Mostro (Opzionale):</label>
                        <select id="monster-type-filter">
                            <option value="Tutti">Tutti</option>
                            ${monsterTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="min-monsters">Numero Min. Mostri:</label>
                        <input type="number" id="min-monsters" min="1" max="20" value="1">
                    </div>
                    <div class="input-group">
                        <label for="max-monsters">Numero Max. Mostri:</label>
                        <input type="number" id="max-monsters" min="1" max="20" value="3">
                    </div>
                </div>
                <button id="generate-btn" class="generate-btn-large">Genera Combattimenti</button>
                
                <div id="encounter-output-container" class="hidden">
                    <div id="encounters-grid"></div>
                </div>
            </div>
        `;

        const generateBtn = containerElement.querySelector('#generate-btn');
        const outputContainer = containerElement.querySelector('#encounter-output-container');
        const encountersGrid = containerElement.querySelector('#encounters-grid');

        // --- FUNZIONE PRINCIPALE DI GENERAZIONE (ORA GENERA PIÙ OPZIONI) ---
        function generateEncounters() {
            const partyLevel = parseInt(containerElement.querySelector('#party-level').value, 10);
            const partySize = parseInt(containerElement.querySelector('#party-size').value, 10);
            const difficulty = containerElement.querySelector('#encounter-difficulty').value;
            const monsterTypeFilter = containerElement.querySelector('#monster-type-filter').value;
            const minMonsters = parseInt(containerElement.querySelector('#min-monsters').value, 10);
            const maxMonsters = parseInt(containerElement.querySelector('#max-monsters').value, 10);

            // <<< INTEGRAZIONE DELLA TOAST NOTIFICATION
            if (!xpThresholds[partyLevel]) { 
                showToast("Livello gruppo non valido.", 'error'); 
                return; 
            }
            // <<< INTEGRAZIONE DELLA TOAST NOTIFICATION
            if (minMonsters > maxMonsters) { 
                showToast("Il numero minimo non può essere maggiore del massimo.", 'error'); 
                return; 
            }

            const totalXpBudget = xpThresholds[partyLevel][difficulty] * partySize;
            
            // Filtra i mostri in base al tipo selezionato
            let eligibleMonsters = monsterDatabase.filter(m => {
                const cr = parseFloat(m.challenge_rating);
                const isCrValid = cr >= 0.125 && cr <= Math.min(partyLevel + 2, 30);
                const isTypeValid = monsterTypeFilter === 'Tutti' || m.type === monsterTypeFilter;
                return isCrValid && isTypeValid;
            });

            if (eligibleMonsters.length === 0) {
                // <<< INTEGRAZIONE DELLA TOAST NOTIFICATION
                showToast("Nessun mostro appropriato trovato con questi filtri.", 'warning');
                return;
            }
            
            // Ordina i mostri per XP crescente. È fondamentale per la logica costruttiva.
            eligibleMonsters.sort((a, b) => a.xp - b.xp);

            const encounterOptions = [];
            for (let i = 0; i < 5; i++) {
                const encounter = buildSingleEncounter(eligibleMonsters, totalXpBudget, minMonsters, maxMonsters);
                if (encounter) {
                    encounterOptions.push(encounter);
                }
            }
            
            displayEncounterOptions(encounterOptions);
        }

        // --- NUOVA FUNZIONE "INTELLIGENTE" PER COSTRUIRE UN SINGOLO INCONTRO ---
        function buildSingleEncounter(monsters, xpBudget, minCount, maxCount) {
            // 1. Scegli un numero target di mostri nel range dato per calcolare un moltiplicatore iniziale
            const targetMonsterCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
            const estimatedMultiplier = getAdjustedXpMultiplier(targetMonsterCount);

            // 2. Calcola il target di XP non aggiustato che dobbiamo cercare di raggiungere
            const unadjustedXpTarget = xpBudget / estimatedMultiplier;

            let encounterMonsters = [];
            let currentUnadjustedXp = 0;
            let attempts = 0;
            const maxAttempts = 100; // Previene loop infiniti in casi limite

            // 3. Costruisci l'incontro aggiungendo mostri finché non raggiungiamo il target
            while (currentUnadjustedXp < unadjustedXpTarget && encounterMonsters.length < maxCount && attempts < maxAttempts) {
                attempts++;
                
                const remainingBudget = unadjustedXpTarget - currentUnadjustedXp;
                
                // Trova tutti i mostri che possiamo permetterci con il budget rimanente
                const candidateMonsters = monsters.filter(m => m.xp <= remainingBudget);

                if (candidateMonsters.length === 0) {
                    // Non possiamo aggiungere altri mostri senza superare il target, usciamo dal ciclo
                    break;
                }
                
                // Aggiunge un po' di casualità, dando più peso ai mostri più "adatti" al budget rimanente
                // ma senza escludere quelli più deboli
                const sortedCandidates = candidateMonsters.sort((a, b) => b.xp - a.xp);
                const topCandidates = sortedCandidates.slice(0, Math.ceil(sortedCandidates.length / 2));
                const randomMonster = topCandidates[Math.floor(Math.random() * topCandidates.length)];
                
                encounterMonsters.push(randomMonster);
                currentUnadjustedXp += randomMonster.xp;
            }

            // 4. Calcolo finale e validazione dell'incontro generato
            const finalMultiplier = getAdjustedXpMultiplier(encounterMonsters.length);
            const finalAdjustedXp = currentUnadjustedXp * finalMultiplier;

            // L'incontro è valido se rispetta il budget e il numero di mostri richiesti
            const isValidXp = finalAdjustedXp > 0 && finalAdjustedXp <= xpBudget * 1.25; // Un po' di flessibilità
            const isValidCount = encounterMonsters.length >= minCount && encounterMonsters.length <= maxCount;

            if (isValidXp && isValidCount) {
                return { monsters: encounterMonsters, xp: finalAdjustedXp };
            }
            
            return null; // Non è stato possibile generare un incontro valido
        }
        
        // --- FUNZIONI HELPER (Invariate o leggermente modificate) ---
        function getAdjustedXpMultiplier(numMonsters) {
            if (numMonsters === 0) return 1; // Evita problemi con incontri vuoti
            if (numMonsters === 1) return xpMultipliers[1];
            if (numMonsters === 2) return xpMultipliers[2];
            if (numMonsters >= 3 && numMonsters <= 6) return xpMultipliers['3-6'];
            if (numMonsters >= 7 && numMonsters <= 10) return xpMultipliers['7-10'];
            if (numMonsters >= 11 && numMonsters <= 14) return xpMultipliers['11-14'];
            return xpMultipliers['15+'];
        }

        function displayEncounterOptions(options) {
            encountersGrid.innerHTML = '';
            if (options.length === 0) {
                encountersGrid.innerHTML = '<p>Impossibile generare incontri validi con questi parametri. Prova ad allargare i filtri o aumentare il numero massimo di mostri.</p>';
            } else {
                options.forEach((option, index) => {
                    const card = document.createElement('div');
                    card.className = 'encounter-card';
                    
                    const monsterCounts = option.monsters.reduce((acc, monster) => {
                        acc[monster.name] = (acc[monster.name] || 0) + 1;
                        return acc;
                    }, {});
                    
                    let listHTML = '';
                    for (const [name, count] of Object.entries(monsterCounts)) {
                        const monster = option.monsters.find(m => m.name === name);
                        listHTML += `<li>${count}x ${name} (CR ${monster.challenge_rating})</li>`;
                    }
                    
                    const formattedXp = option.xp.toLocaleString('it-IT');

                    card.innerHTML = `
                        <h4>Opzione ${index + 1}</h4>
                        <ul>${listHTML}</ul>
                        <p>XP Aggiustato: ${formattedXp}</p>
                        <button class="action-btn import-encounter-btn">Importa Incontro</button>
                    `;
                    
                    // Salva i dati dell'opzione direttamente sull'elemento della card per un facile recupero
                    card.optionData = option;
                    encountersGrid.appendChild(card);
                });
            }
            outputContainer.classList.remove('hidden');
        }

        // --- EVENT LISTENERS ---
        generateBtn.addEventListener('click', generateEncounters);

        // <<< INTEGRAZIONE DELLA TOAST NOTIFICATION
        // NUOVO: Event listener per l'importazione degli incontri
        encountersGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('import-encounter-btn')) {
                const card = e.target.closest('.encounter-card');
                if (card && card.optionData) {
                    const monstersToAdd = card.optionData.monsters;
                    monstersToAdd.forEach(monster => addMonsterToCombat(monster));
                    showToast('Incontro importato con successo!', 'success');
                }
            }
        });
    }
};

export default CombatGenerator;