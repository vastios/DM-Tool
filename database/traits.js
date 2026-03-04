export const traitsDatabase = [
  {
    "index": "artificers-lore",
    "races": [],
    "subraces": [
      {
        "index": "rock-gnome",
        "name": "Gnomo delle Rocce",
        "url": "/api/2014/subraces/rock-gnome"
      }
    ],
    "name": "Conoscenze dell'Artefice",
    "desc": [
      "Ogni volta che effettui una prova di Intelligenza (Storia) relativa a oggetti magici, oggetti alchemici o congegni tecnologici, puoi aggiungere il doppio del tuo bonus di competenza, invece di qualsiasi bonus di competenza che applicheresti normalmente."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/artificers-lore",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "brave",
    "races": [
      {
        "index": "halfling",
        "name": "Halfling",
        "url": "/api/2014/races/halfling"
      }
    ],
    "subraces": [],
    "name": "Coraggioso",
    "desc": [
      "Hai vantaggio ai tiri salvezza per non essere spaventato."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/brave",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "breath-weapon",
    "races": [
      {
        "index": "dragonborn",
        "name": "Dragonide",
        "url": "/api/2014/races/dragonborn"
      }
    ],
    "subraces": [],
    "name": "Arma a Soffio",
    "desc": [
      "Puoi usare la tua azione per esalare energia distruttiva. La tua Discendenza draconica determina la dimensione, la forma e il tipo di danno dell'esalazione.",
      "Quando usi la tua arma a soffio, ogni creatura nell'area dell'esalazione deve effettuare un tiro salvezza, il cui tipo è determinato dalla tua Discendenza draconica. La CD per questo tiro salvezza è pari a 8 + il tuo modificatore di Costituzione + il tuo bonus di competenza. Una creatura subisce 2d6 danni se fallisce il tiro salvezza, e la metà se lo supera. Il danno aumenta a 3d6 al 6° livello, 4d6 all'11° livello e 5d6 al 16° livello.",
      "Dopo aver usato la tua arma a soffio, non puoi usarla di nuovo finché non completi un riposo breve o lungo."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/breath-weapon",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "damage-resistance",
    "races": [
      {
        "index": "dragonborn",
        "name": "Dragonide",
        "url": "/api/2014/races/dragonborn"
      }
    ],
    "subraces": [],
    "name": "Resistenza ai Danni",
    "desc": [
      "Hai resistenza al tipo di danno associato alla tua Discendenza draconica."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/damage-resistance",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "darkvision",
    "races": [
      { "index": "dwarf", "name": "Nano", "url": "/api/2014/races/dwarf" },
      { "index": "elf", "name": "Elfo", "url": "/api/2014/races/elf" },
      { "index": "gnome", "name": "Gnomo", "url": "/api/2014/races/gnome" },
      { "index": "half-elf", "name": "Mezzelfo", "url": "/api/2014/races/half-elf" },
      { "index": "half-orc", "name": "Mezzorco", "url": "/api/2014/races/half-orc" },
      { "index": "tiefling", "name": "Tiefling", "url": "/api/2014/races/tiefling" }
    ],
    "subraces": [],
    "name": "Scurovisione",
    "desc": [
      "Hai una vista superiore in condizioni di oscurità e luce fioca. Puoi vedere in condizioni di luce fiaca entro 18 metri da te come se fosse luce intensa, e nell'oscurità come se fosse luce fioca. Non puoi distinguere i colori nell'oscurità, solo sfumature di grigio."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/darkvision",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "draconic-ancestry",
    "races": [
      {
        "index": "dragonborn",
        "name": "Dragonide",
        "url": "/api/2014/races/dragonborn"
      }
    ],
    "subraces": [],
    "name": "Discendenza Draconica",
    "desc": [
      "Possiedi un'Discendenza draconica. Scegli un tipo di drago dalla tabella Discendenza Draconica. La tua arma a soffio e la tua resistenza ai danni sono determinate dal tipo di drago, come mostrato nella tabella."
    ],
    "proficiencies": [],
    "trait_specific": {
      "subtrait_options": {
        "choose": 1,
        "from": {
          "option_set_type": "options_array",
          "options": [
            { "option_type": "reference", "item": { "index": "draconic-ancestry-black", "name": "Discendenza Draconica (Nero)", "url": "/api/2014/traits/draconic-ancestry-black" } },
            { "option_type": "reference", "item": { "index": "draconic-ancestry-blue", "name": "Discendenza Draconica (Blu)", "url": "/api/2014/traits/draconic-ancestry-blue" } },
            { "option_type": "reference", "item": { "index": "draconic-ancestry-brass", "name": "Discendenza Draconica (Ottone)", "url": "/api/2014/traits/draconic-ancestry-brass" } },
            { "option_type": "reference", "item": { "index": "draconic-ancestry-bronze", "name": "Discendenza Draconica (Bronzo)", "url": "/api/2014/traits/draconic-ancestry-bronze" } },
            { "option_type": "reference", "item": { "index": "draconic-ancestry-copper", "name": "Discendenza Draconica (Rame)", "url": "/api/2014/traits/draconic-ancestry-copper" } },
            { "option_type": "reference", "item": { "index": "draconic-ancestry-gold", "name": "Discendenza Draconica (Oro)", "url": "/api/2014/traits/draconic-ancestry-gold" } },
            { "option_type": "reference", "item": { "index": "draconic-ancestry-green", "name": "Discendenza Draconica (Verde)", "url": "/api/2014/traits/draconic-ancestry-green" } },
            { "option_type": "reference", "item": { "index": "draconic-ancestry-red", "name": "Discendenza Draconica (Rosso)", "url": "/api/2014/traits/draconic-ancestry-red" } },
            { "option_type": "reference", "item": { "index": "draconic-ancestry-silver", "name": "Discendenza Draconica (Argento)", "url": "/api/2014/traits/draconic-ancestry-silver" } },
            { "option_type": "reference", "item": { "index": "draconic-ancestry-white", "name": "Discendenza Draconica (Bianco)", "url": "/api/2014/traits/draconic-ancestry-white" } }
          ]
        },
        "type": "trait"
      }
    },
    "url": "/api/2014/traits/draconic-ancestry",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "draconic-ancestry-black",
    "races": [{ "index": "dragonborn", "name": "Dragonide", "url": "/api/2014/races/dragonborn" }],
    "subraces": [],
    "name": "Discendenza Draconica (Nero)",
    "desc": [
      "Possiedi un'Discendenza draconica. Scegli un tipo di drago dalla tabella Discendenza Draconica. La tua arma a soffio e la tua resistenza ai danni sono determinate dal tipo di drago, come mostrato nella tabella."
    ],
    "parent": { "index": "draconic-ancestry", "name": "Discendenza Draconica", "url": "/api/2014/traits/draconic-ancestry" },
    "proficiencies": [],
    "trait_specific": {
      "damage_type": { "index": "acid", "name": "Acido", "url": "/api/2014/damage-types/acid" },
      "breath_weapon": {
        "name": "Arma a Soffio",
        "desc": "Puoi usare la tua azione per esalare energia distruttiva. La tua Discendenza draconica determina la dimensione, la forma e il tipo di danno dell'esalazione. Quando usi la tua arma a soffio, ogni creatura nell'area dell'esalazione deve effettuare un tiro salvezza, il cui tipo è determinato dalla tua Discendenza draconica. La CD per questo tiro salvezza è pari a 8 + il tuo modificatore di Costituzione + il tuo bonus di competenza. Una creatura subisce 2d6 danni se fallisce il tiro salvezza, e la metà se lo supera. Il danno aumenta a 3d6 al 6° livello, 4d6 all'11° livello e 5d6 al 16° livello. Dopo aver usato la tua arma a soffio, non puoi usarla di nuovo finché non completi un riposo breve o lungo.",
        "area_of_effect": { "size": 9, "type": "line" },
        "usage": { "type": "per rest", "times": 1 },
        "dc": { "dc_type": { "index": "dex", "name": "DES", "url": "/api/2014/ability-scores/dex" }, "success_type": "half" },
        "damage": [
          {
            "damage_type": { "index": "acid", "name": "Acido", "url": "/api/2014/damage-types/acid" },
            "damage_at_character_level": { "1": "2d6", "6": "3d6", "11": "4d6", "16": "5d6" }
          }
        ]
      }
    },
    "url": "/api/2014/traits/draconic-ancestry-black",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "draconic-ancestry-blue",
    "races": [{ "index": "dragonborn", "name": "Dragonide", "url": "/api/2014/races/dragonborn" }],
    "subraces": [],
    "name": "Discendenza Draconica (Blu)",
    "desc": [
      "Possiedi un'Discendenza draconica. Scegli un tipo di drago dalla tabella Discendenza Draconica. La tua arma a soffio e la tua resistenza ai danni sono determinate dal tipo di drago, come mostrato nella tabella."
    ],
    "parent": { "index": "draconic-ancestry", "name": "Discendenza Draconica", "url": "/api/2014/traits/draconic-ancestry" },
    "proficiencies": [],
    "trait_specific": {
      "damage_type": { "index": "lightning", "name": "Fulmine", "url": "/api/2014/damage-types/lightning" },
      "breath_weapon": {
        "name": "Arma a Soffio",
        "desc": "Puoi usare la tua azione per esalare energia distruttiva. La tua Discendenza draconica determina la dimensione, la forma e il tipo di danno dell'esalazione. Quando usi la tua arma a soffio, ogni creatura nell'area dell'esalazione deve effettuare un tiro salvezza, il cui tipo è determinato dalla tua Discendenza draconica. La CD per questo tiro salvezza è pari a 8 + il tuo modificatore di Costituzione + il tuo bonus di competenza. Una creatura subisce 2d6 danni se fallisce il tiro salvezza, e la metà se lo supera. Il danno aumenta a 3d6 al 6° livello, 4d6 all'11° livello e 5d6 al 16° livello. Dopo aver usato la tua arma a soffio, non puoi usarla di nuovo finché non completi un riposo breve o lungo.",
        "area_of_effect": { "size": 9, "type": "line" },
        "usage": { "type": "per rest", "times": 1 },
        "dc": { "dc_type": { "index": "dex", "name": "DES", "url": "/api/2014/ability-scores/dex" }, "success_type": "half" },
        "damage": [
          {
            "damage_type": { "index": "lightning", "name": "Fulmine", "url": "/api/2014/damage-types/lightning" },
            "damage_at_character_level": { "1": "2d6", "6": "3d6", "11": "4d6", "16": "5d6" }
          }
        ]
      }
    },
    "url": "/api/2014/traits/draconic-ancestry-blue",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "draconic-ancestry-brass",
    "races": [{ "index": "dragonborn", "name": "Dragonide", "url": "/api/2014/races/dragonborn" }],
    "subraces": [],
    "name": "Discendenza Draconica (Ottone)",
    "desc": [
      "Possiedi un'Discendenza draconica. Scegli un tipo di drago dalla tabella Discendenza Draconica. La tua arma a soffio e la tua resistenza ai danni sono determinate dal tipo di drago, come mostrato nella tabella."
    ],
    "parent": { "index": "draconic-ancestry", "name": "Discendenza Draconica", "url": "/api/2014/traits/draconic-ancestry" },
    "proficiencies": [],
    "trait_specific": {
      "damage_type": { "index": "fire", "name": "Fuoco", "url": "/api/2014/damage-types/fire" },
      "breath_weapon": {
        "name": "Arma a Soffio",
        "desc": "Puoi usare la tua azione per esalare energia distruttiva. La tua Discendenza draconica determina la dimensione, la forma e il tipo di danno dell'esalazione. Quando usi la tua arma a soffio, ogni creatura nell'area dell'esalazione deve effettuare un tiro salvezza, il cui tipo è determinato dalla tua Discendenza draconica. La CD per questo tiro salvezza è pari a 8 + il tuo modificatore di Costituzione + il tuo bonus di competenza. Una creatura subisce 2d6 danni se fallisce il tiro salvezza, e la metà se lo supera. Il danno aumenta a 3d6 al 6° livello, 4d6 all'11° livello e 5d6 al 16° livello. Dopo aver usato la tua arma a soffio, non puoi usarla di nuovo finché non completi un riposo breve o lungo.",
        "area_of_effect": { "size": 9, "type": "line" },
        "usage": { "type": "per rest", "times": 1 },
        "dc": { "dc_type": { "index": "dex", "name": "DES", "url": "/api/2014/ability-scores/dex" }, "success_type": "half" },
        "damage": [
          {
            "damage_type": { "index": "fire", "name": "Fuoco", "url": "/api/2014/damage-types/fire" },
            "damage_at_character_level": { "1": "2d6", "6": "3d6", "11": "4d6", "16": "5d6" }
          }
        ]
      }
    },
    "url": "/api/2014/traits/draconic-ancestry-brass",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "draconic-ancestry-bronze",
    "races": [{ "index": "dragonborn", "name": "Dragonide", "url": "/api/2014/races/dragonborn" }],
    "subraces": [],
    "name": "Discendenza Draconica (Bronzo)",
    "desc": [
      "Possiedi un'Discendenza draconica. Scegli un tipo di drago dalla tabella Discendenza Draconica. La tua arma a soffio e la tua resistenza ai danni sono determinate dal tipo di drago, come mostrato nella tabella."
    ],
    "parent": { "index": "draconic-ancestry", "name": "Discendenza Draconica", "url": "/api/2014/traits/draconic-ancestry" },
    "proficiencies": [],
    "trait_specific": {
      "damage_type": { "index": "lightning", "name": "Fulmine", "url": "/api/2014/damage-types/lightning" },
      "breath_weapon": {
        "name": "Arma a Soffio",
        "desc": "Puoi usare la tua azione per esalare energia distruttiva. La tua Discendenza draconica determina la dimensione, la forma e il tipo di danno dell'esalazione. Quando usi la tua arma a soffio, ogni creatura nell'area dell'esalazione deve effettuare un tiro salvezza, il cui tipo è determinato dalla tua Discendenza draconica. La CD per questo tiro salvezza è pari a 8 + il tuo modificatore di Costituzione + il tuo bonus di competenza. Una creatura subisce 2d6 danni se fallisce il tiro salvezza, e la metà se lo supera. Il danno aumenta a 3d6 al 6° livello, 4d6 all'11° livello e 5d6 al 16° livello. Dopo aver usato la tua arma a soffio, non puoi usarla di nuovo finché non completi un riposo breve o lungo.",
        "area_of_effect": { "size": 9, "type": "line" },
        "usage": { "type": "per rest", "times": 1 },
        "dc": { "dc_type": { "index": "dex", "name": "DES", "url": "/api/2014/ability-scores/dex" }, "success_type": "half" },
        "damage": [
          {
            "damage_type": { "index": "lightning", "name": "Fulmine", "url": "/api/2014/damage-types/lightning" },
            "damage_at_character_level": { "1": "2d6", "6": "3d6", "11": "4d6", "16": "5d6" }
          }
        ]
      }
    },
    "url": "/api/2014/traits/draconic-ancestry-bronze",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "draconic-ancestry-copper",
    "races": [
      {
        "index": "dragonborn",
        "name": "Dragonide",
        "url": "/api/2014/races/dragonborn"
      }
    ],
    "subraces": [],
    "name": "Discendenza Draconica (Rame)",
    "desc": [
      "Possiedi un'Discendenza draconica. Scegli un tipo di drago dalla tabella Discendenza Draconica. La tua arma a soffio e la tua resistenza ai danni sono determinate dal tipo di drago, come mostrato nella tabella."
    ],
    "parent": {
      "index": "draconic-ancestry",
      "name": "Discendenza Draconica",
      "url": "/api/2014/traits/draconic-ancestry"
    },
    "proficiencies": [],
    "trait_specific": {
      "damage_type": {
        "index": "acid",
        "name": "Acido",
        "url": "/api/2014/damage-types/acid"
      },
      "breath_weapon": {
        "name": "Arma a Soffio",
        "desc": "Puoi usare la tua azione per esalare energia distruttiva. La tua Discendenza draconica determina la dimensione, la forma e il tipo di danno dell'esalazione. Quando usi la tua arma a soffio, ogni creatura nell'area dell'esalazione deve effettuare un tiro salvezza, il cui tipo è determinato dalla tua Discendenza draconica. La CD per questo tiro salvezza è pari a 8 + il tuo modificatore di Costituzione + il tuo bonus di competenza. Una creatura subisce 2d6 danni se fallisce il tiro salvezza, e la metà se lo supera. Il danno aumenta a 3d6 al 6° livello, 4d6 all'11° livello e 5d6 al 16° livello. Dopo aver usato la tua arma a soffio, non puoi usarla di nuovo finché non completi un riposo breve o lungo.",
        "area_of_effect": {
          "size": 9,
          "type": "line"
        },
        "usage": {
          "type": "per rest",
          "times": 1
        },
        "dc": {
          "dc_type": {
            "index": "dex",
            "name": "DES",
            "url": "/api/2014/ability-scores/dex"
          },
          "success_type": "half"
        },
        "damage": [
          {
            "damage_type": {
              "index": "acid",
              "name": "Acido",
              "url": "/api/2014/damage-types/acid"
            },
            "damage_at_character_level": {
              "1": "2d6",
              "6": "3d6",
              "11": "4d6",
              "16": "5d6"
            }
          }
        ]
      }
    },
    "url": "/api/2014/traits/draconic-ancestry-copper",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "draconic-ancestry-gold",
    "races": [
      {
        "index": "dragonborn",
        "name": "Dragonide",
        "url": "/api/2014/races/dragonborn"
      }
    ],
    "subraces": [],
    "name": "Discendenza Draconica (Oro)",
    "desc": [
      "Possiedi un'Discendenza draconica. Scegli un tipo di drago dalla tabella Discendenza Draconica. La tua arma a soffio e la tua resistenza ai danni sono determinate dal tipo di drago, come mostrato nella tabella."
    ],
    "parent": {
      "index": "draconic-ancestry",
      "name": "Discendenza Draconica",
      "url": "/api/2014/traits/draconic-ancestry"
    },
    "proficiencies": [],
    "trait_specific": {
      "damage_type": {
        "index": "fire",
        "name": "Fuoco",
        "url": "/api/2014/damage-types/fire"
      },
      "breath_weapon": {
        "name": "Arma a Soffio",
        "desc": "Puoi usare la tua azione per esalare energia distruttiva. La tua Discendenza draconica determina la dimensione, la forma e il tipo di danno dell'esalazione. Quando usi la tua arma a soffio, ogni creatura nell'area dell'esalazione deve effettuare un tiro salvezza, il cui tipo è determinato dalla tua Discendenza draconica. La CD per questo tiro salvezza è pari a 8 + il tuo modificatore di Costituzione + il tuo bonus di competenza. Una creatura subisce 2d6 danni se fallisce il tiro salvezza, e la metà se lo supera. Il danno aumenta a 3d6 al 6° livello, 4d6 all'11° livello e 5d6 al 16° livello. Dopo aver usato la tua arma a soffio, non puoi usarla di nuovo finché non completi un riposo breve o lungo.",
        "area_of_effect": {
          "size": 4.5,
          "type": "cone"
        },
        "usage": {
          "type": "per rest",
          "times": 1
        },
        "dc": {
          "dc_type": {
            "index": "dex",
            "name": "DES",
            "url": "/api/2014/ability-scores/dex"
          },
          "success_type": "half"
        },
        "damage": [
          {
            "damage_type": {
              "index": "fire",
              "name": "Fuoco",
              "url": "/api/2014/damage-types/fire"
            },
            "damage_at_character_level": {
              "1": "2d6",
              "6": "3d6",
              "11": "4d6",
              "16": "5d6"
            }
          }
        ]
      }
    },
    "url": "/api/2014/traits/draconic-ancestry-gold",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "draconic-ancestry-green",
    "races": [
      {
        "index": "dragonborn",
        "name": "Dragonide",
        "url": "/api/2014/races/dragonborn"
      }
    ],
    "subraces": [],
    "name": "Discendenza Draconica (Verde)",
    "desc": [
      "Possiedi un'Discendenza draconica. Scegli un tipo di drago dalla tabella Discendenza Draconica. La tua arma a soffio e la tua resistenza ai danni sono determinate dal tipo di drago, come mostrato nella tabella."
    ],
    "parent": {
      "index": "draconic-ancestry",
      "name": "Discendenza Draconica",
      "url": "/api/2014/traits/draconic-ancestry"
    },
    "proficiencies": [],
    "trait_specific": {
      "damage_type": {
        "index": "poison",
        "name": "Veleno",
        "url": "/api/2014/damage-types/poison"
      },
      "breath_weapon": {
        "name": "Arma a Soffio",
        "desc": "Puoi usare la tua azione per esalare energia distruttiva. La tua Discendenza draconica determina la dimensione, la forma e il tipo di danno dell'esalazione. Quando usi la tua arma a soffio, ogni creatura nell'area dell'esalazione deve effettuare un tiro salvezza, il cui tipo è determinato dalla tua Discendenza draconica. La CD per questo tiro salvezza è pari a 8 + il tuo modificatore di Costituzione + il tuo bonus di competenza. Una creatura subisce 2d6 danni se fallisce il tiro salvezza, e la metà se lo supera. Il danno aumenta a 3d6 al 6° livello, 4d6 all'11° livello e 5d6 al 16° livello. Dopo aver usato la tua arma a soffio, non puoi usarla di nuovo finché non completi un riposo breve o lungo.",
        "area_of_effect": {
          "size": 4.5,
          "type": "cone"
        },
        "usage": {
          "type": "per rest",
          "times": 1
        },
        "dc": {
          "dc_type": {
            "index": "con",
            "name": "COS",
            "url": "/api/2014/ability-scores/con"
          },
          "success_type": "half"
        },
        "damage": [
          {
            "damage_type": {
              "index": "poison",
              "name": "Veleno",
              "url": "/api/2014/damage-types/poison"
            },
            "damage_at_character_level": {
              "1": "2d6",
              "6": "3d6",
              "11": "4d6",
              "16": "5d6"
            }
          }
        ]
      }
    },
    "url": "/api/2014/traits/draconic-ancestry-green",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "draconic-ancestry-red",
    "races": [
      {
        "index": "dragonborn",
        "name": "Dragonide",
        "url": "/api/2014/races/dragonborn"
      }
    ],
    "subraces": [],
    "name": "Discendenza Draconica (Rosso)",
    "desc": [
      "Possiedi un'Discendenza draconica. Scegli un tipo di drago dalla tabella Discendenza Draconica. La tua arma a soffio e la tua resistenza ai danni sono determinate dal tipo di drago, come mostrato nella tabella."
    ],
    "parent": {
      "index": "draconic-ancestry",
      "name": "Discendenza Draconica",
      "url": "/api/2014/traits/dracestry"
    },
    "proficiencies": [],
    "trait_specific": {
      "damage_type": {
        "index": "fire",
        "name": "Fuoco",
        "url": "/api/2014/damage-types/fire"
      },
      "breath_weapon": {
        "name": "Arma a Soffio",
        "desc": "Puoi usare la tua azione per esalare energia distruttiva. La tua Discendenza draconica determina la dimensione, la forma e il tipo di danno dell'esalazione. Quando usi la tua arma a soffio, ogni creatura nell'area dell'esalazione deve effettuare un tiro salvezza, il cui tipo è determinato dalla tua Discendenza draconica. La CD per questo tiro salvezza è pari a 8 + il tuo modificatore di Costituzione + il tuo bonus di competenza. Una creatura subisce 2d6 danni se fallisce il tiro salvezza, e la metà se lo supera. Il danno aumenta a 3d6 al 6° livello, 4d6 all'11° livello e 5d6 al 16° livello. Dopo aver usato la tua arma a soffio, non puoi usarla di nuovo finché non completi un riposo breve o lungo.",
        "area_of_effect": {
          "size": 4.5,
          "type": "cone"
        },
        "usage": {
          "type": "per rest",
          "times": 1
        },
        "dc": {
          "dc_type": {
            "index": "dex",
            "name": "DES",
            "url": "/api/2014/ability-scores/dex"
          },
          "success_type": "half"
        },
        "damage": [
          {
            "damage_type": {
              "index": "fire",
              "name": "Fuoco",
              "url": "/api/2014/damage-types/fire"
            },
            "damage_at_character_level": {
              "1": "2d6",
              "6": "3d6",
              "11": "4d6",
              "16": "5d6"
            }
          }
        ]
      }
    },
    "url": "/api/2014/traits/draconic-ancestry-red",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "draconic-ancestry-silver",
    "races": [
      {
        "index": "dragonborn",
        "name": "Dragonide",
        "url": "/api/2014/races/dragonborn"
      }
    ],
    "subraces": [],
    "name": "Discendenza Draconica (Argento)",
    "desc": [
      "Possiedi un'Discendenza draconica. Scegli un tipo di drago dalla tabella Discendenza Draconica. La tua arma a soffio e la tua resistenza ai danni sono determinate dal tipo di drago, come mostrato nella tabella."
    ],
    "parent": {
      "index": "draconic-ancestry",
      "name": "Discendenza Draconica",
      "url": "/api/2014/traits/draconic-ancestry"
    },
    "proficiencies": [],
    "trait_specific": {
      "damage_type": {
        "index": "cold",
        "name": "Freddo",
        "url": "/api/2014/damage-types/cold"
      },
      "breath_weapon": {
        "name": "Arma a Soffio",
        "desc": "Puoi usare la tua azione per esalare energia distruttiva. La tua Discendenza draconica determina la dimensione, la forma e il tipo di danno dell'esalazione. Quando usi la tua arma a soffio, ogni creatura nell'area dell'esalazione deve effettuare un tiro salvezza, il cui tipo è determinato dalla tua Discendenza draconica. La CD per questo tiro salvezza è pari a 8 + il tuo modificatore di Costituzione + il tuo bonus di competenza. Una creatura subisce 2d6 danni se fallisce il tiro salvezza, e la metà se lo supera. Il danno aumenta a 3d6 al 6° livello, 4d6 all'11° livello e 5d6 al 16° livello. Dopo aver usato la tua arma a soffio, non puoi usarla di nuovo finché non completi un riposo breve o lungo.",
        "area_of_effect": {
          "size": 4.5,
          "type": "cone"
        },
        "usage": {
          "type": "per rest",
          "times": 1
        },
        "dc": {
          "dc_type": {
            "index": "con",
            "name": "COS",
            "url": "/api/2014/ability-scores/con"
          },
          "success_type": "half"
        },
        "damage": [
          {
            "damage_type": {
              "index": "cold",
              "name": "Freddo",
              "url": "/api/2014/damage-types/cold"
            },
            "damage_at_character_level": {
              "1": "2d6",
              "6": "3d6",
              "11": "4d6",
              "16": "5d6"
            }
          }
        ]
      }
    },
    "url": "/api/2014/traits/draconic-ancestry-silver",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "draconic-ancestry-white",
    "races": [
      {
        "index": "dragonborn",
        "name": "Dragonide",
        "url": "/api/2014/races/dragonborn"
      }
    ],
    "subraces": [],
    "name": "Discendenza Draconica (Bianco)",
    "desc": [
      "Possiedi un'Discendenza draconica. Scegli un tipo di drago dalla tabella Discendenza Draconica. La tua arma a soffio e la tua resistenza ai danni sono determinate dal tipo di drago, come mostrato nella tabella."
    ],
    "parent": {
      "index": "draconic-ancestry",
      "name": "Discendenza Draconica",
      "url": "/api/2014/traits/draconic-ancestry"
    },
    "proficiencies": [],
    "trait_specific": {
      "damage_type": {
        "index": "cold",
        "name": "Freddo",
        "url": "/api/2014/damage-types/cold"
      },
      "breath_weapon": {
        "name": "Arma a Soffio",
        "desc": "Puoi usare la tua azione per esalare energia distruttiva. La tua Discendenza draconica determina la dimensione, la forma e il tipo di danno dell'esalazione. Quando usi la tua arma a soffio, ogni creatura nell'area dell'esalazione deve effettuare un tiro salvezza, il cui tipo è determinato dalla tua Discendenza draconica. La CD per questo tiro salvezza è pari a 8 + il tuo modificatore di Costituzione + il tuo bonus di competenza. Una creatura subisce 2d6 danni se fallisce il tiro salvezza, e la metà se lo supera. Il danno aumenta a 3d6 al 6° livello, 4d6 all'11° livello e 5d6 al 16° livello. Dopo aver usato la tua arma a soffio, non puoi usarla di nuovo finché non completi un riposo breve o lungo.",
        "area_of_effect": {
          "size": 4.5,
          "type": "cone"
        },
        "usage": {
          "type": "per rest",
          "times": 1
        },
        "dc": {
          "dc_type": {
            "index": "con",
            "name": "COS",
            "url": "/api/2014/ability-scores/con"
          },
          "success_type": "half"
        },
        "damage": [
          {
            "damage_type": {
              "index": "cold",
              "name": "Freddo",
              "url": "/api/2014/damage-types/cold"
            },
            "damage_at_character_level": {
              "1": "2d6",
              "6": "3d6",
              "11": "4d6",
              "16": "5d6"
            }
          }
        ]
      }
    },
    "url": "/api/2014/traits/draconic-ancestry-white",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "dwarven-combat-training",
    "races": [
      {
        "index": "dwarf",
        "name": "Nano",
        "url": "/api/2014/races/dwarf"
      }
    ],
    "subraces": [],
    "name": "Addestramento al Combattimento Nanico",
    "desc": [
      "Hai competenza nell'uso dell'ascia da battaglia, dell'ascia a mano, del martello leggero e del martello da guerra."
    ],
    "proficiencies": [
      {
        "index": "battleaxes",
        "name": "Asce da battaglia",
        "url": "/api/2014/proficiencies/battleaxes"
      },
      {
        "index": "handaxes",
        "name": "Asce a mano",
        "url": "/api/2014/proficiencies/handaxes"
      },
      {
        "index": "light-hammers",
        "name": "Martelli leggeri",
        "url": "/api/2014/proficiencies/light-hammers"
      },
      {
        "index": "warhammers",
        "name": "Martelli da guerra",
        "url": "/api/2014/proficiencies/warhammers"
      }
    ],
    "url": "/api/2014/traits/dwarven-combat-training",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "dwarven-resilience",
    "races": [
      {
        "index": "dwarf",
        "name": "Nano",
        "url": "/api/2014/races/dwarf"
      }
    ],
    "subraces": [],
    "name": "Resilienza Nanica",
    "desc": [
      "Hai vantaggio ai tiri salvezza contro il veleno e resistenza ai danni da veleno."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/dwarven-resilience",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "dwarven-toughness",
    "races": [],
    "subraces": [
      {
        "index": "hill-dwarf",
        "name": "Nano delle Colline",
        "url": "/api/2014/subraces/hill-dwarf"
      }
    ],
    "name": "Robustezza Nanica",
    "desc": [
      "Il tuo massimo dei punti ferita aumenta di 1 e aumenta di 1 ogni volta che guadagni un livello."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/dwarven-toughness",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "elf-weapon-training",
    "races": [],
    "subraces": [
      {
        "index": "high-elf",
        "name": "Elfo Alto",
        "url": "/api/2014/subraces/high-elf"
      }
    ],
    "name": "Addestramento nelle Armi Elfiche",
    "desc": [
      "Hai competenza nell'uso della spada lunga, della spada corta, dell'arco corto e dell'arco lungo."
    ],
    "proficiencies": [
      {
        "index": "longswords",
        "name": "Spade lunghe",
        "url": "/api/2014/proficiencies/longswords"
      },
      {
        "index": "shortswords",
        "name": "Spade corte",
        "url": "/api/2014/proficiencies/shortswords"
      },
      {
        "index": "shortbows",
        "name": "Archi corti",
        "url": "/api/2014/proficiencies/shortbows"
      },
      {
        "index": "longbows",
        "name": "Archi lunghi",
        "url": "/api/2014/proficiencies/longbows"
      }
    ],
    "url": "/api/2014/traits/elf-weapon-training",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "extra-language",
    "races": [],
    "subraces": [
      {
        "index": "high-elf",
        "name": "Elfo Alto",
        "url": "/api/2014/subraces/high-elf"
      }
    ],
    "name": "Linguaggio Extra",
    "desc": [
      "Puoi parlare, leggere e scrivere un linguaggio extra a tua scelta."
    ],
    "proficiencies": [],
    "language_options": {
      "choose": 1,
      "type": "languages",
      "from": {
        "option_set_type": "options_array",
        "options": [
          {
            "option_type": "reference",
            "item": {
              "index": "dwarvish",
              "name": "Nanico",
              "url": "/api/2014/languages/dwarvish"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "giant",
              "name": "Gigante",
              "url": "/api/2014/languages/giant"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "gnomish",
              "name": "Gnomesco",
              "url": "/api/2014/languages/gnomish"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "goblin",
              "name": "Goblin",
              "url": "/api/2014/languages/goblin"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "halfling",
              "name": "Halfling",
              "url": "/api/2014/languages/halfling"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "orc",
              "name": "Orchesco",
              "url": "/api/2014/languages/orc"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "abyssal",
              "name": "Abissale",
              "url": "/api/2014/languages/abyssal"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "celestial",
              "name": "Celestiale",
              "url": "/api/2014/languages/celestial"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "draconic",
              "name": "Draconico",
              "url": "/api/2014/languages/draconic"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "deep-speech",
              "name": "Gergo delle Profondità",
              "url": "/api/2014/languages/deep-speech"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "infernal",
              "name": "Infernale",
              "url": "/api/2014/languages/infernal"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "primordial",
              "name": "Primordiale",
              "url": "/api/2014/languages/primordial"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "sylvan",
              "name": "Silvano",
              "url": "/api/2014/languages/sylvan"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "undercommon",
              "name": "Comune del Buio",
              "url": "/api/2014/languages/undercommon"
            }
          }
        ]
      }
    },
    "url": "/api/2014/traits/extra-language",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "fey-ancestry",
    "races": [
      {
        "index": "elf",
        "name": "Elfo",
        "url": "/api/2014/races/elf"
      },
      {
        "index": "half-elf",
        "name": "Mezzelfo",
        "url": "/api/2014/races/half-elf"
      }
    ],
    "subraces": [],
    "name": "Discendenza Fatata",
    "desc": [
      "Hai vantaggio ai tiri salvezza per non essere affascinato e la magia non può addormentarti."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/fey-ancestry",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "gnome-cunning",
    "races": [
      {
        "index": "gnome",
        "name": "Gnomo",
        "url": "/api/2014/races/gnome"
      }
    ],
    "subraces": [],
    "name": "Astuzia Gnomesca",
    "desc": [
      "Hai vantaggio a tutti i tiri salvezza di Intelligenza, Saggezza e Carisma contro la magia."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/gnome-cunning",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "halfling-nimbleness",
    "races": [
      {
        "index": "halfling",
        "name": "Halfling",
        "url": "/api/2014/races/halfling"
      }
    ],
    "subraces": [],
    "name": "Agilità Halfling",
    "desc": [
      "Puoi muoverti attraverso lo spazio di qualsiasi creatura che sia di una taglia superiore alla tua."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/halfling-nimbleness",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "hellish-resistance",
    "races": [
      {
        "index": "tiefling",
        "name": "Tiefling",
        "url": "/api/2014/races/tiefling"
      }
    ],
    "subraces": [],
    "name": "Resistenza Infernale",
    "desc": [
      "Hai resistenza ai danni da fuoco."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/hellish-resistance",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "high-elf-cantrip",
    "races": [],
    "subraces": [
      {
        "index": "high-elf",
        "name": "Elfo Alto",
        "url": "/api/2014/subraces/high-elf"
      }
    ],
    "name": "Trucchetto dell'Elfo Alto",
    "desc": [
      "Conosci un trucchetto a tua scelta dalla lista degli incantesimi da mago. L'Intelligenza è la tua caratteristica da incantatore per questo trucchetto."
    ],
    "proficiencies": [],
    "trait_specific": {
      "spell_options": {
        "choose": 1,
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "reference",
              "item": {
                "index": "light",
                "name": "Luce",
                "url": "/api/2014/spells/light"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "mage-hand",
                "name": "Mano Magica",
                "url": "/api/2014/spells/mage-hand"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "mending",
                "name": "Riparare",
                "url": "/api/2014/spells/mending"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "message",
                "name": "Messaggio",
                "url": "/api/2014/spells/message"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "minor-illusion",
                "name": "Illusione Minore",
                "url": "/api/2014/spells/minor-illusion"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "acid-splash",
                "name": "Spruzzo Acido",
                "url": "/api/2014/spells/acid-splash"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "prestidigitation",
                "name": "Prestidigitazione",
                "url": "/api/2014/spells/prestidigitation"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "ray-of-frost",
                "name": "Raggio di Gelo",
                "url": "/api/2014/spells/ray-of-frost"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "shocking-grasp",
                "name": "Stretta Folgorante",
                "url": "/api/2014/spells/shocking-grasp"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "true-strike",
                "name": "Colpo Accurato",
                "url": "/api/2014/spells/true-strike"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "chill-touch",
                "name": "Tocco Gelido",
                "url": "/api/2014/spells/chill-touch"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "dancing-lights",
                "name": "Luci Danzanti",
                "url": "/api/2014/spells/dancing-lights"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "fire-bolt",
                "name": "Dardo di Fuoco",
                "url": "/api/2014/spells/fire-bolt"
              }
            },
            {
              "option_type": "reference",
              "item": {
                "index": "poison-spray",
                "name": "Spruzzo Velenoso",
                "url": "/api/2014/spells/poison-spray"
              }
            }
          ]
        },
        "type": "spell"
      }
    },
    "url": "/api/2014/traits/high-elf-cantrip",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "infernal-legacy",
    "races": [
      {
        "index": "tiefling",
        "name": "Tiefling",
        "url": "/api/2014/races/tiefling"
      }
    ],
    "subraces": [],
    "name": "Eredità Infernale",
    "desc": [
      "Conosci il trucchetto taumaturgia. Quando raggiungi il 3° livello, puoi lanciare l'incantesimo intimorire infernale come incantesimo di 2° livello una volta con questo tratto e recuperare la capacità di farlo quando completi un riposo lungo. Quando raggiungi il 5° livello, puoi lanciare l'incantesimo oscurità una volta con questo tratto e recuperare la capacità di farlo quando completi un riposo lungo. Il Carisma è la tua caratteristica da incantatore per questi incantesimi."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/infernal-legacy",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "keen-senses",
    "races": [
      {
        "index": "elf",
        "name": "Elfo",
        "url": "/api/2014/races/elf"
      }
    ],
    "subraces": [],
    "name": "Sensi Acuti",
    "desc": [
      "Hai competenza nell'abilità Percezione."
    ],
    "proficiencies": [
      {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    ],
    "url": "/api/2014/traits/keen-senses",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "lucky",
    "races": [
      {
        "index": "halfling",
        "name": "Halfling",
        "url": "/api/2014/races/halfling"
      }
    ],
    "subraces": [],
    "name": "Fortunato",
    "desc": [
      "Quando ottieni un 1 al d20 per un tiro per colpire, una prova di caratteristica o un tiro salvezza, puoi ripetere il dado e devi utilizzare il nuovo risultato."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/lucky",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "menacing",
    "races": [
      {
        "index": "half-orc",
        "name": "Mezzorco",
        "url": "/api/2014/races/half-orc"
      }
    ],
    "subraces": [],
    "name": "Minaccioso",
    "desc": [
      "Ottieni competenza nell'abilità Intimidire."
    ],
    "proficiencies": [
      {
        "index": "skill-intimidation",
        "name": "Abilità: Intimidire",
        "url": "/api/2014/proficiencies/skill-intimidation"
      }
    ],
    "url": "/api/2014/traits/menacing",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "naturally-stealthy",
    "races": [],
    "subraces": [
      {
        "index": "lightfoot-halfling",
        "name": "Halfling Piedelesto",
        "url": "/api/2014/subraces/lightfoot-halfling"
      }
    ],
    "name": "Furtività Naturale",
    "desc": [
      "Puoi tentare di nasconderti anche quando sei oscurato solo da una creatura che sia di almeno una taglia più grande di te."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/naturally-stealthy",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "relentless-endurance",
    "races": [
      {
        "index": "half-orc",
        "name": "Mezzorco",
        "url": "/api/2014/races/half-orc"
      }
    ],
    "subraces": [],
    "name": "Tenacia Inesausta",
    "desc": [
      "Quando scendi a 0 punti ferita ma non vieni ucciso sul colpo, puoi invece scendere a 1 punto ferita. Non puoi utilizzare di nuovo questa capacità finché non completi un riposo lungo."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/relentless-endurance",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "savage-attacks",
    "races": [
      {
        "index": "half-orc",
        "name": "Mezzorco",
        "url": "/api/2014/races/half-orc"
      }
    ],
    "subraces": [],
    "name": "Attacchi Selvaggi",
    "desc": [
      "Quando metti a segno un colpo critico con un attacco con arma da mischia, puoi tirare uno dei dadi del danno dell'arma una volta addizionale e aggiungerlo al danno extra del colpo critico."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/savage-attacks",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "skill-versatility",
    "races": [
      {
        "index": "half-elf",
        "name": "Mezzelfo",
        "url": "/api/2014/races/half-elf"
      }
    ],
    "subraces": [],
    "name": "Versatilità nelle Abilità",
    "desc": [
      "Ottieni competenza in due abilità a tua scelta."
    ],
    "proficiencies": [],
    "proficiency_choices": {
      "choose": 2,
      "type": "proficiencies",
      "from": {
        "option_set_type": "options_array",
        "options": [
          {
            "option_type": "reference",
            "item": {
              "index": "skill-acrobatics",
              "name": "Abilità: Acrobazia",
              "url": "/api/2014/proficiencies/skill-acrobatics"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-animal-handling",
              "name": "Abilità: Addestrare Animali",
              "url": "/api/2014/proficiencies/skill-animal-handling"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-arcana",
              "name": "Abilità: Arcano",
              "url": "/api/2014/proficiencies/skill-arcana"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-athletics",
              "name": "Abilità: Atletica",
              "url": "/api/2014/proficiencies/skill-athletics"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-deception",
              "name": "Abilità: Inganno",
              "url": "/api/2014/proficiencies/skill-deception"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-history",
              "name": "Abilità: Storia",
              "url": "/api/2014/proficiencies/skill-history"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-insight",
              "name": "Abilità: Intuizione",
              "url": "/api/2014/proficiencies/skill-insight"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-intimidation",
              "name": "Abilità: Intimidire",
              "url": "/api/2014/proficiencies/skill-intimidation"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-investigation",
              "name": "Abilità: Indagare",
              "url": "/api/2014/proficiencies/skill-investigation"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-medicine",
              "name": "Abilità: Medicina",
              "url": "/api/2014/proficiencies/skill-medicine"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-nature",
              "name": "Abilità: Natura",
              "url": "/api/2014/proficiencies/skill-nature"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-perception",
              "name": "Abilità: Percezione",
              "url": "/api/2014/proficiencies/skill-perception"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-performance",
              "name": "Abilità: Intrattenere",
              "url": "/api/2014/proficiencies/skill-performance"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-persuasion",
              "name": "Abilità: Persuasione",
              "url": "/api/2014/proficiencies/skill-persuasion"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-religion",
              "name": "Abilità: Religione",
              "url": "/api/2014/proficiencies/skill-religion"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-sleight-of-hand",
              "name": "Abilità: Rapidità di Mano",
              "url": "/api/2014/proficiencies/skill-sleight-of-hand"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-stealth",
              "name": "Abilità: Furtività",
              "url": "/api/2014/proficiencies/skill-stealth"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "skill-survival",
              "name": "Abilità: Sopravvivenza",
              "url": "/api/2014/proficiencies/skill-survival"
            }
          }
        ]
      }
    },
    "url": "/api/2014/traits/skill-versatility",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "stonecunning",
    "races": [
      {
        "index": "dwarf",
        "name": "Nano",
        "url": "/api/2014/races/dwarf"
      }
    ],
    "subraces": [],
    "name": "Conoscenza della Pietra",
    "desc": [
      "Ogni volta che effettui una prova di Intelligenza (Storia) relativa all'origine di un lavoro in pietra, sei considerato competente nell'abilità Storia e aggiungi il doppio del tuo bonus di competenza alla prova, invece del tuo normale bonus di competenza."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/stonecunning",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "tinker",
    "races": [],
    "subraces": [
      {
        "index": "rock-gnome",
        "name": "Gnomo delle Rocce",
        "url": "/api/2014/subraces/rock-gnome"
      }
    ],
    "name": "Inventore",
    "desc": [
      "Hai competenza con gli strumenti da artigiano (strumenti da inventore). Usando tali strumenti, puoi impiegare 1 ora e 10 mo di materiali per costruire un congegno a orologeria Minuscolo (CA 5, 1 PF). Il congegno smette di funzionare dopo 24 ore (a meno che tu non spenda 1 ora a ripararlo per mantenerlo in funzione), o quando usi la tua azione per smantellarlo; in quel momento, puoi recuperare i materiali usati per crearlo. Puoi avere fino a tre di questi congegni attivi contemporaneamente.",
      "Quando crei un congegno, scegli una delle seguenti opzioni:",
      "Giocattolo a Orologeria: Questo giocattolo è un animale, un mostro o una persona a orologeria, come una rana, un topo, un uccello, un drago o un soldatino. Quando viene posizionato a terra, il giocattolo si muove di 1,5 metri sul terreno in ognuno dei tuoi turni in una direzione casuale. Emette rumori appropriati alla creatura che rappresenta.",
      "Accendifuoco: Il congegno produce una fiammella miniaturizzata, che puoi usare per accendere una candela, una torcia o un falò. L'uso del congegno richiede la tua azione.",
      "Carillon: Quando viene aperto, questo carillon riproduce un singolo brano a volume moderata. Il carillon smette di suonare quando raggiunge la fine della canzone o quando viene chiuso."
    ],
    "proficiencies": [
      {
        "index": "tinkers-tools",
        "name": "Strumenti da Inventore",
        "url": "/api/2014/proficiencies/tinkers-tools"
      }
    ],
    "url": "/api/2014/traits/tinker",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "tool-proficiency",
    "races": [
      {
        "index": "dwarf",
        "name": "Nano",
        "url": "/api/2014/races/dwarf"
      }
    ],
    "subraces": [],
    "name": "Competenza negli Strumenti",
    "desc": [
      "Ottieni competenza in un set di strumenti da artigiano a tua scelta: strumenti da fabbro, scorte da mescitore o strumenti da muratore."
    ],
    "proficiencies": [],
    "proficiency_choices": {
      "choose": 1,
      "type": "proficiencies",
      "from": {
        "option_set_type": "options_array",
        "options": [
          {
            "option_type": "reference",
            "item": {
              "index": "smiths-tools",
              "name": "Strumenti da Fabbro",
              "url": "/api/2014/proficiencies/smiths-tools"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "brewers-supplies",
              "name": "Scorte da Mescitore",
              "url": "/api/2014/proficiencies/brewers-supplies"
            }
          },
          {
            "option_type": "reference",
            "item": {
              "index": "masons-tools",
              "name": "Strumenti da Muratore",
              "url": "/api/2014/proficiencies/masons-tools"
            }
          }
        ]
      }
    },
    "url": "/api/2014/traits/tool-proficiency",
    "updated_at": "2025-10-24T20:42:14.945Z"
  },
  {
    "index": "trance",
    "races": [
      {
        "index": "elf",
        "name": "Elfo",
        "url": "/api/2014/races/elf"
      }
    ],
    "subraces": [],
    "name": "Trance",
    "desc": [
      "Gli elfi non hanno bisogno di dormire. Invece, meditano profondamente, rimanendo semicoscienti, per 4 ore al giorno. (La parola Comune per tale meditazione è \"trance\"). Mentre mediti, puoi sognare in un certo senso; tali sogni sono in realtà esercizi mentali che sono diventati riflessivi attraverso anni di pratica. Dopo aver riposato in questo modo, ottieni lo stesso beneficio che un umano ottiene da 8 ore di sonno."
    ],
    "proficiencies": [],
    "url": "/api/2014/traits/trance",
    "updated_at": "2025-10-24T20:42:14.945Z"
  }
];