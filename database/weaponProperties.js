// ==========================================================================
// database/weaponProperties.js
// ==========================================================================

const weaponProperties = [
  {
    "index": "ammunition",
    "name": "Munizioni",
    "desc": [
      "Puoi usare un'arma che ha la proprietà munizioni per effettuare un attacco a distanza solo se hai le munizioni necessarie al tiro. Ogni volta che attacchi con l'arma, consumi una munizione. Estrarre le munizioni da una faretra, una borsa o un altro contenitore fa parte dell'attacco (ti serve una mano libera per caricare un'arma a una mano).",
      "Al termine della battaglia, puoi recuperare metà delle munizioni utilizzate impiegando un minuto per perlustrare il campo di battaglia. Se usi un'arma con la proprietà munizioni per effettuare un attacco in mischia, essa viene considerata un'arma improvvisata (vedi \"Armi Improvvisate\" più avanti nella sezione). Una fionda deve essere carica per infliggere danni quando viene usata in questo modo."
    ],
    "url": "/api/2014/weapon-properties/ammunition"
  },
  {
    "index": "finesse",
    "name": "Accurata",
    "desc": [
      "Quando effettui un attacco con un'arma accurata, puoi scegliere se usare il tuo modificatore di Forza o di Destrezza per il tiro per colpire e per il tiro dei danni. Devi usare lo stesso modificatore per entrambi i tiri."
    ],
    "url": "/api/2014/weapon-properties/finesse"
  },
  {
    "index": "heavy",
    "name": "Pesante",
    "desc": [
      "Le creature di taglia Piccola hanno svantaggio ai tiri per colpire effettuati con armi pesanti. La taglia e la mole di un'arma pesante la rendono troppo grande per essere usata efficacemente da una creatura Piccola."
    ],
    "url": "/api/2014/weapon-properties/heavy"
  },
  {
    "index": "light",
    "name": "Leggera",
    "desc": [
      "Un'arma leggera è piccola e facile da maneggiare, rendendola ideale per combattere con due armi."
    ],
    "url": "/api/2014/weapon-properties/light"
  },
  {
    "index": "loading",
    "name": "Ricarica",
    "desc": [
      "A causa del tempo necessario per caricare l'arma, puoi sparare una sola munizione quando usi un'azione, un'azione bonus o una reazione per sparare, a prescindere dal numero di attacchi che puoi normalmente effettuare."
    ],
    "url": "/api/2014/weapon-properties/loading"
  },
  {
    "index": "monk",
    "name": "Monaco",
    "desc": [
      "I monaci ottengono diversi benefici quando sono senz'armi o quando impugnano solo armi da monaco, a patto che non indossino armature o non impugnino scudi."
    ],
    "url": "/api/2014/weapon-properties/monk"
  },
  {
    "index": "reach",
    "name": "Portata",
    "desc": [
      "Quest'arma aggiunge 1,5 metri (5 piedi) alla tua portata quando attacchi con essa, così come quando determini la tua portata per gli attacchi di opportunità effettuati con essa."
    ],
    "url": "/api/2014/weapon-properties/reach"
  },
  {
    "index": "special",
    "name": "Speciale",
    "desc": [
      "Un'arma con la proprietà speciale possiede regole insolite che ne governano l'uso, spiegate nella descrizione dell'arma stessa (vedi \"Armi Speciali\" più avanti in questa sezione)."
    ],
    "url": "/api/2014/weapon-properties/special"
  },
  {
    "index": "thrown",
    "name": "Lancio",
    "desc": [
      "Se un'arma ha la proprietà lancio, puoi lanciare l'arma per effettuare un attacco a distanza. Se l'arma è un'arma da mischia, usi per il tiro per colpire e per il tiro dei danni lo stesso modificatore di caratteristica che useresti per un attacco in mischia con quell'arma. Per esempio, se lanci un'ascia da battaglia, usi Forza, ma se lanci un pugnale, puoi usare Forza o Destrezza, poiché il pugnale ha la proprietà accurata."
    ],
    "url": "/api/2014/weapon-properties/thrown"
  },
  {
    "index": "two-handed",
    "name": "Due Mani",
    "desc": [
      "Quest'arma richiede l'uso di due mani quando effettui un attacco con essa."
    ],
    "url": "/api/2014/weapon-properties/two-handed"
  },
  {
    "index": "versatile",
    "name": "Versatile",
    "desc": [
      "Quest'arma può essere usata con una o due mani. Tra parentesi viene indicato il valore dei danni quando l'arma viene usata con due mani per effettuare un attacco in mischia."
    ],
    "url": "/api/2014/weapon-properties/versatile"
  }
];

export const weaponPropertiesDatabase = weaponProperties;