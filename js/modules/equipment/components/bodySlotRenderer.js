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
    width: 220,
    height: 380,
    viewBox: '0 0 220 380'
};

/**
 * Coordinate SVG per la silhouette umana
 * Una figura umana stilizzata più dettagliata
 */
const SILHOUETTE_PATHS = {
    // Testa (ovale più naturale)
    head: {
        type: 'ellipse',
        cx: 110,
        cy: 35,
        rx: 24,
        ry: 28
    },
    // Collo
    neck: {
        type: 'path',
        d: 'M 100 62 Q 100 68 98 75 L 122 75 Q 120 68 120 62 Z'
    },
    // Spalle e parte superiore torso
    shoulders: {
        type: 'path',
        d: 'M 60 85 Q 70 75 85 72 L 135 72 Q 150 75 160 85 L 158 95 Q 145 88 135 88 L 85 88 Q 75 88 62 95 Z'
    },
    // Torso
    torso: {
        type: 'path',
        d: 'M 75 95 L 70 165 Q 70 175 80 180 L 140 180 Q 150 175 150 165 L 145 95 Q 145 92 140 92 L 80 92 Q 75 92 75 95 Z'
    },
    // Braccio sinistro
    leftArm: {
        type: 'path',
        d: 'M 60 95 Q 45 100 35 125 L 28 170 Q 26 185 32 195 L 42 195 Q 44 185 45 170 L 52 130 Q 55 110 62 100 Z'
    },
    // Braccio destro
    rightArm: {
        type: 'path',
        d: 'M 160 95 Q 175 100 185 125 L 192 170 Q 194 185 188 195 L 178 195 Q 176 185 175 170 L 168 130 Q 165 110 158 100 Z'
    },
    // Mano sinistra
    leftHand: {
        type: 'ellipse',
        cx: 37,
        cy: 202,
        rx: 10,
        ry: 12
    },
    // Mano destra
    rightHand: {
        type: 'ellipse',
        cx: 183,
        cy: 202,
        rx: 10,
        ry: 12
    },
    // Gamba sinistra
    leftLeg: {
        type: 'path',
        d: 'M 80 180 L 72 290 Q 70 310 75 340 L 90 340 Q 92 310 94 290 L 102 220 L 110 220 L 118 290 Q 120 310 122 340 L 137 340 Q 142 310 140 290 L 132 180 Z'
    },
    // Piede sinistro
    leftFoot: {
        type: 'ellipse',
        cx: 82,
        cy: 352,
        rx: 18,
        ry: 10
    },
    // Piede destro
    rightFoot: {
        type: 'ellipse',
        cx: 130,
        cy: 352,
        rx: 18,
        ry: 10
    }
};

/**
 * Posizioni degli slot relativi alla silhouette
 */
const SLOT_POSITIONS = {
    head: { x: 110, y: 35, anchor: 'middle' },
    neck: { x: 110, y: 68, anchor: 'middle' },
    body: { x: 110, y: 130, anchor: 'middle' },
    mainHand: { x: 37, y: 170, anchor: 'end' },
    offHand: { x: 183, y: 170, anchor: 'start' },
    ringLeft: { x: 27, y: 210, anchor: 'end' },
    ringRight: { x: 193, y: 210, anchor: 'start' },
    belt: { x: 110, y: 175, anchor: 'middle' },
    hands: { x: 110, y: 200, anchor: 'middle' },
    feet: { x: 110, y: 350, anchor: 'middle' },
    cloak: { x: 195, y: 120, anchor: 'start' }
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
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <!-- Gradiente per la silhouette -->
                <linearGradient id="silhouette-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#5a5a5a;stop-opacity:0.9" />
                    <stop offset="50%" style="stop-color:#3a3a3a;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:0.7" />
                </linearGradient>
                <!-- Ombra per la silhouette -->
                <filter id="silhouette-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
                </filter>
                <!-- Effetto evidenziazione slot -->
                <filter id="slot-highlight" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feFlood flood-color="#d4af37" flood-opacity="0.6"/>
                    <feComposite in2="blur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <!-- Silhouette di base -->
            <g class="silhouette" filter="url(#silhouette-shadow)">
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
    
    // Testa (ellisse)
    svg += `
        <ellipse class="silhouette-part head" 
                cx="${SILHOUETTE_PATHS.head.cx}" 
                cy="${SILHOUETTE_PATHS.head.cy}"
                rx="${SILHOUETTE_PATHS.head.rx}"
                ry="${SILHOUETTE_PATHS.head.ry}"
                fill="url(#silhouette-gradient)" />
    `;
    
    // Collo
    svg += `
        <path class="silhouette-part neck"
              d="${SILHOUETTE_PATHS.neck.d}"
              fill="url(#silhouette-gradient)" />
    `;
    
    // Spalle
    svg += `
        <path class="silhouette-part shoulders"
              d="${SILHOUETTE_PATHS.shoulders.d}"
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
    
    // Mani
    svg += `
        <ellipse class="silhouette-part left-hand"
                cx="${SILHOUETTE_PATHS.leftHand.cx}"
                cy="${SILHOUETTE_PATHS.leftHand.cy}"
                rx="${SILHOUETTE_PATHS.leftHand.rx}"
                ry="${SILHOUETTE_PATHS.leftHand.ry}"
                fill="url(#silhouette-gradient)" />
        <ellipse class="silhouette-part right-hand"
                cx="${SILHOUETTE_PATHS.rightHand.cx}"
                cy="${SILHOUETTE_PATHS.rightHand.cy}"
                rx="${SILHOUETTE_PATHS.rightHand.rx}"
                ry="${SILHOUETTE_PATHS.rightHand.ry}"
                fill="url(#silhouette-gradient)" />
    `;
    
    // Gambe
    svg += `
        <path class="silhouette-part left-leg"
              d="${SILHOUETTE_PATHS.leftLeg.d}"
              fill="url(#silhouette-gradient)" />
    `;
    
    // Piedi
    svg += `
        <ellipse class="silhouette-part left-foot"
                cx="${SILHOUETTE_PATHS.leftFoot.cx}"
                cy="${SILHOUETTE_PATHS.leftFoot.cy}"
                rx="${SILHOUETTE_PATHS.leftFoot.rx}"
                ry="${SILHOUETTE_PATHS.leftFoot.ry}"
                fill="url(#silhouette-gradient)" />
        <ellipse class="silhouette-part right-foot"
                cx="${SILHOUETTE_PATHS.rightFoot.cx}"
                cy="${SILHOUETTE_PATHS.rightFoot.cy}"
                rx="${SILHOUETTE_PATHS.rightFoot.rx}"
                ry="${SILHOUETTE_PATHS.rightFoot.ry}"
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
