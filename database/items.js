// items.js

// Database degli oggetti (SRD 5.1 in Italiano)
// Per aggiungere un oggetto, copia questo blocco e modificalo.
export const itemDatabase = [
  {
    "desc": [],
    "special": [],
    "index": "abacus",
    "name": "Abaco",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 1,
    "url": "/api/2014/equipment/abacus",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "acid-vial",
    "name": "Acido (fiala)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Come azione, un personaggio può spruzzare il contenuto di questa fiala su una creatura entro 1,5 metri da lui o scagliare la fiala fino a una distanza di 6 metri, facendola frantumare all'impatto. In entrambi i casi deve effettuare un attacco con arma a distanza contro una creatura o un oggetto, considerando l'acido come un'arma improvvisata.",
      "Se l'attacco va a segno, il bersaglio subisce 2d6 danni da acido."
    ],
    "url": "/api/2014/equipment/acid-vial",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "alchemists-fire-flask",
    "name": "Fuoco dell'alchimista (ampolla)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "desc": [
      "Questo fluido viscoso e adesivo prende fuoco quando viene esposto all'aria.",
      "Come azione, un personaggio può scagliare questa ampolla fino a una distanza di 6 metri, facendola frantumare all'impatto. Deve effettuare un attacco con arma a distanza contro una creatura o un oggetto, considerando il fuoco dell'alchimista come un'arma improvvisata.",
      "Se l'attacco va a segno, il bersaglio subisce 1d4 danni da fuoco all'inizio di ogni suo turno. Una creatura può porre fine a questi danni superando una prova di Destrezza CD 10 per estinguere le fiamme come azione."
    ],
    "weight": 0.5,
    "url": "/api/2014/equipment/alchemists-fire-flask",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "alchemists-supplies",
    "name": "Scorte da Alchimista",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "weight": 4,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/alchemists-supplies",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "alms-box",
    "name": "Cassetta delle elemosine",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 0,
      "unit": "mr"
    },
    "weight": 0,
    "desc": [
      "Una piccola scatola per le elemosine, tipicamente contenuta nella dotazione da sacerdote."
    ],
    "url": "/api/2014/equipment/alms-box",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "amulet",
    "name": "Amuleto",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "holy-symbols",
      "name": "Simboli Sacri",
      "url": "/api/2014/equipment-categories/holy-symbols"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Un simbolo sacro è una rappresentazione di una divinità o di un pantheon. Può essere un amuleto che raffigura un simbolo rappresentante una divinità, lo stesso simbolo accuratamente inciso o intarsiato come emblema su uno scudo, o una piccola scatola contenente un frammento di una reliquia sacra.",
      "L'Appendice B elenca i simboli comunemente associati a molte divinità del multiverso. Un chierico o un paladino può utilizzare un simbolo sacro come focus di incantamento. Per utilizzare il simbolo in questo modo, l'incantatore deve tenerlo in mano, indossarlo visibilmente o portarlo su uno scudo."
    ],
    "url": "/api/2014/equipment/amulet",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "animal-feed-1-day",
    "name": "Foraggio (1 giorno)",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 5,
      "unit": "mr"
    },
    "weight": 5,
    "url": "/api/2014/equipment/animal-feed-1-day",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "antitoxin-vial",
    "name": "Antitossina (fiala)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "weight": 0,
    "desc": [
      "Una creatura che beve il liquido contenuto in questa fiala ottiene vantaggio ai tiri salvezza contro il veleno per 1 ora. Non conferisce alcun beneficio a non morti o costrutti."
    ],
    "url": "/api/2014/equipment/antitoxin-vial",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "arrow",
    "name": "Freccia",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "ammunition",
      "name": "Munizioni",
      "url": "/api/2014/equipment-categories/ammunition"
    },
    "quantity": 20,
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 0.5,
    "url": "/api/2014/equipment/arrow",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "backpack",
    "name": "Zaino",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 2.5,
    "url": "/api/2014/equipment/backpack",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "bagpipes",
    "name": "Cornamusa",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumento Musicale",
    "cost": {
      "quantity": 30,
      "unit": "mo"
    },
    "weight": 3,
    "desc": [
      "La tabella riporta alcuni dei tipi più comuni di strumenti musicali a titolo di esempio. Se un personaggio possiede competenza in un determinato strumento musicale, può sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per suonare musica con quello strumento. Un bardo può utilizzare uno strumento musicale come focus di incantamento. Ogni tipo di strumento musicale richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/bagpipes",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "ball-bearings-bag-of-1000",
    "name": "Sfere d'acciaio (sacchetto da 1.000)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Come azione, un personaggio può spargere queste minuscole sfere di metallo dal loro sacchetto per coprire un'area piana di 3 metri per lato.",
      "Una creatura che si muove attraverso l'area coperta deve superare un Tiro Salvezza di Destrezza CD 10 o cadere prona.",
      "Una creatura che si muove attraverso l'area a velocità dimezzata non ha bisogno di effettuare il tiro salvezza."
    ],
    "image": "/api/images/equipment/ball-bearings-bag-of-1000.png",
    "url": "/api/2014/equipment/ball-bearings-bag-of-1000",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-breastplate",
    "name": "Bardatura: Pettorale",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 1600,
      "unit": "mo"
    },
    "weight": 20,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-breastplate",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-chain-mail",
    "name": "Bardatura: Cotta di maglia",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 300,
      "unit": "mo"
    },
    "weight": 55,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-chain-mail",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-chain-shirt",
    "name": "Bardatura: Camicia di maglia",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 200,
      "unit": "mo"
    },
    "weight": 20,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-chain-shirt",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-half-plate",
    "name": "Bardatura: Mezza Armatura",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 3000,
      "unit": "mo"
    },
    "weight": 40,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-half-plate",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-hide",
    "name": "Bardatura: Pelle",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 40,
      "unit": "mo"
    },
    "weight": 12,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-hide",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-leather",
    "name": "Bardatura: Cuoio",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 40,
      "unit": "mo"
    },
    "weight": 10,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-leather",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-padded",
    "name": "Bardatura: Imbottita",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 20,
      "unit": "mo"
    },
    "weight": 8,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-padded",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-plate",
    "name": "Bardatura: Armatura Completa",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 6000,
      "unit": "mo"
    },
    "weight": 65,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-plate",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-ring-mail",
    "name": "Bardatura: Corazza ad Anelli",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 12,
      "unit": "mo"
    },
    "weight": 40,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-ring-mail",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-scale-mail",
    "name": "Bardatura: Corazza di Scaglie",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 200,
      "unit": "mo"
    },
    "weight": 45,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-scale-mail",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-splint",
    "name": "Bardatura: Corazza a Strisce",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 800,
      "unit": "mo"
    },
    "weight": 60,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-splint",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "barding-studded-leather",
    "name": "Bardatura: Cuoio Borchiato",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 180,
      "unit": "mo"
    },
    "weight": 13,
    "desc": [
      "La bardatura è un'armatura progettata per proteggere la testa, il collo, il petto e il corpo di un animale. Qualsiasi tipo di armatura presente nella tabella Armature può essere acquistata come bardatura. Il costo è quattro volte superiore a quello della versione equivalente per umanoidi e il peso è il doppio."
    ],
    "url": "/api/2014/equipment/barding-studded-leather",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "barrel",
    "name": "Barile",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 35,
    "url": "/api/2014/equipment/barrel",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "basket",
    "name": "Cesto",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 4,
      "unit": "ma"
    },
    "weight": 1,
    "url": "/api/2014/equipment/basket",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "battleaxe",
    "name": "Ascia da Battaglia",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 2,
    "properties": [
      {
        "index": "versatile",
        "name": "Versatile",
        "url": "/api/2014/weapon-properties/versatile"
      }
    ],
    "two_handed_damage": {
      "damage_dice": "1d10",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "url": "/api/2014/equipment/battleaxe",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "bedroll",
    "name": "Sacco a Pelo",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 3.5,
    "url": "/api/2014/equipment/bedroll",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "bell",
    "name": "Campanella",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 0,
    "url": "/api/2014/equipment/bell",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "bit-and-bridle",
    "name": "Morso e Briglia",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 0.5,
    "url": "/api/2014/equipment/bit-and-bridle",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "blanket",
    "name": "Coperta",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "ma"
    },
    "weight": 1.5,
    "url": "/api/2014/equipment/blanket",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "block-and-tackle",
    "name": "Paranco",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "Un insieme di pulegge con un cavo infilato e un gancio per fissare gli oggetti; un paranco permette di sollevare fino a quattro volte il peso che un personaggio può normalmente sollevare."
    ],
    "url": "/api/2014/equipment/block-and-tackle",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "block-of-incense",
    "name": "Blocchetto di incenso",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 0,
      "unit": "mr"
    },
    "weight": 0,
    "desc": [
      "Un blocchetto di incenso, tipicamente contenuto nella dotazione da sacerdote."
    ],
    "url": "/api/2014/equipment/block-of-incense",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "blowgun",
    "name": "Cerbottana",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "A Distanza",
    "category_range": "Arma Marziale a Distanza",
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 7.5,
      "long": 30
    },
    "weight": 0.5,
    "properties": [
      {
        "index": "ammunition",
        "name": "Munizioni",
        "url": "/api/2014/weapon-properties/ammunition"
      },
      {
        "index": "loading",
        "name": "Ricarica",
        "url": "/api/2014/weapon-properties/loading"
      }
    ],
    "url": "/api/2014/equipment/blowgun",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "blowgun-needle",
    "name": "Aghi da cerbottana",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "ammunition",
      "name": "Munizioni",
      "url": "/api/2014/equipment-categories/ammunition"
    },
    "quantity": 50,
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 0.5,
    "url": "/api/2014/equipment/blowgun-needle",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "book",
    "name": "Libro",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "Un libro può contenere poesie, resoconti storici, informazioni relative a un particolare campo del sapere, diagrammi e note su congegni gnomeschi o quasi qualsiasi altra cosa che possa essere rappresentata tramite testi o immagini. Un libro di incantesimi è un libro degli incantesimi (descritto più avanti in questa sezione)."
    ],
    "url": "/api/2014/equipment/book",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "bottle-glass",
    "name": "Bottiglia di vetro",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 1,
    "url": "/api/2014/equipment/bottle-glass",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "breastplate",
    "name": "Pettorale",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Media",
    "armor_class": {
      "base": 14,
      "dex_bonus": true,
      "max_bonus": 2
    },
    "str_minimum": 0,
    "stealth_disadvantage": false,
    "weight": 10,
    "cost": {
      "quantity": 400,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/breastplate",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "brewers-supplies",
    "name": "Scorte da Birraio",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 20,
      "unit": "mo"
    },
    "weight": 4.5,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/brewers-supplies",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "bucket",
    "name": "Secchio",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mr"
    },
    "weight": 1,
    "url": "/api/2014/equipment/bucket",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "burglars-pack",
    "name": "Dotazione da Scassinatore",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "equipment-packs",
      "name": "Zaini e Dotazioni",
      "url": "/api/2014/equipment-categories/equipment-packs"
    },
    "cost": {
      "quantity": 16,
      "unit": "mo"
    },
    "contents": [
      {
        "item": {
          "index": "backpack",
          "name": "Zaino",
          "url": "/api/2014/equipment/backpack"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "ball-bearings-bag-of-1000",
          "name": "Sfere d'acciaio (sacchetto da 1.000)",
          "url": "/api/2014/equipment/ball-bearings-bag-of-1000"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "string-10-feet",
          "name": "Cordino (3 metri)",
          "url": "/api/2014/equipment/string-10-feet"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "bell",
          "name": "Campanella",
          "url": "/api/2014/equipment/bell"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "candle",
          "name": "Candela",
          "url": "/api/2014/equipment/candle"
        },
        "quantity": 5
      },
      {
        "item": {
          "index": "crowbar",
          "name": "Piede di porco",
          "url": "/api/2014/equipment/crowbar"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "hammer",
          "name": "Martello",
          "url": "/api/2014/equipment/hammer"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "piton",
          "name": "Chiodo da roccia",
          "url": "/api/2014/equipment/piton"
        },
        "quantity": 10
      },
      {
        "item": {
          "index": "lantern-hooded",
          "name": "Lanterna schermata",
          "url": "/api/2014/equipment/lantern-hooded"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "oil-flask",
          "name": "Olio (ampolla)",
          "url": "/api/2014/equipment/oil-flask"
        },
        "quantity": 2
      },
      {
        "item": {
          "index": "rations-1-day",
          "name": "Razioni (1 giorno)",
          "url": "/api/2014/equipment/rations-1-day"
        },
        "quantity": 5
      },
      {
        "item": {
          "index": "tinderbox",
          "name": "Acciarino",
          "url": "/api/2014/equipment/tinderbox"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "waterskin",
          "name": "Otre",
          "url": "/api/2014/equipment/waterskin"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "rope-hempen-50-feet",
          "name": "Corda di canapa (15 metri)",
          "url": "/api/2014/equipment/rope-hempen-50-feet"
        },
        "quantity": 1
      }
    ],
    "url": "/api/2014/equipment/burglars-pack",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "properties": []
  },
  {
    "special": [],
    "index": "calligraphers-supplies",
    "name": "Strumenti da Calligrafo",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/calligraphers-supplies",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "caltrops",
    "name": "Triboli",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mr"
    },
    "weight": 1,
    "desc": [
      "Come azione, un personaggio può spargere un sacchetto di triboli per coprire un'area di 1,5 metri per lato.",
      "Ogni creatura che entra nell'area deve superare un Tiro Salvezza di Destrezza CD 15; se lo fallisce, deve interrompere il proprio movimento per quel turno e subisce 1 danno perforante.",
      "Finché la creatura non recupera almeno 1 punto ferita, la sua velocità di cammino è ridotta di 3 metri.",
      "Una creatura che si muove attraverso l'area a velocità dimezzata non ha bisogno di effettuare il tiro salvezza."
    ],
    "url": "/api/2014/equipment/caltrops",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "camel",
    "name": "Cammello",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Cavalcature e Altri Animali",
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "speed": {
      "quantity": 15,
      "unit": "metri/round"
    },
    "capacity": "240 kg",
    "url": "/api/2014/equipment/camel",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "candle",
    "name": "Candela",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mr"
    },
    "weight": 0,
    "desc": [
      "Per 1 ora, una candela emette luce intensa entro un raggio di 1,5 metri e luce fioca per altri 1,5 metri."
    ],
    "url": "/api/2014/equipment/candle",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "carpenters-tools",
    "name": "Strumenti da Falegname",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 8,
      "unit": "mo"
    },
    "weight": 3,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/carpenters-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "carriage",
    "name": "Carrozza",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 100,
      "unit": "mo"
    },
    "weight": 300,
    "url": "/api/2014/equipment/carriage",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "cart",
    "name": "Carretto",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 15,
      "unit": "mo"
    },
    "weight": 100,
    "url": "/api/2014/equipment/cart",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "cartographers-tools",
    "name": "Strumenti da Cartografo",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 15,
      "unit": "mo"
    },
    "weight": 3,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/cartographers-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "case-crossbow-bolt",
    "name": "Custodia per quadrelli",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Questa custodia di legno può contenere fino a venti quadrelli da balestra."
    ],
    "url": "/api/2014/equipment/case-crossbow-bolt",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "case-map-or-scroll",
    "name": "Custodia per mappe o pergamene",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Questa custodia cilindrica in cuoio può contenere fino a dieci fogli di carta arrotolati o cinque fogli di pergamena arrotolati."
    ],
    "url": "/api/2014/equipment/case-map-or-scroll",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "censer",
    "name": "Incensiere",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 0,
      "unit": "mr"
    },
    "weight": 0,
    "desc": [
      "Un incensiere, tipicamente contenuto nella dotazione da sacerdote."
    ],
    "url": "/api/2014/equipment/censer",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "chain-10-feet",
    "name": "Catena (3 metri)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 5,
    "desc": [
      "Una catena ha 10 punti ferita. Può essere spezzata con una prova di Forza CD 20 effettuata con successo."
    ],
    "url": "/api/2014/equipment/chain-10-feet",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "chain-mail",
    "name": "Cotta di Maglia",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Pesante",
    "armor_class": {
      "base": 16,
      "dex_bonus": false
    },
    "str_minimum": 13,
    "stealth_disadvantage": true,
    "weight": 27.5,
    "cost": {
      "quantity": 75,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/chain-mail",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "chain-shirt",
    "name": "Giaco di Maglia",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Media",
    "armor_class": {
      "base": 13,
      "dex_bonus": true,
      "max_bonus": 2
    },
    "str_minimum": 0,
    "stealth_disadvantage": false,
    "weight": 10,
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/chain-shirt",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "chalk-1-piece",
    "name": "Gesso (1 pezzo)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mr"
    },
    "weight": 0,
    "url": "/api/2014/equipment/chalk-1-piece",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "chariot",
    "name": "Biga",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Bardature, Finimenti e Veicoli a Traino",
    "cost": {
      "quantity": 250,
      "unit": "mo"
    },
    "weight": 50,
    "url": "/api/2014/equipment/chariot",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "chest",
    "name": "Forziere",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 12.5,
    "url": "/api/2014/equipment/chest",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "climbers-kit",
    "name": "Dotazione da Scalatore",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "kits",
      "name": "Dotazioni",
      "url": "/api/2014/equipment-categories/kits"
    },
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "weight": 6,
    "desc": [
      "Una dotazione da scalatore include chiodi da roccia speciali, punte per gli stivali, guanti e un'imbracatura. Un personaggio può usare la dotazione da scalatore come azione per ancorarsi; quando lo fa, non può cadere per più di 7,5 metri dal punto in cui si è ancorato e non può salire per più di 7,5 metri da quel punto senza sciogliere l'ancoraggio."
    ],
    "url": "/api/2014/equipment/climbers-kit",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "clothes-common",
    "name": "Abiti comuni",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "ma"
    },
    "weight": 1.5,
    "url": "/api/2014/equipment/clothes-common",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "clothes-costume",
    "name": "Abiti da intrattenitore",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 2,
    "url": "/api/2014/equipment/clothes-costume",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "clothes-fine",
    "name": "Abiti pregiati",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 15,
      "unit": "mo"
    },
    "weight": 3,
    "url": "/api/2014/equipment/clothes-fine",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "clothes-travelers",
    "name": "Abiti da viaggiatore",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 2,
    "url": "/api/2014/equipment/clothes-travelers",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "club",
    "name": "Randello",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Mischia",
    "category_range": "Arma Semplice da Mischia",
    "cost": {
      "quantity": 1,
      "unit": "ma"
    },
    "damage": {
      "damage_dice": "1d4",
      "damage_type": {
        "index": "bludgeoning",
        "name": "Contundente",
        "url": "/api/2014/damage-types/bludgeoning"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1,
    "properties": [
      {
        "index": "light",
        "name": "Leggera",
        "url": "/api/2014/weapon-properties/light"
      },
      {
        "index": "monk",
        "name": "Monaco",
        "url": "/api/2014/weapon-properties/monk"
      }
    ],
    "url": "/api/2014/equipment/club",
    "updated_at": "2025-10-24T20:42:12.925Z",
    "contents": []
  },
  {
    "special": [],
    "index": "cobblers-tools",
    "name": "Strumenti da Calzolaio",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/cobblers-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "component-pouch",
    "name": "Borsa delle componenti",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Una borsa delle componenti è una piccola borsa di cuoio impermeabile da agganciare alla cintura; è dotata di scomparti in cui riporre tutte le componenti materiali e altri oggetti speciali necessari per lanciare gli incantesimi, a eccezione di quelle componenti che hanno un costo specifico (come indicato nella descrizione dell'incantesimo)."
    ],
    "url": "/api/2014/equipment/component-pouch",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "cooks-utensils",
    "name": "Utensili da cuoco",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 4,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/cooks-utensils",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "crossbow-bolt",
    "name": "Quadrelli da balestra",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "ammunition",
      "name": "Munizioni",
      "url": "/api/2014/equipment-categories/ammunition"
    },
    "quantity": 20,
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 0.75,
    "url": "/api/2014/equipment/crossbow-bolt",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "crossbow-hand",
    "name": "Balestra a mano",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "A Distanza",
    "category_range": "Arma Marziale a Distanza",
    "cost": {
      "quantity": 75,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d6",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 9,
      "long": 36
    },
    "weight": 1.5,
    "properties": [
      {
        "index": "ammunition",
        "name": "Munizioni",
        "url": "/api/2014/weapon-properties/ammunition"
      },
      {
        "index": "light",
        "name": "Leggera",
        "url": "/api/2014/weapon-properties/light"
      },
      {
        "index": "loading",
        "name": "Ricarica",
        "url": "/api/2014/weapon-properties/loading"
      }
    ],
    "url": "/api/2014/equipment/crossbow-hand",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "crossbow-heavy",
    "name": "Balestra pesante",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "A Distanza",
    "category_range": "Arma Marziale a Distanza",
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d10",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 30,
      "long": 120
    },
    "weight": 9,
    "properties": [
      {
        "index": "ammunition",
        "name": "Munizioni",
        "url": "/api/2014/weapon-properties/ammunition"
      },
      {
        "index": "heavy",
        "name": "Pesante",
        "url": "/api/2014/weapon-properties/heavy"
      },
      {
        "index": "loading",
        "name": "Ricarica",
        "url": "/api/2014/weapon-properties/loading"
      },
      {
        "index": "two-handed",
        "name": "A Due Mani",
        "url": "/api/2014/weapon-properties/two-handed"
      }
    ],
    "image": "/api/images/equipment/crossbow-heavy.png",
    "url": "/api/2014/equipment/crossbow-heavy",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "crossbow-light",
    "name": "Balestra leggera",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "A Distanza",
    "category_range": "Arma Semplice a Distanza",
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 24,
      "long": 96
    },
    "weight": 2.5,
    "properties": [
      {
        "index": "ammunition",
        "name": "Munizioni",
        "url": "/api/2014/weapon-properties/ammunition"
      },
      {
        "index": "loading",
        "name": "Ricarica",
        "url": "/api/2014/weapon-properties/loading"
      },
      {
        "index": "two-handed",
        "name": "A Due Mani",
        "url": "/api/2014/weapon-properties/two-handed"
      }
    ],
    "url": "/api/2014/equipment/crossbow-light",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "crowbar",
    "name": "Piede di porco",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "L'uso di un piede di porco conferisce vantaggio alle prove di Forza in cui è possibile applicare la leva dello strumento."
    ],
    "url": "/api/2014/equipment/crowbar",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "crystal",
    "name": "Cristallo",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "arcane-foci",
      "name": "Focalizzatori Arcani",
      "url": "/api/2014/equipment-categories/arcane-foci"
    },
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Un focalizzatore arcano è un oggetto speciale (una sfera, un cristallo, una bacchetta, un bastone appositamente costruito, un pezzo di legno simile a una verga o un oggetto simile) progettato per incanalare il potere degli incantesimi arcani. Un mago, uno stregone o un warlock può usare tale oggetto come focalizzatore da incantatore."
    ],
    "url": "/api/2014/equipment/crystal",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "dagger",
    "name": "Pugnale",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Mischia",
    "category_range": "Arma Semplice da Mischia",
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d4",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 0.5,
    "properties": [
      {
        "index": "finesse",
        "name": "Accurata",
        "url": "/api/2014/weapon-properties/finesse"
      },
      {
        "index": "light",
        "name": "Leggera",
        "url": "/api/2014/weapon-properties/light"
      },
      {
        "index": "thrown",
        "name": "Lancio",
        "url": "/api/2014/weapon-properties/thrown"
      },
      {
        "index": "monk",
        "name": "Monaco",
        "url": "/api/2014/weapon-properties/monk"
      }
    ],
    "throw_range": {
      "normal": 6,
      "long": 18
    },
    "url": "/api/2014/equipment/dagger",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "dart",
    "name": "Dardo",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "A Distanza",
    "category_range": "Arma Semplice a Distanza",
    "cost": {
      "quantity": 5,
      "unit": "mr"
    },
    "damage": {
      "damage_dice": "1d4",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 6,
      "long": 18
    },
    "weight": 0.125,
    "properties": [
      {
        "index": "finesse",
        "name": "Accurata",
        "url": "/api/2014/weapon-properties/finesse"
      },
      {
        "index": "thrown",
        "name": "Lancio",
        "url": "/api/2014/weapon-properties/thrown"
      }
    ],
    "throw_range": {
      "normal": 6,
      "long": 18
    },
    "url": "/api/2014/equipment/dart",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "dice-set",
    "name": "Set di dadi",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Set da Gioco",
    "cost": {
      "quantity": 1,
      "unit": "ma"
    },
    "weight": 0,
    "desc": [
      "Questa voce comprende un'ampia gamma di pezzi da gioco, inclusi dadi e mazzi di carte (per giochi come l'Azzardo dei Tre Draghi). Alcuni esempi comuni appaiono nella tabella degli Strumenti, ma esistono altri tipi di set da gioco. Se un personaggio è competente in un set da gioco, può sommare il proprio bonus di competenza alle prove di caratteristica effettuate per giocare a un gioco con quel set. Ogni tipo di set da gioco richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/dice-set",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "diplomats-pack",
    "name": "Dotazione da Diplomatico",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "equipment-packs",
      "name": "Zaini e Dotazioni",
      "url": "/api/2014/equipment-categories/equipment-packs"
    },
    "cost": {
      "quantity": 39,
      "unit": "mo"
    },
    "contents": [
      {
        "item": {
          "index": "chest",
          "name": "Forziere",
          "url": "/api/2014/equipment/chest"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "case-map-or-scroll",
          "name": "Custodia per mappe o pergamene",
          "url": "/api/2014/equipment/case-map-or-scroll"
        },
        "quantity": 2
      },
      {
        "item": {
          "index": "clothes-fine",
          "name": "Abiti pregiati",
          "url": "/api/2014/equipment/clothes-fine"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "ink-1-ounce-bottle",
          "name": "Inchiostro (fiala da 30 ml)",
          "url": "/api/2014/equipment/ink-1-ounce-bottle"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "ink-pen",
          "name": "Pennino",
          "url": "/api/2014/equipment/ink-pen"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "lamp",
          "name": "Lampada",
          "url": "/api/2014/equipment/lamp"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "oil-flask",
          "name": "Olio (ampolla)",
          "url": "/api/2014/equipment/oil-flask"
        },
        "quantity": 2
      },
      {
        "item": {
          "index": "paper-one-sheet",
          "name": "Carta (un foglio)",
          "url": "/api/2014/equipment/paper-one-sheet"
        },
        "quantity": 5
      },
      {
        "item": {
          "index": "perfume-vial",
          "name": "Profumo (fiala)",
          "url": "/api/2014/equipment/perfume-vial"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "sealing-wax",
          "name": "Ceralacca",
          "url": "/api/2014/equipment/sealing-wax"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "soap",
          "name": "Sapone",
          "url": "/api/2014/equipment/soap"
        },
        "quantity": 1
      }
    ],
    "url": "/api/2014/equipment/diplomats-pack",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "properties": []
  },
  {
    "special": [],
    "index": "disguise-kit",
    "name": "Trucchi per il camuffamento",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "kits",
      "name": "Dotazioni",
      "url": "/api/2014/equipment-categories/kits"
    },
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "weight": 1.5,
    "desc": [
      "Questa borsa di cosmetici, tinture per capelli e piccoli oggetti di scena permette di creare travestimenti che cambiano l'aspetto fisico. La competenza in questo kit permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per creare un travestimento visivo."
    ],
    "url": "/api/2014/equipment/disguise-kit",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "donkey",
    "name": "Asino",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Cavalcature e Altri Animali",
    "cost": {
      "quantity": 8,
      "unit": "mo"
    },
    "speed": {
      "quantity": 12,
      "unit": "m/round"
    },
    "capacity": "210 kg",
    "url": "/api/2014/equipment/donkey",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "drum",
    "name": "Tamburo",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti Musicali",
    "cost": {
      "quantity": 6,
      "unit": "mo"
    },
    "weight": 1.5,
    "desc": [
      "Alcuni dei tipi più comuni di strumenti musicali sono mostrati nella tabella come esempi. Se un personaggio ha competenza in un determinato strumento musicale, può sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per suonare musica con quello strumento. Un bardo può usare uno strumento musicale come focalizzatore da incantatore. Ogni tipo di strumento musicale richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/drum",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "dulcimer",
    "name": "Salterio",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti Musicali",
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "weight": 5,
    "desc": [
      "Alcuni dei tipi più comuni di strumenti musicali sono mostrati nella tabella come esempi. Se un personaggio ha competenza in un determinato strumento musicale, può sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per suonare musica con quello strumento. Un bardo può usare uno strumento musicale come focalizzatore da incantatore. Ogni tipo di strumento musicale richiede una competenza separata."
    ],
    "image": "/api/images/equipment/dulcimer.png",
    "url": "/api/2014/equipment/dulcimer",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "dungeoneers-pack",
    "name": "Dotazione da Avventuriero",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "equipment-packs",
      "name": "Zaini e Dotazioni",
      "url": "/api/2014/equipment-categories/equipment-packs"
    },
    "cost": {
      "quantity": 12,
      "unit": "mo"
    },
    "contents": [
      {
        "item": {
          "index": "backpack",
          "name": "Zaino",
          "url": "/api/2014/equipment/backpack"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "crowbar",
          "name": "Piede di porco",
          "url": "/api/2014/equipment/crowbar"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "hammer",
          "name": "Martello",
          "url": "/api/2014/equipment/hammer"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "piton",
          "name": "Chiodo da roccia",
          "url": "/api/2014/equipment/piton"
        },
        "quantity": 10
      },
      {
        "item": {
          "index": "torch",
          "name": "Torcia",
          "url": "/api/2014/equipment/torch"
        },
        "quantity": 10
      },
      {
        "item": {
          "index": "tinderbox",
          "name": "Acciarino",
          "url": "/api/2014/equipment/tinderbox"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "rations-1-day",
          "name": "Razioni (1 giorno)",
          "url": "/api/2014/equipment/rations-1-day"
        },
        "quantity": 10
      },
      {
        "item": {
          "index": "waterskin",
          "name": "Otre",
          "url": "/api/2014/equipment/waterskin"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "rope-hempen-50-feet",
          "name": "Corda di canapa (15 metri)",
          "url": "/api/2014/equipment/rope-hempen-50-feet"
        },
        "quantity": 1
      }
    ],
    "url": "/api/2014/equipment/dungeoneers-pack",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "elephant",
    "name": "Elefante",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Cavalcature e Altri Animali",
    "cost": {
      "quantity": 200,
      "unit": "mo"
    },
    "speed": {
      "quantity": 12,
      "unit": "m/round"
    },
    "capacity": "660 kg",
    "url": "/api/2014/equipment/elephant",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "emblem",
    "name": "Emblema",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "holy-symbols",
      "name": "Simboli Sacri",
      "url": "/api/2014/equipment-categories/holy-symbols"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 0,
    "desc": [
      "Un simbolo sacro è la rappresentazione di un dio o di un pantheon. Può essere un amuleto che raffigura un simbolo che rappresenta una divinità, lo stesso simbolo accuratamente inciso o intarsiato come emblema su uno scudo, o una minuscola scatola contenente un frammento di una reliquia sacra.",
      "L'Appendice B elenca i simboli comunemente associati a molte divinità del multiverso. Un chierico o un paladino può usare un simbolo sacro come focalizzatore da incantatore. Per usare il simbolo in questo modo, l'incantatore deve tenerlo in mano, indossarlo visibilmente o portarlo su uno scudo."
    ],
    "url": "/api/2014/equipment/emblem",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "entertainers-pack",
    "name": "Dotazione da Intrattenitore",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "equipment-packs",
      "name": "Zaini e Dotazioni",
      "url": "/api/2014/equipment-categories/equipment-packs"
    },
    "cost": {
      "quantity": 40,
      "unit": "mo"
    },
    "contents": [
      {
        "item": {
          "index": "backpack",
          "name": "Zaino",
          "url": "/api/2014/equipment/backpack"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "bedroll",
          "name": "Sacco a pelo",
          "url": "/api/2014/equipment/bedroll"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "clothes-costume",
          "name": "Abiti da intrattenitore",
          "url": "/api/2014/equipment/clothes-costume"
        },
        "quantity": 2
      },
      {
        "item": {
          "index": "candle",
          "name": "Candela",
          "url": "/api/2014/equipment/candle"
        },
        "quantity": 5
      },
      {
        "item": {
          "index": "rations-1-day",
          "name": "Razioni (1 giorno)",
          "url": "/api/2014/equipment/rations-1-day"
        },
        "quantity": 5
      },
      {
        "item": {
          "index": "waterskin",
          "name": "Otre",
          "url": "/api/2014/equipment/waterskin"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "disguise-kit",
          "name": "Trucchi per il camuffamento",
          "url": "/api/2014/equipment/disguise-kit"
        },
        "quantity": 1
      }
    ],
    "url": "/api/2014/equipment/entertainers-pack",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "explorers-pack",
    "name": "Dotazione da Esploratore",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "equipment-packs",
      "name": "Zaini e Dotazioni",
      "url": "/api/2014/equipment-categories/equipment-packs"
    },
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "contents": [
      {
        "item": {
          "index": "backpack",
          "name": "Zaino",
          "url": "/api/2014/equipment/backpack"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "bedroll",
          "name": "Sacco a pelo",
          "url": "/api/2014/equipment/bedroll"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "mess-kit",
          "name": "Gavetta",
          "url": "/api/2014/equipment/mess-kit"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "tinderbox",
          "name": "Acciarino",
          "url": "/api/2014/equipment/tinderbox"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "torch",
          "name": "Torcia",
          "url": "/api/2014/equipment/torch"
        },
        "quantity": 10
      },
      {
        "item": {
          "index": "rations-1-day",
          "name": "Razioni (1 giorno)",
          "url": "/api/2014/equipment/rations-1-day"
        },
        "quantity": 10
      },
      {
        "item": {
          "index": "waterskin",
          "name": "Otre",
          "url": "/api/2014/equipment/waterskin"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "rope-hempen-50-feet",
          "name": "Corda di canapa (15 metri)",
          "url": "/api/2014/equipment/rope-hempen-50-feet"
        },
        "quantity": 1
      }
    ],
    "url": "/api/2014/equipment/explorers-pack",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "properties": []
  },
  {
    "special": [],
    "index": "fishing-tackle",
    "name": "Attrezzi da pesca",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 2,
    "desc": [
      "Questo kit include una canna di legno, lenza di seta, galleggianti di sughero, ami d'acciaio, pesi di piombo, esche di velluto e una rete a maglie strette."
    ],
    "url": "/api/2014/equipment/fishing-tackle",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "flail",
    "name": "Mazzafrusto",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "bludgeoning",
        "name": "Contundente",
        "url": "/api/2014/damage-types/bludgeoning"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1,
    "properties": [],
    "url": "/api/2014/equipment/flail",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "flask-or-tankard",
    "name": "Fiaschetta o boccale",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mr"
    },
    "weight": 0.5,
    "url": "/api/2014/equipment/flask-or-tankard",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "flute",
    "name": "Flauto",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti Musicali",
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Alcuni dei tipi più comuni di strumenti musicali sono mostrati nella tabella come esempi. Se un personaggio ha competenza in un determinato strumento musicale, può sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per suonare musica con quello strumento. Un bardo può usare uno strumento musicale come focalizzatore da incantatore. Ogni tipo di strumento musicale richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/flute",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "forgery-kit",
    "name": "Kit per falsificazione",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "kits",
      "name": "Dotazioni",
      "url": "/api/2014/equipment-categories/kits"
    },
    "cost": {
      "quantity": 15,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "Questa piccola scatola contiene vari tipi di carta e pergamena, penne e inchiostri, sigilli e ceralacca, foglia d'oro e d'argento e altri materiali necessari per creare falsi convincenti di documenti fisici. La competenza in questo kit permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per creare una falsificazione fisica di un documento."
    ],
    "url": "/api/2014/equipment/forgery-kit",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "galley",
    "name": "Galera",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Veicoli Acquatici",
    "cost": {
      "quantity": 30000,
      "unit": "mo"
    },
    "speed": {
      "quantity": 6.5,
      "unit": "km/h"
    },
    "url": "/api/2014/equipment/galley",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "glaive",
    "name": "Falce d'arme",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 20,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d10",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 3,
    "properties": [
      {
        "index": "heavy",
        "name": "Pesante",
        "url": "/api/2014/weapon-properties/heavy"
      },
      {
        "index": "reach",
        "name": "Portata",
        "url": "/api/2014/weapon-properties/reach"
      },
      {
        "index": "two-handed",
        "name": "A Due Mani",
        "url": "/api/2014/weapon-properties/two-handed"
      }
    ],
    "url": "/api/2014/equipment/glaive",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "glassblowers-tools",
    "name": "Strumenti da soffiatore di vetro",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 30,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/glassblowers-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "grappling-hook",
    "name": "Rampino",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 2,
    "url": "/api/2014/equipment/grappling-hook",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "greataxe",
    "name": "Ascia bipenne",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 30,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d12",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 3.5,
    "properties": [
      {
        "index": "heavy",
        "name": "Pesante",
        "url": "/api/2014/weapon-properties/heavy"
      },
      {
        "index": "two-handed",
        "name": "A Due Mani",
        "url": "/api/2014/weapon-properties/two-handed"
      }
    ],
    "url": "/api/2014/equipment/greataxe",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "greatclub",
    "name": "Clava grande",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Mischia",
    "category_range": "Arma Semplice da Mischia",
    "cost": {
      "quantity": 2,
      "unit": "ma"
    },
    "damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "bludgeoning",
        "name": "Contundente",
        "url": "/api/2014/damage-types/bludgeoning"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 5,
    "properties": [
      {
        "index": "two-handed",
        "name": "A Due Mani",
        "url": "/api/2014/weapon-properties/two-handed"
      }
    ],
    "url": "/api/2014/equipment/greatclub",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "greatsword",
    "name": "Spadone",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "2d6",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 3,
    "properties": [
      {
        "index": "heavy",
        "name": "Pesante",
        "url": "/api/2014/weapon-properties/heavy"
      },
      {
        "index": "two-handed",
        "name": "A Due Mani",
        "url": "/api/2014/weapon-properties/two-handed"
      }
    ],
    "url": "/api/2014/equipment/greatsword",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "halberd",
    "name": "Alabarda",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 20,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d10",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 3,
    "properties": [
      {
        "index": "heavy",
        "name": "Pesante",
        "url": "/api/2014/weapon-properties/heavy"
      },
      {
        "index": "reach",
        "name": "Portata",
        "url": "/api/2014/weapon-properties/reach"
      },
      {
        "index": "two-handed",
        "name": "A Due Mani",
        "url": "/api/2014/weapon-properties/two-handed"
      }
    ],
    "url": "/api/2014/equipment/halberd",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "half-plate-armor",
    "name": "Mezza armatura",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Media",
    "armor_class": {
      "base": 15,
      "dex_bonus": true,
      "max_bonus": 2
    },
    "str_minimum": 0,
    "stealth_disadvantage": true,
    "weight": 20,
    "cost": {
      "quantity": 750,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/half-plate-armor",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "hammer",
    "name": "Martello",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 1.5,
    "url": "/api/2014/equipment/hammer",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "hammer-sledge",
    "name": "Martello da fabbro",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 5,
    "url": "/api/2014/equipment/hammer-sledge",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "handaxe",
    "name": "Accetta",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Mischia",
    "category_range": "Arma Semplice da Mischia",
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d6",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1,
    "properties": [
      {
        "index": "light",
        "name": "Leggera",
        "url": "/api/2014/weapon-properties/light"
      },
      {
        "index": "thrown",
        "name": "Lancio",
        "url": "/api/2014/weapon-properties/thrown"
      },
      {
        "index": "monk",
        "name": "Monaco",
        "url": "/api/2014/weapon-properties/monk"
      }
    ],
    "throw_range": {
      "normal": 6,
      "long": 18
    },
    "url": "/api/2014/equipment/handaxe",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "healers-kit",
    "name": "Borsa da guaritore",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "kits",
      "name": "Dotazioni",
      "url": "/api/2014/equipment-categories/kits"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 1.5,
    "desc": [
      "Questa borsa di pelle contiene bende, unguenti e stecche. La borsa può essere utilizzata dieci volte. Con un'azione, un personaggio può consumare un utilizzo della borsa per stabilizzare una creatura che ha 0 punti ferita, senza dover effettuare una prova di Saggezza (Medicina)."
    ],
    "url": "/api/2014/equipment/healers-kit",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "herbalism-kit",
    "name": "Kit da erborista",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "kits",
      "name": "Dotazioni",
      "url": "/api/2014/equipment-categories/kits"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 1.5,
    "desc": [
      "Questo kit contiene diversi strumenti come cesoie, mortaio e pestello, sacchetti e fiale usati dagli erboristi per creare rimedi e pozioni. La competenza in questo kit permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per identificare o applicare le erbe. Inoltre, la competenza in questo kit è necessaria per creare l'antitossina e le pozioni di guarigione."
    ],
    "url": "/api/2014/equipment/herbalism-kit",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "hide-armor",
    "name": "Armatura di pelli",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Media",
    "armor_class": {
      "base": 12,
      "dex_bonus": true,
      "max_bonus": 2
    },
    "str_minimum": 0,
    "stealth_disadvantage": false,
    "weight": 6,
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/hide-armor",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "holy-water-flask",
    "name": "Acqua santa (fiaschetta)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Con un'azione, un personaggio può spruzzare il contenuto di questa fiaschetta su una creatura situata entro 1,5 metri da lui o lanciarla fino a 6 metri, rompendola all'impatto. In entrambi i casi, deve effettuare un attacco a distanza contro una creatura bersaglio, considerando l'acqua santa come un'arma improvvisata.",
      "Se il bersaglio è un immondo o un non morto, subisce 2d6 danni radiosi.",
      "Un chierico o un paladino può creare dell'acqua santa eseguendo un rituale speciale.",
      "Il rituale richiede 1 ora di tempo, consuma polvere d'argento per un valore di 25 mo e richiede che l'incantatore utilizzi uno slot incantesimo di 1° livello."
    ],
    "url": "/api/2014/equipment/holy-water-flask",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "horn",
    "name": "Corno",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumento Musicale",
    "cost": {
      "quantity": 3,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Alcuni dei tipi più comuni di strumenti musicali sono mostrati nella tabella come esempi. Se un personaggio ha competenza in un determinato strumento musicale, può sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per suonare musica con quello strumento. Un bardo può usare uno strumento musicale come focalizzatore da incantatore. Ogni tipo di strumento musicale richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/horn",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "horse-draft",
    "name": "Cavallo da tiro",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Cavalcature e Altri Animali",
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "speed": {
      "quantity": 12,
      "unit": "m/round"
    },
    "capacity": "240 kg",
    "url": "/api/2014/equipment/horse-draft",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "horse-riding",
    "name": "Cavallo da sella",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Cavalcature e Altri Animali",
    "cost": {
      "quantity": 75,
      "unit": "mo"
    },
    "speed": {
      "quantity": 18,
      "unit": "m/round"
    },
    "capacity": "215 kg",
    "url": "/api/2014/equipment/horse-riding",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "hourglass",
    "name": "Clessidra",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "weight": 0.5,
    "url": "/api/2014/equipment/hourglass",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "hunting-trap",
    "name": "Trappola per selvaggina",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "desc": [
      "Quando un personaggio usa la sua azione per piazzarla, questa trappola forma un anello d'acciaio dentato che scatta quando una creatura calpesta una piastra a pressione nel centro. La trappola viene fissata tramite una pesante catena a un oggetto immobile, come un albero o un piolo conficcato nel terreno.",
      "Una creatura che calpesta la piastra deve superare un tiro salvezza su Destrezza con CD 13 o subire 1d4 danni perforanti e interrompere il proprio movimento. In seguito, finché la creatura non si libera dalla trappola, il suo movimento è limitato dalla lunghezza della catena (tipicamente 1 metro).",
      "Una creatura può usare la propria azione per effettuare una prova di Forza con CD 13, liberando se stessa o un'altra creatura entro la propria portata in caso di successo. Ogni prova fallita infligge 1 danno perforante alla creatura intrappolata."
    ],
    "weight": 11,
    "url": "/api/2014/equipment/hunting-trap",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "ink-1-ounce-bottle",
    "name": "Inchiostro (boccetta da 30 ml)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 0,
    "url": "/api/2014/equipment/ink-1-ounce-bottle",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "ink-pen",
    "name": "Pennino",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mr"
    },
    "weight": 0,
    "url": "/api/2014/equipment/ink-pen",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "javelin",
    "name": "Giavellotto",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Mischia",
    "category_range": "Arma Semplice da Mischia",
    "cost": {
      "quantity": 5,
      "unit": "ma"
    },
    "damage": {
      "damage_dice": "1d6",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1,
    "properties": [
      {
        "index": "thrown",
        "name": "Lancio",
        "url": "/api/2014/weapon-properties/thrown"
      },
      {
        "index": "monk",
        "name": "Monaco",
        "url": "/api/2014/weapon-properties/monk"
      }
    ],
    "throw_range": {
      "normal": 9,
      "long": 36
    },
    "url": "/api/2014/equipment/javelin",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "jewelers-tools",
    "name": "Strumenti da gioielliere",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/jewelers-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "jug-or-pitcher",
    "name": "Brocca o caraffa",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mr"
    },
    "weight": 2,
    "url": "/api/2014/equipment/jug-or-pitcher",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "keelboat",
    "name": "Chiatta",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Veicoli Acquatici",
    "cost": {
      "quantity": 3000,
      "unit": "mo"
    },
    "speed": {
      "quantity": 1.5,
      "unit": "km/h"
    },
    "desc": [
      "Chiatte e barche a remi sono utilizzate su laghi e fiumi. Se si procede a favore di corrente, aggiungere la velocità della corrente (tipicamente 5 km/h) alla velocità del veicolo. Questi veicoli non possono essere manovrati a remi contro una corrente significativa, ma possono essere trainati controcorrente da animali da tiro sulle sponde. Una barca a remi pesa 50 kg, nel caso in cui gli avventurieri debbano trasportarla via terra."
    ],
    "url": "/api/2014/equipment/keelboat",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "ladder-10-foot",
    "name": "Scala (3 metri)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "ma"
    },
    "weight": 12.5,
    "url": "/api/2014/equipment/ladder-10-foot",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "lamp",
    "name": "Lampada",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "ma"
    },
    "weight": 0.5,
    "desc": [
      "Una lampada emette luce intensa entro un raggio di 4,5 metri e luce fioca per altri 9 metri. Una volta accesa, brucia per 6 ore con una ampolla (0,5 litri) di olio."
    ],
    "url": "/api/2014/equipment/lamp",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "index": "lance",
    "name": "Lancia da giostra",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d12",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 3,
    "properties": [
      {
        "index": "reach",
        "name": "Portata",
        "url": "/api/2014/weapon-properties/reach"
      },
      {
        "index": "special",
        "name": "Speciale",
        "url": "/api/2014/weapon-properties/special"
      }
    ],
    "special": [
      "Un personaggio ha svantaggio quando usa una lancia da giostra per attaccare un bersaglio entro 1,5 metri da sé. Inoltre, una lancia da giostra richiede due mani per essere impugnata se il personaggio non è in sella."
    ],
    "url": "/api/2014/equipment/lance",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "lantern-bullseye",
    "name": "Lanterna a lente fissa",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Una lanterna a lente fissa emette luce intensa in un cono di 18 metri e luce fioca per altri 18 metri. Una volta accesa, brucia per 6 ore con una ampolla (0,5 litri) di olio."
    ],
    "url": "/api/2014/equipment/lantern-bullseye",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "lantern-hooded",
    "name": "Lanterna schermabile",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Una lanterna schermabile emette luce intensa entro un raggio di 9 metri e luce fioca per altri 9 metri. Una volta accesa, brucia per 6 ore con una ampolla (0,5 litri) di olio. Con un'azione, un personaggio può abbassare lo schermo, riducendo la luce a luce fioca in un raggio di 1,5 metri."
    ],
    "url": "/api/2014/equipment/lantern-hooded",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "leather-armor",
    "name": "Armatura di cuoio",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Leggera",
    "armor_class": {
      "base": 11,
      "dex_bonus": true
    },
    "str_minimum": 0,
    "stealth_disadvantage": false,
    "weight": 5,
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/leather-armor",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "leatherworkers-tools",
    "name": "Strumenti da conciatore",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/leatherworkers-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "light-hammer",
    "name": "Martello leggero",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Mischia",
    "category_range": "Arma Semplice da Mischia",
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d4",
      "damage_type": {
        "index": "bludgeoning",
        "name": "Contundente",
        "url": "/api/2014/damage-types/bludgeoning"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1,
    "properties": [
      {
        "index": "light",
        "name": "Leggera",
        "url": "/api/2014/weapon-properties/light"
      },
      {
        "index": "thrown",
        "name": "Lancio",
        "url": "/api/2014/weapon-properties/thrown"
      },
      {
        "index": "monk",
        "name": "Monaco",
        "url": "/api/2014/weapon-properties/monk"
      }
    ],
    "throw_range": {
      "normal": 6,
      "long": 18
    },
    "url": "/api/2014/equipment/light-hammer",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "little-bag-of-sand",
    "name": "Sacchetto di sabbia",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 0,
      "unit": "mr"
    },
    "weight": 0,
    "desc": [
      "Un piccolo sacchetto di sabbia, solitamente presente nella dotazione da studioso."
    ],
    "url": "/api/2014/equipment/little-bag-of-sand",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "lock",
    "name": "Serratura",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Assieme alla serratura viene fornita una chiave. Senza la chiave, una creatura competente negli arnesi da scasso può scassinare questa serratura superando una prova di Destrezza con CD 15. Il DM può decidere che siano disponibili serrature migliori a prezzi più alti."
    ],
    "url": "/api/2014/equipment/lock",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "longbow",
    "name": "Arco lungo",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Distanza",
    "category_range": "Arma Marziale a Distanza",
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 45,
      "long": 180
    },
    "weight": 1,
    "properties": [
      {
        "index": "ammunition",
        "name": "Munizioni",
        "url": "/api/2014/weapon-properties/ammunition"
      },
      {
        "index": "heavy",
        "name": "Pesante",
        "url": "/api/2014/weapon-properties/heavy"
      },
      {
        "index": "two-handed",
        "name": "A Due Mani",
        "url": "/api/2014/weapon-properties/two-handed"
      }
    ],
    "url": "/api/2014/equipment/longbow",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "longship",
    "name": "Drakkar",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Veicoli Acquatici",
    "cost": {
      "quantity": 10000,
      "unit": "mo"
    },
    "speed": {
      "quantity": 5,
      "unit": "km/h"
    },
    "url": "/api/2014/equipment/longship",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "longsword",
    "name": "Spada lunga",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 15,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1.5,
    "properties": [
      {
        "index": "versatile",
        "name": "Versatile",
        "url": "/api/2014/weapon-properties/versatile"
      }
    ],
    "two_handed_damage": {
      "damage_dice": "1d10",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "url": "/api/2014/equipment/longsword",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "lute",
    "name": "Liuto",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumento Musicale",
    "cost": {
      "quantity": 35,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Alcuni dei tipi più comuni di strumenti musicali sono mostrati nella tabella come esempi. Se un personaggio ha competenza in un determinato strumento musicale, può sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per suonare musica con quello strumento. Un bardo può usare uno strumento musicale come focalizzatore da incantatore. Ogni tipo di strumento musicale richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/lute",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "lyre",
    "name": "Lira",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumento Musicale",
    "cost": {
      "quantity": 30,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Alcuni dei tipi più comuni di strumenti musicali sono mostrati nella tabella come esempi. Se un personaggio ha competenza in un determinato strumento musicale, può sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per suonare musica con quello strumento. Un bardo può usare uno strumento musicale come focalizzatore da incantatore. Ogni tipo di strumento musicale richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/lyre",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "mace",
    "name": "Mazza",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Mischia",
    "category_range": "Arma Semplice da Mischia",
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d6",
      "damage_type": {
        "index": "bludgeoning",
        "name": "Contundente",
        "url": "/api/2014/damage-types/bludgeoning"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 2,
    "properties": [
      {
        "index": "monk",
        "name": "Monaco",
        "url": "/api/2014/weapon-properties/monk"
      }
    ],
    "url": "/api/2014/equipment/mace",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "magnifying-glass",
    "name": "Lente d'ingrandimento",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 100,
      "unit": "mo"
    },
    "weight": 0,
    "desc": [
      "Questa lente permette di esaminare più da vicino gli oggetti piccoli. È utile anche come sostituto dell'acciarino quando si deve accendere un fuoco. Accendere un fuoco con una lente d'ingrandimento richiede una luce intensa come quella solare per concentrare i raggi, dell'esca per innescare la fiamma e circa 5 minuti di tempo.",
      "Una lente d'ingrandimento conferisce vantaggio a ogni prova di caratteristica effettuata per valutare o ispezionare un oggetto piccolo o molto dettagliato."
    ],
    "url": "/api/2014/equipment/magnifying-glass",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "manacles",
    "name": "Manette",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 3,
    "desc": [
      "Questi vincoli di metallo possono bloccare una creatura Piccola o Media. Sfuggire alle manette richiede una prova di Destrezza con CD 20 effettuata con successo. Romperle richiede una prova di Forza con CD 20 effettuata con successo.",
      "Ogni set di manette include una chiave. Senza la chiave, una creatura competente negli arnesi da scasso può scassinare la serratura delle manette con una prova di Destrezza con CD 15 effettuata con successo. Le manette hanno 15 punti ferita."
    ],
    "url": "/api/2014/equipment/manacles",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "masons-tools",
    "name": "Strumenti da muratore",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 4,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/masons-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "mastiff",
    "name": "Mastino",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Cavalcature e Altri Animali",
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "speed": {
      "quantity": 12,
      "unit": "m/round"
    },
    "capacity": "88 kg",
    "url": "/api/2014/equipment/mastiff",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "maul",
    "name": "Maglio",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "2d6",
      "damage_type": {
        "index": "bludgeoning",
        "name": "Contundente",
        "url": "/api/2014/damage-types/bludgeoning"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 5,
    "properties": [
      {
        "index": "heavy",
        "name": "Pesante",
        "url": "/api/2014/weapon-properties/heavy"
      },
      {
        "index": "two-handed",
        "name": "A Due Mani",
        "url": "/api/2014/weapon-properties/two-handed"
      }
    ],
    "url": "/api/2014/equipment/maul",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "mess-kit",
    "name": "Gavetta",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "kits",
      "name": "Dotazioni",
      "url": "/api/2014/equipment-categories/kits"
    },
    "cost": {
      "quantity": 2,
      "unit": "ma"
    },
    "weight": 0.5,
    "desc": [
      "Questa scatola di latta contiene una tazza e delle semplici posate. La scatola si apre in due parti: un lato può essere usato come padella per cucinare e l'altro come piatto o ciotola poco profonda."
    ],
    "url": "/api/2014/equipment/mess-kit",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "mirror-steel",
    "name": "Specchio di acciaio",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 0.25,
    "url": "/api/2014/equipment/mirror-steel",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "morningstar",
    "name": "Stella del mattino",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 15,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 2,
    "properties": [],
    "url": "/api/2014/equipment/morningstar",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "mule",
    "name": "Mulo",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Cavalcature e Altri Animali",
    "cost": {
      "quantity": 8,
      "unit": "mo"
    },
    "speed": {
      "quantity": 12,
      "unit": "m/round"
    },
    "capacity": "190 kg",
    "url": "/api/2014/equipment/mule",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "navigators-tools",
    "name": "Strumenti da navigatore",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Altri Strumenti",
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Questo set di strumenti viene utilizzato per la navigazione in mare. La competenza negli strumenti da navigatore permette di tracciare la rotta di una nave e di seguire le carte nautiche. Inoltre, questi strumenti consentono di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per evitare di smarrirsi in mare."
    ],
    "url": "/api/2014/equipment/navigators-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "index": "net",
    "name": "Rete",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Distanza",
    "category_range": "Arma Marziale a Distanza",
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "range": {
      "normal": 1.5,
      "long": 4.5
    },
    "weight": 1.5,
    "properties": [
      {
        "index": "thrown",
        "name": "Lancio",
        "url": "/api/2014/weapon-properties/thrown"
      },
      {
        "index": "special",
        "name": "Speciale",
        "url": "/api/2014/weapon-properties/special"
      }
    ],
    "special": [
      "Una creatura di taglia Grande o inferiore colpita da una rete è trattenuta finché non viene liberata. Una rete non ha effetto su creature prive di forma o di taglia Mastodontica o superiore. Una creatura può usare la sua azione per effettuare una prova di Forza con CD 10: se la supera, libera se stessa o un'altra creatura entro la sua portata. Infliggere 5 danni taglienti alla rete (CA 10) libera la creatura senza danneggiarla, interrompendo l'effetto e distruggendo la rete. Quando un personaggio usa un'azione, un'azione bonus o una reazione per attaccare con una rete, può effettuare un solo attacco, a prescindere dal numero di attacchi che potrebbe normalmente effettuare."
    ],
    "throw_range": {
      "normal": 1.5,
      "long": 4.5
    },
    "url": "/api/2014/equipment/net",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "oil-flask",
    "name": "Olio (ampolla)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "ma"
    },
    "weight": 0.5,
    "desc": [
      "L'olio è solitamente contenuto in un'ampolla di argilla che ne tiene 0,5 litri.",
      "Come azione, un personaggio può spruzzare l'olio contenuto in questa ampolla su una creatura entro 1,5 metri da sé o lanciarlo fino a 6 metri di distanza, frantumando l'ampolla all'impatto. Deve effettuare un attacco a distanza contro una creatura o un oggetto bersaglio, considerando l'olio come un'arma improvvisata.",
      "In caso di colpo a segno, il bersaglio viene cosparso d'olio. Se il bersaglio subisce danni da fuoco prima che l'olio si asciughi (dopo 1 minuto), subisce 5 danni da fuoco supplementari dall'olio che brucia.",
      "Un personaggio può anche versare un'ampolla d'olio sul terreno per coprire un'area quadrata di 1,5 metri di lato, a condizione che la superficie sia piana.",
      "Se acceso, l'olio brucia per 2 round e infligge 5 danni da fuoco a ogni creatura che entra nell'area o vi termina il proprio turno. Una creatura può subire questi danni solo una volta per turno."
    ],
    "url": "/api/2014/equipment/oil-flask",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "orb",
    "name": "Sfera",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "arcane-foci",
      "name": "Focalizzatori Arcani",
      "url": "/api/2014/equipment-categories/arcane-foci"
    },
    "cost": {
      "quantity": 20,
      "unit": "mo"
    },
    "weight": 1.5,
    "desc": [
      "Un focalizzatore arcano è un oggetto speciale (una sfera, un cristallo, una verga, un bastone di foggia particolare, una bacchetta di legno o un oggetto simile) progettato per incanalare il potere degli incantesimi arcani. Uno stregone, un warlock o un mago possono usare un oggetto simile come focalizzatore da incantatore."
    ],
    "url": "/api/2014/equipment/orb",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "padded-armor",
    "name": "Armatura Imbottita",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Leggera",
    "armor_class": {
      "base": 11,
      "dex_bonus": true
    },
    "str_minimum": 0,
    "stealth_disadvantage": true,
    "weight": 4,
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/padded-armor",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "painters-supplies",
    "name": "Strumenti da pittore",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/painters-supplies",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "pan-flute",
    "name": "Flauto di Pan",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumento Musicale",
    "cost": {
      "quantity": 12,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Alcuni dei tipi più comuni di strumenti musicali sono mostrati nella tabella come esempi. Se un personaggio ha competenza in un determinato strumento musicale, può sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per suonare musica con quello strumento. Un bardo può usare uno strumento musicale come focalizzatore da incantatore. Ogni tipo di strumento musicale richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/pan-flute",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "paper-one-sheet",
    "name": "Carta (un foglio)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "ma"
    },
    "weight": 0,
    "url": "/api/2014/equipment/paper-one-sheet",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "parchment-one-sheet",
    "name": "Pergamena (un foglio)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "ma"
    },
    "weight": 0,
    "url": "/api/2014/equipment/parchment-one-sheet",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "perfume-vial",
    "name": "Profumo (fiala)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 0,
    "url": "/api/2014/equipment/perfume-vial",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "pick-miners",
    "name": "Piccone da minatore",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 5,
    "url": "/api/2014/equipment/pick-miners",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "pike",
    "name": "Picca",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d10",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 9,
    "properties": [
      {
        "index": "heavy",
        "name": "Pesante",
        "url": "/api/2014/weapon-properties/heavy"
      },
      {
        "index": "reach",
        "name": "Portata",
        "url": "/api/2014/weapon-properties/reach"
      },
      {
        "index": "two-handed",
        "name": "A Due Mani",
        "url": "/api/2014/weapon-properties/two-handed"
      }
    ],
    "url": "/api/2014/equipment/pike",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "piton",
    "name": "Chiodo da roccia",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mr"
    },
    "weight": 0.125,
    "url": "/api/2014/equipment/piton",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "plate-armor",
    "name": "Armatura a piastre",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Pesante",
    "armor_class": {
      "base": 18,
      "dex_bonus": false
    },
    "str_minimum": 15,
    "stealth_disadvantage": true,
    "weight": 32.5,
    "cost": {
      "quantity": 1500,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/plate-armor",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "playing-card-set",
    "name": "Mazzo di carte da gioco",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Set da Gioco",
    "cost": {
      "quantity": 5,
      "unit": "ma"
    },
    "weight": 0,
    "desc": [
      "Questa voce comprende un'ampia gamma di pezzi da gioco, inclusi dadi e mazzi di carte (per giochi come Azzardo dei Tre Draghi). Alcuni esempi comuni appaiono nella tabella degli Strumenti, ma esistono altri tipi di set da gioco. Se un personaggio ha competenza in un set da gioco, può sommare il proprio bonus di competenza alle prove di caratteristica effettuate per giocare a un gioco con quel set. Ogni tipo di set da gioco richiede una competenza separata."
    ],
    "image": "/api/images/equipment/playing-card-set.png",
    "url": "/api/2014/equipment/playing-card-set",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "poison-basic-vial",
    "name": "Veleno base (fiala)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 100,
      "unit": "mo"
    },
    "weight": 0,
    "desc": [
      "Un personaggio può usare il veleno contenuto in questa fiala per ricoprire un'arma tagliente o perforante, o fino a tre munizioni. Applicare il veleno richiede un'azione. Una creatura colpita dall'arma o dalle munizioni avvelenate deve superare un tiro salvezza di Costituzione con CD 10 o subire 1d4 danni da veleno. Una volta applicato, il veleno mantiene la sua efficacia per 1 minuto prima di asciugarsi."
    ],
    "url": "/api/2014/equipment/poison-basic-vial",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "poisoners-kit",
    "name": "Scatola del farmacista (Set da avvelenatore)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "kits",
      "name": "Dotazioni",
      "url": "/api/2014/equipment-categories/kits"
    },
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Un set da avvelenatore include fiale, sostanze chimiche e altre attrezzature necessarie per la creazione di veleni. La competenza in questo set permette di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per fabbricare o usare veleni."
    ],
    "url": "/api/2014/equipment/poisoners-kit",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "pole-10-foot",
    "name": "Pertica (3 metri)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mr"
    },
    "weight": 3.5,
    "url": "/api/2014/equipment/pole-10-foot",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "pony",
    "name": "Pony",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Cavalcature e Altri Animali",
    "cost": {
      "quantity": 30,
      "unit": "mo"
    },
    "speed": {
      "quantity": 12,
      "unit": "m/round"
    },
    "capacity": "100 kg",
    "url": "/api/2014/equipment/pony",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "pot-iron",
    "name": "Pentola di ferro",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 5,
    "url": "/api/2014/equipment/pot-iron",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "potters-tools",
    "name": "Strumenti da vasaio",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 1.5,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra gli esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce gli oggetti relativi a un singolo mestiere. La competenza in un set di strumenti da artigiano permette al personaggio di sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata usando gli strumenti del suo mestiere. Ogni tipo di strumenti da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/potters-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "pouch",
    "name": "Scarsella",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "ma"
    },
    "weight": 0.5,
    "desc": [
      "Una scarsella di cuoio o di stoffa può contenere fino a 20 proiettili da fionda o 50 aghi da cerbottana, oltre ad altri piccoli oggetti. Una borsa a scomparti per contenere le componenti degli incantesimi è chiamata borsa delle componenti (descritta in precedenza in questa sezione)."
    ],
    "url": "/api/2014/equipment/pouch",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "priests-pack",
    "name": "Dotazione da Sacerdote",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "equipment-packs",
      "name": "Zaini e Dotazioni",
      "url": "/api/2014/equipment-categories/equipment-packs"
    },
    "cost": {
      "quantity": 19,
      "unit": "mo"
    },
    "contents": [
      {
        "item": {
          "index": "backpack",
          "name": "Zaino",
          "url": "/api/2014/equipment/backpack"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "blanket",
          "name": "Coperta",
          "url": "/api/2014/equipment/blanket"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "candle",
          "name": "Candela",
          "url": "/api/2014/equipment/candle"
        },
        "quantity": 10
      },
      {
        "item": {
          "index": "tinderbox",
          "name": "Acciarino",
          "url": "/api/2014/equipment/tinderbox"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "rations-1-day",
          "name": "Razioni (1 giorno)",
          "url": "/api/2014/equipment/rations-1-day"
        },
        "quantity": 2
      },
      {
        "item": {
          "index": "waterskin",
          "name": "Otre",
          "url": "/api/2014/equipment/waterskin"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "alms-box",
          "name": "Cassetta delle elemosine",
          "url": "/api/2014/equipment/alms-box"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "block-of-incense",
          "name": "Blocchetto di incenso",
          "url": "/api/2014/equipment/block-of-incense"
        },
        "quantity": 2
      },
      {
        "item": {
          "index": "censer",
          "name": "Incensiere",
          "url": "/api/2014/equipment/censer"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "vestments",
          "name": "Paramenti sacri",
          "url": "/api/2014/equipment/vestments"
        },
        "quantity": 1
      }
    ],
    "url": "/api/2014/equipment/priests-pack",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "quarterstaff",
    "name": "Bastone ferrato",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Mischia",
    "category_range": "Arma Semplice da Mischia",
    "cost": {
      "quantity": 2,
      "unit": "ma"
    },
    "damage": {
      "damage_dice": "1d6",
      "damage_type": {
        "index": "bludgeoning",
        "name": "Contundente",
        "url": "/api/2014/damage-types/bludgeoning"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 2,
    "properties": [
      {
        "index": "versatile",
        "name": "Versatile",
        "url": "/api/2014/weapon-properties/versatile"
      },
      {
        "index": "monk",
        "name": "Monaco",
        "url": "/api/2014/weapon-properties/monk"
      }
    ],
    "two_handed_damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "bludgeoning",
        "name": "Contundente",
        "url": "/api/2014/damage-types/bludgeoning"
      }
    },
    "url": "/api/2014/equipment/quarterstaff",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "quiver",
    "name": "Farcastra",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Una faretra può contenere fino a 20 frecce."
    ],
    "url": "/api/2014/equipment/quiver",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "ram-portable",
    "name": "Ariete portatile",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 4,
      "unit": "mo"
    },
    "weight": 17.5,
    "desc": [
      "Un personaggio può usare un ariete portatile per abbattere le porte. Quando lo fa, ottiene un bonus di +4 alla prova di Forza. Un altro personaggio può aiutarlo a usare l'ariete, conferendogli vantaggio alla prova."
    ],
    "url": "/api/2014/equipment/ram-portable",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "rapier",
    "name": "Stocco",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1,
    "properties": [
      {
        "index": "finesse",
        "name": "Accuratezza",
        "url": "/api/2014/weapon-properties/finesse"
      }
    ],
    "url": "/api/2014/equipment/rapier",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "rations-1-day",
    "name": "Razioni (1 giorno)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "ma"
    },
    "weight": 1,
    "desc": [
      "Le razioni consistono in cibi secchi adatti a viaggi prolungati, tra cui carne secca, frutta secca, gallette e noci."
    ],
    "url": "/api/2014/equipment/rations-1-day",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "reliquary",
    "name": "Reliquiario",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "holy-symbols",
      "name": "Simboli Sacri",
      "url": "/api/2014/equipment-categories/holy-symbols"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Un simbolo sacro è una rappresentazione di una divinità o di un pantheon. Può essere un amuleto raffigurante un simbolo che rappresenta una divinità, lo stesso simbolo accuratamente inciso o incastonato come emblema su uno scudo, o una minuscola scatola contenente un frammento di una reliquia sacra.",
      "L'Appendice B elenca i simboli comunemente associati a molte divinità del multiverso. Un chierico o un paladino può usare un simbolo sacro come focalizzatore da incantatore. Per usare il simbolo in questo modo, l'incantatore deve tenerlo in mano, indossarlo visibilmente o portarlo su uno scudo."
    ],
    "url": "/api/2014/equipment/reliquary",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "ring-mail",
    "name": "Armatura ad Anelli",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Pesante",
    "armor_class": {
      "base": 14,
      "dex_bonus": false
    },
    "str_minimum": 0,
    "stealth_disadvantage": true,
    "weight": 20,
    "cost": {
      "quantity": 30,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/ring-mail",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "robes",
    "name": "Abiti",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 2,
    "url": "/api/2014/equipment/robes",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "rod",
    "name": "Verga",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "arcane-foci",
      "name": "Focalizzatori Arcani",
      "url": "/api/2014/equipment-categories/arcane-foci"
    },
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 1,
    "desc": [
      "Un focalizzatore arcano è un oggetto speciale (una sfera, un cristallo, una verga, un bastone di foggia particolare, una bacchetta di legno o un oggetto simile) progettato per incanalare il potere degli incantesimi arcani. Uno stregone, un warlock o un mago possono usare un oggetto simile come focalizzatore da incantatore."
    ],
    "url": "/api/2014/equipment/rod",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "rope-hempen-50-feet",
    "name": "Corda di canapa (15 metri)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 5,
    "desc": [
      "Una corda, che sia di canapa o di seta, ha 2 punti ferita e può essere spezzata con una prova di Forza con CD 17."
    ],
    "url": "/api/2014/equipment/rope-hempen-50-feet",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "rope-silk-50-feet",
    "name": "Corda di seta (15 metri)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "Una corda, che sia di canapa o di seta, ha 2 punti ferita e può essere spezzata con una prova di Forza con CD 17."
    ],
    "url": "/api/2014/equipment/rope-silk-50-feet",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "rowboat",
    "name": "Barca a remi",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Veicoli Acquatici",
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "speed": {
      "quantity": 2.4,
      "unit": "km/h"
    },
    "desc": [
      "Le chiatte e le barche a remi sono usate su laghi e fiumi. Se si procede a favore di corrente, si somma la velocità della corrente (tipicamente 5 km/h) alla velocità del veicolo. Questi veicoli non possono essere manovrati a remi contro una corrente significativa, ma possono essere trainati controcorrente da animali da tiro sulle sponde. Una barca a remi pesa 50 kg, nel caso in cui gli avventurieri debbano trasportarla via terra."
    ],
    "url": "/api/2014/equipment/rowboat",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "sack",
    "name": "Sacco",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mr"
    },
    "weight": 0.25,
    "url": "/api/2014/equipment/sack",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "saddle-exotic",
    "name": "Sella Esotica",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Finimenti, Bardature e Veicoli a Traino",
    "cost": {
      "quantity": 60,
      "unit": "mo"
    },
    "weight": 25,
    "desc": [
      "Una sella esotica è necessaria per cavalcare qualsiasi cavalcatura acquatica o volante."
    ],
    "url": "/api/2014/equipment/saddle-exotic",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "saddle-military",
    "name": "Sella Militare",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Finimenti, Bardature e Veicoli a Traino",
    "cost": {
      "quantity": 20,
      "unit": "mo"
    },
    "weight": 15,
    "desc": [
      "Una sella militare sostiene il cavaliere, aiutandolo a mantenere la posizione su una cavalcatura attiva in battaglia. Fornisce vantaggio a qualsiasi prova effettuata per restare in sella."
    ],
    "url": "/api/2014/equipment/saddle-military",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "saddle-pack",
    "name": "Sella da Carico",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Finimenti, Bardature e Veicoli a Traino",
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 7.5,
    "url": "/api/2014/equipment/saddle-pack",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "saddle-riding",
    "name": "Sella da Galoppo",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Finimenti, Bardature e Veicoli a Traino",
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 12.5,
    "url": "/api/2014/equipment/saddle-riding",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "saddlebags",
    "name": "Bisacce",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Finimenti, Bardature e Veicoli a Traino",
    "cost": {
      "quantity": 4,
      "unit": "mo"
    },
    "weight": 4,
    "url": "/api/2014/equipment/saddlebags",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "sailing-ship",
    "name": "Nave a vela",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Veicoli Acquatici",
    "cost": {
      "quantity": 10000,
      "unit": "mo"
    },
    "speed": {
      "quantity": 3.2,
      "unit": "km/h"
    },
    "url": "/api/2014/equipment/sailing-ship",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "scale-mail",
    "name": "Corazza di scaglie",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Media",
    "armor_class": {
      "base": 14,
      "dex_bonus": true,
      "max_bonus": 2
    },
    "str_minimum": 0,
    "stealth_disadvantage": true,
    "weight": 22.5,
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/scale-mail",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "scale-merchants",
    "name": "Bilancia da mercante",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 1.5,
    "desc": [
      "Una bilancia include un piccolo bilanciere, dei piatti e un assortimento adeguato di pesi fino a 1 kg. Con essa è possibile misurare il peso esatto di piccoli oggetti, come metalli preziosi grezzi o merci commerciali, per aiutarne a determinare il valore."
    ],
    "url": "/api/2014/equipment/scale-merchants",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "scholars-pack",
    "name": "Dotazione da Studioso",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "equipment-packs",
      "name": "Zaini e Dotazioni",
      "url": "/api/2014/equipment-categories/equipment-packs"
    },
    "cost": {
      "quantity": 40,
      "unit": "mo"
    },
    "contents": [
      {
        "item": {
          "index": "backpack",
          "name": "Zaino",
          "url": "/api/2014/equipment/backpack"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "book",
          "name": "Libro",
          "url": "/api/2014/equipment/book"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "ink-1-ounce-bottle",
          "name": "Inchiostro (fiala da 30 ml)",
          "url": "/api/2014/equipment/ink-1-ounce-bottle"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "ink-pen",
          "name": "Penna d'oca",
          "url": "/api/2014/equipment/ink-pen"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "parchment-one-sheet",
          "name": "Pergamena (un foglio)",
          "url": "/api/2014/equipment/parchment-one-sheet"
        },
        "quantity": 10
      },
      {
        "item": {
          "index": "little-bag-of-sand",
          "name": "Sacchetto di sabbia",
          "url": "/api/2014/equipment/little-bag-of-sand"
        },
        "quantity": 1
      },
      {
        "item": {
          "index": "small-knife",
          "name": "Coltellino",
          "url": "/api/2014/equipment/small-knife"
        },
        "quantity": 1
      }
    ],
    "url": "/api/2014/equipment/scholars-pack",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "scimitar",
    "name": "Scimitarra",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d6",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1.5,
    "properties": [
      {
        "index": "finesse",
        "name": "Accuratezza",
        "url": "/api/2014/weapon-properties/finesse"
      },
      {
        "index": "light",
        "name": "Leggera",
        "url": "/api/2014/weapon-properties/light"
      }
    ],
    "url": "/api/2014/equipment/scimitar",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "sealing-wax",
    "name": "Ceralacca",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "ma"
    },
    "weight": 0,
    "url": "/api/2014/equipment/sealing-wax",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "shawm",
    "name": "Ciaramella",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumento Musicale",
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Nella tabella sono riportati alcuni dei tipi più comuni di strumenti musicali a titolo di esempio. Se un personaggio ha competenza in un determinato strumento musicale, può sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per suonare musica con quello strumento. Un bardo può usare uno strumento musicale come focalizzatore da incantatore. Ogni tipo di strumento musicale richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/shawm",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "shield",
    "name": "Scudo",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Scudo",
    "armor_class": {
      "base": 2,
      "dex_bonus": false
    },
    "str_minimum": 0,
    "stealth_disadvantage": false,
    "weight": 3,
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/shield",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "shortbow",
    "name": "Arco corto",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Distanza",
    "category_range": "Arma Semplice a Distanza",
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d6",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 24,
      "long": 96
    },
    "weight": 1,
    "properties": [
      {
        "index": "ammunition",
        "name": "Munizioni",
        "url": "/api/2014/weapon-properties/ammunition"
      },
      {
        "index": "two-handed",
        "name": "Due Mani",
        "url": "/api/2014/weapon-properties/two-handed"
      }
    ],
    "url": "/api/2014/equipment/shortbow",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "shortsword",
    "name": "Spada corta",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d6",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1,
    "properties": [
      {
        "index": "finesse",
        "name": "Accuratezza",
        "url": "/api/2014/weapon-properties/finesse"
      },
      {
        "index": "light",
        "name": "Leggera",
        "url": "/api/2014/weapon-properties/light"
      },
      {
        "index": "monk",
        "name": "Monaco",
        "url": "/api/2014/weapon-properties/monk"
      }
    ],
    "url": "/api/2014/equipment/shortsword",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "shovel",
    "name": "Vanga",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 2.5,
    "url": "/api/2014/equipment/shovel",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "sickle",
    "name": "Falce",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Mischia",
    "category_range": "Arma Semplice da Mischia",
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d4",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1,
    "properties": [
      {
        "index": "light",
        "name": "Leggera",
        "url": "/api/2014/weapon-properties/light"
      },
      {
        "index": "monk",
        "name": "Monaco",
        "url": "/api/2014/weapon-properties/monk"
      }
    ],
    "url": "/api/2014/equipment/sickle",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "signal-whistle",
    "name": "Fischietto di segnalazione",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mr"
    },
    "weight": 0,
    "url": "/api/2014/equipment/signal-whistle",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "signet-ring",
    "name": "Anello con sigillo",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 0,
    "url": "/api/2014/equipment/signet-ring",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "sled",
    "name": "Slitta",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Finimenti, Bardature e Veicoli a Traino",
    "cost": {
      "quantity": 20,
      "unit": "mo"
    },
    "weight": 150,
    "url": "/api/2014/equipment/sled",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "sling",
    "name": "Fionda",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Distanza",
    "category_range": "Arma Semplice a Distanza",
    "cost": {
      "quantity": 1,
      "unit": "ma"
    },
    "damage": {
      "damage_dice": "1d4",
      "damage_type": {
        "index": "bludgeoning",
        "name": "Contundente",
        "url": "/api/2014/damage-types/bludgeoning"
      }
    },
    "range": {
      "normal": 9,
      "long": 36
    },
    "weight": 0,
    "properties": [
      {
        "index": "ammunition",
        "name": "Munizioni",
        "url": "/api/2014/weapon-properties/ammunition"
      }
    ],
    "url": "/api/2014/equipment/sling",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "sling-bullet",
    "name": "Proiettili da fionda",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "ammunition",
      "name": "Munizioni",
      "url": "/api/2014/equipment-categories/ammunition"
    },
    "quantity": 20,
    "cost": {
      "quantity": 4,
      "unit": "mr"
    },
    "weight": 0.75,
    "url": "/api/2014/equipment/sling-bullet",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "small-knife",
    "name": "Coltellino",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 0,
      "unit": "mr"
    },
    "weight": 0,
    "desc": [
      "Un coltellino, solitamente incluso nella dotazione da studioso."
    ],
    "url": "/api/2014/equipment/small-knife",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "smiths-tools",
    "name": "Strumenti da fabbro",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 20,
      "unit": "mo"
    },
    "weight": 4,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce oggetti relativi a un singolo mestiere. La competenza con un set di strumenti da artigiano consente di sommare il proprio bonus di competenza a qualsiasi prova di caratteristica effettuata utilizzando gli strumenti del proprio mestiere. Ogni tipo di strumento da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/smiths-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "soap",
    "name": "Sapone",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mr"
    },
    "weight": 0,
    "url": "/api/2014/equipment/soap",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "spear",
    "name": "Lancia",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Semplice",
    "weapon_range": "Mischia",
    "category_range": "Arma Semplice da Mischia",
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d6",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1.5,
    "properties": [
      {
        "index": "thrown",
        "name": "Lancio",
        "url": "/api/2014/weapon-properties/thrown"
      },
      {
        "index": "versatile",
        "name": "Versatile",
        "url": "/api/2014/weapon-properties/versatile"
      },
      {
        "index": "monk",
        "name": "Monaco",
        "url": "/api/2014/weapon-properties/monk"
      }
    ],
    "throw_range": {
      "normal": 6,
      "long": 18
    },
    "two_handed_damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "url": "/api/2014/equipment/spear",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "spellbook",
    "name": "Libro degli incantesimi",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "weight": 1.5,
    "desc": [
      "Essenziale per i maghi, un libro degli incantesimi è un tomo rilegato in pelle con 100 pagine di pergamena bianca adatte a registrare incantesimi."
    ],
    "url": "/api/2014/equipment/spellbook",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "spike-iron",
    "name": "Chiodo di ferro",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "ma"
    },
    "weight": 2.5,
    "url": "/api/2014/equipment/spike-iron",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "splint-armor",
    "name": "Armatura a strisce",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Pesante",
    "armor_class": {
      "base": 17,
      "dex_bonus": false
    },
    "str_minimum": 15,
    "stealth_disadvantage": true,
    "weight": 30,
    "cost": {
      "quantity": 200,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/splint-armor",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "sprig-of-mistletoe",
    "name": "Ramoscello di vischio",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "druidic-foci",
      "name": "Focalizzatori Druidici",
      "url": "/api/2014/equipment-categories/druidic-foci"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 0,
    "desc": [
      "Un focalizzatore druidico può essere un ramoscello di vischio o di agrifoglio, una bacchetta o uno scettro ricavato dal tasso o da un altro legno speciale, un bastone tratto intero da un albero vivente o un oggetto totemico che incorpora piume, pelliccia, ossa e denti di animali sacri. Un druido può usare un tale oggetto come focalizzatore da incantatore."
    ],
    "url": "/api/2014/equipment/sprig-of-mistletoe",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "spyglass",
    "name": "Cannocchiale",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1000,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Gli oggetti visti attraverso un cannocchiale sono ingranditi fino a raddoppiare le loro dimensioni."
    ],
    "url": "/api/2014/equipment/spyglass",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "stabling-1-day",
    "name": "Stallo (1 giorno)",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Finimenti, Bardature e Veicoli a Traino",
    "cost": {
      "quantity": 5,
      "unit": "ma"
    },
    "weight": 0,
    "url": "/api/2014/equipment/stabling-1-day",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "staff",
    "name": "Bastone",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "arcane-foci",
      "name": "Focalizzatori Arcani",
      "url": "/api/2014/equipment-categories/arcane-foci"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 2,
    "desc": [
      "Un focalizzatore arcano è un oggetto speciale — un globo, un cristallo, una verga, un bastone appositamente costruito, un pezzo di legno simile a una bacchetta o un oggetto simile — progettato per incanalare il potere degli incantesimi arcani. Un mago, uno stregone o un warlock può usare tale oggetto come focalizzatore da incantatore."
    ],
    "url": "/api/2014/equipment/staff",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "string-10-feet",
    "name": "Spago (3 metri)",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 0,
      "unit": "mr"
    },
    "weight": 0,
    "desc": [
      "Un pezzo di spago lungo 3 metri, solitamente incluso nella dotazione da scassinatore."
    ],
    "url": "/api/2014/equipment/string-10-feet",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "studded-leather-armor",
    "name": "Cuoio Borchiato",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "armor_category": "Leggera",
    "armor_class": {
      "base": 12,
      "dex_bonus": true
    },
    "str_minimum": 0,
    "stealth_disadvantage": false,
    "weight": 6.5,
    "cost": {
      "quantity": 45,
      "unit": "mo"
    },
    "url": "/api/2014/equipment/studded-leather-armor",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "tent-two-person",
    "name": "Tenda per due persone",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "weight": 10,
    "desc": [
      "Un riparo di tela semplice e portatile; una tenda può ospitare due persone."
    ],
    "url": "/api/2014/equipment/tent-two-person",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "thieves-tools",
    "name": "Arnesi da scasso",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Altri Strumenti",
    "cost": {
      "quantity": 25,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Questo set di strumenti include una piccola lima, una serie di grimaldelli, un piccolo specchio montato su un manico di metallo, un paio di forbici a lama stretta e un paio di pinze. La competenza con questi strumenti permette di sommare il proprio bonus di competenza a qualsiasi prova di caratteristica effettuata per disarmare trappole o aprire serrature."
    ],
    "url": "/api/2014/equipment/thieves-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "tinderbox",
    "name": "Acciarino e pietra focaia",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 5,
      "unit": "ma"
    },
    "weight": 0.5,
    "desc": [
      "Questo piccolo contenitore ospita la pietra focaia, l'acciarino e l'esca (solitamente stracci asciutti imbevuti di olio leggero) usati per accendere un fuoco. Usarlo per accendere una torcia — o qualsiasi altra cosa con abbondante combustibile esposto — richiede un'azione.",
      "Accendere qualsiasi altro tipo di fuoco richiede 1 minuto."
    ],
    "url": "/api/2014/equipment/tinderbox",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "tinkers-tools",
    "name": "Strumenti da stagnino",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 50,
      "unit": "mo"
    },
    "weight": 5,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce oggetti relativi a un singolo mestiere. La competenza con un set di strumenti da artigiano permette di sommare il proprio bonus di competenza a qualsiasi prova di caratteristica effettuata utilizzando gli strumenti del proprio mestiere. Ogni tipo di strumento da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/tinkers-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "torch",
    "name": "Torcia",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mr"
    },
    "weight": 0.5,
    "desc": [
      "Una torcia brucia per 1 ora, fornendo luce intensa in un raggio di 6 metri e luce fioca per altri 6 metri. Se il personaggio effettua un attacco in mischia con una torcia accesa e colpisce, infligge 1 danno da fuoco."
    ],
    "url": "/api/2014/equipment/torch",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "totem",
    "name": "Totem",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "druidic-foci",
      "name": "Focalizzatori Druidici",
      "url": "/api/2014/equipment-categories/druidic-foci"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 0,
    "desc": [
      "Un focalizzatore druidico può essere un ramoscello di vischio o di agrifoglio, una bacchetta o uno scettro ricavato dal tasso o da un altro legno speciale, un bastone tratto intero da un albero vivente o un oggetto totemico che incorpora piume, pelliccia, ossa e denti di animali sacri. Un druido può usare un tale oggetto come focalizzatore da incantatore."
    ],
    "url": "/api/2014/equipment/totem",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "trident",
    "name": "Tridente",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d6",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 2,
    "properties": [
      {
        "index": "thrown",
        "name": "Lancio",
        "url": "/api/2014/weapon-properties/thrown"
      },
      {
        "index": "versatile",
        "name": "Versatile",
        "url": "/api/2014/weapon-properties/versatile"
      }
    ],
    "throw_range": {
      "normal": 6,
      "long": 18
    },
    "two_handed_damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "url": "/api/2014/equipment/trident",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "vestments",
    "name": "Paramenti",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 0,
      "unit": "mr"
    },
    "weight": 0,
    "desc": [
      "Abiti religiosi, solitamente inclusi nella dotazione da sacerdote."
    ],
    "url": "/api/2014/equipment/vestments",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "vial",
    "name": "Fiala",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 0,
    "url": "/api/2014/equipment/vial",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "viol",
    "name": "Viola",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumento Musicale",
    "cost": {
      "quantity": 30,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Nella tabella sono riportati alcuni dei tipi più comuni di strumenti musicali a titolo di esempio. Se un personaggio ha competenza in un determinato strumento musicale, può sommare il proprio bonus di competenza a ogni prova di caratteristica effettuata per suonare musica con quello strumento. Un bardo può usare uno strumento musicale come focalizzatore da incantatore. Ogni tipo di strumento musicale richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/viol",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "wagon",
    "name": "Carro",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Finimenti, Bardature e Veicoli a Traino",
    "cost": {
      "quantity": 35,
      "unit": "mo"
    },
    "weight": 200,
    "url": "/api/2014/equipment/wagon",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "wand",
    "name": "Bacchetta",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "arcane-foci",
      "name": "Focalizzatori Arcani",
      "url": "/api/2014/equipment-categories/arcane-foci"
    },
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Un focalizzatore arcano è un oggetto speciale — un globo, un cristallo, una verga, un bastone appositamente costruito, un pezzo di legno simile a una bacchetta o un oggetto simile — progettato per incanalare il potere degli incantesimi arcani. Un mago, uno stregone o un warlock può usare tale oggetto come focalizzatore da incantatore."
    ],
    "url": "/api/2014/equipment/wand",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "war-pick",
    "name": "Piccozza da guerra",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "piercing",
        "name": "Perforante",
        "url": "/api/2014/damage-types/piercing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1,
    "properties": [],
    "url": "/api/2014/equipment/war-pick",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "warhammer",
    "name": "Martello da guerra",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 15,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d8",
      "damage_type": {
        "index": "bludgeoning",
        "name": "Contundente",
        "url": "/api/2014/damage-types/bludgeoning"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1,
    "properties": [
      {
        "index": "versatile",
        "name": "Versatile",
        "url": "/api/2014/weapon-properties/versatile"
      }
    ],
    "two_handed_damage": {
      "damage_dice": "1d10",
      "damage_type": {
        "index": "bludgeoning",
        "name": "Contundente",
        "url": "/api/2014/damage-types/bludgeoning"
      }
    },
    "url": "/api/2014/equipment/warhammer",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "desc": [],
    "special": [],
    "index": "warhorse",
    "name": "Cavallo da guerra",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Cavalcature e Altri Animali",
    "cost": {
      "quantity": 400,
      "unit": "mo"
    },
    "speed": {
      "quantity": 18,
      "unit": "m/round"
    },
    "capacity": "270 kg",
    "url": "/api/2014/equipment/warhorse",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "warship",
    "name": "Nave da guerra",
    "equipment_category": {
      "index": "mounts-and-vehicles",
      "name": "Cavalcature e Veicoli",
      "url": "/api/2014/equipment-categories/mounts-and-vehicles"
    },
    "vehicle_category": "Veicoli Acquatici",
    "cost": {
      "quantity": 25000,
      "unit": "mo"
    },
    "speed": {
      "quantity": 4,
      "unit": "km/h"
    },
    "url": "/api/2014/equipment/warship",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "waterskin",
    "name": "Otre",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 2,
      "unit": "ma"
    },
    "weight": 2.5,
    "url": "/api/2014/equipment/waterskin",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "weavers-tools",
    "name": "Strumenti da tessitore",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce oggetti relativi a un singolo mestiere. La competenza con un set di strumenti da artigiano consente di sommare il proprio bonus di competenza a qualsiasi prova di caratteristica effettuata utilizzando gli strumenti del proprio mestiere. Ogni tipo di strumento da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/weavers-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "whetstone",
    "name": "Pietra per affilare",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "standard-gear",
      "name": "Equipaggiamento Standard",
      "url": "/api/2014/equipment-categories/standard-gear"
    },
    "cost": {
      "quantity": 1,
      "unit": "mr"
    },
    "weight": 0.5,
    "url": "/api/2014/equipment/whetstone",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "desc": [],
    "special": [],
    "index": "whip",
    "name": "Frusta",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "weapon_category": "Marziale",
    "weapon_range": "Mischia",
    "category_range": "Arma Marziale da Mischia",
    "cost": {
      "quantity": 2,
      "unit": "mo"
    },
    "damage": {
      "damage_dice": "1d4",
      "damage_type": {
        "index": "slashing",
        "name": "Tagliente",
        "url": "/api/2014/damage-types/slashing"
      }
    },
    "range": {
      "normal": 1.5
    },
    "weight": 1.5,
    "properties": [
      {
        "index": "finesse",
        "name": "Accuratezza",
        "url": "/api/2014/weapon-properties/finesse"
      },
      {
        "index": "reach",
        "name": "Portata",
        "url": "/api/2014/weapon-properties/reach"
      }
    ],
    "url": "/api/2014/equipment/whip",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": []
  },
  {
    "special": [],
    "index": "woodcarvers-tools",
    "name": "Strumenti da intagliatore",
    "equipment_category": {
      "index": "tools",
      "name": "Strumenti",
      "url": "/api/2014/equipment-categories/tools"
    },
    "tool_category": "Strumenti da Artigiano",
    "cost": {
      "quantity": 1,
      "unit": "mo"
    },
    "weight": 2.5,
    "desc": [
      "Questi strumenti speciali includono gli oggetti necessari per praticare un mestiere o una professione. La tabella mostra esempi dei tipi più comuni di strumenti, ognuno dei quali fornisce oggetti relativi a un singolo mestiere. La competenza con un set di strumenti da artigiano consente di sommare il proprio bonus di competenza a qualsiasi prova di caratteristica effettuata utilizzando gli strumenti del proprio mestiere. Ogni tipo di strumento da artigiano richiede una competenza separata."
    ],
    "url": "/api/2014/equipment/woodcarvers-tools",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "wooden-staff",
    "name": "Bastone di legno",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "druidic-foci",
      "name": "Focalizzatori Druidici",
      "url": "/api/2014/equipment-categories/druidic-foci"
    },
    "cost": {
      "quantity": 5,
      "unit": "mo"
    },
    "weight": 2,
    "desc": [
      "Un focalizzatore druidico può essere un ramoscello di vischio o di agrifoglio, una bacchetta o uno scettro ricavato dal tasso o da un altro legno speciale, un bastone tratto intero da un albero vivente o un oggetto totemico che incorpora piume, pelliccia, ossa e denti di animali sacri. Un druido può usare un tale oggetto come focalizzatore da incantatore."
    ],
    "url": "/api/2014/equipment/wooden-staff",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
  {
    "special": [],
    "index": "yew-wand",
    "name": "Bacchetta di tasso",
    "equipment_category": {
      "index": "adventuring-gear",
      "name": "Equipaggiamento da Avventura",
      "url": "/api/2014/equipment-categories/adventuring-gear"
    },
    "gear_category": {
      "index": "druidic-foci",
      "name": "Focalizzatori Druidici",
      "url": "/api/2014/equipment-categories/druidic-foci"
    },
    "cost": {
      "quantity": 10,
      "unit": "mo"
    },
    "weight": 0.5,
    "desc": [
      "Un focalizzatore druidico può essere un ramoscello di vischio o di agrifoglio, una bacchetta o uno scettro ricavato dal tasso o da un altro legno speciale, un bastone tratto intero da un albero vivente o un oggetto totemico che incorpora piume, pelliccia, ossa e denti di animali sacri. Un druido può usare un tale oggetto come focalizzatore da incantatore."
    ],
    "url": "/api/2014/equipment/yew-wand",
    "updated_at": "2025-10-24T20:42:12.926Z",
    "contents": [],
    "properties": []
  },
];