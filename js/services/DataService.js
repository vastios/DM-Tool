/**
 * DataService.js
 * Servizio centralizzato per gestire il recupero e la cache dei dati dall'API Open5e.
 * Questo evita chiamate ripetitive all'API e migliora le performance.
 */
class DataService {
    constructor() {
        // L'URL base dell'API Open5e
        this.apiBaseUrl = 'https://api.open5e.com/v1/';
        // Chiave usata per salvare i dati in localStorage
        this.cacheKey = 'dndToolCache';
        // Durata della cache in millisecondi (24 ore)
        this.cacheExpiration = 24 * 60 * 60 * 1000;
    }

    /**
     * Controlla se la cache è valida (non scaduta).
     * @returns {boolean} True se la cache è valida, altrimenti false.
     */
    _isCacheValid() {
        const cachedData = localStorage.getItem(this.cacheKey);
        if (!cachedData) {
            return false;
        }
        const { timestamp } = JSON.parse(cachedData);
        return Date.now() - timestamp < this.cacheExpiration;
    }

    /**
     * Recupera i dati dalla cache o dall'API.
     * @param {string} endpoint - L'endpoint da cui recuperare i dati (es. 'spells', 'monsters').
     * @returns {Promise<object|null>} Una promise che risolve con i dati o null in caso di errore.
     */
    async _getData(endpoint) {
        // 1. Controlla la cache
        if (this._isCacheValid()) {
            console.log(`Loading ${endpoint} from cache...`);
            const cachedData = JSON.parse(localStorage.getItem(this.cacheKey));
            return cachedData[endpoint] || null;
        }

        // 2. Se la cache non è valida, recupera dall'API
        console.log(`Fetching ${endpoint} from API...`);
        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // 3. Aggiorna la cache
            const currentCache = JSON.parse(localStorage.getItem(this.cacheKey)) || {};
            currentCache[endpoint] = data;
            currentCache.timestamp = Date.now();
            localStorage.setItem(this.cacheKey, JSON.stringify(currentCache));

            return data;
        } catch (error) {
            console.error(`Failed to fetch ${endpoint}:`, error);
            // Potremmo voler mostrare una notifica toast qui
            return null;
        }
    }

    /**
     * Recupera tutti gli incantesimi.
     * @returns {Promise<object|null>} Una promise che risolve con la lista degli incantesimi.
     */
    async getAllSpells() {
        return this._getData('spells');
    }

    /**
     * Recupera un incantesimo specifico tramite il suo indice (es. 'fire-bolt').
     * @param {string} index - L'indice dell'incantesimo.
     * @returns {Promise<object|null>} Una promise che risolve con i dettagli dell'incantesimo.
     */
    async getSpellByIndex(index) {
        try {
            // L'API di Open5e permette di fare fetch diretti per indice
            const response = await fetch(`${this.apiBaseUrl}spells/${index}/`);
            if (!response.ok) {
                // Se non trovato, potrebbe essere un 404
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch spell ${index}:`, error);
            return null;
        }
    }

    /**
     * Recupera tutti i mostri.
     * @returns {Promise<object|null>} Una promise che risolve con la lista dei mostri.
     */
    async getAllMonsters() {
        return this._getData('monsters');
    }

    /**
     * Recupera un mostro specifico tramite il suo indice (es. 'goblin').
     * @param {string} index - L'indice del mostro.
     * @returns {Promise<object|null>} Una promise che risolve con i dettagli del mostro.
     */
    async getMonsterByIndex(index) {
        try {
            const response = await fetch(`${this.apiBaseUrl}monsters/${index}/`);
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch monster ${index}:`, error);
            return null;
        }
    }
    /**
     * Recupera tutti gli oggetti magici.
     * @returns {Promise<object|null>} Una promise che risolve con la lista degli oggetti magici.
     */
    async getAllMagicItems() {
        // L'endpoint per gli oggetti magici è 'magicitems'
        return this._getData('magicitems');
    }

    /**
     * Recupera un oggetto magico specifico tramite il suo indice (es. 'amulet-of-the-devout').
     * @param {string} index - L'indice dell'oggetto magico.
     * @returns {Promise<object|null>} Una promise che risolve con i dettagli dell'oggetto magico.
     */
    async getMagicItemByIndex(index) {
        try {
            const response = await fetch(`${this.apiBaseUrl}magicitems/${index}/`);
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch magic item ${index}:`, error);
            return null;
        }
    }
    // Puoi aggiungere qui altri metodi per 'magic-items', 'equipment', 'races', 'classes', ecc.
    // async getAllMagicItems() { return this._getData('magicitems'); }
    // async getMagicItemByIndex(index) { /* ... */ }
}

// Esporta un'istanza singleton del servizio per essere usata in tutta l'applicazione
export const dataService = new DataService();