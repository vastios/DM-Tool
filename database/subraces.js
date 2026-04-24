// subraces.js

// Database delle sottorazze (SRD 5.1 in Italiano)
// Per aggiungere una sottorazza, copia questo blocco e modificalo.
export const subraceDatabase = [
    {
        "index": "hill-dwarf",
        "name": "Nano delle Colline",
        "race": {
            "index": "dwarf",
            "name": "Nano",
            "url": "/api/2014/races/dwarf"
        },
        "desc": "Da generazioni, i nani delle colline sono stati i più abili scavatori e prospector del regno, ma ora la loro stirpe è in declino. Hanno un'intuito acuto per i dintorni della loro terra nata e sono più resistenti dei nani di pianura. Hanno anche un'intuito acuto per i clan dei nani e la loro storia, e sono più leggeri e più agili dei loro cugini.",
        "ability_bonuses": [
            { "ability_score": { "index": "wis", "name": "SAG", "url": "/api/2014/ability-scores/wis" }, "bonus": 1 }
        ],
        // NOTA: I bonus FOR e COS sono ereditati dalla razza base (Nano)
        "ability_bonus_options": null, // Non ha scelte di bonus extra
        "traits": [
            { "index": "dwarven-toughness", "name": "Robustezza Nanica", "url": "/api/2014/traits/dwarven-toughness" }
            // NOTA: Gli altri tratti (Scurovisione, Resilienza, ecc.) sono ereditati dalla razza base
        ],
        "starting_proficiencies": [
            { "index": "light-hammer", "name": "Martello Leggero", "url": "/api/2014/proficiencies/light-hammer" }
        ],
        "languages": [
            { "index": "common", "name": "Comune", "url": "/api/2014/languages/common" },
            { "index": "dwarvish", "name": "Nanico", "url": "/api/2014/languages/dwarvish" }
        ],
        "language_options": null // Non ha scelte di lingua extra
    },
    {
        "index": "high-elf",
        "name": "Alto Elfo",
        "race": {
            "index": "elf",
            "name": "Elfo",
            "url": "/api/2014/races/elf"
        },
        "desc": "Gli alti elfi sono visti come i guardiani della tradizione elfica e della magia arcana. Hanno un'ottima conoscenza della storia e della teoria magica, e spesso intraprendono nei segreti del potere. La loro conoscenza della magia è tale che possono facilmente individuare incantesimi scritti in codice, anche se non conoscono la lingua in cui sono scritti.",
        "ability_bonuses": [
            { "ability_score": { "index": "int", "name": "INT", "url": "/api/2014/ability-scores/int" }, "bonus": 1 }
        ],
        // NOTA: Il bonus DES è ereditato dalla razza base (Elfo)
        "ability_bonus_options": null, // Non ha scelte di bonus extra
        "traits": [
            { "index": "elf-weapon-training", "name": "Addestramento nelle Armi Elfiche", "url": "/api/2014/traits/elf-weapon-training" },
            { "index": "high-elf-cantrip", "name": "Trucchetto dell'Elfo Alto", "url": "/api/2014/traits/high-elf-cantrip" }
            // NOTA: Gli altri tratti (Scurovisione, Discendenza Fatata, Trance, Sensi Acuti) sono ereditati dalla razza base
        ],
        "starting_proficiencies": [], // Competenze ereditate dalla razza base
        "languages": [
            { "index": "common", "name": "Comune", "url": "/api/2014/languages/common" },
            { "index": "elvish", "name": "Elfico", "url": "/api/2014/languages/elvish" }
        ],
        "language_options": [
            { "option_type": "reference", "item": { "index": "dwarvish", "name": "Nanico", "url": "/api/2014/languages/dwarvish" } },
            { "option_type": "reference", "item": { "index": "giant", "name": "Gigante", "url": "/api/2014/languages/giant" } },
            { "option_type": "reference", "item": { "index": "gnomish", "name": "Gnomesco", "url": "/api/2014/languages/gnomish" } },
            { "option_type": "reference", "item": { "index": "goblin", "name": "Goblin", "url": "/api/2014/languages/goblin" } },
            { "option_type": "reference", "item": { "index": "halfling", "name": "Halfling", "url": "/api/2014/languages/halfling" } },
            { "option_type": "reference", "item": { "index": "orc", "name": "Orchesco", "url": "/api/2014/languages/orc" } },
            { "option_type": "reference", "item": { "index": "abyssal", "name": "abissale", "url": "/api/2014/languages/abyssal" } },
            { "option_type": "reference", "item": { "index": "celestial", "name": "Celestiale", "url": "/api/2014/languages/celestial" } },
            { "option_type": "reference", "item": { "index": "draconic", "name": "Draconico", "url": "/api/2014/languages/draconic" } },
            { "option_type": "reference", "item": { "index": "deep-speech", "name": "Gergo delle Profondità", "url": "api/2014/languages/deep-speech" } },
            { "option_type": "reference", "item": { "index": "infernal", "name": "Infernale", "url": "/api/2014/languages/infernal" } },
            { "option_type": "reference", "item": { "index": "primordial", "name": "Primordiale", "url": "api/2014/languages/primordial" } },
            { "option_type": "reference", "item": { "index": "sylvan", "name": "Silvano", "url": "/api/2014/languages/sylvan" } },
            { "option_type": "reference", "item": { "index": "undercommon", "name": "Comune del Buio", "url": "/api/2014/languages/undercommon" } }
        ]
    },
    {
        "index": "lightfoot-halfling",
        "name": "Halfling Piedelesto",
        "race": {
            "index": "halfling",
            "name": "Halfling",
            "url": "api/2014/races/halfling"
        },
        "desc": "Gli halfling piedelesto sono più nascosti e comuni degli altri halfling. Sono più inclini a nascondere e a sfuggire via, e sono abili nel muoversi inosservato attraverso folta fitta. Il loro talento per la furtività li rende eccellenti ladri, spie e messaggeri.",
        "ability_bonuses": null, // Nessun bonus extra, eredita dalla razza base (Halfling)
        "ability_bonus_options": null, // Nessuna scelta di bonus extra
        "traits": [
            { "index": "naturally-stealthy", "name": "Furtività Naturale", "url": "/api/2014/traits/naturally-stealthy" }
            // NOTA: Gli altri tratti (Coraggioso, Agilità, Fortunato) sono ereditati dalla razza base
        ],
        "starting_proficiencies": [], // Competenze ereditate dalla razza base
        "languages": [
            { "index": "common", "name": "Comune", "url": "/api/2014/languages/common" },
            { "index": "halfling", "name": "Halfling", "url": "api/2014/languages/halfling" }
        ],
        "language_options": null // Nessuna scelta di lingua extra
    },
    {
        "index": "rock-gnome",
        "name": "Gnomo delle Rocce",
        "race": {
            "index": "gnome",
            "name": "Gnomo",
            "url": "/api/2014/races/gnome"
        },
        "desc": "I gnomi delle rocce sono i più resistenti e robusti dei gnomi. Sono nati con una forte affinità per la roccia e per la terra, e sono esperti nel lavorare la pietra e i metalli. La loro pelle è spesso di un colore grigio o marrone, simile alla roccia stessa.",
        "ability_bonuses": [
            { "ability_score": { "index": "con", "name": "COS", "url": "/api/2014/ability-scores/con" }, "bonus": 1 }
        ],
        // NOTA: Il bonus INT è ereditato dalla razza base (Gnomo)
        "ability_bonus_options": null, // Nessuna scelta di bonus extra
        "traits": [
            { "index": "tinker", "name": "Inventore", "url": "/api/2014/traits/tinker" }
            // NOTA: L'altro tratto (Scurovisione, Astuzia) è ereditato dalla razza base
        ],
        "starting_proficiencies": [], // Competenze ereditate dalla razza base
        "languages": [
            { "index": "common", "name": "Comune", "url": "/api/2014/languages/common" },
            { "index": "gnomish", "name": "Gnomesco", "url": "/api/2014/languages/gnomish" }
        ],
        "language_options": null // Nessuna scelta di lingua extra
    }
    // Aggiungi qui le altre sottorazze (es. Varianti di mezzorco, tiefling, ecc. se le hai)
];

// NOTA IMPORTANTE: Le sottorazze come il Mezzelfo e il Mezzorco non sono qui perché
// sono state storicamente trattate come razze a pieno titolo in alcune edizioni di D&D,
// ma nella SRD 5.1 sono sottorazze di Elfo e Orco. La tua struttura attuale le gestisce correttamente.
// Se in futuro dovessi aggiungere varianti, questo è il posto giusto.