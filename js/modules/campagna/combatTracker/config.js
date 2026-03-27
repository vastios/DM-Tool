/**
 * config.js
 * ─────────────────────────────────────────────────────────────
 * Costanti, colori e cache per il Combat Tracker
 */

// Colori per le fonti dei combattenti
export const SOURCE_COLORS = {
    pc: '#4caf50',
    npc: '#2196f3',
    npc_enemy: '#f44336',
    monster: '#ff9800'
};

// Colori per i tag dei PNG
export const TAG_COLORS = {
    alleato: '#4caf50',
    nemico: '#f44336',
    neutrale: '#9e9e9e',
    contatto: '#2196f3',
    mentore: '#9c27b0',
    rivale: '#ff9800'
};

// Cache per resistenze, tiri salvezza e velocità
export const resistancesCache = {};
export const savesCache = {};
export const speedCache = {};

// Stato locale
export let previousRound = 0;
export let availablePcs = [];
export let availableNpcs = [];
export let savedEncounters = [];
export let selectedCombatantId = null;

// Setter per lo stato
export function setPreviousRound(value) {
    previousRound = value;
}

export function setAvailablePcs(value) {
    availablePcs = value;
}

export function setAvailableNpcs(value) {
    availableNpcs = value;
}

export function setSavedEncounters(value) {
    savedEncounters = value;
}

export function setSelectedCombatantId(value) {
    selectedCombatantId = value;
}

export function getPreviousRound() {
    return previousRound;
}

export function getAvailablePcs() {
    return availablePcs;
}

export function getAvailableNpcs() {
    return availableNpcs;
}

export function getSavedEncounters() {
    return savedEncounters;
}

export function getSelectedCombatantId() {
    return selectedCombatantId;
}
