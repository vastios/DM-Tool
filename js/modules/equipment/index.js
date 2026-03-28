/**
 * Equipment Module - index.js
 * ─────────────────────────────────────────────────────────────
 * Entry point per il modulo di gestione equipaggiamento.
 * 
 * @version 1.0.0
 * 
 * USAGE:
 * import { openEquipmentPopup } from './modules/equipment/index.js';
 * 
 * openEquipmentPopup({
 *     owner: characterData,      // PG o PNG
 *     ownerType: 'pc',           // 'pc' o 'npc'
 *     onSave: (state) => {       // Callback salvataggio
 *         console.log('Salvato:', state);
 *     }
 * });
 */

// Popup principale - import prima di esportare
import { EquipmentPopup, openEquipmentPopup, closeEquipmentPopup } from './equipmentPopup.js';
import { EquipmentService } from './services/equipmentService.js';

// Riesporta come export nominati
export { EquipmentPopup, openEquipmentPopup, closeEquipmentPopup, EquipmentService };
export { 
    getAllItems, 
    getWeapons, 
    getArmor, 
    getMagicItems,
    searchItems,
    getItemByIndex,
    getCompatibleSlotsForItem,
    itemRequiresAttunement,
    calculateTotalWeight,
    formatWeight,
    formatCost,
    DATA_SOURCES
} from './services/itemLoader.js';

// Componenti
export { renderBodySVG, renderCompactSlotGrid } from './components/bodySlotRenderer.js';
export { renderInventoryPanel, renderItemDetail, renderAddItemPopup } from './components/inventoryPanel.js';

// Configurazione
export { 
    SLOT_TYPES, 
    SLOT_GROUPS, 
    WEAPON_SLOTS, 
    ARMOR_SLOTS,
    getSlotDefinition,
    getCompatibleSlots,
    isItemCompatibleWithSlot
} from './config/slotTypes.js';

export {
    MAX_ATTUNEMENT,
    checkEquipPrerequisites,
    checkSlotConflicts,
    calculateItemEffects,
    requiresAttunement,
    canAttuneItem
} from './config/compatibilityRules.js';

// Export default
export default {
    openEquipmentPopup,
    closeEquipmentPopup,
    EquipmentPopup,
    EquipmentService
};
