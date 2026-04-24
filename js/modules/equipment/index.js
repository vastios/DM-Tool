/**
 * Equipment Module - index.js
 * ─────────────────────────────────────────────────────────────
 * Entry point per il modulo di gestione equipaggiamento.
 * 
 * @version 1.1.0
 */

// Popup principale
import { EquipmentPopup, openEquipmentPopup, closeEquipmentPopup } from './equipmentPopup.js';

// Riesporta come export nominati
export { EquipmentPopup, openEquipmentPopup, closeEquipmentPopup };

// Export default
export default {
    openEquipmentPopup,
    closeEquipmentPopup,
    EquipmentPopup
};
