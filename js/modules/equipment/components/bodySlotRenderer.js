/**
 * bodySlotRenderer.js
 * ─────────────────────────────────────────────────────────────
 * Render SVG del corpo umano con slot equipaggiamento.
 * Genera una visualizzazione interattiva della silhouette.
 * 
 * @version 1.0.0
 */

import { SLOT_TYPES } from '../config/slotTypes.js';

/**
 * Configurazione dimensioni SVG
 */
const SVG_CONFIG = {
    width: 200,
    height: 340,
    viewBox: '0 0 200 340'
};

/**
 * Coordinate SVG per la silhouette umana
 * I path sono disegnati per una figura stilizzata
 */
const SILHOUETTE_PATHS = {
    // Testa (cerchio)
    head: {
        type: 'circle',
        cx: 100,
        cy: 30,
        r: 22
    },
    // Collo
    neck: {
        type: 'rect',
        x: 92,
        y: 50,
        width: 16,
        height: 15,
        rx: 3
    },
    // Torso
    torso: {
        type: 'path',
        d: 'M 60 65 Q 60 75 70 90 L 70 150 Q 70 160 80 165 L 120 165 Q 130 160 130 150 L 130 90 Q 140 75 140 65 Q 140 60 130 60 L 70 60 Q 60 60 60 65 Z'
    },
    // Braccio sinistro
    leftArm: {
        type: 'path',
        d: 'M 60 70 Q 50 75 40 95 L 35 130 Q 33 145 38 160 L 42 160 Q 47 145 45 130 L 50 95 Q 55 80 60 75 Z'
    },
    // Braccio destro
    rightArm: {
        type: 'path',
        d: 'M 140 70 Q 150 75 160 95 L 165 130 Q 167 145 162 160 L 158 160 Q 153 145 155 130 L 150 95 Q 145 80 140 75 Z'
    },
    // Gambe
    legs: {
        type: 'path',
        d: 'M 80 165 L 75 260 Q 73 280 75 300 L 85 300 Q 88 280 90 260 L 100 200 L 110 260 Q 112 280 115 300 L 125 300 Q 127 280 125 260 L 120 165 Z'
    }
};

/**
 * Posizioni degli slot relativi alla silhouette
 */
const SLOT_POSITIONS = {
    head: { x: 100, y: 30, anchor: 'middle' },
    neck: { x: 100, y: 58, anchor: 'middle' },
    body: { x: 100, y: 110, anchor: 'middle' },
    mainHand: { x: 35, y: 145, anchor: 'end' },
    offHand: { x: 165, y: 145, anchor: 'start' },
    ringLeft: { x: 38, y: 168, anchor: 'end' },
    ringRight: { x: 162, y: 168, anchor: 'start' },
    belt: { x: 100, y: 155, anchor: 'middle' },
    hands: { x: 100, y: 145, anchor: 'middle' },
    feet: { x: 100, y: 290, anchor: 'middle' },
    cloak: { x: 170, y: 100, anchor: 'start' }
};

/**
 * Genera l'SVG completo della silhouette con slot
 * @param {Object} equipment - Equipaggiamento attuale { slotId: item }
 * @param {Object} options - Opzioni di render
 * @returns {string} HTML SVG
 */
export function renderBodySVG(equipment = {}, options = {}) {
    const {
        showLabels = true,
        interactive = true,
        selectedSlot = null,
        highlightSlots = []
    } = options;
    
    const slots = Object.entries(SLOT_POSITIONS).map(([slotId, pos]) => {
        const slotDef = SLOT_TYPES[slotId];
        const equipped = equipment[slotId];
        const isSelected = selectedSlot === slotId;
        const isHighlighted = highlightSlots.includes(slotId);
        
        return renderSlot(slotId, pos, slotDef, equipped, {
            showLabels,
            interactive,
            isSelected,
            isHighlighted
        });
    }).join('');
    
    return `
        <svg class="body-slots-svg" 
             viewBox="${SVG_CONFIG.viewBox}" 
             width="${SVG_CONFIG.width}" 
             height="${SVG_CONFIG.height}">
            <defs>
                <filter id="slot-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <linearGradient id="silhouette-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#4a4a4a;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:0.6" />
                </linearGradient>
            </defs>
            
            <!-- Silhouette di base -->
            <g class="silhouette">
                ${renderSilhouette()}
            </g>
            
            <!-- Slot equipaggiamento -->
            <g class="equipment-slots">
                ${slots}
            </g>
        </svg>
    `;
}

/**
 * Renderizza la silhouette umana
 * @returns {string} SVG paths
 */
function renderSilhouette() {
    let svg = '';
    
    // Testa
    svg += `
        <circle class="silhouette-part head" 
                cx="${SILHOUETTE_PATHS.head.cx}" 
                cy="${SILHOUETTE_PATHS.head.cy}" 
                r="${SILHOUETTE_PATHS.head.r}"
                fill="url(#silhouette-gradient)" />
    `;
    
    // Collo
    svg += `
        <rect class="silhouette-part neck"
              x="${SILHOUETTE_PATHS.neck.x}"
              y="${SILHOUETTE_PATHS.neck.y}"
              width="${SILHOUETTE_PATHS.neck.width}"
              height="${SILHOUETTE_PATHS.neck.height}"
              rx="${SILHOUETTE_PATHS.neck.rx}"
              fill="url(#silhouette-gradient)" />
    `;
    
    // Torso
    svg += `
        <path class="silhouette-part torso"
              d="${SILHOUETTE_PATHS.torso.d}"
              fill="url(#silhouette-gradient)" />
    `;
    
    // Braccia
    svg += `
        <path class="silhouette-part left-arm"
              d="${SILHOUETTE_PATHS.leftArm.d}"
              fill="url(#silhouette-gradient)" />
        <path class="silhouette-part right-arm"
              d="${SILHOUETTE_PATHS.rightArm.d}"
              fill="url(#silhouette-gradient)" />
    `;
    
    // Gambe
    svg += `
        <path class="silhouette-part legs"
              d="${SILHOUETTE_PATHS.legs.d}"
              fill="url(#silhouette-gradient)" />
    `;
    
    return svg;
}

/**
 * Renderizza un singolo slot
 * @param {string} slotId - ID dello slot
 * @param {Object} pos - Posizione { x, y, anchor }
 * @param {Object} slotDef - Definizione dello slot
 * @param {Object} equipped - Oggetto equipaggiato (null se vuoto)
 * @param {Object} options - Opzioni
 * @returns {string} SVG elemento
 */
function renderSlot(slotId, pos, slotDef, equipped, options) {
    const { showLabels, interactive, isSelected, isHighlighted } = options;
    
    const hasItem = equipped !== null && equipped !== undefined;
    const icon = hasItem ? getItemIcon(equipped) : slotDef.icon;
    const slotClass = [
        'equipment-slot',
        slotId,
        hasItem ? 'equipped' : 'empty',
        isSelected ? 'selected' : '',
        isHighlighted ? 'highlighted' : ''
    ].filter(Boolean).join(' ');
    
    // Calcola offset per etichetta
    const labelOffset = pos.anchor === 'middle' ? 0 : 
                        pos.anchor === 'end' ? -5 : 5;
    
    // Sfondo slot
    const slotBg = `
        <circle class="slot-bg" 
                cx="${pos.x}" 
                cy="${pos.y}" 
                r="18"
                data-slot="${slotId}" />
    `;
    
    // Icona
    const iconText = `
        <text class="slot-icon" 
              x="${pos.x}" 
              y="${pos.y + 5}"
              text-anchor="middle"
              data-slot="${slotId}">
            ${icon}
        </text>
    `;
    
    // Etichetta (solo se richiesto)
    const labelText = showLabels ? `
        <text class="slot-label"
              x="${pos.x + labelOffset}"
              y="${pos.y + 28}"
              text-anchor="${pos.anchor}">
            ${slotDef.name}
        </text>
    ` : '';
    
    // Indicatore oggetto equipaggiato
    const equippedIndicator = hasItem ? `
        <circle class="equipped-indicator"
                cx="${pos.x + 12}"
                cy="${pos.y - 10}"
                r="5" />
    ` : '';
    
    const wrapperTag = interactive ? 'g' : 'g';
    const wrapperAttrs = interactive ? 
        `class="${slotClass}" data-slot="${slotId}" role="button" tabindex="0"` :
        `class="${slotClass}" data-slot="${slotId}"`;
    
    return `
        <${wrapperTag} ${wrapperAttrs}>
            ${slotBg}
            ${iconText}
            ${equippedIndicator}
            ${labelText}
        </${wrapperTag}>
    `;
}

/**
 * Ottiene l'icona per un oggetto
 * @param {Object} item - L'oggetto
 * @returns {string} Emoji icona
 */
function getItemIcon(item) {
    if (!item) return '❓';
    
    // Se l'oggetto ha un'icona personalizzata
    if (item.icon) return item.icon;
    
    // Determina icona dalla categoria
    const category = item.equipment_category?.index || item.equipment_category?.name?.toLowerCase();
    const name = item.name?.toLowerCase() || '';
    
    // Armi
    if (category === 'weapon') {
        if (name.includes('spada') || name.includes('sword')) return '🗡️';
        if (name.includes('ascia') || name.includes('axe')) return '🪓';
        if (name.includes('martello') || name.includes('hammer')) return '🔨';
        if (name.includes('arco') || name.includes('bow')) return '🏹';
        if (name.includes('balestra') || name.includes('crossbow')) return '🏹';
        if (name.includes('lancia') || name.includes('spear')) return '🔱';
        if (name.includes('pugnale') || name.includes('dagger')) return '🔪';
        if (name.includes('mazza') || name.includes('mace')) return '🏏';
        if (name.includes('staff') || name.includes('bastone')) return '🪄';
        return '⚔️';
    }
    
    // Armature
    if (category === 'armor') {
        if (name.includes('scudo') || name.includes('shield')) return '🛡️';
        if (name.includes('elmo') || name.includes('helm')) return '🎩';
        if (name.includes('guanto') || name.includes('gauntlet')) return '🧤';
        if (name.includes('stivali') || name.includes('boots')) return '👢';
        return '🦺';
    }
    
    // Oggetti magici
    if (item.rarity || item.isMagical) {
        if (name.includes('anello') || name.includes('ring')) return '💍';
        if (name.includes('amuleto') || name.includes('amulet')) return '📿';
        if (name.includes('cintura') || name.includes('belt')) return '🔗';
        if (name.includes('mantello') || name.includes('cloak')) return '🧥';
        if (name.includes('pozione') || name.includes('potion')) return '🧪';
        if (name.includes('pergamena') || name.includes('scroll')) return '📜';
        if (name.includes('varita') || name.includes('wand')) return '✨';
        if (name.includes('bastone') || name.includes('staff')) return '🪄';
        return '✨';
    }
    
    // Default
    return '📦';
}

/**
 * Renderizza un placeholder vuoto per il body slots
 * @returns {string} HTML
 */
export function renderEmptyBodyPlaceholder() {
    return `
        <div class="body-slots-placeholder">
            <svg viewBox="${SVG_CONFIG.viewBox}" width="${SVG_CONFIG.width}" height="${SVG_CONFIG.height}">
                <text x="100" y="170" text-anchor="middle" fill="#666" font-size="14">
                    Seleziona un personaggio
                </text>
            </svg>
        </div>
    `;
}

/**
 * Renderizza solo gli slot senza la silhouette (versione compatta)
 * @param {Object} equipment - Equipaggiamento attuale
 * @param {Object} options - Opzioni
 * @returns {string} HTML
 */
export function renderCompactSlotGrid(equipment = {}, options = {}) {
    const slotOrder = ['head', 'neck', 'body', 'cloak', 'mainHand', 'offHand', 'hands', 'belt', 'ringLeft', 'ringRight', 'feet'];
    
    const slots = slotOrder.map(slotId => {
        const slotDef = SLOT_TYPES[slotId];
        const equipped = equipment[slotId];
        const hasItem = equipped !== null && equipped !== undefined;
        const icon = hasItem ? getItemIcon(equipped) : slotDef.icon;
        
        return `
            <div class="compact-slot ${hasItem ? 'equipped' : 'empty'}" 
                 data-slot="${slotId}"
                 title="${slotDef.name}${hasItem ? `: ${equipped.name || equipped.customName}` : ''}">
                <span class="slot-icon">${icon}</span>
                <span class="slot-name">${slotDef.name}</span>
            </div>
        `;
    }).join('');
    
    return `<div class="compact-slots-grid">${slots}</div>`;
}

export default {
    renderBodySVG,
    renderEmptyBodyPlaceholder,
    renderCompactSlotGrid
};
