// js/modules/compendio/backgroundList.js
import { backgroundDatabase } from '../../../database/backgroundDatabase.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';

// --- FUNZIONI HELPER ---
function formatArray(arr) {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return 'Nessuna';
    return arr.join(', ');
}

function formatEquipment(equipment) {
    if (!equipment || !Array.isArray(equipment)) return '<p><em>Nessuno.</em></p>';
    return equipment.map(eq => `<li>${escapeHtml(String(eq))}</li>`).join('');
}

function formatSpecializzazione(specializzazione, title = 'Specializzazione', diceType = 'd8', valueKey = 'specializzazione') {
    if (!specializzazione) return '';
    
    const tabella = specializzazione.tabella || [];
    const rows = tabella.map(row => `
        <tr>
            <td>${row[diceType]}</td>
            <td>${escapeHtml(String(row[valueKey]))}</td>
        </tr>
    `).join('');
    
    return `
        <div class="details-section">
            <h3>⚔️ ${title}</h3>
            <p class="spec-desc">${escapeHtml(String(specializzazione.descrizione || ''))}</p>
            <div class="table-wrapper">
                <table class="spec-table">
                    <thead>
                        <tr>
                            <th>${diceType}</th>
                            <th>${valueKey.charAt(0).toUpperCase() + valueKey.slice(1).replace(/_/g, ' ')}</th>
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

function formatEventoCruciale(evento) {
    if (!evento) return '';
    
    const tabella = evento.tabella || [];
    const rows = tabella.map(row => `
        <tr>
            <td>${row.d10}</td>
            <td>${escapeHtml(String(row.evento))}</td>
        </tr>
    `).join('');
    
    return `
        <div class="details-section">
            <h3>🎯 Evento Cruciale</h3>
            <p class="spec-desc">${escapeHtml(String(evento.descrizione || ''))}</p>
            <div class="table-wrapper">
                <table class="spec-table">
                    <thead>
                        <tr>
                            <th>d10</th>
                            <th>Evento</th>
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

function formatPrivilegio(privilegio) {
    if (!privilegio) return '';
    
    return `
        <div class="details-section">
            <h3>✨ Privilegio: ${escapeHtml(String(privilegio.nome || 'Privilegio'))}</h3>
            <p class="privilegio-desc">${escapeHtml(String(privilegio.descrizione || ''))}</p>
        </div>
    `;
}

function formatVariante(variante, tipo = 'variante') {
    if (!variante) return '';
    
    const icon = tipo === 'cavaliere' ? '🏇' : '🕵️';
    const title = variante.nome || 'Variante';
    
    return `
        <div class="details-section variante-section">
            <h3>${icon} Variante: ${escapeHtml(String(title))}</h3>
            <p class="variante-desc">${escapeHtml(String(variante.descrizione || ''))}</p>
        </div>
    `;
}

function formatPrivilegioVariante(privilegio) {
    if (!privilegio) return '';
    
    return `
        <div class="details-section privilegio-variante-section">
            <h3>✨ Privilegio Alternativo: ${escapeHtml(String(privilegio.nome || 'Privilegio'))}</h3>
            <p class="privilegio-desc">${escapeHtml(String(privilegio.descrizione || ''))}</p>
        </div>
    `;
}

function formatCaratteristicheSuggerite(caratteristiche) {
    if (!caratteristiche) return '';
    
    // Tratti caratteriali
    const trattiRows = (caratteristiche.tratti_caratteriali || []).map(row => `
        <tr>
            <td>${row.d8}</td>
            <td>${escapeHtml(String(row.tratto))}</td>
        </tr>
    `).join('');
    
    // Ideali
    const idealiRows = (caratteristiche.ideali || []).map(row => `
        <tr>
            <td>${row.d6}</td>
            <td><strong>${escapeHtml(String(row.nome))}</strong></td>
            <td>${escapeHtml(String(row.descrizione))}</td>
            <td><span class="alignment-badge ${row.allineamento?.toLowerCase()}">${escapeHtml(String(row.allineamento))}</span></td>
        </tr>
    `).join('');
    
    // Legami
    const legamiRows = (caratteristiche.legami || []).map(row => `
        <tr>
            <td>${row.d6}</td>
            <td>${escapeHtml(String(row.legame))}</td>
        </tr>
    `).join('');
    
    // Difetti
    const difettiRows = (caratteristiche.difetti || []).map(row => `
        <tr>
            <td>${row.d6}</td>
            <td>${escapeHtml(String(row.difetto))}</td>
        </tr>
    `).join('');
    
    return `
        <div class="details-section characteristics-section">
            <h3>🎭 Caratteristiche Suggerite</h3>
            <p class="char-desc">${escapeHtml(String(caratteristiche.descrizione || ''))}</p>
            
            <div class="char-tables-container">
                <!-- Tratti Caratteriali -->
                <div class="char-table-wrapper">
                    <h4>Tratti Caratteriali (d8)</h4>
                    <div class="table-wrapper">
                        <table class="char-table">
                            <thead>
                                <tr>
                                    <th>d8</th>
                                    <th>Tratto</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${trattiRows}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Ideali -->
                <div class="char-table-wrapper">
                    <h4>Ideali (d6)</h4>
                    <div class="table-wrapper">
                        <table class="char-table ideali-table">
                            <thead>
                                <tr>
                                    <th>d6</th>
                                    <th>Ideale</th>
                                    <th>Descrizione</th>
                                    <th>Allineamento</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${idealiRows}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Legami -->
                <div class="char-table-wrapper">
                    <h4>Legami (d6)</h4>
                    <div class="table-wrapper">
                        <table class="char-table">
                            <thead>
                                <tr>
                                    <th>d6</th>
                                    <th>Legame</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${legamiRows}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Difetti -->
                <div class="char-table-wrapper">
                    <h4>Difetti (d6)</h4>
                    <div class="table-wrapper">
                        <table class="char-table">
                            <thead>
                                <tr>
                                    <th>d6</th>
                                    <th>Difetto</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${difettiRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

const BackgroundList = {
    render(containerElement) {
        containerElement.innerHTML = `
            <style>
                .monster-list-item {
                    cursor: pointer;
                }
                .alignment-badge {
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.85em;
                    font-weight: 500;
                }
                .alignment-badge.buono { background: #d4edda; color: #155724; }
                .alignment-badge.legale { background: #cce5ff; color: #004085; }
                .alignment-badge.caotico { background: #fff3cd; color: #856404; }
                .alignment-badge.malvagio { background: #f8d7da; color: #721c24; }
                .alignment-badge.neutrale { background: #e2e3e5; color: #383d41; }
                .alignment-badge.qualsiasi { background: #d1ecf1; color: #0c5460; }
                
                .char-tables-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                @media (max-width: 900px) {
                    .char-tables-container {
                        grid-template-columns: 1fr;
                    }
                }
                .char-table-wrapper {
                    background: rgba(0,0,0,0.1);
                    border-radius: 8px;
                    padding: 0.75rem;
                }
                .char-table-wrapper h4 {
                    margin: 0 0 0.5rem 0;
                    color: #d4a574;
                    font-size: 0.95em;
                }
                .ideali-table td:nth-child(2) {
                    white-space: nowrap;
                }
                .spec-desc, .privilegio-desc, .char-desc, .variante-desc {
                    line-height: 1.6;
                    margin-bottom: 1rem;
                }
                .variante-section, .privilegio-variante-section {
                    background: rgba(255, 215, 0, 0.1);
                    border-left: 3px solid #ffd700;
                }
                .variante-section h3, .privilegio-variante-section h3 {
                    color: #daa520;
                }
            </style>
            <div class="class-list-container-three-col">
                <div class="class-list-column">
                    <h2>Background</h2>
                    <input type="text" id="background-search" class="list-search" placeholder="Cerca un background...">
                    <ul id="background-full-list" class="class-full-list-three-col"></ul>
                </div>

                <div class="class-details-column-three-col">
                    <div id="background-details-content">
                        <p style="text-align: center; color: #8a7d60; margin-top: 3rem;">
                            Seleziona un background per visualizzarne i dettagli.
                        </p>
                    </div>
                </div>
            </div>
        `;

        const listElement = containerElement.querySelector('#background-full-list');
        const detailsElement = containerElement.querySelector('#background-details-content');
        const searchInput = containerElement.querySelector('#background-search');

        const renderBackgroundList = (searchTerm = '') => {
            const filteredBackgrounds = backgroundDatabase.filter(bg =>
                bg.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (bg.descrizione && bg.descrizione.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            listElement.innerHTML = filteredBackgrounds.length === 0 
                ? '<li class="empty-list">Nessun background trovato.</li>'
                : filteredBackgrounds.map(bg => `
                    <li class="monster-list-item" data-index="${bg.index}">
                        <h3>${bg.nome}</h3>
                        <p><em>${bg.privilegio?.nome || 'Privilegio speciale'}</em></p>
                    </li>
                `).join('');
        };

        const renderBackgroundDetails = (bgIndex) => {
            const bg = backgroundDatabase.find(b => b.index === bgIndex);
            if (!bg) return;

            const competenze = bg.competenze || {};
            
            // Determina quale sezione mostrare (specializzazione, specialita_criminale o evento_cruciale)
            let specialSection = '';
            if (bg.specializzazione) {
                specialSection = formatSpecializzazione(bg.specializzazione, 'Specializzazione', 'd8', 'specializzazione');
            } else if (bg.specialita_criminale) {
                specialSection = formatSpecializzazione(bg.specialita_criminale, 'Specialità Criminale', 'd8', 'specialita');
            } else if (bg.evento_cruciale) {
                specialSection = formatEventoCruciale(bg.evento_cruciale);
            }
            
            const detailsHTML = `
                <div class="class-full-details">
                    <!-- HEADER -->
                    <div class="class-details-header">
                        <h2>${bg.nome}</h2>
                        <p class="class-tagline">${escapeHtml(String(bg.descrizione || '').substring(0, 200))}${(bg.descrizione || '').length > 200 ? '...' : ''}</p>
                    </div>
                    
                    <!-- DESCRIZIONE COMPLETA -->
                    <div class="details-section">
                        <h3>📜 Descrizione</h3>
                        <p class="desc-full">${escapeHtml(String(bg.descrizione || ''))}</p>
                    </div>
                    
                    <!-- COMPETENZE -->
                    <div class="details-section">
                        <h3>⚔️ Competenze</h3>
                        <div class="competenze-grid">
                            <div class="comp-item">
                                <strong>Abilità:</strong>
                                <span>${formatArray(competenze.abilita)}</span>
                            </div>
                            ${competenze.strumenti ? `
                            <div class="comp-item">
                                <strong>Strumenti:</strong>
                                <span>${formatArray(competenze.strumenti)}</span>
                            </div>
                            ` : ''}
                            ${competenze.linguaggi ? `
                            <div class="comp-item">
                                <strong>Linguaggi:</strong>
                                <span>${competenze.linguaggi}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- EQUIPAGGIAMENTO -->
                    <div class="details-section">
                        <h3>🎒 Equipaggiamento</h3>
                        <ul class="equipment-list">
                            ${formatEquipment(bg.equipaggiamento)}
                        </ul>
                    </div>
                    
                    <!-- SPECIALIZZAZIONE / EVENTO CRUCIALE / SPECIALITA CRIMINALE -->
                    ${specialSection}
                    
                    <!-- PRIVILEGIO -->
                    ${formatPrivilegio(bg.privilegio)}
                    
                    <!-- VARIANTE CAVALIERE (Nobile) -->
                    ${formatVariante(bg.variante_cavaliere, 'cavaliere')}
                    
                    <!-- PRIVILEGIO VARIANTE (Nobile - Seguaci) -->
                    ${formatPrivilegioVariante(bg.privilegio_variante)}
                    
                    <!-- VARIANTE (Criminale - Spia) -->
                    ${formatVariante(bg.variante, 'spia')}
                    
                    <!-- CARATTERISTICHE SUGGERITE -->
                    ${formatCaratteristicheSuggerite(bg.caratteristiche_suggerite)}
                </div>
            `;
            detailsElement.innerHTML = detailsHTML;
        };

        listElement.addEventListener('click', (e) => {
            const li = e.target.closest('.monster-list-item');
            if (li) {
                const bgIndex = li.dataset.index;
                renderBackgroundDetails(bgIndex);
                
                listElement.querySelectorAll('.monster-list-item').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
            }
        });

        searchInput.addEventListener('input', (e) => renderBackgroundList(e.target.value));

        renderBackgroundList();
    }
};

export default BackgroundList;
