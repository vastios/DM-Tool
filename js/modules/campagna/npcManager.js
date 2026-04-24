/**
 * npcManager.js
 * ─────────────────────────────────────────────────────────────
 * Modulo per la gestione dei Personaggi Non Giocanti (PNG).
 * 
 * Layout: 2 Card Flippabili (stile PG Manager)
 * - Card 1 Front: Identità (Nome, Razza, Ruolo, Tag, Aspetto, Personalità)
 * - Card 1 Back: Meccaniche (Stats, PF, CA, TS, Attacchi)
 * - Card 2 Front: Contesto (Relazioni, Luogo, Fazioni, Segreti)
 * - Card 2 Back: Risorse (Incantesimi per livello, Equipaggiamento)
 * 
 * Features:
 * - Generazione rapida da classe/livello (stile QuickBuilder)
 * - Sistema tag/etichette (Alleato, Nemico, Neutrale...)
 * - Integrazione wiki campagna (@tag links)
 * - Generazione nome automatica editabile
 * 
 * @version 3.0.0 - Refactoring completo
 */

import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { rollDice } from '../../../utils/dice.js';
import { spellDatabase } from '../../../database/spells.js';
import { addMonsterToCombat } from '../../../stateManager.js';
import { classDatabase } from '../../../database/classes/index.js';
import { raceDatabase } from '../../../database/races.js';
import { getSpellsByLevel, getMaxSpellLevel } from '../../../database/classSpells.js';
import { linkifyCampaignReferences, getAllCampaignElements } from '../../../utils/campaignLinker.js';
import { AlignmentGuide } from '../compendio/alignmentGuide.js';
import { initAutocomplete } from '../../../utils/autocomplete.js';

// ═══════════════════════════════════════════════════════════════
// COSTANTI E CONFIGURAZIONE
// ═══════════════════════════════════════════════════════════════

const ABILITY_NAMES = ['for', 'des', 'cos', 'int', 'sag', 'car'];
const ABILITY_IT = { for: 'FOR', des: 'DES', cos: 'COS', int: 'INT', sag: 'SAG', car: 'CAR' };
const ABILITY_FULL = { for: 'Forza', des: 'Destrezza', cos: 'Costituzione', int: 'Intelligenza', sag: 'Saggezza', car: 'Carisma' };

const TAG_OPTIONS = [
    { value: 'neutrale', label: 'Neutrale', color: '#888' },
    { value: 'alleato', label: 'Alleato', color: '#4caf50' },
    { value: 'nemico', label: 'Nemico', color: '#f44336' },
    { value: 'contatto', label: 'Contatto', color: '#2196f3' },
    { value: 'mentore', label: 'Mentore', color: '#9c27b0' },
    { value: 'rivale', label: 'Rivale', color: '#ff9800' }
];

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const CLASS_ABILITY_PRIORITY = {
    'Guerriero': ['for', 'cos', 'des', 'sag', 'car', 'int'],
    'Mago': ['int', 'cos', 'des', 'sag', 'car', 'for'],
    'Chierico': ['sag', 'cos', 'for', 'des', 'car', 'int'],
    'Ladro': ['des', 'cos', 'int', 'sag', 'car', 'for'],
    'Ranger': ['des', 'cos', 'sag', 'for', 'int', 'car'],
    'Paladino': ['for', 'car', 'cos', 'sag', 'des', 'int'],
    'Barbaro': ['for', 'cos', 'des', 'sag', 'car', 'int'],
    'Bardo': ['car', 'des', 'cos', 'int', 'sag', 'for'],
    'Druido': ['sag', 'cos', 'des', 'int', 'for', 'car'],
    'Monaco': ['des', 'sag', 'cos', 'for', 'int', 'car'],
    'Stregone': ['car', 'cos', 'des', 'sag', 'int', 'for'],
    'Warlock': ['car', 'cos', 'des', 'sag', 'int', 'for']
};

const SPELL_ABILITY = {
    'Mago': 'int', 'Chierico': 'sag', 'Druido': 'sag', 'Bardo': 'car',
    'Stregone': 'car', 'Warlock': 'car', 'Paladino': 'car', 'Ranger': 'sag'
};

// Nomi casuali
const NAMES_MALE = ['Goran', 'Theron', 'Kael', 'Bran', 'Darius', 'Marcus', 'Eldric', 'Roland', 'Gareth', 'Aldric', 'Torin', 'Viktor', 'Stefan', 'Nikolai', 'Henrik'];
const NAMES_FEMALE = ['Lyra', 'Kira', 'Elara', 'Mira', 'Thalia', 'Seraphina', 'Isolde', 'Brynn', 'Freya', 'Astrid', 'Helena', 'Natasha', 'Katya', 'Ingrid', 'Sigrid'];
const SURNAMES = ['Stoneheart', 'Nightshade', 'Ironforge', 'Stormwind', 'Shadowmere', 'Brightblade', 'Ashford', 'Blackwood', 'Silvermoon', 'Fireborn', 'Winterfell', 'Ravencrest', 'Dawnbringer', 'Thornwood', 'Greymane'];

// ═══════════════════════════════════════════════════════════════
// FUNZIONI UTILITÀ
// ═══════════════════════════════════════════════════════════════

function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getProficiencyBonus(level) {
    if (level < 5) return 2;
    if (level < 9) return 3;
    if (level < 13) return 4;
    if (level < 17) return 5;
    return 6;
}

function getClassByName(name) {
    return classDatabase.find(c => c.classe === name || c.name === name);
}

function getRaceByName(name) {
    return raceDatabase.find(r => r.name === name);
}

// ═══════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════

function getStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return null;
    return `dungeonMasterToolNpcs_${campaignId}`;
}

function saveNpcs(npcs) {
    const key = getStorageKey();
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(npcs));
        console.log(`💾 [NpcManager] Salvati ${npcs.length} PNG`);
    } catch (e) {
        console.error('❌ [NpcManager] Errore salvataggio:', e);
    }
}

function loadNpcs() {
    const key = getStorageKey();
    if (!key) return [];
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('❌ [NpcManager] Errore caricamento:', e);
        return [];
    }
}

// ═══════════════════════════════════════════════════════════════
// GENERAZIONE AUTOMATICA (da QuickBuilder)
// ═══════════════════════════════════════════════════════════════

function generateRandomName(gender = 'random') {
    const actualGender = gender === 'random' ? pickRandom(['male', 'female']) : gender;
    const names = actualGender === 'female' ? NAMES_FEMALE : NAMES_MALE;
    return `${pickRandom(names)} ${pickRandom(SURNAMES)}`;
}

function generateAbilityScores(className, focus = 'balanced') {
    const priority = CLASS_ABILITY_PRIORITY[className] || CLASS_ABILITY_PRIORITY['Guerriero'];
    let scores = [...STANDARD_ARRAY];
    
    // Variazione casuale
    scores = scores.map(s => Math.max(6, Math.min(18, s + Math.floor(Math.random() * 5) - 2)));
    scores.sort((a, b) => b - a);
    
    // Focus
    if (focus === 'offensive') {
        scores[0] = Math.min(18, scores[0] + 1);
        scores[2] = Math.max(6, scores[2] - 1);
    } else if (focus === 'defensive') {
        scores[1] = Math.min(18, scores[1] + 1);
        scores[0] = Math.max(6, scores[0] - 1);
    }
    
    const abilities = {};
    priority.forEach((abil, i) => abilities[abil] = scores[i]);
    return abilities;
}

function applyRacialBonuses(abilities, race) {
    const result = { ...abilities };
    if (race?.ability_bonuses) {
        race.ability_bonuses.forEach(bonus => {
            const idx = bonus.ability_score?.index?.toLowerCase();
            if (idx && result[idx] !== undefined) {
                result[idx] += bonus.bonus;
            }
        });
    }
    return result;
}

function calculateHP(classData, level, conMod) {
    const hitDie = classData?.hit_die || 8;
    let hp = hitDie + conMod;
    const avg = Math.floor(hitDie / 2) + 1;
    for (let i = 2; i <= level; i++) {
        hp += avg + conMod;
    }
    return Math.max(1, hp);
}

function calculateAC(abilities, classData) {
    const dexMod = getModifier(abilities['des']);
    const className = classData?.classe;
    
    if (className === 'Barbaro') {
        return 10 + dexMod + getModifier(abilities['cos']);
    }
    if (className === 'Monaco') {
        return 10 + dexMod + getModifier(abilities['sag']);
    }
    
    // Armatura default per classe
    const armorAC = {
        'Guerriero': 16, 'Paladino': 16, 'Chierico': 14,
        'Barbaro': 12, 'Ranger': 12, 'Ladro': 12, 'Bardo': 12, 'Druido': 12,
        'Mago': 10, 'Stregone': 10, 'Warlock': 10, 'Monaco': 10
    };
    
    const base = armorAC[className] || 10;
    
    // Armatura pesante non aggiunge DES
    if (['Guerriero', 'Paladino'].includes(className)) {
        return base;
    }
    // Armatura media limita DES a +2
    if (['Chierico', 'Barbaro', 'Ranger', 'Bardo', 'Druido'].includes(className)) {
        return base + Math.min(dexMod, 2);
    }
    // Armatura leggera
    return base + dexMod;
}

function generateSpellsForClass(className, level, abilities) {
    if (!SPELL_ABILITY[className]) return { cantrips: [], spells: [], byLevel: {} };
    
    const spellAbility = SPELL_ABILITY[className];
    const profBonus = getProficiencyBonus(level);
    const abilityMod = getModifier(abilities[spellAbility]);
    
    const result = {
        cantrips: [],
        spells: [],
        byLevel: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] },
        attackBonus: profBonus + abilityMod,
        dc: 8 + profBonus + abilityMod,
        ability: spellAbility
    };
    
    const maxLevel = getMaxSpellLevel(className, level);
    
    // Trucchetti
    const cantripCount = className === 'Mago' || className === 'Chierico' ? (level >= 10 ? 5 : level >= 4 ? 4 : 3) : 2;
    const cantrips = getSpellsByLevel(className, 0) || [];
    result.cantrips = shuffleArray(cantrips).slice(0, cantripCount);
    result.byLevel[0] = result.cantrips;
    
    // Incantesimi per livello
    for (let lvl = 1; lvl <= maxLevel; lvl++) {
        const available = getSpellsByLevel(className, lvl) || [];
        const count = Math.max(2, Math.ceil(level / 2) - lvl + 2);
        const selected = shuffleArray(available).slice(0, count);
        result.spells.push(...selected.map(s => ({ name: s, level: lvl })));
        result.byLevel[lvl] = selected;
    }
    
    return result;
}

function generateFullNpc(className, raceName, level, focus = 'balanced') {
    const classData = getClassByName(className);
    const raceData = getRaceByName(raceName);
    
    if (!classData || !raceData) {
        console.error('Classe o razza non trovata');
        return null;
    }
    
    let abilities = generateAbilityScores(className, focus);
    abilities = applyRacialBonuses(abilities, raceData);
    
    const profBonus = getProficiencyBonus(level);
    const conMod = getModifier(abilities['cos']);
    const hp = calculateHP(classData, level, conMod);
    const ac = calculateAC(abilities, classData);
    const spells = generateSpellsForClass(className, level, abilities);
    const savingThrows = (classData.saving_throws || []).map(st => st.index?.toUpperCase() || st.name?.toUpperCase());
    
    return {
        abilities,
        profBonus,
        hp,
        ac,
        speed: raceData.speed || 9,
        savingThrows,
        spells,
        hitDie: classData.hit_die || 8,
        className,
        classLevel: level
    };
}

// ═══════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════

const NpcManager = {
    render(containerElement) {
        this.container = containerElement;
        this.npcs = loadNpcs();
        this.currentNpcId = null;
        this.editMode = false;
        this.tempData = {};
        
        this.container.innerHTML = this.getMainLayout();
        this.bindGlobalEvents();
        this.renderNpcList();
        
        // Mostra il PNG più recente se esiste
        if (this.npcs.length > 0) {
            const recent = [...this.npcs].sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))[0];
            this.selectNpc(recent.id);
        }
        
        console.log('📋 [NpcManager] Modulo inizializzato v3.0');
    },
    
    getMainLayout() {
        return `
<style>
${this.getStyles()}
</style>
<div class="npc-manager-layout">
    <!-- Sidebar Lista PNG -->
    <div class="npc-sidebar">
        <div class="npc-sidebar-header">
            <h2>👥 Personaggi Non Giocanti</h2>
            <button class="npc-new-btn" id="npc-new-btn">+ Nuovo</button>
        </div>
        
        <div class="npc-search-box">
            <input type="text" id="npc-search" class="npc-search-input" placeholder="Cerca PNG...">
        </div>
        
        <div class="npc-list" id="npc-list"></div>
    </div>
    
    <!-- Area Principale: 2 Card Flippabili -->
    <div class="npc-main" id="npc-main">
        <div class="npc-empty-state">
            <div class="npc-empty-icon">👤</div>
            <p>Seleziona un PNG esistente o creane uno nuovo</p>
        </div>
    </div>
</div>
        `;
    },
    
    getStyles() {
        return `
/* Layout principale */
.npc-manager-layout {
    display: flex;
    height: 100%;
    gap: 0;
    background: var(--bg-secondary, #1a1a1a);
    overflow: hidden;
}

/* Sidebar */
.npc-sidebar {
    flex: 0 0 280px;
    background: var(--card-bg, #252525);
    border-right: 1px solid var(--border-color, #333);
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
}

.npc-sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.npc-sidebar-header h2 {
    margin: 0;
    font-family: 'Cinzel', serif;
    font-size: 0.95rem;
    color: var(--text-primary, #fff);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.npc-new-btn {
    padding: 0.25rem 0.6rem;
    background: linear-gradient(135deg, var(--accent-color, #d4af37) 0%, #8b6914 100%);
    border: none;
    border-radius: 3px;
    color: #fff;
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}

.npc-new-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.npc-search-box {
    margin-bottom: 0.75rem;
}

.npc-search-input {
    width: 100%;
    padding: 0.5rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-family: 'Lora', serif;
    font-size: 0.85rem;
}

.npc-list {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 0.75rem;
}

.npc-list-item {
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    padding: 0.6rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.npc-list-item:hover {
    background: var(--hover-bg, #3a3a3a);
    border-color: var(--accent-color, #d4af37);
}

.npc-list-item.selected {
    border-color: var(--accent-color, #d4af37);
    background: rgba(212, 175, 55, 0.1);
}

.npc-list-item-name {
    font-family: 'Cinzel', serif;
    font-size: 0.95rem;
    color: var(--text-primary, #fff);
    margin-bottom: 0.2rem;
}

.npc-list-item-info {
    font-size: 0.75rem;
    color: var(--text-muted, #888);
}

.npc-list-item-tag {
    display: inline-block;
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    font-size: 0.65rem;
    text-transform: uppercase;
    margin-left: 0.3rem;
}

.npc-list-item-actions {
    display: flex;
    gap: 0.3rem;
    margin-top: 0.4rem;
}

.npc-list-item-actions button {
    flex: 1;
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

/* Nuovo button - stile compatto come PG Manager */

/* Area principale */
.npc-main {
    flex: 1;
    display: flex;
    gap: 20px;
    padding: 15px;
    overflow: hidden;
    background: var(--bg-secondary, #1a1a1a);
}

.npc-empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-muted, #666);
}

.npc-empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

/* Cards container */
.npc-cards-container {
    display: flex;
    gap: 15px;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

/* Flip card - strutturata come PG Manager */
.npc-flip-card {
    flex: 1;
    perspective: 1000px;
    cursor: pointer;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.npc-flip-card-inner {
    position: relative;
    width: 100%;
    flex: 1;
    min-height: 0;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.npc-flip-card.flipped .npc-flip-card-inner {
    transform: rotateY(180deg);
}

/* Facce della card */
.npc-card-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    border-radius: 6px;
}

.npc-card-back {
    transform: rotateY(180deg);
}

/* Flip hint */
.flip-hint {
    position: absolute;
    bottom: 6px;
    right: 8px;
    font-size: 0.6rem;
    color: rgba(130, 32, 0, 0.4);
    font-style: italic;
}

/* Stile pergamena - uniformato al PG Manager */
.npc-parchment {
    background: linear-gradient(180deg, #f4e4bc 0%, #e8d4a8 100%);
    box-shadow: 
        inset 0 0 60px rgba(139, 115, 85, 0.15),
        0 0 20px rgba(61, 41, 20, 0.3);
    border: 2px solid #8b7355;
    border-radius: 6px;
    color: #3d2914;
    font-family: 'Cinzel', 'Georgia', serif;
    padding: 0.75rem;
    font-size: 0.85rem;
}

/* Wrapper contenuto card - gestisce il layout flex */
.npc-card-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
}

.npc-parchment h3 {
    font-family: 'Cinzel Decorative', 'Cinzel', serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #DC143C;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    margin: 0 0 0.2rem;
    letter-spacing: 0.03em;
    border-bottom: 2px solid #6b4423;
    padding-bottom: 0.3rem;
}

.npc-parchment h4 {
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0.5rem 0 0.2rem;
    border-bottom: 1px solid #8b7355;
    padding-bottom: 0.15rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.npc-parchment hr {
    border: none;
    height: 1px;
    background: linear-gradient(to right, #8b7355, transparent);
    margin: 0.4rem 0;
}

.npc-section {
    margin-bottom: 0.4rem;
}

.npc-section p {
    margin: 0.15rem 0;
    font-size: 0.8rem;
    line-height: 1.3;
}

.npc-secret {
    background: rgba(130, 32, 0, 0.1);
    border-left: 3px solid #822000;
    padding: 0.3rem;
    font-style: italic;
    font-size: 0.8rem;
}

/* Stats grid */
.npc-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    text-align: center;
    margin: 0.3rem 0;
}

.npc-stat-box {
    background: rgba(130, 32, 0, 0.1);
    border-radius: 4px;
    padding: 0.25rem;
}

.npc-stat-label {
    font-size: 0.6rem;
    color: #5a3a1a;
    text-transform: uppercase;
}

.npc-stat-value {
    font-size: 1rem;
    font-weight: bold;
    color: #822000;
}

.npc-stat-mod {
    font-size: 0.75rem;
    color: #5a3a1a;
}

/* Tag colorati */
.npc-tag-badge {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: bold;
    margin-left: 0.5rem;
}

/* Combat stats */
.npc-combat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
}

.npc-combat-stat {
    background: rgba(130, 32, 0, 0.1);
    border-radius: 4px;
    padding: 0.3rem;
    text-align: center;
}

.npc-combat-stat label {
    font-size: 0.6rem;
    color: #5a3a1a;
    text-transform: uppercase;
    display: block;
}

.npc-combat-stat .value {
    font-size: 1.1rem;
    font-weight: bold;
    color: #822000;
}

/* Spells grid 10 blocchi */
.npc-spells-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
}

.npc-spell-block {
    background: rgba(130, 32, 0, 0.08);
    border-radius: 4px;
    padding: 0.25rem;
}

.npc-spell-block.empty {
    opacity: 0.4;
    display: none;
}

.npc-spell-block-header {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    color: #5a3a1a;
    border-bottom: 1px solid rgba(130, 32, 0, 0.3);
    padding-bottom: 0.15rem;
    margin-bottom: 0.2rem;
}

.npc-spell-tag {
    display: inline-block;
    padding: 0.1rem 0.25rem;
    background: rgba(130, 32, 0, 0.15);
    border-radius: 3px;
    font-size: 0.65rem;
    margin: 0.05rem;
    cursor: pointer;
}

.npc-spell-tag:hover {
    background: rgba(130, 32, 0, 0.3);
}

/* Equipment list */
.npc-equipment-list {
    font-size: 0.8rem;
    margin: 0.2rem 0;
    padding-left: 1.2rem;
}

.npc-equipment-list li {
    margin: 0.1rem 0;
}

/* Editor form */
.npc-editor {
    flex: 1;
    padding: 1rem;
    background: var(--card-bg, #252525);
    border-radius: 8px;
    overflow-y: auto;
}

.npc-editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--accent-color, #d4af37);
}

.npc-editor-title {
    font-family: 'Cinzel', serif;
    font-size: 1.2rem;
    color: var(--text-primary, #fff);
}

.npc-editor-actions {
    display: flex;
    gap: 0.5rem;
}

.npc-form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.npc-form-group {
    flex: 1;
    margin-bottom: 0.75rem;
}

.npc-form-group label {
    display: block;
    font-size: 0.8rem;
    color: var(--text-muted, #888);
    margin-bottom: 0.25rem;
    text-transform: uppercase;
}

.npc-form-group input,
.npc-form-group select,
.npc-form-group textarea {
    width: 100%;
    padding: 0.5rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-family: 'Lora', serif;
    font-size: 0.9rem;
}

.npc-form-group textarea {
    min-height: 80px;
    resize: vertical;
}

/* Quick generation panel */
.npc-quick-gen {
    background: rgba(212, 175, 55, 0.1);
    border: 1px solid var(--accent-color, #d4af37);
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.npc-quick-gen-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin-bottom: 0.5rem;
}

.npc-quick-gen-title {
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    color: var(--accent-color, #d4af37);
}

.npc-quick-gen-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.npc-quick-gen-content .npc-form-group {
    margin-bottom: 0;
}

.npc-quick-gen-buttons {
    display: flex;
    gap: 0.5rem;
}

.npc-btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.npc-btn-primary {
    background: linear-gradient(135deg, #d4af37 0%, #8b6914 100%);
    color: #fff;
}

.npc-btn-secondary {
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    color: var(--text-primary, #fff);
}

.npc-btn-danger {
    background: linear-gradient(135deg, #8b0000 0%, #5a0000 100%);
    color: #fff;
}

.npc-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Name generator */
.npc-name-input-group {
    display: flex;
    gap: 0.5rem;
}

.npc-name-input-group input {
    flex: 1;
}

.npc-name-gen-btn {
    padding: 0.5rem 0.75rem;
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

/* Stats editor */
.npc-stats-editor {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.npc-stat-editor {
    text-align: center;
}

.npc-stat-editor label {
    font-size: 0.7rem;
    color: var(--text-muted, #888);
}

.npc-stat-editor input {
    width: 100%;
    padding: 0.4rem;
    text-align: center;
}

/* Campaign links */
.campaign-link {
    color: #d4af37;
    cursor: pointer;
    text-decoration: underline;
}

.campaign-link:hover {
    color: #f5d76e;
}

/* Responsive */
@media (max-width: 1200px) {
    .npc-cards-container {
        flex-direction: column;
    }
    
    .npc-flip-card {
        height: 50%;
        min-height: 200px;
    }
}

@media (max-width: 768px) {
    .npc-manager-layout {
        flex-direction: column;
    }
    
    .npc-sidebar {
        flex: 0 0 auto;
        max-height: 200px;
    }
}
        `;
    },
    
    // ─────────────────────────────────────────────────────────────
    // RENDERING LISTA
    // ─────────────────────────────────────────────────────────────
    
    renderNpcList(searchTerm = '') {
        const list = this.container.querySelector('#npc-list');
        if (!list) return;
        
        let filtered = this.npcs;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = this.npcs.filter(npc => 
                (npc.name || '').toLowerCase().includes(term) ||
                (npc.race || '').toLowerCase().includes(term) ||
                (npc.role || '').toLowerCase().includes(term)
            );
        }
        
        if (filtered.length === 0) {
            list.innerHTML = '<p class="npc-empty">Nessun PNG trovato</p>';
            return;
        }
        
        const sorted = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        
        list.innerHTML = sorted.map(npc => {
            const tag = TAG_OPTIONS.find(t => t.value === (npc.tag || 'neutrale')) || TAG_OPTIONS[0];
            const isSelected = npc.id === this.currentNpcId;
            
            return `
                <div class="npc-list-item ${isSelected ? 'selected' : ''}" data-npc-id="${npc.id}">
                    <div class="npc-list-item-name">
                        ${escapeHtml(npc.name || 'Senza Nome')}
                        <span class="npc-list-item-tag" style="background: ${tag.color}; color: #fff;">${tag.label}</span>
                    </div>
                    <div class="npc-list-item-info">
                        ${npc.race || ''} ${npc.className ? `(${npc.className} ${npc.classLevel || 1})` : ''} - ${npc.role || ''}
                    </div>
                    <div class="npc-list-item-actions">
                        <button class="npc-btn npc-btn-secondary btn-edit" data-npc-id="${npc.id}" title="Modifica">✏️</button>
                        <button class="npc-btn npc-btn-danger btn-delete" data-npc-id="${npc.id}" title="Elimina">🗑️</button>
                        <button class="npc-btn npc-btn-secondary btn-combat" data-npc-id="${npc.id}" title="Aggiungi al combattimento">⚔️</button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // ─────────────────────────────────────────────────────────────
    // SELEZIONE PNG
    // ─────────────────────────────────────────────────────────────
    
    selectNpc(npcId) {
        const npc = this.npcs.find(n => n.id === npcId);
        if (!npc) {
            console.warn(`[NpcManager] PNG con ID ${npcId} non trovato`);
            return;
        }
        
        this.currentNpcId = npcId;
        this.editMode = false;
        this.renderNpcList();
        this.renderNpcViewer(npc);
        console.log(`📋 [NpcManager] Selezionato PNG: ${npc.name}`);
    },
    
    // ─────────────────────────────────────────────────────────────
    // RENDERING VIEWER (2 CARD FLIPPABILI)
    // ─────────────────────────────────────────────────────────────
    
    renderNpcViewer(npc) {
        const main = this.container.querySelector('#npc-main');
        if (!main) return;
        
        const abilities = npc.abilities || { for: 10, des: 10, cos: 10, int: 10, sag: 10, car: 10 };
        const tag = TAG_OPTIONS.find(t => t.value === (npc.tag || 'neutrale')) || TAG_OPTIONS[0];
        const spells = npc.spells || { byLevel: {} };
        
        main.innerHTML = `
            <div class="npc-cards-container">
                <!-- Card 1 -->
                <div class="npc-flip-card" data-card="1">
                    <div class="npc-flip-card-inner">
                        <div class="npc-card-face npc-card-front">
                            <div class="npc-card-content npc-parchment">
                                <div class="flip-hint">↻ Click per girare</div>
                                <h3>${escapeHtml(npc.name || 'Senza Nome')}
                                    <span class="npc-tag-badge" style="background: ${tag.color}; color: #fff;">${tag.label}</span>
                                </h3>
                                <p><em>${npc.race || ''} ${npc.className ? `${npc.className} Liv.${npc.classLevel || 1}` : ''}</em></p>
                                ${npc.role ? `<p><strong>Ruolo:</strong> ${escapeHtml(npc.role)}</p>` : ''}
                                <hr>
                                
                                <h4>👤 Aspetto Fisico</h4>
                                <p>${linkifyCampaignReferences(escapeHtml(npc.appearance || 'Non specificato'))}</p>
                                
                                <h4>🎭 Personalità</h4>
                                <p>${linkifyCampaignReferences(escapeHtml(npc.personality || 'Non specificato'))}</p>
                                
                                ${npc.alignment ? `<h4>⚖️ Allineamento</h4><p>${escapeHtml(npc.alignment)}</p>` : ''}
                            </div>
                        </div>
                        
                        <div class="npc-card-face npc-card-back">
                            <div class="npc-card-content npc-parchment">
                                <div class="flip-hint">↻ Click per girare</div>
                                <h3>⚔️ Meccaniche</h3>
                                
                                <div class="npc-stats-grid">
                                    ${ABILITY_NAMES.map(ab => {
                                        const val = abilities[ab] || 10;
                                        const mod = getModifier(val);
                                        const hasSave = (npc.savingThrows || []).includes(ab.toUpperCase());
                                        return `
                                            <div class="npc-stat-box ${hasSave ? 'has-save' : ''}">
                                                <div class="npc-stat-label">${ABILITY_IT[ab]}</div>
                                                <div class="npc-stat-value">${val}</div>
                                                <div class="npc-stat-mod">${mod >= 0 ? '+' : ''}${mod}</div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                                
                                <hr>
                                
                                <div class="npc-combat-grid">
                                    <div class="npc-combat-stat">
                                        <label>PF</label>
                                        <span class="value">${npc.hp || 10}</span>
                                    </div>
                                    <div class="npc-combat-stat">
                                        <label>CA</label>
                                        <span class="value">${npc.ac || 10}</span>
                                    </div>
                                    <div class="npc-combat-stat">
                                        <label>Velocità</label>
                                        <span class="value">${npc.speed || 9}m</span>
                                    </div>
                                    <div class="npc-combat-stat">
                                        <label>Bonus Competenza</label>
                                        <span class="value">+${npc.profBonus || 2}</span>
                                    </div>
                                </div>
                                
                                ${spells.dc ? `
                                    <h4>🔮 Incantamento</h4>
                                    <p>CD Incantesimo: <strong>${spells.dc}</strong> | Attacco: <strong>+${spells.attackBonus}</strong></p>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Card 2 -->
                <div class="npc-flip-card" data-card="2">
                    <div class="npc-flip-card-inner">
                        <div class="npc-card-face npc-card-front">
                            <div class="npc-card-content npc-parchment">
                                <div class="flip-hint">↻ Click per girare</div>
                                <h3>🌍 Contesto</h3>
                                
                                <h4>📍 Luogo</h4>
                                <p>${linkifyCampaignReferences(escapeHtml(npc.location || 'Errante'))}</p>
                                
                                <h4>🤝 Relazioni</h4>
                                <p>${linkifyCampaignReferences(escapeHtml(npc.relazioni || 'Nessuna relazione nota'))}</p>
                                
                                ${npc.faction ? `
                                    <h4>🚩 Fazione</h4>
                                    <p>${linkifyCampaignReferences(escapeHtml(npc.faction))}</p>
                                ` : ''}
                                
                                <h4>🔒 Segreto del DM</h4>
                                <p class="npc-secret">${linkifyCampaignReferences(escapeHtml(npc.secretNote || 'Nessun segreto'))}</p>
                            </div>
                        </div>
                        
                        <div class="npc-card-face npc-card-back">
                            <div class="npc-card-content npc-parchment">
                                <div class="flip-hint">↻ Click per girare</div>
                                <h3>🎒 Risorse</h3>
                                
                                ${spells.byLevel && Object.values(spells.byLevel).some(arr => arr && arr.length > 0) ? `
                                    <h4>✨ Incantesimi</h4>
                                    <div class="npc-spells-grid">
                                        ${this.renderSpellBlocks(spells.byLevel)}
                                    </div>
                                ` : ''}
                                
                                <h4>📦 Equipaggiamento</h4>
                                <ul class="npc-equipment-list">
                                    ${(npc.inventory || []).map(item => `<li>${escapeHtml(typeof item === 'string' ? item : item.name)}</li>`).join('') || '<li>Nessun oggetto</li>'}
                                </ul>
                                
                                ${(npc.specialItems || []).length > 0 ? `
                                    <h4>⭐ Oggetti Speciali</h4>
                                    <ul class="npc-equipment-list">
                                        ${npc.specialItems.map(item => `<li><strong>${escapeHtml(item.name)}:</strong> ${escapeHtml(item.description)}</li>`).join('')}
                                    </ul>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Bind flip events - click sulla card intera
        main.querySelectorAll('.npc-flip-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Non flippare se si sta cliccando su un link o spell tag
                if (e.target.closest('.campaign-link, .npc-spell-tag')) return;
                
                // Previeni lo scroll
                e.preventDefault();
                
                card.classList.toggle('flipped');
            });
        });
        
        // Bind spell links
        main.querySelectorAll('.npc-spell-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const spellName = tag.dataset.spellName;
                if (spellName) {
                    document.dispatchEvent(new CustomEvent('openModuleWithItem', {
                        detail: { moduleId: 'spellList', itemId: spellName }
                    }));
                }
            });
        });
    },
    
    renderSpellBlocks(byLevel) {
        const levelNames = {
            0: 'Trucchetti', 1: '1°', 2: '2°', 3: '3°', 4: '4°', 
            5: '5°', 6: '6°', 7: '7°', 8: '8°', 9: '9°'
        };
        
        let html = '';
        for (let lvl = 0; lvl <= 9; lvl++) {
            const spells = byLevel[lvl] || [];
            const hasSpells = spells.length > 0;
            
            html += `
                <div class="npc-spell-block ${hasSpells ? '' : 'empty'}">
                    <div class="npc-spell-block-header">${levelNames[lvl]}${hasSpells ? ` (${spells.length})` : ''}</div>
                    ${hasSpells ? spells.map(s => {
                        const name = typeof s === 'string' ? s : s.name;
                        return `<span class="npc-spell-tag" data-spell-name="${escapeHtml(name)}">${escapeHtml(name)}</span>`;
                    }).join('') : '<span style="font-style: italic; opacity: 0.5;">—</span>'}
                </div>
            `;
        }
        return html;
    },
    
    // ─────────────────────────────────────────────────────────────
    // RENDERING EDITOR
    // ─────────────────────────────────────────────────────────────
    
    renderNpcEditor(npc = null) {
        const main = this.container.querySelector('#npc-main');
        if (!main) return;
        
        const isNew = !npc;
        this.editMode = true;
        this.tempData = npc ? { ...npc } : {
            abilities: { for: 10, des: 10, cos: 10, int: 10, sag: 10, car: 10 },
            profBonus: 2,
            hp: 10,
            ac: 10,
            speed: 9,
            savingThrows: [],
            spells: { byLevel: {}, cantrips: [], spells: [] },
            inventory: [],
            specialItems: [],
            tag: 'neutrale'
        };
        
        main.innerHTML = `
            <div class="npc-editor">
                <div class="npc-editor-header">
                    <span class="npc-editor-title">${isNew ? '➕ Nuovo PNG' : '✏️ Modifica PNG'}</span>
                    <div class="npc-editor-actions">
                        <button class="npc-btn npc-btn-primary" id="npc-save-btn">💾 Salva</button>
                        <button class="npc-btn npc-btn-secondary" id="npc-cancel-btn">❌ Annulla</button>
                    </div>
                </div>
                
                <!-- Quick Generation Panel -->
                <div class="npc-quick-gen">
                    <div class="npc-quick-gen-header">
                        <span class="npc-quick-gen-title">🎲 Generazione Rapida</span>
                    </div>
                    <div class="npc-quick-gen-content">
                        <div class="npc-form-group">
                            <label>Classe</label>
                            <select id="quick-class">
                                <option value="">-- Seleziona --</option>
                                ${classDatabase.map(c => `<option value="${c.classe}" ${this.tempData.className === c.classe ? 'selected' : ''}>${c.classe}</option>`).join('')}
                            </select>
                        </div>
                        <div class="npc-form-group">
                            <label>Livello</label>
                            <select id="quick-level">
                                ${Array.from({length: 20}, (_, i) => `<option value="${i+1}" ${this.tempData.classLevel === i+1 ? 'selected' : ''}>${i+1}</option>`).join('')}
                            </select>
                        </div>
                        <div class="npc-form-group">
                            <label>Focus</label>
                            <select id="quick-focus">
                                <option value="balanced">Bilanciato</option>
                                <option value="offensive">Offensivo</option>
                                <option value="defensive">Difensivo</option>
                            </select>
                        </div>
                    </div>
                    <div class="npc-quick-gen-buttons">
                        <button class="npc-btn npc-btn-secondary" id="quick-gen-stats">🎲 Genera Statistiche</button>
                        <button class="npc-btn npc-btn-primary" id="quick-gen-all">🎲 Genera Tutto</button>
                    </div>
                </div>
                
                <!-- Form principale -->
                <div class="npc-form-row">
                    <div class="npc-form-group" style="flex: 2;">
                        <label>Nome</label>
                        <div class="npc-name-input-group">
                            <input type="text" id="npc-name" value="${escapeHtml(npc?.name || '')}" placeholder="Nome del PNG">
                            <button class="npc-name-gen-btn" id="npc-gen-name" title="Genera nome casuale">🎲</button>
                        </div>
                    </div>
                    <div class="npc-form-group">
                        <label>Tag</label>
                        <select id="npc-tag">
                            ${TAG_OPTIONS.map(t => `<option value="${t.value}" ${this.tempData.tag === t.value ? 'selected' : ''}>${t.label}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="npc-form-row">
                    <div class="npc-form-group">
                        <label>Razza</label>
                        <select id="npc-race">
                            <option value="">-- Seleziona Razza --</option>
                            ${raceDatabase.map(r => `<option value="${r.name}" ${npc?.race === r.name ? 'selected' : ''}>${r.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="npc-form-group">
                        <label>Ruolo</label>
                        <input type="text" id="npc-role" value="${escapeHtml(npc?.role || '')}" placeholder="Es. Mercante, Guardia...">
                    </div>
                    <div class="npc-form-group">
                        <label>Allineamento</label>
                        <select id="npc-alignment">
                            <option value="">-- Seleziona Allineamento --</option>
                            ${Object.keys(AlignmentGuide.alignmentData || {}).map(align => `<option value="${align}" ${npc?.alignment === align ? 'selected' : ''}>${align}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <h4 style="color: var(--accent-color, #d4af37); margin: 1rem 0 0.5rem;">📊 Caratteristiche</h4>
                <div class="npc-stats-editor">
                    ${ABILITY_NAMES.map(ab => `
                        <div class="npc-stat-editor">
                            <label>${ABILITY_IT[ab]}</label>
                            <input type="number" id="stat-${ab}" value="${this.tempData.abilities[ab] || 10}" min="1" max="20">
                        </div>
                    `).join('')}
                </div>
                
                <div class="npc-form-row">
                    <div class="npc-form-group">
                        <label>Punti Ferita</label>
                        <input type="number" id="npc-hp" value="${this.tempData.hp || 10}" min="1">
                    </div>
                    <div class="npc-form-group">
                        <label>Classe Armatura</label>
                        <input type="number" id="npc-ac" value="${this.tempData.ac || 10}" min="1">
                    </div>
                    <div class="npc-form-group">
                        <label>Velocità (m)</label>
                        <input type="number" id="npc-speed" value="${this.tempData.speed || 9}" min="1">
                    </div>
                </div>
                
                <h4 style="color: var(--accent-color, #d4af37); margin: 1rem 0 0.5rem;">📝 Descrizione</h4>
                
                <div class="npc-form-group">
                    <label>Aspetto Fisico</label>
                    <textarea id="npc-appearance" placeholder="Descrivi l'aspetto...">${escapeHtml(npc?.appearance || '')}</textarea>
                </div>
                
                <div class="npc-form-group">
                    <label>Personalità</label>
                    <textarea id="npc-personality" placeholder="Descrivi il carattere...">${escapeHtml(npc?.personality || '')}</textarea>
                </div>
                
                <h4 style="color: var(--accent-color, #d4af37); margin: 1rem 0 0.5rem;">🌍 Contesto</h4>
                
                <div class="npc-form-row">
                    <div class="npc-form-group">
                        <label>Luogo</label>
                        <input type="text" id="npc-location" value="${escapeHtml(npc?.location || '')}" placeholder="Dove si trova? Usa @ per link">
                    </div>
                    <div class="npc-form-group">
                        <label>Fazione</label>
                        <input type="text" id="npc-faction" value="${escapeHtml(npc?.faction || '')}" placeholder="Fazione di appartenenza">
                    </div>
                </div>
                
                <div class="npc-form-group">
                    <label>Relazioni</label>
                    <textarea id="npc-relazioni" placeholder="Relazioni con altri PNG, PG... Usa @ per link">${escapeHtml(npc?.relazioni || '')}</textarea>
                </div>
                
                <div class="npc-form-group">
                    <label>🔒 Segreto del DM</label>
                    <textarea id="npc-secret" placeholder="Informazioni nascoste...">${escapeHtml(npc?.secretNote || '')}</textarea>
                </div>
                
                <h4 style="color: var(--accent-color, #d4af37); margin: 1rem 0 0.5rem;">🎒 Equipaggiamento & Risorse</h4>
                
                <div class="npc-form-group">
                    <label>Inventario</label>
                    <textarea id="npc-inventory" placeholder="Un oggetto per riga">${(npc?.inventory || []).map(i => typeof i === 'string' ? i : i.name).join('\n')}</textarea>
                </div>
            </div>
        `;
        
        this.bindEditorEvents(npc);
    },
    
    bindEditorEvents(originalNpc) {
        const main = this.container.querySelector('#npc-main');
        
        // Salva
        main.querySelector('#npc-save-btn')?.addEventListener('click', () => this.saveNpc(originalNpc));
        
        // Annulla
        main.querySelector('#npc-cancel-btn')?.addEventListener('click', () => {
            this.editMode = false;
            if (originalNpc) {
                this.renderNpcViewer(originalNpc);
            } else {
                this.renderEmptyState();
            }
        });
        
        // Genera nome
        main.querySelector('#npc-gen-name')?.addEventListener('click', () => {
            const nameInput = main.querySelector('#npc-name');
            if (nameInput) nameInput.value = generateRandomName();
        });
        
        // Quick generation - solo stats
        main.querySelector('#quick-gen-stats')?.addEventListener('click', () => {
            const className = main.querySelector('#quick-class')?.value;
            const raceName = main.querySelector('#npc-race')?.value; // Usa razza dal form principale
            const level = parseInt(main.querySelector('#quick-level')?.value) || 1;
            const focus = main.querySelector('#quick-focus')?.value || 'balanced';
            
            if (!className || !raceName) {
                showToast('Seleziona classe e razza per generare', 'warning');
                return;
            }
            
            const generated = generateFullNpc(className, raceName, level, focus);
            if (generated) {
                this.applyGeneratedStats(generated);
                showToast('Statistiche generate!', 'success');
            }
        });
        
        // Quick generation - tutto
        main.querySelector('#quick-gen-all')?.addEventListener('click', () => {
            const className = main.querySelector('#quick-class')?.value;
            const raceName = main.querySelector('#npc-race')?.value; // Usa razza dal form principale
            const level = parseInt(main.querySelector('#quick-level')?.value) || 1;
            const focus = main.querySelector('#quick-focus')?.value || 'balanced';
            
            if (!className || !raceName) {
                showToast('Seleziona classe e razza per generare', 'warning');
                return;
            }
            
            const generated = generateFullNpc(className, raceName, level, focus);
            if (generated) {
                this.applyGeneratedStats(generated);
                // Genera anche il nome se vuoto
                const nameInput = main.querySelector('#npc-name');
                if (nameInput && !nameInput.value) {
                    nameInput.value = generateRandomName();
                }
                
                showToast('PNG generato completamente!', 'success');
            }
        });
        
        // Aggiorna stats quando cambiano input
        main.querySelectorAll('.npc-stats-editor input').forEach(input => {
            input.addEventListener('change', () => this.updateDerivedStats());
        });
        
        // Autocomplete per le textarea (usando @tag)
        const textareas = main.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            initAutocomplete(textarea);
        });
        
        // Autocomplete anche per i campi input che supportano @tag
        const linkInputs = main.querySelectorAll('#npc-location, #npc-faction');
        linkInputs.forEach(input => {
            initAutocomplete(input);
        });
    },
    
    applyGeneratedStats(generated) {
        const main = this.container.querySelector('#npc-main');
        
        // Stats
        ABILITY_NAMES.forEach(ab => {
            const input = main.querySelector(`#stat-${ab}`);
            if (input) input.value = generated.abilities[ab] || 10;
        });
        
        // Derived
        const hpInput = main.querySelector('#npc-hp');
        const acInput = main.querySelector('#npc-ac');
        const speedInput = main.querySelector('#npc-speed');
        
        if (hpInput) hpInput.value = generated.hp;
        if (acInput) acInput.value = generated.ac;
        if (speedInput) speedInput.value = generated.speed;
        
        // Salva in tempData
        this.tempData = {
            ...this.tempData,
            ...generated
        };
    },
    
    updateDerivedStats() {
        const main = this.container.querySelector('#npc-main');
        const abilities = {};
        
        ABILITY_NAMES.forEach(ab => {
            const input = main.querySelector(`#stat-${ab}`);
            abilities[ab] = parseInt(input?.value) || 10;
        });
        
        // Ricalcola PF e CA base
        const conMod = getModifier(abilities['cos']);
        const dexMod = getModifier(abilities['des']);
        
        this.tempData.abilities = abilities;
        this.tempData.hp = 8 + conMod;
        this.tempData.ac = 10 + dexMod;
        
        // Aggiorna display
        const hpInput = main.querySelector('#npc-hp');
        const acInput = main.querySelector('#npc-ac');
        if (hpInput) hpInput.value = this.tempData.hp;
        if (acInput) acInput.value = this.tempData.ac;
    },
    
    saveNpc(originalNpc) {
        const main = this.container.querySelector('#npc-main');
        
        const name = main.querySelector('#npc-name')?.value?.trim();
        if (!name) {
            showToast('Il nome è obbligatorio', 'error');
            return;
        }
        
        const abilities = {};
        ABILITY_NAMES.forEach(ab => {
            abilities[ab] = parseInt(main.querySelector(`#stat-${ab}`)?.value) || 10;
        });
        
        const inventoryText = main.querySelector('#npc-inventory')?.value || '';
        const inventory = inventoryText.split('\n').map(l => l.trim()).filter(l => l);
        
        const npcData = {
            name,
            tag: main.querySelector('#npc-tag')?.value || 'neutrale',
            race: main.querySelector('#npc-race')?.value?.trim() || '',
            role: main.querySelector('#npc-role')?.value?.trim() || '',
            alignment: main.querySelector('#npc-alignment')?.value?.trim() || '',
            className: main.querySelector('#quick-class')?.value || '',
            classLevel: parseInt(main.querySelector('#quick-level')?.value) || 1,
            abilities,
            profBonus: this.tempData.profBonus || 2,
            hp: parseInt(main.querySelector('#npc-hp')?.value) || 10,
            ac: parseInt(main.querySelector('#npc-ac')?.value) || 10,
            speed: parseInt(main.querySelector('#npc-speed')?.value) || 9,
            savingThrows: this.tempData.savingThrows || [],
            appearance: main.querySelector('#npc-appearance')?.value?.trim() || '',
            personality: main.querySelector('#npc-personality')?.value?.trim() || '',
            location: main.querySelector('#npc-location')?.value?.trim() || '',
            faction: main.querySelector('#npc-faction')?.value?.trim() || '',
            relazioni: main.querySelector('#npc-relazioni')?.value?.trim() || '',
            secretNote: main.querySelector('#npc-secret')?.value?.trim() || '',
            inventory,
            specialItems: this.tempData.specialItems || [],
            spells: this.tempData.spells || { byLevel: {} },
            lastModified: Date.now()
        };
        
        if (originalNpc) {
            // Update
            const idx = this.npcs.findIndex(n => n.id === originalNpc.id);
            if (idx !== -1) {
                this.npcs[idx] = { ...originalNpc, ...npcData };
            }
        } else {
            // New
            npcData.id = Date.now().toString();
            npcData.createdAt = Date.now();
            this.npcs.push(npcData);
            this.currentNpcId = npcData.id;
        }
        
        saveNpcs(this.npcs);
        this.editMode = false;
        this.renderNpcList();
        this.renderNpcViewer(originalNpc ? { ...originalNpc, ...npcData } : npcData);
        showToast('PNG salvato!', 'success');
    },
    
    renderEmptyState() {
        const main = this.container.querySelector('#npc-main');
        if (main) {
            main.innerHTML = `
                <div class="npc-empty-state">
                    <div class="npc-empty-icon">👤</div>
                    <p>Seleziona un PNG esistente o creane uno nuovo</p>
                </div>
            `;
        }
    },
    
    // ─────────────────────────────────────────────────────────────
    // EVENTI GLOBALI
    // ─────────────────────────────────────────────────────────────
    
    bindGlobalEvents() {
        const container = this.container;
        
        // Ricerca
        container.querySelector('#npc-search')?.addEventListener('input', (e) => {
            this.renderNpcList(e.target.value);
        });
        
        // Nuovo PNG
        container.querySelector('#npc-new-btn')?.addEventListener('click', () => {
            this.currentNpcId = null;
            this.renderNpcEditor(null);
        });
        
        // Click su lista
        container.querySelector('#npc-list')?.addEventListener('click', (e) => {
            const item = e.target.closest('.npc-list-item');
            if (!item) return;
            
            const npcId = item.dataset.npcId;
            const npc = this.npcs.find(n => n.id === npcId);
            
            // Azioni
            if (e.target.closest('.btn-edit')) {
                this.renderNpcEditor(npc);
                return;
            }
            
            if (e.target.closest('.btn-delete')) {
                if (confirm(`Eliminare "${npc?.name}"?`)) {
                    this.npcs = this.npcs.filter(n => n.id !== npcId);
                    saveNpcs(this.npcs);
                    this.renderNpcList();
                    if (this.currentNpcId === npcId) {
                        this.currentNpcId = null;
                        this.renderEmptyState();
                    }
                    showToast('PNG eliminato', 'warning');
                }
                return;
            }
            
            if (e.target.closest('.btn-combat')) {
                this.addToCombat(npc);
                return;
            }
            
            // Selezione
            if (npc) {
                this.currentNpcId = npcId;
                this.editMode = false;
                this.renderNpcList();
                this.renderNpcViewer(npc);
            }
        });
    },
    
    addToCombat(npc) {
        if (!npc) return;
        
        const stats = {
            strength: npc.abilities?.for || 10,
            dexterity: npc.abilities?.des || 10,
            constitution: npc.abilities?.cos || 10,
            intelligence: npc.abilities?.int || 10,
            wisdom: npc.abilities?.sag || 10,
            charisma: npc.abilities?.car || 10
        };
        
        const dexMod = getModifier(stats.dexterity);
        const conMod = getModifier(stats.constitution);
        
        const monster = {
            name: npc.name,
            size: 'Medio',
            type: 'Umanoide',
            subtype: npc.race || 'Umano',
            alignment: npc.alignment || 'Neutrale',
            armor_class: [{ type: 'naturale', value: npc.ac || (10 + dexMod) }],
            hit_points: npc.hp || (8 + conMod),
            hit_dice: `${npc.classLevel || 1}d8 + ${conMod}`,
            speed: { camminare: `${npc.speed || 9} m.` },
            strength: stats.strength,
            dexterity: stats.dexterity,
            constitution: stats.constitution,
            intelligence: stats.intelligence,
            wisdom: stats.wisdom,
            charisma: stats.charisma,
            proficiencies: [],
            damage_vulnerabilities: [],
            damage_resistances: [],
            damage_immunities: [],
            condition_immunities: [],
            senses: { 'Percezione passiva': 10 + getModifier(stats.wisdom) },
            languages: 'Comune',
            challenge_rating: npc.classLevel || 1,
            xp: ((npc.classLevel || 1) ** 2) * 10,
            special_abilities: [],
            actions: [],
            reactions: [],
            legendary_actions: [],
            source: 'Gestore PNG',
            isNpc: true
        };
        
        addMonsterToCombat(monster);
        showToast(`${npc.name} aggiunto al combattimento!`, 'success');
    }
};

export default NpcManager;
