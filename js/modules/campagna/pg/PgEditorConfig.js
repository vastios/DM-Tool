// js/modules/campagna/pg/PgEditorConfig.js

/**
 * Configurazione data-driven per il form di creazione/modifica del Personaggio Giocante (PG).
 * Organizzata in sezioni per un layout a scheda.
 */

// Database statico delle competenze per comodità
const skillsDatabase = [
    { name: 'Acrobazia', ability: 'dexterity' },
    { name: 'Addestrare Animali', ability: 'wisdom' },
    { name: 'Arcano', ability: 'intelligence' },
    { name: 'Atletica', ability: 'strength' },
    { name: 'Furtività', ability: 'dexterity' },
    { name: 'Intimidazione', ability: 'charisma' },
    { name: 'Indagare', ability: 'intelligence' },
    { name: 'Medicina', ability: 'wisdom' },
    { name: 'Natura', ability: 'intelligence' },
    { name: 'Percezione', ability: 'wisdom' },
    { name: 'Persuasione', ability: 'charisma' },
    { name: 'Rapidità di Mano', ability: 'dexterity' },
    { name: 'Religione', ability: 'intelligence' },
    { name: 'Sopravvivenza', ability: 'wisdom' },
    { name: 'Tecnologia', ability: 'intelligence' }
];

const editorConfig = {
    'identity': {
        label: 'Identità',
        fields: {
            'characterName': { label: 'Nome Personaggio', type: 'text', required: true },
            'playerName': { label: 'Nome Giocatore', type: 'text', required: true },
            'race': {
                label: 'Razza',
                type: 'select',
                options: (data) => {
                    if (!data || !data.races || !Array.isArray(data.races)) {
                        return [{ value: '', text: 'Dati razze non disponibili' }];
                    }
                    return [
                        { value: '', text: 'Seleziona una razza...' },
                        ...data.races.map(race => ({ value: race.name, text: race.name }))
                    ];
                }
            },
            // Usiamo un nome più specifico per evitare conflitti
            'backgroundMechanical': { label: 'Background', type: 'text' },
            // Miglioriamo l'allineamento rendendolo una select
            'alignment': {
                label: 'Allineamento',
                type: 'select',
                options: (data) => {
                    if (!data || !data.alignments || !Array.isArray(data.alignments)) {
                        return [{ value: '', text: 'Dati allineamenti non disponibili' }];
                    }
                    return [
                        { value: '', text: 'Seleziona un allineamento...' },
                        ...data.alignments.map(align => ({ value: align.name, text: align.name }))
                    ];
                }
            },
        }
    },
    'classes': {
        label: 'Classi e Livelli',
        type: 'dynamic-list',
        itemTemplate: {
            'class': {
                label: 'Classe',
                type: 'select',
                options: (data) => {
                    if (!data || !data.classes || !Array.isArray(data.classes)) {
                        return [{ value: '', text: 'Dati classi non disponibili' }];
                    }
                    return [
                        { value: '', text: 'Seleziona una classe...' },
                        ...data.classes.map(cls => ({ value: cls.name, text: cls.name }))
                    ];
                }
            },
            'level': { label: 'Livello', type: 'number', min: 1, max: 20, default: 1 },
        }
    },
    'abilities': {
        label: 'Caratteristiche',
        type: 'grid',
        fields: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(stat => ({
            id: stat,
            label: stat.charAt(0).toUpperCase() + stat.slice(1),
            type: 'number',
            min: 1,
            max: 20,
            default: 10
        }))
    },
    'combat': {
        label: 'Statistiche di Combattimento',
        fields: {
            'armorClass': { label: 'Classe Armatura (CA)', type: 'number', min: 10, default: 10 },
            'maxHp': { label: 'PF Massimi', type: 'number', min: 1, default: 8 },
            'hitDice': { label: 'Dadi Vita', type: 'text', placeholder: 'es. 1d8' },
            'speed': { label: 'Velocità (m)', type: 'number', min: 0, default: 9 },
        }
    },
    'skills': {
        label: 'Competenze',
        type: 'checkbox-group',
        // Usiamo optional chaining per sicurezza
        options: () => skillsDatabase.map(skill => ({ 
            value: skill.name, 
            text: `${skill.name} (${(skill.ability?.substring(0, 3) || 'N/D').toUpperCase()})` 
        }))
    },
    'spells': {
        label: 'Incantesimi',
        type: 'dynamic-spell-list',
        addButtonLabel: '+ Aggiungi Incantesimo'
    },
    'background': {
        label: 'Background e Storia',
        fields: {
            'story': { label: 'Storia del Personaggio', type: 'textarea' },
            'notes': { label: 'Note del Master', type: 'textarea' },
        }
    }
};

export { editorConfig, skillsDatabase };