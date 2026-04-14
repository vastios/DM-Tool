/**
 * PgDataManager.js
 * ─────────────────────────────────────────────────────────────
 * Gestione dati CRUD per i Personaggi Giocanti.
 * Si occupa di: caricamento, salvataggio, validazione, calcoli automatici.
 * 
 * @author DM Tool
 * @version 1.0.0
 */

import { getCampaignPcs, updateCampaignPcs } from '../../../../stateManager.js';
import { 
    EMPTY_PG, 
    calculateModifier, 
    calculateProficiencyBonus, 
    calculateMaxHp,
    calculateSpellSaveDc,
    calculateSpellAttackBonus,
    ABILITY_KEY_TO_PROPERTY,
    PROPERTY_TO_ABILITY_KEY,
    ALL_SPELLCASTERS,
    SPELL_SLOTS_BY_LEVEL
} from './PgConstants.js';

export class PgDataManager {
    
    constructor() {
        this.pcs = [];
        console.log('📊 [PgDataManager] Inizializzato.');
    }
    
    // ========================================================================
    // CARICAMENTO E SALVATAGGIO
    // ========================================================================
    
    loadFromState() {
        this.pcs = getCampaignPcs();
        console.log(`📊 [PgDataManager] Caricati ${this.pcs.length} PG dallo stato.`);
        return this.pcs;
    }
    
    save() {
        updateCampaignPcs(this.pcs);
        console.log(`📊 [PgDataManager] Salvati ${this.pcs.length} PG nello stato.`);
    }
    
    // ========================================================================
    // OPERAZIONI CRUD
    // ========================================================================
    
    create(pgData) {
        console.log('📊 [PgDataManager] Creazione nuovo PG:', pgData.name);
        
        const newId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        
        const newPg = {
            ...EMPTY_PG,
            ...pgData,
            id: newId,
            hp: {
                current: pgData.hp?.max || 0,
                max: pgData.hp?.max || 0,
                temp: 0
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.pcs.push(newPg);
        this.save();
        
        console.log('📊 [PgDataManager] PG creato con ID:', newId);
        return newPg;
    }
    
    update(pgId, updates) {
        console.log('📊 [PgDataManager] Aggiornamento PG:', pgId);
        
        const index = this.pcs.findIndex(pg => pg.id === pgId);
        
        if (index === -1) {
            console.error('📊 [PgDataManager] PG non trovato:', pgId);
            return null;
        }
        
        // Deep merge: per ogni proprietà in updates, se sia il valore corrente
        // che il nuovo valore sono oggetti plain (non array, non null),
        // fai il merge ricorsivo invece di sovrascrivere.
        // Questo evita che update({ hp: { current: 5 } }) perda hp.max e hp.temp.
        const current = this.pcs[index];
        const merged = { ...current };
        
        for (const key of Object.keys(updates)) {
            const newVal = updates[key];
            const oldVal = current[key];
            
            if (
                newVal !== null &&
                typeof newVal === 'object' &&
                !Array.isArray(newVal) &&
                oldVal !== null &&
                typeof oldVal === 'object' &&
                !Array.isArray(oldVal)
            ) {
                // Deep merge per oggetti plain (es. hp, hitDice, proficiencies, treasure)
                merged[key] = { ...oldVal, ...newVal };
            } else {
                // Sovrascrittura per primitive, array, null
                merged[key] = newVal;
            }
        }
        
        merged.updatedAt = new Date().toISOString();
        this.pcs[index] = merged;
        
        this.save();
        console.log('📊 [PgDataManager] PG aggiornato:', pgId);
        
        return this.pcs[index];
    }
    
    delete(pgId) {
        console.log('📊 [PgDataManager] Eliminazione PG:', pgId);
        
        const index = this.pcs.findIndex(pg => pg.id === pgId);
        
        if (index === -1) {
            console.error('📊 [PgDataManager] PG non trovato:', pgId);
            return null;
        }
        
        const deleted = this.pcs.splice(index, 1);
        this.save();
        
        console.log('📊 [PgDataManager] PG eliminato:', pgId);
        return deleted[0];
    }
    
    getById(pgId) {
        return this.pcs.find(pg => pg.id === pgId);
    }
    
    getAll() {
        return [...this.pcs];
    }
    
    // ========================================================================
    // VALIDAZIONE
    // ========================================================================
    
    validate(pgData, step = null) {
        const errors = [];
        
        if (step === 1 || step === null) {
            if (!pgData.name || !pgData.name.trim()) {
                errors.push('Il nome del personaggio è obbligatorio.');
            }
            if (!pgData.race) {
                errors.push('La razza è obbligatoria.');
            }
            if (!pgData.class) {
                errors.push('La classe è obbligatoria.');
            }
            if (!pgData.level || pgData.level < 1 || pgData.level > 20) {
                errors.push('Il livello deve essere tra 1 e 20.');
            }
        }
        
        if (step === 2 || step === null) {
            const abilities = pgData.abilities || {};
            for (const [key, value] of Object.entries(abilities)) {
                if (typeof value !== 'number' || value < 1 || value > 20) {
                    errors.push(`La caratteristica ${key} deve essere tra 1 e 20.`);
                }
            }
        }
        
        if (step === 3 || step === null) {
            const skills = pgData.skills || [];
            const bgSkills = pgData._bgSkills || [];
            const classProfChoices = pgData._classNumSkillChoices;
            // Escludi le skill del background dal conteggio (sono automatiche)
            const userSkillCount = skills.filter(s => !bgSkills.includes(s)).length;
            if (classProfChoices && userSkillCount > classProfChoices) {
                errors.push(`Hai selezionato ${userSkillCount} abilità da classe, ma il limite è ${classProfChoices}.`);
            }
        }
        
        if (step === 4 || step === null) {
            // Valida che i trucchetti siano entro il limite
            if (pgData.spellcasting && pgData.spellcasting.spellsKnown) {
                const cantrips = pgData.spellcasting.spellsKnown.filter(s => {
                    const name = typeof s === 'string' ? s : s.name;
                    const level = typeof s === 'object' ? s.level : 0;
                    return level === 0;
                });
                const maxCantrips = pgData._maxCantrips;
                if (maxCantrips !== null && maxCantrips !== undefined && cantrips.length > maxCantrips) {
                    errors.push(`Troppi trucchetti: ${cantrips.length} selezionati, massimo ${maxCantrips}.`);
                }
            }
        }
        
        const result = {
            isValid: errors.length === 0,
            errors: errors
        };
        
        if (!result.isValid) {
            console.warn('📊 [PgDataManager] Validazione fallita:', errors);
        }
        
        return result;
    }
    
    // ========================================================================
    // CALCOLI AUTOMATICI
    // ========================================================================
    
    calculateDerivedStats(pgData, selectedRace, selectedClass) {
        console.log('📊 [PgDataManager] Calcolo statistiche derivate...');
        
        const level = pgData.level || 1;
        const abilities = pgData.abilities || EMPTY_PG.abilities;
        
        const proficiencyBonus = calculateProficiencyBonus(level);
        
        const hitDieSize = selectedClass?.hit_die || 8;
        const maxHp = calculateMaxHp(hitDieSize, abilities.constitution, level);
        
        const initiative = calculateModifier(abilities.dexterity);
        const speed = selectedRace?.speed || 9;
        const baseAc = 10 + calculateModifier(abilities.dexterity);
        
        let spellcasting = null;
        if (selectedClass && ALL_SPELLCASTERS.includes(selectedClass.index)) {
            const spellcastingAbility = this.determineSpellcastingAbility(selectedClass.index);
            const abilityScore = abilities[spellcastingAbility] || 10;
            
            spellcasting = {
                ability: spellcastingAbility,
                spellSaveDC: calculateSpellSaveDc(proficiencyBonus, abilityScore),
                spellAttackBonus: calculateSpellAttackBonus(proficiencyBonus, abilityScore),
                slots: { ...SPELL_SLOTS_BY_LEVEL[level] },
                slotsMax: { ...SPELL_SLOTS_BY_LEVEL[level] },
                spellsKnown: pgData.spellcasting?.spellsKnown || [],
                spellsPrepared: pgData.spellcasting?.spellsPrepared || []
            };
        }
        
        return {
            proficiencyBonus,
            hitDice: {
                total: level,
                current: level,
                size: `d${hitDieSize}`
            },
            hp: {
                current: maxHp,
                max: maxHp,
                temp: 0
            },
            initiative,
            speed,
            baseAc,
            spellcasting
        };
    }
    
    determineSpellcastingAbility(classIndex) {
        const mapping = {
            'bard': 'charisma',
            'cleric': 'wisdom',
            'druid': 'wisdom',
            'paladin': 'charisma',
            'ranger': 'wisdom',
            'sorcerer': 'charisma',
            'warlock': 'charisma',
            'wizard': 'intelligence'
        };
        return mapping[classIndex] || 'intelligence';
    }
    
    applyRacialBonuses(baseAbilities, race) {
        if (!race || !race.ability_bonuses) {
            return { ...baseAbilities };
        }
        
        const result = { ...baseAbilities };
        
        race.ability_bonuses.forEach(bonus => {
            const abilityKey = bonus.ability_score?.index;
            if (abilityKey && ABILITY_KEY_TO_PROPERTY[abilityKey]) {
                const property = ABILITY_KEY_TO_PROPERTY[abilityKey];
                result[property] = (result[property] || 10) + bonus.bonus;
            }
        });
        
        return result;
    }
    
    calculateSkillModifier(pg, skillName) {
        const abilities = pg.abilities || {};
        const skillAbility = {
            'Acrobazia': 'dexterity',
            'Addestrare Animali': 'wisdom',
            'Arcano': 'intelligence',
            'Atletica': 'strength',
            'Inganno': 'charisma',
            'Storia': 'intelligence',
            'Intuizione': 'wisdom',
            'Intimidire': 'charisma',
            'Indagare': 'intelligence',
            'Medicina': 'wisdom',
            'Natura': 'intelligence',
            'Percezione': 'wisdom',
            'Esibizione': 'charisma',
            'Persuasione': 'charisma',
            'Religione': 'intelligence',
            'Rapidità di Mano': 'dexterity',
            'Furtività': 'dexterity',
            'Sopravvivenza': 'wisdom'
        };
        
        const ability = skillAbility[skillName] || 'intelligence';
        const abilityScore = abilities[ability] || 10;
        let modifier = calculateModifier(abilityScore);
        
        if (pg.skills && pg.skills.includes(skillName)) {
            modifier += pg.proficiencyBonus || 2;
        }
        
        return modifier;
    }
    
    calculateSavingThrowModifier(pg, abilityKey) {
        const property = ABILITY_KEY_TO_PROPERTY[abilityKey];
        const abilityScore = pg.abilities?.[property] || 10;
        let modifier = calculateModifier(abilityScore);
        
        if (pg.savingThrows && pg.savingThrows.includes(abilityKey.toUpperCase())) {
            modifier += pg.proficiencyBonus || 2;
        }
        
        return modifier;
    }
    
    // ========================================================================
    // UTILITÀ PER HP E CONDIZIONI
    // ========================================================================
    
    modifyHp(pgId, delta) {
        const pg = this.getById(pgId);
        if (!pg) return null;
        
        let newCurrent = pg.hp.current + delta;
        newCurrent = Math.min(newCurrent, pg.hp.max);
        newCurrent = Math.max(newCurrent, 0);
        
        return this.update(pgId, {
            hp: {
                ...pg.hp,
                current: newCurrent
            }
        });
    }
    
    addTempHp(pgId, tempHp) {
        const pg = this.getById(pgId);
        if (!pg) return null;
        
        const newTempHp = Math.max(pg.hp.temp, tempHp);
        
        return this.update(pgId, {
            hp: {
                ...pg.hp,
                temp: newTempHp
            }
        });
    }
    
    addCondition(pgId, condition) {
        const pg = this.getById(pgId);
        if (!pg) return null;
        
        if (pg.conditions.includes(condition)) {
            return pg;
        }
        
        return this.update(pgId, {
            conditions: [...pg.conditions, condition]
        });
    }
    
    removeCondition(pgId, condition) {
        const pg = this.getById(pgId);
        if (!pg) return null;
        
        return this.update(pgId, {
            conditions: pg.conditions.filter(c => c !== condition)
        });
    }
    
    clearConditions(pgId) {
        return this.update(pgId, { conditions: [] });
    }
    
    // ========================================================================
    // ESPORTAZIONE / IMPORTAZIONE
    // ========================================================================
    
    exportToJson(pgId) {
        const pg = this.getById(pgId);
        if (!pg) return null;
        
        return JSON.stringify(pg, null, 2);
    }
    
    importFromJson(jsonString) {
        try {
            const pgData = JSON.parse(jsonString);
            
            delete pgData.id;
            delete pgData.createdAt;
            delete pgData.updatedAt;
            
            return this.create(pgData);
        } catch (error) {
            console.error('📊 [PgDataManager] Errore importazione JSON:', error);
            return null;
        }
    }
    
    reset() {
        this.pcs = [];
        console.log('📊 [PgDataManager] Cache resettata.');
    }
}

console.log('📊 [PgDataManager] Modulo caricato.');