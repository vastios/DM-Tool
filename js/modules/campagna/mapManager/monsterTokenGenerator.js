// monsterTokenGenerator.js
// ─────────────────────────────────────────────────────────────
// Generatore di token SVG per mostri da piazzare sulle mappe.
// Token circolari colorati per tipo mostro, dimensionati per taglia.

import { monsterDatabase } from '../../../../database/monsterDatabase.js';

/**
 * Colori per tipo di mostro (D&D 5e in italiano).
 */
const MONSTER_TYPE_COLORS = {
    'aberrazione': '#8b5cf6',     // viola
    'bestia': '#84cc16',          // verde lime
    'celestiale': '#fbbf24',      // oro
    'costrutto': '#94a3b8',       // grigio slate
    'drago': '#ef4444',           // rosso
    'elementale': '#06b6d4',      // cyan
    'fata': '#ec4899',            // rosa
    'immondo': '#7c3aed',         // viola scuro
    'gigante': '#f97316',         // arancione
    'umanoide': '#3b82f6',        // blu
    'mostruosità': '#dc2626',     // rosso scuro
    'melma': '#10b981',           // verde smeraldo
    'non morto': '#22c55e',       // verde
    'pianta': '#16a34a',          // verde foresta
    'demone': '#be185d',          // rosa scuro
    'diavolo': '#b91c1c',         // rosso vino
};

/**
 * Dimensioni token per taglia mostro (D&D 5e in italiano).
 * Valori in pixel per una mappa a zoom 100%.
 */
const MONSTER_SIZE_PIXELS = {
    'Minuscolo': 18,
    'Piccolo': 24,
    'Media': 32,
    'Grande': 44,
    'Enorme': 56,
    'Gigantesco': 72,
    // Fallback inglesi
    'Tiny': 18,
    'Small': 24,
    'Medium': 32,
    'Large': 44,
    'Huge': 56,
    'Gargantuan': 72,
};

/**
 * Ottiene il colore per un tipo di mostro.
 */
export function getColorForMonsterType(type) {
    if (!type) return '#6b7280';
    const normalized = type.toLowerCase().trim();
    return MONSTER_TYPE_COLORS[normalized] || '#6b7280';
}

/**
 * Ottiene la dimensione in pixel per la taglia di un mostro.
 */
export function getPixelSizeForMonster(size) {
    if (!size) return 32;
    return MONSTER_SIZE_PIXELS[size] || 32;
}

/**
 * Genera l'HTML di un token mostro.
 */
export function generateMonsterTokenHTML(options = {}) {
    const {
        name = '?',
        type = '',
        size = 'Media',
        color = null,
        hp = null,
        maxHp = null,
        conditions = []
    } = options;
    
    const tokenColor = color || getColorForMonsterType(type);
    const pixelSize = getPixelSizeForMonster(size);
    const initial = (name || '?').charAt(0).toUpperCase();
    
    // Calcola percentuale HP per la barra
    let hpPercent = 100;
    let hpColor = '#22c55e';
    if (hp !== null && maxHp !== null && maxHp > 0) {
        hpPercent = Math.max(0, (hp / maxHp) * 100);
        if (hpPercent <= 25) hpColor = '#ef4444';
        else if (hpPercent <= 50) hpColor = '#f59e0b';
    }
    
    // Genera icone condizioni
    const conditionBadges = conditions.map((cond, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const radius = pixelSize / 2 + 8;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return `<div class="token-condition-badge" style="left: calc(50% + ${x}px); top: calc(50% + ${y}px);" title="${escapeHtml(cond)}">${getConditionEmoji(cond)}</div>`;
    }).join('');
    
    return `
        <div class="monster-token" style="width: ${pixelSize}px; height: ${pixelSize}px;">
            <div class="monster-token-circle" style="background: ${tokenColor}; border-color: ${darkenColor(tokenColor)};">
                <span class="monster-token-initial">${initial}</span>
            </div>
            ${hp !== null ? `
                <div class="monster-token-hp-bar">
                    <div class="monster-token-hp-fill" style="width: ${hpPercent}%; background: ${hpColor};"></div>
                </div>
            ` : ''}
            <span class="monster-token-label">${escapeHtml(name)}</span>
            ${conditionBadges}
        </div>
    `;
}

function getConditionEmoji(condition) {
    const map = {
        'Avvelenato': '🤢', 'Stordito': '💫', 'Paralizzato': '⚡',
        'Pietrificato': '🗿', 'Affascinato': '😍', 'Spaventato': '😱',
        'Accecato': '🙈', 'Assordato': '🔇', 'Prono': '⬇️',
        'Trattenuto': '🔗', 'Afferrato': '✊', 'Inabile': '💀',
        'Svenuto': '💤', 'Invisibile': '👻', 'Intralciato': '🥾',
    };
    return map[condition] || '⚠️';
}

/**
 * Crea un oggetto token da un mostro del database.
 */
export function buildTokenFromMonster(monsterIndex, overrides = {}) {
    const monster = monsterDatabase.find(m => m.index === monsterIndex || m.name === monsterIndex);
    if (!monster) return null;
    
    const hp = monster.hit_points || 1;
    return {
        id: `tok_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        type: 'monster',
        refId: monster.index,
        name: overrides.name || monster.name,
        monsterType: monster.type || '',
        monsterSize: monster.size || 'Media',
        color: getColorForMonsterType(monster.type),
        pixelSize: getPixelSizeForMonster(monster.size),
        hp: { current: hp, max: hp },
        conditions: [],
        x: overrides.x || 50,
        y: overrides.y || 50,
        ...overrides,
    };
}

/**
 * Crea token multipli da un incontro.
 */
export function buildTokensFromEncounter(monsters) {
    const tokens = [];
    if (!monsters || !Array.isArray(monsters)) return tokens;
    
    monsters.forEach(monsterRef => {
        const count = monsterRef.quantity || 1;
        for (let i = 0; i < count; i++) {
            const token = buildTokenFromMonster(monsterRef.index, {
                name: `${getMonsterShortName(monsterRef.index)}${count > 1 ? ' #' + (i + 1) : ''}`,
                x: 30 + Math.random() * 40,
                y: 30 + Math.random() * 40,
            });
            if (token) tokens.push(token);
        }
    });
    
    return tokens;
}

function getMonsterShortName(index) {
    const monster = monsterDatabase.find(m => m.index === index);
    if (!monster) return 'Mostro';
    return monster.name
        .replace(/^(Adulti?|Adulta|Giovani?|Giovana|Anziani?|Anziana)\s+/i, '')
        .trim();
}

function darkenColor(hex) {
    if (!hex || !hex.startsWith('#')) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const factor = 0.6;
    return `#${Math.floor(r * factor).toString(16).padStart(2, '0')}${Math.floor(g * factor).toString(16).padStart(2, '0')}${Math.floor(b * factor).toString(16).padStart(2, '0')}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('👹 [MonsterTokenGenerator] Modulo caricato.');
