// database\races.js

export const raceDatabase = [
  {
    "index": "dragonborn",
    "name": "Dragonide",
    "speed": 9,
    "ability_bonuses": [
      {
        "ability_score": {
          "index": "str",
          "name": "FOR",
          "url": "/api/2014/ability-scores/str"
        },
        "bonus": 2
      },
      {
        "ability_score": {
          "index": "cha",
          "name": "CAR",
          "url": "/api/2014/ability-scores/cha"
        },
        "bonus": 1
      }
    ],
    "alignment": "I dragonidi tendono agli estremi, compiendo una scelta consapevole per uno dei due schieramenti nella guerra cosmica tra bene e male. La maggior parte dei dragonidi è buona, ma quelli che scelgono il male possono diventare perfidi malvagi.",
    "age": "I giovani dragonidi crescono rapidamente. Camminano poche ore dopo la schiusa, raggiungono le dimensioni e lo sviluppo di un bambino umano di 10 anni all'età di 3 anni, e diventano adulti a 15. Vivono circa 80 anni.",
    "size": "Media",
    "size_description": "I dragonidi sono più alti e pesanti degli umani, superando abbondantemente i 180 cm di altezza e pesando in media quasi 115 kg. La tua taglia è Media.",
    "languages": [
      {
        "index": "common",
        "name": "Comune",
        "url": "/api/2014/languages/common"
      },
      {
        "index": "draconic",
        "name": "Draconico",
        "url": "/api/2014/languages/draconic"
      }
    ],
    "language_desc": "Puoi parlare, leggere e scrivere in Comune e Draconico. Si pensa che il Draconico sia una delle lingue più antiche ed è spesso usato nello studio della magia. La lingua suona dura alla maggior parte delle altre creature e include numerose consonanti forti e sibilanti.",
    "traits": [
      {
        "index": "draconic-ancestry",
        "name": "Discendenza Draconica",
        "url": "/api/2014/traits/draconic-ancestry"
      },
      {
        "index": "breath-weapon",
        "name": "Arma a Soffio",
        "url": "/api/2014/traits/breath-weapon"
      },
      {
        "index": "damage-resistance",
        "name": "Resistenza ai Danni",
        "url": "/api/2014/traits/damage-resistance"
      }
    ],
    "subraces": [],
    "url": "/api/2014/races/dragonborn",
    "updated_at": "2025-10-24T20:42:14.212Z"
  },
  {
    "index": "dwarf",
    "name": "Nano",
    "speed": 7.5,
    "ability_bonuses": [
      {
        "ability_score": {
          "index": "con",
          "name": "COS",
          "url": "/api/2014/ability-scores/con"
        },
        "bonus": 2
      }
    ],
    "alignment": "La maggior parte dei nani è legale, credendo fermamente nei benefici di una società ben ordinata. Tendono anche al bene, con un forte senso di correttezza e la convinzione che tutti meritino di condividere i benefici di un ordine giusto.",
    "age": "I nani maturano alla stessa velocità degli umani, ma sono considerati giovani fino ai 50 anni. In media, vivono circa 350 anni.",
    "size": "Media",
    "size_description": "I nani sono alti tra i 120 e i 150 cm e pesano in media circa 70 kg. La tua taglia è Media.",
    "languages": [
      {
        "index": "common",
        "name": "Comune",
        "url": "/api/2014/languages/common"
      },
      {
        "index": "dwarvish",
        "name": "Nanico",
        "url": "/api/2014/languages/dwarvish"
      }
    ],
    "language_desc": "Puoi parlare, leggere e scrivere in Comune e Nanico. Il Nanico è ricco di consonanti dure e suoni gutturali, e tali caratteristiche influenzano qualsiasi altra lingua un nano possa parlare.",
    "traits": [
      {
        "index": "darkvision",
        "name": "Scurovisione",
        "url": "/api/2014/traits/darkvision"
      },
      {
        "index": "dwarven-resilience",
        "name": "Resilienza Nanica",
        "url": "/api/2014/traits/dwarven-resilience"
      },
      {
        "index": "stonecunning",
        "name": "Esperto Minerario",
        "url": "/api/2014/traits/stonecunning"
      },
      {
        "index": "dwarven-combat-training",
        "name": "Addestramento al Combattimento Nanico",
        "url": "/api/2014/traits/dwarven-combat-training"
      },
      {
        "index": "tool-proficiency",
        "name": "Competenza negli Strumenti",
        "url": "/api/2014/traits/tool-proficiency"
      }
    ],
    "subraces": [
      {
        "index": "hill-dwarf",
        "name": "Nano delle Colline",
        "url": "/api/2014/subraces/hill-dwarf"
      }
    ],
    "url": "/api/2014/races/dwarf",
    "updated_at": "2025-10-24T20:42:14.212Z"
  },
  {
    "index": "elf",
    "name": "Elfo",
    "speed": 9,
    "ability_bonuses": [
      {
        "ability_score": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "bonus": 2
      }
    ],
    "age": "Sebbene gli elfi raggiungano la maturità fisica circa alla stessa età degli umani, la concezione elfica dell'età adulta va oltre la crescita fisica per abbracciare l'esperienza del mondo. Un elfo tipicamente dichiara l'età adulta e un nome da adulto intorno ai 100 anni e può vivere fino a 750 anni.",
    "alignment": "Gli elfi amano la libertà, la varietà e l'espressione di sé, quindi tendono fortemente verso gli aspetti più gentili del caos. Valorizzano e proteggono la libertà altrui tanto quanto la propria, e sono più spesso buoni che non.",
    "size": "Media",
    "size_description": "Gli elfi variano da meno di 150 a oltre 180 cm di altezza e hanno corporature snelle. La tua taglia è Media.",
    "languages": [
      {
        "index": "common",
        "name": "Comune",
        "url": "/api/2014/languages/common"
      },
      {
        "index": "elvish",
        "name": "Elfico",
        "url": "/api/2014/languages/elvish"
      }
    ],
    "language_desc": "Puoi parlare, leggere e scrivere in Comune e Elfico. L'Elfico è fluido, con intonazioni sottili e una grammatica complessa. La letteratura elfica è ricca e varia, e le loro canzoni e poesie sono famose tra le altre razze. Molti bardi imparano la loro lingua per poter aggiungere ballate elfiche ai propri repertori.",
    "traits": [
      {
        "index": "darkvision",
        "name": "Scurovisione",
        "url": "/api/2014/traits/darkvision"
      },
      {
        "index": "fey-ancestry",
        "name": "Discendenza Fatata",
        "url": "/api/2014/traits/fey-ancestry"
      },
      {
        "index": "trance",
        "name": "Trance",
        "url": "/api/2014/traits/trance"
      },
      {
        "index": "keen-senses",
        "name": "Sensi Acuti",
        "url": "/api/2014/traits/keen-senses"
      }
    ],
    "subraces": [
      {
        "index": "high-elf",
        "name": "Alto Elfo",
        "url": "/api/2014/subraces/high-elf"
      }
    ],
    "url": "/api/2014/races/elf",
    "updated_at": "2025-10-24T20:42:14.212Z"
  },
  {
    "index": "gnome",
    "name": "Gnomo",
    "speed": 7.5,
    "ability_bonuses": [
      {
        "ability_score": {
          "index": "int",
          "name": "INT",
          "url": "/api/2014/ability-scores/int"
        },
        "bonus": 2
      }
    ],
    "alignment": "I gnomi sono molto spesso buoni. Coloro che tendono alla legge sono saggi, ingegneri, ricercatori, studiosi, investigatori o inventori. Coloro che tendono al caos sono menestrelli, imbroglioni, vagabondi o fantasiosi gioiellieri. I gnomi sono di buon cuore, e persino gli imbroglioni tra loro sono più giocherelloni che viziosi.",
    "age": "I gnomi maturano alla stessa velocità degli umani, e ci si aspetta che la maggior parte si stabilizzi in una vita adulta intorno ai 40 anni. Possono vivere dai 350 ai quasi 500 anni.",
    "size": "Piccola",
    "size_description": "I gnomi sono alti tra i 90 e i 120 cm e pesano in media circa 18 kg. La tua taglia è Piccola.",
    "languages": [
      {
        "index": "common",
        "name": "Comune",
        "url": "/api/2014/languages/common"
      },
      {
        "index": "gnomish",
        "name": "Gnomesco",
        "url": "/api/2014/languages/gnomish"
      }
    ],
    "language_desc": "Puoi parlare, leggere e scrivere in Comune e Gnomesco. La lingua Gnomesca, che utilizza i caratteri Nanici, è rinomata per i suoi trattati tecnici e i suoi cataloghi di conoscenza sul mondo naturale.",
    "traits": [
      {
        "index": "darkvision",
        "name": "Scurovisione",
        "url": "/api/2014/traits/darkvision"
      },
      {
        "index": "gnome-cunning",
        "name": "Astuzia Gnomesca",
        "url": "/api/2014/traits/gnome-cunning"
      }
    ],
    "subraces": [
      {
        "index": "rock-gnome",
        "name": "Gnomo delle Rocce",
        "url": "/api/2014/subraces/rock-gnome"
      }
    ],
    "url": "/api/2014/races/gnome",
    "updated_at": "2025-10-24T20:42:14.212Z"
  },
  {
    "index": "half-elf",
    "name": "Mezzelfo",
    "speed": 9,
    "ability_bonuses": [
      {
        "ability_score": {
          "index": "cha",
          "name": "CAR",
          "url": "/api/2014/ability-scores/cha"
        },
        "bonus": 2
      }
    ],
    "ability_bonus_options": {
      "choose": 2,
      "type": "ability_bonuses",
      "from": {
        "option_set_type": "options_array",
        "options": [
          {
            "option_type": "ability_bonus",
            "ability_score": {
              "index": "str",
              "name": "FOR",
              "url": "/api/2014/ability-scores/str"
            },
            "bonus": 1
          },
          {
            "option_type": "ability_bonus",
            "ability_score": {
              "index": "dex",
              "name": "DES",
              "url": "/api/2014/ability-scores/dex"
            },
            "bonus": 1
          },
          {
            "option_type": "ability_bonus",
            "ability_score": {
              "index": "con",
              "name": "COS",
              "url": "/api/2014/ability-scores/con"
            },
            "bonus": 1
          },
          {
            "option_type": "ability_bonus",
            "ability_score": {
              "index": "int",
              "name": "INT",
              "url": "/api/2014/ability-scores/int"
            },
            "bonus": 1
          },
          {
            "option_type": "ability_bonus",
            "ability_score": {
              "index": "wis",
              "name": "SAG",
              "url": "/api/2014/ability-scores/wis"
            },
            "bonus": 1
          }
        ]
      }
    },
    "alignment": "I mezzelfi condividono la tendenza caotica del loro retaggio elfico. Valorizzano sia la libertà personale che l'espressione creativa, non dimostrando né amore per i leader né desiderio di seguaci. Mal sopportano le regole, risentono delle richieste altrui e a volte si rivelano inaffidabili, o almeno imprevedibili.",
    "age": "I mezzelfi maturano alla stessa velocità degli umani e raggiungono l'età adulta intorno ai 20 anni. Vivono però molto più a lungo degli umani, superando spesso i 180 anni.",
    "size": "Media",
    "size_description": "I mezzelfi hanno circa la stessa taglia degli umani, variando dai 150 ai 180 cm di altezza. La tua taglia è Media.",
    "languages": [
      {
        "index": "common",
        "name": "Comune",
        "url": "/api/2014/languages/common"
      },
      {
        "index": "elvish",
        "name": "Elfico",
        "url": "/api/2014/languages/elvish"
      }
    ],
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
    "language_desc": "Puoi parlare, leggere e scrivere in Comune, Elfico e un'altra lingua a tua scelta.",
    "traits": [
      {
        "index": "darkvision",
        "name": "Scurovisione",
        "url": "/api/2014/traits/darkvision"
      },
      {
        "index": "fey-ancestry",
        "name": "Discendenza Fatata",
        "url": "/api/2014/traits/fey-ancestry"
      },
      {
        "index": "skill-versatility",
        "name": "Versatilità nelle Abilità",
        "url": "/api/2014/traits/skill-versatility"
      }
    ],
    "subraces": [],
    "url": "/api/2014/races/half-elf",
    "updated_at": "2025-10-24T20:42:14.212Z"
  },
  {
    "index": "half-orc",
    "name": "Mezzorco",
    "speed": 9,
    "ability_bonuses": [
      {
        "ability_score": {
          "index": "str",
          "name": "FOR",
          "url": "/api/2014/ability-scores/str"
        },
        "bonus": 2
      },
      {
        "ability_score": {
          "index": "con",
          "name": "COS",
          "url": "/api/2014/ability-scores/con"
        },
        "bonus": 1
      }
    ],
    "alignment": "I mezzorchi ereditano una tendenza verso il caos dai loro genitori orchi e non sono fortemente inclini al bene. I mezzorchi cresciuti tra gli orchi e disposti a vivere la loro vita tra di loro sono solitamente malvagi.",
    "age": "I mezzorchi maturano un po' più velocemente degli umani, raggiungendo l'età adulta intorno ai 14 anni. Invecchiano sensibilmente più in fretta e raramente vivono oltre i 75 anni.",
    "size": "Media",
    "size_description": "I mezzorchi sono leggermente più grandi e massicci degli umani, e la loro altezza varia da 1,5 metri a ben oltre 1,8 metri. La tua taglia è Media.",
    "languages": [
      {
        "index": "common",
        "name": "Comune",
        "url": "/api/2014/languages/common"
      },
      {
        "index": "orc",
        "name": "Orchesco",
        "url": "/api/2014/languages/orc"
      }
    ],
    "language_desc": "Puoi parlare, leggere e scrivere in Comune e Orchesco. L'Orchesco è una lingua aspra e stridente, con consonanti dure. Non ha un proprio alfabeto ma viene scritto utilizzando i caratteri Nanici.",
    "traits": [
      {
        "index": "darkvision",
        "name": "Scurovisione",
        "url": "/api/2014/traits/darkvision"
      },
      {
        "index": "savage-attacks",
        "name": "Attacchi Selvaggi",
        "url": "/api/2014/traits/savage-attacks"
      },
      {
        "index": "relentless-endurance",
        "name": "Resistenza Inesausta",
        "url": "/api/2014/traits/relentless-endurance"
      },
      {
        "index": "menacing",
        "name": "Minaccioso",
        "url": "/api/2014/traits/menacing"
      }
    ],
    "subraces": [],
    "url": "/api/2014/races/half-orc",
    "updated_at": "2025-10-24T20:42:14.212Z"
  },
  {
    "index": "halfling",
    "name": "Halfling",
    "speed": 7.5,
    "ability_bonuses": [
      {
        "ability_score": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "bonus": 2
      }
    ],
    "age": "Un halfling raggiunge l'età adulta a 20 anni e generalmente vive fino alla metà del suo secondo secolo.",
    "alignment": "La maggior parte degli halfling è legale buono. Di norma sono generosi e gentili, odiano vedere soffrire gli altri e non hanno tolleranza per l'oppressione. Sono anche molto ordinati e tradizionalisti, facendo grande affidamento sul supporto della loro comunità e sul comfort delle vecchie usanze.",
    "size": "Piccola",
    "size_description": "Gli halfling sono alti in media circa 90 cm e pesano circa 18 kg. La tua taglia è Piccola.",
    "languages": [
      {
        "index": "common",
        "name": "Comune",
        "url": "/api/2014/languages/common"
      },
      {
        "index": "halfling",
        "name": "Halfling",
        "url": "/api/2014/languages/halfling"
      }
    ],
    "language_desc": "Puoi parlare, leggere e scrivere in Comune e Halfling. La lingua Halfling non è segreta, ma gli halfling sono riluttanti a condividerla con altri. Scrivono molto poco, quindi non possiedono un ricco corpo letterario. La loro tradizione orale, tuttavia, è molto forte. Quasi tutti gli halfling parlano il Comune per conversare con le persone nelle cui terre dimorano o attraverso le quali viaggiano.",
    "traits": [
      {
        "index": "brave",
        "name": "Coraggioso",
        "url": "/api/2014/traits/brave"
      },
      {
        "index": "halfling-nimbleness",
        "name": "Agilità Halfling",
        "url": "/api/2014/traits/halfling-nimbleness"
      },
      {
        "index": "lucky",
        "name": "Fortunato",
        "url": "/api/2014/traits/lucky"
      }
    ],
    "subraces": [
      {
        "index": "lightfoot-halfling",
        "name": "Halfling Piedelesto",
        "url": "/api/2014/subraces/lightfoot-halfling"
      }
    ],
    "url": "/api/2014/races/halfling",
    "updated_at": "2025-10-24T20:42:14.212Z"
  },
  {
    "index": "human",
    "name": "Umano",
    "speed": 9,
    "ability_bonuses": [
      {
        "ability_score": { "index": "str", "name": "FOR", "url": "/api/2014/ability-scores/str" },
        "bonus": 1
      },
      {
        "ability_score": { "index": "dex", "name": "DES", "url": "/api/2014/ability-scores/dex" },
        "bonus": 1
      },
      {
        "ability_score": { "index": "con", "name": "COS", "url": "/api/2014/ability-scores/con" },
        "bonus": 1
      },
      {
        "ability_score": { "index": "int", "name": "INT", "url": "/api/2014/ability-scores/int" },
        "bonus": 1
      },
      {
        "ability_score": { "index": "wis", "name": "SAG", "url": "/api/2014/ability-scores/wis" },
        "bonus": 1
      },
      {
        "ability_score": { "index": "cha", "name": "CAR", "url": "/api/2014/ability-scores/cha" },
        "bonus": 1
      }
    ],
    "age": "Gli umani raggiungono l'età adulta verso la fine dei dieci anni e vivono meno di un secolo.",
    "alignment": "Gli umani non tendono verso alcun allineamento particolare. Tra di loro si possono trovare i migliori e i peggiori.",
    "size": "Media",
    "size_description": "Gli umani variano ampiamente in altezza e corporatura, da appena 1,5 metri a ben oltre 1,8 metri. Indipendentemente dalla tua posizione in questo intervallo, la tua taglia è Media.",
    "languages": [
      {
        "index": "common",
        "name": "Comune",
        "url": "/api/2014/languages/common"
      }
    ],
    "language_options": {
      "choose": 1,
      "type": "languages",
      "from": {
        "option_set_type": "options_array",
        "options": [
          { "option_type": "reference", "item": { "index": "dwarvish", "name": "Nanico", "url": "/api/2014/languages/dwarvish" } },
          { "option_type": "reference", "item": { "index": "elvish", "name": "Elfico", "url": "/api/2014/languages/elvish" } },
          { "option_type": "reference", "item": { "index": "giant", "name": "Gigante", "url": "/api/2014/languages/giant" } },
          { "option_type": "reference", "item": { "index": "gnomish", "name": "Gnomesco", "url": "/api/2014/languages/gnomish" } },
          { "option_type": "reference", "item": { "index": "goblin", "name": "Goblin", "url": "/api/2014/languages/goblin" } },
          { "option_type": "reference", "item": { "index": "halfling", "name": "Halfling", "url": "/api/2014/languages/halfling" } },
          { "option_type": "reference", "item": { "index": "orc", "name": "Orchesco", "url": "/api/2014/languages/orc" } },
          { "option_type": "reference", "item": { "index": "abyssal", "name": "Abissale", "url": "/api/2014/languages/abyssal" } },
          { "option_type": "reference", "item": { "index": "celestial", "name": "Celestiale", "url": "/api/2014/languages/celestial" } },
          { "option_type": "reference", "item": { "index": "draconic", "name": "Draconico", "url": "/api/2014/languages/draconic" } },
          { "option_type": "reference", "item": { "index": "deep-speech", "name": "Gergo delle Profondità", "url": "/api/2014/languages/deep-speech" } },
          { "option_type": "reference", "item": { "index": "infernal", "name": "Infernale", "url": "/api/2014/languages/infernal" } },
          { "option_type": "reference", "item": { "index": "primordial", "name": "Primordiale", "url": "/api/2014/languages/primordial" } },
          { "option_type": "reference", "item": { "index": "sylvan", "name": "Silvano", "url": "/api/2014/languages/sylvan" } },
          { "option_type": "reference", "item": { "index": "undercommon", "name": "Comune del Buio", "url": "/api/2014/languages/undercommon" } }
        ]
      }
    },
    "language_desc": "Puoi parlare, leggere e scrivere in Comune e una lingua extra a tua scelta. Gli umani in genere imparano le lingue dei popoli con cui hanno a che fare, inclusi dialetti oscuri. Amano arricchire il proprio discorso con parole prese in prestito da altre lingue: imprecazioni Orchesche, espressioni musicali Elfiche, frasi militari Naniche e così via.",
    "traits": [],
    "subraces": [],
    "url": "/api/2014/races/human",
    "updated_at": "2025-10-24T20:42:14.212Z"
  },
  {
    "index": "tiefling",
    "name": "Tiefling",
    "speed": 9,
    "ability_bonuses": [
      {
        "ability_score": {
          "index": "int",
          "name": "INT",
          "url": "/api/2014/ability-scores/int"
        },
        "bonus": 1
      },
      {
        "ability_score": {
          "index": "cha",
          "name": "CAR",
          "url": "/api/2014/ability-scores/cha"
        },
        "bonus": 2
      }
    ],
    "alignment": "I tiefling potrebbero non avere una tendenza innata verso il male, ma molti di loro finiscono per sceglierlo. Malvagi o meno, la loro natura indipendente inclina molti tiefling verso un allineamento caotico.",
    "age": "I tiefling maturano alla stessa velocità degli umani ma vivono qualche anno in più.",
    "size": "Media",
    "size_description": "I tiefling hanno circa la stessa taglia e corporatura degli umani. La tua taglia è Media.",
    "languages": [
      {
        "index": "common",
        "name": "Comune",
        "url": "/api/2014/languages/common"
      },
      {
        "index": "infernal",
        "name": "Infernale",
        "url": "/api/2014/languages/infernal"
      }
    ],
    "language_desc": "Puoi parlare, leggere e scrivere in Comune e Infernale.",
    "traits": [
      {
        "index": "darkvision",
        "name": "Scurovisione",
        "url": "/api/2014/traits/darkvision"
      },
      {
        "index": "hellish-resistance",
        "name": "Resistenza Infernale",
        "url": "/api/2014/traits/hellish-resistance"
      },
      {
        "index": "infernal-legacy",
        "name": "Eredità Infernale",
        "url": "/api/2014/traits/infernal-legacy"
      }
    ],
    "subraces": [],
    "url": "/api/2014/races/tiefling",
    "updated_at": "2025-10-24T20:42:14.212Z"
  }
]

