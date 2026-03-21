/**
 * Database delle Classi - Index
 * ─────────────────────────────────────────────────────────────
 * File di raccordo che esporta tutte le classi.
 * Ogni classe è in un file separato per facilitare la manutenzione.
 * 
 * @author DM Tool
 */

// Import delle singole classi
import { barbarian } from './barbarian.js';
import { bard } from './bard.js';
import { cleric } from './cleric.js';
import { druid } from './druid.js';
import { fighter } from './fighter.js';
import { monk } from './monk.js';
import { paladin } from './paladin.js';
import { ranger } from './ranger.js';
import { rogue } from './rogue.js';
import { sorcerer } from './sorcerer.js';
import { warlock } from './warlock.js';
import { wizard } from './wizard.js';

/**
 * Database unificato delle classi.
 * La chiave è l'index (inglese), il valore è l'oggetto classe completo.
 */
export const classDatabase = [
    barbarian,
    bard,
    cleric,
    druid,
    fighter,
    monk,
    paladin,
    ranger,
    rogue,
    sorcerer,
    warlock,
    wizard
];

// Export nominati per accesso diretto
export { 
    barbarian, 
    bard, 
    cleric, 
    druid, 
    fighter, 
    monk, 
    paladin, 
    ranger, 
    rogue, 
    sorcerer, 
    warlock, 
    wizard 
};