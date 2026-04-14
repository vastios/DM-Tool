/**
 * index.js - Entry Point PG Manager
 * ─────────────────────────────────────────────────────────────
 * Punto di ingresso per il modulo PG Manager.
 * 
 * @author DM Tool
 * @version 1.0.0
 */

import { PgController } from './PgController.js';

class PgManager {
    
    constructor(container, initialState) {
        console.log('📋 [PgManager] Costruzione modulo.');
        this.controller = new PgController(container, initialState);
    }
    
    render() {
        console.log('📋 [PgManager] Avvio rendering.');
        this.controller.init();
    }
    
    destroy() {
        console.log('📋 [PgManager] Distruzione modulo.');
        this.controller.destroy();
    }
}

export default PgManager;
export { PgController };

console.log('📋 [PgManager/index.js] Modulo caricato.');