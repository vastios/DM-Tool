// js/modules/campagna/uniqueItemManager/uniqueItemManager.js

import { showToast } from '../../../utils/toast.js';
import { initAutocomplete } from '../../../utils/autocomplete.js';

import { loadItems, saveItems } from './uniqueItemManagers/uniqueItemStorage.js';
import { getMainLayout, getListItemHTML, getItemViewerHTML, getItemEditorHTML } from './uniqueItemManagers/uniqueItemTemplates.js';
import { getItemTypes, getItemsByType, getBaseItemByName } from './uniqueItemManagers/uniqueItemData.js';

const UniqueItemManager = {
    render(containerElement, itemIdToLoad = null) {
        containerElement.innerHTML = getMainLayout();
        let items = loadItems();
        let currentEditingId = null;

        const listElement = containerElement.querySelector('#saved-items-list');
        const editorContent = containerElement.querySelector('#editor-content');
        const searchInput = containerElement.querySelector('#item-search');

        const renderItemsList = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredItems = items.filter(item => 
                (item.name || '').toLowerCase().includes(searchTerm) ||
                (item.type || '').toLowerCase().includes(searchTerm) ||
                (item.description || '').toLowerCase().includes(searchTerm) ||
                (item.currentOwner || '').toLowerCase().includes(searchTerm)
            );

            listElement.innerHTML = '';
            if (filteredItems.length === 0) {
                listElement.innerHTML = '<li class="empty-list">Nessun oggetto unico salvato.</li>';
                return;
            }

            const sortedItems = [...filteredItems].sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
            listElement.innerHTML = sortedItems.map(item => getListItemHTML(item)).join('');
        };

        const renderItemViewer = (item) => {
            editorContent.innerHTML = getItemViewerHTML(item);
        };

        const renderItemEditor = (item = null, category = 'Oggetto di Scena') => {
            const itemTypes = getItemTypes();
            const baseItems = getItemsByType(category);
            editorContent.innerHTML = getItemEditorHTML(item, category, itemTypes, baseItems);
            setupEditorListeners(item, category, itemTypes);
        };

        const setupEditorListeners = (item, category, itemTypes) => {
            const typeSelect = containerElement.querySelector('#item-type');
            const subtypeSelect = containerElement.querySelector('#item-subtype');
            const requiresAttunementInput = containerElement.querySelector('#item-requires-attunement');
            const attunementStatusGroup = containerElement.querySelector('#attunement-status-group');

            const initAutocompleteIfPresent = (selector) => {
                const element = containerElement.querySelector(selector);
                if (element) {
                    initAutocomplete(element);
                }
            };

            initAutocompleteIfPresent('#item-name');
            initAutocompleteIfPresent('#item-current-owner');
            initAutocompleteIfPresent('#item-location');

            if (category === 'Oggetto di Scena') {
                initAutocompleteIfPresent('#item-description');
                initAutocompleteIfPresent('#item-properties');
                initAutocompleteIfPresent('#item-history');
            } else { // Oggetto di Gioco
                initAutocompleteIfPresent('#item-magical-effects');
                initAutocompleteIfPresent('#item-enchantments'); // NUOVO: Autocomplete per i potenziamenti
            }

            // Verifica che typeSelect esista prima di aggiungere listeners
            if (typeSelect) {
                typeSelect.addEventListener('change', () => {
                    const selectedType = typeSelect.value;
                    const newBaseItems = getItemsByType(selectedType);
                    if (subtypeSelect) {
                        subtypeSelect.innerHTML = '<option value="">-- Seleziona un oggetto base --</option>';
                        newBaseItems.forEach(baseItem => {
                            const option = document.createElement('option');
                            option.value = baseItem.name;
                            option.textContent = baseItem.name;
                            subtypeSelect.appendChild(option);
                        });
                    }
                });

                typeSelect.addEventListener('change', () => {
                    const weaponStats = containerElement.querySelector('#weapon-stats');
                    const armorStats = containerElement.querySelector('#armor-stats');
                    if (weaponStats) weaponStats.style.display = typeSelect.value === 'Arma' ? 'block' : 'none';
                    if (armorStats) armorStats.style.display = (typeSelect.value === 'Armatura' || typeSelect.value === 'Scudo') ? 'block' : 'none';
                });
            }

            if (subtypeSelect) {
                subtypeSelect.addEventListener('change', () => {
                    const baseItemName = subtypeSelect.value;
                    if (!baseItemName) return;
                    const baseStats = getBaseItemByName(baseItemName);
                    if (!baseStats) return;

                    // Popola i campi base
                    const damageDiceInput = containerElement.querySelector('#damage-dice');
                    const damageTypeInput = containerElement.querySelector('#damage-type');
                    const armorClassInput = containerElement.querySelector('#armor-class');
                    const weaponPropsCheckboxes = containerElement.querySelectorAll('input[name="weapon-prop"]');
                    
                    if (damageDiceInput) damageDiceInput.value = baseStats.damageDice || '';
                    if (damageTypeInput) damageTypeInput.value = baseStats.damageType || '';
                    if (armorClassInput) armorClassInput.value = baseStats.armorClass || '';
                    if (weaponPropsCheckboxes.length > 0) {
                        weaponPropsCheckboxes.forEach(cb => {
                            cb.checked = baseStats.properties?.includes(cb.value) || false;
                        });
                    }

                    // --- NUOVO: Popola i campi speciali ---
                    const twoHandedDamageInput = containerElement.querySelector('#two-handed-dice');
                    const rangeNormalInput = containerElement.querySelector('#range-normal');
                    const rangeLongInput = containerElement.querySelector('#range-long');
                    if (twoHandedDamageInput) twoHandedDamageInput.value = baseStats.two_handed_damage?.damage_dice || '';
                    if (rangeNormalInput) rangeNormalInput.value = baseStats.range?.normal || '';
                    if (rangeLongInput) rangeLongInput.value = baseStats.range?.long || '';
                    // --- FINE NUOVO ---
                });
            }
            
            if (requiresAttunementInput && attunementStatusGroup) {
                requiresAttunementInput.addEventListener('change', () => {
                    attunementStatusGroup.style.display = requiresAttunementInput.checked ? 'block' : 'none';
                });
            }

            const saveBtn = containerElement.querySelector('#save-item-btn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    const nameInput = containerElement.querySelector('#item-name');
                    const name = nameInput ? nameInput.value.trim() : '';
                    if (!name) { showToast('Il nome è obbligatorio.', 'error'); return; }

                    const now = Date.now();
                    let itemData = {
                        id: item?.id || now.toString(),
                        name: name,
                        category: category,
                        lastModified: now,
                        currentOwner: containerElement.querySelector('#item-current-owner')?.value.trim() || '',
                        location: containerElement.querySelector('#item-location')?.value.trim() || '',
                        requiresAttunement: requiresAttunementInput ? requiresAttunementInput.checked : false,
                        isAttuned: containerElement.querySelector('#item-is-attuned')?.checked || false,
                    };

                    if (category === 'Oggetto di Scena') {
                        itemData.type = 'Oggetto di Scena';
                        itemData.description = containerElement.querySelector('#item-description')?.value.trim() || '';
                        itemData.properties = containerElement.querySelector('#item-properties')?.value.trim() || '';
                        itemData.history = containerElement.querySelector('#item-history')?.value.trim() || '';
                    } else { // Oggetto di Gioco
                        itemData.type = typeSelect ? typeSelect.value : '';
                        itemData.rarity = containerElement.querySelector('#item-rarity')?.value || '';
                        itemData.isMagical = containerElement.querySelector('#item-is-magical')?.checked || false;
                        itemData.magicalEffects = containerElement.querySelector('#item-magical-effects')?.value.trim() || '';
                        // --- NUOVO: Salvataggio Potenziamenti ---
                        itemData.enchantments = containerElement.querySelector('#item-enchantments')?.value.trim() || '';

                        if (itemData.type === 'Arma') {
                            itemData.damageDice = containerElement.querySelector('#damage-dice')?.value.trim() || '';
                            itemData.damageType = containerElement.querySelector('#damage-type')?.value.trim() || '';
                            itemData.weaponProperties = Array.from(containerElement.querySelectorAll('input[name="weapon-prop"]:checked')).map(cb => cb.value);
                            itemData.two_handed_damage = { damage_dice: containerElement.querySelector('#two-handed-dice')?.value.trim() || '', damage_type: containerElement.querySelector('#damage-type')?.value.trim() || '' };
                            itemData.range = { normal: parseInt(containerElement.querySelector('#range-normal')?.value, 10) || 0, long: parseInt(containerElement.querySelector('#range-long')?.value, 10) || 0 };
                        }
                        if (itemData.type === 'Armatura' || itemData.type === 'Scudo') {
                            itemData.armorClass = parseInt(containerElement.querySelector('#armor-class')?.value, 10) || 0;
                            itemData.armorDexBonus = containerElement.querySelector('#armor-dex-bonus')?.checked || false;
                        }
                    }

                    const existingIndex = items.findIndex(i => i.id === itemData.id);
                    if (existingIndex > -1) {
                        items[existingIndex] = { ...items[existingIndex], ...itemData };
                        showToast(`Oggetto "${name}" aggiornato.`, 'success');
                    } else {
                        items.push(itemData);
                        showToast(`Oggetto "${name}" creato.`, 'success');
                    }

                    saveItems(items);
                    renderItemsList();
                    renderItemViewer(itemData);
                });
            }
        };
        const setupMainListeners = () => {
            containerElement.querySelector('#new-scene-item-btn').addEventListener('click', () => {
                currentEditingId = null;
                renderItemEditor(null, 'Oggetto di Scena');
            });
            containerElement.querySelector('#new-game-item-btn').addEventListener('click', () => {
                currentEditingId = null;
                renderItemEditor(null, 'Oggetto di Gioco');
            });
            searchInput.addEventListener('input', renderItemsList);
            
            listElement.addEventListener('click', (e) => {
                const li = e.target.closest('.note-list-item');
                if (!li) return;
                const id = li.dataset.id;
                const item = items.find(i => i.id === id);

                if (e.target.closest('.edit-item-btn')) {
                    renderItemEditor(item, item.category);
                } else if (e.target.closest('.delete-item-btn')) {
                    if (confirm(`Eliminare "${item.name}"?`)) {
                        items = items.filter(i => i.id !== id);
                        saveItems(items);
                        renderItemsList();
                        editorContent.innerHTML = `<p class="alert-box error-box">Oggetto eliminato.</p>`;
                    }
                } else {
                    renderItemViewer(item);
                }
            });
        };

        if (itemIdToLoad) {
            const itemToLoad = items.find(i => i.id === itemIdToLoad);
            if (itemToLoad) renderItemEditor(itemToLoad, itemToLoad.category);
        } else if (items.length > 0) {
            const mostRecent = [...items].sort((a, b) => b.lastModified - a.lastModified)[0];
            renderItemViewer(mostRecent);
        }
        
        renderItemsList();
        setupMainListeners();
    }
};

export default UniqueItemManager;