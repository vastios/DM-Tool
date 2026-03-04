// js/modules/campagna/pg/Pg.js

/**
 * Classe che rappresenta un Personaggio Giocante (PG).
 * Funge da modello di dati, definendo la struttura di un personaggio.
 */
export class Pg {
    /**
     * Crea un'istanza di Pg.
     * @param {Object} data - Un oggetto contenente i dati del personaggio.
     */
    constructor(data = {}) {
        // Assegna le proprietà usando i valori forniti o valori di default.
        this.id = data.id || this._generateId();
        this.name = data.name || 'Senza Nome';
        this.player = data.player || 'Sconosciuto';
        this.class = data.class || 'N/D';
        this.race = data.race || 'N/D';
        this.alignment = data.alignment || 'N/D';
        this.background = data.background || '';
        
        // Oggetti annidati con valori di default
        this.stats = data.stats || { FOR: 10, DES: 10, COS: 10, INT: 10, SAG: 10, CAR: 10 };
        this.combat = data.combat || { ca: 10, pf: 10, pf_max: 10, speed: 9 };
        this.proficiencies = data.proficiencies || { 
            saves: { FOR: false, DES: false, COS: false, INT: false, SAG: false, CAR: false },
            skills: {}
        };
        
        // Array con valori di default
        this.equipment = data.equipment || [];
        this.spells = data.spells || [];
    }

    /**
     * Genera un ID univoco per un nuovo personaggio.
     * @private
     * @returns {string} Un ID univoco basato su timestamp e un numero casuale.
     */
    _generateId() {
        return `pg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Metodo statico per creare un'istanza di Pg a partire da una stringa JSON.
     * Utile per deserializzare i dati salvati in localStorage.
     * @param {string} jsonString - La stringa JSON contenente i dati del PG.
     * @returns {Pg} Una nuova istanza della classe Pg.
     */
    static fromJSON(jsonString) {
        try {
            const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
            return new Pg(data);
        } catch (error) {
            console.error("Errore nel parsing del JSON del PG:", error);
            // In caso di errore, restituisce un PG vuoto o di default
            return new Pg();
        }
    }

    /**
     * Converte l'istanza di Pg in una stringa JSON.
     * Utile per serializzare i dati prima di salvarli.
     * @returns {string} La rappresentazione JSON del personaggio.
     */
    toJSON() {
        return JSON.stringify(this);
    }
}