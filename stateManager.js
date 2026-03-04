/**
 * stateManager.js - Facade Bridge
 * ─────────────────────────────────────────────────────────────
 * Questo file serve come ponte per mantenere la compatibilità
 * con tutto il codice esistente che importa da stateManager.js.
 * 
 * Non contiene più logica: delega tutto ai moduli in js/services/.
 * 
 * @version 2.0.0 - Refactoring modulare completo
 * 
 * STRUTTURA:
 * js/services/
 * ├── storageHelper.js     → Persistenza localStorage
 * ├── campaignManager.js   → Gestione campagne
 * ├── combatStateManager.js → Combattimento
 * ├── pcManager.js         → Personaggi Giocanti
 * └── index.js             → Facade (da cui questo file re-esporta)
 * 
 * TUTTE LE FUNZIONI ESPORTATE SONO IDENTICHE A PRIMA.
 * NESSUNA MODIFICA NECESSARIA NEI FILE CHE IMPORTANO DA QUI.
 */

// Re-esporta TUTTO dal facade
export * from './js/services/index.js';

console.log('🔗 [stateManager.js] Bridge caricato. Re-esportazione da js/services/ attiva.');
