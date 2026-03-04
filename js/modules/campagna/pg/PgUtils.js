// js/modules/campagna/pg/PgUtils.js

// --- FUNZIONI HELPER ---
const getAbilityModifier = (score) => Math.floor((score - 10) / 2);
const extractValue = (field) => { 
    if (!field) return 'N/A'; 
    if (typeof field === 'string') return field; 
    if (typeof field === 'object' && field.name) return field.name; 
    return 'N/A'; 
};

// --- DATABASE COMPETENZE ---
const skillsDatabase = [
    { name: 'Acrobazia', ability: 'dexterity' },
    { name: 'Addestrare Animali', ability: 'wisdom' },
    { name: 'Arcano', ability: 'intelligence' },
    { name: 'Atletica', ability: 'strength' },
    { name: 'Furtività', ability: 'dexterity' },
    { name: 'Indagare', ability: 'intelligence' }, // FIX: corretto da aggressiveness a ability
    { name: 'Inganno', ability: 'charisma' },
    { name: 'Intimidire', ability: 'charisma' },
    { name: 'Intuire', ability: 'wisdom' },
    { name: 'Medicina', ability: 'wisdom' },
    { name: 'Natura', ability: 'intelligence' },
    { name: 'Percezione', ability: 'wisdom' },
    { name: 'Persuasione', ability: 'charisma' },
    { name: 'Rapidità di Mano', ability: 'dexterity' },
    { name: 'Religione', ability: 'intelligence' },
    { name: 'Sopravvivenza', ability: 'wisdom' },
    { name: 'Spettacolo', ability: 'charisma' },
    { name: 'Storia', ability: 'intelligence' }
];
// --- CONFIGURAZIONE DATA-DRIVEN PER L'EDITOR ---
// L'ho reso renderPcEditor asincrono per importare la configurazione solo quando serve.
const editorConfig = {
    'characterName': { label: 'Nome Personaggio', type: 'text', required: true },
    'playerName': { label: 'Nome Giocatore', type: 'text', required: true },
    'race': { label: 'Razza', type: 'select' },
    'class': { label: 'Classe', type: 'select' },
    'level': { label: 'Livello', type: 'number', min: 1, max: 20 },
    'background': { label: 'Background', type: 'text' },
    'alignment': { label: 'Allineamento', type: 'text' },
    'abilities': {
        label: 'Caratteristiche', type: 'grid',
        fields: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(stat => ({ id: stat, label: stat.charAt(0).toUpperCase() + stat.slice(1), type: 'number', min: 1, max: 20 }))
    },
    'armorClass': { label: 'Classe Armatura (CA)', type: 'number' },
    'maxHp': { label: 'PF Massimi', type: 'number' },
    'hitDice': { label: 'Dadi Vita', type: 'text' },
    'speed': { label: 'Velocità (m)', type: 'number' },
    'notes': { label: 'Note del Master', type: 'textarea' }
};
export { getAbilityModifier, extractValue, editorConfig, skillsDatabase }; // Modificato: aggiunto skillsDatabase all'export