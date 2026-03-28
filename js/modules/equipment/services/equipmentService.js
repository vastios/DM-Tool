/**
 * equipmentService.js
 * ─────────────────────────────────────────────────────────────
 * Servizio per gestire l'equipaggiamento dei personaggi.
 * Gestisce persistenza, calcoli e operazioni CRUD.
 * 
 * @version 1.0.0
 */

import { getItemByIndex, getCompatibleSlotsForItem, itemRequiresAttunement, calculateTotalWeight } from './itemLoader.js';
import { SLOT_TYPES, WEAPON_SLOTS, ARMOR_SLOTS } from '../config/slotTypes.js';
import { checkEquipPrerequisites, checkSlotConflicts, calculateItemEffects, MAX_ATTUNEMENT, canAttuneItem } from '../config/compatibilityRules.js';

/**
 * Classe per gestire l'equipaggiamento di un personaggio
 */
export class EquipmentService {
    /**
     * @param {Object} character - Il personaggio (PG o PNG)
     * @param {string} characterType - 'pc' o 'npc'
     */
    constructor(character, characterType = 'pc') {
        this.character = character;
        this.characterType = characterType;
        this.inventory = character.equipment || character.inventory || [];
        this.equipped = character.equippedSlots || {};
        
        // Inizializza gli slot equipaggiati dalla proprietà equipped degli oggetti
        this._initializeEquippedSlots();
    }
    
    /**
     * Inizializza gli slot equipaggiati dall'inventario
     */
    _initializeEquippedSlots() {
        this.inventory.forEach(item => {
            if (item.equipped && item.slot) {
                this.equipped[item.slot] = item;
            }
        });
    }
    
    /**
     * Ottiene l'oggetto in uno slot specifico
     * @param {string} slotId - ID dello slot
     * @returns {Object|null} L'oggetto equipaggiato o null
     */
    getEquippedItem(slotId) {
        return this.equipped[slotId] || null;
    }
    
    /**
     * Ottiene tutti gli oggetti equipaggiati
     * @returns {Object} Mappa slot -> oggetto
     */
    getAllEquipped() {
        return { ...this.equipped };
    }
    
    /**
     * Equipaggia un oggetto in uno slot
     * @param {number} itemIndex - Indice dell'oggetto nell'inventario
     * @param {string} targetSlot - Slot target (opzionale, auto-selezionato se non specificato)
     * @returns {Object} Risultato { success, message, warnings }
     */
    equipItem(itemIndex, targetSlot = null) {
        const result = { success: false, message: '', warnings: [] };
        
        const item = this.inventory[itemIndex];
        if (!item) {
            result.message = 'Oggetto non trovato';
            return result;
        }
        
        // Determina lo slot target
        const compatibleSlots = getCompatibleSlotsForItem(item);
        if (compatibleSlots.length === 0) {
            result.message = 'Questo oggetto non può essere equipaggiato';
            return result;
        }
        
        // Se non è specificato uno slot, usa il primo compatibile libero
        let slot = targetSlot;
        if (!slot) {
            slot = compatibleSlots.find(s => !this.equipped[s]) || compatibleSlots[0];
        }
        
        // Verifica compatibilità
        if (!compatibleSlots.includes(slot)) {
            result.message = `Questo oggetto non può essere equipaggiato nello slot ${SLOT_TYPES[slot]?.name || slot}`;
            return result;
        }
        
        // Verifica prerequisiti
        const prereq = checkEquipPrerequisites(item, this.character);
        if (prereq.errors.length > 0) {
            result.message = prereq.errors[0];
            return result;
        }
        result.warnings = prereq.warnings;
        
        // Verifica conflitti
        const conflicts = checkSlotConflicts(item, slot, this.equipped);
        if (conflicts.hasConflict) {
            // Rimuovi gli oggetti che causano conflitto
            conflicts.affectedSlots.forEach(conflictSlot => {
                this._unequipFromSlot(conflictSlot);
            });
            result.warnings.push(conflicts.message);
        }
        
        // Se c'è già un oggetto nello slot, disequipaggialo
        if (this.equipped[slot]) {
            this._unequipFromSlot(slot);
            result.warnings.push(`Rimosso ${this.equipped[slot]?.name || 'oggetto'} dallo slot ${SLOT_TYPES[slot]?.name}`);
        }
        
        // Equipaggia il nuovo oggetto
        item.equipped = true;
        item.slot = slot;
        this.equipped[slot] = item;
        
        result.success = true;
        result.message = `${item.name} equipaggiato in ${SLOT_TYPES[slot]?.name || slot}`;
        
        return result;
    }
    
    /**
     * Disequipaggia un oggetto dal suo slot
     * @param {string} slotId - ID dello slot
     * @returns {Object} Risultato
     */
    unequipFromSlot(slotId) {
        const result = { success: false, message: '' };
        
        const item = this.equipped[slotId];
        if (!item) {
            result.message = 'Nessun oggetto in questo slot';
            return result;
        }
        
        this._unequipFromSlot(slotId);
        result.success = true;
        result.message = `${item.name} rimosso da ${SLOT_TYPES[slotId]?.name || slotId}`;
        
        return result;
    }
    
    /**
     * Disequipaggia un oggetto dallo slot (interno)
     * @param {string} slotId 
     */
    _unequipFromSlot(slotId) {
        const item = this.equipped[slotId];
        if (item) {
            item.equipped = false;
            item.slot = null;
        }
        delete this.equipped[slotId];
    }
    
    /**
     * Aggiunge un oggetto all'inventario
     * @param {Object|string} itemOrIndex - L'oggetto o il suo index nel database
     * @param {number} quantity - Quantità (default 1)
     * @returns {Object} Risultato
     */
    addToInventory(itemOrIndex, quantity = 1) {
        const result = { success: false, message: '', item: null };
        
        let item;
        if (typeof itemOrIndex === 'string') {
            // Cerca nel database
            const dbItem = getItemByIndex(itemOrIndex);
            if (!dbItem) {
                result.message = 'Oggetto non trovato nel database';
                return result;
            }
            // Crea una copia per l'inventario
            item = {
                ...dbItem,
                id: `${dbItem.index}_${Date.now()}`,
                quantity: quantity,
                equipped: false,
                slot: null,
                isAttuned: false
            };
        } else {
            // Oggetto fornito direttamente
            item = {
                ...itemOrIndex,
                id: itemOrIndex.id || `${itemOrIndex.index}_${Date.now()}`,
                quantity: quantity,
                equipped: false,
                slot: null
            };
        }
        
        // Controlla se esiste già un oggetto identico (stacking)
        const existingIndex = this.inventory.findIndex(inv => 
            inv.index === item.index && 
            !inv.equipped && 
            inv.customName === item.customName
        );
        
        if (existingIndex >= 0 && !item.equipped) {
            // Incrementa la quantità
            this.inventory[existingIndex].quantity = 
                (this.inventory[existingIndex].quantity || 1) + quantity;
            result.item = this.inventory[existingIndex];
        } else {
            // Aggiungi nuovo oggetto
            this.inventory.push(item);
            result.item = item;
        }
        
        result.success = true;
        result.message = `${item.name} aggiunto all'inventario`;
        
        return result;
    }
    
    /**
     * Rimuove un oggetto dall'inventario
     * @param {number} itemIndex - Indice dell'oggetto
     * @param {number} quantity - Quantità da rimuovere (default tutto)
     * @returns {Object} Risultato
     */
    removeFromInventory(itemIndex, quantity = null) {
        const result = { success: false, message: '' };
        
        const item = this.inventory[itemIndex];
        if (!item) {
            result.message = 'Oggetto non trovato';
            return result;
        }
        
        // Se è equipaggiato, disequipaggia prima
        if (item.equipped && item.slot) {
            this._unequipFromSlot(item.slot);
        }
        
        const currentQty = item.quantity || 1;
        const removeQty = quantity || currentQty;
        
        if (removeQty >= currentQty) {
            // Rimuovi completamente
            this.inventory.splice(itemIndex, 1);
        } else {
            // Riduci quantità
            item.quantity = currentQty - removeQty;
        }
        
        result.success = true;
        result.message = `${item.name} rimosso dall'inventario`;
        
        return result;
    }
    
    /**
     * Attiva/disattiva l'attunement di un oggetto
     * @param {number} itemIndex - Indice dell'oggetto
     * @returns {Object} Risultato
     */
    toggleAttunement(itemIndex) {
        const result = { success: false, message: '' };
        
        const item = this.inventory[itemIndex];
        if (!item) {
            result.message = 'Oggetto non trovato';
            return result;
        }
        
        if (!itemRequiresAttunement(item)) {
            result.message = 'Questo oggetto non richiede sintonizzazione';
            return result;
        }
        
        if (item.isAttuned) {
            // Rimuovi attunement
            item.isAttuned = false;
            result.success = true;
            result.message = `Sintonizzazione con ${item.name} rimossa`;
        } else {
            // Verifica limite
            const attuneCheck = canAttuneItem(item, this.character);
            if (!attuneCheck.canAttune) {
                result.message = attuneCheck.reason;
                return result;
            }
            
            // Conta oggetti attunati correnti
            const currentAttuned = this.inventory.filter(i => i.isAttuned).length;
            if (currentAttuned >= MAX_ATTUNEMENT) {
                result.message = `Raggiunto limite sintonizzazione (${MAX_ATTUNEMENT})`;
                return result;
            }
            
            item.isAttuned = true;
            result.success = true;
            result.message = `Sintonizzato con ${item.name}`;
        }
        
        return result;
    }
    
    /**
     * Calcola le statistiche del personaggio basate sull'equipaggiamento
     * @returns {Object} Statistiche calcolate
     */
    calculateStats() {
        const stats = {
            armorClass: {
                base: 10,
                armor: 0,
                shield: 0,
                dexBonus: 0,
                magicBonus: 0,
                total: 10
            },
            speed: {
                base: this.character.speed || 9,
                armorPenalty: 0,
                total: this.character.speed || 9
            },
            initiative: {
                base: 0,
                magicBonus: 0,
                total: 0
            },
            savingThrows: {
                fortitude: { base: 0, magic: 0 },
                reflex: { base: 0, magic: 0 },
                will: { base: 0, magic: 0 }
            },
            attacks: {
                mainHand: null,
                offHand: null
            },
            special: [],
            warnings: []
        };
        
        // Calcola bonus DES per CA
        const dexScore = this.character.abilities?.dexterity || this.character.abilities?.des || 10;
        const dexMod = Math.floor((dexScore - 10) / 2);
        
        // Processa ogni slot equipaggiato
        Object.entries(this.equipped).forEach(([slotId, item]) => {
            if (!item) return;
            
            const effects = calculateItemEffects(item, this.character);
            
            // Armature
            if (slotId === 'body' && effects.armorClass) {
                stats.armorClass.armor = effects.armorClass - 10; // Base dell'armatura
                
                if (effects.armorClassDexBonus) {
                    if (effects.armorClassDexMax !== null) {
                        stats.armorClass.dexBonus = Math.min(dexMod, effects.armorClassDexMax);
                    } else {
                        stats.armorClass.dexBonus = dexMod;
                    }
                }
                
                // Penalità velocità per armature pesanti
                if (item.armor_category === 'Pesante' && !item.stealth_disadvantage === false) {
                    // Check str_minimum
                    if (item.str_minimum && (this.character.abilities?.strength || 10) < item.str_minimum) {
                        stats.warnings.push(`FOR ${item.str_minimum} richiesta per ${item.name}`);
                    }
                }
            }
            
            // Scudi
            if ((slotId === 'mainHand' || slotId === 'offHand') && 
                (item.equipment_category?.index === 'shield' || item.name?.toLowerCase().includes('scudo'))) {
                stats.armorClass.shield += effects.armorClassBonus || 2;
            }
            
            // Bonus magici
            if (effects.armorClassBonus && item.rarity) {
                stats.armorClass.magicBonus += effects.armorClassBonus;
            }
            
            // Armi
            if (WEAPON_SLOTS.includes(slotId)) {
                stats.attacks[slotId] = {
                    name: item.name,
                    damage: item.damage?.damage_dice,
                    damageType: item.damage?.damage_type?.name,
                    bonus: effects.attackBonus || 0,
                    properties: item.properties || []
                };
            }
            
            // Effetti speciali
            if (effects.special?.length) {
                stats.special.push(...effects.special);
            }
        });
        
        // Calcola totale CA
        stats.armorClass.total = 
            stats.armorClass.base + 
            stats.armorClass.armor + 
            stats.armorClass.shield + 
            stats.armorClass.dexBonus + 
            stats.armorClass.magicBonus;
        
        // Calcola iniziativa
        stats.initiative.total = stats.initiative.base + stats.initiative.magicBonus + dexMod;
        
        return stats;
    }
    
    /**
     * Ottiene il peso totale dell'inventario
     * @returns {number} Peso totale in libbre
     */
    getTotalWeight() {
        return calculateTotalWeight(this.inventory);
    }
    
    /**
     * Conta gli oggetti attunati
     * @returns {number}
     */
    countAttunedItems() {
        return this.inventory.filter(item => item.isAttuned === true).length;
    }
    
    /**
     * Ottiene lo stato completo per il salvataggio
     * @returns {Object} Stato serializzabile
     */
    getState() {
        return {
            inventory: this.inventory,
            equippedSlots: this.equipped
        };
    }
    
    /**
     * Applica uno stato salvato
     * @param {Object} state - Stato da applicare
     */
    setState(state) {
        if (state.inventory) {
            this.inventory = state.inventory;
        }
        if (state.equippedSlots) {
            this.equipped = state.equippedSlots;
        }
    }
    
    /**
     * Esporta l'inventario in formato testo
     * @returns {string} Inventario formattato
     */
    exportAsText() {
        const lines = [];
        lines.push(`=== INVENTARIO: ${this.character.name || 'Personaggio'} ===`);
        lines.push('');
        
        // Equipaggiamento
        lines.push('--- EQUIPAGGIATO ---');
        Object.entries(this.equipped).forEach(([slot, item]) => {
            if (item) {
                const slotName = SLOT_TYPES[slot]?.name || slot;
                const attuned = item.isAttuned ? ' 🔗' : '';
                lines.push(`[${slotName}] ${item.customName || item.name}${attuned}`);
            }
        });
        
        lines.push('');
        lines.push('--- ZAINO ---');
        this.inventory.filter(i => !i.equipped).forEach(item => {
            const qty = item.quantity > 1 ? ` (×${item.quantity})` : '';
            const magical = item.rarity ? ` [${item.rarity.name}]` : '';
            lines.push(`${item.customName || item.name}${qty}${magical}`);
        });
        
        lines.push('');
        lines.push(`Peso totale: ${this.getTotalWeight().toFixed(1)} lb`);
        lines.push(`Attunement: ${this.countAttunedItems()}/${MAX_ATTUNEMENT}`);
        
        return lines.join('\n');
    }
}

export default EquipmentService;
