// js/modules/campagna/uniqueItemManager/uniqueItemTemplates.js
import { escapeHtml } from '../../../../utils/htmlHelpers.js';
import { linkifyCampaignReferences } from '../../../../utils/campaignLinker.js';

export const getMainLayout = () => `
    <div class="session-notes-container">
        <div class="notes-list-panel">
            <div class="panel-header">
                <h2>Oggetti Unici</h2>
                <div class="header-actions">
                    <button id="new-scene-item-btn" class="event-btn" title="Nuovo Oggetto di Scena">+ Scena</button>
                    <button id="new-game-item-btn" class="event-btn secondary" title="Nuovo Oggetto Magico">+ Magico</button>
                </div>
            </div>
            <input type="text" id="item-search" class="list-search" placeholder="Cerca un oggetto...">
            <ul id="saved-items-list" class="saved-notes-list"></ul>
        </div>
        <div class="note-editor-panel">
            <div id="editor-content">
                <p style="text-align: center; color: #888; margin-top: 3rem;">Seleziona un oggetto per visualizzarlo o creane uno nuovo.</p>
            </div>
        </div>
    </div>
`;

export const getListItemHTML = (item) => {
    const categoryIcon = item.category === 'Oggetto di Gioco' ? '⚔️' : '📜';
    const magicalIcon = item.isMagical ? '✨' : '';
    const description = (item.description || '').substring(0, 100);
    const date = new Date(item.lastModified || 0).toLocaleString('it-IT');

    return `
        <li class="note-list-item" data-id="${item.id}">
            <div class="note-item-info">
                <h3>${categoryIcon} ${escapeHtml(item.name || 'Oggetto Senza Nome')} ${magicalIcon}</h3>
                <p><em>${escapeHtml(item.type || 'Nessun tipo')}</em></p>
                <p>${description}${description.length === 100 ? '...' : ''}</p>
                <small>Ultima modifica: ${date}</small>
            </div>
            <div class="note-item-actions">
                <button class="edit-item-btn">Modifica</button>
                <button class="delete-item-btn">Elimina</button>
            </div>
        </li>
    `;
};

export const getItemViewerHTML = (item) => {
    // --- Preparazione di tutte le variabili "linkate" all'inizio della funzione ---
    const linkedName = linkifyCampaignReferences(item.name);
    const linkedCurrentOwner = linkifyCampaignReferences(item.currentOwner || 'Sconosciuto');
    const linkedLocation = linkifyCampaignReferences(item.location || 'Sconosciuta');
    const linkedDescription = linkifyCampaignReferences(item.description || 'Nessuna descrizione.');
    const linkedProperties = linkifyCampaignReferences(item.properties || 'Nessuna proprietà speciale');
    const linkedHistory = linkifyCampaignReferences(item.history || 'Nessuna storia nota');
    const linkedEnchantments = linkifyCampaignReferences(item.enchantments || 'Nessun potenziamento.');
    // --- CORREZIONE: Definizione della variabile mancante ---
    const linkedMagicalEffects = linkifyCampaignReferences(item.magicalEffects || 'Nessun effetto magico.');

    let detailsHTML = `
        <p><strong>Tipo:</strong> ${escapeHtml(item.type || 'N/D')}</p>
        ${item.rarity ? `<p><strong>Rarità:</strong> ${item.rarity}</p>` : ''}
        <p><strong>Possessore Attuale:</strong> ${linkedCurrentOwner}</p>
        <p><strong>Posizione:</strong> ${linkedLocation}</p>
        <p><strong>Magico:</strong> ${item.isMagical ? 'Sì' : 'No'}</p>
    `;

    if (item.category === 'Oggetto di Gioco') {
        if (item.damageDice) {
            detailsHTML += `<p><strong>Danno:</strong> ${item.damageDice} ${item.damageType || ''}</p>`;
        }
        if (item.armorClass) {
            detailsHTML += `<p><strong>Classe Armatura (CA):</strong> ${item.armorClass} ${item.armorDexBonus ? '+ Bonus DES' : ''}</p>`;
        }
        if (item.weaponProperties && item.weaponProperties.length > 0) {
            detailsHTML += `<p><strong>Proprietà Arma:</strong> ${item.weaponProperties.join(', ')}</p>`;
        }
        detailsHTML += `<p><strong>Effetti Magici:</strong></p><p>${linkedMagicalEffects.replace(/\n/g, '<br>')}</p>`;
        if (item.enchantments) {
            detailsHTML += `<p><strong>Potenziamenti:</strong></p><p>${linkedEnchantments.replace(/\n/g, '<br>')}</p>`;
        }
    } else {
        detailsHTML += `
            <p><strong>Descrizione:</strong></p><p>${linkedDescription.replace(/\n/g, '<br>')}</p>
            <p><strong>Proprietà:</strong></p><p>${linkedProperties.replace(/\n/g, '<br>')}</p>
            <p><strong>Storia:</strong></p><p>${linkedHistory.replace(/\n/g, '<br>')}</p>
        `;
    }

    return `
        <div class="note-viewer">
            <div class="note-viewer-header">
                <h2>${linkedName} ${item.isMagical ? '✨' : ''}</h2>
            </div>
            ${detailsHTML}
        </div>
    `;
};

export const getItemEditorHTML = (item, category, itemTypes, baseItems) => {
    const isNew = !item;
    const isGameItem = category === 'Oggetto di Gioco';

    return `
        <div class="editor-form">
            <div class="form-group">
                <label for="item-name">Nome dell'Oggetto:</label>
                <input type="text" id="item-name" value="${escapeHtml(item?.name || '')}" placeholder="Es. Spada Lunga +1">
            </div>
            
            ${isGameItem ? `
                <div class="form-row">
                    <div class="form-group">
                        <label for="item-type">Tipo:</label>
                        <select id="item-type">
                            <option value="">-- Seleziona un tipo --</option>
                            ${itemTypes.map(type => `<option value="${type}" ${item?.type === type ? 'selected' : ''}>${type}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="item-subtype">Oggetto Base:</label>
                        <select id="item-subtype">
                            <option value="">-- Seleziona prima un tipo --</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="item-rarity">Rarità:</label>
                        <select id="item-rarity">
                            <option value="Comune" ${item?.rarity === 'Comune' ? 'selected' : ''}>Comune</option>
                            <option value="Non Comune" ${item?.rarity === 'Non Comune' ? 'selected' : ''}>Non Comune</option>
                            <option value="Rara" ${item?.rarity === 'Rara' ? 'selected' : ''}>Rara</option>
                            <option value="Molto Rara" ${item?.rarity === 'Molto Rara' ? 'selected' : ''}>Molto Rara</option>
                            <option value="Leggendaria" ${item?.rarity === 'Leggendaria' ? 'selected' : ''}>Leggendaria</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="item-is-magical" ${item?.isMagical ? 'checked' : ''}>
                            Questo è un oggetto magico.
                        </label>
                    </div>
                </div>
                <div id="weapon-stats" style="display: none;">
                    <div class="form-row">
                        <div class="form-group"><label for="damage-dice">Danno:</label><input type="text" id="damage-dice" value="${escapeHtml(item?.damageDice || '')}" placeholder="Es. 2d6"></div>
                        <div class="form-group"><label for="damage-type">Tipo Danno:</label><input type="text" id="damage-type" value="${escapeHtml(item?.damageType || '')}" placeholder="Es. Tagliente"></div>
                    </div>
                    <div class="form-group">
                        <label>Proprietà Arma:</label>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <label><input type="checkbox" name="weapon-prop" value="Leggera" ${item?.weaponProperties?.includes('Leggera') ? 'checked' : ''}> Leggera</label>
                            <label><input type="checkbox" name="weapon-prop" value="Finesse" ${item?.weaponProperties?.includes('Finesse') ? 'checked' : ''}> Finesse</label>
                            <label><input type="checkbox" name="weapon-prop" value="Lancia" ${item?.weaponProperties?.includes('Lancia') ? 'checked' : ''}> Lancia</label>
                            <label><input type="checkbox" name="weapon-prop" value="A Due Mani" ${item?.weaponProperties?.includes('A Due Mani') ? 'checked' : ''}> A Due Mani</label>
                        </div>
                    </div>
                </div>
                <div id="armor-stats" style="display: none;">
                    <div class="form-row">
                        <div class="form-group"><label for="armor-class">Classe Armatura (CA):</label><input type="number" id="armor-class" value="${item?.armorClass || ''}" placeholder="Es. 15"></div>
                        <div class="form-group"><label for="armor-dex-bonus"><input type="checkbox" id="armor-dex-bonus" ${item?.armorDexBonus ? 'checked' : ''}> Bonus di Destrezza</label></div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="magical-effects">Effetti Magici:</label>
                    <textarea id="magical-effects" rows="4" placeholder="Descrivi gli effetti meccanici...">${escapeHtml(item?.magicalEffects || '')}</textarea>
                </div>
                <div class="form-group">
                    <label for="item-enchantments">Potenziamenti:</label>
                    <textarea id="item-enchantments" rows="3" placeholder="Es. +1 al tiro per colpire, +2 alla CA, Resistenza al fuoco...">${escapeHtml(item?.enchantments || '')}</textarea>
                </div>
            ` : `
                <div class="form-group">
                    <label for="item-description">Descrizione e Aspetto:</label>
                    <textarea id="item-description" rows="5" placeholder="Descrivi l'aspetto fisico...">${escapeHtml(item?.description || '')}</textarea>
                </div>
                <div class="form-group">
                    <label for="item-properties">Proprietà Speciali:</label>
                    <textarea id="item-properties" rows="4" placeholder="Descrivi eventuali proprietà...">${escapeHtml(item?.properties || '')}</textarea>
                </div>
                <div class="form-group">
                    <label for="item-history">Storia dell'Oggetto:</label>
                    <textarea id="item-history" rows="5" placeholder="Racconta la storia passata dell'oggetto...">${escapeHtml(item?.history || '')}</textarea>
                </div>
            `}

            <div class="form-group">
                <label for="item-current-owner">Possessore Attuale:</label>
                <input type="text" id="item-current-owner" value="${escapeHtml(item?.currentOwner || '')}" placeholder="Nome di un PNG o 'I PG'">
            </div>
            <div class="form-group">
                <label for="item-location">Posizione:</label>
                <input type="text" id="item-location" value="${escapeHtml(item?.location || '')}" placeholder="Luogo in cui si trova l'oggetto">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="item-requires-attunement" ${item?.requiresAttunement ? 'checked' : ''}>
                    Richiede Sintonizzazione.
                </label>
            </div>
            <div class="form-group" id="attunement-status-group" style="${item?.requiresAttunement ? '' : 'display: none;'}">
                <label>
                    <input type="checkbox" id="item-is-attuned" ${item?.isAttuned ? 'checked' : ''}>
                    Attualmente Sintonizzato.
                </label>
            </div>
        </div>
        <div class="editor-actions">
            <button id="save-item-btn" class="action-btn">Salva Oggetto</button>
        </div>
    `;
};