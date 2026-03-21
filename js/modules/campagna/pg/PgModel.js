// js/modules/campagna/pg/PgModel.js

/**
 * Rappresenta un Personaggio Giocante (PG).
 * Contiene la struttura dei dati e la logica di business di base.
 */
export class Pg {
    constructor(data = {}) {
        // Assegna i valori, usando dei default se non specificati
        this.id = data.id || Date.now().toString();
        this.name = data.name || 'Senza Nome';
        this.player = data.player || '';
        this.class = data.class || '';
        this.race = data.race || '';
        this.level = data.level || 1;
        this.alignment = data.alignment || '';
        this.armorClass = data.armorClass || 10;
        this.hitPoints = data.hitPoints || '';
        this.strength = data.strength || 10;
        this.dexterity = data.dexterity || 10;
        this.constitution = data.constitution || 10;
        this.intelligence = data.intelligence || 10;
        this.wisdom = data.wisdom || 10;
        this.charisma = data.charisma || 10;
        this.personality = data.personality || '';
        this.ideals = data.ideals || '';
        this.bonds = data.bonds || '';
        this.flaws = data.flaws || '';
        this.spells = data.spells || [];
        this.inventory = data.inventory || [];
        this.features = data.features || [];
        this.lastModified = data.lastModified || Date.now();
    }

    /**
     * Converte l'istanza del PG in un oggetto plain per il salvataggio.
     * @returns {object}
     */
    toJSON() {
        return { ...this };
    }

    /**
     * Valida i dati essenziali del PG.
     * @returns {boolean} True se i dati sono validi.
     */
    isValid() {
        return this.name.trim() !== '';
    }
}