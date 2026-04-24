/**
 * backgrounds.js
 * ─────────────────────────────────────────────────────────────
 * Database dei background (Sfondi) per la creazione personaggi.
 * Importa da file individuali nella cartella backgrounds/
 * Basato su SRD 5.1 (Italiano)
 */

import { accolito } from './backgrounds/accolito.js';
import { criminale } from './backgrounds/criminale.js';
import { eroePopolare } from './backgrounds/eroePopolare.js';
import { nobile } from './backgrounds/nobile.js';
import { sapiente } from './backgrounds/sapiente.js';
import { soldato } from './backgrounds/soldato.js';

/**
 * Database dei background disponibili
 * Ogni background include:
 * - index: identificatore univoco
 * - nome: nome del background
 * - descrizione: descrizione del background
 * - competenze: abilità e strumenti concessi
 * - equipaggiamento: lista equipment
 * - privilegio: feature speciale del background
 * - caratteristiche_suggerite: tratti, ideali, legami, difetti
 */
export const backgroundDatabase = [
    accolito,
    criminale,
    eroePopolare,
    nobile,
    sapiente,
    soldato
];

// Esporta anche come default
export default backgroundDatabase;

/**
 * Ottiene un background per index
 * @param {string} index - L'index del background
 * @returns {Object|undefined} Il background trovato o undefined
 */
export function getBackgroundByIndex(index) {
    return backgroundDatabase.find(bg => bg.index === index);
}

/**
 * Ottiene la lista dei nomi dei background
 * @returns {Array<string>} Array di nomi
 */
export function getBackgroundNames() {
    return backgroundDatabase.map(bg => bg.nome);
}
