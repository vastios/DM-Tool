/**
 * popups.js
 * ─────────────────────────────────────────────────────────────
 * Generazione contenuti per i popup del Combat Tracker
 */

import { TAG_COLORS } from './config.js';
import { getAvailablePcs, getAvailableNpcs, getSavedEncounters } from './config.js';
import { monsterDatabase } from '../../../database/monsterDatabase.js';

/**
 * Genera il contenuto del popup PG
 */
export function generatePcsPopupContent() {
    const availablePcs = getAvailablePcs();
    
    if (availablePcs.length === 0) {
        return `<div class="popup-empty">
            <p>Nessun PG nella campagna.</p>
            <p class="hint">Crea i PG dal modulo Personaggi.</p>
        </div>`;
    }
    
    return `
        <div class="popup-header">
            <span>👥 Personaggi Giocanti (${availablePcs.length})</span>
            <button class="btn-add-all-pcs" title="Aggiungi tutto il party">⚔️ Carica Tutti</button>
        </div>
        <div class="popup-list">
            ${availablePcs.map(pc => `
                <div class="popup-item" data-type="pc" data-id="${pc.id}">
                    <div class="popup-item-info">
                        <span class="popup-item-name">${pc.name}</span>
                        <span class="popup-item-detail">${pc.className || ''} Lv.${pc.level || 1}</span>
                    </div>
                    <div class="popup-item-stats">
                        <span>PF: ${pc.hp?.max || pc.hp || '?'}</span>
                        <span>CA: ${pc.ac || '?'}</span>
                    </div>
                    <button class="btn-add-source" data-type="pc" data-id="${pc.id}">➕</button>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Genera il contenuto del popup PNG
 */
export function generateNpcsPopupContent(searchTerm = '') {
    const availableNpcs = getAvailableNpcs();
    let filtered = availableNpcs;
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = availableNpcs.filter(n => 
            (n.name || '').toLowerCase().includes(term) ||
            (n.role || '').toLowerCase().includes(term)
        );
    }
    
    if (filtered.length === 0) {
        return `<div class="popup-empty"><p>Nessun PNG trovato.</p></div>`;
    }
    
    return `
        <div class="popup-header">
            <span>👥 PNG della Campagna (${filtered.length})</span>
        </div>
        <div class="popup-search">
            <input type="text" class="popup-search-input" placeholder="Cerca PNG..." value="${searchTerm}">
        </div>
        <div class="popup-list">
            ${filtered.map(npc => {
                const tag = npc.tag || 'neutrale';
                const tagColor = TAG_COLORS[tag] || '#888';
                return `
                    <div class="popup-item" data-type="npc" data-id="${npc.id}">
                        <div class="popup-item-info">
                            <span class="popup-item-name">${npc.name}</span>
                            <span class="popup-item-tag" style="background: ${tagColor}">${tag}</span>
                        </div>
                        <div class="popup-item-stats">
                            <span>PF: ${npc.hp || '?'}</span>
                            <span>CA: ${npc.ac || '?'}</span>
                        </div>
                        <button class="btn-add-source" data-type="npc" data-id="${npc.id}">➕</button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

/**
 * Genera il contenuto del popup Mostri
 */
export function generateMonstersPopupContent(searchTerm = '', typeFilter = 'Tutti') {
    const types = ['Tutti', ...new Set(monsterDatabase.map(m => m.type))].sort();
    
    let filtered = monsterDatabase;
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(m => m.name.toLowerCase().includes(term));
    }
    if (typeFilter !== 'Tutti') {
        filtered = filtered.filter(m => m.type === typeFilter);
    }
    
    filtered = filtered.slice(0, 30);
    
    return `
        <div class="popup-header">
            <span>👹 Mostri dal Compendio</span>
        </div>
        <div class="popup-search">
            <input type="text" class="popup-search-input" placeholder="Cerca mostro..." value="${searchTerm}">
        </div>
        <div class="popup-filters">
            ${types.map(t => `<button class="popup-filter-btn ${t === typeFilter ? 'active' : ''}" data-type="${t}">${t}</button>`).join('')}
        </div>
        <div class="popup-list">
            ${filtered.map(monster => `
                <div class="popup-item" data-type="monster" data-index="${monster.index}">
                    <div class="popup-item-info">
                        <span class="popup-item-name">${monster.name}</span>
                        <span class="popup-item-detail">${monster.size} ${monster.type}, CR ${monster.challenge_rating}</span>
                    </div>
                    <div class="popup-item-stats">
                        <span>PF: ${monster.hit_points}</span>
                        <span>CA: ${monster.armor_class[0]?.value || '?'}</span>
                    </div>
                    <button class="btn-add-source" data-type="monster" data-index="${monster.index}">➕</button>
                </div>
            `).join('')}
            ${filtered.length === 0 ? '<p class="popup-no-results">Nessun mostro trovato</p>' : ''}
            ${filtered.length === 30 ? '<p class="popup-limited">Mostrati primi 30 risultati</p>' : ''}
        </div>
    `;
}

/**
 * Genera il contenuto del popup Incontri
 */
export function generateEncountersPopupContent() {
    const savedEncounters = getSavedEncounters();
    
    if (savedEncounters.length === 0) {
        return `<div class="popup-empty">
            <p>Nessun incontro salvato.</p>
            <p class="hint">Crea incontri dal modulo Encounter Builder.</p>
        </div>`;
    }
    
    return `
        <div class="popup-header">
            <span>💾 Incontri Salvati (${savedEncounters.length})</span>
        </div>
        <div class="popup-list">
            ${savedEncounters.map(enc => `
                <div class="popup-item encounter-item" data-encounter-id="${enc.id}">
                    <div class="popup-item-info">
                        <span class="popup-item-name">${enc.name}</span>
                        <span class="popup-item-detail">${enc.monsters?.length || 0} tipi di creature</span>
                    </div>
                    <button class="btn-import-encounter-popup" data-id="${enc.id}">📥 Importa</button>
                </div>
            `).join('')}
        </div>
    `;
}
