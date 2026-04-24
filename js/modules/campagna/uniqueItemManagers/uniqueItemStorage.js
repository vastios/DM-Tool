// js/modules/campagna/uniqueItemManager/uniqueItemStorage.js

import { getCurrentCampaignId } from '../../../../../stateManager.js';

export const getStorageKey = () => {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [UniqueItemStorage] Nessuna campagna selezionata.");
        return null;
    }
    return `dungeonMasterToolUniqueItems_${campaignId}`;
};

export const loadItems = () => {
    const key = getStorageKey();
    if (!key) return [];
    try {
        const savedItemsJSON = localStorage.getItem(key);
        return savedItemsJSON ? JSON.parse(savedItemsJSON) : [];
    } catch (error) {
        console.error("❌ [UniqueItemStorage] Impossibile caricare gli oggetti unici:", error);
        return [];
    }
};

export const saveItems = (items) => {
    const key = getStorageKey();
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(items));
        console.log(`💾 [UniqueItemStorage] Oggetti unici salvati.`);
    } catch (error) {
        console.error("❌ [UniqueItemStorage] Impossibile salvare gli oggetti unici:", error);
    }
};