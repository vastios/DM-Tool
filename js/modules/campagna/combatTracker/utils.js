/**
 * utils.js
 * ─────────────────────────────────────────────────────────────
 * Funzioni helper per formattazione e utility
 */

import { SOURCE_COLORS, TAG_COLORS } from './config.js';
import { spellDatabase } from '../../../database/spells.js';

/**
 * Genera il badge colorato per la fonte del combattente
 */
export function getSourceBadge(combatant) {
    const sourceType = combatant.sourceType || 'monster';
    
    if (sourceType === 'pc') {
        return `<span class="source-badge pc" style="background: ${SOURCE_COLORS.pc}">PG</span>`;
    }
    if (sourceType === 'npc') {
        const tag = combatant.tag || 'neutrale';
        const color = TAG_COLORS[tag] || SOURCE_COLORS.npc;
        const label = tag.charAt(0).toUpperCase() + tag.slice(1);
        return `<span class="source-badge npc" style="background: ${color}">${label}</span>`;
    }
    return `<span class="source-badge monster" style="background: ${SOURCE_COLORS.monster}">Mostro</span>`;
}

/**
 * Formatta gli incantesimi per la visualizzazione in combattimento
 */
export function formatSpellsForCombat(combatant) {
    if (!combatant.spellState) return '';
    
    const { cantrips, preparedSpells, remainingSlots } = combatant.spellState;
    let html = '<div class="combatant-spells"><h5>Incantesimi</h5>';

    const findSpell = (name) => {
        const key = name.trim().toLowerCase();
        return Object.values(spellDatabase).find(s => 
            s.name?.toLowerCase() === key || s.name?.toLowerCase().includes(key)
        );
    };

    if (cantrips?.length > 0) {
        html += '<div class="spell-section"><h6>Trucchetti</h6>';
        html += cantrips.map(c => {
            const spellName = typeof c === 'string' ? c : c.name;
            const s = findSpell(spellName);
            if (!s) return `<span class="spell-tag">${spellName}</span>`;
            const cleanDesc = (s.description || s.desc || '').replace(/'/g, "&apos;");
            return `<span class="special-action-link" data-name="${s.name}" data-desc="${cleanDesc}">${s.name}</span>`;
        }).filter(Boolean).join(', ');
        html += '</div>';
    }

    if (preparedSpells?.length > 0) {
        html += '<div class="spell-section"><h6>Preparati</h6>';
        if (remainingSlots && Object.keys(remainingSlots).length > 0) {
            const slotsInfo = Object.entries(remainingSlots)
                .filter(([l, c]) => l > 0)
                .map(([l, c]) => `L${l}: ${c}`)
                .join(' | ');
            html += `<div class="spell-slots-info">Slots: ${slotsInfo}</div>`;
        }
        html += '<div class="spell-buttons">';
        preparedSpells.forEach(p => {
            const spellName = typeof p === 'string' ? p : p.name;
            const spellLevel = typeof p === 'object' ? p.level : 1;
            const isDisabled = remainingSlots && remainingSlots[spellLevel] <= 0;
            html += `<button class="spell-btn ${isDisabled ? 'disabled' : ''}" 
                data-monster-id="${combatant.id}" 
                data-spell-level="${spellLevel}" 
                title="${spellName}">${spellName}</button>`;
        });
        html += '</div></div>';
    }
    return html + '</div>';
}

/**
 * Calcola il modificatore di caratteristica
 */
export function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

/**
 * Formatta un modificatore con segno
 */
export function formatModifier(mod) {
    return mod >= 0 ? `+${mod}` : `${mod}`;
}
