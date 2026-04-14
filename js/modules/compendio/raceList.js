// modules/raceList.js

import { raceDatabase } from '../../../database/races.js';
import { subraceDatabase } from '../../../database/subraces.js';
import { traitsDatabase } from '../../../database/traits.js';
import { linkifyConditions } from '../../../utils/htmlHelpers.js';

const RaceList = {
    render(containerElement) {
        let activeRaceIndex = null;

        containerElement.innerHTML = `
            <div class="race-page-layout">
                <aside class="race-sidebar">
                    <div class="search-wrapper">
                        <input type="text" id="race-search" class="phb-search" placeholder="Cerca razza..." autocomplete="off">
                    </div>
                    <ul class="race-selection-list" id="race-items-list"></ul>
                </aside>
                <main class="race-phb-content phb-style" id="race-details">
                    <div class="phb-empty-state">
                        <p>Seleziona una Stirpe dagli Archivi</p>
                    </div>
                </main>
            </div>
        `;

        const listContainer = containerElement.querySelector('#race-items-list');
        const detailsElement = containerElement.querySelector('#race-details');
        const searchInput = containerElement.querySelector('#race-search');

        // --- FUNZIONE CORRETTA E MIGLIORATA ---
        const getTraitContent = (traitRef) => {
            // Controlla se i dati di riferimento sono validi
            if (!traitRef || !traitRef.index) {
                console.error("getTraitContent: traitRef o traitRef.index è mancante.", traitRef);
                return "Dati del tratto non validi.";
            }

            // 1. Ricerca per INDICE (metodo più affidabile)
            let found = traitsDatabase.find(t => t && t.index === traitRef.index);
            
            if (found) {
                return Array.isArray(found.desc) ? found.desc.join(' ') : found.desc;
            }

            // 2. Ricerca per NOME ESATTO (fallback)
            if (traitRef.name) {
                found = traitsDatabase.find(t => t && t.name && t.name.toLowerCase() === traitRef.name.toLowerCase());
                if (found) {
                    return Array.isArray(found.desc) ? found.desc.join(' ') : found.desc;
                }
            }
            
            // 3. Se non viene trovato in nessun caso, restituisce un errore dettagliato
            console.error(`Tratto non trovato. Indice: ${traitRef.index}, Nome: ${traitRef.name}`);
            return `Descrizione non trovata per il tratto "${traitRef.name}" (indice: ${traitRef.index}). Controlla il file traits.js.`;
        };

        const renderList = (filter = '') => {
            const filteredRaces = raceDatabase.filter(r => r.name && r.name.toLowerCase().includes(filter.toLowerCase()));
            listContainer.innerHTML = filteredRaces.map(race => `
                <li data-index="${race.index}" class="${activeRaceIndex === race.index ? 'active' : ''}">
                    <span class="race-li-name">${race.name}</span>
                    <span class="race-li-meta">${race.size || ''}</span>
                </li>
            `).join('');
        };

        const showDetails = (raceIndex) => {
            const race = raceDatabase.find(r => r.index === raceIndex);
            if (!race) return;
            activeRaceIndex = raceIndex;
            renderList(searchInput.value);

            const relatedSubraces = subraceDatabase.filter(s => s.race && s.race.index === race.index);

            detailsElement.innerHTML = `
                <div class="phb-article animated fadeIn">
                    <h1 class="phb-title">${race.name}</h1>
                    <div class="phb-ability-bar">
                        INCREMENTO PUNTEGGIO: ${race.ability_bonuses ? race.ability_bonuses.map(b => `${b.ability_score.name} +${b.bonus}`).join(', ') : 'Varia'}
                    </div>
                    <div class="phb-content-horizontal-wrapper">
                        <div class="phb-main-text-column">
                            <p><span class="label-caps">Età.</span> ${race.age || ''}</p>
                            <p><span class="label-caps">Allineamento.</span> ${race.alignment || ''}</p>
                            <p><span class="label-caps">Taglia.</span> ${race.size || ''}. ${race.size_description || ''}</p>
                            <p><span class="label-caps">Velocità.</span> ${race.speed || 9} metri.</p>
                            <p><span class="label-caps">Linguaggi.</span> ${race.language_desc || ''}</p>
                            <h2 class="phb-section-break">Tratti Razziali</h2>
                            ${race.traits ? race.traits.map(t => `
                                <div class="phb-trait-row">
                                    <span class="trait-label-caps">${t.name}.</span> ${linkifyConditions(getTraitContent(t))}
                                </div>
                            `).join('') : ''}
                        </div>
                        <aside class="phb-subrace-aside">
                            ${relatedSubraces.map(sub => `
                                <div class="subrace-card">
                                    <h3 class="subrace-card-title">${sub.name}</h3>
                                    <p class="subrace-card-desc"><em>${sub.desc || ''}</em></p>
                                    ${sub.traits ? sub.traits.map(st => `
                                        <div class="phb-trait-row small">
                                            <span class="trait-label-caps">${st.name}.</span> ${linkifyConditions(getTraitContent(st))}
                                        </div>
                                    `).join('') : ''}
                                </div>
                            `).join('')}
                        </aside>
                    </div>
                </div>
            `;
        };

        listContainer.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li) showDetails(li.dataset.index);
        });
        searchInput.addEventListener('input', (e) => renderList(e.target.value));
        renderList();
    }
};

export default RaceList;