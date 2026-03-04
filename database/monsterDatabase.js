export const monsterDatabase = [
{
  "index": "aboleth",
  "name": "Aboleth",
  "size": "Grande",
  "type": "aberrazione",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 17
    }
  ],
  "hit_points": 135,
  "hit_dice": "18d10",
  "hit_points_roll": "18d10+36",
  "speed": {
    "camminare": "3 m.",
    "nuotare": "12 m."
  },
  "strength": 21,
  "dexterity": 9,
  "constitution": 15,
  "intelligence": 18,
  "wisdom": 15,
  "charisma": 18,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "saving-throw-int",
        "name": "Tiro Salvezza: INT",
        "url": "/api/2014/proficiencies/saving-throw-int"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 12,
      "proficiency": {
        "index": "skill-history",
        "name": "Abilità: Storia",
        "url": "/api/2014/proficiencies/skill-history"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "darkvision": "36 m.",
    "Percezione passiva": 20
  },
  "languages": "Linguaggio Profondo, telepatia 36 m.",
  "challenge_rating": 10,
  "proficiency_bonus": 4,
  "xp": 5900,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "L'aboleth può respirare aria e acqua.",
      "damage": []
    },
    {
      "name": "Nube di Muco",
      "desc": "Quando è sott'acqua, l'aboleth è circondato da muco trasformativo. Una creatura che tocca l'aboleth o che lo colpisce con un Attacco con Arma da Mischia entro 1,5 m. da esso deve effettuare un Tiro Salvezza di Costituzione CD 14. Se fallisce, la creatura è affetta da Malattia per 1d4 ore. La creatura malata può respirare solo sott'acqua.",
      "dc": {
        "dc_type": {
          "index": "con",
          "name": "COS",
          "url": "/api/2014/ability-scores/con"
        },
        "dc_value": 14,
        "success_type": "none"
      },
      "damage": []
    },
    {
      "name": "Telepatia Indagatrice",
      "desc": "Se una creatura comunica telepaticamente con l'aboleth, l'aboleth viene a conoscenza dei desideri più reconditi della creatura, a condizione che l'aboleth possa vedere la creatura.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "L'aboleth effettua tre attacchi di Tentacolo.",
      "actions": [
        {
          "action_name": "Tentacolo",
          "count": "3",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Tentacolo",
      "desc": "Attacco con Arma da Mischia: +9 per colpire, portata 3 m., un bersaglio. Colpito: 12 (2d6 + 5) danno contundente. Se il bersaglio è una creatura, deve superare un Tiro Salvezza di Costituzione CD 14 o essere affetto da Malattia. La Malattia non ha effetto per 1 minuto e può essere rimossa da qualsiasi magia che curi le malattie. Dopo 1 minuto, la pelle della creatura affetta diventa traslucida e viscida, la creatura non può recuperare Punti Ferita a meno che non sia sott'acqua, e la Malattia può essere rimossa solo con *Guarigione* o un altro incantesimo curamalattie di 6° livello o superiore. Quando la creatura è fuori da uno specchio d'acqua, subisce 6 (1d12) danno da acido ogni 10 minuti a meno che non venga applicata umidità sulla pelle prima che siano trascorsi 10 minuti.",
      "attack_bonus": 9,
      "dc": {
        "dc_type": {
          "index": "con",
          "name": "COS",
          "url": "/api/2014/ability-scores/con"
        },
        "dc_value": 14,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+5"
        },
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "1d12"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +9 per colpire, portata 3 m., un bersaglio. Colpito: 15 (3d6 + 5) danno contundente.",
      "attack_bonus": 9,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "3d6+5"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Asservire",
      "desc": "L'aboleth bersaglia una creatura che può vedere entro 9 m. da esso. Il bersaglio deve superare un Tiro Salvezza di Saggezza CD 14 o essere **incantato** magicamente dall'aboleth finché l'aboleth non muore o finché non si trova su un piano di esistenza diverso dal bersaglio. Il bersaglio **incantato** è sotto il controllo dell'aboleth e non può effettuare Reazioni, e l'aboleth e il bersaglio possono comunicare telepaticamente tra loro a qualsiasi distanza.\nOgni volta che il bersaglio **incantato** subisce danno, il bersaglio può ripetere il Tiro Salvezza. In caso di successo, l'effetto termina. Non più di una volta ogni 24 ore, il bersaglio può anche ripetere il Tiro Salvezza quando si trova ad almeno 1,6 km di distanza dall'aboleth.",
      "usage": {
        "type": "per day",
        "times": 3
      },
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 14,
        "success_type": "none"
      },
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "L'aboleth effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Colpo di Coda",
      "desc": "L'aboleth effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Drenaggio Psichico (Costo: 2 Azioni)",
      "desc": "Una creatura **incantata** dall'aboleth subisce 10 (3d6) danno psichico, e l'aboleth recupera Punti Ferita pari ai danni subiti dalla creatura.",
      "damage": [
        {
          "damage_type": {
            "index": "psychic",
            "name": "Psichico",
            "url": "/api/2014/damage-types/psychic"
          },
          "damage_dice": "3d6"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/aboleth.png",
  "url": "/api/2014/monsters/aboleth",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "adult-black-dragon",
  "name": "Drago Nero Adulto",
  "size": "Enorme",
  "type": "drago",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 19
    }
  ],
  "hit_points": 195,
  "hit_dice": "17d12",
  "hit_points_roll": "17d12+85",
  "speed": {
    "camminare": "12 m.",
    "volare": "24 m.",
    "nuotare": "12 m."
  },
  "strength": 23,
  "dexterity": 14,
  "constitution": 21,
  "intelligence": 14,
  "wisdom": 13,
  "charisma": 17,
  "proficiencies": [
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "acido"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 21
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 14,
  "proficiency_bonus": 5,
  "xp": 11500,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il drago può respirare aria e acqua.",
      "damage": []
    },
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "per day",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 3 m., un bersaglio. Colpito: 17 (2d10 + 6) danno perforante più 4 (1d8) danno da acido.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+6"
        },
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "1d8"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 1,5 m., un bersaglio. Colpito: 13 (2d6 + 6) danno tagliente.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+6"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 4,5 m., un bersaglio. Colpito: 15 (2d8 + 6) danno contundente.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+6"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 16 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 16,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "name": "Soffio Acido",
      "desc": "Il drago esala acido in una linea lunga 18 metri e larga 1,5 metri. Ogni creatura su quella linea deve effettuare un Tiro Salvezza su Destrezza CD 18, subendo 54 (12d8) danno da acido se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 18,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "12d8"
        }
      ],
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 3 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 19 o subire 13 (2d6 + 6) danno contundente ed essere **buttata prona**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 19,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+6"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/adult-black-dragon.png",
  "url": "/api/2014/monsters/adult-black-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "adult-blue-dragon",
  "name": "Drago Blu Adulto",
  "size": "Enorme",
  "type": "drago",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 19
    }
  ],
  "hit_points": 225,
  "hit_dice": "18d12",
  "hit_points_roll": "18d12+108",
  "speed": {
    "camminare": "12 m.",
    "scavare": "9 m.",
    "volare": "24 m."
  },
  "strength": 25,
  "dexterity": 10,
  "constitution": 23,
  "intelligence": 16,
  "wisdom": 15,
  "charisma": 19,
  "proficiencies": [
    {
      "value": 5,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 12,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fulmine"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 22
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 16,
  "proficiency_bonus": 5,
  "xp": 15000,
  "special_abilities": [
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "per day",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +12 per colpire, portata 3 m., un bersaglio. Colpito: 18 (2d10 + 7) danno perforante più 5 (1d10) danno da fulmine.",
      "attack_bonus": 12,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+7"
        },
        {
          "damage_type": {
            "index": "lightning",
            "name": "Fulmine",
            "url": "/api/2014/damage-types/lightning"
          },
          "damage_dice": "1d10"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +12 per colpire, portata 1,5 m., un bersaglio. Colpito: 14 (2d6 + 7) danno tagliente.",
      "attack_bonus": 12,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+7"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +12 per colpire, portata 4,5 m., un bersaglio. Colpito: 16 (2d8 + 7) danno contundente.",
      "attack_bonus": 12,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+7"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 17 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 17,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "name": "Soffio Fulminante",
      "desc": "Il drago esala fulmini in una linea lunga 27 metri e larga 1,5 metri. Ogni creatura su quella linea deve effettuare un Tiro Salvezza su Destrezza CD 19, subendo 66 (12d10) danno da fulmine se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 19,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "lightning",
            "name": "Fulmine",
            "url": "/api/2014/damage-types/lightning"
          },
          "damage_dice": "12d10"
        }
      ],
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 3 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 20 o subire 14 (2d6 + 7) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 20,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+7"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/adult-blue-dragon.png",
  "url": "/api/2014/monsters/adult-blue-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "adult-brass-dragon",
  "name": "Drago d'Ottone Adulto",
  "size": "Enorme",
  "type": "drago",
  "alignment": "caotico buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 18
    }
  ],
  "hit_points": 172,
  "hit_dice": "15d12",
  "hit_points_roll": "15d12+75",
  "speed": {
    "camminare": "12 m.",
    "scavare": "12 m.",
    "volare": "24 m."
  },
  "strength": 23,
  "dexterity": 10,
  "constitution": 21,
  "intelligence": 14,
  "wisdom": 13,
  "charisma": 17,
  "proficiencies": [
    {
      "value": 5,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-history",
        "name": "Abilità: Storia",
        "url": "/api/2014/proficiencies/skill-history"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "skill-persuasion",
        "name": "Abilità: Persuasione",
        "url": "/api/2014/proficiencies/skill-persuasion"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fuoco"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 21
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 13,
  "proficiency_bonus": 5,
  "xp": 10000,
  "special_abilities": [
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "per day",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 3 m., un bersaglio. Colpito: 17 (2d10 + 6) danno perforante.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+6"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 1,5 m., un bersaglio. Colpito: 13 (2d6 + 6) danno tagliente.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+6"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 4,5 m., un bersaglio. Colpito: 15 (2d8 + 6) danno contundente.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+6"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 16 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 16,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio:\n\n**Soffio di Fuoco**. Il drago esala fuoco in una linea lunga 18 metri e larga 1,5 metri. Ogni creatura su quella linea deve effettuare un Tiro Salvezza su Destrezza CD 18, subendo 45 (13d6) danno da fuoco se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.\n\n**Soffio del Sonno**. Il drago esala gas soporifero in un cono di 18 metri. Ogni creatura nell'area deve superare un Tiro Salvezza su Costituzione CD 18 o cadere **priva di sensi** per 10 minuti. Questo effetto termina per una creatura se subisce danno o se qualcuno usa un'azione per svegliarla.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio di Fuoco",
              "dc": {
                "dc_type": {
                  "index": "dex",
                  "name": "DES",
                  "url": "/api/2014/ability-scores/dex"
                },
                "dc_value": 18,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "fire",
                    "name": "Fuoco",
                    "url": "/api/2014/damage-types/fire"
                  },
                  "damage_dice": "13d6"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio del Sonno",
              "dc": {
                "dc_type": {
                  "index": "con",
                  "name": "COS",
                  "url": "/api/2014/ability-scores/con"
                },
                "dc_value": 18,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 3 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 19 o subire 13 (2d6 + 6) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 19,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+6"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/adult-brass-dragon.png",
  "url": "/api/2014/monsters/adult-brass-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "adult-green-dragon",
  "name": "Drago Verde Adulto",
  "size": "Enorme",
  "type": "drago",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 19
    }
  ],
  "hit_points": 207,
  "hit_dice": "18d12",
  "hit_points_roll": "18d12+90",
  "speed": {
    "camminare": "12 m.",
    "volare": "24 m.",
    "nuotare": "12 m."
  },
  "strength": 23,
  "dexterity": 12,
  "constitution": 21,
  "intelligence": 18,
  "wisdom": 15,
  "charisma": 17,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "skill-deception",
        "name": "Abilità: Inganno",
        "url": "/api/2014/proficiencies/skill-deception"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-insight",
        "name": "Abilità: Intuizione",
        "url": "/api/2014/proficiencies/skill-insight"
      }
    },
    {
      "value": 12,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "skill-persuasion",
        "name": "Abilità: Persuasione",
        "url": "/api/2014/proficiencies/skill-persuasion"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "poisoned",
      "name": "Avvelenato",
      "url": "/api/2014/conditions/poisoned"
    }
  ],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 22
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 15,
  "proficiency_bonus": 5,
  "xp": 13000,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il drago può respirare aria e acqua.",
      "damage": []
    },
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "per day",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 3 m., un bersaglio. Colpito: 17 (2d10 + 6) danno perforante più 7 (2d6) danno da veleno.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+6"
        },
        {
          "damage_type": {
            "index": "poison",
            "name": "Veleno",
            "url": "/api/2014/damage-types/poison"
          },
          "damage_dice": "2d6"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 1,5 m., un bersaglio. Colpito: 13 (2d6 + 6) danno tagliente.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+6"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 4,5 m., un bersaglio. Colpito: 15 (2d8 + 6) danno contundente.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+6"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 16 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 16,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "name": "Soffio Velenoso",
      "desc": "Il drago esala gas velenoso in un cono di 18 metri. Ogni creatura nell'area deve effettuare un Tiro Salvezza su Costituzione CD 18, subendo 56 (16d6) danno da veleno se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "con",
          "name": "COS",
          "url": "/api/2014/ability-scores/con"
        },
        "dc_value": 18,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "poison",
            "name": "Veleno",
            "url": "/api/2014/damage-types/poison"
          },
          "damage_dice": "16d6"
        }
      ],
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 3 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 19 o subire 13 (2d6 + 6) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 19,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+6"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/adult-green-dragon.png",
  "url": "/api/2014/monsters/adult-green-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "adult-copper-dragon",
  "name": "Drago di Rame Adulto",
  "size": "Enorme",
  "type": "drago",
  "alignment": "caotico buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 18
    }
  ],
  "hit_points": 184,
  "hit_dice": "16d12",
  "hit_points_roll": "16d12+80",
  "speed": {
    "camminare": "12 m.",
    "scalare": "12 m.",
    "volare": "24 m."
  },
  "strength": 23,
  "dexterity": 12,
  "constitution": 21,
  "intelligence": 18,
  "wisdom": 15,
  "charisma": 17,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "skill-deception",
        "name": "Abilità: Inganno",
        "url": "/api/2014/proficiencies/skill-deception"
      }
    },
    {
      "value": 12,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "acido"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 22
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 14,
  "proficiency_bonus": 5,
  "xp": 11500,
  "special_abilities": [
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "per day",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 3 m., un bersaglio. Colpito: 17 (2d10 + 6) danno perforante.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+6"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 1,5 m., un bersaglio. Colpito: 13 (2d6 + 6) danno tagliente.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+6"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 4,5 m., un bersaglio. Colpito: 15 (2d8 + 6) danno contundente.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+6"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 16 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 16,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio.\n\n**Soffio Acido**. Il drago esala acido in una linea lunga 18 metri e larga 1,5 metri. Ogni creatura su quella linea deve effettuare un Tiro Salvezza su Destrezza CD 18, subendo 54 (12d8) danno da acido se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.\n\n**Soffio Lento**. Il drago esala gas in un cono di 18 metri. Ogni creatura nell'area deve superare un Tiro Salvezza su Costituzione CD 18. Se fallisce il tiro salvezza, la creatura non può usare reazioni, la sua velocità è dimezzata e non può effettuare più di un attacco nel suo turno. Inoltre, la creatura può usare un'azione o un'azione bonus nel suo turno, ma non entrambe. Questi effetti durano 1 minuto. La creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé con un successo.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio Acido",
              "dc": {
                "dc_type": {
                  "index": "dex",
                  "name": "DES",
                  "url": "/api/2014/ability-scores/dex"
                },
                "dc_value": 18,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "acid",
                    "name": "Acido",
                    "url": "/api/2014/damage-types/acid"
                  },
                  "damage_dice": "12d8"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio Lento",
              "dc": {
                "dc_type": {
                  "index": "con",
                  "name": "COS",
                  "url": "/api/2014/ability-scores/con"
                },
                "dc_value": 18,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 3 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 19 o subire 13 (2d6 + 6) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 19,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "13d6+6"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/adult-copper-dragon.png",
  "url": "/api/2014/monsters/adult-copper-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "adult-gold-dragon",
  "name": "Drago d'Oro Adulto",
  "size": "Enorme",
  "type": "drago",
  "alignment": "legale buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 19
    }
  ],
  "hit_points": 256,
  "hit_dice": "19d12",
  "hit_points_roll": "19d12+133",
  "speed": {
    "camminare": "12 m.",
    "volare": "24 m.",
    "nuotare": "12 m."
  },
  "strength": 27,
  "dexterity": 14,
  "constitution": 25,
  "intelligence": 16,
  "wisdom": 15,
  "charisma": 24,
  "proficiencies": [
    {
      "value": 8,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 13,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 13,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "skill-insight",
        "name": "Abilità: Intuizione",
        "url": "/api/2014/proficiencies/skill-insight"
      }
    },
    {
      "value": 14,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 13,
      "proficiency": {
        "index": "skill-persuasion",
        "name": "Abilità: Persuasione",
        "url": "/api/2014/proficiencies/skill-persuasion"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fuoco"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 24
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 17,
  "proficiency_bonus": 6,
  "xp": 18000,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il drago può respirare aria e acqua.",
      "damage": []
    },
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "per day",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 3 m., un bersaglio. Colpito: 19 (2d10 + 8) danno perforante.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 1,5 m., un bersaglio. Colpito: 15 (2d6 + 8) danno tagliente.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 4,5 m., un bersaglio. Colpito: 17 (2d8 + 8) danno contundente.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+8"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 21 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 21,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio.\n\n**Soffio di Fuoco**. Il drago esala fuoco in un cono di 18 metri. Ogni creatura nell'area deve effettuare un Tiro Salvezza su Destrezza CD 21, subendo 66 (12d10) danno da fuoco se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.\n\n**Soffio Indebolente**. Il drago esala gas in un cono di 18 metri. Ogni creatura nell'area deve superare un Tiro Salvezza su Forza CD 21 o subisce **svantaggio** sui tiri per colpire basati su Forza, sulle prove di Forza e sui tiri salvezza su Forza per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio di Fuoco",
              "dc": {
                "dc_type": {
                  "index": "dex",
                  "name": "DES",
                  "url": "/api/2014/ability-scores/dex"
                },
                "dc_value": 21,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "fire",
                    "name": "Fuoco",
                    "url": "/api/2014/damage-types/fire"
                  },
                  "damage_dice": "12d10"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio Indebolente",
              "dc": {
                "dc_type": {
                  "index": "str",
                  "name": "FOR",
                  "url": "/api/2014/ability-scores/str"
                },
                "dc_value": 21,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 3 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 22 o subire 15 (2d6 + 8) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 22,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+8"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/adult-gold-dragon.png",
  "url": "/api/2014/monsters/adult-gold-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "adult-silver-dragon",
  "name": "Drago d'Argento Adulto",
  "size": "Enorme",
  "type": "drago",
  "alignment": "legale buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 19
    }
  ],
  "hit_points": 243,
  "hit_dice": "18d12",
  "hit_points_roll": "18d12+126",
  "speed": {
    "camminare": "12 m.",
    "volare": "24 m."
  },
  "strength": 27,
  "dexterity": 10,
  "constitution": 25,
  "intelligence": 16,
  "wisdom": 13,
  "charisma": 21,
  "proficiencies": [
    {
      "value": 5,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 12,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "skill-arcana",
        "name": "Abilità: Arcano",
        "url": "/api/2014/proficiencies/skill-arcana"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "skill-history",
        "name": "Abilità: Storia",
        "url": "/api/2014/proficiencies/skill-history"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "freddo"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 21
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 16,
  "proficiency_bonus": 5,
  "xp": 15000,
  "special_abilities": [
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "per day",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +13 per colpire, portata 3 m., un bersaglio. Colpito: 19 (2d10 + 8) danno perforante.",
      "attack_bonus": 13,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +13 per colpire, portata 1,5 m., un bersaglio. Colpito: 15 (2d6 + 8) danno tagliente.",
      "attack_bonus": 13,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +13 per colpire, portata 4,5 m., un bersaglio. Colpito: 17 (2d8 + 8) danno contundente.",
      "attack_bonus": 13,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+8"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 18 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 18,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio.\n\n**Soffio Freddo**. Il drago esala un getto gelido in un cono di 18 metri. Ogni creatura nell'area deve effettuare un Tiro Salvezza su Costituzione CD 20, subendo 58 (13d8) danno da freddo se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.\n\n**Soffio Paralizzante**. Il drago esala gas paralizzante in un cono di 18 metri. Ogni creatura nell'area deve superare un Tiro Salvezza su Costituzione CD 20 o essere **paralizzata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé con un successo.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio Freddo",
              "dc": {
                "dc_type": {
                  "index": "con",
                  "name": "COS",
                  "url": "/api/2014/ability-scores/con"
                },
                "dc_value": 20,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "cold",
                    "name": "Freddo",
                    "url": "/api/2014/damage-types/cold"
                  },
                  "damage_dice": "13d8"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio Paralizzante",
              "dc": {
                "dc_type": {
                  "index": "con",
                  "name": "COS",
                  "url": "/api/2014/ability-scores/con"
                },
                "dc_value": 20,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 3 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 22 o subire 15 (2d6 + 8) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 22,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+8"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/adult-silver-dragon.png",
  "url": "/api/2014/monsters/adult-silver-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "adult-red-dragon",
  "name": "Drago Rosso Adulto",
  "size": "Enorme",
  "type": "drago",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 19
    }
  ],
  "hit_points": 256,
  "hit_dice": "19d12",
  "hit_points_roll": "19d12+133",
  "speed": {
    "camminare": "12 m.",
    "scalare": "12 m.",
    "volare": "24 m."
  },
  "strength": 27,
  "dexterity": 10,
  "constitution": 25,
  "intelligence": 16,
  "wisdom": 13,
  "charisma": 21,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 13,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 13,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fuoco"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 23
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 17,
  "proficiency_bonus": 6,
  "xp": 18000,
  "special_abilities": [
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "per day",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 3 m., un bersaglio. Colpito: 19 (2d10 + 8) danno perforante più 7 (2d6) danno da fuoco.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+8"
        },
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "2d6"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 1,5 m., un bersaglio. Colpito: 15 (2d6 + 8) danno tagliente.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 4,5 m., un bersaglio. Colpito: 17 (2d8 + 8) danno contundente.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+8"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 19 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 19,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "name": "Soffio di Fuoco",
      "desc": "Il drago esala fuoco in un cono di 18 metri. Ogni creatura nell'area deve effettuare un Tiro Salvezza su Destrezza CD 21, subendo 63 (18d6) danno da fuoco se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 21,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "18d6"
        }
      ],
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 3 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 22 o subire 15 (2d6 + 8) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 22,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+8"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/adult-red-dragon.png",
  "url": "/api/2014/monsters/adult-red-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "adult-bronze-dragon",
  "name": "Drago di Bronzo Adulto",
  "size": "Enorme",
  "type": "drago",
  "alignment": "legale buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 19
    }
  ],
  "hit_points": 212,
  "hit_dice": "17d12",
  "hit_points_roll": "17d12+102",
  "speed": {
    "camminare": "12 m.",
    "volare": "24 m.",
    "nuotare": "12 m."
  },
  "strength": 25,
  "dexterity": 10,
  "constitution": 23,
  "intelligence": 16,
  "wisdom": 15,
  "charisma": 19,
  "proficiencies": [
    {
      "value": 5,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-insight",
        "name": "Abilità: Intuizione",
        "url": "/api/2014/proficiencies/skill-insight"
      }
    },
    {
      "value": 12,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fulmine"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 22
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 15,
  "proficiency_bonus": 5,
  "xp": 13000,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il drago può respirare aria e acqua.",
      "damage": []
    },
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +12 per colpire, portata 3 m., un bersaglio. Colpito: 18 (2d10 + 7) danno perforante.",
      "attack_bonus": 12,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+7"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +12 per colpire, portata 1,5 m., un bersaglio. Colpito: 14 (2d6 + 7) danno tagliente.",
      "attack_bonus": 12,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+7"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +12 per colpire, portata 4,5 m., un bersaglio. Colpito: 16 (2d8 + 7) danno contundente.",
      "attack_bonus": 12,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+7"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 17 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 17,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio.\n\n**Soffio di Fulmine**. Il drago esala fulmine in una linea di 27 metri, larga 1,5 metri. Ogni creatura in quella linea deve effettuare un Tiro Salvezza su Destrezza CD 19, subendo 66 (12d10) danno da fulmine se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.\n\n**Soffio di Repulsione**. Il drago esala energia di repulsione in un cono di 9 metri. Ogni creatura nell'area deve superare un Tiro Salvezza su Forza CD 19. Se fallisce il tiro salvezza, la creatura è spinta 18 metri via dal drago.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio di Fulmine",
              "dc": {
                "dc_type": {
                  "index": "dex",
                  "name": "DES",
                  "url": "/api/2014/ability-scores/dex"
                },
                "dc_value": 19,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "lightning",
                    "name": "Fulmine",
                    "url": "/api/2014/damage-types/lightning"
                  },
                  "damage_dice": "12d10"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio di Repulsione",
              "dc": {
                "dc_type": {
                  "index": "str",
                  "name": "FOR",
                  "url": "/api/2014/ability-scores/str"
                },
                "dc_value": 19,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 3 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 20 o subire 14 (2d6 + 7) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 20,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+7"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/adult-bronze-dragon.png",
  "url": "/api/2014/monsters/adult-bronze-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "adult-white-dragon",
  "name": "Drago Bianco Adulto",
  "size": "Enorme",
  "type": "drago",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 18
    }
  ],
  "hit_points": 200,
  "hit_dice": "16d12",
  "hit_points_roll": "16d12+96",
  "speed": {
    "camminare": "12 m.",
    "scavare": "9 m.",
    "volare": "24 m.",
    "nuotare": "12 m."
  },
  "strength": 22,
  "dexterity": 10,
  "constitution": 22,
  "intelligence": 8,
  "wisdom": 12,
  "charisma": 12,
  "proficiencies": [
    {
      "value": 5,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "freddo"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 21
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 13,
  "proficiency_bonus": 5,
  "xp": 10000,
  "special_abilities": [
    {
      "name": "Camminata su Ghiaccio",
      "desc": "Il drago può muoversi e arrampicarsi su superfici ghiacciate senza bisogno di effettuare una prova di caratteristica. Inoltre, un terreno difficile composto da ghiaccio o neve non gli costa movimento extra.",
      "damage": []
    },
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 3 m., un bersaglio. Colpito: 17 (2d10 + 6) danno perforante più 4 (1d8) danno da freddo.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+6"
        },
        {
          "damage_type": {
            "index": "cold",
            "name": "Freddo",
            "url": "/api/2014/damage-types/cold"
          },
          "damage_dice": "1d8"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 1,5 m., un bersaglio. Colpito: 13 (2d6 + 6) danno tagliente.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+6"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +11 per colpire, portata 4,5 m., un bersaglio. Colpito: 15 (2d8 + 6) danno contundente.",
      "attack_bonus": 11,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+6"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 14 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 14,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "name": "Soffio di Freddo",
      "desc": "Il drago esala un getto gelido in un cono di 18 metri. Ogni creatura nell'area deve effettuare un Tiro Salvezza su Costituzione CD 19, subendo 54 (12d8) danno da freddo se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "con",
          "name": "COS",
          "url": "/api/2014/ability-scores/con"
        },
        "dc_value": 19,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "cold",
            "name": "Freddo",
            "url": "/api/2014/damage-types/cold"
          },
          "damage_dice": "12d8"
        }
      ],
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 3 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 19 o subire 13 (2d6 + 6) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 19,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+6"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/adult-white-dragon.png",
  "url": "/api/2014/monsters/adult-white-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "acolyte",
  "name": "Acolito",
  "desc": "Gli Acoliti sono membri junior del clero, di solito responsabili di fronte a un sacerdote. Svolgono una varietà di funzioni in un tempio e viene loro concessa una minore capacità di lanciare incantesimi dalle loro divinità.",
  "size": "Media",
  "type": "umanoide",
  "subtype": "qualsiasi razza",
  "alignment": "qualsiasi allineamento",
  "armor_class": [
    {
      "type": "Destrezza",
      "value": 10
    }
  ],
  "hit_points": 9,
  "hit_dice": "2d8",
  "hit_points_roll": "2d8",
  "speed": {
    "walk": "9 m."
  },
  "strength": 10,
  "dexterity": 10,
  "constitution": 10,
  "intelligence": 10,
  "wisdom": 14,
  "charisma": 11,
  "proficiencies": [
    {
      "value": 4,
      "proficiency": {
        "index": "skill-medicine",
        "name": "Abilità: Medicina",
        "url": "/api/2014/proficiencies/skill-medicine"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "skill-religion",
        "name": "Abilità: Religione",
        "url": "/api/2014/proficiencies/skill-religion"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "Percezione passiva": 12
  },
  "languages": "qualsiasi lingua (solitamente Comune)",
  "challenge_rating": 0.25,
  "proficiency_bonus": 2,
  "xp": 50,
  "special_abilities": [
    {
      "name": "Incantesimi",
      "desc": "L'accolito è un incantatore di 1° livello. La sua caratteristica da incantatore è Saggezza (CD tiro salvezza dell'incantesimo 12, +4 al colpire con attacchi di incantesimo). L'accolito ha i seguenti incantesimi da Chierico preparati:\n\n- Trucchetti (a volontà): *light* (luce), *sacred flame* (fiamma sacra), *thaumaturgy* (taumaturgia)\n- 1° livello (3 slot): *bless* (benedizione), *cure wounds* (cura ferite), *sanctuary* (santuario)",
      "spellcasting": {
        "level": 1,
        "ability": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc": 12,
        "modifier": 4,
        "components_required": [
          "V",
          "S",
          "M"
        ],
        "school": "chierico",
        "slots": {
          "1": 3
        },
        "spells": [
          {
            "name": "Light",
            "level": 0,
            "url": "/api/2014/spells/light"
          },
          {
            "name": "Sacred Flame",
            "level": 0,
            "url": "/api/2014/spells/sacred-flame"
          },
          {
            "name": "Thaumaturgy",
            "level": 0,
            "url": "/api/2014/spells/thaumaturgy"
          },
          {
            "name": "Bless",
            "level": 1,
            "url": "/api/2014/spells/bless"
          },
          {
            "name": "Cure Wounds",
            "level": 1,
            "url": "/api/2014/spells/cure-wounds"
          },
          {
            "name": "Sanctuary",
            "level": 1,
            "url": "/api/2014/spells/sanctuary"
          }
        ]
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Randello",
      "desc": "Attacco con Arma da Mischia: +2 per colpire, portata 1,5 m., un bersaglio. Colpito: 2 (1d4) danno contundente.",
      "attack_bonus": 2,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "1d4"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/acolyte.png",
  "url": "/api/2014/monsters/acolyte",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "ancient-white-dragon",
  "name": "Drago Bianco Ancestrale",
  "size": "Colossale",
  "type": "drago",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 20
    }
  ],
  "hit_points": 333,
  "hit_dice": "18d20",
  "hit_points_roll": "18d20+144",
  "speed": {
    "camminare": "12 m.",
    "scavare": "12 m.",
    "volare": "24 m.",
    "nuotare": "12 m."
  },
  "strength": 26,
  "dexterity": 10,
  "constitution": 26,
  "intelligence": 10,
  "wisdom": 13,
  "charisma": 14,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 14,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 13,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "freddo"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 23
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 20,
  "proficiency_bonus": 6,
  "xp": 25000,
  "special_abilities": [
    {
      "name": "Camminata su Ghiaccio",
      "desc": "Il drago può muoversi e arrampicarsi su superfici ghiacciate senza bisogno di effettuare una prova di caratteristica. Inoltre, un terreno difficile composto da ghiaccio o neve non gli costa movimento extra.",
      "damage": []
    },
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 4,5 m., un bersaglio. Colpito: 19 (2d10 + 8) danno perforante più 9 (2d8) danno da freddo.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+8"
        },
        {
          "damage_type": {
            "index": "cold",
            "name": "Freddo",
            "url": "/api/2014/damage-types/cold"
          },
          "damage_dice": "2d8"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 3 m., un bersaglio. Colpito: 15 (2d6 + 8) danno tagliente.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 6 m., un bersaglio. Colpito: 17 (2d8 + 8) danno contundente.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+8"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 16 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 16,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "name": "Soffio di Freddo",
      "desc": "Il drago esala un getto gelido in un cono di 27 metri. Ogni creatura in quell'area deve effettuare un Tiro Salvezza su Costituzione CD 22, subendo 72 (16d8) danno da freddo se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "con",
          "name": "COS",
          "url": "/api/2014/ability-scores/con"
        },
        "dc_value": 22,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "cold",
            "name": "Freddo",
            "url": "/api/2014/damage-types/cold"
          },
          "damage_dice": "16d8"
        }
      ],
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 4,5 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 22 o subire 15 (2d6 + 8) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 22,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+8"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/ancient-white-dragon.png",
  "url": "/api/2014/monsters/ancient-white-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "ancient-silver-dragon",
  "name": "Drago Argenteo Ancestrale",
  "size": "Colossale",
  "type": "drago",
  "alignment": "legale buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 22
    }
  ],
  "hit_points": 487,
  "hit_dice": "25d20",
  "hit_points_roll": "25d20+225",
  "speed": {
    "camminare": "12 m.",
    "volare": "24 m."
  },
  "strength": 30,
  "dexterity": 10,
  "constitution": 29,
  "intelligence": 18,
  "wisdom": 15,
  "charisma": 23,
  "proficiencies": [
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 16,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 13,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "skill-arcana",
        "name": "Abilità: Arcano",
        "url": "/api/2014/proficiencies/skill-arcana"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "skill-history",
        "name": "Abilità: Storia",
        "url": "/api/2014/proficiencies/skill-history"
      }
    },
    {
      "value": 16,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "freddo"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 26
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 23,
  "proficiency_bonus": 7,
  "xp": 50000,
  "special_abilities": [
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +17 per colpire, portata 4,5 m., un bersaglio. Colpito: 21 (2d10 + 10) danno perforante.",
      "attack_bonus": 17,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+10"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +17 per colpire, portata 3 m., un bersaglio. Colpito: 17 (2d6 + 10) danno tagliente.",
      "attack_bonus": 17,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+10"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +17 per colpire, portata 6 m., un bersaglio. Colpito: 19 (2d8 + 10) danno contundente.",
      "attack_bonus": 17,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+10"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 21 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 21,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio.\nSoffio di Freddo. Il drago esala un getto gelido in un cono di 27 metri. Ogni creatura in quell'area deve effettuare un Tiro Salvezza su Costituzione CD 24, subendo 67 (15d8) danno da freddo se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.\nSoffio Paralizzante. Il drago esala gas paralizzante in un cono di 27 metri. Ogni creatura in quell'area deve superare un Tiro Salvezza su Costituzione CD 24 o essere **paralizzata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio di Freddo",
              "dc": {
                "dc_type": {
                  "index": "con",
                  "name": "COS",
                  "url": "/api/2014/ability-scores/con"
                },
                "dc_value": 24,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "cold",
                    "name": "Freddo",
                    "url": "/api/2014/damage-types/cold"
                  },
                  "damage_dice": "15d8"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio Paralizzante",
              "dc": {
                "dc_type": {
                  "index": "con",
                  "name": "COS",
                  "url": "/api/2014/ability-scores/con"
                },
                "dc_value": 24,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Cambiare Forma",
      "desc": "Il drago si polimorfa magicamente in un umanoide o in una bestia con un Grado di Sfida non superiore al suo, o torna alla sua vera forma. Torna alla sua vera forma se muore. Qualsiasi equipaggiamento che indossa o trasporta viene assorbito o portato dalla nuova forma (a scelta del drago).\nIn una nuova forma, il drago mantiene il suo allineamento, i suoi punti ferita, i Dadi Vita, l'abilità di parlare, le sue competenze, la Resistenza Leggendaria, le azioni di tana e i punteggi di Intelligenza, Saggezza e Carisma, così come questa azione. Le sue statistiche e capacità sono altrimenti sostituite da quelle della nuova forma, ad eccezione di eventuali privilegi di classe o azioni leggendarie di tale forma.",
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 4,5 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 25 o subire 17 (2d6 + 10) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 25,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+10"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/ancient-silver-dragon.png",
  "url": "/api/2014/monsters/ancient-silver-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "ancient-gold-dragon",
  "name": "Drago d'Oro Ancestrale",
  "size": "Colossale",
  "type": "drago",
  "alignment": "legale buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 22
    }
  ],
  "hit_points": 546,
  "hit_dice": "28d20",
  "hit_points_roll": "28d20+252",
  "speed": {
    "camminare": "12 m.",
    "volare": "24 m.",
    "nuotare": "12 m."
  },
  "strength": 30,
  "dexterity": 14,
  "constitution": 29,
  "intelligence": 18,
  "wisdom": 17,
  "charisma": 28,
  "proficiencies": [
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 16,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 16,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "skill-insight",
        "name": "Abilità: Intuizione",
        "url": "/api/2014/proficiencies/skill-insight"
      }
    },
    {
      "value": 17,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 16,
      "proficiency": {
        "index": "skill-persuasion",
        "name": "Abilità: Persuasione",
        "url": "/api/2014/proficiencies/skill-persuasion"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fuoco"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 27
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 24,
  "proficiency_bonus": 7,
  "xp": 62000,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il drago può respirare aria e acqua.",
      "damage": []
    },
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +17 per colpire, portata 4,5 m., un bersaglio. Colpito: 21 (2d10 + 10) danno perforante.",
      "attack_bonus": 17,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+10"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +17 per colpire, portata 3 m., un bersaglio. Colpito: 17 (2d6 + 10) danno tagliente.",
      "attack_bonus": 17,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+10"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +17 per colpire, portata 6 m., un bersaglio. Colpito: 19 (2d8 + 10) danno contundente.",
      "attack_bonus": 17,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+10"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 24 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 24,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio.\nSoffio di Fuoco. Il drago esala fuoco in un cono di 27 metri. Ogni creatura in quell'area deve effettuare un Tiro Salvezza su Destrezza CD 24, subendo 71 (13d10) danno da fuoco se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.\nSoffio Indebolente. Il drago esala gas in un cono di 27 metri. Ogni creatura in quell'area deve superare un Tiro Salvezza su Forza CD 24 o subire **svantaggio** ai tiri per colpire basati sulla Forza, alle prove di Forza e ai Tiri Salvezza su Forza per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio di Fuoco",
              "dc": {
                "dc_type": {
                  "index": "dex",
                  "name": "DES",
                  "url": "/api/2014/ability-scores/dex"
                },
                "dc_value": 24,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "fire",
                    "name": "Fuoco",
                    "url": "/api/2014/damage-types/fire"
                  },
                  "damage_dice": "13d10"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio Indebolente",
              "dc": {
                "dc_type": {
                  "index": "str",
                  "name": "FOR",
                  "url": "/api/2014/ability-scores/str"
                },
                "dc_value": 24,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Cambiare Forma",
      "desc": "Il drago si polimorfa magicamente in un umanoide o in una bestia con un Grado di Sfida non superiore al suo, o torna alla sua vera forma. Torna alla sua vera forma se muore. Qualsiasi equipaggiamento che indossa o trasporta viene assorbito o portato dalla nuova forma (a scelta del drago).\nIn una nuova forma, il drago mantiene il suo allineamento, i suoi punti ferita, i Dadi Vita, l'abilità di parlare, le sue competenze, la Resistenza Leggendaria, le azioni di tana e i punteggi di Intelligenza, Saggezza e Carisma, così come questa azione. Le sue statistiche e capacità sono altrimenti sostituite da quelle della nuova forma, ad eccezione di eventuali privilegi di classe o azioni leggendarie di tale forma.",
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 4,5 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 25 o subire 17 (2d6 + 10) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 25,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+10"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/ancient-gold-dragon.png",
  "url": "/api/2014/monsters/ancient-gold-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "ancient-red-dragon",
  "name": "Drago Rosso Ancestrale",
  "size": "Colossale",
  "type": "drago",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 22
    }
  ],
  "hit_points": 546,
  "hit_dice": "28d20",
  "hit_points_roll": "28d20+252",
  "speed": {
    "camminare": "12 m.",
    "scalare": "12 m.",
    "volare": "24 m."
  },
  "strength": 30,
  "dexterity": 10,
  "constitution": 29,
  "intelligence": 18,
  "wisdom": 15,
  "charisma": 23,
  "proficiencies": [
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 16,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 13,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 16,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fuoco"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 26
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 24,
  "proficiency_bonus": 7,
  "xp": 62000,
  "special_abilities": [
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +17 per colpire, portata 4,5 m., un bersaglio. Colpito: 21 (2d10 + 10) danno perforante più 14 (4d6) danno da fuoco.",
      "attack_bonus": 17,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d10+10"
        },
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "4d6"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +17 per colpire, portata 3 m., un bersaglio. Colpito: 17 (2d6 + 10) danno tagliente.",
      "attack_bonus": 17,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+10"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +17 per colpire, portata 6 m., un bersaglio. Colpito: 19 (2d8 + 10) danno contundente.",
      "attack_bonus": 17,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+10"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 21 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 21,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "name": "Soffio di Fuoco",
      "desc": "Il drago esala fuoco in un cono di 27 metri. Ogni creatura in quell'area deve effettuare un Tiro Salvezza su Destrezza CD 24, subendo 91 (26d6) danno da fuoco se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 24,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "26d6"
        }
      ],
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 4,5 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 25 o subire 17 (2d6 + 10) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 25,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+10"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/ancient-red-dragon.png",
  "url": "/api/2014/monsters/ancient-red-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "ancient-copper-dragon",
  "name": "Drago di Rame Ancestrale",
  "size": "Colossale",
  "type": "drago",
  "alignment": "caotico buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 21
    }
  ],
  "hit_points": 350,
  "hit_dice": "20d20",
  "hit_points_roll": "20d20+140",
  "speed": {
    "camminare": "12 m.",
    "scalare": "12 m.",
    "volare": "24 m."
  },
  "strength": 27,
  "dexterity": 12,
  "constitution": 25,
  "intelligence": 20,
  "wisdom": 17,
  "charisma": 19,
  "proficiencies": [
    {
      "value": 8,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 14,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "skill-deception",
        "name": "Abilità: Inganno",
        "url": "/api/2014/proficiencies/skill-deception"
      }
    },
    {
      "value": 17,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "acido"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 27
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 21,
  "proficiency_bonus": 7,
  "xp": 33000,
  "special_abilities": [
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +15 per colpire, portata 4,5 m., un bersaglio. Colpito: 19 (2d10 + 8) danno perforante.",
      "attack_bonus": 15,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +15 per colpire, portata 3 m., un bersaglio. Colpito: 15 (2d6 + 8) danno tagliente.",
      "attack_bonus": 15,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +15 per colpire, portata 6 m., un bersaglio. Colpito: 17 (2d8 + 8) danno contundente.",
      "attack_bonus": 15,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+8"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 19 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 19,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio.\nSoffio Acido. Il drago esala acido in una linea di 27 metri, larga 3 metri. Ogni creatura in quella linea deve effettuare un Tiro Salvezza su Destrezza CD 22, subendo 63 (14d8) danno da acido se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.\nSoffio Rallentante. Il drago esala gas in un cono di 27 metri. Ogni creatura in quell'area deve superare un Tiro Salvezza su Costituzione CD 22. In caso di fallimento, la creatura non può usare reazioni, la sua velocità è dimezzata e non può effettuare più di un attacco nel suo turno. Inoltre, la creatura può usare o un'azione o un'azione bonus nel suo turno, ma non entrambe. Questi effetti durano 1 minuto. La creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé con un tiro salvezza riuscito.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio Acido",
              "dc": {
                "dc_type": {
                  "index": "dex",
                  "name": "DES",
                  "url": "/api/2014/ability-scores/dex"
                },
                "dc_value": 22,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "acid",
                    "name": "Acido",
                    "url": "/api/2014/damage-types/acid"
                  },
                  "damage_dice": "14d8"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio Rallentante",
              "dc": {
                "dc_type": {
                  "index": "con",
                  "name": "COS",
                  "url": "/api/2014/ability-scores/con"
                },
                "dc_value": 22,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Cambiare Forma",
      "desc": "Il drago si polimorfa magicamente in un umanoide o in una bestia con un Grado di Sfida non superiore al suo, o torna alla sua vera forma. Torna alla sua vera forma se muore. Qualsiasi equipaggiamento che indossa o trasporta viene assorbito o portato dalla nuova forma (a scelta del drago). In una nuova forma, il drago mantiene il suo allineamento, i suoi punti ferita, i Dadi Vita, l'abilità di parlare, le sue competenze, la Resistenza Leggendaria, le azioni di tana e i punteggi di Intelligenza, Saggezza e Carisma, così come questa azione. Le sue statistiche e capacità sono altrimenti sostituite da quelle della nuova forma, ad eccezione di eventuali privilegi di classe o azioni leggendarie di tale forma.",
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 4,5 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 23 o subire 15 (2d6 + 8) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 23,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+8"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/ancient-copper-dragon.png",
  "url": "/api/2014/monsters/ancient-copper-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "ancient-bronze-dragon",
  "name": "Drago di Bronzo Ancestrale",
  "size": "Colossale",
  "type": "drago",
  "alignment": "legale buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 22
    }
  ],
  "hit_points": 444,
  "hit_dice": "24d20",
  "hit_points_roll": "24d20+192",
  "speed": {
    "camminare": "12 m.",
    "volare": "24 m.",
    "nuotare": "12 m."
  },
  "strength": 29,
  "dexterity": 10,
  "constitution": 27,
  "intelligence": 18,
  "wisdom": 17,
  "charisma": 21,
  "proficiencies": [
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 15,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 12,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "skill-insight",
        "name": "Abilità: Intuizione",
        "url": "/api/2014/proficiencies/skill-insight"
      }
    },
    {
      "value": 17,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fulmine"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 27
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 22,
  "proficiency_bonus": 7,
  "xp": 41000,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il drago può respirare aria e acqua.",
      "damage": []
    },
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +16 per colpire, portata 4,5 m., un bersaglio. Colpito: 20 (2d10 + 9) danno perforante.",
      "attack_bonus": 16,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+9"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +16 per colpire, portata 3 m., un bersaglio. Colpito: 16 (2d6 + 9) danno tagliente.",
      "attack_bonus": 16,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+9"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +16 per colpire, portata 6 m., un bersaglio. Colpito: 18 (2d8 + 9) danno contundente.",
      "attack_bonus": 16,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+9"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 20 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 20,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio.\nSoffio di Fulmine. Il drago esala fulmini in una linea di 36 metri, larga 3 metri. Ogni creatura in quella linea deve effettuare un Tiro Salvezza su Destrezza CD 23, subendo 88 (16d10) danno da fulmine se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.\nSoffio di Repulsione. Il drago esala energia di repulsione in un cono di 9 metri. Ogni creatura in quell'area deve superare un Tiro Salvezza su Forza CD 23. In caso di fallimento, la creatura viene spinta a 18 metri di distanza dal drago.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio di Fulmine",
              "dc": {
                "dc_type": {
                  "index": "dex",
                  "name": "DES",
                  "url": "/api/2014/ability-scores/dex"
                },
                "dc_value": 23,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "lightning",
                    "name": "Fulmine",
                    "url": "/api/2014/damage-types/lightning"
                  },
                  "damage_dice": "16d10"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio di Repulsione",
              "dc": {
                "dc_type": {
                  "index": "str",
                  "name": "FOR",
                  "url": "/api/2014/ability-scores/str"
                },
                "dc_value": 23,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Cambiare Forma",
      "desc": "Il drago si polimorfa magicamente in un umanoide o in una bestia con un Grado di Sfida non superiore al suo, o torna alla sua vera forma. Torna alla sua vera forma se muore. Qualsiasi equipaggiamento che indossa o trasporta viene assorbito o portato dalla nuova forma (a scelta del drago). In una nuova forma, il drago mantiene il suo allineamento, i suoi punti ferita, i Dadi Vita, l'abilità di parlare, le sue competenze, la Resistenza Leggendaria, le azioni di tana e i punteggi di Intelligenza, Saggezza e Carisma, così come questa azione. Le sue statistiche e capacità sono altrimenti sostituite da quelle della nuova forma, ad eccezione di eventuali privilegi di classe o azioni leggendarie di tale forma.",
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 4,5 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 24 o subire 16 (2d6 + 9) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 24,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+9"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/ancient-bronze-dragon.png",
  "url": "/api/2014/monsters/ancient-bronze-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "ancient-green-dragon",
  "name": "Drago Verde Ancestrale",
  "size": "Colossale",
  "type": "drago",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 21
    }
  ],
  "hit_points": 385,
  "hit_dice": "22d20",
  "hit_points_roll": "22d20+154",
  "speed": {
    "camminare": "12 m.",
    "volare": "24 m.",
    "nuotare": "12 m."
  },
  "strength": 27,
  "dexterity": 12,
  "constitution": 25,
  "intelligence": 20,
  "wisdom": 17,
  "charisma": 19,
  "proficiencies": [
    {
      "value": 8,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 14,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "skill-deception",
        "name": "Abilità: Inganno",
        "url": "/api/2014/proficiencies/skill-deception"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "skill-insight",
        "name": "Abilità: Intuizione",
        "url": "/api/2014/proficiencies/skill-insight"
      }
    },
    {
      "value": 17,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "skill-persuasion",
        "name": "Abilità: Persuasione",
        "url": "/api/2014/proficiencies/skill-persuasion"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "poisoned",
      "name": "Avvelenato",
      "url": "/api/2014/conditions/poisoned"
    }
  ],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 27
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 22,
  "proficiency_bonus": 7,
  "xp": 41000,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il drago può respirare aria e acqua.",
      "damage": []
    },
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +15 per colpire, portata 4,5 m., un bersaglio. Colpito: 19 (2d10 + 8) danno perforante più 10 (3d6) danno da veleno.",
      "attack_bonus": 15,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+8"
        },
        {
          "damage_type": {
            "index": "poison",
            "name": "Veleno",
            "url": "/api/2014/damage-types/poison"
          },
          "damage_dice": "3d6"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +15 per colpire, portata 3 m., un bersaglio. Colpito: 22 (4d6 + 8) danno tagliente.",
      "attack_bonus": 15,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "4d6+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +15 per colpire, portata 6 m., un bersaglio. Colpito: 17 (2d8 + 8) danno contundente.",
      "attack_bonus": 15,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+8"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 19 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 19,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "name": "Soffio Velenoso",
      "desc": "Il drago esala gas velenoso in un cono di 27 metri. Ogni creatura in quell'area deve effettuare un Tiro Salvezza su Costituzione CD 22, subendo 77 (22d6) danno da veleno se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "con",
          "name": "COS",
          "url": "/api/2014/ability-scores/con"
        },
        "dc_value": 22,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "poison",
            "name": "Veleno",
            "url": "/api/2014/damage-types/poison"
          },
          "damage_dice": "22d6"
        }
      ],
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 4,5 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 23 o subire 15 (2d6 + 8) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 23,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+8"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/ancient-green-dragon.png",
  "url": "/api/2014/monsters/ancient-green-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "ancient-brass-dragon",
  "name": "Drago d'Ottone Ancestrale",
  "size": "Colossale",
  "type": "drago",
  "alignment": "caotico buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 20
    }
  ],
  "hit_points": 297,
  "hit_dice": "17d20",
  "hit_points_roll": "17d20+119",
  "speed": {
    "camminare": "12 m.",
    "scavare": "12 m.",
    "volare": "24 m."
  },
  "strength": 27,
  "dexterity": 10,
  "constitution": 25,
  "intelligence": 16,
  "wisdom": 15,
  "charisma": 19,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 13,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "skill-history",
        "name": "Abilità: Storia",
        "url": "/api/2014/proficiencies/skill-history"
      }
    },
    {
      "value": 14,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "skill-persuasion",
        "name": "Abilità: Persuasione",
        "url": "/api/2014/proficiencies/skill-persuasion"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fuoco"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 24
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 20,
  "proficiency_bonus": 6,
  "xp": 25000,
  "special_abilities": [
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 4,5 m., un bersaglio. Colpito: 19 (2d10 + 8) danno perforante.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 3 m., un bersaglio. Colpito: 15 (2d6 + 8) danno tagliente.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 6 m., un bersaglio. Colpito: 17 (2d8 + 8) danno contundente.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+8"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 18 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 18,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio:\nSoffio di Fuoco. Il drago esala fuoco in una linea di 27 metri, larga 3 metri. Ogni creatura in quella linea deve effettuare un Tiro Salvezza su Destrezza CD 21, subendo 56 (16d6) danno da fuoco se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.\nSoffio del Sonno. Il drago esala gas soporifero in un cono di 27 metri. Ogni creatura in quell'area deve superare un Tiro Salvezza su Costituzione CD 21 o cade **priva di sensi** per 10 minuti. Questo effetto termina per una creatura se essa subisce danno o se qualcuno usa un'azione per svegliarla.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio di Fuoco",
              "dc": {
                "dc_type": {
                  "index": "dex",
                  "name": "DES",
                  "url": "/api/2014/ability-scores/dex"
                },
                "dc_value": 21,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "fire",
                    "name": "Fuoco",
                    "url": "/api/2014/damage-types/fire"
                  },
                  "damage_dice": "16d6"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio del Sonno",
              "dc": {
                "dc_type": {
                  "index": "con",
                  "name": "COS",
                  "url": "/api/2014/ability-scores/con"
                },
                "dc_value": 21,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Cambiare Forma",
      "desc": "Il drago si polimorfa magicamente in un umanoide o in una bestia con un Grado di Sfida non superiore al suo, o torna alla sua vera forma. Torna alla sua vera forma se muore. Qualsiasi equipaggiamento che indossa o trasporta viene assorbito o portato dalla nuova forma (a scelta del drago).\nIn una nuova forma, il drago mantiene il suo allineamento, i suoi punti ferita, i Dadi Vita, l'abilità di parlare, le sue competenze, la Resistenza Leggendaria, le azioni di tana e i punteggi di Intelligenza, Saggezza e Carisma, così come questa azione. Le sue statistiche e capacità sono altrimenti sostituite da quelle della nuova forma, ad eccezione di eventuali privilegi di classe o azioni leggendarie di tale forma.",
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 4,5 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 22 o subire 15 (2d6 + 8) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 22,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+8"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/ancient-brass-dragon.png",
  "url": "/api/2014/monsters/ancient-brass-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "ancient-blue-dragon",
  "name": "Drago Blu Ancestrale",
  "size": "Colossale",
  "type": "drago",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 22
    }
  ],
  "hit_points": 481,
  "hit_dice": "26d20",
  "hit_points_roll": "26d20+208",
  "speed": {
    "camminare": "12 m.",
    "scavare": "12 m.",
    "volare": "24 m."
  },
  "strength": 29,
  "dexterity": 10,
  "constitution": 27,
  "intelligence": 18,
  "wisdom": 17,
  "charisma": 21,
  "proficiencies": [
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 15,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 12,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 17,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "elettricità"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 27
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 23,
  "proficiency_bonus": 7,
  "xp": 50000,
  "special_abilities": [
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +16 per colpire, portata 4,5 m., un bersaglio. Colpito: 20 (2d10 + 9) danno perforante più 11 (2d10) danno da elettricità.",
      "attack_bonus": 16,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+9"
        },
        {
          "damage_type": {
            "index": "lightning",
            "name": "Elettricità",
            "url": "/api/2014/damage-types/lightning"
          },
          "damage_dice": "2d10"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +16 per colpire, portata 3 m., un bersaglio. Colpito: 16 (2d6 + 9) danno tagliente.",
      "attack_bonus": 16,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+9"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +16 per colpire, portata 6 m., un bersaglio. Colpito: 18 (2d8 + 9) danno contundente.",
      "attack_bonus": 16,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+9"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 20 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 20,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "name": "Soffio Elettrico",
      "desc": "Il drago esala elettricità in una linea di 36 metri, larga 3 metri. Ogni creatura in quella linea deve effettuare un Tiro Salvezza su Destrezza CD 23, subendo 88 (16d10) danno da elettricità se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 23,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "lightning",
            "name": "Elettricità",
            "url": "/api/2014/damage-types/lightning"
          },
          "damage_dice": "16d10"
        }
      ],
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 4,5 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 24 o subire 16 (2d6 + 9) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 24,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+9"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/ancient-blue-dragon.png",
  "url": "/api/2014/monsters/ancient-blue-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "ancient-black-dragon",
  "name": "Drago Nero Ancestrale",
  "size": "Colossale",
  "type": "drago",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 22
    }
  ],
  "hit_points": 367,
  "hit_dice": "21d20",
  "hit_points_roll": "21d20+147",
  "speed": {
    "camminare": "12 m.",
    "volare": "24 m.",
    "nuotare": "12 m."
  },
  "strength": 27,
  "dexterity": 14,
  "constitution": 25,
  "intelligence": 16,
  "wisdom": 15,
  "charisma": 19,
  "proficiencies": [
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 14,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 16,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "acido"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_cieca": "18 m.",
    "scurovisione": "36 m.",
    "Percezione passiva": 26
  },
  "languages": "Comune, Draconico",
  "challenge_rating": 21,
  "proficiency_bonus": 7,
  "xp": 33000,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il drago può respirare aria e acqua.",
      "damage": []
    },
    {
      "name": "Resistenza Leggendaria",
      "desc": "Se il drago fallisce un tiro salvezza, può invece scegliere di avere successo.",
      "usage": {
        "type": "al giorno",
        "times": 3,
        "rest_types": []
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il drago può usare la sua Presenza Terrificante. Effettua quindi tre attacchi: uno con il morso e due con gli artigli.",
      "actions": [
        {
          "action_name": "Presenza Terrificante",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +15 per colpire, portata 4,5 m., un bersaglio. Colpito: 19 (2d10 + 8) danno perforante più 9 (2d8) danno da acido.",
      "attack_bonus": 15,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d10+8"
        },
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "2d8"
        }
      ],
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +15 per colpire, portata 3 m., un bersaglio. Colpito: 15 (2d6 + 8) danno tagliente.",
      "attack_bonus": 15,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +15 per colpire, portata 6 m., un bersaglio. Colpito: 17 (2d8 + 8) danno contundente.",
      "attack_bonus": 15,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+8"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Presenza Terrificante",
      "desc": "Ogni creatura a scelta del drago che si trovi entro 36 metri dal drago e ne sia consapevole deve superare un Tiro Salvezza su Saggezza CD 19 o diviene **spaventata** per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo. Se il tiro salvezza di una creatura ha successo o l'effetto termina per essa, la creatura è immune alla Presenza Terrificante del drago per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 19,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "name": "Soffio Acido",
      "desc": "Il drago esala acido in una linea di 27 metri, larga 3 metri. Ogni creatura in quella linea deve effettuare un Tiro Salvezza su Destrezza CD 22, subendo 67 (15d8) danno da acido se fallisce il tiro salvezza, o la metà di questo danno se lo riesce.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 22,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "15d8"
        }
      ],
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Individuare",
      "desc": "Il drago effettua una prova di Saggezza (Percezione).",
      "damage": []
    },
    {
      "name": "Attacco di Coda",
      "desc": "Il drago effettua un attacco di coda.",
      "damage": []
    },
    {
      "name": "Attacco d'Ala (Costo: 2 Azioni)",
      "desc": "Il drago sbatte le ali. Ogni creatura entro 4,5 metri dal drago deve superare un Tiro Salvezza su Destrezza CD 23 o subire 15 (2d6 + 8) danno contundente ed essere **buttato prono**. Il drago può quindi volare fino a metà della sua velocità di volo.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 23,
        "success_type": "none"
      },
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+8"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/ancient-black-dragon.png",
  "url": "/api/2014/monsters/ancient-black-dragon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "air-elemental",
  "name": "Elementale dell'Aria",
  "size": "Grande",
  "type": "elementale",
  "alignment": "neutrale",
  "armor_class": [
    {
      "type": "DES",
      "value": 15
    }
  ],
  "hit_points": 90,
  "hit_dice": "12d10",
  "hit_points_roll": "12d10+24",
  "speed": {
    "volare": "27 m.",
    "fluttuare": true
  },
  "strength": 14,
  "dexterity": 20,
  "constitution": 14,
  "intelligence": 6,
  "wisdom": 10,
  "charisma": 6,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "elettricità",
    "tuono",
    "contundente, perforante e tagliente da armi non magiche"
  ],
  "damage_immunities": [
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "exhaustion",
      "name": "Esaurimento",
      "url": "/api/2014/conditions/exhaustion"
    },
    {
      "index": "grappled",
      "name": "Afferrato",
      "url": "/api/2014/conditions/grappled"
    },
    {
      "index": "paralyzed",
      "name": "Paralizzato",
      "url": "/api/2014/conditions/paralyzed"
    },
    {
      "index": "petrified",
      "name": "Pietrificato",
      "url": "/api/2014/conditions/petrified"
    },
    {
      "index": "poisoned",
      "name": "Avvelenato",
      "url": "/api/2014/conditions/poisoned"
    },
    {
      "index": "prone",
      "name": "Prono",
      "url": "/api/2014/conditions/prone"
    },
    {
      "index": "restrained",
      "name": "Immobilizzato",
      "url": "/api/2014/conditions/restrained"
    },
    {
      "index": "unconscious",
      "name": "Privo di Sensi",
      "url": "/api/2014/conditions/unconscious"
    }
  ],
  "senses": {
    "scurovisione": "18 m.",
    "Percezione passiva": 10
  },
  "languages": "Auran",
  "challenge_rating": 5,
  "proficiency_bonus": 3,
  "xp": 1800,
  "special_abilities": [
    {
      "name": "Forma d'Aria",
      "desc": "L'elementale può entrare nello spazio di una creatura ostile e fermarsi lì. Può muoversi attraverso uno spazio stretto fino a 2,5 cm di larghezza senza doversi stringere.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "L'elementale effettua due attacchi Schianto.",
      "actions": [
        {
          "action_name": "Schianto",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Schianto",
      "desc": "Attacco con Arma da Mischia: +8 per colpire, portata 1,5 m., un bersaglio. Colpito: 14 (2d8 + 5) danno contundente.",
      "attack_bonus": 8,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d8+5"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Tromba d'Aria",
      "desc": "Ogni creatura nello spazio dell'elementale deve effettuare un Tiro Salvezza su Forza CD 13. Se fallisce, il bersaglio subisce 15 (3d8 + 2) danno contundente e viene scagliato fino a 6 metri di distanza dall'elementale in una direzione casuale ed è **buttato prono**. Se un bersaglio scagliato colpisce un oggetto, come un muro o il pavimento, subisce 3 (1d6) danno contundente per ogni 3 metri che è stato scagliato. Se il bersaglio viene scagliato contro un'altra creatura, quest'ultima deve superare un Tiro Salvezza su Destrezza CD 13 o subisce lo stesso danno ed è **buttata prona**.\nSe il tiro salvezza ha successo, il bersaglio subisce metà del danno contundente e non viene scagliato via né **buttato prono**.",
      "usage": {
        "type": "ricarica_su_tiro",
        "dice": "1d6",
        "min_value": 4
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/air-elemental.png",
  "url": "/api/2014/monsters/air-elemental",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "androsphinx",
  "name": "Androsfinge",
  "size": "Grande",
  "type": "mostruosità",
  "alignment": "legale neutrale",
  "armor_class": [
    {
      "type": "naturale",
      "value": 17
    }
  ],
  "hit_points": 199,
  "hit_dice": "19d10",
  "hit_points_roll": "19d10+95",
  "speed": {
    "camminare": "12 m.",
    "volare": "18 m."
  },
  "strength": 22,
  "dexterity": 10,
  "constitution": 20,
  "intelligence": 16,
  "wisdom": 18,
  "charisma": 23,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-int",
        "name": "Tiro Salvezza: INT",
        "url": "/api/2014/proficiencies/saving-throw-int"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "skill-arcana",
        "name": "Abilità: Arcano",
        "url": "/api/2014/proficiencies/skill-arcana"
      }
    },
    {
      "value": 10,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 15,
      "proficiency": {
        "index": "skill-religion",
        "name": "Abilità: Religione",
        "url": "/api/2014/proficiencies/skill-religion"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "psichico",
    "contundente, perforante e tagliente da armi non magiche"
  ],
  "condition_immunities": [
    {
      "index": "charmed",
      "name": "Affascinato",
      "url": "/api/2014/conditions/charmed"
    },
    {
      "index": "frightened",
      "name": "Spaventato",
      "url": "/api/2014/conditions/frightened"
    }
  ],
  "senses": {
    "visione_pura": "36 m.",
    "Percezione passiva": 20
  },
  "languages": "Comune, Sfinge",
  "challenge_rating": 17,
  "proficiency_bonus": 6,
  "xp": 18000,
  "special_abilities": [
    {
      "name": "Imperscrutabile",
      "desc": "La sfinge è immune a qualsiasi effetto che tenti di percepire le sue emozioni o leggere i suoi pensieri, così come a qualsiasi incantesimo di divinazione che essa rifiuti. Le prove di Saggezza (Intuizione) fatte per accertare le intenzioni o la sincerità della sfinge sono effettuate con svantaggio.",
      "damage": []
    },
    {
      "name": "Armi Magiche",
      "desc": "Gli attacchi con arma della sfinge sono magici.",
      "damage": []
    },
    {
      "name": "Incantesimi",
      "desc": "La sfinge è un incantatore di 12° livello. La sua capacità di incantare è Saggezza (CD tiro salvezza dell'incantesimo 18, +10 per colpire con attacchi di incantesimo). Non richiede componenti materiali per lanciare i suoi incantesimi. La sfinge ha i seguenti incantesimi da chierico preparati:\n\n- Trucchetti (a volontà): Fiamma Sacra, Curare Ferite Minori, Taumaturgia\n- 1° livello (4 slot): Comando, Individuazione del Bene e del Male, Individuazione del Magico\n- 2° livello (3 slot): Ristorare Inferiore, Zona di Verità\n- 3° livello (3 slot): Dissolvi Magie, Linguaggi\n- 4° livello (3 slot): Bando, Libertà di Movimento\n- 5° livello (2 slot): Colpo Infuocato, Ristorare Superiore\n- 6° livello (1 slot): Banchetto degli Eroi",
      "spellcasting": {
        "level": 12,
        "ability": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc": 18,
        "modifier": 10,
        "components_required": [
          "V",
          "S"
        ],
        "school": "cleric",
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1
        },
        "spells": [
          {
            "name": "Fiamma Sacra",
            "level": 0,
            "url": "/api/2014/spells/sacred-flame"
          },
          {
            "name": "Curare Ferite Minori",
            "level": 0,
            "url": "/api/2014/spells/spare-the-dying"
          },
          {
            "name": "Taumaturgia",
            "level": 0,
            "url": "/api/2014/spells/thaumaturgy"
          },
          {
            "name": "Comando",
            "level": 1,
            "url": "/api/2014/spells/command"
          },
          {
            "name": "Individuazione del Bene e del Male",
            "level": 1,
            "url": "/api/2014/spells/detect-evil-and-good"
          },
          {
            "name": "Individuazione del Magico",
            "level": 1,
            "url": "/api/2014/spells/detect-magic"
          },
          {
            "name": "Ristorare Inferiore",
            "level": 2,
            "url": "/api/2014/spells/lesser-restoration"
          },
          {
            "name": "Zona di Verità",
            "level": 2,
            "url": "/api/2014/spells/zone-of-truth"
          },
          {
            "name": "Dissolvi Magie",
            "level": 3,
            "url": "/api/2014/spells/dispel-magic"
          },
          {
            "name": "Linguaggi",
            "level": 3,
            "url": "/api/2014/spells/tongues"
          },
          {
            "name": "Bando",
            "level": 4,
            "url": "/api/2014/spells/banishment"
          },
          {
            "name": "Libertà di Movimento",
            "level": 4,
            "url": "/api/2014/spells/freedom-of-movement"
          },
          {
            "name": "Colpo Infuocato",
            "level": 5,
            "url": "/api/2014/spells/flame-strike"
          },
          {
            "name": "Ristorare Superiore",
            "level": 5,
            "url": "/api/2014/spells/greater-restoration"
          },
          {
            "name": "Banchetto degli Eroi",
            "level": 6,
            "url": "/api/2014/spells/heroes-feast"
          }
        ]
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "La sfinge effettua due attacchi con gli artigli.",
      "actions": [
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +12 per colpire, portata 1,5 m., un bersaglio. Colpito: 17 (2d10 + 6) danno tagliente.",
      "attack_bonus": 12,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d10+6"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Ruggito",
      "desc": "La sfinge emette un ruggito magico. Ogni volta che ruggisce prima di terminare un riposo lungo, il ruggito è più forte e l'effetto è diverso, come descritto di seguito. Ogni creatura entro 150 metri dalla sfinge e in grado di sentire il ruggito deve effettuare un tiro salvezza.\n\nPrimo Ruggito. Ogni creatura che fallisce un Tiro Salvezza su Saggezza CD 18 è **spaventata** per 1 minuto. Una creatura spaventata può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo.\n\nSecondo Ruggito. Ogni creatura che fallisce un Tiro Salvezza su Saggezza CD 18 è **assordata** e **spaventata** per 1 minuto. Una creatura spaventata è **paralizzata** e può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su di sé in caso di successo.\n\nTerzo Ruggito. Ogni creatura effettua un Tiro Salvezza su Costituzione CD 18. Se fallisce il tiro salvezza, una creatura subisce 44 (8d10) danno da tuono ed è **buttata prona**. Se riesce il tiro salvezza, la creatura subisce metà di questo danno e non è **buttata prona**.",
      "usage": {
        "type": "al giorno",
        "times": 3
      },
      "attacks": [
        {
          "name": "Primo Ruggito",
          "dc": {
            "dc_type": {
              "index": "wis",
              "name": "SAG",
              "url": "/api/2014/ability-scores/wis"
            },
            "dc_value": 18,
            "success_type": "none"
          }
        },
        {
          "name": "Secondo Ruggito",
          "dc": {
            "dc_type": {
              "index": "wis",
              "name": "SAG",
              "url": "/api/2014/ability-scores/wis"
            },
            "dc_value": 18,
            "success_type": "none"
          }
        },
        {
          "name": "Terzo Ruggito",
          "dc": {
            "dc_type": {
              "index": "con",
              "name": "COS",
              "url": "/api/2014/ability-scores/con"
            },
            "dc_value": 18,
            "success_type": "half"
          },
          "damage": [
            {
              "damage_type": {
                "index": "thunder",
                "name": "Tuono",
                "url": "/api/2014/damage-types/thunder"
              },
              "damage_dice": "8d10"
            }
          ]
        }
      ],
      "actions": []
    }
  ],
  "legendary_actions": [
    {
      "name": "Attacco di Artiglio",
      "desc": "La sfinge effettua un attacco con l'artiglio.",
      "damage": []
    },
    {
      "name": "Teletrasporto (Costo: 2 Azioni)",
      "desc": "La sfinge si teletrasporta magicamente, insieme a qualsiasi equipaggiamento indossi o porti, fino a 36 metri in uno spazio non occupato che può vedere.",
      "damage": []
    },
    {
      "name": "Lanciare un Incantesimo (Costo: 3 Azioni)",
      "desc": "La sfinge lancia un incantesimo dalla sua lista di incantesimi preparati, usando normalmente uno slot incantesimo.",
      "damage": []
    }
  ],
  "image": "/api/images/monsters/androsphinx.png",
  "url": "/api/2014/monsters/androsphinx",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "reactions": []
},
{
  "index": "animated-armor",
  "name": "Armatura Animata",
  "size": "Media",
  "type": "costrutto",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 18
    }
  ],
  "hit_points": 33,
  "hit_dice": "6d8",
  "hit_points_roll": "6d8+6",
  "speed": {
    "camminare": "7,5 m."
  },
  "strength": 14,
  "dexterity": 11,
  "constitution": 13,
  "intelligence": 1,
  "wisdom": 3,
  "charisma": 1,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "veleno",
    "psichico"
  ],
  "condition_immunities": [
    {
      "index": "blinded",
      "name": "Accecato",
      "url": "/api/2014/conditions/blinded"
    },
    {
      "index": "charmed",
      "name": "Affascinato",
      "url": "/api/2014/conditions/charmed"
    },
    {
      "index": "deafened",
      "name": "Assordato",
      "url": "/api/2014/conditions/deafened"
    },
    {
      "index": "exhaustion",
      "name": "Esaurimento",
      "url": "/api/2014/conditions/exhaustion"
    },
    {
      "index": "frightened",
      "name": "Spaventato",
      "url": "/api/2014/conditions/frightened"
    },
    {
      "index": "paralyzed",
      "name": "Paralizzato",
      "url": "/api/2014/conditions/paralyzed"
    },
    {
      "index": "petrified",
      "name": "Pietrificato",
      "url": "/api/2014/conditions/petrified"
    },
    {
      "index": "poisoned",
      "name": "Avvelenato",
      "url": "/api/2014/conditions/poisoned"
    }
  ],
  "senses": {
    "vista_cieca": "18 m. (cieco oltre questo raggio)",
    "Percezione passiva": 6
  },
  "languages": "",
  "challenge_rating": 1,
  "proficiency_bonus": 2,
  "xp": 200,
  "special_abilities": [
    {
      "name": "Suscettibilità all'Antimagia",
      "desc": "L'armatura è incapacitata mentre si trova nell'area di un campo antimagia. Se è bersaglio di *dissolvi magie*, l'armatura deve superare un tiro salvezza su Costituzione contro la CD del tiro salvezza dell'incantesimo dell'incantatore o cade **priva di sensi** per 1 minuto.",
      "damage": []
    },
    {
      "name": "Falsa Apparenza",
      "desc": "Finché l'armatura rimane immobile, è indistinguibile da una normale armatura completa.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "L'armatura effettua due attacchi in mischia.",
      "actions": [
        {
          "action_name": "Schianto",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Schianto",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 5 (1d6 + 2) danno contundente.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "1d6+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/animated-armor.png",
  "url": "/api/2014/monsters/animated-armor",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "ankheg",
  "name": "Ankheg",
  "size": "Grande",
  "type": "mostruosità",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 14
    },
    {
      "type": "condizione",
      "value": 11,
      "condition": {
        "index": "prone",
        "name": "Prono",
        "url": "/api/2014/conditions/prone"
      }
    }
  ],
  "hit_points": 39,
  "hit_dice": "6d10",
  "hit_points_roll": "6d10+6",
  "speed": {
    "camminare": "9 m.",
    "scavare": "3 m."
  },
  "strength": 17,
  "dexterity": 11,
  "constitution": 13,
  "intelligence": 1,
  "wisdom": 13,
  "charisma": 6,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_tellurica": "18 m.",
    "Percezione passiva": 11
  },
  "languages": "",
  "challenge_rating": 2,
  "proficiency_bonus": 2,
  "xp": 250,
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 10 (2d6 + 3) danno tagliente più 3 (1d6) danno da acido. Se il bersaglio è una creatura Grande o inferiore, è **afferrato** (CD per sfuggire 13). Fino a quando questa condizione di afferrare non termina, l'ankheg può mordere solo la creatura afferrata e ha vantaggio ai tiri per colpire per farlo.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+3"
        },
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "1d6"
        }
      ],
      "actions": []
    },
    {
      "name": "Spruzzo Acido",
      "desc": "L'ankheg sputa acido in una linea lunga 9 m. e larga 1,5 m., a patto che non abbia creature afferrate. Ogni creatura in quella linea deve effettuare un Tiro Salvezza su Destrezza CD 13, subendo 10 (3d6) danno da acido se fallisce il tiro salvezza, o metà di quel danno se lo supera.",
      "usage": {
        "type": "ricarica su tiro",
        "dice": "1d6",
        "min_value": 6
      },
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 13,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "3d6"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/ankheg.png",
  "url": "/api/2014/monsters/ankheg",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "ape",
  "name": "Scimmia",
  "size": "Media",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "DES",
      "value": 12
    }
  ],
  "hit_points": 19,
  "hit_dice": "3d8",
  "hit_points_roll": "3d8+6",
  "speed": {
    "camminare": "9 m.",
    "scalare": "9 m."
  },
  "strength": 16,
  "dexterity": 14,
  "constitution": 14,
  "intelligence": 6,
  "wisdom": 12,
  "charisma": 7,
  "proficiencies": [
    {
      "value": 5,
      "proficiency": {
        "index": "skill-athletics",
        "name": "Abilità: Atletica",
        "url": "/api/2014/proficiencies/skill-athletics"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "Percezione passiva": 13
  },
  "languages": "",
  "challenge_rating": 0.5,
  "proficiency_bonus": 2,
  "xp": 100,
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "La scimmia effettua due attacchi con il pugno.",
      "actions": [
        {
          "action_name": "Pugno",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Pugno",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 6 (1d6 + 3) danno contundente.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "1d6+3"
        }
      ],
      "actions": []
    },
    {
      "name": "Sasso",
      "desc": "Attacco con Arma a Distanza: +5 per colpire, gittata 7,5/15 m., un bersaglio. Colpito: 6 (1d6 + 3) danno contundente.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "1d6+3"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/ape.png",
  "url": "/api/2014/monsters/ape",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "archmage",
  "name": "Arcimago",
  "desc": "Gli arcimaghi sono incantatori potenti (e di solito piuttosto anziani) dedicati allo studio delle arti arcane. Quelli benevoli consigliano re e regine, mentre quelli malvagi governano come tiranni e perseguono il lichdom. Quelli che non sono né buoni né malvagi si isolano in torri remote per praticare la loro magia senza interruzioni.\n\nUn arcimago ha tipicamente uno o più apprendisti maghi, e la dimora di un arcimago ha numerosi incantesimi di protezione e guardiani magici per scoraggiare gli intrusi.",
  "size": "Media",
  "type": "umanoide",
  "subtype": "qualsiasi razza",
  "alignment": "qualsiasi allineamento",
  "armor_class": [
    {
      "type": "DES",
      "value": 12
    },
    {
      "type": "incantesimo",
      "value": 15,
      "spell": {
        "index": "mage-armor",
        "name": "Armatura Magica",
        "url": "/api/2014/spells/mage-armor"
      }
    }
  ],
  "hit_points": 99,
  "hit_dice": "18d8",
  "hit_points_roll": "18d8+18",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 10,
  "dexterity": 14,
  "constitution": 12,
  "intelligence": 20,
  "wisdom": 15,
  "charisma": 16,
  "proficiencies": [
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-int",
        "name": "Tiro Salvezza: INT",
        "url": "/api/2014/proficiencies/saving-throw-int"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 13,
      "proficiency": {
        "index": "skill-arcana",
        "name": "Abilità: Arcano",
        "url": "/api/2014/proficiencies/skill-arcana"
      }
    },
    {
      "value": 13,
      "proficiency": {
        "index": "skill-history",
        "name": "Abilità: Storia",
        "url": "/api/2014/proficiencies/skill-history"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "danno da incantesimi",
    "contundente, perforante e tagliente da attacchi non magici (da *pelle di pietra*)"
  ],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "Percezione passiva": 12
  },
  "languages": "qualsiasi sei linguaggi",
  "challenge_rating": 12,
  "proficiency_bonus": 4,
  "xp": 8400,
  "special_abilities": [
    {
      "name": "Resistenza Magica",
      "desc": "L'arcimago ha vantaggio ai tiri salvezza contro incantesimi e altri effetti magici.",
      "damage": []
    },
    {
      "name": "Incantesimi",
      "desc": "L'arcimago è un incantatore di 18° livello. La sua capacità di incantare è Intelligenza (CD tiro salvezza dell'incantesimo 17, +9 per colpire con attacchi di incantesimo). L'arcimago può lanciare *camuffare sé stesso* e *invisibilità* a volontà e ha i seguenti incantesimi da mago preparati:\n\n- Trucchetti (a volontà): Dardo di Fuoco, Luce, Mano Magica, Prestidigitazione, Tocco Folgorante\n- 1° livello (4 slot): Individuazione del Magico, Identificare, Armatura Magica*, Dardo Incantato\n- 2° livello (3 slot): Individuazione dei Pensieri, Immagine Speculare, Passo Velato\n- 3° livello (3 slot): Controincantesimo, Volare, Fulmine\n- 4° livello (3 slot): Bando, Scudo di Fuoco, Pelle di Pietra*\n- 5° livello (3 slot): Cono di Freddo, Scrutare, Muro di Forza\n- 6° livello (1 slot): Globo di Invulnerabilità\n- 7° livello (1 slot): Teletrasporto\n- 8° livello (1 slot): Vuoto Mentale*\n- 9° livello (1 slot): Blocca Tempo\n* L'arcimago lancia questi incantesimi su se stesso prima del combattimento.",
      "spellcasting": {
        "level": 18,
        "ability": {
          "index": "int",
          "name": "INT",
          "url": "/api/2014/ability-scores/int"
        },
        "dc": 17,
        "modifier": 9,
        "components_required": [
          "V",
          "S",
          "M"
        ],
        "school": "wizard",
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1
        },
        "spells": [
          {
            "name": "Camuffare Sé Stesso",
            "level": 1,
            "url": "/api/2014/spells/disguise-self",
            "usage": {
              "type": "a volontà",
              "rest_types": []
            }
          },
          {
            "name": "Invisibilità",
            "level": 2,
            "url": "/api/2014/spells/invisibility",
            "usage": {
              "type": "a volontà",
              "rest_types": []
            }
          },
          {
            "name": "Dardo di Fuoco",
            "level": 0,
            "url": "/api/2014/spells/fire-bolt"
          },
          {
            "name": "Luce",
            "level": 0,
            "url": "/api/2014/spells/light"
          },
          {
            "name": "Mano Magica",
            "level": 0,
            "url": "/api/2014/spells/mage-hand"
          },
          {
            "name": "Prestidigitazione",
            "level": 0,
            "url": "/api/2014/spells/prestidigitation"
          },
          {
            "name": "Tocco Folgorante",
            "level": 0,
            "url": "/api/2014/spells/shocking-grasp"
          },
          {
            "name": "Individuazione del Magico",
            "level": 1,
            "url": "/api/2014/spells/detect-magic"
          },
          {
            "name": "Identificare",
            "level": 1,
            "url": "/api/2014/spells/identify"
          },
          {
            "name": "Armatura Magica",
            "level": 1,
            "url": "/api/2014/spells/mage-armor",
            "notes": "Lanciato su se stesso prima del combattimento"
          },
          {
            "name": "Dardo Incantato",
            "level": 1,
            "url": "/api/2014/spells/magic-missile"
          },
          {
            "name": "Individuazione dei Pensieri",
            "level": 2,
            "url": "/api/2014/spells/detect-thoughts"
          },
          {
            "name": "Immagine Speculare",
            "level": 2,
            "url": "/api/2014/spells/mirror-image"
          },
          {
            "name": "Passo Velato",
            "level": 2,
            "url": "/api/2014/spells/misty-step"
          },
          {
            "name": "Controincantesimo",
            "level": 3,
            "url": "/api/2014/spells/counterspell"
          },
          {
            "name": "Volare",
            "level": 3,
            "url": "/api/2014/spells/fly"
          },
          {
            "name": "Fulmine",
            "level": 3,
            "url": "/api/2014/spells/lightning-bolt"
          },
          {
            "name": "Bando",
            "level": 4,
            "url": "/api/2014/spells/banishment"
          },
          {
            "name": "Scudo di Fuoco",
            "level": 4,
            "url": "/api/2014/spells/fire-shield"
          },
          {
            "name": "Pelle di Pietra",
            "level": 4,
            "url": "/api/2014/spells/stoneskin",
            "notes": "Lanciato su se stesso prima del combattimento"
          },
          {
            "name": "Cono di Freddo",
            "level": 5,
            "url": "/api/2014/spells/cone-of-cold"
          },
          {
            "name": "Scrutare",
            "level": 5,
            "url": "/api/2014/spells/scrying"
          },
          {
            "name": "Muro di Forza",
            "level": 5,
            "url": "/api/2014/spells/wall-of-force"
          },
          {
            "name": "Globo di Invulnerabilità",
            "level": 6,
            "url": "/api/2014/spells/globe-of-invulnerability"
          },
          {
            "name": "Teletrasporto",
            "level": 7,
            "url": "/api/2014/spells/teleport"
          },
          {
            "name": "Vuoto Mentale",
            "level": 8,
            "url": "/api/2014/spells/mind-blank",
            "notes": "Lanciato su se stesso prima del combattimento"
          },
          {
            "name": "Blocca Tempo",
            "level": 9,
            "url": "/api/2014/spells/time-stop"
          }
        ]
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Pugnale",
      "desc": "Attacco con Arma da Mischia o a Distanza: +6 per colpire, portata 1,5 m. o gittata 6/18 m., un bersaglio. Colpito: 4 (1d4 + 2) danno perforante.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d4+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/archmage.png",
  "url": "/api/2014/monsters/archmage",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "assassin",
  "name": "Assassino",
  "desc": "Addestrati nell'uso del veleno, gli assassini sono spietati killer che lavorano per nobili, maestri di gilda, sovrani e chiunque altro possa permetterseli.",
  "size": "Media",
  "type": "umanoide",
  "subtype": "qualsiasi razza",
  "alignment": "qualsiasi allineamento non buono",
  "armor_class": [
    {
      "type": "armatura",
      "value": 15,
      "armor": [
        {
          "index": "studded-leather-armor",
          "name": "Armatura di Cuoio Borchiato",
          "url": "/api/2014/equipment/studded-leather-armor"
        }
      ]
    }
  ],
  "hit_points": 78,
  "hit_dice": "12d8",
  "hit_points_roll": "12d8+24",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 11,
  "dexterity": 16,
  "constitution": 14,
  "intelligence": 13,
  "wisdom": 11,
  "charisma": 10,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "saving-throw-int",
        "name": "Tiro Salvezza: INT",
        "url": "/api/2014/proficiencies/saving-throw-int"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "skill-acrobatics",
        "name": "Abilità: Acrobazia",
        "url": "/api/2014/proficiencies/skill-acrobatics"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "skill-deception",
        "name": "Abilità: Inganno",
        "url": "/api/2014/proficiencies/skill-deception"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "veleno"
  ],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "Percezione passiva": 13
  },
  "languages": "Cantico dei Ladri più due linguaggi a scelta",
  "challenge_rating": 8,
  "proficiency_bonus": 3,
  "xp": 3900,
  "special_abilities": [
    {
      "name": "Assassinio",
      "desc": "Durante il suo primo turno, l'assassino ha vantaggio ai tiri per colpire contro qualsiasi creatura che non abbia ancora agito. Qualsiasi colpo che l'assassino infligge a una creatura **sorpresa** è un colpo critico.",
      "damage": []
    },
    {
      "name": "Eludere",
      "desc": "Se l'assassino è soggetto a un effetto che gli permette di effettuare un tiro salvezza su Destrezza per subire solo metà danno, l'assassino non subisce alcun danno se supera il tiro salvezza, e solo metà danno se lo fallisce.",
      "damage": []
    },
    {
      "name": "Attacco Furtivo (1/Turno)",
      "desc": "L'assassino infligge 13 (4d6) danno extra quando colpisce un bersaglio con un attacco con arma e ha vantaggio al tiro per colpire, o quando il bersaglio è entro 1,5 m. da un alleato dell'assassino che non sia incapacitato e l'assassino non ha svantaggio al tiro per colpire.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "L'assassino effettua due attacchi con la spada corta.",
      "actions": [
        {
          "action_name": "Spada Corta",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Spada Corta",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 1,5 m., un bersaglio. Colpito: 6 (1d6 + 3) danno perforante, e il bersaglio deve effettuare un Tiro Salvezza su Costituzione CD 15, subendo 24 (7d6) danno da veleno se fallisce il tiro salvezza, o metà di quel danno se lo supera.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d6+3"
        },
        {
          "dc": {
            "dc_type": {
              "index": "con",
              "name": "COS",
              "url": "/api/2014/ability-scores/con"
            },
            "dc_value": 15,
            "success_type": "half"
          },
          "damage_type": {
            "index": "poison",
            "name": "Veleno",
            "url": "/api/2014/damage-types/poison"
          },
          "damage_dice": "7d6"
        }
      ],
      "actions": []
    },
    {
      "name": "Balestra Leggera",
      "desc": "Attacco con Arma a Distanza: +6 per colpire, gittata 24/96 m., un bersaglio. Colpito: 7 (1d8 + 3) danno perforante, e il bersaglio deve effettuare un Tiro Salvezza su Costituzione CD 15, subendo 24 (7d6) danno da veleno se fallisce il tiro salvezza, o metà di quel danno se lo supera.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d8+3"
        },
        {
          "dc": {
            "dc_type": {
              "index": "con",
              "name": "COS",
              "url": "/api/2014/ability-scores/con"
            },
            "dc_value": 15,
            "success_type": "half"
          },
          "damage_type": {
            "index": "poison",
            "name": "Veleno",
            "url": "/api/2014/damage-types/poison"
          },
          "damage_dice": "7d6"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/assassin.png",
  "url": "/api/2014/monsters/assassin",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "awakened-shrub",
  "name": "Arbusto Risvegliato",
  "desc": "Un arbusto risvegliato è un arbusto comune a cui è stata conferita intelligenza e mobilità dall'incantesimo *risveglio* o da magia simile.",
  "size": "Piccola",
  "type": "vegetale",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "DES",
      "value": 9
    }
  ],
  "hit_points": 10,
  "hit_dice": "3d6",
  "hit_points_roll": "3d6",
  "speed": {
    "camminare": "6 m."
  },
  "strength": 3,
  "dexterity": 8,
  "constitution": 11,
  "intelligence": 10,
  "wisdom": 10,
  "charisma": 6,
  "proficiencies": [],
  "damage_vulnerabilities": [
    "fuoco"
  ],
  "damage_resistances": [
    "perforante"
  ],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "Percezione passiva": 10
  },
  "languages": "un linguaggio conosciuto dal suo creatore",
  "challenge_rating": 0,
  "proficiency_bonus": 2,
  "xp": 10,
  "special_abilities": [
    {
      "name": "Falsa Apparenza",
      "desc": "Finché l'arbusto rimane immobile, è indistinguibile da un arbusto normale.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Graffio",
      "desc": "Attacco con Arma da Mischia: +1 per colpire, portata 1,5 m., un bersaglio. Colpito: 1 (1d4 - 1) danno tagliente.",
      "attack_bonus": 1,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "1d4-1"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/awakened-shrub.png",
  "url": "/api/2014/monsters/awakened-shrub",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "awakened-tree",
  "name": "Albero Risvegliato",
  "desc": "Un albero risvegliato è un albero comune a cui è stata conferita intelligenza e mobilità dall'incantesimo *risveglio* o da magia simile.",
  "size": "Enorme",
  "type": "vegetale",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 13
    }
  ],
  "hit_points": 59,
  "hit_dice": "7d12",
  "hit_points_roll": "7d12+14",
  "speed": {
    "camminare": "6 m."
  },
  "strength": 19,
  "dexterity": 6,
  "constitution": 15,
  "intelligence": 10,
  "wisdom": 10,
  "charisma": 7,
  "proficiencies": [],
  "damage_vulnerabilities": [
    "fuoco"
  ],
  "damage_resistances": [
    "contundente",
    "perforante"
  ],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "Percezione passiva": 10
  },
  "languages": "un linguaggio conosciuto dal suo creatore",
  "challenge_rating": 2,
  "proficiency_bonus": 2,
  "xp": 450,
  "special_abilities": [
    {
      "name": "Falsa Apparenza",
      "desc": "Finché l'albero rimane immobile, è indistinguibile da un albero normale.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Schianto",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 3 m., un bersaglio. Colpito: 14 (3d6 + 4) danno contundente.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "3d6+4"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/awakened-tree.png",
  "url": "/api/2014/monsters/awakened-tree",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "axe-beak",
  "name": "Becco Ascia",
  "desc": "Il Becco Ascia è un uccello alto e inetto al volo, con zampe forti e un becco pesante a forma di cuneo. Ha una brutta disposizione e tende ad attaccare qualsiasi creatura sconosciuta che si avvicini troppo.",
  "size": "Grande",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "DES",
      "value": 11
    }
  ],
  "hit_points": 19,
  "hit_dice": "3d10",
  "hit_points_roll": "3d10+3",
  "speed": {
    "camminare": "15 m."
  },
  "strength": 14,
  "dexterity": 12,
  "constitution": 12,
  "intelligence": 2,
  "wisdom": 10,
  "charisma": 5,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "Percezione passiva": 10
  },
  "languages": "",
  "challenge_rating": 0.25,
  "proficiency_bonus": 2,
  "xp": 50,
  "actions": [
    {
      "name": "Becco",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 6 (1d8 + 2) danno tagliente.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "1d8+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/axe-beak.png",
  "url": "/api/2014/monsters/axe-beak",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "azer",
  "name": "Azer",
  "size": "Media",
  "type": "elementale",
  "alignment": "legale neutrale",
  "armor_class": [
    {
      "type": "naturale",
      "value": 15
    },
    {
      "type": "armatura",
      "value": 17,
      "armor": [
        {
          "index": "shield",
          "name": "Scudo",
          "url": "/api/2014/equipment/shield"
        }
      ]
    }
  ],
  "hit_points": 39,
  "hit_dice": "6d8",
  "hit_points_roll": "6d8+12",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 17,
  "dexterity": 12,
  "constitution": 15,
  "intelligence": 12,
  "wisdom": 13,
  "charisma": 10,
  "proficiencies": [
    {
      "value": 4,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fuoco",
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "poisoned",
      "name": "Avvelenato",
      "url": "/api/2014/conditions/poisoned"
    }
  ],
  "senses": {
    "passive_perception": 11
  },
  "languages": "Ignan",
  "challenge_rating": 2,
  "proficiency_bonus": 2,
  "xp": 450,
  "special_abilities": [
    {
      "name": "Corpo Infuocato",
      "desc": "Una creatura che tocca l'azer o lo colpisce con un attacco in mischia entro 1,5 m. da esso subisce 5 (1d10) danno da fuoco.",
      "damage": [
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "1d10"
        }
      ]
    },
    {
      "name": "Armi Infuocate",
      "desc": "Quando l'azer colpisce con un'arma metallica da mischia, infligge 3 (1d6) danno da fuoco extra (già incluso nell'attacco).",
      "damage": [
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "1d6"
        }
      ]
    },
    {
      "name": "Illuminazione",
      "desc": "L'azer emette luce intensa in un raggio di 3 metri e luce fioca per un ulteriore 3 m..",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Martello da Guerra",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 7 (1d8 + 3) danno contundente, o 8 (1d10 + 3) danno contundente se usato con due mani per effettuare un attacco in mischia, più 3 (1d6) danno da fuoco.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "1d8+3"
        },
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "1d6"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/azer.png",
  "url": "/api/2014/monsters/azer",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "baboon",
  "name": "Babbuino",
  "size": "Piccola",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "DES",
      "value": 12
    }
  ],
  "hit_points": 3,
  "hit_dice": "1d6",
  "hit_points_roll": "1d6",
  "speed": {
    "camminare": "9 m.",
    "scalare": "9 m."
  },
  "strength": 8,
  "dexterity": 14,
  "constitution": 11,
  "intelligence": 4,
  "wisdom": 12,
  "charisma": 6,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "passive_perception": 11
  },
  "languages": "",
  "challenge_rating": 0,
  "proficiency_bonus": 2,
  "xp": 10,
  "special_abilities": [
    {
      "name": "Tattiche di Branco",
      "desc": "Il babbuino ha vantaggio a un tiro per colpire contro una creatura se almeno uno degli alleati del babbuino si trova entro 1,5 m dalla creatura e l'alleato non è incapacitato.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +1 per colpire, portata 1,5 m, un bersaglio. Colpito: 1 (1d4 - 1) danno perforante.",
      "attack_bonus": 1,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d4-1"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/baboon.png",
  "url": "/api/2014/monsters/baboon",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "badger",
  "name": "Tasso",
  "size": "Minuscola",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "DES",
      "value": 10
    }
  ],
  "hit_points": 3,
  "hit_dice": "1d4",
  "hit_points_roll": "1d4+1",
  "speed": {
    "camminare": "6 m.",
    "scavare": "1,5 m."
  },
  "strength": 4,
  "dexterity": 11,
  "constitution": 12,
  "intelligence": 2,
  "wisdom": 12,
  "charisma": 5,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "9 m.",
    "passive_perception": 11
  },
  "languages": "",
  "challenge_rating": 0,
  "proficiency_bonus": 2,
  "xp": 10,
  "special_abilities": [
    {
      "name": "Olfatto Acuto",
      "desc": "Il tasso ha vantaggio alle prove di Saggezza (Percezione) basate sull'olfatto.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +2 per colpire, portata 1,5 m., un bersaglio. Colpito: 1 danno perforante.",
      "attack_bonus": 2,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/badger.png",
  "url": "/api/2014/monsters/badger",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "balor",
  "name": "Balor",
  "size": "Enorme",
  "type": "immondo",
  "subtype": "demone",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 19
    }
  ],
  "hit_points": 262,
  "hit_dice": "21d12",
  "hit_points_roll": "21d12+126",
  "speed": {
    "camminare": "12 m.",
    "volare": "24 m."
  },
  "strength": 26,
  "dexterity": 15,
  "constitution": 22,
  "intelligence": 20,
  "wisdom": 16,
  "charisma": 22,
  "proficiencies": [
    {
      "value": 14,
      "proficiency": {
        "index": "saving-throw-str",
        "name": "Tiro Salvezza: FOR",
        "url": "/api/2014/proficiencies/saving-throw-str"
      }
    },
    {
      "value": 12,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 12,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "freddo",
    "fulmine",
    "contundente, perforante e tagliente da attacchi non magici"
  ],
  "damage_immunities": [
    "fuoco",
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "poisoned",
      "name": "Avvelenato",
      "url": "/api/2014/conditions/poisoned"
    }
  ],
  "senses": {
    "visione_del_vero": "36 m.",
    "passive_perception": 13
  },
  "languages": "Abissale, telepatia 36 m.",
  "challenge_rating": 19,
  "proficiency_bonus": 6,
  "xp": 22000,
  "special_abilities": [
    {
      "name": "Spasmi Agonizzanti",
      "desc": "Quando il balor muore, esplode e ogni creatura entro 9 metri da esso deve effettuare un tiro salvezza su Destrezza CD 20, subendo 70 (20d6) danno da fuoco se fallisce il tiro salvezza, o la metà se lo supera. L'esplosione incendia gli oggetti infiammabili nell'area che non siano indossati o trasportati e distrugge le armi del balor.",
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 20,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "20d6"
        }
      ]
    },
    {
      "name": "Aura di Fuoco",
      "desc": "All'inizio di ogni turno del balor, ogni creatura entro 1,5 metri da esso subisce 10 (3d6) danno da fuoco e gli oggetti infiammabili nell'aura che non siano indossati o trasportati prendono fuoco. Una creatura che tocca il balor o lo colpisce con un attacco in mischia mentre si trova entro 1,5 metri da esso subisce 10 (3d6) danno da fuoco.",
      "damage": [
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "3d6"
        }
      ]
    },
    {
      "name": "Resistenza alla Magia",
      "desc": "Il balor ha vantaggio ai tiri salvezza contro incantesimi e altri effetti magici.",
      "damage": []
    },
    {
      "name": "Armi Magiche",
      "desc": "Gli attacchi con arma del balor sono considerati magici.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il balor effettua due attacchi: uno con la sua spada lunga e uno con la sua frusta.",
      "actions": [
        {
          "action_name": "Spada Lunga",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Frusta",
          "count": "1",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Spada Lunga",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 3 m., un bersaglio. Colpito: 21 (3d8 + 8) danno tagliente più 13 (3d8) danno da fulmine. Se il balor mette a segno un colpo critico, tira i dadi di danno tre volte anziché due.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "3d8+8"
        },
        {
          "damage_type": {
            "index": "lightning",
            "name": "Fulmine",
            "url": "/api/2014/damage-types/lightning"
          },
          "damage_dice": "3d8"
        }
      ],
      "actions": []
    },
    {
      "name": "Frusta",
      "desc": "Attacco con Arma da Mischia: +14 per colpire, portata 9 m., un bersaglio. Colpito: 15 (2d6 + 8) danno tagliente più 10 (3d6) danno da fuoco, e il bersaglio deve superare un tiro salvezza su Forza CD 20 o essere trascinato fino a 7,5 metri verso il balor.",
      "attack_bonus": 14,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+8"
        },
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "3d6"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Teletrasporto",
      "desc": "Il balor si teletrasporta magicamente, assieme a qualsiasi equipaggiamento indossi o trasporti, fino a 36 metri in uno spazio non occupato che può vedere.",
      "actions": []
    }
  ],
  "image": "/api/images/monsters/balor.png",
  "url": "/api/2014/monsters/balor",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "bandit",
  "name": "Bandito",
  "desc": "**I banditi** si spostano in bande e sono talvolta guidati da scagnozzi, veterani o incantatori. Non tutti i banditi sono malvagi. L'oppressione, la siccità, le malattie o le carestie possono spesso spingere persone altrimenti oneste verso una vita di banditismo.\n\n**I pirati** sono banditi dell'alto mare. Possono essere filibustieri interessati solo al tesoro e all'omicidio, oppure corsari autorizzati dalla corona ad attaccare e saccheggiare le navi di una nazione nemica.",
  "size": "Media",
  "type": "umanoide",
  "subtype": "qualsiasi razza",
  "alignment": "qualsiasi allineamento non legale",
  "armor_class": [
    {
      "type": "armatura",
      "value": 12,
      "armor": [
        {
          "index": "leather-armor",
          "name": "Armatura di Cuoio",
          "url": "/api/2014/equipment/leather-armor"
        }
      ]
    }
  ],
  "hit_points": 11,
  "hit_dice": "2d8",
  "hit_points_roll": "2d8+2",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 11,
  "dexterity": 12,
  "constitution": 12,
  "intelligence": 10,
  "wisdom": 10,
  "charisma": 10,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "passive_perception": 10
  },
  "languages": "un linguaggio qualsiasi (solitamente il Comune)",
  "challenge_rating": 0.125,
  "proficiency_bonus": 2,
  "xp": 25,
  "actions": [
    {
      "name": "Scimitarra",
      "desc": "Attacco con Arma da Mischia: +3 per colpire, portata 1,5 m., un bersaglio. Colpito: 4 (1d6 + 1) danno tagliente.",
      "attack_bonus": 3,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "1d6+1"
        }
      ],
      "actions": []
    },
    {
      "name": "Balestra Leggera",
      "desc": "Attacco con Arma a Gittata: +3 per colpire, gittata 24/96 m., un bersaglio. Colpito: 5 (1d8 + 1) danno perforante.",
      "attack_bonus": 3,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d8+1"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/bandit.png",
  "url": "/api/2014/monsters/bandit",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "bandit-captain",
  "name": "Bandito Capobanda",
  "desc": "Occorre una forte personalità, una scaltrezza spietata e una lingua d'argento per tenere in riga una banda di banditi. Il **capobanda** possiede queste qualità in abbondanza.\n\nOltre a gestire una ciurma di egoisti insoddisfatti, il **capitano pirata** è una variante del capobanda, con una nave da proteggere e comandare. Per tenere in riga l'equipaggio, il capitano deve dispensare ricompense e punizioni su base regolare.\n\nPiù che il tesoro, un capobanda o un capitano pirata brama l'infamia. Un prigioniero che faccia appello alla vanità o all'ego del capitano ha più probabilità di essere trattato equamente rispetto a un prigioniero che non lo fa o che dichiara di non sapere nulla della pittoresca reputazione del capitano.",
  "size": "Media",
  "type": "umanoide",
  "subtype": "qualsiasi razza",
  "alignment": "qualsiasi allineamento non legale",
  "armor_class": [
    {
      "type": "armatura",
      "value": 15,
      "armor": [
        {
          "index": "studded-leather-armor",
          "name": "Armatura di Cuoio Borchiato",
          "url": "/api/2014/equipment/studded-leather-armor"
        }
      ]
    }
  ],
  "hit_points": 65,
  "hit_dice": "10d8",
  "hit_points_roll": "10d8+20",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 15,
  "dexterity": 16,
  "constitution": 14,
  "intelligence": 14,
  "wisdom": 11,
  "charisma": 14,
  "proficiencies": [
    {
      "value": 4,
      "proficiency": {
        "index": "saving-throw-str",
        "name": "Tiro Salvezza: FOR",
        "url": "/api/2014/proficiencies/saving-throw-str"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-athletics",
        "name": "Abilità: Atletica",
        "url": "/api/2014/proficiencies/skill-athletics"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-deception",
        "name": "Abilità: Inganno",
        "url": "/api/2014/proficiencies/skill-deception"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "passive_perception": 10
  },
  "languages": "due linguaggi qualsiasi",
  "challenge_rating": 2,
  "proficiency_bonus": 2,
  "xp": 450,
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "action_options",
      "desc": "Il capitano effettua tre attacchi in mischia: due con la sua scimitarra e uno con il suo pugnale. In alternativa, il capitano effettua due attacchi a distanza con i suoi pugnali.",
      "action_options": {
        "choose": 1,
        "type": "action",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "multiple",
              "items": [
                {
                  "option_type": "action",
                  "action_name": "Scimitarra",
                  "count": 2,
                  "type": "melee"
                },
                {
                  "option_type": "action",
                  "action_name": "Pugnale",
                  "count": 1,
                  "type": "melee"
                }
              ]
            },
            {
              "option_type": "action",
              "action_name": "Pugnale",
              "count": 2,
              "type": "ranged"
            }
          ]
        }
      },
      "actions": []
    },
    {
      "name": "Scimitarra",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 6 (1d6 + 3) danno tagliente.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "1d6+3"
        }
      ],
      "actions": []
    },
    {
      "name": "Pugnale",
      "desc": "Attacco con Arma da Mischia o a Distanza: +5 per colpire, portata 1,5 m. o gittata 6/18 m., un bersaglio. Colpito: 5 (1d4 + 3) danno perforante.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d4+3"
        }
      ],
      "actions": []
    }
  ],
  "reactions": [
    {
      "name": "Parata",
      "desc": "Il capitano aggiunge 2 alla sua CA contro un attacco in mischia che lo colpirebbe. Per farlo, il capitano deve vedere l'attaccante e impugnare un'arma da mischia."
    }
  ],
  "image": "/api/images/monsters/bandit-captain.png",
  "url": "/api/2014/monsters/bandit-captain",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "special_abilities": []
},
{
  "index": "blink-dog",
  "name": "Cane Intermittente",
  "desc": "Il cane intermittente prende il nome dalla sua capacità di apparire e scomparire dall'esistenza, un talento che usa per supportare i suoi attacchi e per evitare danni.",
  "size": "Media",
  "type": "folletto",
  "alignment": "legale buono",
  "armor_class": [
    {
      "type": "DES",
      "value": 13
    }
  ],
  "hit_points": 22,
  "hit_dice": "4d8",
  "hit_points_roll": "4d8+4",
  "speed": {
    "camminare": "12 m."
  },
  "strength": 12,
  "dexterity": 17,
  "constitution": 12,
  "intelligence": 10,
  "wisdom": 13,
  "charisma": 11,
  "proficiencies": [
    {
      "value": 3,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "passive_perception": 13
  },
  "languages": "Cane Intermittente, comprende il Silvano ma non può parlarlo",
  "challenge_rating": 0.25,
  "proficiency_bonus": 2,
  "xp": 50,
  "special_abilities": [
    {
      "name": "Udito e Olfatto Acuti",
      "desc": "Il cane ha vantaggio alle prove di Saggezza (Percezione) basate sull'udito o sull'olfatto.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +3 per colpire, portata 1,5 m., un bersaglio. Colpito: 4 (1d6 + 1) danno perforante.",
      "attack_bonus": 3,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d6+1"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Teletrasporto",
      "desc": "Il cane si teletrasporta magicamente, assieme a qualsiasi equipaggiamento indossi o trasporti, fino a 12 metri in uno spazio non occupato che può vedere. Prima o dopo il teletrasporto, il cane può effettuare un attacco con il morso.",
      "usage": {
        "type": "recharge on roll",
        "dice": "1d6",
        "min_value": 4
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/blink-dog.png",
  "url": "/api/2014/monsters/blink-dog",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "blood-hawk",
  "name": "Falco Sanguinario",
  "desc": "Prende il nome dalle sue piume cremisi e dalla sua natura aggressiva; il falco sanguinario attacca senza paura quasi ogni animale, trafiggendolo con il suo becco simile a un pugnale. I falchi sanguinari si riuniscono in grandi stormi, attaccando in branco per abbattere le prede.",
  "size": "Piccola",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "DES",
      "value": 12
    }
  ],
  "hit_points": 7,
  "hit_dice": "2d6",
  "hit_points_roll": "2d6",
  "speed": {
    "camminare": "3 m.",
    "volare": "18 m."
  },
  "strength": 6,
  "dexterity": 14,
  "constitution": 10,
  "intelligence": 3,
  "wisdom": 14,
  "charisma": 5,
  "proficiencies": [
    {
      "value": 4,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "passive_perception": 14
  },
  "languages": "",
  "challenge_rating": 0.125,
  "proficiency_bonus": 2,
  "xp": 25,
  "special_abilities": [
    {
      "name": "Vista Acuta",
      "desc": "Il falco ha vantaggio alle prove di Saggezza (Percezione) basate sulla vista.",
      "damage": []
    },
    {
      "name": "Tattiche di Branco",
      "desc": "Il falco ha vantaggio a un tiro per colpire contro una creatura se almeno uno degli alleati del falco si trova entro 1,5 metri dalla creatura e l'alleato non è incapacitato.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Becco",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 4 (1d4 + 2) danno perforante.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d4+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/blood-hawk.png",
  "url": "/api/2014/monsters/blood-hawk",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "blue-dragon-wyrmling",
  "name": "Cucciolo di Drago Blu",
  "size": "Media",
  "type": "drago",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 17
    }
  ],
  "hit_points": 52,
  "hit_dice": "8d8",
  "hit_points_roll": "8d8+16",
  "speed": {
    "camminare": "9 m.",
    "scavare": "4,5 m.",
    "volare": "18 m."
  },
  "strength": 17,
  "dexterity": 10,
  "constitution": 15,
  "intelligence": 12,
  "wisdom": 11,
  "charisma": 15,
  "proficiencies": [
    {
      "value": 2,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fulmine"
  ],
  "condition_immunities": [],
  "senses": {
    "vista_cieca": "3 m.",
    "scurovisione": "18 m.",
    "passive_perception": 14
  },
  "languages": "Draconico",
  "challenge_rating": 3,
  "proficiency_bonus": 2,
  "xp": 700,
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m, un bersaglio. Colpito: 8 (1d10 + 3) danno perforante più 3 (1d6) danno da fulmine.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d10+3"
        },
        {
          "damage_type": {
            "index": "lightning",
            "name": "Fulmine",
            "url": "/api/2014/damage-types/lightning"
          },
          "damage_dice": "1d6"
        }
      ],
      "actions": []
    },
    {
      "name": "Soffio di Fulmine",
      "desc": "Il drago esala un fulmine in una linea di 9 metri e larga 1,5 metri. Ogni creatura in quella linea deve effettuare un tiro salvezza su Destrezza CD 12, subendo 22 (4d10) danni da fulmine se fallisce il tiro salvezza, o la metà se lo supera.",
      "usage": {
        "type": "recharge on roll",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 12,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "lightning",
            "name": "Fulmine",
            "url": "/api/2014/damage-types/lightning"
          },
          "damage_dice": "4d10"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/blue-dragon-wyrmling.png",
  "url": "/api/2014/monsters/blue-dragon-wyrmling",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "boar",
  "name": "Cinghiale",
  "size": "Media",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 11
    }
  ],
  "hit_points": 11,
  "hit_dice": "2d8",
  "hit_points_roll": "2d8+2",
  "speed": {
    "camminare": "12 m."
  },
  "strength": 13,
  "dexterity": 11,
  "constitution": 12,
  "intelligence": 2,
  "wisdom": 9,
  "charisma": 5,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 9
  },
  "languages": "",
  "challenge_rating": 0.25,
  "proficiency_bonus": 2,
  "xp": 50,
  "special_abilities": [
    {
      "name": "Carica",
      "desc": "Se il cinghiale si muove di almeno 6 metri in linea retta verso un bersaglio e poi lo colpisce con un attacco di zanna nello stesso turno, il bersaglio subisce 3 (1d6) danni taglienti extra. Se il bersaglio è una creatura, deve superare un tiro salvezza su Forza CD 11 o essere abbattuto prono.",
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "1d6"
        }
      ]
    },
    {
      "name": "Inarrestabile",
      "desc": "Se il cinghiale subisce 7 danni o meno che lo ridurrebbero a 0 punti ferita, viene invece ridotto a 1 punto ferita.",
      "usage": {
        "type": "ricarica dopo un riposo",
        "rest_types": [
          "breve",
          "lungo"
        ]
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Zanna",
      "desc": "Attacco con Arma da Mischia: +3 per colpire, portata 1,5 m., un bersaglio. Colpito: 4 (1d6 + 1) danno tagliente.",
      "attack_bonus": 3,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "1d6+1"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/boar.png",
  "url": "/api/2014/monsters/boar",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "bone-devil",
  "name": "Diavolo delle Ossa",
  "size": "Grande",
  "type": "immondo",
  "subtype": "diavolo",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 19
    }
  ],
  "hit_points": 142,
  "hit_dice": "15d10",
  "hit_points_roll": "15d10+60",
  "speed": {
    "camminare": "12 m.",
    "volare": "12 m."
  },
  "strength": 18,
  "dexterity": 16,
  "constitution": 18,
  "intelligence": 13,
  "wisdom": 14,
  "charisma": 16,
  "proficiencies": [
    {
      "value": 5,
      "proficiency": {
        "index": "saving-throw-int",
        "name": "Tiro Salvezza: INT",
        "url": "/api/2014/proficiencies/saving-throw-int"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-deception",
        "name": "Abilità: Inganno",
        "url": "/api/2014/proficiencies/skill-deception"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "skill-insight",
        "name": "Abilità: Intuizione",
        "url": "/api/2014/proficiencies/skill-insight"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "freddo",
    "contundente, perforante e tagliente da attacchi non magici che non siano d'argento"
  ],
  "damage_immunities": [
    "fuoco",
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "poisoned",
      "name": "Avvelenato",
      "url": "/api/2014/conditions/poisoned"
    }
  ],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 12
  },
  "languages": "Infernale, telepatia 36 m.",
  "challenge_rating": 9,
  "proficiency_bonus": 4,
  "xp": 5000,
  "special_abilities": [
    {
      "name": "Vista del Diavolo",
      "desc": "L'oscurità magica non impedisce la scurovisione del diavolo.",
      "damage": []
    },
    {
      "name": "Resistenza Magica",
      "desc": "Il diavolo ha vantaggio ai tiri salvezza contro incantesimi e altri effetti magici.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il diavolo effettua tre attacchi: due con i suoi artigli e uno con il suo pungiglione.",
      "actions": [
        {
          "action_name": "Artiglio",
          "count": "2",
          "type": "melee"
        },
        {
          "action_name": "Pungiglione",
          "count": "1",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +8 per colpire, portata 3 m., un bersaglio. Colpito: 8 (1d8 + 4) danno tagliente.",
      "attack_bonus": 8,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "1d8+4"
        }
      ],
      "actions": []
    },
    {
      "name": "Pungiglione",
      "desc": "Attacco con Arma da Mischia: +8 per colpire, portata 3 m., un bersaglio. Colpito: 13 (2d8 + 4) danno perforante più 17 (5d6) danno da veleno, e il bersaglio deve superare un tiro salvezza su Costituzione CD 14 o diventare avvelenato per 1 minuto. Il bersaglio può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su se stesso in caso di successo.",
      "attack_bonus": 8,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d8+4"
        },
        {
          "damage_type": {
            "index": "poison",
            "name": "Veleno",
            "url": "/api/2014/damage-types/poison"
          },
          "damage_dice": "5d6"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/bone-devil.png",
  "url": "/api/2014/monsters/bone-devil",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "brass-dragon-wyrmling",
  "name": "Cucciolo di Drago d'Ottone",
  "size": "Media",
  "type": "drago",
  "alignment": "caotico buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 16
    }
  ],
  "hit_points": 16,
  "hit_dice": "3d8",
  "hit_points_roll": "3d8+3",
  "speed": {
    "camminare": "9 m.",
    "scavare": "4,5 m.",
    "volare": "18 m."
  },
  "strength": 15,
  "dexterity": 10,
  "constitution": 13,
  "intelligence": 10,
  "wisdom": 11,
  "charisma": 13,
  "proficiencies": [
    {
      "value": 2,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fuoco"
  ],
  "condition_immunities": [],
  "senses": {
    "vista_cieca": "3 m.",
    "scurovisione": "18 m.",
    "percezione_passiva": 14
  },
  "languages": "Draconico",
  "challenge_rating": 1,
  "proficiency_bonus": 2,
  "xp": 100,
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 7 (1d10 + 2) danno perforante.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d10+2"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio.\nSoffio di Fuoco. Il drago esala fuoco in una linea di 6 metri e larga 1,5 metri. Ogni creatura in quella linea deve effettuare un tiro salvezza su Destrezza CD 11, subendo 14 (4d6) danni da fuoco se fallisce il tiro salvezza, o la metà se lo supera.\nSoffio di Sonno. Il drago esala gas soporifero in un cono di 4,5 metri. Ogni creatura in quell'area deve superare un tiro salvezza su Costituzione CD 11 o cadere priva di sensi per 1 minuto. Questo effetto termina se la creatura subisce danni o se qualcuno usa un'azione per svegliarla.",
      "usage": {
        "type": "recharge on roll",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio di Fuoco",
              "dc": {
                "dc_type": {
                  "index": "dex",
                  "name": "DES",
                  "url": "/api/2014/ability-scores/dex"
                },
                "dc_value": 11,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "fire",
                    "name": "Fuoco",
                    "url": "/api/2014/damage-types/fire"
                  },
                  "damage_dice": "4d6"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio di Sonno",
              "dc": {
                "dc_type": {
                  "index": "con",
                  "name": "COS",
                  "url": "/api/2014/ability-scores/con"
                },
                "dc_value": 11,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/brass-dragon-wyrmling.png",
  "url": "/api/2014/monsters/brass-dragon-wyrmling",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},{
  "index": "bronze-dragon-wyrmling",
  "name": "Cucciolo di Drago di Bronzo",
  "size": "Media",
  "type": "drago",
  "alignment": "legale buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 17
    }
  ],
  "hit_points": 32,
  "hit_dice": "5d8",
  "hit_points_roll": "5d8+10",
  "speed": {
    "camminare": "9 m.",
    "volare": "18 m.",
    "nuotare": "9 m."
  },
  "strength": 17,
  "dexterity": 10,
  "constitution": 15,
  "intelligence": 12,
  "wisdom": 11,
  "charisma": 15,
  "proficiencies": [
    {
      "value": 2,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fulmine"
  ],
  "condition_immunities": [],
  "senses": {
    "vista_cieca": "3 m.",
    "scurovisione": "18 m.",
    "percezione_passiva": 14
  },
  "languages": "Draconico",
  "challenge_rating": 2,
  "proficiency_bonus": 2,
  "xp": 450,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il drago può respirare sia aria che acqua.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 8 (1d10 + 3) danno perforante.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d10+3"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio.\nSoffio di Fulmine. Il drago esala fulmini in una linea di 12 metri e larga 1,5 metri. Ogni creatura in quella linea deve effettuare un tiro salvezza su Destrezza CD 12, subendo 16 (3d10) danni da fulmine se fallisce il tiro salvezza, o la metà se lo supera.\nSoffio di Repulsione. Il drago esala energia di repulsione in un cono di 9 metri. Ogni creatura in quell'area deve superare un tiro salvezza su Forza CD 12. Se fallisce il tiro salvezza, la creatura viene spinta a 9 metri di distanza dal drago.",
      "usage": {
        "type": "recharge on roll",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio di Fulmine",
              "dc": {
                "dc_type": {
                  "index": "dex",
                  "name": "DES",
                  "url": "/api/2014/ability-scores/dex"
                },
                "dc_value": 12,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": {
                    "index": "lightning",
                    "name": "Fulmine",
                    "url": "/api/2014/damage-types/lightning"
                  },
                  "damage_dice": "3d10"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio di Repulsione",
              "dc": {
                "dc_type": {
                  "index": "str",
                  "name": "FOR",
                  "url": "/api/2014/ability-scores/str"
                },
                "dc_value": 12,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/bronze-dragon-wyrmling.png",
  "url": "/api/2014/monsters/bronze-dragon-wyrmling",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "brown-bear",
  "name": "Orso Bruno",
  "size": "Grande",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 11
    }
  ],
  "hit_points": 34,
  "hit_dice": "4d10",
  "hit_points_roll": "4d10+12",
  "speed": {
    "camminare": "12 m.",
    "scalare": "9 m."
  },
  "strength": 19,
  "dexterity": 10,
  "constitution": 16,
  "intelligence": 2,
  "wisdom": 13,
  "charisma": 7,
  "proficiencies": [
    {
      "value": 3,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 13
  },
  "languages": "",
  "challenge_rating": 1,
  "proficiency_bonus": 2,
  "xp": 200,
  "special_abilities": [
    {
      "name": "Olfatto Acuto",
      "desc": "L'orso ha vantaggio alle prove di Saggezza (Percezione) basate sull'olfatto.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "L'orso effettua due attacchi: uno con il morso e uno con gli artigli.",
      "actions": [
        {
          "action_name": "Morso",
          "count": "1",
          "type": "ability"
        },
        {
          "action_name": "Artigli",
          "count": "1",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 8 (1d8 + 4) danno perforante.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d8+4"
        }
      ],
      "actions": []
    },
    {
      "name": "Artigli",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 11 (2d6 + 4) danno tagliente.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+4"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/brown-bear.png",
  "url": "/api/2014/monsters/brown-bear",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "bugbear",
  "name": "Bugbear",
  "size": "Media",
  "type": "umanoide",
  "subtype": "goblinoide",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "armatura",
      "value": 16,
      "armor": [
        {
          "index": "shield",
          "name": "Scudo",
          "url": "/api/2014/equipment/shield"
        },
        {
          "index": "hide-armor",
          "name": "Armatura di Cuoio Borchiato",
          "url": "/api/2014/equipment/hide-armor"
        }
      ]
    }
  ],
  "hit_points": 27,
  "hit_dice": "5d8",
  "hit_points_roll": "5d8+5",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 15,
  "dexterity": 14,
  "constitution": 13,
  "intelligence": 8,
  "wisdom": 11,
  "charisma": 9,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "skill-survival",
        "name": "Abilità: Sopravvivenza",
        "url": "/api/2014/proficiencies/skill-survival"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 10
  },
  "languages": "Comune, Goblin",
  "challenge_rating": 1,
  "proficiency_bonus": 2,
  "xp": 200,
  "special_abilities": [
    {
      "name": "Bruto",
      "desc": "Un'arma da mischia infligge un dado supplementare del suo danno quando il bugbear colpisce con essa (incluso nell'attacco).",
      "damage": []
    },
    {
      "name": "Attacco a Sorpresa",
      "desc": "Se il bugbear sorprende una creatura e la colpisce con un attacco durante il primo round di combattimento, il bersaglio subisce 7 (2d6) danni extra dall'attacco.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Stella del Mattino",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 11 (2d8 + 2) danno perforante.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d8+2"
        }
      ],
      "actions": []
    },
    {
      "name": "Giavellotto",
      "desc": "Attacco con Arma da Mischia o a Gittata: +4 per colpire, portata 1,5 m. o gittata 9/36 m., un bersaglio. Colpito: 9 (2d6 + 2) danno perforante in mischia o 5 (1d6 + 2) danno perforante a distanza.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d6+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/bugbear.png",
  "url": "/api/2014/monsters/bugbear",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "bulette",
  "name": "Bulette",
  "size": "Grande",
  "type": "mostruosità",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 17
    }
  ],
  "hit_points": 94,
  "hit_dice": "9d10",
  "hit_points_roll": "9d10+45",
  "speed": {
    "camminare": "12 m.",
    "scavare": "12 m."
  },
  "strength": 19,
  "dexterity": 11,
  "constitution": 21,
  "intelligence": 2,
  "wisdom": 10,
  "charisma": 5,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_tellurica": "18 m.",
    "percezione_passiva": 16
  },
  "languages": "",
  "challenge_rating": 5,
  "proficiency_bonus": 3,
  "xp": 1800,
  "special_abilities": [
    {
      "name": "Salto da Fermo",
      "desc": "Il salto in lungo del bulette arriva fino a 9 metri e il suo salto in alto fino a 4,5 metri, con o senza rincorsa.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +7 per colpire, portata 1,5 m., un bersaglio. Colpito: 30 (4d12 + 4) danno perforante.",
      "attack_bonus": 7,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "4d12+4"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Salto Letale",
      "desc": "Se il bulette salta per almeno 4,5 metri come parte del suo movimento, può usare questa azione per atterrare in piedi in uno spazio che contiene una o più altre creature. Ognuna di quelle creature deve superare un tiro salvezza su Forza o Destrezza CD 16 (a scelta del bersaglio) o essere abbattuta prona e subire 14 (3d6 + 4) danni contundenti più 14 (3d6 + 4) danni taglienti. Se supera il tiro salvezza, la creatura subisce solo la metà dei danni, non è abbattuta prona e viene spinta di 1,5 metri fuori dallo spazio del bulette in uno spazio non occupato a scelta della creatura. Se non ci sono spazi liberi entro la portata, la creatura cade invece prona nello spazio del bulette.",
      "actions": []
    }
  ],
  "image": "/api/images/monsters/bulette.png",
  "url": "/api/2014/monsters/bulette",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "barbed-devil",
  "name": "Diavolo Aculeato",
  "size": "Media",
  "type": "immondo",
  "subtype": "diavolo",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 15
    }
  ],
  "hit_points": 110,
  "hit_dice": "13d8",
  "hit_points_roll": "13d8+52",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 16,
  "dexterity": 17,
  "constitution": 18,
  "intelligence": 12,
  "wisdom": 14,
  "charisma": 14,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-str",
        "name": "Tiro Salvezza: FOR",
        "url": "/api/2014/proficiencies/saving-throw-str"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "skill-deception",
        "name": "Abilità: Inganno",
        "url": "/api/2014/proficiencies/skill-deception"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "skill-insight",
        "name": "Abilità: Intuizione",
        "url": "/api/2014/proficiencies/skill-insight"
      }
    },
    {
      "value": 8,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "freddo",
    "contundente, perforante e tagliente da attacchi non magici che non siano d'argento"
  ],
  "damage_immunities": [
    "fuoco",
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "poisoned",
      "name": "Avvelenato",
      "url": "/api/2014/conditions/poisoned"
    }
  ],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 18
  },
  "languages": "Infernale, telepatia 36 m.",
  "challenge_rating": 5,
  "proficiency_bonus": 3,
  "xp": 1800,
  "special_abilities": [
    {
      "name": "Pelle Aculeata",
      "desc": "All'inizio di ogni suo turno, il diavolo barbuto infligge 5 (1d10) danni perforanti a qualsiasi creatura lo stia lottando.",
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d10"
        }
      ]
    },
    {
      "name": "Vista del Diavolo",
      "desc": "L'oscurità magica non impedisce la scurovisione del diavolo.",
      "damage": []
    },
    {
      "name": "Resistenza Magica",
      "desc": "Il diavolo ha vantaggio ai tiri salvezza contro incantesimi e altri effetti magici.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "action_options",
      "desc": "Il diavolo effettua tre attacchi in mischia: uno con la coda e due con i suoi artigli. In alternativa, può usare Scagliare Fiamme due volte.",
      "action_options": {
        "choose": 1,
        "type": "action",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "multiple",
              "items": [
                {
                  "option_type": "action",
                  "action_name": "Coda",
                  "count": 1,
                  "type": "melee"
                },
                {
                  "option_type": "action",
                  "action_name": "Artiglio",
                  "count": 2,
                  "type": "melee"
                }
              ]
            },
            {
              "option_type": "action",
              "action_name": "Scagliare Fiamme",
              "count": 2,
              "type": "ranged"
            }
          ]
        }
      },
      "actions": []
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 1,5 m., un bersaglio. Colpito: 6 (1d6 + 3) danno perforante.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d6+3"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 1,5 m., un bersaglio. Colpito: 10 (2d6 + 3) danno perforante.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d6+3"
        }
      ],
      "actions": []
    },
    {
      "name": "Scagliare Fiamme",
      "desc": "Attacco Incantesimo a Gittata: +5 per colpire, gittata 45 m., un bersaglio. Colpito: 10 (3d6) danno da fuoco. Se il bersaglio è un oggetto infiammabile che non viene indossato o trasportato, prende fuoco.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "3d6"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/barbed-devil.png",
  "url": "/api/2014/monsters/barbed-devil",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "basilisk",
  "name": "Basilisco",
  "size": "Media",
  "type": "mostruosità",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 12
    }
  ],
  "hit_points": 52,
  "hit_dice": "8d8",
  "hit_points_roll": "8d8+16",
  "speed": {
    "camminare": "6 m."
  },
  "strength": 16,
  "dexterity": 8,
  "constitution": 15,
  "intelligence": 2,
  "wisdom": 8,
  "charisma": 7,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 9
  },
  "languages": "",
  "challenge_rating": 3,
  "proficiency_bonus": 2,
  "xp": 700,
  "special_abilities": [
    {
      "name": "Sguardo Pietrificante",
      "desc": "Se una creatura inizia il suo turno entro 9 metri dal basilisco e i due possono vedersi l'un l'altro, il basilisco può costringere la creatura a effettuare un tiro salvezza su Costituzione CD 12, a condizione che il basilisco non sia incapacitato. Se fallisce il tiro salvezza, la creatura inizia magicamente a trasformarsi in pietra ed è trattenuta. Deve ripetere il tiro salvezza alla fine del suo turno successivo. In caso di successo, l'effetto termina. In caso di fallimento, la creatura è pietrificata finché non viene liberata dall'incantesimo ristorare superiore o da altra magia.\nUna creatura che non sia sorpresa può distogliere lo sguardo per evitare il tiro salvezza all'inizio del suo turno. Se lo fa, non può vedere il basilisco fino all'inizio del suo turno successivo, quando potrà distogliere nuovamente lo sguardo. Se guarda il basilisco nel frattempo, deve effettuare immediatamente il tiro salvezza.\nSe il basilisco vede il proprio riflesso entro 9 metri da sé in piena luce, si scambia per un rivale e bersaglia se stesso con il proprio sguardo.",
      "dc": {
        "dc_type": {
          "index": "con",
          "name": "COS",
          "url": "/api/2014/ability-scores/con"
        },
        "dc_value": 12,
        "success_type": "none"
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 10 (2d6 + 3) danno perforante più 7 (2d6) danno da veleno.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d6+3"
        },
        {
          "damage_type": {
            "index": "poison",
            "name": "Veleno",
            "url": "/api/2014/damage-types/poison"
          },
          "damage_dice": "2d6"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/basilisk.png",
  "url": "/api/2014/monsters/basilisk",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "bat",
  "name": "Pipistrello",
  "size": "Minuscola",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 12
    }
  ],
  "hit_points": 1,
  "hit_dice": "1d4",
  "hit_points_roll": "1d4-1",
  "speed": {
    "camminare": "1,5 m.",
    "volare": "9 m."
  },
  "strength": 2,
  "dexterity": 15,
  "constitution": 8,
  "intelligence": 2,
  "wisdom": 12,
  "charisma": 4,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "vista_cieca": "18 m.",
    "percezione_passiva": 11
  },
  "languages": "",
  "challenge_rating": 0,
  "proficiency_bonus": 2,
  "xp": 10,
  "special_abilities": [
    {
      "name": "Ecolocalizzazione",
      "desc": "Il pipistrello non può usare la sua vista cieca se è assordato.",
      "damage": []
    },
    {
      "name": "Udito Acuto",
      "desc": "Il pipistrello ha vantaggio alle prove di Saggezza (Percezione) basate sull'udito.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +0 per colpire, portata 1,5 m., una creatura. Colpito: 1 danno perforante.",
      "attack_bonus": 0,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/bat.png",
  "url": "/api/2014/monsters/bat",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "behir",
  "name": "Behir",
  "size": "Mastodontica",
  "type": "mostruosità",
  "alignment": "neutrale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 17
    }
  ],
  "hit_points": 168,
  "hit_dice": "16d12",
  "hit_points_roll": "16d12+64",
  "speed": {
    "camminare": "15 m.",
    "scalare": "12 m."
  },
  "strength": 23,
  "dexterity": 16,
  "constitution": 18,
  "intelligence": 7,
  "wisdom": 14,
  "charisma": 12,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fulmine"
  ],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "27 m.",
    "percezione_passiva": 16
  },
  "languages": "Draconico",
  "challenge_rating": 11,
  "proficiency_bonus": 4,
  "xp": 7200,
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il behir effettua due attacchi: uno con il morso e uno per stringere.",
      "actions": [
        {
          "action_name": "Bite",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Constrict",
          "count": "1",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +10 per colpire, portata 3 m., un bersaglio. Colpito: 22 (3d10 + 6) danno perforante.",
      "attack_bonus": 10,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "3d10+6"
        }
      ],
      "actions": []
    },
    {
      "name": "Stringere",
      "desc": "Attacco con Arma da Mischia: +10 per colpire, portata 1,5 m., una creatura Grande o inferiore. Colpito: 17 (2d10 + 6) danno contundente più 17 (2d10 + 6) danno tagliente. Il bersaglio è lottato (CD 16 per sfuggire) se il behir non sta già stringendo un'altra creatura, e il bersaglio è trattenuto finché la lotta non termina.",
      "attack_bonus": 10,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d10+6"
        },
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d10+6"
        }
      ],
      "actions": []
    },
    {
      "name": "Soffio di Fulmine",
      "desc": "Il behir esala una linea di fulmini lunga 6 metri e larga 1,5 metri. Ogni creatura in quella linea deve effettuare un tiro salvezza su Destrezza CD 16, subendo 66 (12d10) danni da fulmine se fallisce il tiro salvezza, o la metà se lo supera.",
      "usage": {
        "type": "recharge on roll",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 16,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "lightning",
            "name": "Fulmine",
            "url": "/api/2014/damage-types/lightning"
          },
          "damage_dice": "12d10"
        }
      ],
      "actions": []
    },
    {
      "name": "Inghiottire",
      "desc": "Il behir effettua un attacco di morso contro un bersaglio di taglia Media o inferiore che sta lottando. Se l'attacco colpisce, il bersaglio viene anche inghiottito e la lotta termina. Mentre è inghiottito, il bersaglio è accecato e trattenuto, ha copertura totale contro gli attacchi e altri effetti esterni al behir, e subisce 21 (6d6) danni da acido all'inizio di ogni turno del behir. Un behir può avere solo una creatura inghiottita alla volta.\nSe il behir subisce 30 o più danni in un singolo turno dalla creatura inghiottita, il behir deve superare un tiro salvezza su Costituzione CD 14 alla fine di quel turno o rigurgitare la creatura, che cade prona in uno spazio entro 3 metri dal behir. Se il behir muore, una creatura inghiottita non è più trattenuta da esso e può fuggire dal cadavere usando 4,5 metri di movimento, uscendo prona.",
      "damage": [
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "6d6"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/behir.png",
  "url": "/api/2014/monsters/behir",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "berserker",
  "name": "Berserker",
  "size": "Media",
  "type": "umanoide",
  "subtype": "qualsiasi razza",
  "alignment": "qualsiasi allineamento caotico",
  "armor_class": [
    {
      "type": "armatura",
      "value": 13,
      "armor": [
        {
          "index": "hide-armor",
          "name": "Armatura di Pelle",
          "url": "/api/2014/equipment/hide-armor"
        }
      ]
    }
  ],
  "hit_points": 67,
  "hit_dice": "9d8",
  "hit_points_roll": "9d8+27",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 16,
  "dexterity": 12,
  "constitution": 17,
  "intelligence": 9,
  "wisdom": 11,
  "charisma": 9,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 10
  },
  "languages": "una qualsiasi lingua (solitamente Comune)",
  "challenge_rating": 2,
  "proficiency_bonus": 2,
  "xp": 450,
  "special_abilities": [
    {
      "name": "Spericolato",
      "desc": "All'inizio del suo turno, il berserker può ottenere vantaggio a tutti i tiri per colpire con armi da mischia effettuati durante quel turno, ma i tiri per colpire contro di lui avranno vantaggio fino all'inizio del suo turno successivo.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Ascia Bipenne",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 9 (1d12 + 3) danno tagliente.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "1d12+3"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/berserker.png",
  "url": "/api/2014/monsters/berserker",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "black-bear",
  "name": "Orso Nero",
  "size": "Media",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 11
    }
  ],
  "hit_points": 19,
  "hit_dice": "3d8",
  "hit_points_roll": "3d8+6",
  "speed": {
    "camminare": "12 m.",
    "scalare": "9 m."
  },
  "strength": 15,
  "dexterity": 10,
  "constitution": 14,
  "intelligence": 2,
  "wisdom": 12,
  "charisma": 7,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 13
  },
  "languages": "",
  "challenge_rating": 0.5,
  "proficiency_bonus": 2,
  "xp": 100,
  "special_abilities": [
    {
      "name": "Olfatto Acuto",
      "desc": "L'orso ha vantaggio alle prove di Saggezza (Percezione) basate sull'olfatto.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "L'orso effettua due attacchi: uno con il morso e uno con gli artigli.",
      "actions": [
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artigli",
          "count": "1",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +3 per colpire, portata 1,5 m., un bersaglio. Colpito: 5 (1d6 + 2) danno perforante.",
      "attack_bonus": 3,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d6+2"
        }
      ],
      "actions": []
    },
    {
      "name": "Artigli",
      "desc": "Attacco con Arma da Mischia: +3 per colpire, portata 1,5 m., un bersaglio. Colpito: 7 (2d4 + 2) danno tagliente.",
      "attack_bonus": 3,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d4+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/black-bear.png",
  "url": "/api/2014/monsters/black-bear",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "black-dragon-wyrmling",
  "name": "Cucciolo di Drago Nero",
  "size": "Media",
  "type": "drago",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 17
    }
  ],
  "hit_points": 33,
  "hit_dice": "6d8",
  "hit_points_roll": "6d8+6",
  "speed": {
    "camminare": "9 m.",
    "volare": "18 m.",
    "nuotare": "9 m."
  },
  "strength": 15,
  "dexterity": 14,
  "constitution": 13,
  "intelligence": 10,
  "wisdom": 11,
  "charisma": 13,
  "proficiencies": [
    {
      "value": 4,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES",
        "url": "/api/2014/proficiencies/saving-throw-dex"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "acido"
  ],
  "condition_immunities": [],
  "senses": {
    "vista_cieca": "3 m.",
    "scurovisione": "18 m.",
    "percezione_passiva": 14
  },
  "languages": "Draconico",
  "challenge_rating": 2,
  "proficiency_bonus": 2,
  "xp": 450,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il drago può respirare sia aria che acqua.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 7 (1d10 + 2) danno perforante più 2 (1d4) danno da acido.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d10+2"
        },
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "1d4"
        }
      ],
      "actions": []
    },
    {
      "name": "Soffio Acido",
      "desc": "Il drago esala acido in una linea di 4,5 metri lunga e 1,5 metri larga. Ogni creatura in quella linea deve effettuare un tiro salvezza su Destrezza CD 11, subendo 22 (5d8) danni da acido se fallisce il tiro salvezza, o la metà se lo supera.",
      "usage": {
        "type": "recharge on roll",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 11,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "5d8"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/black-dragon-wyrmling.png",
  "url": "/api/2014/monsters/black-dragon-wyrmling",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "black-pudding",
  "name": "Budino Nero",
  "size": "Grande",
  "type": "melma",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 7
    }
  ],
  "hit_points": 85,
  "hit_dice": "10d10",
  "hit_points_roll": "10d10+30",
  "speed": {
    "camminare": "6 m.",
    "scalare": "6 m."
  },
  "strength": 16,
  "dexterity": 5,
  "constitution": 16,
  "intelligence": 1,
  "wisdom": 6,
  "charisma": 1,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "acido",
    "freddo",
    "fulmine",
    "tagliente"
  ],
  "condition_immunities": [
    {
      "index": "blinded",
      "name": "Accecato",
      "url": "/api/2014/conditions/blinded"
    },
    {
      "index": "charmed",
      "name": "Affascinato",
      "url": "/api/2014/conditions/charmed"
    },
    {
      "index": "exhaustion",
      "name": "Indebolimento",
      "url": "/api/2014/conditions/exhaustion"
    },
    {
      "index": "frightened",
      "name": "Spaventato",
      "url": "/api/2014/conditions/frightened"
    },
    {
      "index": "prone",
      "name": "Prono",
      "url": "/api/2014/conditions/prone"
    }
  ],
  "senses": {
    "vista_cieca": "18 m. (cieco oltre questo raggio)",
    "percezione_passiva": 8
  },
  "languages": "",
  "challenge_rating": 4,
  "proficiency_bonus": 2,
  "xp": 1100,
  "special_abilities": [
    {
      "name": "Amorfo",
      "desc": "Il budino può muoversi attraverso uno spazio stretto fino a 2,5 centimetri senza doversi stringere.",
      "damage": []
    },
    {
      "name": "Forma Corrosiva",
      "desc": "Una creatura che tocca il budino o lo colpisce con un attacco in mischia mentre si trova entro 1,5 metri da esso subisce 4 (1d8) danni da acido. Qualsiasi arma non magica fatta di metallo o legno che colpisce il budino si corrode. Dopo aver inflitto danno, l'arma subisce una penalità permanente e cumulativa di -1 ai tiri per il danno. Se la penalità scende a -5, l'arma è distrutta. Le munizioni non magiche fatte di metallo o legno che colpiscono il budino vengono distrutte dopo aver inflitto danno. Il budino può divorare legno o metallo non magico spesso 5 centimetri in 1 round.",
      "damage": [
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "1d8"
        }
      ]
    },
    {
      "name": "Scalare Ragno",
      "desc": "Il budino può scalare superfici difficili, inclusi i soffitti a testa in giù, senza dover effettuare prove di abilità.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Pseudopodo",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 6 (1d6 + 3) danno contundente più 18 (4d8) danno da acido. Inoltre, un'armatura non magica indossata dal bersaglio si dissolve parzialmente e subisce una penalità permanente e cumulativa di -1 alla CA che offre. L'armatura viene distrutta se la penalità riduce la sua CA a 10.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "1d6+3"
        },
        {
          "damage_type": {
            "index": "acid",
            "name": "Acido",
            "url": "/api/2014/damage-types/acid"
          },
          "damage_dice": "4d8"
        }
      ],
      "actions": []
    }
  ],
  "reactions": [
    {
      "name": "Scissione",
      "desc": "Quando un budino di taglia Media o superiore subisce danni da fulmine o taglienti, si divide in due nuovi budini se possiede almeno 10 punti ferita. Ogni nuovo budino ha punti ferita pari alla metà del budino originale, arrotondati per difetto. I nuovi budini sono di una taglia inferiore rispetto al budino originale."
    }
  ],
  "image": "/api/images/monsters/black-pudding.png",
  "url": "/api/2014/monsters/black-pudding",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": []
},
{
  "index": "cat",
  "name": "Gatto",
  "size": "Minuscola",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 12
    }
  ],
  "hit_points": 2,
  "hit_dice": "1d4",
  "hit_points_roll": "1d4",
  "speed": {
    "camminare": "12 m.",
    "scalare": "9 m."
  },
  "strength": 3,
  "dexterity": 15,
  "constitution": 10,
  "intelligence": 3,
  "wisdom": 12,
  "charisma": 7,
  "proficiencies": [
    {
      "value": 3,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 13
  },
  "languages": "",
  "challenge_rating": 0,
  "proficiency_bonus": 2,
  "xp": 10,
  "special_abilities": [
    {
      "name": "Olfatto Acuto",
      "desc": "Il gatto ha vantaggio alle prove di Saggezza (Percezione) basate sull'olfatto.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Artigli",
      "desc": "Attacco con Arma da Mischia: +0 per colpire, portata 1,5 m., un bersaglio. Colpito: 1 danno tagliente.",
      "attack_bonus": 0,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "1"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/cat.png",
  "url": "/api/2014/monsters/cat",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "centaur",
  "name": "Centauro",
  "size": "Grande",
  "type": "mostruosità",
  "alignment": "legale buono",
  "armor_class": [
    {
      "type": "des",
      "value": 12
    }
  ],
  "hit_points": 45,
  "hit_dice": "6d10",
  "hit_points_roll": "6d10+12",
  "speed": {
    "camminare": "15 m."
  },
  "strength": 18,
  "dexterity": 14,
  "constitution": 14,
  "intelligence": 9,
  "wisdom": 13,
  "charisma": 11,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "skill-athletics",
        "name": "Abilità: Atletica",
        "url": "/api/2014/proficiencies/skill-athletics"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "skill-survival",
        "name": "Abilità: Sopravvivenza",
        "url": "/api/2014/proficiencies/skill-survival"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 13
  },
  "languages": "Elfico, Silvano",
  "challenge_rating": 2,
  "proficiency_bonus": 2,
  "xp": 450,
  "special_abilities": [
    {
      "name": "Carica",
      "desc": "Se il centauro si muove di almeno 9 metri in linea retta verso un bersaglio e poi lo colpisce con un attacco di picca nello stesso turno, il bersaglio subisce 10 (3d6) danni perforanti extra.",
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "3d6"
        }
      ]
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "action_options",
      "desc": "Il centauro effettua due attacchi: uno con la sua picca e uno con i suoi zoccoli, oppure due con il suo arco lungo.",
      "action_options": {
        "choose": 1,
        "type": "action",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "multiple",
              "items": [
                {
                  "option_type": "action",
                  "action_name": "Pike",
                  "count": 1,
                  "type": "melee"
                },
                {
                  "option_type": "action",
                  "action_name": "Hooves",
                  "count": 1,
                  "type": "melee"
                }
              ]
            },
            {
              "option_type": "action",
              "action_name": "Longbow",
              "count": 2,
              "type": "ranged"
            }
          ]
        }
      },
      "actions": []
    },
    {
      "name": "Picca",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 3 m., un bersaglio. Colpito: 9 (1d10 + 4) danno perforante.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d10+4"
        }
      ],
      "actions": []
    },
    {
      "name": "Zoccoli",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 1,5 m., un bersaglio. Colpito: 11 (2d6 + 4) danno contundente.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+4"
        }
      ],
      "actions": []
    },
    {
      "name": "Arco Lungo",
      "desc": "Attacco con Arma a Gittata: +4 per colpire, gittata 45/180 m., un bersaglio. Colpito: 6 (1d8 + 2) danno perforante.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d8+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/centaur.png",
  "url": "/api/2014/monsters/centaur",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "chain-devil",
  "name": "Diavolo delle Catene",
  "size": "Media",
  "type": "immondo",
  "subtype": "diavolo",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 16
    }
  ],
  "hit_points": 85,
  "hit_dice": "10d8",
  "hit_points_roll": "10d8+40",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 18,
  "dexterity": 15,
  "constitution": 18,
  "intelligence": 11,
  "wisdom": 12,
  "charisma": 14,
  "proficiencies": [
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "freddo",
    "contundente, perforante e tagliente da attacchi non magici che non siano d'argento"
  ],
  "damage_immunities": [
    "fuoco",
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "poisoned",
      "name": "Avvelenato",
      "url": "/api/2014/conditions/poisoned"
    }
  ],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 11
  },
  "languages": "Infernale, telepatia 36 m.",
  "challenge_rating": 8,
  "proficiency_bonus": 3,
  "xp": 3900,
  "special_abilities": [
    {
      "name": "Vista del Diavolo",
      "desc": "L'oscurità magica non impedisce la scurovisione del diavolo.",
      "damage": []
    },
    {
      "name": "Resistenza Magica",
      "desc": "Il diavolo ha vantaggio ai tiri salvezza contro incantesimi e altri effetti magici.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il diavolo effettua due attacchi con le sue catene.",
      "actions": [
        {
          "action_name": "Chain",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Catena",
      "desc": "Attacco con Arma da Mischia: +8 per colpire, portata 3 m., un bersaglio. Colpito: 11 (2d6 + 4) danno tagliente. Il bersaglio è lottato (CD 14 per sfuggire) se il diavolo non sta già lottando con un'altra creatura. Finché la lotta non termina, il bersaglio è trattenuto e subisce 7 (2d6) danni perforanti all'inizio di ogni suo turno.",
      "attack_bonus": 8,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+4"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Animare Catene",
      "desc": "Fino a quattro catene che il diavolo può vedere entro 18 metri da lui sviluppano magicamente punte affilate e si animano sotto il suo controllo, a condizione che non siano indossate o trasportate.\nOgni catena animata è un oggetto con CA 20, 20 punti ferita, resistenza ai danni perforanti e immunità ai danni psichici e tuono. Quando il diavolo usa Multiattacco nel suo turno, può usare ogni catena animata per effettuare un attacco di catena aggiuntivo. Una catena animata può lottare con una creatura, ma non può effettuare attacchi mentre lotta. Una catena animata torna al suo stato inanimato se ridotta a 0 punti ferita o se il diavolo è incapacitato o muore.",
      "usage": {
        "type": "recharge after rest",
        "rest_types": [
          "short",
          "long"
        ]
      },
      "actions": []
    }
  ],
  "reactions": [
    {
      "name": "Maschera Sconvolgente",
      "desc": "Quando una creatura che il diavolo può vedere inizia il suo turno entro 9 metri dal diavolo, quest'ultimo può creare l'illusione di avere le sembianze di una persona amata defunta o di un acerrimo nemico della creatura. Se la creatura può vedere il diavolo, deve superare un tiro salvezza su Saggezza CD 14 o essere spaventata fino alla fine del suo turno.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 14,
        "success_type": "none"
      }
    }
  ],
  "image": "/api/images/monsters/chain-devil.png",
  "url": "/api/2014/monsters/chain-devil",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": []
},
{
  "index": "chimera",
  "name": "Chimera",
  "size": "Grande",
  "type": "mostruosità",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 14
    }
  ],
  "hit_points": 114,
  "hit_dice": "12d10",
  "hit_points_roll": "12d10+48",
  "speed": {
    "camminare": "9 m.",
    "volare": "18 m."
  },
  "strength": 19,
  "dexterity": 11,
  "constitution": 19,
  "intelligence": 3,
  "wisdom": 14,
  "charisma": 10,
  "proficiencies": [
    {
      "value": 8,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 18
  },
  "languages": "comprende il Draconico ma non può parlare",
  "challenge_rating": 6,
  "proficiency_bonus": 3,
  "xp": 2300,
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "action_options",
      "desc": "La chimera effettua tre attacchi: uno con il morso, uno con le corna e uno con gli artigli. Quando il suo soffio di fuoco è disponibile, può usarlo al posto del morso o delle corna.",
      "action_options": {
        "choose": 1,
        "type": "action",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "multiple",
              "items": [
                {
                  "option_type": "action",
                  "action_name": "Bite",
                  "count": 1,
                  "type": "melee"
                },
                {
                  "option_type": "action",
                  "action_name": "Horns",
                  "count": 1,
                  "type": "melee"
                },
                {
                  "option_type": "action",
                  "action_name": "Claws",
                  "count": 1,
                  "type": "melee"
                }
              ]
            },
            {
              "option_type": "multiple",
              "items": [
                {
                  "option_type": "action",
                  "action_name": "Fire Breath",
                  "count": 1,
                  "type": "ability"
                },
                {
                  "option_type": "action",
                  "action_name": "Horns",
                  "count": 1,
                  "type": "melee"
                },
                {
                  "option_type": "action",
                  "action_name": "Claws",
                  "count": 1,
                  "type": "melee"
                }
              ]
            },
            {
              "option_type": "multiple",
              "items": [
                {
                  "option_type": "action",
                  "action_name": "Bite",
                  "count": 1,
                  "type": "melee"
                },
                {
                  "option_type": "action",
                  "action_name": "Fire Breath",
                  "count": 1,
                  "type": "ability"
                },
                {
                  "option_type": "action",
                  "action_name": "Claws",
                  "count": 1,
                  "type": "melee"
                }
              ]
            }
          ]
        }
      },
      "actions": []
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +7 per colpire, portata 1,5 m., un bersaglio. Colpito: 11 (2d6 + 4) danno perforante.",
      "attack_bonus": 7,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d6+4"
        }
      ],
      "actions": []
    },
    {
      "name": "Corna",
      "desc": "Attacco con Arma da Mischia: +7 per colpire, portata 1,5 m., un bersaglio. Colpito: 10 (1d12 + 4) danno contundente.",
      "attack_bonus": 7,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "1d12+4"
        }
      ],
      "actions": []
    },
    {
      "name": "Artigli",
      "desc": "Attacco con Arma da Mischia: +7 per colpire, portata 1,5 m., un bersaglio. Colpito: 11 (2d6 + 4) danno tagliente.",
      "attack_bonus": 7,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "2d6+4"
        }
      ],
      "actions": []
    },
    {
      "name": "Soffio di Fuoco",
      "desc": "La testa di drago esala fuoco in un cono di 4,5 metri. Ogni creatura in quell'area deve effettuare un tiro salvezza su Destrezza CD 15, subendo 31 (7d8) danni da fuoco se fallisce il tiro salvezza, o la metà se lo supera.",
      "usage": {
        "type": "recharge on roll",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": {
          "index": "dex",
          "name": "DES",
          "url": "/api/2014/ability-scores/dex"
        },
        "dc_value": 15,
        "success_type": "half"
      },
      "damage": [
        {
          "damage_type": {
            "index": "fire",
            "name": "Fuoco",
            "url": "/api/2014/damage-types/fire"
          },
          "damage_dice": "7d8"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/chimera.png",
  "url": "/api/2014/monsters/chimera",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "camel",
  "name": "Cammello",
  "size": "Grande",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 9
    }
  ],
  "hit_points": 15,
  "hit_dice": "2d10",
  "hit_points_roll": "2d10+4",
  "speed": {
    "camminare": "15 m."
  },
  "strength": 16,
  "dexterity": 8,
  "constitution": 14,
  "intelligence": 2,
  "wisdom": 8,
  "charisma": 5,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 9
  },
  "languages": "",
  "challenge_rating": 0.125,
  "proficiency_bonus": 2,
  "xp": 25,
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 2 (1d4) danno contundente.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "1d4"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/camel.png",
  "url": "/api/2014/monsters/camel",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "cockatrice",
  "name": "Cockatrice",
  "size": "Piccola",
  "type": "mostruosità",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 11
    }
  ],
  "hit_points": 27,
  "hit_dice": "6d6",
  "hit_points_roll": "6d6+6",
  "speed": {
    "camminare": "6 m.",
    "volare": "12 m."
  },
  "strength": 6,
  "dexterity": 12,
  "constitution": 12,
  "intelligence": 2,
  "wisdom": 13,
  "charisma": 5,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 11
  },
  "languages": "",
  "challenge_rating": 0.5,
  "proficiency_bonus": 2,
  "xp": 100,
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +3 per colpire, portata 1,5 m., una creatura. Colpito: 3 (1d4 + 1) danno perforante e il bersaglio deve superare un tiro salvezza su Costituzione CD 11 per non essere pietrificato magicamente. Se fallisce il tiro salvezza, la creatura inizia a trasformarsi in pietra ed è trattenuta. Deve ripetere il tiro salvezza alla fine del suo turno successivo. Se lo supera, l'effetto termina. Se lo fallisce, la creatura è pietrificata per 24 ore.",
      "attack_bonus": 3,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d4+1"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/cockatrice.png",
  "url": "/api/2014/monsters/cockatrice",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "chuul",
  "name": "Chuul",
  "size": "Grande",
  "type": "aberrazione",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 16
    }
  ],
  "hit_points": 93,
  "hit_dice": "11d10",
  "hit_points_roll": "11d10+33",
  "speed": {
    "camminare": "9 m.",
    "nuotare": "9 m."
  },
  "strength": 19,
  "dexterity": 10,
  "constitution": 16,
  "intelligence": 5,
  "wisdom": 11,
  "charisma": 5,
  "proficiencies": [
    {
      "value": 4,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "poisoned",
      "name": "Avvelenato",
      "url": "/api/2014/conditions/poisoned"
    }
  ],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 14
  },
  "languages": "comprende il Gergo delle Profondità ma non può parlare",
  "challenge_rating": 4,
  "proficiency_bonus": 2,
  "xp": 1100,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il chuul può respirare sia aria che acqua.",
      "damage": []
    },
    {
      "name": "Percepire Magia",
      "desc": "Il chuul percepisce la magia entro 36 metri da sé a volontà. Questo tratto funziona come l'incantesimo individuazione del magico, ma non è di per sé magico.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "action_options",
      "desc": "Il chuul effettua due attacchi di chela. Se il chuul sta lottando con una creatura, può anche usare i suoi tentacoli una volta.",
      "action_options": {
        "choose": 1,
        "type": "action",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "action",
              "action_name": "Pincer",
              "count": 2,
              "type": "melee"
            },
            {
              "option_type": "multiple",
              "items": [
                {
                  "option_type": "action",
                  "action_name": "Pincer",
                  "count": 2,
                  "type": "melee"
                },
                {
                  "option_type": "action",
                  "action_name": "Tentacles",
                  "count": 1,
                  "type": "melee"
                }
              ]
            }
          ]
        }
      },
      "actions": []
    },
    {
      "name": "Chela",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 3 m., un bersaglio. Colpito: 11 (2d6 + 4) danno contundente. Il bersaglio è lottato (CD 14 per sfuggire) se è una creatura di taglia Grande o inferiore e il chuul non sta già lottando con altre due creature.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d6+4"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Tentacoli",
      "desc": "Una creatura lottata dal chuul deve superare un tiro salvezza su Costituzione CD 13 o essere avvelenata per 1 minuto. Finché questo veleno non termina, il bersaglio è paralizzato. Il bersaglio può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su se stesso in caso di successo.",
      "dc": {
        "dc_type": {
          "index": "con",
          "name": "COS",
          "url": "/api/2014/ability-scores/con"
        },
        "dc_value": 13,
        "success_type": "none"
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/chuul.png",
  "url": "/api/2014/monsters/chuul",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "clay-golem",
  "name": "Golem di Argilla",
  "size": "Grande",
  "type": "costrutto",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 14
    }
  ],
  "hit_points": 133,
  "hit_dice": "14d10",
  "hit_points_roll": "14d10+56",
  "speed": {
    "camminare": "6 m."
  },
  "strength": 20,
  "dexterity": 9,
  "constitution": 18,
  "intelligence": 3,
  "wisdom": 8,
  "charisma": 1,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "acido",
    "veleno",
    "psichico",
    "contundente, perforante e tagliente da attacchi non magici che non siano d'adamantio"
  ],
  "condition_immunities": [
    {
      "index": "charmed",
      "name": "Affascinato",
      "url": "/api/2014/conditions/charmed"
    },
    {
      "index": "exhaustion",
      "name": "Indebolimento",
      "url": "/api/2014/conditions/exhaustion"
    },
    {
      "index": "frightened",
      "name": "Spaventato",
      "url": "/api/2014/conditions/frightened"
    },
    {
      "index": "paralyzed",
      "name": "Paralizzato",
      "url": "/api/2014/conditions/paralyzed"
    },
    {
      "index": "petrified",
      "name": "Pietrificato",
      "url": "/api/2014/conditions/petrified"
    },
    {
      "index": "poisoned",
      "name": "Avvelenato",
      "url": "/api/2014/conditions/poisoned"
    }
  ],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 9
  },
  "languages": "comprende i linguaggi del suo creatore ma non può parlare",
  "challenge_rating": 9,
  "proficiency_bonus": 4,
  "xp": 5000,
  "special_abilities": [
    {
      "name": "Assorbimento di Acido",
      "desc": "Ogni volta che il golem subisce danni da acido, non subisce alcun danno e recupera invece un numero di punti ferita pari al danno da acido inflitto.",
      "damage": []
    },
    {
      "name": "Furia (Berserk)",
      "desc": "Ogni volta che il golem inizia il suo turno con 60 punti ferita o meno, tira un d6. Con un 6, il golem va in furia. Durante ogni suo turno in furia, il golem attacca la creatura più vicina che riesce a vedere. Se non ci sono creature abbastanza vicine da poter essere raggiunte e attaccate, il golem attacca un oggetto, preferibilmente più piccolo di lui. Una volta andato in furia, il golem continua a trovarsi in questo stato finché non viene distrutto o non recupera tutti i suoi punti ferita.",
      "damage": []
    },
    {
      "name": "Forma Immutabile",
      "desc": "Il golem è immune a qualsiasi incantesimo o effetto che possa alterare la sua forma.",
      "damage": []
    },
    {
      "name": "Resistenza Magica",
      "desc": "Il golem ha vantaggio ai tiri salvezza contro incantesimi e altri effetti magici.",
      "damage": []
    },
    {
      "name": "Armi Magiche",
      "desc": "Gli attacchi con arma del golem sono magici.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il golem effettua due attacchi di schianto.",
      "actions": [
        {
          "action_name": "Slam",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Schianto",
      "desc": "Attacco con Arma da Mischia: +8 per colpire, portata 1,5 m., un bersaglio. Colpito: 16 (2d10 + 5) danni contundenti. Se il bersaglio è una creatura, deve superare un tiro salvezza su Costituzione CD 15 o il suo massimo dei punti ferita viene ridotto di un ammontare pari al danno subito. Il bersaglio muore se questo attacco riduce il suo massimo dei punti ferita a 0. La riduzione dura finché non viene rimossa dall'incantesimo ristorare superiore o da altra magia.",
      "attack_bonus": 8,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "2d10+5"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Velocità",
      "desc": "Fino alla fine del suo turno successivo, il golem guadagna magicamente un bonus di +2 alla sua CA, ha vantaggio ai tiri salvezza su Destrezza e può usare il suo attacco di schianto come azione bonus.",
      "usage": {
        "type": "recharge on roll",
        "dice": "1d6",
        "min_value": 5
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/clay-golem.png",
  "url": "/api/2014/monsters/clay-golem",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "cloaker",
  "name": "Manto",
  "size": "Grande",
  "type": "aberrazione",
  "alignment": "caotico neutrale",
  "armor_class": [
    {
      "type": "naturale",
      "value": 14
    }
  ],
  "hit_points": 78,
  "hit_dice": "12d10",
  "hit_points_roll": "12d10+12",
  "speed": {
    "camminare": "3 m.",
    "volare": "12 m."
  },
  "strength": 17,
  "dexterity": 15,
  "constitution": 12,
  "intelligence": 13,
  "wisdom": 12,
  "charisma": 14,
  "proficiencies": [
    {
      "value": 5,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 11
  },
  "languages": "Gergo delle Profondità, Comune Sotterraneo",
  "challenge_rating": 8,
  "proficiency_bonus": 3,
  "xp": 3900,
  "special_abilities": [
    {
      "name": "Trasferimento del Danno",
      "desc": "Mentre è attaccato a una creatura, il manto subisce solo la metà del danno inflittogli (arrotondata per difetto) e quella creatura subisce l'altra metà.",
      "damage": []
    },
    {
      "name": "Falsa Apparenza",
      "desc": "Finché il manto rimane immobile senza esporre il proprio ventre, è indistinguibile da un mantello di cuoio scuro.",
      "damage": []
    },
    {
      "name": "Sensibilità alla Luce",
      "desc": "Mentre si trova in piena luce, il manto ha svantaggio ai tiri per colpire e alle prove di Saggezza (Percezione) basate sulla vista.",
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il manto effettua due attacchi: uno con il morso e uno con la coda.",
      "actions": [
        {
          "action_name": "Bite",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Tail",
          "count": "1",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 1,5 m., una creatura. Colpito: 10 (2d6 + 3) danni perforanti e, se il bersaglio è di taglia Grande o inferiore, il manto vi si attacca. Se il manto ha vantaggio contro il bersaglio, si attacca alla testa del bersaglio, che risulta accecato e impossibilitato a respirare finché il manto rimane attaccato. Mentre è attaccato, il manto può effettuare questo attacco solo contro il bersaglio e ha vantaggio al tiro per colpire. Il manto può staccarsi spendendo 1,5 metri del suo movimento. Una creatura, incluso il bersaglio, può usare la propria azione per staccare il manto superando una prova di Forza CD 16.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "2d6+3"
        }
      ],
      "actions": []
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 3 m., una creatura. Colpito: 7 (1d8 + 3) danni taglienti.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "1d8+3"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Lamento",
      "desc": "Ogni creatura entro 18 metri dal manto che possa udire il suo lamento e che non sia un'aberrazione deve superare un tiro salvezza su Saggezza CD 13 o essere spaventata fino alla fine del turno successivo del manto. Se il tiro salvezza di una creatura ha successo, la creatura è immune al lamento del manto per le successive 24 ore.",
      "dc": {
        "dc_type": {
          "index": "wis",
          "name": "SAG",
          "url": "/api/2014/ability-scores/wis"
        },
        "dc_value": 13,
        "success_type": "none"
      },
      "actions": []
    },
    {
      "damage": [],
      "name": "Fantasmi",
      "desc": "Il manto crea magicamente tre duplicati illusori di se stesso se non si trova in piena luce. I duplicati si muovono con lui e ne mimano le azioni, cambiando posizione in modo da rendere impossibile capire quale sia il vero manto. Se il manto si trova in un'area di luce intensa, i duplicati svaniscono.\nOgni volta che una creatura bersaglia il manto con un attacco o un incantesimo dannoso mentre è presente un duplicato, quella creatura tira a caso per determinare se bersaglia il manto o uno dei duplicati. Una creatura non è influenzata da questo effetto magico se non può vedere o se si affida a sensi diversi dalla vista.\nUn duplicato ha la CA del manto e usa i suoi tiri salvezza. Se un attacco colpisce un duplicato, o se un duplicato fallisce un tiro salvezza contro un effetto che infligge danni, il duplicato svanisce.",
      "usage": {
        "type": "recharge after rest",
        "rest_types": [
          "short",
          "long"
        ]
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/cloaker.png",
  "url": "/api/2014/monsters/cloaker",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "cloud-giant",
  "name": "Gigante delle Nuvole",
  "size": "Mastodontica",
  "type": "gigante",
  "alignment": "neutrale buono (50%) o neutrale malvagio (50%)",
  "armor_class": [
    {
      "type": "naturale",
      "value": 14
    }
  ],
  "hit_points": 200,
  "hit_dice": "16d12",
  "hit_points_roll": "16d12+96",
  "speed": {
    "camminare": "12 m."
  },
  "strength": 27,
  "dexterity": 10,
  "constitution": 22,
  "intelligence": 12,
  "wisdom": 16,
  "charisma": 16,
  "proficiencies": [
    {
      "value": 10,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS",
        "url": "/api/2014/proficiencies/saving-throw-con"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG",
        "url": "/api/2014/proficiencies/saving-throw-wis"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR",
        "url": "/api/2014/proficiencies/saving-throw-cha"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-insight",
        "name": "Abilità: Intuizione",
        "url": "/api/2014/proficiencies/skill-insight"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione",
        "url": "/api/2014/proficiencies/skill-perception"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 17
  },
  "languages": "Comune, Gigante",
  "challenge_rating": 9,
  "proficiency_bonus": 4,
  "xp": 5000,
  "special_abilities": [
    {
      "name": "Olfatto Acuto",
      "desc": "Il gigante ha vantaggio alle prove di Saggezza (Percezione) basate sull'olfatto.",
      "damage": []
    },
    {
      "name": "Lancio degli Incantesimi Innato",
      "desc": "La caratteristica da incantatore innata del gigante è il Carisma. Il gigante può lanciare innatamente i seguenti incantesimi, senza bisogno di componenti materiali:\n\nA volontà: individuazione del magico, nubi di nebbia, luce\n3 al giorno ciascuno: caduta morbida, volare, passo velato, telecinesi\n1 al giorno ciascuno: controllare il clima, forma gassosa",
      "spellcasting": {
        "ability": {
          "index": "cha",
          "name": "CAR",
          "url": "/api/2014/ability-scores/cha"
        },
        "components_required": [
          "V",
          "S"
        ],
        "spells": [
          { "name": "Individuazione del Magico", "level": 1, "usage": { "type": "a volontà" } },
          { "name": "Nubi di Nebbia", "level": 1, "usage": { "type": "a volontà" } },
          { "name": "Luce", "level": 0, "usage": { "type": "a volontà" } },
          { "name": "Caduta Morbida", "level": 1, "usage": { "type": "per day", "times": 3 } },
          { "name": "Volare", "level": 3, "usage": { "type": "per day", "times": 3 } },
          { "name": "Passo Velato", "level": 2, "usage": { "type": "per day", "times": 3 } },
          { "name": "Telecinesi", "level": 5, "usage": { "type": "per day", "times": 3 } },
          { "name": "Controllare il Clima", "level": 8, "usage": { "type": "per day", "times": 1 } },
          { "name": "Forma Gassosa", "level": 3, "usage": { "type": "per day", "times": 1 } }
        ]
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il gigante effettua due attacchi di mazzafrusto.",
      "actions": [
        {
          "action_name": "Morningstar",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Mazzafrusto",
      "desc": "Attacco con Arma da Mischia: +12 per colpire, portata 3 m., un bersaglio. Colpito: 21 (3d8 + 8) danni perforanti.",
      "attack_bonus": 12,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante"
          },
          "damage_dice": "3d8+8"
        }
      ],
      "actions": []
    },
    {
      "name": "Masso",
      "desc": "Attacco con Arma a Gittata: +12 per colpire, gittata 18/72 m., un bersaglio. Colpito: 30 (4d10 + 8) danni contundenti.",
      "attack_bonus": 12,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente"
          },
          "damage_dice": "4d10+8"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/cloud-giant.png",
  "url": "/api/2014/monsters/cloud-giant",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "cultist",
  "name": "Cultista",
  "desc": "I cultisti giurano fedeltà a poteri oscuri come principi elementali, signori dei demoni o arcidiavoli. La maggior parte di loro nasconde la propria lealtà per evitare di essere ostracizzata, imprigionata o giustiziata per le proprie convinzioni. A differenza degli accoliti malvagi, i cultisti mostrano spesso segni di follia nelle loro credenze e pratiche.",
  "size": "Media",
  "type": "umanoide",
  "subtype": "qualsiasi razza",
  "alignment": "qualsiasi allineamento non buono",
  "armor_class": [
    {
      "type": "armatura",
      "value": 12,
      "armor": [
        {
          "index": "leather-armor",
          "name": "Armatura di Cuoio",
          "url": "/api/2014/equipment/leather-armor"
        }
      ]
    }
  ],
  "hit_points": 9,
  "hit_dice": "2d8",
  "hit_points_roll": "2d8",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 11,
  "dexterity": 12,
  "constitution": 10,
  "intelligence": 10,
  "wisdom": 11,
  "charisma": 10,
  "proficiencies": [
    {
      "value": 2,
      "proficiency": {
        "index": "skill-deception",
        "name": "Abilità: Inganno",
        "url": "/api/2014/proficiencies/skill-deception"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "skill-religion",
        "name": "Abilità: Religione",
        "url": "/api/2014/proficiencies/skill-religion"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 10
  },
  "languages": "una lingua qualsiasi (solitamente il Comune)",
  "challenge_rating": 0.125,
  "proficiency_bonus": 2,
  "xp": 25,
  "special_abilities": [
    {
      "name": "Oscura Devozione",
      "desc": "Il cultista ha vantaggio ai tiri salvezza per non essere affascinato o spaventato.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Scimitarra",
      "desc": "Attacco con Arma da Mischia: +3 per colpire, portata 1,5 m., una creatura. Colpito: 4 (1d6 + 1) danni taglienti.",
      "attack_bonus": 3,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente",
            "url": "/api/2014/damage-types/slashing"
          },
          "damage_dice": "1d6+1"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/cultist.png",
  "url": "/api/2014/monsters/cultist",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "commoner",
  "name": "Popolano",
  "desc": "I popolani includono contadini, servi della gleba, schiavi, servitori, pellegrini, mercanti, artigiani ed eremiti.",
  "size": "Media",
  "type": "umanoide",
  "subtype": "qualsiasi razza",
  "alignment": "qualsiasi allineamento",
  "armor_class": [
    {
      "type": "des",
      "value": 10
    }
  ],
  "hit_points": 4,
  "hit_dice": "1d8",
  "hit_points_roll": "1d8",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 10,
  "dexterity": 10,
  "constitution": 10,
  "intelligence": 10,
  "wisdom": 10,
  "charisma": 10,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 10
  },
  "languages": "una lingua qualsiasi (solitamente il Comune)",
  "challenge_rating": 0,
  "proficiency_bonus": 2,
  "xp": 10,
  "actions": [
    {
      "name": "Randello",
      "desc": "Attacco con Arma da Mischia: +2 per colpire, portata 1,5 m., un bersaglio. Colpito: 2 (1d4) danni contundenti.",
      "attack_bonus": 2,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "1d4"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/commoner.png",
  "url": "/api/2014/monsters/commoner",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "constrictor-snake",
  "name": "Serpente Costrittore",
  "size": "Grande",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 12
    }
  ],
  "hit_points": 13,
  "hit_dice": "2d10",
  "hit_points_roll": "2d10+2",
  "speed": {
    "camminare": "9 m.",
    "nuotare": "9 m."
  },
  "strength": 15,
  "dexterity": 14,
  "constitution": 12,
  "intelligence": 1,
  "wisdom": 10,
  "charisma": 3,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_tellurica": "3 m.",
    "percezione_passiva": 10
  },
  "languages": "",
  "challenge_rating": 0.25,
  "proficiency_bonus": 2,
  "xp": 50,
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., una creatura. Colpito: 5 (1d6 + 2) danni perforanti.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d6+2"
        }
      ],
      "actions": []
    },
    {
      "name": "Stritolamento",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., una creatura. Colpito: 6 (1d8 + 2) danni contundenti e il bersaglio è lottato (CD 14 per sfuggire). Finché la lotta non termina, la creatura è trattenuta e il serpente non può stritolare un altro bersaglio.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "1d8+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/constrictor-snake.png",
  "url": "/api/2014/monsters/constrictor-snake",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "couatl",
  "name": "Couatl",
  "size": "Media",
  "type": "celestiale",
  "alignment": "legale buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 19
    }
  ],
  "hit_points": 97,
  "hit_dice": "13d8",
  "hit_points_roll": "13d8+39",
  "speed": {
    "camminare": "9 m.",
    "volare": "27 m."
  },
  "strength": 16,
  "dexterity": 20,
  "constitution": 17,
  "intelligence": 18,
  "wisdom": 20,
  "charisma": 18,
  "proficiencies": [
    {
      "value": 5,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG"
      }
    },
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "radioso"
  ],
  "damage_immunities": [
    "psichico",
    "contundente, perforante e tagliente da attacchi non magici"
  ],
  "condition_immunities": [],
  "senses": {
    "visione_pura": "36 m.",
    "percezione_passiva": 15
  },
  "languages": "tutte, telepatia 36 m.",
  "challenge_rating": 4,
  "proficiency_bonus": 2,
  "xp": 1100,
  "special_abilities": [
    {
      "name": "Lancio degli Incantesimi Innato",
      "desc": "La caratteristica da incantatore innata del couatl è il Carisma (CD del tiro salvezza degli incantesimi 14). Il couatl può lanciare innatamente i seguenti incantesimi, che richiedono solo componenti verbali:\n\nA volontà: individuazione del bene e del male, individuazione del magico, individuazione dei pensieri\n3 al giorno ciascuno: benedizione, creare cibo e acqua, cura ferite, ristorare inferiore, protezione dal veleno, santuario, scudo\n1 al giorno ciascuno: sogno, ristorare superiore, scrutare",
      "spellcasting": {
        "ability": {
          "index": "cha",
          "name": "CAR"
        },
        "dc": 14,
        "components_required": [
          "V"
        ],
        "spells": [
          { "name": "Individuazione del Bene e del Male", "level": 1, "usage": { "type": "a volontà" } },
          { "name": "Individuazione del Magico", "level": 1, "usage": { "type": "a volontà" } },
          { "name": "Individuazione dei Pensieri", "level": 2, "usage": { "type": "a volontà" } },
          { "name": "Benedizione", "level": 1, "usage": { "type": "per day", "times": 3 } },
          { "name": "Creare Cibo e Acqua", "level": 3, "usage": { "type": "per day", "times": 3 } },
          { "name": "Cura Ferite", "level": 1, "usage": { "type": "per day", "times": 3 } },
          { "name": "Ristorare Inferiore", "level": 2, "usage": { "type": "per day", "times": 3 } },
          { "name": "Protezione dal Veleno", "level": 2, "usage": { "type": "per day", "times": 3 } },
          { "name": "Santuario", "level": 1, "usage": { "type": "per day", "times": 3 } },
          { "name": "Scudo", "level": 1, "usage": { "type": "per day", "times": 3 } },
          { "name": "Sogno", "level": 5, "usage": { "type": "per day", "times": 1 } },
          { "name": "Ristorare Superiore", "level": 5, "usage": { "type": "per day", "times": 1 } },
          { "name": "Scrutare", "level": 5, "usage": { "type": "per day", "times": 1 } }
        ]
      },
      "damage": []
    },
    {
      "name": "Armi Magiche",
      "desc": "Gli attacchi con arma del couatl sono magici.",
      "damage": []
    },
    {
      "name": "Mente Schermata",
      "desc": "Il couatl è immune allo scrutamento e a qualsiasi effetto che possa percepire le sue emozioni, leggere i suoi pensieri o individuare la sua posizione.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +8 per colpire, portata 1,5 m., una creatura. Colpito: 8 (1d6 + 5) danni perforanti e il bersaglio deve superare un tiro salvezza su Costituzione CD 13 o essere avvelenato per 24 ore. Finché è avvelenato in questo modo, il bersaglio è privo di sensi. Un'altra creatura può usare un'azione per scuotere il bersaglio e svegliarlo.",
      "attack_bonus": 8,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante"
          },
          "damage_dice": "1d6+5"
        }
      ],
      "actions": []
    },
    {
      "name": "Stritolamento",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 3 m., una creatura di taglia Media o inferiore. Colpito: 10 (2d6 + 3) danni contundenti e il bersaglio è lottato (CD 15 per sfuggire). Finché la lotta non termina, il bersaglio è trattenuto e il couatl non può stritolare un altro bersaglio.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente"
          },
          "damage_dice": "2d6+3"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Mutaforma",
      "desc": "Il couatl si trasforma magicamente in un umanoide o in una bestia con un grado di sfida pari o inferiore al proprio, oppure torna nella sua vera forma. Se muore, ritorna nella sua vera forma. Qualsiasi equipaggiamento indossi o trasporti viene assorbito o indossato dalla nuova forma (a scelta del couatl).\nNella nuova forma, il couatl mantiene le sue statistiche di gioco e la capacità di parlare, ma la sua CA, le modalità di movimento, la Forza, la Destrezza e le altre azioni sono sostituite da quelle della nuova forma, e guadagna tutte le statistiche e le capacità (tranne privilegi di classe, azioni leggendarie e azioni della tana) che la nuova forma possiede ma che a lui mancano. Se la nuova forma ha un attacco di morso, il couatl può usare il suo morso in quella forma.",
      "actions": []
    }
  ],
  "image": "/api/images/monsters/couatl.png",
  "url": "/api/2014/monsters/couatl",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "copper-dragon-wyrmling",
  "name": "Cucciolo di Drago di Rame",
  "size": "Media",
  "type": "drago",
  "alignment": "caotico buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 16
    }
  ],
  "hit_points": 22,
  "hit_dice": "4d8",
  "hit_points_roll": "4d8+4",
  "speed": {
    "camminare": "9 m.",
    "scalare": "9 m.",
    "volare": "18 m."
  },
  "strength": 15,
  "dexterity": 12,
  "constitution": 13,
  "intelligence": 14,
  "wisdom": 11,
  "charisma": 13,
  "proficiencies": [
    {
      "value": 3,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "acido"
  ],
  "condition_immunities": [],
  "senses": {
    "percezione_tellurica": "3 m.",
    "scurovisione": "18 m.",
    "percezione_passiva": 14
  },
  "languages": "Draconico",
  "challenge_rating": 1,
  "proficiency_bonus": 2,
  "xp": 200,
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 7 (1d10 + 2) danni perforanti.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante"
          },
          "damage_dice": "1d10+2"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Armi a Soffio",
      "desc": "Il drago usa una delle seguenti armi a soffio.\nSoffio di Acido. Il drago esala acido in una linea di 6 metri lunga e 1,5 metri larga. Ogni creatura in quella linea deve effettuare un tiro salvezza su Destrezza CD 11, subendo 18 (4d8) danni da acido con un tiro salvezza fallito, o la metà con uno riuscito.\nSoffio Rallentante. Il drago esala gas in un cono di 4,5 metri. Ogni creatura in quell'area deve superare un tiro salvezza su Costituzione CD 11. Se lo fallisce, la creatura non può usare reazioni, la sua velocità è dimezzata e non può effettuare più di un attacco nel proprio turno. Inoltre, la creatura può usare o un'azione o un'azione bonus nel proprio turno, ma non entrambe. Questi effetti durano per 1 minuto. La creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su se stessa con un successo.",
      "usage": {
        "type": "recharge on roll",
        "dice": "1d6",
        "min_value": 5
      },
      "options": {
        "choose": 1,
        "type": "attack",
        "from": {
          "option_set_type": "options_array",
          "options": [
            {
              "option_type": "breath",
              "name": "Soffio di Acido",
              "dc": {
                "dc_type": { "index": "dex", "name": "DES" },
                "dc_value": 11,
                "success_type": "half"
              },
              "damage": [
                {
                  "damage_type": { "index": "acid", "name": "Acido" },
                  "damage_dice": "4d8"
                }
              ]
            },
            {
              "option_type": "breath",
              "name": "Soffio Rallentante",
              "dc": {
                "dc_type": { "index": "con", "name": "COS" },
                "dc_value": 11,
                "success_type": "none"
              }
            }
          ]
        }
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/copper-dragon-wyrmling.png",
  "url": "/api/2014/monsters/copper-dragon-wyrmling",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "crocodile",
  "name": "Coccodrillo",
  "size": "Grande",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 12
    }
  ],
  "hit_points": 19,
  "hit_dice": "3d10",
  "hit_points_roll": "3d10+3",
  "speed": {
    "camminare": "6 m.",
    "nuotare": "6 m."
  },
  "strength": 15,
  "dexterity": 10,
  "constitution": 13,
  "intelligence": 2,
  "wisdom": 10,
  "charisma": 5,
  "proficiencies": [
    {
      "value": 2,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 10
  },
  "languages": "",
  "challenge_rating": 0.5,
  "proficiency_bonus": 2,
  "xp": 100,
  "special_abilities": [
    {
      "name": "Trattenere il Respiro",
      "desc": "Il coccodrillo può trattenere il respiro per 15 minuti.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., una creatura. Colpito: 7 (1d10 + 2) danni perforanti e il bersaglio è lottato (CD 12 per sfuggire). Finché la lotta non termina, il bersaglio è trattenuto e il coccodrillo non può mordere un altro bersaglio.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d10+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/crocodile.png",
  "url": "/api/2014/monsters/crocodile",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "cult-fanatic",
  "name": "Fanatico del Culto",
  "desc": "I fanatici fanno spesso parte della leadership di un culto, usando il loro carisma e i loro dogmi per influenzare e depredare chi ha una volontà debole. La maggior parte di loro è interessata al potere personale sopra ogni altra cosa.",
  "size": "Media",
  "type": "umanoide",
  "subtype": "qualsiasi razza",
  "alignment": "qualsiasi allineamento non buono",
  "armor_class": [
    {
      "type": "armatura",
      "value": 13,
      "armor": [
        {
          "index": "leather-armor",
          "name": "Armatura di Cuoio",
          "url": "/api/2014/equipment/leather-armor"
        }
      ]
    }
  ],
  "hit_points": 22,
  "hit_dice": "6d8",
  "hit_points_roll": "6d8-5",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 11,
  "dexterity": 14,
  "constitution": 12,
  "intelligence": 10,
  "wisdom": 13,
  "charisma": 14,
  "proficiencies": [
    {
      "value": 4,
      "proficiency": {
        "index": "skill-deception",
        "name": "Abilità: Inganno"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-persuasion",
        "name": "Abilità: Persuasione"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "skill-religion",
        "name": "Abilità: Religione"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 11
  },
  "languages": "una lingua qualsiasi (solitamente il Comune)",
  "challenge_rating": 2,
  "proficiency_bonus": 2,
  "xp": 450,
  "special_abilities": [
    {
      "name": "Oscura Devozione",
      "desc": "Il fanatico ha vantaggio ai tiri salvezza per non essere affascinato o spaventato.",
      "damage": []
    },
    {
      "name": "Incantesimi",
      "desc": "Il fanatico è un incantatore di 4° livello. La sua caratteristica da incantatore è la Saggezza (CD del tiro salvezza degli incantesimi 11, +3 a colpire con gli attacchi dell'incantesimo). Il fanatico ha preparato i seguenti incantesimi da chierico:\n\nTrucchetti (a volontà): luce, fiamma sacra, taumaturgia\n- 1° livello (4 slot): comando, infliggi ferite, scudo della fede\n- 2° livello (3 slot): blocca persone, arma spirituale",
      "spellcasting": {
        "level": 4,
        "ability": {
          "index": "wis",
          "name": "SAG"
        },
        "dc": 11,
        "modifier": 3,
        "components_required": ["V", "S", "M"],
        "school": "chierico",
        "slots": {
          "1": 4,
          "2": 3
        },
        "spells": [
          { "name": "Luce", "level": 0 },
          { "name": "Fiamma Sacra", "level": 0 },
          { "name": "Taumaturgia", "level": 0 },
          { "name": "Comando", "level": 1 },
          { "name": "Infliggi Ferite", "level": 1 },
          { "name": "Scudo della Fede", "level": 1 },
          { "name": "Blocca Persone", "level": 2 },
          { "name": "Arma Spirituale", "level": 2 }
        ]
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "damage": [],
      "name": "Multiattacco",
      "multiattack_type": "actions",
      "desc": "Il fanatico effettua due attacchi in mischia.",
      "actions": [
        {
          "action_name": "Pugnale",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Pugnale",
      "desc": "Attacco con Arma da Mischia o a Gittata: +4 per colpire, portata 1,5 m. o gittata 6/18 m., una creatura. Colpito: 4 (1d4 + 2) danni perforanti.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante"
          },
          "damage_dice": "1d4+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/cult-fanatic.png",
  "url": "/api/2014/monsters/cult-fanatic",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "crab",
  "name": "Granchio",
  "size": "Minuscola",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 11
    }
  ],
  "hit_points": 2,
  "hit_dice": "1d4",
  "hit_points_roll": "1d4",
  "speed": {
    "camminare": "6 m.",
    "nuotare": "6 m."
  },
  "strength": 2,
  "dexterity": 11,
  "constitution": 10,
  "intelligence": 1,
  "wisdom": 8,
  "charisma": 2,
  "proficiencies": [
    {
      "value": 2,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività",
        "url": "/api/2014/proficiencies/skill-stealth"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_tellurica": "9 m.",
    "percezione_passiva": 9
  },
  "languages": "",
  "challenge_rating": 0,
  "proficiency_bonus": 2,
  "xp": 10,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "Il granchio può respirare sia in aria che in acqua.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Chela",
      "desc": "Attacco con Arma da Mischia: +0 per colpire, portata 1,5 m., un bersaglio. Colpito: 1 danno contundente.",
      "attack_bonus": 0,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente",
            "url": "/api/2014/damage-types/bludgeoning"
          },
          "damage_dice": "1"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/crab.png",
  "url": "/api/2014/monsters/crab",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "deer",
  "name": "Cervo",
  "size": "Media",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 13
    }
  ],
  "hit_points": 4,
  "hit_dice": "1d8",
  "hit_points_roll": "1d8",
  "speed": {
    "camminare": "15 m."
  },
  "strength": 11,
  "dexterity": 16,
  "constitution": 11,
  "intelligence": 2,
  "wisdom": 14,
  "charisma": 5,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 12
  },
  "languages": "",
  "challenge_rating": 0,
  "proficiency_bonus": 2,
  "xp": 10,
  "actions": [
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +2 per colpire, portata 1,5 m., un bersaglio. Colpito: 2 (1d4) danni perforanti.",
      "attack_bonus": 2,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante",
            "url": "/api/2014/damage-types/piercing"
          },
          "damage_dice": "1d4"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/deer.png",
  "url": "/api/2014/monsters/deer",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "deva",
  "name": "Deva",
  "size": "Media",
  "type": "celestiale",
  "alignment": "legale buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 17
    }
  ],
  "hit_points": 136,
  "hit_dice": "16d8",
  "hit_points_roll": "16d8+64",
  "speed": {
    "camminare": "9 m.",
    "volare": "27 m."
  },
  "strength": 18,
  "dexterity": 18,
  "constitution": 18,
  "intelligence": 17,
  "wisdom": 20,
  "charisma": 20,
  "proficiencies": [
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "skill-insight",
        "name": "Abilità: Intuizione"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "radioso",
    "contundente, perforante e tagliente da attacchi non magici"
  ],
  "damage_immunities": [],
  "condition_immunities": [
    { "index": "charmed", "name": "Affascinato" },
    { "index": "exhaustion", "name": "Indebolimento" },
    { "index": "frightened", "name": "Spaventato" }
  ],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 19
  },
  "languages": "tutte, telepatia 36 m.",
  "challenge_rating": 10,
  "proficiency_bonus": 4,
  "xp": 5900,
  "special_abilities": [
    {
      "name": "Armi Angeliche",
      "desc": "Gli attacchi con arma del deva sono magici. Quando il deva colpisce con un'arma, l'arma infligge 4d8 danni radiosi extra (inclusi nell'attacco).",
      "damage": []
    },
    {
      "name": "Lancio degli Incantesimi Innato",
      "desc": "La caratteristica da incantatore innata del deva è il Carisma (CD del tiro salvezza degli incantesimi 17). Il deva può lanciare innatamente i seguenti incantesimi, che richiedono solo componenti verbali:\nA volontà: individuazione del bene e del male\n1 al giorno ciascuno: comunione, rianimare morti",
      "spellcasting": {
        "ability": { "index": "cha", "name": "CAR" },
        "dc": 17,
        "components_required": ["V"],
        "spells": [
          { "name": "Individuazione del Bene e del Male", "level": 1, "usage": { "type": "a volontà" } },
          { "name": "Comunione", "level": 5, "usage": { "type": "per day", "times": 1 } },
          { "name": "Rianimare Morti", "level": 5, "usage": { "type": "per day", "times": 1 } }
        ]
      },
      "damage": []
    },
    {
      "name": "Resistenza Magica",
      "desc": "Il deva ha vantaggio ai tiri salvezza contro incantesimi e altri effetti magici.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "Il deva effettua due attacchi in mischia.",
      "actions": [ { "action_name": "Mazza", "count": "2", "type": "melee" } ]
    },
    {
      "name": "Mazza",
      "desc": "Attacco con Arma da Mischia: +8 per colpire, portata 1,5 m., un bersaglio. Colpito: 7 (1d6 + 4) danni contundenti più 18 (4d8) danni radiosi.",
      "attack_bonus": 8,
      "damage": [
        { "damage_type": { "name": "Contundente" }, "damage_dice": "1d6+4" },
        { "damage_type": { "name": "Radioso" }, "damage_dice": "4d8" }
      ]
    },
    {
      "name": "Tocco Guaritore",
      "desc": "Il deva tocca un'altra creatura. Il bersaglio recupera magicamente 20 (4d8 + 2) punti ferita ed è liberato da ogni maledizione, malattia, veleno, cecità o sordità.",
      "usage": { "type": "per day", "times": 3 }
    },
    {
      "name": "Mutaforma",
      "desc": "Il deva si trasforma magicamente in un umanoide o in una bestia con un grado di sfida pari o inferiore al proprio, oppure torna nella sua vera forma. Torna nella sua vera forma se muore. Qualsiasi equipaggiamento indossi o trasporti viene assorbito o indossato dalla nuova forma (a scelta del deva).\nNella nuova forma, il deva mantiene le sue statistiche di gioco e la capacità di parlare, ma la sua CA, le modalità di movimento, la Forza, la Destrezza e i sensi speciali sono sostituiti da quelli della nuova forma, e guadagna tutte le statistiche e le capacità (tranne privilegi di classe, azioni leggendarie e azioni della tana) che la nuova forma possiede ma che a lui mancano.",
      "actions": []
    }
  ],
  "image": "/api/images/monsters/deva.png",
  "url": "/api/2014/monsters/deva",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "deep-gnome-svirfneblin",
  "name": "Gnomo delle Profondità (Svirfneblin)",
  "size": "Piccola",
  "type": "umanoide",
  "subtype": "gnomo",
  "alignment": "neutrale buono",
  "armor_class": [
    {
      "type": "armatura",
      "value": 15,
      "armor": [
        {
          "index": "chain-shirt",
          "name": "Camicia di Maglia"
        }
      ]
    }
  ],
  "hit_points": 16,
  "hit_dice": "3d6",
  "hit_points_roll": "3d6+6",
  "speed": {
    "camminare": "6 m."
  },
  "strength": 15,
  "dexterity": 14,
  "constitution": 14,
  "intelligence": 12,
  "wisdom": 10,
  "charisma": 9,
  "proficiencies": [
    {
      "value": 3,
      "proficiency": {
        "index": "skill-investigation",
        "name": "Abilità: Indagare"
      }
    },
    {
      "value": 2,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 12
  },
  "languages": "Gnomesco, Terran, Sottocomune",
  "challenge_rating": 0.5,
  "proficiency_bonus": 2,
  "xp": 50,
  "special_abilities": [
    {
      "name": "Camuffamento di Pietra",
      "desc": "Lo gnomo ha vantaggio alle prove di Destrezza (Furtività) effettuate per nascondersi in terreni rocciosi.",
      "damage": []
    },
    {
      "name": "Astuzia Gnomesca",
      "desc": "Lo gnomo ha vantaggio ai tiri salvezza di Intelligenza, Saggezza e Carisma contro la magia.",
      "damage": []
    },
    {
      "name": "Lancio degli Incantesimi Innato",
      "desc": "La caratteristica da incantatore innata dello gnomo è l'Intelligenza (CD del tiro salvezza degli incantesimi 11). Lo gnomo può lanciare innatamente i seguenti incantesimi, senza bisogno di componenti materiali:\n\nA volontà: antindividuazione (solo su se stesso)\n1 al giorno ciascuno: cecità/sordità, sfocatura, camuffare se stesso",
      "spellcasting": {
        "ability": { "index": "int", "name": "INT" },
        "dc": 11,
        "components_required": ["V", "S"],
        "spells": [
          { "name": "Antindividuazione", "level": 3, "usage": { "type": "at will" } },
          { "name": "Cecità/Sordità", "level": 2, "usage": { "type": "per day", "times": 1 } },
          { "name": "Sfocatura", "level": 2, "usage": { "type": "per day", "times": 1 } },
          { "name": "Camuffare Se Stesso", "level": 1, "usage": { "type": "per day", "times": 1 } }
        ]
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Piccone da Guerra",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 6 (1d8 + 2) danni perforanti.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": { "index": "piercing", "name": "Perforante" },
          "damage_dice": "1d8+2"
        }
      ],
      "actions": []
    },
    {
      "name": "Dardo Avvelenato",
      "desc": "Attacco con Arma a Gittata: +4 per colpire, gittata 9/36 m., una creatura. Colpito: 4 (1d4 + 2) danni perforanti e il bersaglio deve superare un tiro salvezza su Costituzione CD 12 o essere avvelenato per 1 minuto. Il bersaglio può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su se stesso con un successo.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": { "index": "piercing", "name": "Perforante" },
          "damage_dice": "1d4+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/deep-gnome-svirfneblin.png",
  "url": "/api/2014/monsters/deep-gnome-svirfneblin",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "darkmantle",
  "name": "Manto Oscuro",
  "size": "Piccola",
  "type": "mostruosità",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 11
    }
  ],
  "hit_points": 22,
  "hit_dice": "5d6",
  "hit_points_roll": "5d6+5",
  "speed": {
    "camminare": "3 m.",
    "volare": "9 m."
  },
  "strength": 16,
  "dexterity": 12,
  "constitution": 13,
  "intelligence": 2,
  "wisdom": 10,
  "charisma": 5,
  "proficiencies": [
    {
      "value": 3,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_tellurica": "18 m.",
    "percezione_passiva": 10
  },
  "languages": "",
  "challenge_rating": 0.5,
  "proficiency_bonus": 2,
  "xp": 100,
  "special_abilities": [
    {
      "name": "Ecolocalizzazione",
      "desc": "Il manto oscuro non può usare la sua percezione tellurica mentre è assordato.",
      "damage": []
    },
    {
      "name": "Falsa Apparenza",
      "desc": "Finché il manto oscuro rimane immobile, non è distinguibile da una formazione rocciosa come una stalattite o una stalagmite.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Schiacciamento",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., una creatura. Colpito: 6 (1d6 + 3) danni contundenti e il manto oscuro si attacca al bersaglio. Se il bersaglio è di taglia Media o inferiore e il manto oscuro ha vantaggio al tiro per colpire, si attacca avvolgendo la testa del bersaglio; il bersaglio è inoltre accecato e impossibilitato a respirare finché il manto oscuro resta attaccato in questo modo.\nMentre è attaccato al bersaglio, il manto oscuro non può attaccare altre creature tranne il bersaglio, ma ha vantaggio ai suoi tiri per colpire. Inoltre, la velocità del manto oscuro diventa 0, non può beneficiare di alcun bonus alla sua velocità e si muove assieme al bersaglio.\nUna creatura può staccare il manto oscuro effettuando con successo una prova di Forza CD 13 come azione. Nel suo turno, il manto oscuro può staccarsi dal bersaglio usando 1,5 metri di movimento.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente"
          },
          "damage_dice": "1d6+3"
        }
      ],
      "actions": []
    },
    {
      "damage": [],
      "name": "Aura di Oscurità",
      "desc": "Un raggio di 4,5 metri di oscurità magica si estende dal manto oscuro, si muove con esso e si diffonde oltre gli angoli. L'oscurità dura finché il manto oscuro mantiene la concentrazione, fino a un massimo di 10 minuti (come se si concentrasse su un incantesimo). La scurovisione non può penetrare questa oscurità e nessuna luce naturale può illuminarla. Se l'area di oscurità si sovrappone a un'area di luce creata da un incantesimo di 2° livello o inferiore, l'incantesimo che ha creato la luce è dissolto.",
      "usage": {
        "type": "per day",
        "times": 1
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/darkmantle.png",
  "url": "/api/2014/monsters/darkmantle",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "death-dog",
  "name": "Segugio della Morte",
  "desc": "Un segugio della morte è un ripugnante mastino a due teste che si aggira per pianure e deserti. L'odio brucia nel cuore di questa creatura, e il desiderio di carne umanoide lo spinge ad attaccare viaggiatori ed esploratori. La saliva del segugio della morte trasmette una terribile malattia che fa marcire lentamente la carne della vittima fino alle ossa.",
  "size": "Media",
  "type": "mostruosità",
  "alignment": "neutrale malvagio",
  "armor_class": [
    {
      "type": "des",
      "value": 12
    }
  ],
  "hit_points": 39,
  "hit_dice": "6d8",
  "hit_points_roll": "6d8+12",
  "speed": {
    "camminare": "12 m."
  },
  "strength": 15,
  "dexterity": 14,
  "constitution": 14,
  "intelligence": 3,
  "wisdom": 13,
  "charisma": 6,
  "proficiencies": [
    {
      "value": 5,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 15
  },
  "languages": "",
  "challenge_rating": 1,
  "proficiency_bonus": 2,
  "xp": 200,
  "special_abilities": [
    {
      "name": "Due Teste",
      "desc": "Il segugio ha vantaggio alle prove di Saggezza (Percezione) e ai tiri salvezza per non essere accecato, affascinato, assordato, spaventato, stordito o reso privo di sensi.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "Il segugio effettua due attacchi di morso.",
      "multiattack_type": "actions",
      "actions": [
        {
          "action_name": "Morso",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 5 (1d6 + 2) danni perforanti. Se il bersaglio è una creatura, deve superare un tiro salvezza su Costituzione CD 12 contro le malattie o diventare avvelenato finché la malattia non viene curata. Ogni 24 ore trascorse, la creatura deve ripetere il tiro salvezza; se lo fallisce, il suo massimo dei punti ferita si riduce di 5 (1d10). Questa riduzione dura finché la malattia non viene curata. La creatura muore se la malattia riduce il suo massimo dei punti ferita a 0.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante"
          },
          "damage_dice": "1d6+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/death-dog.png",
  "url": "/api/2014/monsters/death-dog",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "drow",
  "name": "Drow",
  "size": "Media",
  "type": "umanoide",
  "subtype": "elfo",
  "alignment": "neutrale malvagio",
  "armor_class": [
    {
      "type": "armatura",
      "value": 15,
      "armor": [
        {
          "index": "chain-shirt",
          "name": "Camicia di Maglia"
        }
      ]
    }
  ],
  "hit_points": 13,
  "hit_dice": "3d8",
  "hit_points_roll": "3d8",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 10,
  "dexterity": 14,
  "constitution": 10,
  "intelligence": 11,
  "wisdom": 11,
  "charisma": 12,
  "proficiencies": [
    {
      "value": 2,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 12
  },
  "languages": "Elfico, Sottocomune",
  "challenge_rating": 0.25,
  "proficiency_bonus": 2,
  "xp": 50,
  "special_abilities": [
    {
      "name": "Retaggio Fatato",
      "desc": "Il drow ha vantaggio ai tiri salvezza per non essere affascinato e la magia non può addormentarlo.",
      "damage": []
    },
    {
      "name": "Lancio degli Incantesimi Innato",
      "desc": "La caratteristica da incantatore innata del drow è il Carisma (CD del tiro salvezza degli incantesimi 11). Il drow può lanciare innatamente i seguenti incantesimi, senza bisogno di componenti materiali:\n\nA volontà: luci danzanti\n1 al giorno ciascuno: oscurità, fuoco fatato",
      "spellcasting": {
        "ability": { "index": "cha", "name": "CAR" },
        "dc": 11,
        "modifier": 0,
        "components_required": ["V", "S"],
        "spells": [
          { "name": "Luci Danzanti", "level": 0, "usage": { "type": "a volontà" } },
          { "name": "Oscurità", "level": 2, "usage": { "type": "per day", "times": 1 } },
          { "name": "Fuoco Fatato", "level": 1, "usage": { "type": "per day", "times": 1 } }
        ]
      },
      "damage": []
    },
    {
      "name": "Sensibilità alla Luce Solare",
      "desc": "Mentre si trova alla luce del sole, il drow ha svantaggio ai tiri per colpire e alle prove di Saggezza (Percezione) basate sulla vista.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Spada Corta",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 5 (1d6 + 2) danni perforanti.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": { "index": "piercing", "name": "Perforante" },
          "damage_dice": "1d6+2"
        }
      ],
      "actions": []
    },
    {
      "name": "Balestra a Mano",
      "desc": "Attacco con Arma a Gittata: +4 per colpire, gittata 9/36 m., un bersaglio. Colpito: 5 (1d6 + 2) danni perforanti e il bersaglio deve superare un tiro salvezza su Costituzione CD 13 o essere avvelenato per 1 ora. Se il tiro salvezza fallisce di 5 o più, il bersaglio è anche privo di sensi finché rimane avvelenato in questo modo. Il bersaglio si sveglia se subisce danni o se un'altra creatura usa un'azione per scuoterlo e svegliarlo.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": { "index": "piercing", "name": "Perforante" },
          "damage_dice": "1d6+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/drow.png",
  "url": "/api/2014/monsters/drow",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "djinni",
  "name": "Djinni",
  "size": "Grande",
  "type": "elementale",
  "alignment": "caotico buono",
  "armor_class": [
    {
      "type": "naturale",
      "value": 17
    }
  ],
  "hit_points": 161,
  "hit_dice": "14d10",
  "hit_points_roll": "14d10+84",
  "speed": {
    "camminare": "9 m.",
    "volare": "27 m."
  },
  "strength": 21,
  "dexterity": 15,
  "constitution": 22,
  "intelligence": 15,
  "wisdom": 16,
  "charisma": 20,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "saving-throw-cha",
        "name": "Tiro Salvezza: CAR"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fulmine",
    "tuono"
  ],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 13
  },
  "languages": "Auran",
  "challenge_rating": 11,
  "proficiency_bonus": 4,
  "xp": 7200,
  "special_abilities": [
    {
      "name": "Dipartita Elementale",
      "desc": "Se il djinni muore, il suo corpo si dissolve in una brezza calda, lasciando dietro di sé solo l'equipaggiamento che indossava o trasportava.",
      "damage": []
    },
    {
      "name": "Lancio degli Incantesimi Innato",
      "desc": "La caratteristica da incantatore innata del djinni è il Carisma (CD del tiro salvezza degli incantesimi 17, +9 per colpire con gli attacchi da incantesimo). Può lanciare innatamente i seguenti incantesimi, senza bisogno di componenti materiali:\n\nA volontà: individuazione del bene e del male, individuazione del magico, onda di tuono\n3 al giorno ciascuno: creare cibo e acqua (può creare vino invece di acqua), linguaggi, passo del vento\n1 al giorno ciascuno: evocare elementale (solo elementale dell'aria), creazione, forma gassosa, invisibilità, immagine maggiore, spostamento planare",
      "spellcasting": {
        "ability": { "index": "cha", "name": "CAR" },
        "dc": 17,
        "modifier": 9,
        "components_required": ["V", "S"],
        "spells": [
          { "name": "Individuazione del Bene e del Male", "level": 1, "usage": { "type": "a volontà" } },
          { "name": "Individuazione del Magico", "level": 1, "usage": { "type": "a volontà" } },
          { "name": "Onda di Tuono", "level": 1, "usage": { "type": "a volontà" } },
          { "name": "Creare Cibo e Acqua", "level": 3, "usage": { "type": "per day", "times": 3 } },
          { "name": "Linguaggi", "level": 3, "usage": { "type": "per day", "times": 3 } },
          { "name": "Passo del Vento", "level": 6, "usage": { "type": "per day", "times": 3 } },
          { "name": "Evocare Elementale", "level": 5, "usage": { "type": "per day", "times": 1 } },
          { "name": "Creazione", "level": 5, "usage": { "type": "per day", "times": 1 } },
          { "name": "Forma Gassosa", "level": 3, "usage": { "type": "per day", "times": 1 } },
          { "name": "Invisibilità", "level": 2, "usage": { "type": "per day", "times": 1 } },
          { "name": "Immagine Maggiore", "level": 3, "usage": { "type": "per day", "times": 1 } },
          { "name": "Spostamento Planare", "level": 7, "usage": { "type": "per day", "times": 1 } }
        ]
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "Il djinni effettua tre attacchi di scimitarra.",
      "multiattack_type": "actions",
      "actions": [ { "action_name": "Scimitarra", "count": "3", "type": "melee" } ]
    },
    {
      "name": "Scimitarra",
      "desc": "Attacco con Arma da Mischia: +9 per colpire, portata 1,5 m., un bersaglio. Colpito: 12 (2d6 + 5) danni taglienti più 3 (1d6) danni da fulmine o da tuono (a scelta del djinni).",
      "attack_bonus": 9,
      "damage": [
        { "damage_type": { "name": "Tagliente" }, "damage_dice": "2d6+5" },
        { "choose": 1, "type": "damage", "from": { "options": [
          { "damage_type": { "name": "Fulmine" }, "damage_dice": "1d6" },
          { "damage_type": { "name": "Tuono" }, "damage_dice": "1d6" }
        ] } }
      ]
    },
    {
      "name": "Creare Turbine",
      "desc": "Un cilindro di aria vorticante del raggio di 1,5 metri e alto 9 metri si forma magicamente in un punto che il djinni può vedere entro 36 metri da lui. Il turbine dura finché il djinni mantiene la concentrazione (come se si concentrasse su un incantesimo). Qualsiasi creatura tranne il djinni che entri nel turbine deve superare un tiro salvezza su Forza CD 18 o esserne trattenuta. Il djinni può muovere il turbine fino a 18 metri come azione, e le creature trattenute dal turbine si muovono con esso. Il turbine termina se il djinni ne perde la visuale.\nUna creatura può usare la sua azione per liberare una creatura trattenuta dal turbine, se stessa compresa, superando una prova di Forza CD 18. Se la prova riesce, la creatura non è più trattenuta e si muove nello spazio libero più vicino al di fuori del turbine.",
      "dc": {
        "dc_type": { "index": "str", "name": "FOR" },
        "dc_value": 18
      }
    }
  ],
  "image": "/api/images/monsters/djinni.png",
  "url": "/api/2014/monsters/djinni",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "doppelganger",
  "name": "Doppelganger",
  "size": "Media",
  "type": "mostruosità",
  "subtype": "mutaforma",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 14
    }
  ],
  "hit_points": 52,
  "hit_dice": "8d8",
  "hit_points_roll": "8d8+16",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 11,
  "dexterity": 18,
  "constitution": 14,
  "intelligence": 11,
  "wisdom": 12,
  "charisma": 14,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "skill-deception",
        "name": "Abilità: Inganno"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "skill-insight",
        "name": "Abilità: Intuizione"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [
    {
      "index": "charmed",
      "name": "Affascinato"
    }
  ],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 11
  },
  "languages": "Comune",
  "challenge_rating": 3,
  "proficiency_bonus": 2,
  "xp": 700,
  "special_abilities": [
    {
      "name": "Mutaforma",
      "desc": "Il doppelganger può usare la sua azione per trasformarsi in un umanoide di taglia Piccola o Media che ha già visto, o per tornare alla sua vera forma. Le sue statistiche, a eccezione della taglia, rimangono le stesse in ogni forma. L'equipaggiamento indossato o trasportato non viene trasformato. Se muore, il doppelganger torna alla sua vera forma.",
      "damage": []
    },
    {
      "name": "Imboscato",
      "desc": "Durante il primo round di combattimento, il doppelganger ha vantaggio ai tiri per colpire contro ogni creatura che ha sorpreso.",
      "damage": []
    },
    {
      "name": "Attacco a Sorpresa",
      "desc": "Se il doppelganger sorprende una creatura e la colpisce con un attacco durante il primo round di combattimento, il bersaglio subisce 10 (3d6) danni extra dall'attacco.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "Il doppelganger effettua due attacchi in mischia.",
      "multiattack_type": "actions",
      "actions": [
        {
          "action_name": "Schianto",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Schianto",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 1,5 m., un bersaglio. Colpito: 7 (1d6 + 4) danni contundenti.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente"
          },
          "damage_dice": "1d6+4"
        }
      ],
      "actions": []
    },
    {
      "name": "Leggere Pensieri",
      "desc": "Il doppelganger legge magicamente i pensieri superficiali di una creatura entro 18 metri da lui. L'effetto può penetrare le barriere, ma è bloccato da 90 cm di legno o terra, 60 cm di pietra, 5 cm di metallo o un sottile foglio di piombo. Finché il bersaglio è entro gittata, il doppelganger può continuare a leggerne i pensieri, a condizione che la sua concentrazione non venga interrotta (come se si concentrasse su un incantesimo). Mentre legge la mente del bersaglio, il doppelganger ha vantaggio alle prove di Saggezza (Intuizione) e Carisma (Inganno, Intimidire e Persuasione) contro di esso.",
      "actions": []
    }
  ],
  "image": "/api/images/monsters/doppelganger.png",
  "url": "/api/2014/monsters/doppelganger",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "dretch",
  "name": "Dretch",
  "size": "Piccola",
  "type": "immondo",
  "subtype": "demone",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 11
    }
  ],
  "hit_points": 18,
  "hit_dice": "4d6",
  "hit_points_roll": "4d6+4",
  "speed": {
    "camminare": "6 m."
  },
  "strength": 11,
  "dexterity": 11,
  "constitution": 12,
  "intelligence": 5,
  "wisdom": 8,
  "charisma": 3,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "freddo",
    "fuoco",
    "fulmine"
  ],
  "damage_immunities": [
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "poisoned",
      "name": "Avvelenato"
    }
  ],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 9
  },
  "languages": "Abissale, telepatia 18 m. (funziona solo con creature che comprendono l'Abissale)",
  "challenge_rating": 0.25,
  "proficiency_bonus": 2,
  "xp": 25,
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "Il dretch effettua due attacchi: uno con il morso e uno con gli artigli.",
      "multiattack_type": "actions",
      "actions": [
        {
          "action_name": "Morso",
          "count": "1",
          "type": "melee"
        },
        {
          "action_name": "Artigli",
          "count": "1",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +2 per colpire, portata 1,5 m., un bersaglio. Colpito: 3 (1d6) danni perforanti.",
      "attack_bonus": 2,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante"
          },
          "damage_dice": "1d6"
        }
      ],
      "actions": []
    },
    {
      "name": "Artigli",
      "desc": "Attacco con Arma da Mischia: +2 per colpire, portata 1,5 m., un bersaglio. Colpito: 5 (2d4) danni taglienti.",
      "attack_bonus": 2,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente"
          },
          "damage_dice": "2d4"
        }
      ],
      "actions": []
    },
    {
      "name": "Nube Fetida",
      "desc": "Una nube di gas verde e disgustoso del raggio di 3 metri si sprigiona dal dretch. Il gas si diffonde oltre gli angoli e la sua area è leggermente oscurata. Dura per 1 minuto o finché un vento forte non la disperde. Ogni creatura che inizi il proprio turno in quell'area deve superare un tiro salvezza su Costituzione CD 11 o essere avvelenata fino all'inizio del suo turno successivo. Mentre è avvelenato in questo modo, il bersaglio può effettuare un'azione o una azione bonus nel proprio turno, ma non entrambe, e non può effettuare reazioni.",
      "usage": {
        "type": "al giorno",
        "times": 1
      },
      "dc": {
        "dc_type": { "index": "con", "name": "COS" },
        "dc_value": 11
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/dretch.png",
  "url": "/api/2014/monsters/dretch",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "dragon-turtle",
  "name": "Tartaruga Dragone",
  "size": "Gargantuesca",
  "type": "drago",
  "alignment": "neutrale",
  "armor_class": [
    {
      "type": "naturale",
      "value": 20
    }
  ],
  "hit_points": 341,
  "hit_dice": "22d20",
  "hit_points_roll": "22d20+110",
  "speed": {
    "camminare": "6 m.",
    "nuotare": "12 m."
  },
  "strength": 25,
  "dexterity": 10,
  "constitution": 20,
  "intelligence": 10,
  "wisdom": 12,
  "charisma": 12,
  "proficiencies": [
    {
      "value": 6,
      "proficiency": {
        "index": "saving-throw-dex",
        "name": "Tiro Salvezza: DES"
      }
    },
    {
      "value": 11,
      "proficiency": {
        "index": "saving-throw-con",
        "name": "Tiro Salvezza: COS"
      }
    },
    {
      "value": 7,
      "proficiency": {
        "index": "saving-throw-wis",
        "name": "Tiro Salvezza: SAG"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "fuoco"
  ],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 11
  },
  "languages": "Aquan, Draconico",
  "challenge_rating": 17,
  "proficiency_bonus": 6,
  "xp": 18000,
  "special_abilities": [
    {
      "name": "Anfibio",
      "desc": "La tartaruga dragone può respirare aria e acqua.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "La tartaruga dragone effettua tre attacchi: uno con il morso e due con gli artigli. Può effettuare un attacco di coda al posto dei due attacchi con gli artigli.",
      "multiattack_type": "action_options"
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +13 per colpire, portata 4,5 m., un bersaglio. Colpito: 26 (3d12 + 7) danni perforanti.",
      "attack_bonus": 13,
      "damage": [
        {
          "damage_type": { "name": "Perforante" },
          "damage_dice": "3d12+7"
        }
      ]
    },
    {
      "name": "Artiglio",
      "desc": "Attacco con Arma da Mischia: +13 per colpire, portata 3 m., un bersaglio. Colpito: 16 (2d8 + 7) danni taglienti.",
      "attack_bonus": 13,
      "damage": [
        {
          "damage_type": { "name": "Tagliente" },
          "damage_dice": "2d8+7"
        }
      ]
    },
    {
      "name": "Coda",
      "desc": "Attacco con Arma da Mischia: +13 per colpire, portata 4,5 m., un bersaglio. Colpito: 26 (3d12 + 7) danni contundenti. Se il bersaglio è una creatura, deve superare un tiro salvezza su Forza CD 20 o essere spinto fino a 3 metri di distanza dalla tartaruga dragone e cadere prono.",
      "attack_bonus": 13,
      "damage": [
        {
          "damage_type": { "name": "Contundente" },
          "damage_dice": "3d12+7"
        }
      ]
    },
    {
      "name": "Soffio di Vapore",
      "desc": "La tartaruga dragone esala vapore bollente in un cono di 18 metri. Ogni creatura in quell'area deve effettuare un tiro salvezza su Costituzione CD 18; se lo fallisce, subisce 52 (15d6) danni da fuoco, mentre se lo supera, subisce solo la metà di tali danni. Trovarsi sott'acqua non conferisce resistenza contro questo danno.",
      "usage": {
        "type": "si ricarica dopo un tiro",
        "dice": "1d6",
        "min_value": 5
      },
      "dc": {
        "dc_type": { "index": "con", "name": "COS" },
        "dc_value": 18,
        "success_type": "metà"
      },
      "damage": [
        {
          "damage_type": { "name": "Fuoco" },
          "damage_dice": "15d6"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/dragon-turtle.png",
  "url": "/api/2014/monsters/dragon-turtle",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "drider",
  "name": "Drider",
  "size": "Grande",
  "type": "mostruosità",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 19
    }
  ],
  "hit_points": 123,
  "hit_dice": "13d10",
  "hit_points_roll": "13d10+52",
  "speed": {
    "camminare": "9 m.",
    "scalare": "9 m."
  },
  "strength": 16,
  "dexterity": 16,
  "constitution": 18,
  "intelligence": 13,
  "wisdom": 14,
  "charisma": 12,
  "proficiencies": [
    {
      "value": 5,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione"
      }
    },
    {
      "value": 9,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 15
  },
  "languages": "Elfico, Sottocomune",
  "challenge_rating": 6,
  "proficiency_bonus": 3,
  "xp": 2300,
  "special_abilities": [
    {
      "name": "Retaggio Fatato",
      "desc": "Il drider ha vantaggio ai tiri salvezza per non essere affascinato e la magia non può addormentarlo.",
      "damage": []
    },
    {
      "name": "Lancio degli Incantesimi Innato",
      "desc": "La caratteristica da incantatore innata del drider è la Saggezza (CD del tiro salvezza degli incantesimi 13). Il drider può lanciare innatamente i seguenti incantesimi, senza bisogno di componenti materiali:\n\nA volontà: luci danzanti\n1 al giorno ciascuno: fuoco fatuo, oscurità",
      "spellcasting": {
        "ability": { "index": "wis", "name": "SAG" },
        "dc": 13,
        "components_required": ["V", "S"],
        "spells": [
          { "name": "Luci Danzanti", "level": 1, "usage": { "type": "a volontà" } },
          { "name": "Oscurità", "level": 2, "usage": { "type": "per day", "times": 1 } },
          { "name": "Fuoco Fatuo", "level": 1, "usage": { "type": "per day", "times": 1 } }
        ]
      },
      "damage": []
    },
    {
      "name": "Scalare Ragni",
      "desc": "Il drider può scalare superfici difficili, inclusi i soffitti a testa in giù, senza dover effettuare prove di caratteristica.",
      "damage": []
    },
    {
      "name": "Sensibilità alla Luce Solare",
      "desc": "Mentre si trova alla luce del sole, il drider ha svantaggio ai tiri per colpire e alle prove di Saggezza (Percezione) basate sulla vista.",
      "damage": []
    },
    {
      "name": "Camminare nelle Tele",
      "desc": "Il drider ignora le limitazioni al movimento causate dalle ragnatele.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "Il drider effettua tre attacchi con la sua spada lunga o con il suo arco lungo. Può sostituire uno di questi attacchi con un attacco di morso.",
      "multiattack_type": "action_options"
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 1,5 m., una creatura. Colpito: 2 (1d4) danni perforanti più 9 (2d8) danni da veleno.",
      "attack_bonus": 6,
      "damage": [
        { "damage_type": { "name": "Perforante" }, "damage_dice": "1d4" },
        { "damage_type": { "name": "Veleno" }, "damage_dice": "2d8" }
      ]
    },
    {
      "name": "Spada Lunga",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 1,5 m., un bersaglio. Colpito: 7 (1d8 + 3) danni taglienti, o 8 (1d10 + 3) danni taglienti se usata con due mani.",
      "attack_bonus": 6,
      "damage": [
        {
          "choose": 1,
          "type": "damage",
          "from": {
            "options": [
              { "damage_type": { "name": "Tagliente" }, "damage_dice": "1d8+3", "notes": "A una mano" },
              { "damage_type": { "name": "Tagliente" }, "damage_dice": "1d10+3", "notes": "A due mani" }
            ]
          }
        }
      ]
    },
    {
      "name": "Arco Lungo",
      "desc": "Attacco con Arma a Gittata: +6 per colpire, gittata 45/180 m., un bersaglio. Colpito: 7 (1d8 + 3) danni perforanti più 4 (1d8) danni da veleno.",
      "attack_bonus": 6,
      "damage": [
        { "damage_type": { "name": "Perforante" }, "damage_dice": "1d8+3" },
        { "damage_type": { "name": "Veleno" }, "damage_dice": "1d8" }
      ]
    }
  ],
  "image": "/api/images/monsters/drider.png",
  "url": "/api/2014/monsters/drider",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": []
},
{
  "index": "draft-horse",
  "name": "Cavallo da Tiro",
  "size": "Grande",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 10
    }
  ],
  "hit_points": 19,
  "hit_dice": "3d10",
  "hit_points_roll": "3d10+3",
  "speed": {
    "camminare": "12 m."
  },
  "strength": 18,
  "dexterity": 10,
  "constitution": 12,
  "intelligence": 2,
  "wisdom": 11,
  "charisma": 7,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 10
  },
  "languages": "",
  "challenge_rating": 0.25,
  "proficiency_bonus": 2,
  "xp": 50,
  "actions": [
    {
      "name": "Zoccoli",
      "desc": "Attacco con Arma da Mischia: +6 per colpire, portata 1,5 m., un bersaglio. Colpito: 9 (2d4 + 4) danni contundenti.",
      "attack_bonus": 6,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente"
          },
          "damage_dice": "2d4+4"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/draft-horse.png",
  "url": "/api/2014/monsters/draft-horse",
  "updated_at": "2025-10-24T20:42:13.741Z",
  "forms": [],
  "legendary_actions": [],
  "reactions": [],
  "special_abilities": []
},
{
  "index": "druid",
  "name": "Druido",
  "desc": "I **druidi** dimorano nelle foreste e in altri luoghi isolati delle terre selvagge, dove proteggono il mondo naturale dai mostri e dall'avanzata della civiltà. Alcuni sono **sciamani tribali** che guariscono i malati, pregano gli spiriti animali e forniscono guida spirituale.",
  "size": "Media",
  "type": "umanoide",
  "subtype": "qualsiasi razza",
  "alignment": "qualsiasi allineamento",
  "armor_class": [
    {
      "type": "des",
      "value": 11
    },
    {
      "type": "incantesimo",
      "value": 16,
      "spell": {
        "index": "barkskin",
        "name": "Pelle di Corteccia"
      }
    }
  ],
  "hit_points": 27,
  "hit_dice": "5d8",
  "hit_points_roll": "5d8+5",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 10,
  "dexterity": 12,
  "constitution": 13,
  "intelligence": 12,
  "wisdom": 15,
  "charisma": 11,
  "proficiencies": [
    {
      "value": 4,
      "proficiency": {
        "index": "skill-medicine",
        "name": "Abilità: Medicina"
      }
    },
    {
      "value": 3,
      "proficiency": {
        "index": "skill-nature",
        "name": "Abilità: Natura"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 14
  },
  "languages": "Druidico più altre due lingue a scelta",
  "challenge_rating": 2,
  "proficiency_bonus": 2,
  "xp": 450,
  "special_abilities": [
    {
      "name": "Incantesimi",
      "desc": "Il druido è un incantatore di 4° livello. La sua caratteristica da incantatore è la Saggezza (CD del tiro salvezza degli incantesimi 12, +4 al tiro per colpire con attacchi da incantesimo). Ha i seguenti incantesimi da druido preparati:\n\n- Trucchetti (a volontà): artifizio druidico, produrre fiamma, randello incantato\n- 1° livello (4 slot): intralciare, passo veloce, parlare con gli animali, onda tonante\n- 2° livello (3 slot): messaggero animale, pelle di corteccia",
      "spellcasting": {
        "level": 4,
        "ability": { "index": "wis", "name": "SAG" },
        "dc": 12,
        "modifier": 4,
        "spells": [
          { "name": "Artifizio Druidico", "level": 0 },
          { "name": "Produrre Fiamma", "level": 0 },
          { "name": "Randello Incantato", "level": 0 },
          { "name": "Intralciare", "level": 1 },
          { "name": "Passo Veloce", "level": 1 },
          { "name": "Parlare con gli Animali", "level": 1 },
          { "name": "Onda Tonante", "level": 1 },
          { "name": "Messaggero Animale", "level": 2 },
          { "name": "Pelle di Corteccia", "level": 2 }
        ]
      }
    }
  ],
  "actions": [
    {
      "name": "Bastone Ferrato",
      "desc": "Attacco con Arma da Mischia: +2 per colpire (+4 per colpire con randello incantato), portata 1,5 m., un bersaglio. Colpito: 3 (1d6) danni contundenti, 4 (1d8) danni contundenti se usato a due mani, o 6 (1d8 + 2) danni contundenti con randello incantato.",
      "attack_bonus": 2,
      "damage": [
        {
          "choose": 1,
          "type": "damage",
          "from": {
            "options": [
              { "damage_type": { "name": "Contundente" }, "damage_dice": "1d6", "notes": "A una mano" },
              { "damage_type": { "name": "Contundente" }, "damage_dice": "1d8", "notes": "A due mani" },
              { "damage_type": { "name": "Contundente" }, "damage_dice": "1d8+2", "notes": "Con randello incantato" }
            ]
          }
        }
      ]
    }
  ],
  "image": "/api/images/monsters/druid.png",
  "url": "/api/2014/monsters/druid",
  "updated_at": "2025-10-24T20:42:13.741Z"
},
{
  "index": "dust-mephit",
  "name": "Mephit della Polvere",
  "size": "Piccola",
  "type": "elementale",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "des",
      "value": 12
    }
  ],
  "hit_points": 17,
  "hit_dice": "5d6",
  "hit_points_roll": "5d6",
  "speed": {
    "camminare": "9 m.",
    "volare": "9 m."
  },
  "strength": 5,
  "dexterity": 14,
  "constitution": 10,
  "intelligence": 9,
  "wisdom": 11,
  "charisma": 10,
  "proficiencies": [
    {
      "value": 2,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione"
      }
    },
    {
      "value": 4,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività"
      }
    }
  ],
  "damage_vulnerabilities": [
    "fuoco"
  ],
  "damage_resistances": [],
  "damage_immunities": [
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "poisoned",
      "name": "Avvelenato"
    }
  ],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 12
  },
  "languages": "Auran, Terran",
  "challenge_rating": 0.5,
  "proficiency_bonus": 2,
  "xp": 100,
  "special_abilities": [
    {
      "name": "Esplosione Letale",
      "desc": "Quando il mephit muore, esplode in una nuvola di polvere. Ogni creatura entro 1,5 metri da esso deve superare un tiro salvezza su Costituzione CD 10 o essere accecata per 1 minuto. Una creatura accecata può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su se stessa in caso di successo.",
      "dc": {
        "dc_type": { "index": "con", "name": "COS" },
        "dc_value": 10
      },
      "damage": []
    },
    {
      "name": "Lancio degli Incantesimi Innato",
      "desc": "La caratteristica da incantatore innata del mephit è il Carisma. Il mephit può lanciare innatamente l'incantesimo *sonno*, senza bisogno di componenti materiali.",
      "spellcasting": {
        "ability": { "index": "cha", "name": "CAR" },
        "dc": 10,
        "components_required": ["V", "S"],
        "spells": [
          {
            "name": "Sonno",
            "level": 1,
            "usage": { "type": "al giorno", "times": 1 }
          }
        ]
      },
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Artigli",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., una creatura. Colpito: 4 (1d4 + 2) danni taglienti.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": { "index": "slashing", "name": "Tagliente" },
          "damage_dice": "1d4+2"
        }
      ],
      "actions": []
    },
    {
      "name": "Soffio Accecante",
      "desc": "Il mephit esala un cono di polvere accecante di 4,5 metri. Ogni creatura in quell'area deve superare un tiro salvezza su Destrezza CD 10 o essere accecata per 1 minuto. Una creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su se stessa in caso di successo.",
      "usage": {
        "type": "si ricarica dopo un tiro",
        "dice": "1d6",
        "min_value": 6
      },
      "dc": {
        "dc_type": { "index": "dex", "name": "DES" },
        "dc_value": 10
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/dust-mephit.png",
  "url": "/api/2014/monsters/dust-mephit",
  "updated_at": "2025-10-24T20:42:13.741Z"
},
{
  "index": "duergar",
  "name": "Duergar",
  "size": "Media",
  "type": "umanoide",
  "subtype": "nano",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "armatura",
      "value": 16,
      "armor": [
        {
          "index": "scale-mail",
          "name": "Corazza di Scaglie"
        },
        {
          "index": "shield",
          "name": "Scudo"
        }
      ]
    }
  ],
  "hit_points": 26,
  "hit_dice": "4d8",
  "hit_points_roll": "4d8+8",
  "speed": {
    "camminare": "7,5 m."
  },
  "strength": 14,
  "dexterity": 11,
  "constitution": 14,
  "intelligence": 11,
  "wisdom": 10,
  "charisma": 9,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "veleno"
  ],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 10
  },
  "languages": "Nanico, Sottocomune",
  "challenge_rating": 1,
  "proficiency_bonus": 2,
  "xp": 200,
  "special_abilities": [
    {
      "name": "Resilienza dei Duergar",
      "desc": "Il duergar ha vantaggio ai tiri salvezza contro veleno, incantesimi e illusioni, nonché per resistere a essere affascinato o paralizzato.",
      "damage": []
    },
    {
      "name": "Sensibilità alla Luce Solare",
      "desc": "Mentre si trova alla luce del sole, il duergar ha svantaggio ai tiri per colpire e alle prove di Saggezza (Percezione) basate sulla vista.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Ingrandire",
      "desc": "Per 1 minuto, il duergar aumenta magicamente di taglia, assieme a qualsiasi cosa indossi o trasporti. Mentre è ingrandito, il duergar è di taglia Grande, raddoppia i propri dadi di danno degli attacchi con arma basati sulla Forza (inclusi negli attacchi) ed effettua prove di Forza e tiri salvezza su Forza con vantaggio. Se il duergar non ha spazio a sufficienza per diventare Grande, raggiunge la dimensione massima possibile nello spazio disponibile.",
      "usage": {
        "type": "si ricarica dopo un riposo",
        "rest_types": ["breve", "lungo"]
      },
      "actions": []
    },
    {
      "name": "Picco da Guerra",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 6 (1d8 + 2) danni perforanti, o 11 (2d8 + 2) danni perforanti mentre è ingrandito.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": { "index": "piercing", "name": "Perforante" },
          "damage_dice": "1d8+2"
        }
      ],
      "actions": []
    },
    {
      "name": "Giavellotto",
      "desc": "Attacco con Arma da Mischia o a Gittata: +4 per colpire, portata 1,5 m. o gittata 9/36 m., un bersaglio. Colpito: 5 (1d6 + 2) danni perforanti, o 9 (2d6 + 2) danni perforanti mentre è ingrandito.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": { "index": "bludgeoning", "name": "Contundente" },
          "damage_dice": "1d6+2"
        }
      ],
      "actions": []
    },
    {
      "name": "Invisibilità",
      "desc": "Il duergar diventa magicamente invisibile finché non attacca, lancia un incantesimo, usa Ingrandire o finché la sua concentrazione non si interrompe, fino a un massimo di 1 ora (come se si stesse concentrando su un incantesimo). Qualsiasi equipaggiamento indossato o trasportato dal duergar diventa invisibile assieme a lui.",
      "usage": {
        "type": "si ricarica dopo un riposo",
        "rest_types": ["breve", "lungo"]
      },
      "actions": []
    }
  ],
  "image": "/api/images/monsters/duergar.png",
  "url": "/api/2014/monsters/duergar",
  "updated_at": "2025-10-24T20:42:13.741Z"
},
{
  "index": "dryad",
  "name": "Drìade",
  "size": "Media",
  "type": "folletto",
  "alignment": "neutrale",
  "armor_class": [
    {
      "type": "des",
      "value": 11
    },
    {
      "type": "incantesimo",
      "value": 16,
      "spell": {
        "index": "barkskin",
        "name": "Pelle di Corteccia"
      }
    }
  ],
  "hit_points": 22,
  "hit_dice": "5d8",
  "hit_points_roll": "5d8",
  "speed": {
    "camminare": "9 m."
  },
  "strength": 10,
  "dexterity": 12,
  "constitution": 11,
  "intelligence": 14,
  "wisdom": 15,
  "charisma": 18,
  "proficiencies": [
    {
      "value": 4,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione"
      }
    },
    {
      "value": 5,
      "proficiency": {
        "index": "skill-stealth",
        "name": "Abilità: Furtività"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 14
  },
  "languages": "Elfico, Silvano",
  "challenge_rating": 1,
  "proficiency_bonus": 2,
  "xp": 200,
  "special_abilities": [
    {
      "name": "Lancio degli Incantesimi Innato",
      "desc": "La caratteristica da incantatore innata della drìade è il Carisma (CD del tiro salvezza degli incantesimi 14). La drìade può lanciare innatamente i seguenti incantesimi, senza bisogno di componenti materiali:\n\nA volontà: artifizio druidico\n3 al giorno ciascuno: bacche benefiche, intralciare\n1 al giorno ciascuno: passare senza tracce, pelle di corteccia, randello incantato",
      "spellcasting": {
        "ability": { "index": "cha", "name": "CAR" },
        "dc": 14,
        "components_required": ["V", "S"],
        "spells": [
          { "name": "Artifizio Druidico", "level": 0, "usage": { "type": "a volontà" } },
          { "name": "Bacche Benefiche", "level": 1, "usage": { "type": "per day", "times": 3 } },
          { "name": "Intralciare", "level": 1, "usage": { "type": "per day", "times": 3 } },
          { "name": "Passare Senza Tracce", "level": 2, "usage": { "type": "per day", "times": 1 } },
          { "name": "Pelle di Corteccia", "level": 2, "usage": { "type": "per day", "times": 1 } },
          { "name": "Randello Incantato", "level": 0, "usage": { "type": "per day", "times": 1 } }
        ]
      }
    },
    {
      "name": "Resistenza Magica",
      "desc": "La drìade ha vantaggio ai tiri salvezza contro incantesimi e altri effetti magici.",
      "damage": []
    },
    {
      "name": "Parlare con Bestie e Piante",
      "desc": "La drìade può comunicare con bestie e piante come se condividessero un linguaggio.",
      "damage": []
    },
    {
      "name": "Passo Arboreo",
      "desc": "Una volta nel suo turno, la drìade può usare 3 metri del suo movimento per entrare magicamente in un albero vivo entro la sua portata ed uscire da un secondo albero vivo situato entro 18 metri dal primo, apparendo in uno spazio non occupato entro 1,5 metri dal secondo albero. Entrambi gli alberi devono essere di taglia Grande o superiore.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Randello",
      "desc": "Attacco con Arma da Mischia: +2 per colpire (+6 per colpire con randello incantato), portata 1,5 m., un bersaglio. Colpito: 2 (1d4) danni contundenti, o 8 (1d8 + 4) danni contundenti con randello incantato.",
      "attack_bonus": 2,
      "damage": [
        {
          "damage_type": { "name": "Contundente" },
          "damage_dice": "1d4"
        }
      ]
    },
    {
      "name": "Fascino Fatato",
      "desc": "La drìade bersaglia un umanoide o una bestia che sia in grado di vedere entro 9 metri da lei. Se il bersaglio può vedere la drìade, deve superare un tiro salvezza su Saggezza CD 14 o rimanere magicamente affascinato. La creatura affascinata considera la drìade come un'amica fidata di cui tenere conto e da proteggere. Sebbene il bersaglio non sia sotto il controllo della drìade, interpreta le richieste o le azioni della drìade nel modo più favorevole possibile.\nOgni volta che la drìade o i suoi alleati fanno qualcosa di dannoso per il bersaglio, questi può ripetere il tiro salvezza, terminando l'effetto su se stesso in caso di successo. Altrimenti, l'effetto dura 24 ore o finché la drìade non muore, non si trova su un diverso piano di esistenza rispetto al bersaglio, o termina l'effetto come azione bonus. Se il tiro salvezza di un bersaglio è riuscito, il bersaglio è immune al Fascino Fatato della drìade per le successive 24 ore.\nLa drìade non può avere più di un umanoide e fino a tre bestie affascinate contemporaneamente.",
      "dc": {
        "dc_type": { "index": "wis", "name": "SAG" },
        "dc_value": 14
      }
    }
  ],
  "image": "/api/images/monsters/dryad.png",
  "url": "/api/2014/monsters/dryad",
  "updated_at": "2025-10-24T20:42:13.741Z"
},
{
  "index": "ettin",
  "name": "Ettin",
  "size": "Grande",
  "type": "gigante",
  "alignment": "caotico malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 12
    }
  ],
  "hit_points": 85,
  "hit_dice": "10d10",
  "hit_points_roll": "10d10+30",
  "speed": {
    "camminare": "12 m."
  },
  "strength": 21,
  "dexterity": 8,
  "constitution": 17,
  "intelligence": 6,
  "wisdom": 10,
  "charisma": 8,
  "proficiencies": [
    {
      "value": 4,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 14
  },
  "languages": "Gigante, Orchesco",
  "challenge_rating": 4,
  "proficiency_bonus": 2,
  "xp": 1100,
  "special_abilities": [
    {
      "name": "Due Teste",
      "desc": "L'ettin ha vantaggio alle prove di Saggezza (Percezione) e ai tiri salvezza per non essere accecato, affascinato, assordato, spaventato, stordito o reso privo di sensi.",
      "damage": []
    },
    {
      "name": "Sempre Vigile",
      "desc": "Quando una delle teste dell'ettin dorme, l'altra è sveglia.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "L'ettin effettua due attacchi: uno con la sua ascia da battaglia e uno con la sua stella del mattino.",
      "multiattack_type": "actions"
    },
    {
      "name": "Ascia da Battaglia",
      "desc": "Attacco con Arma da Mischia: +7 per colpire, portata 1,5 m., un bersaglio. Colpito: 14 (2d8 + 5) danni taglienti.",
      "attack_bonus": 7,
      "damage": [
        {
          "damage_type": { "index": "slashing", "name": "Tagliente" },
          "damage_dice": "2d8+5"
        }
      ]
    },
    {
      "name": "Stella del Mattino",
      "desc": "Attacco con Arma da Mischia: +7 per colpire, portata 1,5 m., un bersaglio. Colpito: 14 (2d8 + 5) danni perforanti.",
      "attack_bonus": 7,
      "damage": [
        {
          "damage_type": { "index": "piercing", "name": "Perforante" },
          "damage_dice": "2d8+5"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/ettin.png",
  "url": "/api/2014/monsters/ettin",
  "updated_at": "2025-10-24T20:42:13.741Z"
},
{
  "index": "efreeti",
  "name": "Efreeti",
  "size": "Grande",
  "type": "elementale",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 17
    }
  ],
  "hit_points": 200,
  "hit_dice": "16d10",
  "hit_points_roll": "16d10+112",
  "speed": {
    "camminare": "12 m.",
    "volare": "18 m."
  },
  "strength": 22,
  "dexterity": 12,
  "constitution": 24,
  "intelligence": 16,
  "wisdom": 15,
  "charisma": 16,
  "proficiencies": [
    {
      "value": 7,
      "proficiency": { "index": "saving-throw-int", "name": "Tiro Salvezza: INT" }
    },
    {
      "value": 6,
      "proficiency": { "index": "saving-throw-wis", "name": "Tiro Salvezza: SAG" }
    },
    {
      "value": 7,
      "proficiency": { "index": "saving-throw-cha", "name": "Tiro Salvezza: CAR" }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [
    "fuoco"
  ],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "36 m.",
    "percezione_passiva": 12
  },
  "languages": "Ignan",
  "challenge_rating": 11,
  "proficiency_bonus": 4,
  "xp": 7200,
  "special_abilities": [
    {
      "name": "Dipartita Elementale",
      "desc": "Se l'efreeti muore, il suo corpo si disintegra in un lampo di fuoco e una nuvola di fumo, lasciando dietro di sé solo l'equipaggiamento che indossava o trasportava.",
      "damage": []
    },
    {
      "name": "Lancio degli Incantesimi Innato",
      "desc": "La caratteristica da incantatore innata dell'efreeti è il Carisma (CD del tiro salvezza degli incantesimi 15, +7 per colpire con attacchi da incantesimo). Può lanciare innatamente i seguenti incantesimi, senza bisogno di componenti materiali:\n\nA volontà: individuazione del magico\n3 al giorno ciascuno: ingrandire/ridurre, linguaggi\n1 al giorno ciascuno: camuffamento illusorio, evoca elementale (solo elementale del fuoco), forma gassosa, invisibilità, muro di fuoco, spostamento planare",
      "spellcasting": {
        "ability": { "index": "cha", "name": "CAR" },
        "dc": 15,
        "modifier": 7,
        "components_required": ["V", "S"],
        "spells": [
          { "name": "Individuazione del Magico", "level": 1, "usage": { "type": "a volontà" } },
          { "name": "Ingrandire/Ridurre", "level": 2, "usage": { "type": "al giorno", "times": 3 } },
          { "name": "Linguaggi", "level": 3, "usage": { "type": "al giorno", "times": 3 } },
          { "name": "Evoca Elementale", "level": 5, "notes": "Solo Elementale del Fuoco", "usage": { "type": "al giorno", "times": 1 } },
          { "name": "Forma Gassosa", "level": 3, "usage": { "type": "al giorno", "times": 1 } },
          { "name": "Invisibilità", "level": 2, "usage": { "type": "al giorno", "times": 1 } },
          { "name": "Camuffamento Illusorio", "level": 3, "usage": { "type": "al giorno", "times": 1 } },
          { "name": "Spostamento Planare", "level": 7, "usage": { "type": "al giorno", "times": 1 } },
          { "name": "Muro di Fuoco", "level": 4, "usage": { "type": "al giorno", "times": 1 } }
        ]
      }
    }
  ],
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "L'efreeti effettua due attacchi di scimitarra o usa Scagliare Fiamme due volte.",
      "multiattack_type": "action_options"
    },
    {
      "name": "Scimitarra",
      "desc": "Attacco con Arma da Mischia: +10 per colpire, portata 1,5 m., un bersaglio. Colpito: 13 (2d6 + 6) danni taglienti più 7 (2d6) danni da fuoco.",
      "attack_bonus": 10,
      "damage": [
        {
          "damage_type": { "index": "slashing", "name": "Tagliente" },
          "damage_dice": "2d6+6"
        },
        {
          "damage_type": { "index": "fire", "name": "Fuoco" },
          "damage_dice": "2d6"
        }
      ]
    },
    {
      "name": "Scagliare Fiamme",
      "desc": "Attacco da Incantesimo a Distanza: +7 per colpire, gittata 36 m., un bersaglio. Colpito: 17 (5d6) danni da fuoco.",
      "attack_bonus": 7,
      "damage": [
        {
          "damage_type": { "index": "fire", "name": "Fuoco" },
          "damage_dice": "5d6"
        }
      ]
    }
  ],
  "image": "/api/images/monsters/efreeti.png",
  "url": "/api/2014/monsters/efreeti",
  "updated_at": "2025-10-24T20:42:13.741Z"
},
{
  "index": "eagle",
  "name": "Aquila",
  "size": "Piccola",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 12
    }
  ],
  "hit_points": 3,
  "hit_dice": "1d6",
  "hit_points_roll": "1d6",
  "speed": {
    "camminare": "3 m.",
    "volare": "18 m."
  },
  "strength": 6,
  "dexterity": 15,
  "constitution": 10,
  "intelligence": 2,
  "wisdom": 14,
  "charisma": 7,
  "proficiencies": [
    {
      "value": 4,
      "proficiency": {
        "index": "skill-perception",
        "name": "Abilità: Percezione"
      }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 14
  },
  "languages": "",
  "challenge_rating": 0,
  "proficiency_bonus": 2,
  "xp": 10,
  "special_abilities": [
    {
      "name": "Vista Acuta",
      "desc": "L'aquila ha vantaggio alle prove di Saggezza (Percezione) basate sulla vista.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Artigli",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 4 (1d4 + 2) danni taglienti.",
      "attack_bonus": 4,
      "damage": [
        {
          "damage_type": {
            "index": "slashing",
            "name": "Tagliente"
          },
          "damage_dice": "1d4+2"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/eagle.png",
  "url": "/api/2014/monsters/eagle",
  "updated_at": "2025-10-24T20:42:13.741Z"
},
{
  "index": "earth-elemental",
  "name": "Elementale della Terra",
  "size": "Grande",
  "type": "elementale",
  "alignment": "neutrale",
  "armor_class": [
    {
      "type": "naturale",
      "value": 17
    }
  ],
  "hit_points": 126,
  "hit_dice": "12d10",
  "hit_points_roll": "12d10+60",
  "speed": {
    "camminare": "9 m.",
    "scavare": "9 m."
  },
  "strength": 20,
  "dexterity": 8,
  "constitution": 20,
  "intelligence": 5,
  "wisdom": 10,
  "charisma": 5,
  "proficiencies": [],
  "damage_vulnerabilities": [
    "tuono"
  ],
  "damage_resistances": [
    "contundente, perforante e tagliente da attacchi non magici"
  ],
  "damage_immunities": [
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "exhaustion",
      "name": "Indebolimento"
    },
    {
      "index": "paralyzed",
      "name": "Paralizzato"
    },
    {
      "index": "petrified",
      "name": "Pietrificato"
    },
    {
      "index": "poisoned",
      "name": "Avvelenato"
    },
    {
      "index": "unconscious",
      "name": "Privo di Sensi"
    }
  ],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_tellurica": "18 m.",
    "percezione_passiva": 10
  },
  "languages": "Terran",
  "challenge_rating": 5,
  "proficiency_bonus": 3,
  "xp": 1800,
  "special_abilities": [
    {
      "name": "Scivolare sulla Terra",
      "desc": "L'elementale può scavare attraverso terra e pietra non magiche e non lavorate. Mentre lo fa, l'elementale non turba il materiale attraverso cui si muove.",
      "damage": []
    },
    {
      "name": "Mostro d'Assedio",
      "desc": "L'elementale infligge danni raddoppiati agli oggetti e alle strutture.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "L'elementale effettua due attacchi di schianto.",
      "multiattack_type": "actions",
      "actions": [
        {
          "action_name": "Schianto",
          "count": "2",
          "type": "melee"
        }
      ]
    },
    {
      "name": "Schianto",
      "desc": "Attacco con Arma da Mischia: +8 per colpire, portata 3 m., un bersaglio. Colpito: 14 (2d8 + 5) danni contundenti.",
      "attack_bonus": 8,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente"
          },
          "damage_dice": "2d8+5"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/earth-elemental.png",
  "url": "/api/2014/monsters/earth-elemental",
  "updated_at": "2025-10-24T20:42:13.741Z"
},
{
  "index": "elephant",
  "name": "Elefante",
  "size": "Mastodontica",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "naturale",
      "value": 12
    }
  ],
  "hit_points": 76,
  "hit_dice": "8d12",
  "hit_points_roll": "8d12+24",
  "speed": {
    "camminare": "12 m."
  },
  "strength": 22,
  "dexterity": 9,
  "constitution": 17,
  "intelligence": 3,
  "wisdom": 11,
  "charisma": 6,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 10
  },
  "languages": "",
  "challenge_rating": 4,
  "proficiency_bonus": 2,
  "xp": 1100,
  "special_abilities": [
    {
      "name": "Carica Travolgente",
      "desc": "Se l'elefante si muove di almeno 6 metri in linea retta verso una creatura e poi la colpisce con un attacco di incornata nello stesso turno, il bersaglio deve superare un tiro salvezza su Forza CD 12 o essere gettato a terra prono. Se il bersaglio è prono, l'elefante può effettuare un attacco di calpestamento contro di esso come azione bonus.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Incornata",
      "desc": "Attacco con Arma da Mischia: +8 per colpire, portata 1,5 m., un bersaglio. Colpito: 19 (3d8 + 6) danni perforanti.",
      "attack_bonus": 8,
      "damage": [
        {
          "damage_type": {
            "index": "piercing",
            "name": "Perforante"
          },
          "damage_dice": "3d8+6"
        }
      ],
      "actions": []
    },
    {
      "name": "Calpestamento",
      "desc": "Attacco con Arma da Mischia: +8 per colpire, portata 1,5 m., una creatura prona. Colpito: 22 (3d10 + 6) danni contundenti.",
      "attack_bonus": 8,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente"
          },
          "damage_dice": "3d10+6"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/elephant.png",
  "url": "/api/2014/monsters/elephant",
  "updated_at": "2025-10-24T20:42:13.741Z"
},
{
  "index": "ettercap",
  "name": "Ettercap",
  "size": "Media",
  "type": "mostruosità",
  "alignment": "neutrale malvagio",
  "armor_class": [
    {
      "type": "naturale",
      "value": 13
    }
  ],
  "hit_points": 44,
  "hit_dice": "8d8",
  "hit_points_roll": "8d8+8",
  "speed": {
    "camminare": "9 m.",
    "scalare": "9 m."
  },
  "strength": 14,
  "dexterity": 15,
  "constitution": 13,
  "intelligence": 7,
  "wisdom": 12,
  "charisma": 8,
  "proficiencies": [
    {
      "value": 3,
      "proficiency": { "index": "skill-perception", "name": "Abilità: Percezione" }
    },
    {
      "value": 4,
      "proficiency": { "index": "skill-stealth", "name": "Abilità: Furtività" }
    },
    {
      "value": 3,
      "proficiency": { "index": "skill-survival", "name": "Abilità: Sopravvivenza" }
    }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "scurovisione": "18 m.",
    "percezione_passiva": 13
  },
  "languages": "",
  "challenge_rating": 2,
  "proficiency_bonus": 2,
  "xp": 450,
  "special_abilities": [
    {
      "name": "Scalare Ragni",
      "desc": "L'ettercap può scalare superfici difficili, inclusi i soffitti a testa in giù, senza dover effettuare prove di caratteristica.",
      "damage": []
    },
    {
      "name": "Senso della Tela",
      "desc": "Mentre è a contatto con una ragnatela, l'ettercap conosce l'esatta posizione di ogni altra creatura a contatto con la stessa ragnatela.",
      "damage": []
    },
    {
      "name": "Andatura sulle Tele",
      "desc": "L'ettercap ignora le limitazioni al movimento causate dalle ragnatele.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "L'ettercap effettua due attacchi: uno con il morso e uno con gli artigli.",
      "multiattack_type": "actions",
      "actions": [
        { "action_name": "Morso", "count": "1", "type": "melee" },
        { "action_name": "Artigli", "count": "1", "type": "melee" }
      ]
    },
    {
      "name": "Morso",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., una creatura. Colpito: 6 (1d8 + 2) danni perforanti più 4 (1d8) danni da veleno. Il bersaglio deve superare un tiro salvezza su Costituzione CD 11 o essere avvelenato per 1 minuto. La creatura può ripetere il tiro salvezza alla fine di ogni suo turno, terminando l'effetto su se stessa in caso di successo.",
      "attack_bonus": 4,
      "damage": [
        { "damage_type": { "index": "piercing", "name": "Perforante" }, "damage_dice": "1d8+2" },
        { "damage_type": { "index": "poison", "name": "Veleno" }, "damage_dice": "1d8" }
      ]
    },
    {
      "name": "Artigli",
      "desc": "Attacco con Arma da Mischia: +4 per colpire, portata 1,5 m., un bersaglio. Colpito: 7 (2d4 + 2) danni taglienti.",
      "attack_bonus": 4,
      "damage": [
        { "damage_type": { "index": "slashing", "name": "Tagliente" }, "damage_dice": "2d4+2" }
      ]
    },
    {
      "name": "Ragnatela",
      "desc": "Attacco con Arma a Gittata: +4 per colpire, gittata 9/18 m., una creatura di taglia Grande o inferiore. Colpito: La creatura è trattenuta dalla ragnatela. Come azione, la creatura trattenuta può effettuare una prova di Forza CD 11; se la supera, scappa dalla ragnatela. L'effetto termina se la ragnatela viene distrutta. La ragnatela ha CA 10, 5 punti ferita, vulnerabilità ai danni da fuoco e immunità ai danni contundenti.",
      "usage": { "type": "si ricarica dopo un tiro", "dice": "1d6", "min_value": 5 },
      "attack_bonus": 4
    }
  ],
  "image": "/api/images/monsters/ettercap.png",
  "url": "/api/2014/monsters/ettercap",
  "updated_at": "2025-10-24T20:42:13.741Z"
},
{
  "index": "elk",
  "name": "Alce",
  "size": "Grande",
  "type": "bestia",
  "alignment": "non allineato",
  "armor_class": [
    {
      "type": "des",
      "value": 10
    }
  ],
  "hit_points": 13,
  "hit_dice": "2d10",
  "hit_points_roll": "2d10+2",
  "speed": {
    "camminare": "15 m."
  },
  "strength": 16,
  "dexterity": 10,
  "constitution": 12,
  "intelligence": 2,
  "wisdom": 10,
  "charisma": 6,
  "proficiencies": [],
  "damage_vulnerabilities": [],
  "damage_resistances": [],
  "damage_immunities": [],
  "condition_immunities": [],
  "senses": {
    "percezione_passiva": 10
  },
  "languages": "",
  "challenge_rating": 0.25,
  "proficiency_bonus": 2,
  "xp": 50,
  "special_abilities": [
    {
      "name": "Carica",
      "desc": "Se l'alce si muove di almeno 6 metri in linea retta verso un bersaglio e poi lo colpisce con un attacco di incornata nello stesso turno, il bersaglio subisce 7 (2d6) danni extra. Se il bersaglio è una creatura, deve superare un tiro salvezza su Forza CD 13 o essere gettato a terra prono.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Incornata",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., un bersaglio. Colpito: 6 (1d6 + 3) danni contundenti.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente"
          },
          "damage_dice": "1d6+3"
        }
      ],
      "actions": []
    },
    {
      "name": "Zoccoli",
      "desc": "Attacco con Arma da Mischia: +5 per colpire, portata 1,5 m., una creatura prona. Colpito: 8 (2d4 + 3) danni contundenti.",
      "attack_bonus": 5,
      "damage": [
        {
          "damage_type": {
            "index": "bludgeoning",
            "name": "Contundente"
          },
          "damage_dice": "2d4+3"
        }
      ],
      "actions": []
    }
  ],
  "image": "/api/images/monsters/elk.png",
  "url": "/api/2014/monsters/elk",
  "updated_at": "2025-10-24T20:42:13.741Z"
},
{
  "index": "erinyes",
  "name": "Erinni",
  "size": "Media",
  "type": "immondo",
  "subtype": "diavolo",
  "alignment": "legale malvagio",
  "armor_class": [
    {
      "type": "armatura",
      "value": 18,
      "armor": [
        {
          "index": "plate-armor",
          "name": "Armatura a Piastre"
        }
      ]
    }
  ],
  "hit_points": 153,
  "hit_dice": "18d8",
  "hit_points_roll": "18d8+72",
  "speed": {
    "camminare": "9 m.",
    "volare": "18 m."
  },
  "strength": 18,
  "dexterity": 16,
  "constitution": 18,
  "intelligence": 14,
  "wisdom": 14,
  "charisma": 18,
  "proficiencies": [
    { "value": 7, "proficiency": { "index": "saving-throw-dex", "name": "Tiro Salvezza: DES" } },
    { "value": 8, "proficiency": { "index": "saving-throw-con", "name": "Tiro Salvezza: COS" } },
    { "value": 6, "proficiency": { "index": "saving-throw-wis", "name": "Tiro Salvezza: SAG" } },
    { "value": 8, "proficiency": { "index": "saving-throw-cha", "name": "Tiro Salvezza: CAR" } }
  ],
  "damage_vulnerabilities": [],
  "damage_resistances": [
    "freddo",
    "contundente, perforante e tagliente da attacchi non magici che non siano d'argento"
  ],
  "damage_immunities": [
    "fuoco",
    "veleno"
  ],
  "condition_immunities": [
    {
      "index": "poisoned",
      "name": "Avvelenato"
    }
  ],
  "senses": {
    "visione_del_vero": "36 m.",
    "percezione_passiva": 12
  },
  "languages": "Infernale, telepatia 36 m.",
  "challenge_rating": 12,
  "proficiency_bonus": 4,
  "xp": 8400,
  "special_abilities": [
    {
      "name": "Armi Infernali",
      "desc": "Gli attacchi con arma dell'erinni sono magici e infliggono 13 (3d8) danni da veleno extra quando colpiscono (inclusi negli attacchi).",
      "damage": []
    },
    {
      "name": "Resistenza Magica",
      "desc": "L'erinni ha vantaggio ai tiri salvezza contro incantesimi e altri effetti magici.",
      "damage": []
    }
  ],
  "actions": [
    {
      "name": "Multiattacco",
      "desc": "L'erinni effettua tre attacchi.",
      "multiattack_type": "action_options"
    },
    {
      "name": "Spada Lunga",
      "desc": "Attacco con Arma da Mischia: +8 per colpire, portata 1,5 m., un bersaglio. Colpito: 8 (1d8 + 4) danni taglienti, o 9 (1d10 + 4) danni taglienti se usata a due mani, più 13 (3d8) danni da veleno.",
      "attack_bonus": 8,
      "damage": [
        {
          "damage_type": { "index": "slashing", "name": "Tagliente" },
          "damage_dice": "1d8+4"
        },
        {
          "damage_type": { "index": "poison", "name": "Veleno" },
          "damage_dice": "3d8"
        }
      ]
    },
    {
      "name": "Arco Lungo",
      "desc": "Attacco con Arma a Gittata: +7 per colpire, gittata 45/180 m., un bersaglio. Colpito: 7 (1d8 + 3) danni perforanti più 13 (3d8) danni da veleno, e il bersaglio deve superare un tiro salvezza su Costituzione CD 14 o essere avvelenato. Il veleno dura finché non viene rimosso dall'incantesimo ristorare inferiore o da una magia simile.",
      "attack_bonus": 7,
      "damage": [
        {
          "damage_type": { "index": "piercing", "name": "Perforante" },
          "damage_dice": "1d8+3"
        },
        {
          "damage_type": { "index": "poison", "name": "Veleno" },
          "damage_dice": "3d8"
        }
      ]
    }
  ],
  "reactions": [
    {
      "name": "Parata",
      "desc": "L'erinni aggiunge 4 alla sua CA contro un attacco in mischia che la colpirebbe. Per farlo, l'erinni deve vedere l'attaccante e impugnare un'arma da mischia."
    }
  ],
  "image": "/api/images/monsters/erinyes.png",
  "url": "/api/2014/monsters/erinyes",
  "updated_at": "2025-10-24T20:42:13.741Z"
},

]