// ==========================================================================
// database/magicItems.js
// ==========================================================================
export const magicItemsDatabase = [
  {
    "index": "adamantine-armor",
    "name": "Armatura in Adamantio",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Armatura (media o pesante, ma non di pelle), non comune",
      "Questa armatura è rinforzata con adamantio, una delle sostanze più dure esistenti. Mentre la indossi, qualsiasi colpo critico contro di te diventa un colpo normale."
    ],
    "image": "/api/images/magic-items/adamantine-armor.png",
    "url": "/api/2014/magic-items/adamantine-armor",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "ammunition",
    "name": "Munizioni, +1, +2, o +3",
    "equipment_category": {
      "index": "ammunition",
      "name": "Munizioni",
      "url": "/api/2014/equipment-categories/ammunition"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [
      {
        "index": "ammunition-1",
        "name": "Munizioni, +1",
        "url": "/api/2014/magic-items/ammunition-1"
      },
      {
        "index": "ammunition-2",
        "name": "Munizioni, +2",
        "url": "/api/2014/magic-items/ammunition-2"
      },
      {
        "index": "ammunition-3",
        "name": "Munizioni, +3",
        "url": "/api/2014/magic-items/ammunition-3"
      }
    ],
    "variant": false,
    "desc": [
      "Arma (qualsiasi munizione), non comune (+1), Rara (+2), o Molto rara (+3)",
      "Hai un bonus ai tiri per colpire e ai tiri per i danni effettuati con questo pezzo di munizione magica. Il bonus è determinato dalla rarità della munizione. Una volta che colpisce un bersaglio, la munizione non è più magica."
    ],
    "image": "/api/images/magic-items/ammunition.png",
    "url": "/api/2014/magic-items/ammunition",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "ammunition-1",
    "name": "Munizioni, +1",
    "equipment_category": {
      "index": "ammunition",
      "name": "Munizioni",
      "url": "/api/2014/equipment-categories/ammunition"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Arma (qualsiasi munizione), non comune",
      "Hai un bonus di +1 ai tiri per colpire e ai tiri per i danni effettuati con questo pezzo di munizione magica. Una volta che colpisce un bersaglio, la munizione non è più magica."
    ],
    "image": "/api/images/magic-items/ammunition.png",
    "url": "/api/2014/magic-items/ammunition-1",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "ammunition-2",
    "name": "Munizioni, +2",
    "equipment_category": {
      "index": "ammunition",
      "name": "Munizioni",
      "url": "/api/2014/equipment-categories/ammunition"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Arma (qualsiasi munizione), Rara",
      "Hai un bonus di +2 ai tiri per colpire e ai tiri per i danni effettuati con questo pezzo di munizione magica. Una volta che colpisce un bersaglio, la munizione non è più magica."
    ],
    "image": "/api/images/magic-items/ammunition.png",
    "url": "/api/2014/magic-items/ammunition-2",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "ammunition-3",
    "name": "Munizioni, +3",
    "equipment_category": {
      "index": "ammunition",
      "name": "Munizioni",
      "url": "/api/2014/equipment-categories/ammunition"
    },
    "rarity": {
      "name": "Molto rara"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Arma (qualsiasi munizione), Molto rara",
      "Hai un bonus di +3 ai tiri per colpire e ai tiri per i danni effettuati con questo pezzo di munizione magica. Una volta che colpisce un bersaglio, la munizione non è più magica."
    ],
    "image": "/api/images/magic-items/ammunition.png",
    "url": "/api/2014/magic-items/ammunition-3",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "amulet-of-health",
    "name": "Amuleto della Salute",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Rara (richiede sintonizzazione)",
      "Il tuo punteggio di Costituzione è 19 mentre indossi questo amuleto. Non ha alcun effetto su di te se la tua Costituzione è già 19 o superiore."
    ],
    "image": "/api/images/magic-items/amulet-of-health.png",
    "url": "/api/2014/magic-items/amulet-of-health",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "amulet-of-proof-against-detection-and-location",
    "name": "Amuleto di Protezione dall'Individuazione e dalla Localizzazione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, non comune (richiede sintonizzazione)",
      "Mentre indossi questo amuleto, sei nascosto dalla magia di divinazione. Non puoi essere bersagliato da tale magia o percepito attraverso sensori di scrutamento magici."
    ],
    "image": "/api/images/magic-items/amulet-of-proof-against-detection-and-location.png",
    "url": "/api/2014/magic-items/amulet-of-proof-against-detection-and-location",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "amulet-of-the-planes",
    "name": "Amuleto dei Piani",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Molto rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Molto rara (richiede sintonizzazione)",
      "Mentre indossi questo amuleto, puoi usare un'azione per nominare un luogo che ti è familiare su un altro piano di esistenza. Poi effettua una prova di Intelligenza con CD 15. Se la prova ha successo, lanci l'incantesimo spostamento planare. In caso di fallimento, tu e ogni creatura e oggetto entro 4,5 metri da te viaggiate verso una destinazione casuale. Tira un d100. Con 1-60, viaggi verso un luogo casuale sul piano che hai nominato. Con 61-100, viaggi verso un piano di esistenza determinato casualmente."
    ],
    "image": "/api/images/magic-items/amulet-of-the-planes.png",
    "url": "/api/2014/magic-items/amulet-of-the-planes",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "animated-shield",
    "name": "Scudo Animato",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Molto rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Armatura (scudo), Molto rara (richiede sintonizzazione)",
      "Mentre impugni questo scudo, puoi pronunciare la sua parola di comando come azione bonus per farlo animare. Lo scudo balza in aria e fluttua nel tuo spazio per proteggerti come se lo stessi impugnando, lasciandoti le mani libere. Lo scudo rimane animato per 1 minuto, finché non usi un'azione bonus per terminare questo effetto, o finché non sei inabile o muori, momento in cui lo scudo cade a terra o nella tua mano se ne hai una libera."
    ],
    "image": "/api/images/magic-items/animated-shield.png",
    "url": "/api/2014/magic-items/animated-shield",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "apparatus-of-the-crab",
    "name": "Apparato del Granchio",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Leggendaria"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Leggendaria",
      "Questo oggetto appare inizialmente come una grande botte di ferro sigillata del peso di 250 kg. La botte ha un fermo nascosto, che può essere trovato con una prova di Intelligenza (Indagare) con CD 20 riuscita. Rilasciare il fermo sblocca un portello a un'estremità della botte, permettendo a due creature Medie o più piccole di strisciare all'interno. Dieci leve sono disposte in fila all'estremità opposta, ciascuna in una posizione neutrale, in grado di muoversi sia su che giù. Quando vengono utilizzate determinate leve, l'apparato si trasforma per assomigliare a un'aragosta gigante.",
      "L'Apparato del Granchio è un oggetto Grande con le seguenti statistiche:",
      "Classe Armatura: 20",
      "Punti Ferita: 200",
      "Velocità: 9 m, nuotare 9 m (o 0 m per entrambi se le gambe e la coda non sono estese)",
      "Immunità ai Danni: veleno, psichici",
      "Per essere utilizzato come veicolo, l'apparato richiede un pilota. Mentre il portello dell'apparato è chiuso, lo scompartimento è a tenuta d'aria e stagna. Lo scompartimento contiene abbastanza aria per 10 ore di respirazione, diviso per il numero di creature che respirano al suo interno.",
      "L'apparato galleggia sull'acqua. Può anche andare sott'acqua a una profondità di 270 metri. Al di sotto di quella profondità, il veicolo subisce 2d6 danni contundenti al minuto a causa della pressione.",
      "Una creatura nello scompartimento può usare un'azione per muovere fino a due delle leve dell'apparato su o giù. Dopo ogni utilizzo, una leva torna alla sua posizione neutrale. Ogni leva, da sinistra a destra, funziona come mostrato nella tabella Leve dell'Apparato del Granchio.",
      "Leve dell'Apparato del Granchio",
      "| Leva | Su | Giù |",
      "|---|---|---|",
      "| 1 | Gambe e coda si estendono, permettendo all'apparato di camminare e nuotare. | Gambe e coda si ritraggono, riducendo la velocità dell'apparato a 0 e rendendolo incapace di beneficiare di bonus alla velocità. |",
      "| 2 | L'otturatore della finestra anteriore si apre. | L'otturatore della finestra anteriore si chiude. |",
      "| 3 | Gli otturatori delle finestre laterali si aprono (due per lato). | Gli otturatori delle finestre laterali si chiudono (due per lato). |",
      "| 4 | Due chele si estendono dai lati anteriori dell'apparato. | Le chele si ritraggono. |",
      "| 5 | Ogni chela estesa effettua il seguente attacco con arma da mischia: +8 per colpire, portata 1,5 m, un bersaglio. Colpito: 7 (2d6) danni contundenti. | Ogni chela estesa effettua il seguente attacco con arma da mischia: +8 per colpire, portata 1,5 m, un bersaglio. Colpito: Il bersaglio è afferrato (CD per sfuggire 15). |",
      "| 6 | L'apparato cammina o nuota in avanti. | L'apparato cammina o nuota all'indietro. |",
      "| 7 | L'apparato gira di 90 gradi a sinistra. | L'apparato gira di 90 gradi a destra. |",
      "| 8 | Apparecchi simili a occhi emettono luce intensa in un raggio di 9 metri e luce fioca per ulteriori 9 metri. | La luce si spegne. |",
      "| 9 | L'apparato affonda fino a 6 metri nel liquido. | L'apparato sale fino a 6 metri nel liquido. |",
      "| 10 | Il portello posteriore si dissigilla e si apre. | Il portello posteriore si chiude e si sigilla. |"
    ],
    "image": "/api/images/magic-items/apparatus-of-the-crab.png",
    "url": "/api/2014/magic-items/apparatus-of-the-crab",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "armor",
    "name": "Armatura, +1, +2, o +3",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [
      {
        "index": "armor-1",
        "name": "Armatura, +1",
        "url": "/api/2014/magic-items/armor-1"
      },
      {
        "index": "armor-2",
        "name": "Armatura, +2",
        "url": "/api/2014/magic-items/armor-2"
      },
      {
        "index": "armor-3",
        "name": "Armatura, +3",
        "url": "/api/2014/magic-items/armor-3"
      }
    ],
    "variant": false,
    "desc": [
      "Armatura (leggera, media o pesante), Rara (+1), Molto rara (+2), o leggendaria (+3)",
      "Hai un bonus alla CA mentre indossi questa armatura. Il bonus è determinato dalla sua rarità."
    ],
    "image": "/api/images/magic-items/armor.png",
    "url": "/api/2014/magic-items/armor",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "armor-1",
    "name": "Armatura, +1",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Armatura (leggera, media o pesante), Rara",
      "Hai un bonus di +1 alla CA mentre indossi questa armatura."
    ],
    "image": "/api/images/magic-items/armor.png",
    "url": "/api/2014/magic-items/armor-1",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "armor-2",
    "name": "Armatura, +2",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Molto rara"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Armatura (leggera, media o pesante), Molto rara",
      "Hai un bonus di +2 alla CA mentre indossi questa armatura."
    ],
    "image": "/api/images/magic-items/armor-2.png",
    "url": "/api/2014/magic-items/armor-2",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "armor-3",
    "name": "Armatura, +3",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Leggendaria"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Armatura (leggera, media o pesante), leggendaria",
      "Hai un bonus di +3 alla CA mentre indossi questa armatura."
    ],
    "image": "/api/images/magic-items/armor-3.png",
    "url": "/api/2014/magic-items/armor-3",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "armor-of-invulnerability",
    "name": "Armatura dell'Invulnerabilità",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Leggendaria"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Armatura (a piastre), leggendaria (richiede sintonizzazione)",
      "Hai resistenza ai danni non magici mentre indossi questa armatura. Inoltre, puoi usare un'azione per renderti immune ai danni non magici per 10 minuti o finché non indossi più l'armatura. Una volta utilizzata questa azione speciale, non può essere utilizzata di nuovo fino all'alba successiva."
    ],
    "image": "/api/images/magic-items/armor-of-invulnerability.png",
    "url": "/api/2014/magic-items/armor-of-invulnerability",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "armor-of-resistance",
    "name": "Armatura della Resistenza",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Armatura (leggera, media o pesante), Rara (richiede sintonizzazione)",
      "Hai resistenza a un tipo di danno mentre indossi questa armatura. Il GM sceglie il tipo o lo determina casualmente dalle opzioni seguenti.",
      "| d10 | Tipo di Danno |",
      "|---|---|",
      "| 1 | Acido |",
      "| 2 | Freddo |",
      "| 3 | Fuoco |",
      "| 4 | Forza |",
      "| 5 | Fulmine |",
      "| 6 | Necrotico |",
      "| 7 | Veleno |",
      "| 8 | Psichico |",
      "| 9 | Radiante |",
      "| 10 | Tuono |"
    ],
    "image": "/api/images/magic-items/armor-of-resistance.png",
    "url": "/api/2014/magic-items/armor-of-resistance",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "armor-of-vulnerability",
    "name": "Armatura della Vulnerabilità",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Armatura (a piastre), Rara (richiede sintonizzazione)",
      "Mentre indossi questa armatura, hai resistenza a uno dei seguenti tipi di danno: contundente, perforante o tagliente. Il GM sceglie il tipo o lo determina casualmente.",
      "***Maledizione.*** Questa armatura è maledetta, un fatto che viene rivelato solo quando viene lanciato un incantesimo identificare sull'armatura o ti sintonizzi con essa. Sintonizzarsi con l'armatura ti maledice finché non sei bersagliato dall'incantesimo rimuovi maledizione o da una magia simile; rimuovere l'armatura non pone fine alla maledizione. Mentre sei maledetto, hai vulnerabilità a due dei tre tipi di danno associati all'armatura (non quello a cui concede resistenza)."
    ],
    "image": "/api/images/magic-items/armor-of-vulnerability.png",
    "url": "/api/2014/magic-items/armor-of-vulnerability",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "arrow-catching-shield",
    "name": "Scudo Acchiappa-Frecce",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Armatura (scudo), Rara (richiede sintonizzazione)",
      "Ottieni un bonus di +2 alla CA contro gli attacchi a distanza mentre maneggi questo scudo. Questo bonus si aggiunge al normale bonus alla CA dello scudo. Inoltre, ogni volta che un attaccante effettua un attacco a distanza contro un bersaglio entro 1,5 metri da te, puoi usare la tua reazione per diventare il bersaglio dell'attacco al suo posto."
    ],
    "image": "/api/images/magic-items/arrow-catching-shield.png",
    "url": "/api/2014/magic-items/arrow-catching-shield",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "arrow-of-slaying",
    "name": "Freccia dell'Uccisione",
    "equipment_category": {
      "index": "ammunition",
      "name": "Munizioni",
      "url": "/api/2014/equipment-categories/ammunition"
    },
    "rarity": {
      "name": "Molto rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Arma (freccia), Molto rara",
      "Una freccia dell'uccisione è un'arma magica destinata a uccidere un particolare tipo di creatura. Alcune sono più focalizzate di altre; ad esempio, ci sono sia frecce dell'uccisione dei draghi che frecce dell'uccisione dei draghi blu. Se una creatura appartenente al tipo, razza o gruppo associato a una freccia dell'uccisione subisce danni dalla freccia, la creatura deve effettuare un tiro salvezza su Costituzione con CD 17, subendo 6d10 danni perforanti extra se fallisce il tiro salvezza, o la metà dei danni extra se ha successo.",
      "Una volta che una freccia dell'uccisione infligge i suoi danni extra a una creatura, diventa una freccia non magica.",
      "Esistono altri tipi di munizioni magiche di questo tipo, come i quadrelli dell'uccisione destinati a una balestra, sebbene le frecce siano le più comuni."
    ],
    "image": "/api/images/magic-items/arrow-of-slaying.png",
    "url": "/api/2014/magic-items/arrow-of-slaying",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "bag-of-beans",
    "name": "Sacco dei Fagioli",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Rara",
      "All'interno di questo pesante sacco di tela ci sono 3d4 fagioli secchi. Il sacco pesa 250 grammi più 125 grammi per ogni fagiolo che contiene.",
      "Se rovesci il contenuto del sacco a terra, questo esplode in un raggio di 3 metri, estendendosi dai fagioli. Ogni creatura nell'area, incluso te, deve effettuare un tiro salvezza su Destrezza con CD 15, subendo 5d4 danni da fuoco se fallisce il tiro salvezza, o la metà dei danni se ha successo. Il fuoco incendia gli oggetti infiammabili nell'area che non vengono indossati o trasportati.",
      "Se rimuovi un fagiolo dal sacco, lo pianti nella terra o nella sabbia e poi lo innaffi, il fagiolo produce un effetto 1 minuto dopo dal terreno dove è stato piantato. Il GM può scegliere un effetto dalla seguente tabella, determinarlo casualmente o creare un effetto.",
      "| d100 | Effetto |",
      "|---|---|",
      "| 01 | Spuntano 5d4 funghi velenosi. Se una creatura mangia un fungo, tira un qualsiasi dado. Con un risultato dispari, chi mangia deve superare un tiro salvezza su Costituzione con CD 15 o subire 5d6 danni da veleno e diventare avvelenato per 1 ora. Con un risultato pari, chi mangia ottiene 5d6 punti ferita temporanei per 1 ora. |",
      "| 02-10 | Un geyser erutta e spruzza acqua, birra, succo di bacche, tè, aceto, vino o olio (a scelta del GM) a 9 metri in aria per 1d12 round. |",
      "| 11-20 | Spunta un treant. C'è una probabilità del 50 percento che il treant sia caotico malvagio e attacchi. |",
      "| 21-30 | Sorge una statua di pietra animata e immobile con le tue sembianze. Fa minacce verbali contro di te. Se la lasci e altri si avvicinano, ti descrive come il più atroce dei malvagi e dirige i nuovi arrivati a trovarti e attaccarti. Se sei sullo stesso piano di esistenza della statua, essa sa dove ti trovi. La statua diventa inanimata dopo 24 ore. |",
      "| 31-40 | Un fuoco da campo con fiamme blu scaturisce e brucia per 24 ore (o finché non viene spento). |",
      "| 41-50 | Spuntano 1d6 + 6 funghi urlatori |",
      "| 51-60 | 1d4 + 8 rospi rosa brillante strisciano fuori. Ogni volta che un rospo viene toccato, si trasforma in un mostro Grande o più piccolo a scelta del GM. Il mostro rimane per 1 minuto, poi scompare in uno sbuffo di fumo rosa brillante. |",
      "| 61-70 | Un bulette affamato scava verso l'alto e attacca. |",
      "| 71-80 | Cresce un albero da frutto. Ha 1d10 + 20 frutti, 1d8 dei quali agiscono come pozioni magiche determinate casualmente, mentre uno agisce come un veleno ingerito a scelta del GM. L'albero svanisce dopo 1 ora. I frutti raccolti rimangono, conservando qualsiasi magia per 30 giorni. |",
      "| 81-90 | Sorge un nido di 1d4 + 3 uova. Qualsiasi creatura che mangia un uovo deve effettuare un tiro salvezza su Costituzione con CD 20. Se ha successo, una creatura aumenta permanentemente il suo punteggio di caratteristica più basso di 1, scegliendo casualmente tra punteggi ugualmente bassi. Se fallisce, la creatura subisce 10d6 danni da forza da un'esplosione magica interna. |",
      "| 91-99 | Una piramide con una base quadrata di 18 metri esplode verso l'alto. All'interno c'è un sarcofago contenente un signore delle mummie. La piramide è trattata come la tana del signore delle mummie e il suo sarcofago contiene tesori a scelta del GM. |",
      "| 100 | Spunta una pianta di fagioli gigante, che cresce fino a un'altezza a scelta del GM. La cima porta dove sceglie il GM, come a una vista grandiosa, al castello di un gigante delle nuvole o a un diverso piano di esistenza. |"
    ],
    "image": "/api/images/magic-items/bag-of-beans.png",
    "url": "/api/2014/magic-items/bag-of-beans",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "bag-of-devouring",
    "name": "Sacco del Divoratore",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Molto rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Molto rara",
      "Questo sacco assomiglia superficialmente a una borsa conservante ma è un orifizio di alimentazione per una gigantesca creatura extradimensionale. Rivoltare il sacco chiude l'orifizio.",
      "La creatura extradimensionale attaccata al sacco può percepire qualunque cosa venga posta all'interno del sacco. Materia animale o vegetale posta interamente nel sacco viene divorata e persa per sempre. Quando parte di una creatura vivente viene posta nel sacco, come accade quando qualcuno vi infila la mano, c'è una probabilità del 50 percento che la creatura venga tirata dentro il sacco. Una creatura all'interno del sacco può usare la sua azione per cercare di scappare con una prova di Forza con CD 15 riuscita. Un'altra creatura può usare la sua azione per infilare la mano nel sacco e tirare fuori una creatura, facendolo con una prova di Forza con CD 20 riuscita (a condizione che non venga tirata dentro il sacco prima). Qualsiasi creatura che inizia il suo turno all'interno del sacco viene divorata, il suo corpo distrutto.",
      "Gli oggetti inanimati possono essere conservati nel sacco, che può contenere 30 decimetri cubi di tale materiale. Tuttavia, una volta al giorno, il sacco ingoia qualsiasi oggetto al suo interno e lo sputa in un altro piano di esistenza. Il GM determina il tempo e il piano.",
      "Se il sacco viene forato o strappato, viene distrutto e qualsiasi cosa contenuta al suo interno viene trasportata in una posizione casuale sul Piano Astrale."
    ],
    "image": "/api/images/magic-items/bag-of-devouring.png",
    "url": "/api/2014/magic-items/bag-of-devouring",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "bag-of-holding",
    "name": "Borsa Conservante",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, non comune",
      "Questa borsa ha uno spazio interno considerevolmente più grande delle sue dimensioni esterne, circa 60 cm di diametro all'imboccatura e 120 cm di profondità. La borsa può contenere fino a 250 kg, senza superare un volume di 1,8 metri cubi. La borsa pesa 7,5 kg, indipendentemente dal suo contenuto. Recuperare un oggetto dalla borsa richiede un'azione.",
      "Se la borsa viene sovraccaricata, forata o strappata, si rompe e viene distrutta, e il suo contenuto viene sparso nel Piano Astrale. Se la borsa viene rivoltata, il suo contenuto si riversa fuori, illeso, ma la borsa deve essere rimessa a posto prima di poter essere utilizzata di nuovo. Le creature che respirano all'interno della borsa possono sopravvivere fino a un numero di minuti pari a 10 diviso per il numero di creature (minimo 1 minuto), dopodiché iniziano a soffocare.",
      "Mettere una borsa conservante all'interno di uno spazio extradimensionale creato da uno Zaino Pratico, un Buco Portatile o un oggetto simile distrugge istantaneamente entrambi gli oggetti e apre un portale verso il Piano Astrale. Il portale ha origine dove l'uno oggetto è stato posto all'interno dell'altro. Qualsiasi creatura entro 3 metri dal portale viene risucchiata attraverso di esso in una posizione casuale sul Piano Astrale. Il portale poi si chiude. Il portale è a senso unico e non può essere riaperto."
    ],
    "image": "/api/images/magic-items/bag-of-holding.png",
    "url": "/api/2014/magic-items/bag-of-holding",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "bag-of-tricks",
    "name": "Sacco dei Trucchi",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [
      {
        "index": "bag-of-tricks-gray",
        "name": "Sacco dei Trucchi Grigio",
        "url": "/api/2014/magic-items/bag-of-tricks-gray"
      },
      {
        "index": "bag-of-tricks-rust",
        "name": "Sacco dei Trucchi Ruggine",
        "url": "/api/2014/magic-items/bag-of-tricks-rust"
      },
      {
        "index": "bag-of-tricks-tan",
        "name": "Sacco dei Trucchi Marrone",
        "url": "/api/2014/magic-items/bag-of-tricks-tan"
      }
    ],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, non comune",
      "Questo sacco ordinario, fatto di stoffa grigia, ruggine o marrone, appare vuoto. Infilando la mano all'interno del sacco, tuttavia, si rivela la presenza di un piccolo oggetto peloso. Il sacco pesa 250 grammi.",
      "Puoi usare un'azione per tirare fuori l'oggetto peloso dal sacco e lanciarlo fino a 6 metri. Quando l'oggetto atterra, si trasforma in una creatura che determini tirando un d8 e consultando la tabella che corrisponde al colore del sacco. La creatura svanisce all'alba successiva o quando viene ridotta a 0 punti ferita.",
      "La creatura è amichevole verso di te e i tuoi compagni, e agisce nel Tuo Turno. Puoi usare un'Azione Bonus per Comandare come si muove la creatura e quale azione intraprende nel suo turno successivo, o per darle ordini generali, come Attaccare i tuoi nemici. In assenza di tali ordini, la creatura agisce in modo appropriato alla sua Natura.",
      "Una volta che tre Oggetti pelosi sono stati tirati fuori dal sacco, il sacco non può essere utilizzato di nuovo fino all'alba successiva.",
      "Sacco Grigio:",
      "| d8 | Creatura |",
      "|---|---|",
      "| 01 | Donnola |",
      "| 02 | Ratto Gigante |",
      "| 03 | Tasso |",
      "| 04 | Cinghiale |",
      "| 05 | Pantera |",
      "| 06 | Tasso Gigante |",
      "| 07 | Lupo Feroce |",
      "| 08 | Alce Gigante |",
      "Sacco Ruggine:",
      "| d8 | Creatura |",
      "|---|---|",
      "| 01 | Ratto |",
      "| 02 | Gufo |",
      "| 03 | Mastino |",
      "| 04 | Capra |",
      "| 05 | Capra Gigante |",
      "| 06 | Cinghiale Gigante |",
      "| 07 | Leone |",
      "| 08 | Orso Bruno |",
      "Sacco Marrone:",
      "| d8 | Creatura |",
      "|---|---|",
      "| 01 | Sciacallo |",
      "| 02 | Scimmia |",
      "| 03 | Babbuino |",
      "| 04 | Becco ad Ascia |",
      "| 05 | Orso Nero |",
      "| 06 | Donnola Gigante |",
      "| 07 | Iena Gigante |",
      "| 08 | Tigre |"
    ],
    "image": "/api/images/magic-items/bag-of-tricks.png",
    "url": "/api/2014/magic-items/bag-of-tricks",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "bag-of-tricks-gray",
    "name": "Sacco dei Trucchi Grigio",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Oggetto meraviglioso, non comune",
      "Questo sacco ordinario, fatto di stoffa grigia, appare vuoto. Infilando la mano all'interno del sacco, tuttavia, si rivela la presenza di un piccolo oggetto peloso. Il sacco pesa 250 grammi.",
      "Puoi usare un'azione per tirare fuori l'oggetto peloso dal sacco e lanciarlo fino a 6 metri. Quando l'oggetto atterra, si trasforma in una creatura che determini tirando un d8 e consultando la tabella che corrisponde al colore del sacco. La creatura svanisce all'alba successiva o quando viene ridotta a 0 Punti Ferita.",
      "La creatura è amichevole verso di te e i tuoi compagni, e agisce nel Tuo Turno. Puoi usare un'Azione Bonus per Comandare come si muove la creatura e quale azione intraprende nel suo turno successivo, o per darle ordini generali, come Attaccare i tuoi nemici. In assenza di tali ordini, la creatura agisce in modo appropriato alla sua Natura.",
      "Una volta che tre Oggetti pelosi sono stati tirati fuori dal sacco, il sacco non può essere utilizzato di nuovo fino all'alba successiva.",
      "Sacco Grigio:",
      "| d8 | Creatura |",
      "|---|---|",
      "| 01 | Donnola |",
      "| 02 | Ratto Gigante |",
      "| 03 | Tasso |",
      "| 04 | Cinghiale |",
      "| 05 | Pantera |",
      "| 06 | Tasso Gigante |",
      "| 07 | Lupo Feroce |",
      "| 08 | Alce Gigante |"
    ],
    "image": "/api/images/magic-items/bag-of-tricks.png",
    "url": "/api/2014/magic-items/bag-of-tricks-gray",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "bag-of-tricks-rust",
    "name": "Sacco dei Trucchi Ruggine",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Oggetto meraviglioso, non comune",
      "Questo sacco ordinario, fatto di stoffa ruggine, appare vuoto. Infilando la mano all'interno del sacco, tuttavia, si rivela la presenza di un piccolo oggetto peloso. Il sacco pesa 250 grammi.",
      "Puoi usare un'azione per tirare fuori l'oggetto peloso dal sacco e lanciarlo fino a 6 metri. Quando l'oggetto atterra, si trasforma in una creatura che determini tirando un d8 e consultando la tabella che corrisponde al colore del sacco. La creatura svanisce all'alba successiva o quando viene ridotta a 0 Punti Ferita.",
      "La creatura è amichevole verso di te e i tuoi compagni, e agisce nel Tuo Turno. Puoi usare un'Azione Bonus per Comandare come si muove la creatura e quale azione intraprende nel suo turno successivo, o per darle ordini generali, come Attaccare i tuoi nemici. In assenza di tali ordini, la creatura agisce in modo appropriato alla sua Natura.",
      "Una volta che tre Oggetti pelosi sono stati tirati fuori dal sacco, il sacco non può essere utilizzato di nuovo fino all'alba successiva.",
      "Sacco Ruggine:",
      "| d8 | Creatura |",
      "|---|---|",
      "| 01 | Ratto |",
      "| 02 | Gufo |",
      "| 03 | Mastino |",
      "| 04 | Capra |",
      "| 05 | Capra Gigante |",
      "| 06 | Cinghiale Gigante |",
      "| 07 | Leone |",
      "| 08 | Orso Bruno |"
    ],
    "image": "/api/images/magic-items/bag-of-tricks.png",
    "url": "/api/2014/magic-items/bag-of-tricks-rust",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "bag-of-tricks-tan",
    "name": "Sacco dei Trucchi Marrone",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Oggetto meraviglioso, non comune",
      "Questo sacco ordinario, fatto di stoffa marrone, appare vuoto. Infilando la mano all'interno del sacco, tuttavia, si rivela la presenza di un piccolo oggetto peloso. Il sacco pesa 250 grammi.",
      "Puoi usare un'azione per tirare fuori l'oggetto peloso dal sacco e lanciarlo fino a 6 metri. Quando l'oggetto atterra, si trasforma in una creatura che determini tirando un d8 e consultando la tabella che corrisponde al colore del sacco. La creatura svanisce all'alba successiva o quando viene ridotta a 0 Punti Ferita.",
      "La creatura è amichevole verso di te e i tuoi compagni, e agisce nel Tuo Turno. Puoi usare un'Azione Bonus per Comandare come si muove la creatura e quale azione intraprende nel suo turno successivo, o per darle ordini generali, come Attaccare i tuoi nemici. In assenza di tali ordini, la creatura agisce in modo appropriato alla sua Natura.",
      "Una volta che tre Oggetti pelosi sono stati tirati fuori dal sacco, il sacco non può essere utilizzato di nuovo fino all'alba successiva.",
      "Sacco Marrone:",
      "| d8 | Creatura |",
      "|---|---|",
      "| 01 | Sciacallo |",
      "| 02 | Scimmia |",
      "| 03 | Babbuino |",
      "| 04 | Becco ad Ascia |",
      "| 05 | Orso Nero |",
      "| 06 | Donnola Gigante |",
      "| 07 | Iena Gigante |",
      "| 08 | Tigre |"
    ],
    "image": "/api/images/magic-items/bag-of-tricks.png",
    "url": "/api/2014/magic-items/bag-of-tricks-tan",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "bead-of-force",
    "name": "Grano di Forza",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Rara",
      "Questa piccola Sfera nera misura circa 2 cm di diametro e pesa 30 grammi. Tipicamente, vengono trovati insieme 1d4 + 4 grani di forza.",
      "Puoi usare un'azione per lanciare il grano fino a 18 metri. Il grano esplode all'impatto e viene distrutto. Ogni creatura entro un raggio di 3 metri da dove il grano è atterrato deve superare un tiro salvezza su Destrezza con CD 15 o subire 5d4 danni da forza. Una Sfera di forza trasparente racchiude quindi l'area per 1 minuto. Qualsiasi creatura che ha fallito il tiro salvezza ed è completamente all'interno dell'area è intrappolata all'interno di questa Sfera. Le creature che hanno superato il tiro salvezza, o sono parzialmente all'interno dell'area, vengono spinte via dal centro della Sfera finché non sono più al suo interno. Solo l'aria respirabile può passare attraverso la parete della sfera. Nessun Attacco o altro Effetto può.",
      "Una creatura racchiusa può usare la sua azione per spingere contro la parete della sfera, muovendo la Sfera fino a metà della velocità di camminata della creatura. La Sfera può essere raccolta e la sua magia la fa pesare solo 0,5 kg, indipendentemente dal peso delle creature al suo interno."
    ],
    "image": "/api/images/magic-items/bead-of-force.png",
    "url": "/api/2014/magic-items/bead-of-force",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "belt-of-dwarvenkind",
    "name": "Cintura della Stirpe Nanica",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto Meraviglioso, Rara (richiede sintonizzazione)",
      "Mentre indossi questa cintura, ottieni i seguenti benefici:",
      "Il tuo punteggio di Costituzione aumenta di 2, fino a un massimo di 20.",
      "Hai vantaggio sulle prove di Carisma (Persuasione) effettuate per interagire con i Nani.",
      "Inoltre, mentre sei sintonizzato con la cintura, hai una probabilità del 50 percento ogni giorno all'alba di farti crescere una barba completa se sei in grado di farne crescere una, o una barba visibilmente più folta se ne hai già una.",
      "Se non sei un nano, ottieni i seguenti benefici aggiuntivi mentre indossi la cintura:",
      "Hai vantaggio sui Tiri Salvezza contro il veleno e hai Resistenza contro i danni da veleno.",
      "Puoi parlare, leggere e scrivere in Nanico."
    ],
    "image": "/api/images/magic-items/belt-of-dwarvenkind.png",
    "url": "/api/2014/magic-items/belt-of-dwarvenkind",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "belt-of-giant-strength",
    "name": "Cintura della Forza dei Giganti",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [
      {
        "index": "belt-of-giant-strength-hill",
        "name": "Cintura della Forza dei Giganti delle Colline",
        "url": "/api/2014/magic-items/belt-of-giant-strength-hill"
      },
      {
        "index": "belt-of-giant-strength-stone",
        "name": "Cintura della Forza dei Giganti delle Pietre",
        "url": "/api/2014/magic-items/belt-of-giant-strength-stone"
      },
      {
        "index": "belt-of-giant-strength-frost",
        "name": "Cintura della Forza dei Giganti del Gelo",
        "url": "/api/2014/magic-items/belt-of-giant-strength-frost"
      },
      {
        "index": "belt-of-giant-strength-fire",
        "name": "Cintura della Forza dei Giganti del Fuoco",
        "url": "/api/2014/magic-items/belt-of-giant-strength-fire"
      },
      {
        "index": "belt-of-giant-strength-cloud",
        "name": "Cintura della Forza dei Giganti delle Nuvole",
        "url": "/api/2014/magic-items/belt-of-giant-strength-cloud"
      },
      {
        "index": "belt-of-giant-strength-storm",
        "name": "Cintura della Forza dei Giganti delle Tempeste",
        "url": "/api/2014/magic-items/belt-of-giant-strength-storm"
      }
    ],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, rarità varia (richiede sintonizzazione)",
      "Mentre indossi questa cintura, il tuo punteggio di Forza cambia in un punteggio concesso dalla cintura. Se la tua Forza è già uguale o superiore al punteggio della cintura, l'oggetto non ha Effetto su di te.",
      "Esistono sei varietà di questa cintura, corrispondenti e aventi rarità in base ai Sei tipi di veri Giganti. La cintura della Forza dei Giganti delle Pietre e la cintura della Forza dei Giganti del Gelo hanno un aspetto diverso, ma hanno lo stesso Effetto.",
      "| Tipo | Forza | Rarità |",
      "|---|---|---|",
      "| Gigante delle Colline | 21 | Rara |",
      "| Gigante delle Pietre / Gigante del Gelo | 23 | Molto rara |",
      "| Gigante del Fuoco | 25 | Molto rara |",
      "| Gigante delle Nuvole | 27 | Leggendaria |",
      "| Gigante delle Tempeste | 29 | Leggendaria |"
    ],
    "image": "/api/images/magic-items/belt-of-giant-strength.png",
    "url": "/api/2014/magic-items/belt-of-giant-strength",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "belt-of-giant-strength-cloud",
    "name": "Cintura della Forza dei Giganti delle Nuvole",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Leggendaria"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Oggetto meraviglioso, Leggendaria (richiede sintonizzazione)",
      "Mentre indossi questa cintura, il tuo punteggio di Forza diventa 27. Se la tua Forza è già uguale o superiore al punteggio della cintura, l'oggetto non ha alcun Effetto su di te."
    ],
    "image": "/api/images/magic-items/belt-of-giant-strength.png",
    "url": "/api/2014/magic-items/belt-of-giant-strength-cloud",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "belt-of-giant-strength-fire",
    "name": "Cintura della Forza dei Giganti del Fuoco",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Molto rara"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Oggetto meraviglioso, Molto rara (richiede sintonizzazione)",
      "Mentre indossi questa cintura, il tuo punteggio di Forza diventa 25. Se la tua Forza è già uguale o superiore al punteggio della cintura, l'oggetto non ha alcun Effetto su di te."
    ],
    "image": "/api/images/magic-items/belt-of-giant-strength.png",
    "url": "/api/2014/magic-items/belt-of-giant-strength-fire",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "belt-of-giant-strength-frost",
    "name": "Cintura della Forza dei Giganti del Gelo",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Molto rara"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Oggetto meraviglioso, Molto rara (richiede sintonizzazione)",
      "Mentre indossi questa cintura, il tuo punteggio di Forza diventa 23. Se la tua Forza è già uguale o superiore al punteggio della cintura, l'oggetto non ha alcun Effetto su di te."
    ],
    "image": "/api/images/magic-items/belt-of-giant-strength.png",
    "url": "/api/2014/magic-items/belt-of-giant-strength-frost",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "belt-of-giant-strength-hill",
    "name": "Cintura della Forza dei Giganti delle Colline",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Oggetto meraviglioso, Rara (richiede sintonizzazione)",
      "Mentre indossi questa cintura, il tuo punteggio di Forza diventa 21. Se la tua Forza è già uguale o superiore al punteggio della cintura, l'oggetto non ha alcun Effetto su di te."
    ],
    "image": "/api/images/magic-items/belt-of-giant-strength.png",
    "url": "/api/2014/magic-items/belt-of-giant-strength-hill",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "belt-of-giant-strength-stone",
    "name": "Cintura della Forza dei Giganti delle Pietre",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Molto rara"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Oggetto meraviglioso, Molto rara (richiede sintonizzazione)",
      "Mentre indossi questa cintura, il tuo punteggio di Forza diventa 23. Se la tua Forza è già uguale o superiore al punteggio della cintura, l'oggetto non ha alcun Effetto su di te."
    ],
    "image": "/api/images/magic-items/belt-of-giant-strength.png",
    "url": "/api/2014/magic-items/belt-of-giant-strength-stone",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "belt-of-giant-strength-storm",
    "name": "Cintura della Forza dei Giganti delle Tempeste",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Leggendaria"
    },
    "variants": [],
    "variant": true,
    "desc": [
      "Oggetto meraviglioso, Leggendaria (richiede sintonizzazione)",
      "Mentre indossi questa cintura, il tuo punteggio di Forza diventa 29. Se la tua Forza è già uguale o superiore al punteggio della cintura, l'oggetto non ha alcun Effetto su di te."
    ],
    "image": "/api/images/magic-items/belt-of-giant-strength.png",
    "url": "/api/2014/magic-items/belt-of-giant-strength-storm",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "berserker-axe",
    "name": "Ascia del Berserker",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Arma (qualsiasi ascia), Rara (richiede sintonizzazione)",
      "Ottieni un bonus di +1 ai Tiri per Colpire e per i Danni effettuati con questa Arma Magica. Inoltre, mentre sei sintonizzato con questa arma, il tuo massimo dei Punti Ferita aumenta di 1 per ogni livello che hai raggiunto.",
      "***Maledizione.*** Questa ascia è Maledetta e sintonizzarsi con essa estende la maledizione a te. Finché rimani Maledetto, non sei disposto a separarti dall'ascia, tenendola sempre a portata di mano. Hai anche svantaggio sui tiri per Colpire con Armi diverse da questa, a meno che non ci siano nemici entro 18 metri da te che puoi vedere o sentire.",
      "Ogni volta che una creatura Ostile ti danneggia mentre l'ascia è in tuo possesso, devi superare un tiro salvezza su Saggezza con CD 15 o andare in berserk. Mentre sei in berserk, devi usare la tua azione ogni round per Attaccare la creatura più vicina a te con l'ascia. Se puoi effettuare attacchi extra come parte dell'azione di Attacco, usi quegli attacchi extra, muovendoti per Attaccare la creatura più vicina successiva dopo aver abbattuto il tuo bersaglio attuale. Se hai più Bersagli possibili, ne Attacchi uno a caso. Sei in berserk finché non inizi il Tuo Turno senza creature entro 18 metri da te che puoi vedere o sentire."
    ],
    "image": "/api/images/magic-items/berserker-axe.png",
    "url": "/api/2014/magic-items/berserker-axe",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "boots-of-elvenkind",
    "name": "Stivali Elfici",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, non comune",
      "Mentre indossi questi stivali, i tuoi passi non producono alcun suono, indipendentemente dalla superficie su cui ti muovi. Hai anche vantaggio sulle prove di Destrezza (Furtività) che si basano sul muoversi silenziosamente."
    ],
    "image": "/api/images/magic-items/boots-of-elvenkind.png",
    "url": "/api/2014/magic-items/boots-of-elvenkind",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "boots-of-levitation",
    "name": "Stivali della Levitazione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Rara (richiede sintonizzazione)",
      "Mentre indossi questi stivali, puoi usare un'azione per lanciare l'incantesimo levitazione su te stesso a volontà."
    ],
    "image": "/api/images/magic-items/boots-of-levitation.png",
    "url": "/api/2014/magic-items/boots-of-levitation",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "boots-of-speed",
    "name": "Stivali della Velocità",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Rara (richiede sintonizzazione)",
      "Mentre indossi questi stivali, puoi usare un'azione bonus e sbattere i tacchi degli stivali insieme. Se lo fai, gli stivali raddoppiano la tua velocità di camminata e qualsiasi creatura che effettua un attacco di opportunità contro di te ha svantaggio sul tiro per colpire. Se sbatti di nuovo i tacchi insieme, termini l'effetto.",
      "Quando la proprietà degli stivali è stata utilizzata per un totale di 10 minuti, la magia cessa di funzionare finché non finisci un riposo lungo."
    ],
    "image": "/api/images/magic-items/boots-of-speed.png",
    "url": "/api/2014/magic-items/boots-of-speed",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "boots-of-striding-and-springing",
    "name": "Stivali Molleggiati",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, non comune (richiede sintonizzazione)",
      "Mentre indossi questi stivali, la tua velocità di camminata diventa 9 metri, a meno che la tua velocità di camminata non sia superiore, e la tua velocità non è ridotta se sei ingombrato o indossi un'armatura pesante. Inoltre, puoi saltare tre volte la distanza normale, sebbene tu non possa saltare più lontano di quanto il tuo movimento rimanente consentirebbe."
    ],
    "image": "/api/images/magic-items/boots-of-striding-and-springing.png",
    "url": "/api/2014/magic-items/boots-of-striding-and-springing",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "boots-of-the-winterlands",
    "name": "Stivali delle Terre Invernali",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, non comune (richiede sintonizzazione)",
      "Questi stivali di pelliccia sono comodi e sembrano piuttosto caldi. Mentre li indossi, ottieni i seguenti benefici:",
      "* Hai resistenza ai danni da freddo.",
      "* Ignori il terreno difficile creato da ghiaccio o neve.",
      "* Puoi tollerare temperature fino a -45 gradi Celsius senza alcuna protezione aggiuntiva. Se indossi abiti pesanti, puoi tollerare temperature fino a -73 gradi Celsius."
    ],
    "image": "/api/images/magic-items/boots-of-the-winterlands.png",
    "url": "/api/2014/magic-items/boots-of-the-winterlands",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "bowl-of-commanding-water-elementals",
    "name": "Ciotola del Comando degli Elementali dell'Acqua",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Rara",
      "Mentre questa ciotola è piena d'acqua, puoi usare un'azione per pronunciare la parola di comando della ciotola ed evocare un elementale dell'acqua, come se avessi lanciato l'incantesimo evocare elementale. La ciotola non può essere utilizzata di nuovo in questo modo fino all'alba successiva.",
      "La ciotola ha un diametro di circa 30 cm e una profondità pari alla metà. Pesa 1,5 kg e contiene circa 11 litri."
    ],
    "url": "/api/2014/magic-items/bowl-of-commanding-water-elementals",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "bracers-of-archery",
    "name": "Bracciali dell'Arciere",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, non comune (richiede sintonizzazione)",
      "Mentre indossi questi bracciali, hai competenza con l'arco lungo e l'arco corto, e ottieni un bonus di +2 ai tiri per i danni sugli attacchi a distanza effettuati con tali armi."
    ],
    "image": "/api/images/magic-items/bracers-of-archery.png",
    "url": "/api/2014/magic-items/bracers-of-archery",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "bracers-of-defense",
    "name": "Bracciali della Difesa",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Rara (richiede sintonizzazione)",
      "Mentre indossi questi bracciali, ottieni un bonus di +2 alla CA se non indossi alcuna armatura e non usi alcuno scudo."
    ],
    "image": "/api/images/magic-items/bracers-of-defense.png",
    "url": "/api/2014/magic-items/bracers-of-defense",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "brazier-of-commanding-fire-elementals",
    "name": "Braciere del Comando degli Elementali del Fuoco",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Rara",
      "Mentre un fuoco brucia in questo braciere di ottone, puoi usare un'azione per pronunciare la parola di comando del braciere ed evocare un elementale del fuoco, come se avessi lanciato l'incantesimo evocare elementale. Il braciere non può essere utilizzato di nuovo in questo modo fino all'alba successiva.",
      "Il braciere pesa 2,5 kg."
    ],
    "image": "/api/images/magic-items/brazier-of-commanding-fire-elementals.png",
    "url": "/api/2014/magic-items/brazier-of-commanding-fire-elementals",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "brooch-of-shielding",
    "name": "Spilla di Protezione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, non comune (richiede sintonizzazione)",
      "Mentre indossi questa spilla, hai resistenza ai danni da forza e hai immunità ai danni dall'incantesimo dardo incantato."
    ],
    "image": "/api/images/magic-items/brooch-of-shielding.png",
    "url": "/api/2014/magic-items/brooch-of-shielding",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "broom-of-flying",
    "name": "Scopa Volante",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, non comune",
      "Questa scopa di legno, che pesa 1,5 kg, funziona come una scopa banale finché non ti metti a cavalcioni su di essa e pronunci la sua parola di comando. Essa poi fluttua sotto di te e può essere cavalcata in aria. Ha una velocità di volare di 15 metri. Può trasportare fino a 180 kg, ma la sua velocità di volare diventa 9 metri mentre trasporta oltre 90 kg. La scopa smette di fluttuare quando atterri.",
      "Puoi inviare la scopa a viaggiare da sola verso una destinazione entro 1,5 km da te se pronunci la parola di comando, nomini il luogo e sei familiare con quel posto. La scopa torna da te quando pronunci un'altra parola di comando, a condizione che la scopa sia ancora entro 1,5 km da te."
    ],
    "image": "/api/images/magic-items/broom-of-flying.png",
    "url": "/api/2014/magic-items/broom-of-flying",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "candle-of-invocation",
    "name": "Candela dell'Invocazione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Molto rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Molto rara (richiede sintonizzazione)",
      "Questa sottile candela è dedicata a una divinità e condivide l'allineamento di quella divinità. L'allineamento della candela può essere rilevato con l'incantesimo individuazione del bene e del male. Il GM sceglie il dio e l'allineamento associato o determina l'allineamento casualmente.",
      "| d20 | Allineamento |",
      "|---|---|",
      "| 1-2 | Caotico malvagio |",
      "| 3-4 | Caotico neutrale |",
      "| 5-7 | Caotico buono |",
      "| 8-9 | Neutrale malvagio |",
      "| 10-11 | Neutrale |",
      "| 12-13 | Neutrale buono |",
      "| 14-15 | Legale malvagio |",
      "| 16-17 | Legale neutrale |",
      "| 18-20 | Legale buono |",
      "La magia della candela viene attivata quando la candela è accesa, il che richiede un'azione. Dopo aver bruciato per 4 ore, la candela viene distrutta. Puoi spegnerla presto per usarla in un secondo momento. Deduci il tempo in cui ha bruciato in incrementi di 1 minuto dal tempo di combustione totale della candela.",
      "Mentre è accesa, la candela emette luce fioca in un raggio di 9 metri. Qualsiasi creatura all'interno di quella luce il cui allineamento corrisponde a quello della candela effettua tiri per colpire, tiri salvezza e prove di abilità con vantaggio. Inoltre, un chierico o druido nella luce il cui allineamento corrisponde a quello della candela può lanciare incantesimi di 1° livello che ha preparato senza spendere slot incantesimo, sebbene l'effetto dell'incantesimo sia come se fosse lanciato con uno slot di 1° livello.",
      "In alternativa, quando accendi la candela per la prima volta, puoi lanciare l'incantesimo portale con essa. Farlo distrugge la candela."
    ],
    "image": "/api/images/magic-items/candle-of-invocation.png",
    "url": "/api/2014/magic-items/candle-of-invocation",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "cape-of-the-mountebank",
    "name": "Cappa del Saltimbanco",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Rara",
      "Questa cappa profuma vagamente di zolfo. Mentre la indossi, puoi usarla per lanciare l'incantesimo porta dimensionale come azione. Questa proprietà della cappa non può essere utilizzata di nuovo fino all'alba successiva.",
      "Quando scompari, lasci dietro di te una nuvola di fumo, e appari in una simile nuvola di fumo alla tua destinazione. Il fumo oscura leggermente lo spazio che hai lasciato e lo spazio in cui appari, e si disperde alla fine del tuo turno successivo. Un vento leggero o più forte disperde il fumo."
    ],
    "image": "/api/images/magic-items/cape-of-the-mountebank.png",
    "url": "/api/2014/magic-items/cape-of-the-mountebank",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "carpet-of-flying",
    "name": "Tappeto Volante",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-items"
    },
    "rarity": {
      "name": "Molto rara"
    },
    "variants": [
      {
        "index": "carpet-of-flying-3x5",
        "name": "Tappeto Volante (0,9 m × 1,5 m)",
        "url": "/api/2014/magic-items/carpet-of-flying-3x5"
      },
      {
        "index": "carpet-of-flying-4x6",
        "name": "Tappeto Volante (1,2 m × 1,8 m)",
        "url": "/api/2014/magic-items/carpet-of-flying-4x6"
      },
      {
        "index": "carpet-of-flying-5x7",
        "name": "Tappeto Volante (1,5 m × 2,1 m)",
        "url": "/api/2014/magic-items/carpet-of-flying-5x7"
      },
      {
        "index": "carpet-of-flying-6x9",
        "name": "Tappeto Volante (1,8 m × 2,7 m)",
        "url": "/api/2014/magic-items/carpet-of-flying-6x9"
      }
    ],
    "variant": false,
    "desc": [
      "Oggetto meraviglioso, Molto rara",
      "Puoi pronunciare la parola di comando del tappeto come azione per far fluttuare e volare il tappeto. Si muove secondo le tue indicazioni vocali, a condizione che tu sia entro 9 metri da esso.",
      "Esistono quattro dimensioni di tappeto volante. Il GM sceglie la dimensione di un dato tappeto o la determina casualmente.",
      "| d100 | Dimensione | Capacità | Velocità di Volo |",
      "|---|---|---|---|",
      "| 01-20 | 0,9 m × 1,5 m | 90 kg | 24 metri |",
      "| 21-55 | 1,2 m × 1,8 m | 180 kg | 18 metri |",
      "| 56-80 | 1,5 m × 2,1 m | 270 kg | 12 metri |",
      "| 81-100 | 1,8 m × 2,7 m | 360 kg | 9 metri |",
      "Un tappeto può trasportare fino al doppio del peso mostrato nella tabella, ma vola a metà velocità se trasporta più della sua normale capacità."
    ],
    "image": "/api/images/magic-items/carpet-of-flying.png",
    "url": "/api/2014/magic-items/carpet-of-flying",
    "updated_at": "2025-10-24T20:42:13.517Z"
  },
  {
    "index": "chime-of-opening",
    "name": "Carillon dell'Apertura",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Puoi suonare questo tubo di metallo puntandolo verso un oggetto entro 120 piedi che può essere aperto (porta, serratura, coperchio).",
      "Il carillon emette un tono chiaro e una serratura o un chiavistello si apre. Se non ci sono serrature, l'oggetto stesso si apre.",
      "Può essere usato dieci volte, dopodiché si crepa e diventa inutile."
    ],
    "url": "/api/2014/magic-items/chime-of-opening",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "cloak-of-displacement",
    "name": "Mantello dello Spostamento",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Rara (richiede sintonia)"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Il mantello proietta un'illusione che ti fa apparire vicino alla tua posizione reale, conferendo svantaggio ai tiri per colpire contro di te.",
      "Se subisci danni, la proprietà smette di funzionare fino all'inizio del tuo turno successivo.",
      "La proprietà è soppressa se sei incapacitato, trattenuto o impossibilitato a muoverti."
    ],
    "url": "/api/2014/magic-items/cloak-of-displacement",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "cloak-of-protection",
    "name": "Mantello della Protezione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune (richiede sintonia)"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ottieni un bonus di +1 alla CA e ai tiri salvezza mentre indossi questo mantello."
    ],
    "url": "/api/2014/magic-items/cloak-of-protection",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "crystal-ball",
    "name": "Sfera di Cristallo",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Leggendaria (richiede sintonia)"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre la tocchi, puoi lanciare l'incantesimo Scrutare (CD del tiro salvezza 17).",
      "Esistono varianti: Lettura del Pensiero, Telepatia o Visione del Vero (conferisce Visione del Vero entro 120 piedi dal sensore)."
    ],
    "url": "/api/2014/magic-items/crystal-ball",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "cubic-gate",
    "name": "Cubo dei Portali",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Leggendaria"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ogni faccia del cubo è sintonizzata su un piano di esistenza diverso.",
      "Con un'azione puoi premere una faccia per lanciare Portale o premerla due volte per lanciare Spostamento Planare (CD 17).",
      "Il cubo ha 3 cariche e recupera 1d3 cariche all'alba."
    ],
    "url": "/api/2014/magic-items/cubic-gate",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "dagger-of-venom",
    "name": "Pugnale del Veleno",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ottieni un bonus di +1 ai tiri per colpire e ai danni.",
      "Con un'azione puoi ricoprire la lama di veleno: il prossimo colpo entro 1 minuto infligge 2d10 danni da veleno extra e la creatura deve superare un TS su Costituzione CD 15 o essere avvelenata per 1 minuto."
    ],
    "url": "/api/2014/magic-items/dagger-of-venom",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "dancing-sword",
    "name": "Spada Danzante",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Molto rara (richiede sintonia)"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Con un'azione bonus puoi far fluttuare la spada fino a 30 piedi per attaccare un bersaglio.",
      "Dopo quattro attacchi, la spada torna nella tua mano o cade ai tuoi piedi se non hai mani libere."
    ],
    "url": "/api/2014/magic-items/dancing-sword",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "demon-armor",
    "name": "Armatura del Demone",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Molto rara (richiede sintonia)"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Bonus +1 alla CA e puoi parlare l'Abissale. I guanti d'arme infliggono 1d8 danni taglienti come armi magiche.",
      "Maledizione: Non puoi toglierla senza Rimuovi Maledizione. Hai svantaggio ai tiri per colpire contro i demoni e ai TS contro le loro capacità."
    ],
    "url": "/api/2014/magic-items/demon-armor",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "dragon-scale-mail",
    "name": "Armatura di Scaglie di Drago",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Molto rara (richiede sintonia)"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Bonus +1 alla CA, vantaggio contro Presenza Terrificante e armi a soffio dei draghi, e resistenza a un tipo di danno basato sul colore del drago.",
      "Una volta al giorno puoi individuare la direzione e la distanza del drago più vicino dello stesso tipo entro 30 miglia."
    ],
    "url": "/api/2014/magic-items/dragon-scale-mail",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "elemental-gem-water",
    "name": "Gemma Elementale dell'Acqua",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo smeraldo contiene un frammento di energia elementale. Quando usi un'azione per rompere la gemma, viene evocato un elementale dell'acqua come se avessi lanciato l'incantesimo Evoca Elementale, e la magia della gemma svanisce."
    ],
    "url": "/api/2014/magic-items/elemental-gem-water",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "elven-chain",
    "name": "Cotta Elfica",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ottieni un bonus di +1 alla CA mentre indossi questa armatura. Sei considerato competente in questa armatura anche se non hai competenza nelle armature medie."
    ],
    "url": "/api/2014/magic-items/elven-chain",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "eyes-of-charming",
    "name": "Occhi dello Charme",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune (richiede sintonia)"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Queste lenti di cristallo hanno 3 cariche. Mentre le indossi, puoi usare un'azione e 1 carica per lanciare Charme su Persone (CD 13) su un umanoide entro 30 piedi che puoi vedere. Le lenti recuperano tutte le cariche all'alba."
    ],
    "url": "/api/2014/magic-items/eyes-of-charming",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "feather-token",
    "name": "Segnale di Piuma",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Un piccolo oggetto che somiglia a una piuma. Esistono varie versioni: Ancora, Albero, Barca a Cigno, Fan e Uccello. Ognuno ha un effetto monouso che si attiva lanciando o toccando il segnale (es. la Barca a Cigno crea un'imbarcazione lunga 50 piedi)."
    ],
    "url": "/api/2014/magic-items/feather-token",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "figurine-of-wondrous-power",
    "name": "Statuetta del Potere Meraviglioso",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Una statuetta di una bestia che può diventare una creatura vivente se lanciata a terra pronunciando la parola di comando. Esempi includono il Grifone di Bronzo (diventa un grifone per 6 ore) o l'Elefante di Marmo."
    ],
    "url": "/api/2014/magic-items/figurine-of-wondrous-power",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "folding-boat",
    "name": "Barca Pieghevole",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Una scatola di legno che può trasformarsi in una barca (10 ft) o in una nave (24 ft) pronunciando parole di comando diverse. Può contenere fino a 15 creature medie nella forma più grande."
    ],
    "url": "/api/2014/magic-items/folding-boat",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "frost-brand",
    "name": "Marchio del Gelo",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Molto rara (richiede sintonia)"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Infligge 1d6 danni da freddo extra. Fornisce resistenza al fuoco. Può estinguere fiamme non magiche entro 30 piedi quando viene sguainata."
    ],
    "url": "/api/2014/magic-items/frost-brand",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "gauntlets-of-ogre-power",
    "name": "Guanti del Potere d'Ogre",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune (richiede sintonia)"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Il tuo punteggio di Forza diventa 19 mentre indossi questi guanti. Non hanno effetto se la tua Forza è già 19 o superiore."
    ],
    "url": "/api/2014/magic-items/gauntlets-of-ogre-power",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "gem-of-seeing",
    "name": "Gemma della Visione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Rara (richiede sintonia)"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ha 3 cariche. Usando un'azione e 1 carica, ottieni Visione del Vero (Truesight) fino a 120 piedi per 10 minuti guardando attraverso la gemma."
    ],
    "url": "/api/2014/magic-items/gem-of-seeing",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "hammer-of-thunderbolts",
    "name": "Martello dei Fulmini",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Leggendaria"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Bonus +1 ad attacco/danni. Richiede Guanti del Potere d'Ogre e una Cintura della Forza del Gigante per la sintonia. Aumenta la Forza di 4. Può stordire i nemici ed eliminare istantaneamente i giganti con un colpo critico (CD 17)."
    ],
    "url": "/api/2014/magic-items/hammer-of-thunderbolts",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "horn-of-valhalla",
    "name": "Corno del Valhalla",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Suonando il corno evochi spiriti berserker dal Valhalla che combattono per te per 1 ora. Se non soddisfi i requisiti di competenza del metallo (Argento, Ottone, Bronzo o Ferro), i berserker ti attaccano."
    ],
    "url": "/api/2014/magic-items/horn-of-valhalla",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "ali-del-volo",
    "name": "Ali Del Volo",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa cappa, puoi usare un’azione per pronunciare la sua parola di comando, trasformandola in un paio di ali da pipistrello o da uccello che spuntano dalla tua schiena per 1 ora o finché non ripeti la parola di comando con un’azione. Le ali ti forniscono velocità di volo 18 metri. Quando scompaiono, non potrai più usarle per 1d12 ore."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/ali-del-volo",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "ammazzadraghi",
    "name": "Ammazzadraghi",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ottieni un bonus di +1 ai tiri per colpire e danno effettuati con quest’arma magica.Quando colpisci un drago con quest’arma, il drago subisce 3d6 danni aggiuntivi del tipo dell’arma. Ai fini di quest’arma, “drago” è qualsiasi creatura del tipo drago."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/ammazzadraghi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "ammazzagiganti",
    "name": "Ammazzagiganti",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ottieni un bonus di +1 ai tiri per colpire e danno effettuati con quest’arma magica.Quando colpisci un gigante con quest’arma, il gigante subisce 2d6 danni aggiuntivi del tipo dell’arma e deve superare un tiro salvezza di Forza con CD 15 o cadere prono. Ai fini di quest’arma, “gigante” è qualsiasi creatura del tipo gigante."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/ammazzagiganti",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "ampolla-di-ferro",
    "name": "Ampolla Di Ferro",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa bottiglia di ferro ha un tappo di ottone. Puoi usare un’azione per pronunciare la parola di comando dell’ampolla, prendendo come bersaglio una creatura visibile entro 18 metri da te. Se il bersaglio è nativo di un piano di esistenza diverso da quello in cui ti trovi, deve superare un tiro salvezza di Saggezza con CD 17 o venir intrappolato nell’ampolla. Se il bersaglio è già stato intrappolato nell’ampolla, riceve vantaggio al tiro salvezza. Una volta intrappolata, la creatura rimarrà nell’ampolla finché non sarà liberata. L’ampolla può contenere solo una creatura alla volta. Una creatura intrappolata nell’ampolla non ha bisogno di respirare, mangiare o dormire e non invecchia. Puoi usare un’azione per rimuovere il tappo dell’ampolla e liberare la creatura che contiene. La creatura sarà amichevole verso di te e i tuoi compagni per 1 ora e obbedirà ai vostri comandi per quella durata. Se non le impartisci comandi o gliene dai uno che provocherebbe la sua morte, si difenderà ma non compirà altre azioni. Al termine della durata, la creatura agirà in base al suo normale comportamento e allineamento.L’incantesimo identificare rivela che una creatura si trova all’interno dell’ampolla, ma l’unico modo per determinare che sorta di creatura sia è di aprire l’ampolla. Un’ampolla di ferro appena scoperta potrebbe già contenere una creatura scelta dal GM o determinata casualmente."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/ampolla-di-ferro",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "amuleto-anti-individuazione-e-localizzazione",
    "name": "Amuleto Anti Individuazione E Localizzazione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo amuleto sei celato alla magia di divinazione. Non puoi essere preso come bersaglio da queste magie o percepito tramite sensori magici di scrutamento."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/amuleto-anti-individuazione-e-localizzazione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-accumula-incantesimi",
    "name": "Anello Accumula Incantesimi",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo anello immagazzina gli incantesimi lanciati su di esso, conservandoli fino a che chi vi è in sintonia non ne faccia uso. L’anello può accumulare fino a 5 livelli di incantesimi alla volta. Qualsiasi creatura può lanciare un incantesimo dal 1° al 5° livello sull’anello, toccandolo mentre lancia l’incantesimo. L’incantesimo non ha effetto, oltre quello di essere immagazzinato nell’anello. Se l’anello non può contenere l’incantesimo, lo slot incantesimo viene speso senza effetti. Il livello dello slot usato per lanciare l’incantesimo determina la quantità di spazio che occupa. Mentre indossi questo anello, puoi lanciare gli incantesimi che contiene. L’incantesimo usa il livello dello slot, la CD del tiro salvezza dell’incantesimo, il bonus per colpire dell’incantesimo e la caratteristica da incantatore dell’incantatore originale, ma per il resto è considerato come se fosse stato lanciato da te. Un incantesimo lanciato tramite questo anello non è più contenuto al suo interno, e libera spazio per altri incantesimi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-accumula-incantesimi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-dei-tre-desideri",
    "name": "Anello Dei Tre Desideri",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi quest’anello, puoi usare un’azione per spendere 1 delle sue 3 cariche per lanciare tramite esso l’incantesimo desiderio. L’anello perde la sua magia quando usi l’ultima carica."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-dei-tre-desideri",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-del-calore",
    "name": "Anello Del Calore",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, hai resistenza ai danni da freddo. Inoltre, tu e tutto quello che indossi e trasporti siete immuni agli effetti delle temperature basse fino a – 45° C."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-del-calore",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-del-camminare-sullacqua",
    "name": "Anello Del Camminare Sullacqua",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, puoi stare in piedi o muoverti su qualsiasi superficie liquida come se fosse terreno solido."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-del-camminare-sullacqua",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-del-comando-degli-elementali-del-fuoco",
    "name": "Anello Del Comando Degli Elementali Del Fuoco",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo anello è collegato al Piano Elementale del Fuoco.Mentre lo indossi, hai vantaggio ai tiri per colpire contro gli elementali del Piano Elementale del Fuoco, ed essi hanno svantaggio ai tiri per colpire effettuati contro di te. Puoi spendere 2 cariche dell’anello per lanciare dominare mostri su di un elementale del fuoco. Inoltre, hai resistenza ai danni da fuoco.Puoi parlare e comprendere l’Ignan. Se aiuti a uccidere un elementale del fuoco mentre sei in sintonia con l’anello, ottieni accesso alle seguenti proprietà aggiuntive: Hai immunità ai danni da fuoco. Puoi lanciare tramite l’anello i seguenti incantesimi, spendendo il numero di cariche richieste: mani brucianti (1 carica), muro di fuoco (3 cariche) o palla di fuoco (2 cariche). L’anello ha 5 cariche. Recupera 1d4 + 1 cariche ogni giorno all’alba.Gli incantesimi lanciati tramite l’anello hanno CD del tiro salvezza 17."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-del-comando-degli-elementali-del-fuoco",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-del-comando-degli-elementali-dellacqua",
    "name": "Anello Del Comando Degli Elementali Dellacqua",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo anello è collegato al Piano Elementale dell’Acqua.Mentre lo indossi, hai vantaggio ai tiri per colpire contro gli elementali del Piano Elementale dell’Acqua, ed essi hanno svantaggio ai tiri per colpire effettuati contro di te.Puoi spendere 2 cariche dell’anello per lanciare dominare mostri su di un elementale dell’acqua. Inoltre, puoi stare in piedi e camminare sulle superfici liquide come se fossero terreno solido.Puoi parlare e comprendere l’Aquan.Se aiuti a uccidere un elementale dell’acqua mentre sei in sintonia con l’anello, ottieni accesso alle seguenti proprietà aggiuntive: Puoi respirare sott’acqua e hai velocità di nuovo pari alla tua velocità di passeggio. Puoi lanciare tramite l’anello i seguenti incantesimi, spendendo il numero di cariche richieste: creare o distruggere acqua (1 carica), controllare tempo atmosferico (3 cariche), muro di ghiaccio (3 cariche) o tempesta di ghiaccio (2 cariche). L’anello ha 5 cariche. Recupera 1d4 + 1 cariche ogni giorno all’alba.Gli incantesimi lanciati tramite l’anello hanno CD del tiro salvezza 17."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-del-comando-degli-elementali-dellacqua",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-del-comando-degli-elementali-dellaria",
    "name": "Anello Del Comando Degli Elementali Dellaria",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo anello è collegato al Piano Elementale dell’Aria. Mentre lo indossi, hai vantaggio ai tiri per colpire contro gli elementali del Piano Elementale dell’Aria, ed essi hanno svantaggio ai tiri per colpire effettuati contro di te. Puoi spendere 2 cariche dell’anello per lanciare dominare mostri su di un elementale dell’aria.Inoltre, quando cadi, scendi di 18 metri per round e non subisci danni dalla caduta.Puoi parlare e comprendere l’Auran.Se aiuti a uccidere un elementale dell’aria mentre sei in sintonia con l’anello, ottieni accesso alle seguenti proprietà aggiuntive: Hai resistenza ai danni da fulmine. Hai velocità di volo pari alla tua velocità di passeggio e puoi fluttuare. Puoi lanciare tramite l’anello i seguenti incantesimi, spendendo il numero di cariche richieste: catena di fulmini (3 cariche), folata di vento (2 cariche) o muro di vento (1 carica). L’anello ha 5 cariche. Recupera 1d4 + 1 cariche ogni giorno all’alba.Gli incantesimi lanciati tramite l’anello hanno CD del tiro salvezza 17."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-del-comando-degli-elementali-dellaria",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-del-comando-degli-elementali-della-terra",
    "name": "Anello Del Comando Degli Elementali Della Terra",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo anello è collegato al Piano Elementale della Terra.Mentre lo indossi, hai vantaggio ai tiri per colpire contro gli elementali del Piano Elementale della Terra, ed essi hanno svantaggio ai tiri per colpire effettuati contro di te. Puoi spendere 2 cariche dell’anello per lanciare dominare mostri su di un elementale della terra. Inoltre, puoi muoverti su terreno difficile composto da macerie, pietre o terra come se fosse terreno normale. Puoi parlare e comprendere il Terran. Se aiuti a uccidere un elementale della terra mentre sei in sintonia con l’anello, ottieni accesso alle seguenti proprietà aggiuntive: Hai resistenza ai danni da acido. Puoi muoverti attraverso la terra o la roccia solida come se fossero terreno difficile. Se vi termini il tuo turno, vieni proiettato fuori nello spazio non occupato più vicino che hai occupato per ultimo. Puoi lanciare tramite l’anello i seguenti incantesimi, spendendo il numero di cariche richieste: scolpire pietra (2 cariche), muro di pietra (3 cariche) o pelle di pietra (1 carica). L’anello ha 5 cariche. Recupera 1d4 + 1 cariche ogni giorno all’alba.Gli incantesimi lanciati tramite l’anello hanno CD del tiro salvezza 17."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-del-comando-degli-elementali-della-terra",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-del-nuotare",
    "name": "Anello Del Nuotare",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, hai velocità di nuoto 12 metri."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-del-nuotare",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-del-saltare",
    "name": "Anello Del Saltare",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, con un’azione bonus puoi lanciare tramite esso l’incantesimo saltare a volontà, ma il bersaglio puoi essere solo tu."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-del-saltare",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-dellariete",
    "name": "Anello Dellariete",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, puoi usare un’azione per spendere da 1 a 3 cariche per attaccare una creatura visibile entro 18 metri da te. L’anello produce una testa di ariete spettrale ed effettua il suo tiro per colpire con un bonus di +7. Se colpisci, per ogni carica spesa, il bersaglio subisce 2d10 danni da forza e viene spinto di 1,5 metri lontano da te. In alternativa, puoi spendere da 1 a 3 cariche dell’anello con un’azione per tentare di rompere un oggetto visibile entro 18 metri da te che non sia indossato otrasportato. L’anello effettua una prova di Forza con un bonus di +5 per ogni carica spesa. Questo anello ha 3 cariche, e recupera 1d3 cariche spese ogni mattina all’alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-dellariete",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-della-caduta-morbida",
    "name": "Anello Della Caduta Morbida",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre cadi e indossi questo anello, scendi di 18 metri per round e non subisci danni dalla caduta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-della-caduta-morbida",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-della-liberta-di-azione",
    "name": "Anello Della Liberta Di Azione",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, il terreno difficile non ti costa movimento aggiuntivo. Inoltre, la magia non può né ridurre la tua velocità né renderti paralizzato o intralciato."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-della-liberta-di-azione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-della-vista-ai-raggi-x",
    "name": "Anello Della Vista Ai Raggi X",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, puoi usare un’azione per pronunciarne la parola di comando. Quando lo fai, puoi vedere attraverso la materia solida per 1 minuto. Questa vista ha un raggio di 9 metri. Per te, gli oggetti solidi all’interno del raggio appaiono trasparenti e non impediscono alla luce di attraversarli. Questa vista può penetrare 30 centimetri di pietra, 2,5 centimetri di metallo comune o fino a 90 centimetri di legno o terra. Le sostanze più dense bloccano la vista, così come un sottile foglio di piombo.Ogni qualvolta usi di nuovo l’anello prima di aver terminato un riposo lungo, devi superare un tiro salvezza di Costituzione con CD 15 o guadagnare un livello di sfinimento."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-della-vista-ai-raggi-x",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-delle-stelle-cadenti",
    "name": "Anello Delle Stelle Cadenti",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Anello, molto raro (richiede sintonia all’esterno di notte)Mentre indossi questo anello a luce fioca o all’oscurità, puoi lanciare tramite esso luci danzanti e luce a volontà. Lanciare uno dei due incantesimi tramite l’anello richiede un’azione.L’anello ha 6 cariche per le seguenti altre proprietà. L’anello recupera 1d6 cariche spese ogni giorno all’alba. Luminescenza Spendi 1 carica con un’azione per lanciare tramite l’anello luminescenza. Sfera di Fulmini Puoi spendere 2 cariche con un’azione per creare da una a quattro sfere di fulmini di 1 metro di diametro. Più sfere crei, meno potente sarà ciascuna sfera individualmente.Ogni sfera compare in uno spazio non occupato visibile entro 36 metri da te. La sfera dura finché ti concentri su di essa (come se ti concentrassi su di un incantesimo), fino a un massimo di 1 minuto. Ogni sfera irradia luce fioca in un raggio di 9 metri.Con un’azione bonus, puoi muovere ciascuna sfera di massimo 9 metri, ma senza superare i 36 metri di distanza da te. Quando una creatura, a parte te, si trova entro 1,5 metri da una sfera, la sfera scarica i fulmini contro quella creatura e poi scompare. Quella creatura deve effettuare un tiro salvezza di Destrezza con CD 15. Se fallisce il tiro salvezza, la creatura subisce danni da fulmine in base al numero di sfere da te creato. Stelle Cadenti Puoi spendere da 1 a 3 cariche con un’azione. Per ogni carica spesa, scagli un scintilla di luce dall’anello in un punto visibile entro 18 metri da te. Ogni creatura, in cubo di 4,5 metri di lato originante da quel punto, viene ricoperta di scintille e deve effettuare un tiro salvezza di Destrezza CD 15, subendo 5d4 danni da fuoco se lo fallisce, o la metà di questi danni se lo supera."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-delle-stelle-cadenti",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-di-eludere",
    "name": "Anello Di Eludere",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello e fallisci un tiro salvezza di Destrezza, puoi usare la tua reazione per spendere 1 carica per riuscire il tiro salvezza che hai appena fallito. Questo anello ha 3 cariche, e recupera 1d3 cariche spese ogni mattina all’alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-di-eludere",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-di-evocazione-del-djinni",
    "name": "Anello Di Evocazione Del Djinni",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi quest’anello, puoi pronunciarne la parola di comando con un’azione per evocare uno specifico djinni del Piano Elementale dell’Aria. Lo djinni compare in uno spazio non occupato a tua scelta, entro 36 metri da te. Resta finché rimani concentrato (come se ti concentrassi su di un incantesimo), per un massimo di 1 ora, o finché non scende a 0 punti ferita. Poi ritorna al suo piano natio.Finché resta evocato, lo djinni è amichevole verso di te e i tuoi compagni. Obbedisce a qualsiasi comando gli dai, non importa la lingua usata. Se non gli impartisci ordini, lo djinni si difenderà dagli attacchi ma non effettuerà nessun’altra azione.Dopo la partenza dello djinni, esso non potrà più essere evocato prima che siano passate 24 ore, e se lo djinni muore l’anello perde la sua magia."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-di-evocazione-del-djinni",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-di-influenza-sugli-animali",
    "name": "Anello Di Influenza Sugli Animali",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, puoi usare un’azione per spendere 1 delle sue cariche per lanciare tramite esso uno dei seguenti incantesimi: amicizia con gli animali (CD del tiro salvezza 13), parlare con gli animali, paura (CD del tiro salvezza 13, prende come bersaglio solo bestie che hanno Intelligenza 3 o meno). Questo anello ha 3 cariche, e recupera 1d3 cariche spese ogni giorno all’alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-di-influenza-sugli-animali",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-di-invisibilita",
    "name": "Anello Di Invisibilita",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi quest’anello, puoi renderti invisibile con un’azione. Tutto ciò che indossi o trasporti diventa invisibile assieme a te. Resti invisibile finché l’anello non viene rimosso, attacchi o lanci un incantesimo, o finché non usi un’azione bonus per tornare visibile."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-di-invisibilita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-di-protezione",
    "name": "Anello Di Protezione",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, hai un bonus di +1 alla CA e ai tiri salvezza."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-di-protezione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-di-resistenza",
    "name": "Anello Di Resistenza",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, hai resistenza a un tipo di danno. La gemma incastonata nell’anello indica il tipo di danno, che viene scelto o determinato casualmente dal GM."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-di-resistenza",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-di-rigenerazione",
    "name": "Anello Di Rigenerazione",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, recuperi 1d6 punti ferita ogni 10 minuti, purché ti rimanga almeno 1 punto ferita. Se perdi una parte del corpo, l’anello fa sì che la parte mancante ricresca e ritorni alla sua completa funzionalità in 1d6 + 1 giorni, purché per tutto il periodo ti rimanga sempre almeno 1 punto ferita."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-di-rigenerazione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-di-scudo-mentale",
    "name": "Anello Di Scudo Mentale",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, sei immune alla magia che permette alle altre creature di leggere i tuoi pensieri, determinare se stai mentendo, conoscere il tuo allineamento, o apprendere che tipo di creatura sei. Le creature possono comunicare telepaticamente con te solo se glielo concedi.Puoi usare un’azione per far diventare invisibile l’anello fino a che un’altra azione non lo renderà di nuovo visibile, finché non lo rimuovi o muori.Se muori mentre indossi questo anello, la tua anima vi viene catturata, a meno che non ospiti già un’altra anima. Puoi decidere di rimanere nell’anello o raggiungere la vita ultraterrena. Finché la tua anima resta nell’anello, puoi comunicare telepaticamente con qualsiasi creatura lo indossi. Chi lo indossa non può impedire questa forma di comunicazione telepatica."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-di-scudo-mentale",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-di-telecinesi",
    "name": "Anello Di Telecinesi",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo anello, puoi lanciare a volontà l’incantesimo telecinesi, ma puoi prendere come bersaglio solo oggetti che non siano indossati o trasportati."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-di-telecinesi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "anello-rifletti-incantesimo",
    "name": "Anello Rifletti Incantesimo",
    "equipment_category": {
      "index": "ring",
      "name": "Anello",
      "url": "/api/2014/equipment-categories/ring"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi quest’anello, hai vantaggio ai tiri salvezza contro qualsiasi incantesimo che prende come bersaglio solo te e non un’area di effetto. Inoltre, se ottieni 20 sul tiro salvezza e l’incantesimo è di 7° livello o più basso, l’incantesimo non ha effetto su di te e invece prende come bersaglio l’incantatore, utilizzando il livello dello slot, la CD del tiro salvezza dell’incantesimo, il bonus per colpire e la caratteristica da incantatore dell’incantatore originale."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/anello-rifletti-incantesimo",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "apparato-di-kwalish",
    "name": "Apparato Di Kwalish",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quest’oggetto appare come un barile di ferro sigillato di taglia Grande e del peso di 250 chili. Il barile nasconde un fermo, che può essere trovato superando una prova di Intelligenza ( Indagare ) con CD 20. Rimuover e il fermo apre uno scomparto a una delle estremità dell’apparato, che permette a due creature di taglia Media o inferiore di entrarvi dentro. All’estremità opposta sono disposte dieci leve, ciascuna in posizione neutrale, in grado d i muoversi verso l’alto o il basso. Quando vengono impiegate determinate leve, l’appar ato si trasforma e assomiglia a un’aragosta gigante. L’apparato è un oggetto Grande con le seguenti statistiche. Classe Armatura Punti Ferita Velocità 9 m, nuoto 9 m (o 0 m entrambi se le gambe e la coda non vengono estese) Immunità ai Danni psichico, veleno Per essere usato come veicolo, l’apparato necessita un pilota. Quando lo sportello dell’apparato viene chiuso, il compartimento è a tenuta stagna, e non fa filtrare aria o acqua. I compartimenti conservano aria sufficiente per 10 ore, divise per il numero di creature all’interno.L’apparato galleggia in acqua e può anche spingersi sott’acqua fino a una profondità di 270 metri. Al di sotto di questa soglia, l’apparato subisce 2d6 danni contundenti al minuto a causa della pressione.Una creatura all’interno del compartimento può usare un’azione per muovere verso l’alto o il basso fino a due leve. Dopo ciascun uso, la leva torna alla sua posizione neutrale. Ogni leva, da sinistra a destra, funziona come mostrato sulla tabella seguente."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/apparato-di-kwalish",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "arco-del-giuramento",
    "name": "Arco Del Giuramento",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando incocchi una freccia con questo arco, essa sussurra in Elfico “Rapida sconfitta ai miei nemici!”. Quando usi quest’arma per effettuare un attacco a distanza puoi, come parola di comando, dire “Rapida morte a te che mi hai recato torto!” Il bersaglio del tuo attacco diventa il tuo nemico giurato fino alla sua morte o all’alba del settimo giorno successivo. Puoi avere solo un nemico giurato alla volta. Quando il tuo nemico giurato muore, potrai sceglierne uno nuovo dopo la prossima alba.Quando effettui un tiro per colpire a distanza con quest’arma contro il tuo nemico giurato, hai vantaggio sul tiro. Inoltre, il bersaglio non riceve alcun beneficio dalla copertura che non sia una copertura totale, e non soffri svantaggio a causa della gittata lunga. Se l’attacco colpisce, il tuo nemico giurato subisce 3d6 danni perforanti.Finché il tuo nemico giurato è vivo, hai svantaggio al tiro per colpire con tutte le altre armi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/arco-del-giuramento",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "arma-1-2-o-3",
    "name": "Arma 1 2 O 3",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Hai un bonus ai tiri per colpire e ai tiri di danno effettuati con quest’arma. Il bonus è determinato dalla rarità dell’arma.Alcune armi magiche (in particolare le spade) possiedono delle ulteriori proprietà, come l’emettere luce."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/arma-1-2-o-3",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "arma-spietata",
    "name": "Arma Spietata",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando ottieni 20 al tiro per colpire con quest’arma magica, il bersaglio subisce 7 danni aggiuntivi del tipo dell’arma."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/arma-spietata",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "armatura-1-2-3",
    "name": "Armatura 1 2 3",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa armatura ricevi un bonus alla tua Classe Armatura. Il bonus è determinato dalla rarità dell’armatura."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/armatura-1-2-3",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "armatura-adamantina",
    "name": "Armatura Adamantina",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre la indossi, qualsiasi colpo critico che subisci diventa un colpo normale."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/armatura-adamantina",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "armatura-completa-della-forma-eterea",
    "name": "Armatura Completa Della Forma Eterea",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre la indossi, ottieni un bonus di +1 alla CA, e puoi comprendere e parlare l’Abissale. Inoltre, le manopole artigliate dell’armatura trasformano i colpi disarmati effettuati con le tue mani in armi magiche che infliggono danni taglienti, con un bonus di +1 ai tiri per colpire e ai tiri di danno e il d8 come dado di danno. Maledizione Mentre la indossi, con un’azione puoi pronunciare la sua parola di comando per ottenere l’effetto dell’incantesimo forma eterea che dura 10 minuti o finché non rimuovi l’armatura o usi un’azione per pronunciare di nuovo la parola di comando. Questa proprietà dell’armatura non può essere usata di nuovo fino alla prossima alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/armatura-completa-della-forma-eterea",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "armatura-completa-nanica",
    "name": "Armatura Completa Nanica",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre la indossi, ottieni un bonus di +2 alla CA. Inoltre, se un effetto ti muove sul terreno contro la tua volontà, puoi usare la tua reazione per ridurre di 3 metri la distanza di cui sei mosso."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/armatura-completa-nanica",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "armatura-dellinvurnerabilita",
    "name": "Armatura Dellinvurnerabilita",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa armatura hai resistenza ai danni non magici. Inoltre, puoi usare un’azione per renderti immune ai danni non magici per 10 minuti o fino a che non starai più indossando questa armatura. Una volta usata l’armatura in questo modo, non potrai più usarla così fino alla prossima alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/armatura-dellinvurnerabilita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "armatura-della-vurnerabilita",
    "name": "Armatura Della Vurnerabilita",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre la indossi, hai resistenza a uno dei seguenti tipi di danno: contundente, perforante o tagliente. Il GM sceglie il tipo. Maledizione L’armatura è maledetta, cosa che viene rivelata solo quando le viene lanciato sopra l’incantesimo identificare o vi entri in sintonia. Entrare in sintonia con l’armatura ti maledice fino a quando non sarai bersaglio dell’incantesimo rimuovi maledizione o simili magie: rimuovere l’armatura non pone fine alla maledizione. Mentre sei maledetto, hai vulnerabilità a due dei tre tipi di danno associati con l’armatura (che non siano quello a cui hai resistenza)."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/armatura-della-vurnerabilita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "armatura-demoniaca",
    "name": "Armatura Demoniaca",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre la indossi, ottieni un bonus di +1 alla CA, e puoi comprendere e parlare l’Abissale. Inoltre, le manopole artigliate dell’armatura trasformano i colpi disarmati effettuati con le tue mani in armi magiche che infliggono danni taglienti, con un bonus di +1 ai tiri per colpire e ai tiri di danno e il d8 come dado di danno. Maledizione Una volta indossata questa armatura maledetta, non potrai più rimuoverla a meno che non diventi bersaglio dell’incantesimo rimuovi maledizione o una simile magia. Mentre indossi questa armatura, hai svantaggio ai tiri per colpire contro i demoni e ai tiri salvezza contro i loro incantesimi e capacità speciali."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/armatura-demoniaca",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "armatura-di-cuoio-borchiato-incantata",
    "name": "Armatura Di Cuoio Borchiato Incantata",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre la indossi, ottieni un bonus di +1 alla CA. Puoi anche usare un’azione bonus per pronunciare la parola di comando dell’armatura e far sì che l’armatura assuma l’aspetto di un comune abito o qualche altro tipo di armatura. Decidi tu l’aspetto, compreso il colore, lo stile e gli accessori, ma l’armatura mantiene il suo normale ingombro e peso. L’aspetto illusorio dura finché non usi di nuovo questa proprietà o ti togli l’armatura."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/armatura-di-cuoio-borchiato-incantata",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "armatura-in-mithral",
    "name": "Armatura In Mithral",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Il mithral è un metallo leggero e flessibile. Un giaco di maglia o un pettorale di mithral possono essere indossati sotto abiti normali. Se l’armatura normalmente impone svantaggio alle prove di Destrezza (Furtività) o richiede un requisito di Forza, la versione in mithral dell’armatura non lo fa."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/armatura-in-mithral",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-dei-dardi-incantati",
    "name": "Bacchetta Dei Dardi Incantati",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa bacchetta, puoi usare un’azione per spendere 1 o più delle sue cariche per lanciare tramite essa l’incantesimo dardo incantato. Per 1 carica, lanci l’incantesimo come se avessi usato uno slot di 1° livello, e incrementi il livello dello slot incantesimo di uno per ogni carica aggiuntiva che spendi.Questa bacchetta ha 7 cariche. La bacchetta recupera 1d6 + 1 cariche spese all’alba di ciascun giorno. Tuttavia, se spendi l’ultima carica della bacchetta, tira un d20. Se ottieni 1, la bacchetta si riduce in polvere ed è distrutta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-dei-dardi-incantati",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-dei-fulmini",
    "name": "Bacchetta Dei Fulmini",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa bacchetta, puoi usare un’azione per spendere 1 o più cariche per lanciare tramite essa l’incantesimo fulmine (CD del tiro salvezza 15).Per 1 carica, puoi lanciare la versione di 3° livello dell’incantesimo. Puoi aumentare lo slot incantesimo di uno per ogni ulteriore carica spesa.Questa bacchetta ha 7 cariche. La bacchetta recupera 1d6 + 1 cariche spese all’alba di ciascun giorno. Tuttavia, se spendi l’ultima carica della bacchetta, tira un d20. Se ottieni 1, la bacchetta si riduce in polvere ed è distrutta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-dei-fulmini",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-dei-segreti",
    "name": "Bacchetta Dei Segreti",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa bacchetta, puoi usare un’azione per spendere 1 carica, e se una porta segreta o trappola si trova entro 9 metri da te, la bacchetta pulsa e punta a quella più vicina a te.La bacchetta ha 3 cariche. La bacchetta recupera 1d3 cariche spese all’alba di ciascun giorno."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-dei-segreti",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-del-legame",
    "name": "Bacchetta Del Legame",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa bacchetta ha 7 cariche per le seguenti proprietà. La bacchetta recupera 1d6 + 1 cariche spese all’alba di ciascun giorno. Tuttavia, se spendi l’ultima carica della bacchetta, tira un d20. Se ottieni 1, la bacchetta si riduce in polvere ed è distrutta. Incantesimi Mentre impugni questa bacchetta, puoi usare un’azione e spendere alcune delle sue cariche per lanciare uno dei seguenti incantesimi (CD del tiro salvezza 17): blocca mostri (5 cariche) o blocca persone (2 cariche). Fuga Assistita Mentre impugni questa bacchetta, puoi usare la tua reazione e spendere 1 carica per ottenere vantaggio ai tiri salvezza che effettui per evitare di restare paralizzato o intralciato, o puoi spendere 1 carica per ottenere vantaggio su qualsiasi prova effettuata per sfuggire un tentativo di afferrare."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-del-legame",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-del-mago-da-guerra-1-2-o-3",
    "name": "Bacchetta Del Mago Da Guerra 1 2 O 3",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa bacchetta, ottieni un bonus ai tiri per colpire con gli incantesimi determinato dalla rarità della bacchetta.Inoltre, ignori metà copertura quando effettui un attacco con incantesimo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-del-mago-da-guerra-1-2-o-3",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-della-metamorfosi",
    "name": "Bacchetta Della Metamorfosi",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa bacchetta, puoi usare un’azione per spendere 1 carica per lanciare tramite essa l’incantesimo metamorfosi (CD del tiro salvezza 15).Questa bacchetta ha 7 cariche. La bacchetta recupera 1d6 + 1 cariche spese all’alba di ciascun giorno. Tuttavia, se spendi l’ultima carica della bacchetta, tira un d20. Se ottieni 1, la bacchetta si riduce in polvere ed è distrutta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-della-metamorfosi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-della-paralisi",
    "name": "Bacchetta Della Paralisi",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa bacchetta, puoi usare un’azione per spendere 1 carica per far sì che un sottile raggio parta dalla sua punta verso una creatura visibile entro 18 metri da te. Il bersaglio deve superare un tiro salvezza di Costituzione con CD 15 o restare paralizzato per 1 minuto. Al termine di ciascun turno del bersaglio, questi può effettuare un tiro salvezza di Costituzione CD 15, terminando l’effetto su di sé in caso lo superi.Questa bacchetta ha 7 cariche. La bacchetta recupera 1d6 + 1 cariche spese all’alba di ciascun giorno. Tuttavia, se spendi l’ultima carica della bacchetta, tira un d20. Se ottieni 1, la bacchetta si riduce in polvere ed è distrutta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-della-paralisi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-della-paura",
    "name": "Bacchetta Della Paura",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa bacchetta ha 7 cariche per le seguenti proprietà. La bacchetta recupera 1d6 + 1 cariche spese all’alba di ciascun giorno. Tuttavia, se spendi l’ultima carica della bacchetta, tira un d20. Se ottieni 1, la bacchetta si riduce in polvere ed è distrutta. Comando Mentre impugni questa bacchetta, puoi usare un’azione per spendere 1 carica e comandare a un’altra creatura di scappare o strisciare, come per l’incantesimo comando (CD del tiro salvezza 15). Cono di Paura Mentre impugni questa bacchetta, puoi usare un’azione per spendere 2 cariche, facendo sì che la punta della bacchetta emetta luce in un cono di 18 metri. Ogni creatura nel cono deve superare un tiro salvezza di Saggezza con CD 15 o restare spaventata da te per 1 minuto. Mentre è spaventata in questo modo, una creatura deve spendere i suoi turni cercando di muoversi più lontano possibile da te, e non può muoversi volontariamente entro 9 metri da te. Inoltre non può effettuare reazioni. Come sua azione, la creatura può usare solo l’azione Scattare o cercare di scappare da un effetto che le impedisca di muoversi. Se non può muoversi da nessuna parte, la creatura può usare l’azione Schivare. Al termine di ciascun suo turno, la creatura può ripetere il tiro salvezza, terminando l’effetto su di sé in caso lo superi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-della-paura",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-della-ragnatela",
    "name": "Bacchetta Della Ragnatela",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre la impugni, puoi usare un’azione per spendere 1 carica per lanciare tramite essa l’incantesimo ragnatela (CD del tiro salvezza 15).Questa bacchetta ha 7 cariche. La bacchetta recupera 1d6 + 1 cariche spese all’alba di ciascun giorno. Tuttavia, se spendi l’ultima carica della bacchetta, tira un d20. Se ottieni 1, la bacchetta si riduce in polvere ed è distrutta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-della-ragnatela",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-delle-meraviglie",
    "name": "Bacchetta Delle Meraviglie",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa bacchetta, puoi spendere 1 carica con un’azione e scegliere un bersaglio entro 36 metri da te. Il bersaglio può essere una creatura, un oggetto o un punto nello spazio. Il GM decide o determina casualmente cosa accadrà quando fai uso della bacchetta.Gli incantesimi lanciati tramite la bacchetta hanno CD del tiro salvezza 15. Se l’incantesimo normalmente ha una gittata espressa in metri, la gittata diventa 36 metri qualora non lo sia già.Se un effetto copre un’area, devi centrare l’incantesimo sul bersaglio e includervelo. Se un effetto più agire su più soggetti possibili, il GM determina casualmente chi sia affetto.Questa bacchetta ha 7 cariche. La bacchetta recupera 1d6 + 1 cariche ogni giorno all’alba. Se spendi l’ultima carica della bacchetta, tira un d20. Se ottieni 1, la bacchetta si riduce in polvere ed è distrutta. Ogni volta che fai uso della bacchetta delle meraviglie tira un d100 e consulta questa tabella."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-delle-meraviglie",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-delle-palle-di-fuoco",
    "name": "Bacchetta Delle Palle Di Fuoco",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa bacchetta, puoi usare un’azione per spendere 1 o più cariche per lanciare tramite essa l’incantesimo palla di fuoco (CD del tiro salvezza 15). Per 1 carica, lanci la versione di 3° livello dell’incantesimo. Puoi aumentare lo slot incantesimo di uno per ogni ulteriore carica spesa.Questa bacchetta ha 7 cariche. La bacchetta recupera 1d6 + 1 cariche spese all’alba di ciascun giorno. Tuttavia, se spendi l’ultima carica della bacchetta, tira un d20. Se ottieni 1, la bacchetta si riduce in polvere ed è distrutta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-delle-palle-di-fuoco",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-di-individuazione-dei-nemici",
    "name": "Bacchetta Di Individuazione Dei Nemici",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa bacchetta, puoi usare un’azione e spendere 1 carica per pronunciarne la parola di comando. Per il minuto successivo, conosci in che direzione si trovi la creatura ostile più vicina entro 18 metri da te, ma non la distanza che vi separa. La bacchetta può percepire la presenza di creature ostili che siano eteree, invisibili, camuffate, o nascoste, oltre che di quelle in piena vista. L’effetto termina se smetti di impugnare la bacchetta.Questa bacchetta ha 7 cariche. La bacchetta recupera 1d6 + 1 cariche spese all’alba di c iascun giorno. Tuttavia, se spendi l’ultima carica della bacchetta, tira un d20. Se ottieni 1, la bacchetta si riduce in polvere ed è distrutta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-di-individuazione-dei-nemici",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bacchetta-di-individuazione-del-magico",
    "name": "Bacchetta Di Individuazione Del Magico",
    "equipment_category": {
      "index": "wand",
      "name": "Bacchetta",
      "url": "/api/2014/equipment-categories/wand"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa bacchetta, con un’azione puoi spendere 1 carica per lanciare tramite essa l’incantesimo individuazione del magico.Questa bacchetta ha 3 cariche, e recupera 1d3 cariche spese ogni mattina all’alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bacchetta-di-individuazione-del-magico",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bastone-dei-boschi",
    "name": "Bastone Dei Boschi",
    "equipment_category": {
      "index": "staff",
      "name": "Bastone",
      "url": "/api/2014/equipment-categories/staff"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Il bastone può essere impugnato come un bastone da combattimento magico che conferisce un bonus di +2 ai tiri per colpire e danno effettuati con esso. Quando lo impugni hai anche un bonus di +2 ai tiri per colpire con incantesimi.Questo bastone ha 10 cariche per le seguenti proprietà. Recupera 1d6 + 4 cariche spese ogni giorno all’alba. Se spendi l’ultima carica del bastone, tira un d20. Se il risultato è 1, il bastone si annerisce, si trasforma in cenere, ed è distrutto. Incantesimi Puoi usare un’azione per spendere 1 o più cariche del bastone per lanciare tramite esso uno dei seguenti incantesimi, utilizzando la tua CD del tiro salvezza degli incantesimi: amicizia con gli animali (1 carica), localizza animali e piante (1 carica), muro di spine (6 cariche), parlare con gli animali (3 cariche), pelle coriacea (2 cariche) o risveglio (5 cariche).Puoi inoltre usare un’azione per lanciare tramite il bastone l’incantesimo passare senza tracce senza spendere cariche. Forma d’Albero Puoi usare un’azione per piantare un’estremità del bastone su terreno fertile e spendere 1 carica per trasformare il bastone in un albero vigoroso. L’albero è alto 18 metri, con un tronco di 1,5 metri di diametro; in cima i suoi rami si estendono per 6 metri. L’albero sembra un albero normale ma irradia una debole aura di magia di trasmutazione, qualora sia bersaglio dell’incantesimo individuazione del magico. Mentre sei in contatto con l’albero e usi un’altra azione per pronunciarne la parola di comando, riporti il bastone alla sua forma normale. Qualsiasi creatura sull’albero, cade quando questo si ritrasforma in bastone."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bastone-dei-boschi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bastone-dei-tuoni-e-fulmini",
    "name": "Bastone Dei Tuoni E Fulmini",
    "equipment_category": {
      "index": "staff",
      "name": "Bastone",
      "url": "/api/2014/equipment-categories/staff"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Il bastone può essere impugnato come un bastone da combattimento magico che conferisce un bonus di +2 ai tiri per colpire e danno effettuati con esso. Inoltre ha le seguenti proprietà. Quando viene usata una di queste proprietà, non se ne potrà più far uso fino all’alba successiva. Fulmine Quando colpisci con un attacco in mischia usando il bastone, puoi far sì che il bersaglio subisca 2d6 danni da fulmine aggiuntivi. Quando colpisci con un attacco in mischia usando il bastone, puoi far sì che il bastone emetta il suono di un tuono, udibile fino a 90 metri di distanza. Il bersaglio colpito deve superare un tiro salvezza di Costituzione con CD 17 o restare stordito fino al termine del tuo prossimo turno. Colpo del Fulmine Puoi usare un’azione per far sì che una fulmine balzi dalla punta del bastone in una linea larga 1,5 metri e lunga 36 metri. Ogni creatura sulla linea deve effettuare un tiro salvezza di Destrezza con CD 17, subendo 9d6 danni da fulmine se lo fallisce, o la metà di questi danni se lo supera. Rombo di Tuono Puoi usare un’azione per far sì che il bastone produca un rombo di tuono assordante, udibile fino a 180 metri di distanza. Ogni creatura entro 18 metri da te (te escluso) deve effettuare un tiro salvezza di Costituzione con CD 17. Se fallisce il tiro salvezza, la creatura subisce 2d6 danni da tuono e resta assordata per 1 minuto. Se supera il tiro salvezza, subisce la metà dei danni e non è assordata. Tuono e Fulmine Puoi usare un’azione per usare le proprietà Colpo Fulminante e Rombo di Tuono assieme. Farlo non consuma l’uso giornaliero di quelle proprietà, ma solo l’uso di questa."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bastone-dei-tuoni-e-fulmini",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bastone-del-colpo-possente",
    "name": "Bastone Del Colpo Possente",
    "equipment_category": {
      "index": "staff",
      "name": "Bastone",
      "url": "/api/2014/equipment-categories/staff"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo bastone può essere impugnato come un bastone da combattimento magico che conferisce un bonus di +3 ai tiri per colpire e di danno effettuati con esso.Quando colpisci con un attacco da mischia facendo uso del bastone, puoi spendere fino a 3 delle sue cariche. Per ogni carica spesa, il bersaglio subisce 1d6 danni da forza aggiuntivi.Il bastone ha 10 cariche, e recupera 1d6 + 4 cariche spese ogni giorno all’alba. Se spendi l’ultima carica, tira un d20. Se ottieni 1, il bastone diventa un bastone da combattimento normale."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bastone-del-colpo-possente",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bastone-del-deperimento",
    "name": "Bastone Del Deperimento",
    "equipment_category": {
      "index": "staff",
      "name": "Bastone",
      "url": "/api/2014/equipment-categories/staff"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Il bastone può essere impugnato come un bastone da combattimento magico. Se colpisci, infligge danni come un normale bastone da combattimento, e puoi spendere 1 carica per infliggere 2d10 danni necrotici aggiuntivi al bersaglio.Inoltre, il bersaglio deve superare un tiro salvezza di Costituzione con CD 15 o avere svantaggio per 1 ora a qualsiasi prova di caratteristica o tiro salvezza che richieda Forza o Costituzione.Questo bastone ha 3 cariche e recupera 1d3 cariche spese ogni mattina all’alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bastone-del-deperimento",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bastone-del-fuoco",
    "name": "Bastone Del Fuoco",
    "equipment_category": {
      "index": "staff",
      "name": "Bastone",
      "url": "/api/2014/equipment-categories/staff"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questo bastone, hai resistenza al danno da fuoco.Inoltre, puoi usare un’azione per spendere 1 o più delle sue cariche per lanciare tramite esso uno dei seguenti incantesimi, utilizzando la tua CD dei tiri salvezza degli incantesimi: mani brucianti (1 carica), muro di fuoco (4 cariche) o palla di fuoco (3 cariche).Il bastone ha 10 cariche, e recupera 1d6 + 4 cariche spese ogni giorno all’alba. Se spendi l’ultima carica del bastone, tira un d20. Se il risultato è 1, il bastone si annerisce, si trasforma in cenere, ed è distrutto."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bastone-del-fuoco",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bastone-del-gelo",
    "name": "Bastone Del Gelo",
    "equipment_category": {
      "index": "staff",
      "name": "Bastone",
      "url": "/api/2014/equipment-categories/staff"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questo bastone, hai resistenza ai danni da freddo.Inoltre, puoi usare un’azione per spendere 1 o più delle sue cariche per lanciare tramite esso uno dei seguenti incantesimi, utilizzando la tua CD dei tiri salvezza degli incantesimi: cono di freddo (5 cariche), muro di ghiaccio (4 cariche), nube di nebbia (1 carica) o tempesta di ghiaccio (4 cariche).Il bastone ha 10 cariche, e recupera 1d6 + 4 cariche spese ogni giorno all’alba. Se spendi l’ultima carica del bastone, tira un d20. Se il risultato è 1, il bastone si trasforma in acqua ed è distrutto."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bastone-del-gelo",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bastone-del-pitone",
    "name": "Bastone Del Pitone",
    "equipment_category": {
      "index": "staff",
      "name": "Bastone",
      "url": "/api/2014/equipment-categories/staff"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Puoi usare un’azione per pronunciare la parola di comando del bastone e scagliarlo sul terreno fino a 3 metri di distanza. Il bastone diventa un serpente costrittore gigante sotto il tuo controllo e agisce al proprio conteggio di iniziativa. Utilizzando un’azione bonus per pronunciare di nuovo la parola di comando, riporti il bastone alla sua forma normale nello spazio precedente mente occupato dal serpente. Durante il tuo turno puoi impartire ordini mentali al serpente finché si trova entro 18 metri da te e non sei inabile. Decidi tu quali azioni effettuerà il serpente e dove si muoverà durante il suo prossimo turno, oppure puoi impartirgli un comando generico, come quello di attaccare i tuoi nemici o difendere un luogo. Se il serpente viene ridotto a 0 punti ferita, muore e ritorna alla sua forma di bastone. Poi, il bastone si frantuma ed è distrutto. Se il serpente si ritrasforma in forma di bastone prima di perdere tutti i suoi punti ferita, recupera tutti quelli persi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bastone-del-pitone",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bastone-del-potere",
    "name": "Bastone Del Potere",
    "equipment_category": {
      "index": "staff",
      "name": "Bastone",
      "url": "/api/2014/equipment-categories/staff"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo bastone può essere impugnato come un bastone da combattimento magico che conferisce un bonus di +2 ai tiriper colpire e danno effettuati con esso. Mentre lo impugni, ricevi un bonus di +2 alla Classe Armatura, ai tiri salvezza, eai tiri per colpire con incantesimi. Questo bastone ha 20 cariche per le seguenti proprietà. Recupera 2d8 + 4 cariche spese ogni giorno all’alba. Se spendi l’ultima carica del bastone, tira un d20. Se il risultato è 1, il bastone mantiene il suo bonus di +2 ai tiri per colpire e danno ma perde tutte le altre proprietà. Se il risultato è 20, il bastone recupera 1d8 + 2 cariche. Colpo Poderoso Quando colpisci con un attacco in mischia usando questo bastone, puoi spendere 1 carica per infliggere 1d6 danni da forza aggiuntivi al bersaglio. Incantesimi Mentre impugni questo bastone, puoi usare un’azione per spendere 1 o più delle sue cariche per lanciare tramite esso uno dei seguenti incantesimi, utilizzando la tua CD del tiro salvezza degli incantesimi e la tua abilità da incantatore: blocca mostri (5 cariche), cono di freddo (5 cariche), globo di invulnerabilità (6 cariche), levitazione (2 cariche), muro di forza (5 cariche), palla di fuoco (versione di 5° livello, 5 cariche), dardo incantato (1 carica), raggio di indebolimento (1 carica) o fulmine (versione di 5° livello, 5 cariche). Colpo del Castigo Puoi usare un’azione per spezzare il bastone sul tuo ginocchio o contro una superficie solida, eseguendo un colpo di vendetta. Il bastone viene distrutto e libera la sua magia rimanente in un’esplosione che si espande fino a riempire una sfera di 9 metri di raggio centrata su di esso. Hai il 50% di probabilità di viaggiare istantaneamente in un piano di esistenza a caso, evitando così l’esplosione. Se non riesci a evitare l’effetto, subisci danni da forza pari a 16 x ilnumero di cariche ne l bastone. Ogni altra creatura nell’area deve effettuare un tiro salvezza di Destrezza con CD 17. Se il tiro salvezza fallisce, la creatura subisce un ammontare di danno basato sulla distanza dal punto di origine dell’esplosione, come mostrato sulla tabella seguente. Se il tiro salvezza riesce, la creatura subisce la metà di questi danni."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bastone-del-potere",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bastone-della-guarigione",
    "name": "Bastone Della Guarigione",
    "equipment_category": {
      "index": "staff",
      "name": "Bastone",
      "url": "/api/2014/equipment-categories/staff"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre lo impugni, puoi usare un’azione per spendere 1 o più delle sue cariche per lanciare tramite esso uno dei seguenti incantesimi, utilizzando la tua CD del tiro salvezza degli incantesimi e il tuo modificatore di abilità da incantatore: cura ferite (1 carica per livello dell’incantesimo, fino al 4°), ristorare inferiore (2 cariche), o cura ferite di massa (5 cariche).Questo bastone ha 10 cariche, e recupera 1d6 + 4 cariche spese ogni giorno all’alba. Se spendi l’ultima carica del bastone, tira un d20. Se il risultato è 1, il bastone svanisce in un lampo di luce, perso per sempre."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bastone-della-guarigione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bastone-dello-charme",
    "name": "Bastone Dello Charme",
    "equipment_category": {
      "index": "staff",
      "name": "Bastone",
      "url": "/api/2014/equipment-categories/staff"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questo bastone, puoi usare un’azione per spendere 1 carica per lanciare tramite esso charme su persone, comando o comprendere linguaggi, utilizzando la tua CD dei tiri salvezza degli incantesimi. Il bastone può essere usato come bastone da combattimento magico.Se stai impugnando il bastone e fallisci un tiro salvezza contro un incantesimo di ammaliamento che prende come bersaglio solo te e non un’area, puoi trasformare il tiro salvezza fallito in un successo. Non potrai più usare questa proprietà del bastone fino all’alba del giorno successivo.Se riesci in un tiro salvezza contro un incantesimo di ammaliamento che prende come bersaglio solo te, con o senza l’intervento del bastone, puoi usare la tua reazione per spendere 1 carica dal bastone e rivolgere l’incantesimo contro chi lo ha lanciato, come se l’incantesimo fosse stato lanciato da te.Il bastone ha 10 cariche, e recupera 1d8 + 2 cariche spese ogni giorno all’alba. Se spendi l’ultima carica, tira un d20. Se ottieni 1, il bastone diventa un bastone da combattimento normale."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bastone-dello-charme",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bastone-dello-sciame-di-insetti",
    "name": "Bastone Dello Sciame Di Insetti",
    "equipment_category": {
      "index": "staff",
      "name": "Bastone",
      "url": "/api/2014/equipment-categories/staff"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Bastone, raro (richiede sintonia da parte di un bardo, chierico, druido, mago, stregone o warlock)Questo bastone ha 10 cariche che puoi impiegare per usare le proprietà sotto descritte e recupera 1d6 + 4 cariche spese ogni giorno all’alba. Se spendi l’ultima carica del bastone, tira un d20. Se il risultato è 1, uno sciame di insetti consuma e distrugge il bastone, e poi si disperde. Incantesimi Mentre impugni questo bastone, puoi usare un’azione per spendere le sue cariche ed lanciare uno dei seguenti incantesimi, utilizzando la tua CD del tiro salvezza degli incantesimi: insetto gigante (4 cariche) o piaga degli insetti (5 cariche). Nube di Insetti Mentre impugni questo bastone, puoi usare un’azione e spendere 1 carica per fa sì che uno sciame di insetti innocui si diffonda in un raggio di 9 metri intorno a te. Gli insetti rimangono per 10 minuti, rendendo l’area oscurata pesantemente per tutti tranne te. Lo sciame si muove assieme a te, rimanendo centrato su di te. Un vento di almeno 15 chilometri all’ora disperde lo sciame e termina l’effetto."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bastone-dello-sciame-di-insetti",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "borsa-dei-fagioli-magici",
    "name": "Borsa Dei Fagioli Magici",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "All’interno di questa borsa si trovano 3d4 fagioli secchi. La borsa pesa 250 grammi più 125 grammi per ogni fagiolo che contiene.Se riversi il contenuto della borsa sul terreno, i fagioli esplodono in un raggio di 3 metri. Ogni creatura nell’area, te compreso, deve effettuare un tiro salvezza di Destrezza con CD 15, subendo 5d4 danni da fuoco se lo fallisce, o la metà di questi danni se lo supera. Il fuoco incendia gli oggetti infiammabili nell’area che non siano indossati o trasportati.Se rimuovi il fagiolo dalla borsa, lo pianti nel terreno o la sabbia, e lo innaffi, il fagiolo produrrà un effetto 1 minuto dopo, a partire dal punto del terreno in cui è stato piantato. Il GM sceglie l’effetto o lo determina casualmente."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/borsa-dei-fagioli-magici",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "borsa-dei-trucchi",
    "name": "Borsa Dei Trucchi",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa borsa dall’aspetto normale appare vuota. Allungare la mano all’interno della borsa, tuttavia, rivela la presenza di un piccolo oggetto peloso. La borsa pesa 250 grammi.Puoi usare un’azione per estrarre l’oggetto peloso dalla borsa e scagliarlo fino a 6 metri di distanza. Quando l’oggetto atterra, si trasforma in una creatura determinata dal lancio di un d8 e consultando la tabella che corrisponde al colore della borsa. Vedi l’elenco dei mostri per le statistiche della creatura. La creatura svanisce all’alba successiva o quando viene ridotta a 0 punti ferita.La creatura è amichevole verso di te e i tuoi compagni, e agisce durante il tuo turno. Puoi usare un’azione bonus per ordinare alla creatura di muoversi e quale azione debba effettuare durante il suo prossimo turno, o darle ordini generici, come quello di attaccare i tuoi nemici. In assenza di simili ordini, la creatura agisce in maniera appropriata alla sua natura e resterà per 10 minuti prima di svanire.Una volta che tre oggetti pelosi sono stati estratti dalla borsa, questa non potrà più essere usata fino alla prossima alba. Borsa dei Trucchi Grigia Borsa dei Trucchi Ruggine Borsa dei Trucchi Marrone"
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/borsa-dei-trucchi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "borsa-divorante",
    "name": "Borsa Divorante",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "La borsa appare come una borsa conservante. Se la borsa viene rivolta le sue proprietà smettono di funzionare.La creatura extradimensionale attaccata alla borsa può percepire qualsiasi cosa vi venga posto all’interno. La materia animale o vegetale posta interamente dentro la borsa viene divorata ed è persa per sempre. Quando una parte di una creatura vivente viene posta nella borsa, c’è una probabilità del 50% che la creatura venga trascinata dentro la borsa. Una creatura all’interno della borsa può usare un’azione per cercare di fuggirne superando una prova di Forza con CD 15. Un’altra creatura può usare un’azione per afferrare la creatura all’interno della borsa e tirarla fuori, superando una prova di Forza con CD 20 (e sempre che non venga a sua volta trascinata dentro la borsa). Qualsiasi creatura che inizi il proprio turno all’interno della borsa viene divorata, il suo corpo distrutto.All’interno della borsa possono essere posti oggetti inanimati, fino a 27 dm3 di materiale. Tuttavia, una volta al giorno, la borsa inghiotte qualsiasi oggetto posto al suo interno e lo risputa fuori in un altro piano di esistenza. Il GM determina il momento e il piano.Se la borsa venisse fatta a pezzi o strappata, è distrutta, e qualsiasi cosa contenga verrebbe trasportata in un luogo casuale del Piano Astrale."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/borsa-divorante",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "bottiglia-del-fumo-perenne",
    "name": "Bottiglia Del Fumo Perenne",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Dalla bocca di questa bottiglia di ottone fuoriesce continuamente del fumo, trattenuto dal suo tappo di piombo. La bottiglia pesa 500 grammi. Quando usi un’azione per rimuovere il tappo, una nube di denso fumo si sparge in un raggio di 18 metri intorno alla bottiglia. L’area della nube è oscurata pesantemente. Per ciascun minuto in cui la bottiglia resta aperta e all’interno della nube, il raggio aumenta di 3 metri finché non raggiunge il raggio massimo di 36 metri.La nube persiste fino a quando la bottiglia resta aperta. Chiudere la bottiglia richiede che tu pronunci la sua parola di comando con un’azione. Una volta chiusa la bottiglia, la nube si disperde dopo 10 minuti. Un vento moderato (dai 15 ai 30 km/h) può disperdere il fumo in 1 minuto, e un vento forte (più di 30 km/h) può disperderlo in 1 round."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/bottiglia-del-fumo-perenne",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "buco-portatile",
    "name": "Buco Portatile",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo elegante tessuto nero, soffice come la seta, si piega fino alle dimensioni di un fazzoletto. Si dispiega in uno strato circolare di 1,8 metri di diametro.Puoi usare un’azione per dispiegare un buco portatile e piazzarlo sopra o contro una superficie solida, sulla quale il buco portatile crea un foro extradimensionale profondo 3 metri. Lo spazio cilindrico all’interno del foro si trova su di un piano diverso, e quindi non può essere usato per aprire dei passaggi. Qualsiasi creatura all’interno di un buco portatile aperto può uscirne fuori arrampicandosi fuori di esso.Puoi usare un’azione per chiudere un buco portatile prendendo i margini del tessuto e ripiegandolo. Piegare il tessuto chiude il buco, e qualsiasi creatura od oggetto al suo interno rimane nello spazio extradimensionale. Non importa quello che contiene, il buco non pesa nulla.Se il buco viene ripiegato, una creatura all’interno dello spazio dimensionale del buco può usare un’azione per effettuare una prova di Forza con CD 10. Se la prova riesce, la creatura riesce a liberarsi e ricompare entro 1,5 metri dal buco portatile o della creatura che lo trasporta. Una creatura che respira può sopravvivere all’interno di un buco portatile chiuso per un massimo di 10 minuti, dopodiché iniziare a soffocare.Piazzare un buco portatile all’interno dello spazio extradimensionale creato da una borsa conservante, uno zainetto pratico o simile oggetto distrugge istantaneamente entrambi gli oggetti e apre un portale verso il Piano Astrale. Il portale origina dal punto in cui un oggetto è stato piazzato all’interno dell’altro. Qualsiasi creatura entro 3 metri dal portale viene risucchiata al suo interno e depositata in un luogo casuale del Piano Astrale. Poi il portale si chiude. Il portale è a senso unico e non può essere riaperto."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/buco-portatile",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "campana-dellapertura",
    "name": "Campana Dellapertura",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo tubo metallico cavo misura circa 30 centimetri di lunghezza e pesa 0,5 chili. Puoi batterlo con un’azione, puntandolo verso un oggetto entro 36 metri che può essere aperto, come una porta o una serratura. La campana emette un suono limpido, e una serratura o laccio dell’oggetto si apre a meno che il suono sia impedito dal raggiungere l’oggetto. Se non rimangono serrature o lacci da aprire, l’oggetto si apre da sé.La campana può essere usato dieci volte. Dopo la decima, si spacca e diventa inutilizzabile."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/campana-dellapertura",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "cappello-del-camuffamento",
    "name": "Cappello Del Camuffamento",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo cappello, puoi usare un’azione per lanciare a volontà l’incantesimo camuffare sé stesso. L’incantesimo termina quando il cappello viene rimosso."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/cappello-del-camuffamento",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "caraffa-dellacqua-eterna",
    "name": "Caraffa Dellacqua Eterna",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quest’ampolla tappata emette un suono di liquido quando viene smossa, come se contenesse acqua. La brocca pesa 1 chilo.Puoi usare un’azione per rimuovere il tappo e pronunciare una delle tre parole di comando, e a quel punto un ammontare di acqua fresca o acqua salata (a tua scelta) si riverserà fuori dell’ampolla, fino all’inizio del tuo prossimo turno. Scegli una delle opzioni seguenti: “Ruscello” produce 4 litri d’acqua. “Fontana” produce 20 litri d’acqua. “Geyser” produce 150 litri d’acqua che vengono proiettati da un geyser lungo 9 metri e largo 30 centimetri. Con un’azione bonus, mentre impugni la brocca, puoi prendere come bersaglio del geyser una creatura visibile entro 9 metri da te. Il bersaglio deve superare un tiro salvezza di Forza con CD 13 o subire 1d4 danni contundenti e cadere prono. Invece di una creatura, puoi prendere come bersaglio un oggetto che non sia indossato o trasportato e che non pesi più di 100 chili. L’oggetto viene ribaltato o spinto 4,5 metri lontano da te."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/caraffa-dellacqua-eterna",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "cintura-nanica",
    "name": "Cintura Nanica",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa cinta, ottieni i seguenti benefici: Il tuo punteggio di Costituzione aumenta di 2, fino a un massimo di 20. Hai vantaggio alle prove di Carisma (Persuasione) effettuate per interagire con i nani. Inoltre, mentre sei in sintonia con la cinta, hai il 50% di probabilità ogni giorno all’alba di vederti spuntare una folta barba, se può crescerti, oppure di vedere la tua ancora più folta, se già la hai.Se non sei un nano, ottieni i seguenti benefici aggiuntivi quando indossi questa cinta: Hai vantaggio ai tiri salvezza contro veleno e hai resistenza ai danni da veleno. Hai scurovisione con una gittata di 18 metri. Puoi parlare, leggere e scrivere in Nanico."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/cintura-nanica",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "colla-meravigliosa",
    "name": "Colla Meravigliosa",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa sostanza bianco lattea e viscosa può formare un legame adesivo permanente tra qualsiasi due oggetti. Deve essere contenuto in una giara o ampolla che è stata ricoperta all’interno di olio di scivolosità. Quando viene trovata, il suo contenitore ne tiene 1d6 + 1 per 30 grammi.30 grammi di colla possono coprire una superficie quadrata di 30 centimetri di lato. La colla ci mette 1 minuto per fissarsi. Una volta fissata la colla, il legame creato può essere spezzato solo dal solvente universale o l’olio della forma eterea, o tramite l’incantesimo desiderio."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/colla-meravigliosa",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "collana-del-rosario",
    "name": "Collana Del Rosario",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa collana possiede 1d4 + 2 sfere magiche fatte di acquamarina, perla nera o topazio. Possiede anche diverse sfere non magiche. Se una sfera magica venisse rimossa dalla collana, quella sfera perderebbe la sua magia.Esistono sei tipi di sfere magiche. Il GM decide il tipo di ciascuna sfera facente parte della collana. Una collana può avere più di una sfera dello stesso tipo. Per usarla, devi indossare la collana. Ogni sfera contiene un incantesimo che puoi lanciare con un’azione bonus (usando la tua CD del tiro salvezza degli incantesimi se richiede un tiro salvezza). Una volta che l’incantesimo di una sfera magica è stato lanciato, non potrai usare di nuovo quella sfera fino all’alba successiva."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/collana-del-rosario",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "collana-delladattamento",
    "name": "Collana Delladattamento",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa collana, puoi respirare normalmente in qualsiasi ambiente, e hai vantaggio ai tiri salvezza effettuati contro gas e vapori nocivi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/collana-delladattamento",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "collana-delle-palle-di-fuoco",
    "name": "Collana Delle Palle Di Fuoco",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Da questa collana pendono 1d6 + 3 sfere. Puoi usare un’azione per stacca re una sfera e lanciarla fino a 18 metri di distanza. Quando essa raggiunge il termine della sua traiettoria, la sfera detona come un incantesimo palla di fuoco di 3° livello (CD del tiro salvezza 15). Puoi lanciare più sfere, o anche l’intera collana, con un’azione. Quando lo fai, aumenta il livello della palla di fuoco di 1 per ogni sfera lanciata oltre la prima."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/collana-delle-palle-di-fuoco",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "corazza-di-scaglie-di-drago",
    "name": "Corazza Di Scaglie Di Drago",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "L’armatura di scaglie di drago è fatta con le scaglie di una specie di drago.Mentre la indossi, ottieni un bonus di +1 alla CA, hai vantaggio ai tiri salvezza contro la Presenza Spaventosa e le armi a soffio dei draghi, e hai resistenza a un tipo di danno determinato dalla specie di drago che ha fornito le scaglie (Argento/freddo, Bianco/freddo, Blu/fulmine, Bronzo/fulmine, Nero/acido, Oro/fuoco, Ottone/fuoco, Rame/acido, Rosso/fuoco, Verde/veleno).Inoltre, con un’azione puoi focalizzare i tuoi sensi per determinare magicamente la distanza e la direzione in cui si trovi il drago più vicino entro 45 chilometri che sia della stessa specie dell’armatura. Quest’azione speciale non può essere più usata fino alla prossima alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/corazza-di-scaglie-di-drago",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "corda-intralciante",
    "name": "Corda Intralciante",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa corda è lunga 9 metri e pesa 1,5 chili. Se tieni un’estremità della corda e usi un’azione per pronunciare la sua parola di comando, l’altra estremità scatterà in avanti per impigliare una creatura visibile entro 6 metri da te. Il bersaglio deve superare un tiro salvezza di Destrezza con CD 15 o restare intralciato.Puoi rilasciare la creatura usando un’azione bonus per pronunciare una seconda parola di comando. Un bersaglio intralciato dalla corda può usare un’azione per effettuare una prova di Forza o Destrezza con CD 15 (a scelta del bersaglio). Se la supera, la creatura non è più intralciata dalla corda.La corda ha CA 20 e 20 punti ferita. Recupera 1 punto ferita ogni 5 minuti finché ha almeno 1 punto ferita. se la corda scende a 0 punti ferita, è distrutta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/corda-intralciante",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "corda-per-scalare",
    "name": "Corda Per Scalare",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa corda di seta lunga 18 metri, pesa 1,5 chili e può sostenere fino a 1.500 chili. Se impugni un’estremità della corda e usi un’azione per pronunciare la parola di comando, la corda si anima. Con un’azione bonus, puoi comandare all’altra estremità di muoversi verso una destinazione di tua scelta. Quell’estremità si muove di 3 metri durante il tuo turno quando riceve il tuo primo comando, e di 3 metri durante ciascun turno successivo finché non raggiunge la sua destinazione, fino alla sua lunghezza massima, o finché non le dici di fermarsi. Puoi anche dire alla corda di stringersi o sganciarsi da un oggetto, annodarsi o snodarsi, o riavvolgersi per essere trasportata.Se dici alla corda di compiere un nodo, grossi nodi compariranno a intervalli di 30 centimetri lungo la corda. Mentre è annodata, la corda diminuisce fino a un lunghezza di 15 metri e conferisce vantaggio alle prove effettuate per arrampicarvisi.La corda ha CA 20 e 20 punti ferita. Recupera 1 punto ferita ogni 5 minuti finché ha almeno 1 punto ferita. Se la corda scende a 0 punti ferita, è distrutta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/corda-per-scalare",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "corno-della-distruzione",
    "name": "Corno Della Distruzione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Puoi usare un’azione per pronunciare la parola di comando del corno e poi suonarlo, emettendo uno scoppio tonante in un cono di 9 metri e udibile fino a 180 metri di distanza. Ogni creatura all’interno del cono deve effettuare un tiro salvezza di Costituzione con CD 15. Se il tiro salvezza fallisce, la creatura subisce 5d6 danni da tuono e resta assordata per 1 minuto. Se il tiro salvezza riesce, la creatura subisce la metà dei danni e non è assordata. Le creature e gli oggetti fatti di vetro o cristallo hanno svantaggio al tiro salvezza e subiscono 10d6 danni da tuono anziché 5d6.Ogni uso della magia del corno ha il 20% di probabilità di farlo esplodere. L’esplosione infligge 10d6 danni da fuoco a chi lo suona e distrugge il corno."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/corno-della-distruzione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "cubo-di-forza",
    "name": "Cubo Di Forza",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo cubo ha 2,5 centimetri di spigolo. Ogni faccia ha un marchio unico che può essere premuto. Il cubo inizia con 36 cariche, e recupera 1d20 cariche spese ogni giorno all’alba. Puoi usare un’azione per premere una delle facce del cubo, spendendo un numero di cariche basate sulla faccia del cubo, come mostrato sulla tabella Facce del Cubo di Forza. Ogni faccia ha un effetto diverso. Se al cubo non rimangono più cariche, non succede nulla. Altrimenti, si erge una barriera di forza invisibile, che forma un cubo di 4,5 metri di spigolo. La barriera è centrata su di te, si muove con te, e dura per 1 minuto, fino a che non usi un’azione per premere la sesta faccia del cubo, o il cubo esaurisce le cariche. Puoi cambiare l’effetto della barriera premendo una faccia diversa del cubo e spendendo il numero di cariche richiesto, resettandone la durata. Se il tuo movimento fa sì che la barriera entri a contatto con un oggetto solido che non può attraversare il cubo, finché rimane la barriera non potrai avvicinarti all’oggetto. Le facce del cubo di forza Il cubo perde cariche quando la barriera viene presa come bersaglio da certi incantesimi o entra a contatto con certi incantesimi o effetti di oggetti magici, come indicato nella tabella seguente."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/cubo-di-forza",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "diadema-incandescente",
    "name": "Diadema Incandescente",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo cerchietto, puoi usare un’azione per lanciare tramite esso l’incantesimo raggio rovente. Quando effettui gli attacchi dell’incantesimo, puoi farlo con bonus di attacco +5. Il cerchietto non potrà essere usato di nuovo a questo modo fino alla prossima alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/diadema-incandescente",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "difensiva",
    "name": "Difensiva",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Leggendaria"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ottieni un bonus di +3 ai tiri per colpire e danno effettuati con quest’arma magica. La prima volta che attacchi con questa spada durante un tuo turno, puoi trasferire parte o tutto il suo bonus alla tua Classe Armatura, invece di usare il bonus sugli attacchi di questo tur no. Il bonus così modificato rimane efficace fino all’inizio del tuo prossimo turno, ma dovrai impugnare la spada per ottenere il bonus alla CA da parte sua."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/difensiva",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "elmo-del-teletrasporto",
    "name": "Elmo Del Teletrasporto",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo elmo, puoi usare un’azione e spendere 1 carica per lanciare l’incantesimo teletrasporto tramite esso. L’elmo ha 3 cariche, e ne recupera 1d3 ogni mattina all’alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/elmo-del-teletrasporto",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "elmo-della-comprensione-dei-linguaggi",
    "name": "Elmo Della Comprensione Dei Linguaggi",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo elmo, puoi usare un’azione per lanciare a volontà tramite esso l’incantesimo comprendere linguaggi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/elmo-della-comprensione-dei-linguaggi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "elmo-della-luminosita",
    "name": "Elmo Della Luminosita",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo elmo luminoso è incastonato con 1d10 diamanti, 2d10 rubini, 3d10 opali di fuoco e 4d10 opali. Qualsiasi gemma estratta dall’elmo si riduce in polvere. Quando tutte le gemme sono rimosse o distrutte, l’elmo perde la sua magia.Mentre lo indossi ottieni i seguenti benefici: Puoi usare un’azione per lanciare uno dei seguenti incantesimi (CD del tiro salvezza 18), usando una delle gemme dell’elmo del tipo specificato come componente: luce diurna (opale), muro di fuoco (rubino), palla di fuoco (opale di fuoco) o spruzzo prismatico (diamante). Quando l’incantesimo viene lanciato la gemma è distrutta e scompare dall’elmo. Finché possiede almeno un diamante, l’elmo emette luce fioca in un raggio di 9 metri quando almeno un non morto si trova entro quest’area. Qualsiasi non morto che inizi il suo turno all’interno dell’area subisce 1d6 danni radiosi. Finché l’elmo possiede almeno un rubino, hai resistenza ai danni da fuoco. Finché l’elmo possiede almeno un opale di fuoco, puoi usare un’azione e pronunciare una parola di comando per far sì che un’arma che stai impugnando venga avvolta dalle fiamme. Le fiamme emettono luce intensa in un raggio di 3 metri e luce fioca per ulteriori 3 metri. Le fiamme sono innocue per te e per l’arma. Quando colpisci con un attacco sferrato con l’arma infiammata, il bersaglio subisce 1d6 danni da fuoco aggiuntivi. Le fiamme perdurano fino a quando non userai un’azione bonus per pronunciare la parola di comando di nuovo o fino a quando non lascerai cadere o rinfodererai l’arma. Se stai indossando l’elmo e subisci danni da fuoco in seguito al fallimento di un tiro salvezza contro un incantesimo, tira un d20. Se il risultato è 1, l’elmo emette un fascio di luce tramite le gemme rimanenti. Ogni creatura entro 18 metri dall’elmo, a parte te, deve superare un tiro salvezza di Destrezza con CD 17 o venire colpita dal fascio, subendo danni radianti uguali al numero di gemme nell’elmo. Poi, le gemme e l’elmo vengono distrutti."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/elmo-della-luminosita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "elmo-della-telepatia",
    "name": "Elmo Della Telepatia",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Necessaria"
    ],
    "requires_attunement": false,
    "url": "/api/2014/magic-items/elmo-della-telepatia",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "faretra-di-ehlonna",
    "name": "Faretra Di Ehlonna",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ciascuno dei tre compartimenti della faretra è collegato a uno spazio extradimensionale che le permetta di trasportare numerosi oggetti non pesando mai più di 1 chilo. Il compartimento più piccolo può contenere fino a 60 frecce, saette od oggetti simili. Il compartimento mediano può contenere fino a 18 giavellotti od oggetti simili. Il compartimento più lungo può contenere fino a 6 oggetti lunghi, come archi, bastoni da combattimento o lance.Puoi estrarre qualsiasi oggetto contenuto nella faretra come se lo stessi prendendo da una normale faretra o fodero."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/faretra-di-ehlonna",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "fasce-metalliche-di-bilarro",
    "name": "Fasce Metalliche Di Bilarro",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa sfera di ferro arrugginita misura 7,5 centimetri di diametro e pesa 500 grammi. Puoi usare un’azione per pronunciare una parola di comando e scagliare la sfera contro una creatura visibile di taglia Enorme o inferiore entro 18 metri da te. La sfera si muove nell’aria, aprendosi in un reticolato di fasce metalliche.Effettua un tiro per colpire a distanza con un bonus di attacco pari al tuo modificatore di Destrezza più il tuo bonus di competenza. Se colpisci, il bersaglio è intralciato fino a quando non effettuerai un’azione bonus per pronunciare una parola di comando e liberarlo. Farlo, o mancare l’attacco, fa sì che le fasce si contraggano e ritornino a essere una sfera.Una creatura, compresa quella intralciata, può usare un’azione per effettuare una prova di Forza con CD 20 per spezzare le fasce di ferro. Se la riesce, l’oggetto viene distrutto, e la creatura intralciata è libera. Se la prova fallisce, qualsiasi ulteriore tentativo effettuato dalla creatura fallisce automaticamente fino a quando non saranno trascorse 24 ore.Una volta che le fasce sono state usate non potranno più esserlo fino alla prossima alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/fasce-metalliche-di-bilarro",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "fascia-dellintelletto",
    "name": "Fascia Dellintelletto",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa fascetta la tua Intelligenza è 19. La fascetta non ha effetto se la tua Intelligenza è già 19 o più alta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/fascia-dellintelletto",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "fermaglio-dello-scudo",
    "name": "Fermaglio Dello Scudo",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa spilla, hai resistenza ai danni da forza, e hai immunità al danno generato dall’incantesimo dardo incantato."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/fermaglio-dello-scudo",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "filtro-damore",
    "name": "Filtro Damore",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Resterai affascinato per 1 ora dalla prima creatura che vedrai entro 10 minuti da quando avrai bevuto questo filtro. Se la creatura è di una specie o genere da cui sei normalmente attratto, finché sei affascinato la considererai il tuo unico e grande amore."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/filtro-damore",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "flauto-dei-topi",
    "name": "Flauto Dei Topi",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Devi essere competente con gli strumenti a fiato per usare questo piffero. Mentre sei in sintonia con questo piffero, i ratti normali e i ratti giganti sono indifferenti nei tuoi confronti e non ti attaccheranno a meno che non li minacci o li danneggi. Se con un’azione suoni il piffero, puoi usare un’azione bonus per spendere da 1 a 3 cariche, richiamando uno sciame di ratti per ogni carica spesa, purché ci siano abbastanza ratti entro 750 metri da te da richiamare in questa maniera (a discrezione del GM). Se non ci sono abbastanza ratti da formare uno sciame, la carica è sprecata. Gli sciami richiamati si muovono verso la musica tramite la rotta più breve possibile, ma non sono in alcun altro modo sotto il tuo controllo. Il piffero ha 3 cariche e recupera 1d3 cariche spese ogni giorno all’alba.Ogni qualvolta uno sciame di ratti che non sia sotto il controllo di un’altra creatura si avvicina entro 9 metri da te mentre stai suonando il piffero, puoi effettuare una prova di Carisma contesa dalla prova di Saggezza dello sciame. Se perdi la contesa, lo sciame si comporta come di norma e non può essere di nuovo distratto dalla musica del piffero per le successive 24 ore. Se vinci la contesa, lo sciame è attratto dalla musica del piffero e diventa amichevole nei confronti tuoi e dei tuoi compagni fino a che continui a suonare il piffero con un’azione ogni round. Uno sciame amichevole obbedisce ai tuoi comandi. Se non impartisci ordini a uno sciame amichevole, questo si difenderà ma non compirà altre azioni.Se uno sciame amichevole all’inizio del turno non può udire la musica del piffero, il tuo controllo su quello sciame termina, e lo sciame si comporta come farebbe normalmente e non può essere attirato nuovamente dalla musica del piffero per le successive 24 ore."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/flauto-dei-topi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "flauto-incantatore",
    "name": "Flauto Incantatore",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Devi essere competente con gli strumenti a fiato per usare questo piffero. Puoi usare un’azione per suonarlo e spendere 1 carica per creare un suono incantevole e spettrale. Ogni creatura entro 9 metri da te e che ti oda suonare deve superare un tiro salvezza di Saggezza con CD 15 o restare spaventata da te per 1 minuto. Se lo desideri, tutte le creature nell’area che non ti siano ostili possono superare automaticamente il loro tiro salvezza. Una creatura che fallisca il tiro salvezza può ripeterlo alla fine del suo turno, terminando l’effetto su di sé in caso lo superi. Una creatura che superi il tiro salvezza è immune all’effetto di questo piffero per 24 ore. Il piffero ha 3 cariche e recupera 1d3 cariche spese ogni giorno all’alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/flauto-incantatore",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "fortezza-istantanea-di-daern",
    "name": "Fortezza Istantanea Di Daern",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Puoi usare un’azione per porre questo cubo di metallo di 2,5 centimetri di spigolo sul terreno e pronunciarne la parola di comando. Il cubo cresce rapidamente fino a diventare una fortezza che resterà fino a quando userai un’azione per pronunciare la parola di comando che la congeda, la quale funziona solo quando la fortezza è vuota.La fortezza è una torre quadrata, 6 metri per lato e alta 9 metri, con feritoie su tutti i lati e spalti in cima. Il suo interno è diviso in due piani, con una scala che corre lungo una parete a congiungerli. La scala termina con una botola che si apre sul tetto. Quando viene attivata, la torre presenta una piccola porta sul lato rivolto verso di te. La porta si apre solo al tuo comando, che puoi pronunciare con un’azione bonus. È immune all’incantesimo scassinare e magie simili, come quella del battaglio dell’apertura.Ogni creatura nell’area in cui la fortezza compare deve effettuare un tiro salvezza di Destrezza con CD 15, subendo 10d10 danni contundenti se lo fallisce, o la metà di questi danni se lo riesce. In entrambi i casi, la creatura viene spinta in uno spazio fuori della fortezza ma in sua prossimità. Gli oggetti nell’area che non sono indossati o trasportati subiscono gli stessi danni e vengono spinti automaticamente.La torre è fatta di adamantio, e la sua magia le impedisce di venir ribaltata. Il tetto, la porta e le mura hanno 100 punti ferita ognuno, immunità ai danni dalle armi non magiche a eccezione delle armi da assedio, e resistenza a tutti gli altri danni. Solo l’incantesimo desiderio può riparare la fortezza (quest’uso dell’incantesimo è considerato come il replicare un incantesimo di 8° livello o inferiore). Ciascun lancio di desiderio fa sì che il tetto, la porta o una delle pareti recuperi 50 punti ferita."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/fortezza-istantanea-di-daern",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "freccia-assassina",
    "name": "Freccia Assassina",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Se una creatura appartenente al tipo, razza o gruppo a cui la freccia dell’uccisione è associata subisce danni dalla freccia, la creatura deve effettuare un tiro salvezza di Costituzione con CD 17, subendo 6d10 danni perforanti aggiuntivi se lo fallisce, o la metà di questi danni se lo riesce.Una volta che la freccia dell’uccisione ha inflitto danni aggiuntivi alla creatura, diventa una freccia non magica."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/freccia-assassina",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "gemma-della-luminosita",
    "name": "Gemma Della Luminosita",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo prisma ha 50 cariche. Mentre lo impugni, puoi usare un’azione per pronunciare una delle tre parole di comando per provocare uno dei seguenti effetti: La prima parola di comando fa sì che la gemma produca una luce intensa nel raggio di 9 metri e luce fioca per ulteriori 9 metri. L’effetto non consuma cariche. Dura finché non userai un’azione bonus per ripetere la parola di comando o finché non impiegherai un’altra funzione della gemma. La seconda parola di comando spende 1 carica e fa sì che la gemma proietti una fascio di luce luminoso contro una creatura visibile entro 18 metri da te. La creatura deve superare un tiro salvezza di Costituzione con CD 15 o restare accecata per 1 minuto. La creatura può ripetere il tiro salvezza al termine di ciascun suo turno, terminando l’effetto su di sé in caso lo superi. La terza parola di comando spende 5 cariche e fa sì che la gemma irradi una luce accecante in un cono di 9 metri originante da te. Ogni creatura all’interno del cono deve effettuare un tiro salvezza come se fosse stata colpita dal fascio creato dalla seconda parola di comando. Quando tutte le cariche della gemma sono state spese, la gemma diventa un comune gioiello del valore di 50 mo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/gemma-della-luminosita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "gemma-elementale",
    "name": "Gemma Elementale",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa gemma contiene una scintilla di energia elementale. Quando usi un’azione per infrangere la gemma, questa evoca un elementale come se tu avessi lanciato l’incantesimo evoca elementali, e la magia della gemma svanisce. Il tipo di gemma determina l’elementale evocato dall’incantesimo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/gemma-elementale",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "giavellotto-del-fulmine",
    "name": "Giavellotto Del Fulmine",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo giavellotto è un’arma magica. Quando lo scagli e pronunci la sua parola di comando, si trasforma in un fulmine, formando una linea larga 1,5 metri che si estende da te verso un bersaglio entro 36 metri. Ogni creatura sulla linea, escluso te e il bersaglio, deve effettuare un tiro salvezza di Destrezza con CD 13, subendo 4d6 danni da fulmine se lo fallisce o la metà di questi danni se lo riesce. Il fulmine ridiventa un giavellotto quando raggiunge il bersaglio. Se lo colpisce, il bersaglio subisce i danni del giavellotto più 4d6 danni da fulmine.La proprietà del giavellotto non può più essere usata fino alla prossima alba. Nel frattempo, il giavellotto può essere comunque usato come arma magica."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/giavellotto-del-fulmine",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "guanti-catturaproiettili",
    "name": "Guanti Catturaproiettili",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questi guanti sembrano quasi fondersi con la tua pelle quando li indossi. Quando un attacco con arma a distanza ti colpisce mentre li indossi, puoi usare la tua reazione per ridurre il danno di 1d10 + il tuo modificatore di Destrezza, purché tu abbia una mano libera. Se riduci il danno a 0, e il proiettile è piccolo a sufficienza da essere tenuto in mano, puoi afferrarlo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/guanti-catturaproiettili",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "guanti-del-nuotare-e-scalare",
    "name": "Guanti Del Nuotare E Scalare",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi queste manopole la tua Forza è 19. Le manopole non hanno effetto se la tua Forza è già 19 o più alta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/guanti-del-nuotare-e-scalare",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "guanti-del-potere-orchesco",
    "name": "Guanti Del Potere Orchesco",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi queste manopole la tua Forza è 19. Le manopole non hanno effetto se la tua Forza è già 19 o più alta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/guanti-del-potere-orchesco",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "incensiere-del-controllo-degli-elementali-dellaria",
    "name": "Incensiere Del Controllo Degli Elementali Dellaria",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre l’incenso brucia all’interno di questo incensiere, puoi usare un’azione per pronunciare la parola di comando del braciere ed evocare un elementale dell’aria, come se avessi lanciato l’incantesimo evoca elementali. L’incensiere non può di nuovo essere usato a questo modo fino alla prossima alba.Questo incensiere largo 15 centimetri e alto 30 centimetri assomiglia a un calice dalla copertura decorata. Pesa 0,5 chili."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/incensiere-del-controllo-degli-elementali-dellaria",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "lama-del-sole",
    "name": "Lama Del Sole",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quest’oggetto sembra l’impugnatura di una spada lunga, ma senza lama. Quando ne afferri l’impugnatura, puoi usare un’azione bonus per far sì che una lama di pura luminescenza si formi, o faccia sparire la lama inserita nell’impugnatura. Finché la spada esiste, questa spada lunga magica ha la proprietà precisione. Se sei competente con le spade corte o le spade lunghe, sei competente anche con la lama del sole.Ottieni un bonus di +2 ai tiri per colpire e danno effettuati con quest’arma, che infligge danni radianti anziché danni taglienti. Quando colpisci con essa una creatura non morta, il bersaglio subisce 1d8 danni radianti aggiuntivi.La lama luminosa della spada emette luce intensa in un raggio di 4,5 metri e luce fioca per ulteriori 4,5 metri. La luce è luce solare. Finché la lama è attiva, puoi usare un’azione per espandere o ridurre il raggio della luce intensa e fioca di 1,5 metri ciascuno, fino a un massimo di 9 metri o un minimo di 3 metri ciascuno."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/lama-del-sole",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "lama-della-fortuna",
    "name": "Lama Della Fortuna",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ottieni un bonus di +1 ai tiri per colpire e danno effettuati con quest’arma magica. Finché hai addosso la spada ricevi anche un bonus di +1 ai tiri salvezza. Fortuna Se hai addosso la spada, puoi affidarti alla sua fortuna (non richiede un’azione) per ripetere un tiro per colpire, prova di caratteristica o tiro salvezza il cui risultato non ti soddisfa. Sei obbligato a usare il secondo risultato del dado. Questa proprietà non può essere usata di nuovo fino alla prossima alba. Desiderio Mentre la impugni, puoi usare un ’azione per spendere 1 carica e lanciare tramite essa l’incantesimo desiderio. Questa proprietà non può essere usata di nuovo fino alla prossima alba. La spada ha 1d4 1 cariche, e perde questa proprietà se finisce le cariche."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/lama-della-fortuna",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "lanterna-della-rivelazione",
    "name": "Lanterna Della Rivelazione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre è accesa, questa lanterna coperta brucia per 6 ore con 1 pinta d’olio, irradiando luce intensa in un raggio di 9 metri e luce fioca per ulteriori 9 metri. Le creature e gli oggetti invisibili sono resi visibili mentre si trovano sotto la luce intensa della lanterna. Puoi usare un’azione per abbassare la copertura, riducendo la luce a fioca con un raggio di 1,5 metri."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/lanterna-della-rivelazione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "lenti-dellaquila",
    "name": "Lenti Dellaquila",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi queste lenti di cristallo davanti agli occhi, hai vantaggio alle prove di Saggezza (Percezione) basate sulla vista. In condizioni di visibilità limpida, puoi distinguere i dettagli anche di creature e oggetti molto distanti delle dimensioni di 50 centimetri."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/lenti-dellaquila",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "lenti-della-visione-dettagliata",
    "name": "Lenti Della Visione Dettagliata",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi queste lenti di cristallo davanti agli occhi, puoi vedere molto meglio del normale fino a una distanza di 30 centimetri. Hai vantaggio alle prove di Intelligenza (Indagare) basate sulla vista mentre perlustri un’area o studi un oggetto a distanza."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/lenti-della-visione-dettagliata",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "lenti-dello-charme",
    "name": "Lenti Dello Charme",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi queste lenti di cristallo davanti agli occhi, puoi spendere 1 carica con un’azione per lanciare l’incantesimo charme su persone (CD del tiro salvezza 13) su di un umanoide entro 9 metri da te, purché tu e il bersaglio vi possiate vedere. Le lenti hanno 3 cariche e recuperano tutte quelle spese ogni giorno all’alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/lenti-dello-charme",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "lingua-di-fiamme",
    "name": "Lingua Di Fiamme",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Puoi usare un’azione bonus per pronunciare la parola di comando di questa spada magica, facendo sì che dalla sua lama eruttino fiamme. Queste fiamme irradiano luce intensa in un raggio di 12 metri e luce fioca per ulteriori 12 metri. Mentre la spada è in fiamme, infligge 2d6 danni da fuoco aggiuntivi a qualsiasi bersaglio colpisca. Le fiamme durano fino a che non usi un’azione bonus per pronunciare di nuovo la parola di comando o finché non lasci cadere o rinfoderi l’arma."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/lingua-di-fiamme",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "manette-dimensionali",
    "name": "Manette Dimensionali",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Puoi usare un’azione per piazzare queste manette su di una creatura inabile. Le manette si adattano a qualsiasi creatura da taglia Piccola a Grande. Oltre a servire da comuni manette, i ceppi impediscono a una creatura legata con essi dall’usare qualsiasi metodo di movimento extradimensionale, compreso il teletrasporto o il viaggio verso piani diversi dell’esistenza. Tuttavia non impediscono a una creatura di attraversare un portale interdimensionale.Tu e qualsiasi creatura da te indicata quando fai uso dei ceppi potete usare un’azione per rimuoverli. Una volta ogni 30 giorni, la creatura legata può effettuare una prova di Forza (Atletica) con CD 30. Se la supera, la creatura si libera e distrugge i ceppi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/manette-dimensionali",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "mantello-del-pipistrello",
    "name": "Mantello Del Pipistrello",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa cappa, hai vantaggio alle prove di Destrezza (Furtività). In aree di luce fioca o oscurità, puoi afferrare i bordi della cappa con entrambe le mani e usarla per muoverti a velocità di volo 12 metri. Se dovessi smettere di tenere i bordi della cappa mentre voli a questo modo, perdi la tua velocità di volo.Mentre indossi la cappa in un’area di luce fioca o oscurità, puoi usare la tua azione per lanciare metamorfosi su di te, trasformandoti in un pipistrello. Quando sei in forma di pipistrello, mantieni i tuoi punteggi di Intelligenza, Saggezza e Carisma. La cappa non può essere impiegata di nuovo in questo modo fino alla prossima alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/mantello-del-pipistrello",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "mantello-dellaracnide",
    "name": "Mantello Dellaracnide",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo elegante abito di seta nera intessuto con fili d’argento, ottieni i seguenti benefici: Hai resistenza ai danni da veleno. Hai velocità di scalata pari alla tua velocità di passeggio. Puoi muoverti verso l’alto, il basso e lungo superfici verticali e a testa in giù sui soffitti, tenendo le mani libere. Non puoi essere catturato da alcuna sorta di ragnatela e ti muovi attraverso le ragnatele come fossero terreno difficile. Puoi usare un’azione per lanciare l’incantesimo ragnatela (CD del tiro salvezza 13). La ragnatela creata dall’incantesimo riempie il doppio della sua normale area. Una volta usata, questa proprietà della cappa non può essere usata di nuovo fino alla prossima alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/mantello-dellaracnide",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "mantello-della-manta",
    "name": "Mantello Della Manta",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa cappa con il cappuccio tirato su, puoi respirare sott’acqua e hai velocità di nuoto 18 metri. Tirare su o giù il cappuccio richiede 1 azione."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/mantello-della-manta",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "mantello-della-resistenza-agli-incantesimi",
    "name": "Mantello Della Resistenza Agli Incantesimi",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa cappa, hai vantaggio ai tiri salvezza contro incantesimi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/mantello-della-resistenza-agli-incantesimi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "mantello-distorcente",
    "name": "Mantello Distorcente",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa cappa, essa proietta un’illusione che ti fa apparire come se stessi in un punto vicino alla tua reale posizione, facendo sì che tutte le creature abbiano svantaggio ai tiri per colpire contro di te. Se subisci danni, la proprietà cessa di funzionare fino all’inizio del tuo prossimo turno. Questa proprietà è soppressa mentre sei inabile, intralciato o altrimenti impossibilitato a muoverti."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/mantello-distorcente",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "mantello-elfico",
    "name": "Mantello Elfico",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa cappa tirando su il cappuccio, le prove di Saggezza (Percezione) effettuate per notarti hanno svantaggio, e hai vantaggio alle prove di Destrezza (Furtività) effettuate per nasconderti. Tirare su o giù il cappuccio richiede un’azione."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/mantello-elfico",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "manuale-dei-golem",
    "name": "Manuale Dei Golem",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo tomo contiene le informazioni e incantamenti necessari a costruire un tipo particolare di golem. Il GM sceglie il tipo di golem che è possibile costruire o lo determina casualmente. Per decifrare e usare il manuale, devi essere un incantatore con almeno due slot incantesimo di 5° livello. Una creatura che non possa usare il manuale dei golem e provi a leggerlo, subisce 6d6 danni psichici. Per creare un golem, devi trascorrere il tempo sopra indicato, lavorando senza interruzione con il manuale a disposizione e riposando per non più di 8 ore al giorno. Devi anche pagare il costo specificato per acquistare i materiali necessari.Una volta finito di creare il golem il libro viene consumato da fiamme arcane. Il golem si anima quando le ceneri delmanuale saranno sparse su di esso. Sarà sotto il tuo controllo, e comprende e obbedisce gli ordini pronunciati da te."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/manuale-dei-golem",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "manuale-dellesercizio-fisico",
    "name": "Manuale Dellesercizio Fisico",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo libro descrive esercizi atletici, e le sue parole sono soffuse di magia. Se trascorri 48 ore in un periodo di 6 giorni o meno a studiare i contenuti del libro e praticarne le indicazioni, il tuo punteggio di Forza aumenta di 2, e così fa il tuo punteggio massimo per quella caratteristica. Poi il manuale perde la sua magia, per recuperarla dopo un secolo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/manuale-dellesercizio-fisico",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "manuale-della-salute",
    "name": "Manuale Della Salute",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo libro contiene suggerimenti salutari e alimentari, e le sue parole sono soffuse di magia. Se trascorri 48 ore in un periodo di 6 giorni o meno a studiare i contenuti del libro e praticarne le indicazioni, il tuo punteggio di Costituzione aumenta di 2, e così fa il tuo punteggio massimo per quella caratteristica. Poi il manuale perde la sua magia, per recuperarla dopo un secolo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/manuale-della-salute",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "manuale-della-velocita-di-azione",
    "name": "Manuale Della Velocita Di Azione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo libro contiene esercizi di coordinazione ed equilibrio, e le sue parole sono soffuse di magia. Se trascorri 48 ore in un periodo di 6 giorni o meno a studiare i contenuti del libro e praticarne le indicazioni, il tuo punteggio di Destrezza aumenta di 2, e così fa il tuo punteggio massimo per quella caratteristica. Poi il manuale perde la sua magia, per recuperarla dopo un secolo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/manuale-della-velocita-di-azione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "mazza-del-terrore",
    "name": "Mazza Del Terrore",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre la impugni, puoi usare un’azione e spendere 1 carica per scatenare un’ondata di terrore. Ogni creatura di tua scelta, in un raggio di 9 metri a partire da te, deve superare un tiro salvezza di Saggezza con CD 15 o restare spaventata da te per 1 minuto. Mentre è spaventata a questo modo, una creatura deve impiegare i suoi turni a cercare di muoversi più lontano possibile da te, e non può consapevolmente muoversi in uno spazio che sia entro 9 metri da te. Inoltre non può effettuare reazioni. Come sua azione, può usare solo l’azione Scattare o cercare di fuggire da un effetto che le impedisca di muoversi. Se non può muoversi da nessuna parte, la creatura può usare l’azione Schivare. Al termine di ciascun suo turno, la creatura può ripetere il tiro salvezza, terminando l’effetto per sé in caso lo superi.Quest’arma magica ha 3 cariche, e recupera 1d3 cariche ogni giorno all’alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/mazza-del-terrore",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "mazza-della-distruzione",
    "name": "Mazza Della Distruzione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando colpisci un immondo o un non morto con quest’arma magica, quella creatura subisce 2d6 danni radianti aggiuntivi. Se, dopo aver subito il danno, al bersaglio rimangono 25 punti ferita o meno, questi deve superare un tiro salvezza di Saggezza con CD 15 o venire distrutto. Se il tiro salvezza riesce, la creatura resta spaventata da te fino al termine del tuo prossimo turno.Mentre impugni quest’arma, essa irradia luce intensa in un raggio di 6 metri e luce fioca per ulteriori 6 metri."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/mazza-della-distruzione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "mazza-della-punizione",
    "name": "Mazza Della Punizione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ottieni un bonus di +1 ai tiri per colpire e danno effettuati con quest’arma magica. Il bonus aumenta a +3 quando usi quest’arma per attaccare un costrutto.Quando ottieni un 20 al tiro per colpire effettuato con quest’arma, il bersaglio subisce 7 danni contundenti aggiuntivi, o 14 danni contundenti aggiuntivi se è un costrutto. Se, dopo aver subito questi danni, a un costrutto restano 25 punti ferita o meno, viene distrutto."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/mazza-della-punizione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "mazzo-delle-illusioni",
    "name": "Mazzo Delle Illusioni",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa scatola contiene un set di carte di pergamena. Un mazzo completo contiene 34 carte, ognuna raffigurante una creatura diversa. Le creature rappresentate vengono lasciate alla discrezionalità del GM. Di solito i mazzi trovati in giro sono privi di 1d20 – 1 carte.La magia del mazzo funziona solo se le carte vengono pescate a caso (potete usare un mazzo di normali carte da gioco modificato per simulare il mazzo delle illusioni). Puoi usare un’azione per pescare una carta dal mazzo e scagliarla in un punto sul terreno a 9 metri da te.L’illusione di una o più creature si forma sopra la carta lanciata e rimane finché non viene dissolta. La creatura illusoria sembra reale, della taglia appropriata, e si comporta come fosse una vera creatura, eccetto che non può recare danni. Finché resti entro 36 metri dalla creatura illusoria e puoi vederla, puoi usare un’azione per muoverla magicamente in qualsiasi punto entro 9 metri dalla carta. Qualsiasi interazione fisica con la creatura illusoria la rivela come illusione, dato che gli oggetti le passano attraverso. Qualcuno che usi un’azione per ispezionare visivamente la creatura, la identifica come illusoria superando una prova di Intelligenza (Indagare) con CD 15. La creatura le apparirà quindi trasparente.L’illusione permane finché la carta non viene mossa o l’illusione dissolta. Quando l’illusione termina, l’immagine sulla carta scompare, e quella carta non potrà più essere usata."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/mazzo-delle-illusioni",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "mazzo-delle-meraviglie",
    "name": "Mazzo Delle Meraviglie",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Leggendaria"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Di solito lo si trova in un borsello o una scatola, che contiene delle carte fatte d’avorio o vello. La maggior parte di questi mazzi (il 75%) ha solo tredici carte, mentre i restanti mazzi ne hanno ventidue.Prima di pescare una carta, devi dichiarare quante carte intendi pescare e poi pescarle casualmente (puoi usare un mazzo di carte da gioco modificato per simulare il mazzo). Qualsiasi carta pescata in eccesso di questo numero non ha effetto. Altrimenti, appena peschi una carta dal mazzo, la sua magia ha effetto. Devi pescare ciascuna carta entro 1 ora dalla pescata precedente. Se non peschi il numero scelto di carte, il numero di carte rimanenti uscirà fuori dal mazzo spontaneamente e avrà effetto in contemporanea.Una volta estratta una carta, questa svanirà dall’esistenza. A meno che la carta non sia il Matto o il Buffone, la carta ricompare nel mazzo, rendendo possibile pescare due volte la stessa carta. * Solo in mazzi da 22 carte Artigli Ogni oggetto magico che indossi o trasporti viene disintegrato. Gli artefatti in tuo possesso non vengono disintegrati, ma svaniscono. Bilancia La tua mente è sconvolta, e cambi allineamento. Il legale diventa caotico, il buono diventa malvagio e viceversa. Se sei neutrale puro o disallineato, questa carta non avrà alcun effetto su di te. Cavaliere Ottieni i servigi di un guerriero di 4° livello che compare in uno spazio a tua scelta entro 9 metri da te. Il guerriero è della tua stessa razza e ti servirà lealmente fino alla morte, credendo che sia stato il fato a portarlo al tuo servizio. Il personaggio è controllato da te. Chiave Un’arma magica rara, molto rara o leggendaria con la quale sei competente compare tra le tue mani. Il GM determina di che tipo di arma si tratta. Cometa Se sconfiggi da solo il prossimo mostro o gruppo ostile che incontrerai, otterrai abbastanza punti esperienza da guadagnare un livello. Altrimenti, questa carta non avrà effetto. Destino La struttura della realtà si dissolve e riforma, permettendoti di evitare o cancellare un evento come se non fosse mai accaduto. Puoi usare la magia di questa carta non appena l’hai pescata o aspettare un qualsiasi altro momento fino alla tua morte. Eurialo Sei maledetto dalla carta e subisci una penalità di -2 a tutti i tiri salvezza finché resterai maledetto a questo modo. Solo un dio o la magia della carta del Fato può porre fine a questa maledizione. Fiamme Un potente diavolo diventa tuo nemico. Il diavolo cercherà di rovinare e infestare la tua esistenza, assaporando le tue sofferenze fino al momento in cui cercherà di ucciderti. Questa inimicizia durerà fino alla morte tua o del diavolo. Davanti ai tuoi piedi compaiono venticinque gioielli del valore di 2.000 mo ciascuno o cinquanta gemme del valore di 1.000 mo ciascuna. Giullare Ottieni 10.000 PE o puoi pescare due carte aggiuntive oltre alle tue pescate dichiarate. Idiota Riduci permanentemente il tuo punteggio di Intelligenza di 1d4 + 1 (fino a un punteggio minimo di 1). Puoi pescare un’ulteriore carta prima delle tue altre pescate dichiarate. Un personaggio non dei giocatori a scelta del GM diventa ostile nei tuoi confronti. L’identità del nuovo nemico è ignota fino a quando il PNG o qualcun altro la rivelerà. Nulla a meno di un desiderio o intervento divino potrà porre fine all’ostilità del PNG nei tuoi confronti confronti. Ricevi la capacità di lanciare l’incantesimo desiderio 1d3 volte. Perdi 10.000 PE, scarti questa carta, e peschi di nuovo dal mazzo, contando entrambe le pescate come solo una delle tue pescate. Se perdere quel numero di PE ti farebbe perdere un livello, rimarrai invece con il numero di PE appena sufficienti per mantenere il tuo livello. Prigione Scompari e vienisepolto in uno stato d i animazione sospesa all’interno di una sfera extra dimensionale. Tutto ciò che stavi indossando o trasportando rimane nello spazio da te occupato quando sei scomparso. Rimarrai imprigionato finché non sarai ritrovato e rimosso dalla sfera. Non puoi essere localizzato tramite nessuna magia di divinazione, ma l’incantesimo desiderio può rivelare la posizione della tua prigione. Non si pescano ulteriori carte. Rovina Perdi tutte le ricchezze che hai con te, a parte gli altri oggetti magici. Attività, edifici e le terre che possiedi vengono perse nel modo che altera di meno la realtà. Qualsiasi documento che provi che tu sia il proprietario di qualcosa che hai perso a causa di questa carta, scompare. Ottieni 50.000 PE, e un oggetto meraviglioso (determinato dal GM) compare tra le tue mani. Stella Aumenta un tuo punteggio di caratteristica di 2. Il punteggio può superare il 20, ma non può superare 24. Teschio Evochi un avatar della morte (uno spettrale scheletro umanoide avvolto in una vestaglia nera e sbrindellata, il quale impugna una falce spettrale). Esso compare in uno spazio a scelta del GM entro 3 metri da te e ti attacca, avvisando tutti gli altri che devi vincere la bat..."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/mazzo-delle-meraviglie",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "medaglione-dei-pensieri",
    "name": "Medaglione Dei Pensieri",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo medaglione, puoi usare un’azione e spendere 1 carica per lanciare tramite esso l’incantesimo individuazione dei pensieri (CD del tiro salvezza 13). Il medaglione ha 3 cariche, e recupera 1d3 cariche spese ogni giorno all’alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/medaglione-dei-pensieri",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "munizione-1-2-o-3",
    "name": "Munizione 1 2 O 3",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Hai un bonus ai tiri per colpire e ai tiri di danno effettuati con questo pezzo di munizione magica. Il bonus è determinato dalla rarità dell’arma. Una volta che colpisce un bersaglio, la munizione perde la sua magia."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/munizione-1-2-o-3",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "occhiali-della-notte",
    "name": "Occhiali Della Notte",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi queste lenti scure, possiedi la scurovisione, con una gittata di 18 metri. Se già possiedi la scurovisione, indossare questi occhiali ne aumenta la gittata di 18 metri."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/occhiali-della-notte",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "occhio-della-notte",
    "name": "Occhio Della Notte",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Creato dalla congrega di megere Vivierna (Notturna), Serania (Marina) e Vagghamur (megera verde), L’Occhio della Notte è un potente oggetto magico composto da un vero occhio umano ricoperto di vernice e incastonato in un pendaglio d’oro. Vivierna lo ha potenziato assieme alle altre due megere Serania (megera marina) e Vagghamur (megera verde). L’occhio è di solito affidato ad un servitore perché lo custodisca e trasporti. Una megera della congrega può effettuare un’azione per vedere quello che riesce a vedere l’occhio della megera, se questo si trova sullo stesso piano di esistenza della megera e comunicare con il possessore telepaticamente per un minuto al giorno, solo a mezzanotte. Ha CA 12, 3 punti ferita, e visione al buio con un raggio di 18 metri. Se viene distrutto, ciascun membro della congrega subisce 3d10 danni psichici ed è accecato per 24 ore. Il possessore può usare un’azione per tentare di provocare Follia ad una creatura (vedi regole avanzate e relative tabelle). Il bersaglio che guarda l’Occhio deve effettuare un tiro salvezza di Intelligenza CD10. Se fallisce il tiro salvezza il bersaglio tira un effetto sulla tabella Follia a Breve Termine. Fallito il primo Tiro Salvezza il possessore può tentare di dare Follia a Lungo Termine usando la precedente modalità ma la con CD 15. Fallito anche il secondo Tiro Salvezza si può tentare di dare Follia Indeterminata al bersaglio, questa volta con CD 20. Il bersaglio che riesce nel Tiro Salvezza è immune alla follia dell’Occhio ﬁno all’alba successiva. Può esistere un solo Occhio della Notte nel Piano Materiale, e il rituale per crearlo richiede una notte intera, e le megere lo svolgono mentre sono accecate. Durante il rituale, se le megere eseguono qualsiasi azione che non sia svolgere il rituale, devono cominciare da capo"
    ],
    "requires_attunement": false,
    "url": "/api/2014/magic-items/occhio-della-notte",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "olio-dellaffilatura",
    "name": "Olio Dellaffilatura",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quest’olio può ricoprire un’arma tagliente o perforante o fino a 5 munizioni taglienti o perforanti. Applicare l’olio richiede 1 minuto. Per 1 ora, l’arma ricoperta dall’olio è magica e ha un bonus di +3 ai tiri per colpire e danno."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/olio-dellaffilatura",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "olio-della-forma-eterea",
    "name": "Olio Della Forma Eterea",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Una dose di olio è sufficiente a ricoprire una creatura di taglia Media o inferiore, e l’equipaggiamento che indossa e trasporta (è necessaria un’ulteriore fiala per ogni categoria di taglia sopra la Media). Applicare l’olio richiede 10 minuti. Dopodiché la creatura ottiene l’effetto dell’incantesimo forma eterea per 1 ora."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/olio-della-forma-eterea",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "olio-della-scivolosita",
    "name": "Olio Della Scivolosita",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "L’olio può coprire una creatura di taglia Media o inferiore, insieme a tutto l’equipaggiamento che indossa o trasporta (è necessaria un’ulteriore fiala per ogni categoria di taglia sopra la Media). Applicare l’olio richiede 10 minuti. La creatura ottiene poi il beneficio dell’incantesimo libertà di movimento per 8 ore.In alternativa, con un’azione si può versare l’olio sul terreno, duplicando per 8 ore l’effetto dell’incantesimo unto su quell’area."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/olio-della-scivolosita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pantofole-del-ragno",
    "name": "Pantofole Del Ragno",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi queste scarpe leggere, puoi muoverti verso l’alto, il basso, e lungo superfici verticali e a testa in giù sul soffitto, lasciando libere le mani. Hai una velocità di scalata pari alla velocità di passeggio. Tuttavia, le pantofole non ti permettono di muoverti a questo modo su superfici scivolose, come quelle coperte da ghiaccio o da olio."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pantofole-del-ragno",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pergamena-magica",
    "name": "Pergamena Magica",
    "equipment_category": {
      "index": "scroll",
      "name": "Pergamena",
      "url": "/api/2014/equipment-categories/scroll"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Una pergamena degli incantesimi riporta le parole di un singolo incantesimo, scritte in un codice mistico. Se l’incantesimo è presente nella lista degli incantesimi della tua classe, puoi impiegare un’azione per leggere la pergamena e lanciare l’incantesimo senza dover fornire nessuno dei componenti dell’incantesimo. Altrimenti, l’incantesimo è incomprensibile.Se l’incantesimo è presente sulla lista degli incantesimi della tua classe, puoi leggere la pergamena e lanciarne l’incantesimo senza dover provvedere alcuna componente materiale. Lanciare l’incantesimo leggendolo da una pergamena richiede il normale tempo di lancio dell’incantesimo. Una volta che l’incantesimo è stato lanciato, le parole sulla pergamena svaniscono, e la pergamena viene ridotta in polvere. Se il lancio viene interrotto, la pergamena non si dissolve.Il livello dell’incantesimo sulla pergamena determina la CD dei tiri salvezza e il bonus di attacco dell’incantesimo, oltre che alla rarità della pergamena, come indicato nella tabella Pergamene degli Incantesimi: Un incantesimo da mago su di una pergamena degli incantesimi può essere ricopiato nel libro degli incantesimi alla stessa maniera degli altri incantesimi. Quando un incantesimo viene ricopiato da una pergamena degli incantesimi, il copiatore deve riuscire una prova di Intelligenza (Arcano) con CD pari a 10 + il livello dell’incantesimo. Se la prova riesce, l’incantesimo viene copiato con successo. Che la prova riesca o fallisca, la pergamena degli incantesimi è distrutta."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pergamena-magica",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "perla-del-potere",
    "name": "Perla Del Potere",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre hai la perla con te, puoi usare un’azione per pronunciare la parola di comando della perla e recuperare uno slot incantesimo speso. Se lo slot incantesimo speso era di 4° livello o più alto, il nuovo slot è di 3° livello. Una volta usata, la perla non potrà essere usata di nuovo fino alla prossima alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/perla-del-potere",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pietra-del-controllo-degli-elementali-della-terra",
    "name": "Pietra Del Controllo Degli Elementali Della Terra",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Se la pietra tocca terra, puoi usare un’azione per pronunciare la parola di comando ed evocare un elementale della terra, come se avessi lanciato l’incantesimo evocare elementali. La pietra non può di nuovo essere usata a questo modo, fino alla prossima alba. La pietra pesa 2,5 chili."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pietra-del-controllo-degli-elementali-della-terra",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pietra-della-buona-fortuna-pietrafortuna",
    "name": "Pietra Della Buona Fortuna Pietrafortuna",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Finché la pietra è con te, ottieni un bonus di +1 alle prove di caratteristica e ai tiri salvezza."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pietra-della-buona-fortuna-pietrafortuna",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pietra-di-ioun",
    "name": "Pietra Di Ioun",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Esistono diversi tipi di pietra arcana, ogni tipo una specifica combinazione di forme e colori.Quando usi un’azione per lanciare una di queste pietre in aria, la pietra inizia a orbitare intorno alla tua testa alla distanza di 1d3 x 30 centimetri e ti conferisce un beneficio. Dopodiché, un’altra creatura dovrà usare un’azione per afferrare o imbrigliare la pietra e separarla da te, riuscendo in un tiro per colpire contro CA 24 o superando una prova di Destrezza (Acrobazia) con CD 24. Puoi usare un’azione per afferrare e mettere da parte la pietra, terminandone l’effetto.Una pietra ha CA 24, 10 punti ferita e resistenza a tutti i danni. Mentre orbita intorno alla tua testa è considerata un oggetto indossato. Agilità (molto raro) Mentre orbita intorno alla tua testa il tuo punteggio di Destrezza aumenta di 2, fino a un massimo di 20. Assorbimento (molto raro) Mentre orbita intorno alla tua testa, puoi usare la tua reazione per cancellare un incantesimo di 4° livello o inferiore lanciato da una creatura visibile e che prende a bersaglio solo te.Una volta che la pietra ha cancellato 20 livelli di incantesimi, si esaurisce e diventa grigia opaca, perdendo la sua magia. Se sei preso a bersaglio da un incantesimo il cui livello è superiore al numero di livelli di incantesimo che rimangono alla pietra, la pietra non può cancellarlo. Autorità (molto raro) Mentre orbita intorno alla tua testa il tuo punteggio di Carisma aumenta di 2, fino a un massimo di 20. Consapevolezza (raro) Mentre orbita intorno alla tua testa non puoi essere sorpreso. Forza (molto raro) Mentre orbita intorno alla tua testa il tuo punteggio di Forza aumenta di 2, fino a un massimo di 20. Intelletto (molto raro) Mentre orbita intorno alla tua testa il tuo punteggio di Intelligenza aumenta di 2, fino a un massimo di 20. Intuizione (molto raro) Mentre orbita intorno alla tua testa il tuo punteggio di Saggezza aumenta di 2, fino a un massimo di 20. Protezione (raro) Mentre orbita intorno alla tua testa ottieni un bonus di +1 alla CA. Sostentamento (raro) Mentre orbita intorno alla tua testa non hai bisogno di mangiare né di bere. Riserva (raro) Accumula gli incantesimi lanciati su di esso, conservandoli fino a quando non ne farai uso. La pietra può contenere fino a 3 livelli di incantesimi alla volta. Quando viene trovata, contiene 1d4 – 1 livelli di incantesimi scelti dal GM.Qualsiasi creatura può lanciare un incantesimo di livello dal 1° al 3° sulla pietra, toccandola mentre l’incantesimo viene lanciato . L’incantesimo non avrà effetto, oltre quello di essere contenuto dalla pietra. Se la pietra non può contenere l’incantesimo, questi sarà sprecato senza produrre effetto. Il livello dello slot usato per lanciare l’incantesimo determina quanto spazio occupi. Mentre la pietra orbita intorno alla tua testa, puoi lanciare qualsiasi incantesimo contenga. L’incantesimo usa il livello dello slot, la CD del tiro salvezza dell’incantesimo, il bonus di attacco dell’incantesimo, e la caratteristica da incantatore dell’incantatore originale, ma per il resto è come se fosse stato lanciato da te. Dopodiché l’incantesimo non è più contenuto all’interno della pietra, liberando spazio. Tempra (molto raro) Mentre orbita intorno alla tua testa il tuo punteggio di Costituzione aumenta di 2, fino a un massimo di 20."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pietra-di-ioun",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pigmenti-meravigliosi-di-nolzur",
    "name": "Pigmenti Meravigliosi Di Nolzur",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Trovati solitamente in 1d4 vasetti all’interno di eleganti scatole di legno assieme a un pennello (del peso totale di 500 grammi), questi pigmenti ti permettono di creare oggetti tridimensionali, dipingendoli a due dimensioni. La pittura fluisce dal pennello per formare l’oggetto desiderato mentre ti concentri sull’immagine.Ogni vasetto di pittura è sufficiente a coprire 90 m2 di una superficie, permettendoti di creare oggetti inanimati e caratteristiche del terreno (porte, fosse, fiori, alberi, celle, stanze o armi) che occupino un totale di 270 m3. Ci vogliono 10 minuti per coprire 90 m2.Quando completi il dipinto, l’oggetto o la caratteristica del terreno dipinta diventa un oggetto reale, non magico. Quindi, dipingere una porta su di una parete crea una vera porta che può essere aperta per accedere a ciò che si trova oltre di essa. Dipingere una fossa sul pavimento crea una vera fossa, la cui profondità è conteggiata nell’area totale degli oggetti che puoi creare.Nulla di ciò che viene creato dai pigmenti può avere un valore superiore ai 25 mo. Se dipingi un oggetto di valore superiore (un diamante o una pila d’oro), l’oggetto sembrerà autentico, ma un attento esame rivelerà che è fatto di gomma, ossa o qualche altro materiale privo di valore.Se dipingi una forma di energia, come fuoco o fulmine, l’energia compare ma si dissipa non appena completi il dipinto, senza recare danni a niente."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pigmenti-meravigliosi-di-nolzur",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "piuma-di-quaal",
    "name": "Piuma Di Quaal",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo minuscolo oggetto assomiglia a una piuma. Esistono diversi tipi di piume arcane, ciascuno dotato di un singolo effetto monouso. Il GM sceglie il tipo di piuma. Albero Devi trovarti all’aperto per poter usare questa piuma arcana. Puoi usare un’azione per appoggiarla a uno spazio non occupato sul terreno. La piuma svanisce e al suo posto spunta un albero di quercia non magico. L’albero è alto 18 metri e ha un tronco di 1,5 metri di diametro. In cima, i suoi rami si estendono per un massimo di 6 metri. Ancora Puoi usare un’azione per appoggiare la piuma arcana a una barca o nave. Per le successive 24 ore, il vascello non potrà essere mosso in alcun modo. Toccare di nuovo il vascello con la piuma arcana termina questo effetto. Quando l’effetto termina, la piuma svanisce. Frusta Puoi usare un’azione per lanciare la piuma arcana verso un punto entro 3 metri da te. La piuma svanisce e al suo posto compare una frusta fluttuante. Puoi poi usare un’azione bonus per effettuare un attacco con incantesimo in mischia contro una creatura entro 3 metri dalla frusta, con un bonus di attacco +9. Se colpisci, il bersaglio subisce 1d6 + 5 danni da forza.Durante il tuo turno, con un’azione bonus, puoi dirigere la frusta affinché voli per un massimo di 6 metri e ripeta l’attacco contro una creatura entro 3 metri da essa. La frusta svanisce dopo 1 ora, quando usi un’azione per congedarla, o quando sei inabile o muori. Barca Cigno Puoi usare un’azione per appoggiare la piuma arcana su di una massa d’acqua di almeno 18 metri di diametro. La piuma svanisce e al suo posto compare una barca lunga 15 metri e larga 6 metri dalla forma di cigno. La barca si sposta da sola e si muove in acqua alla velocità di 9 chilometri all’ora. Puoi usare un’azione, mentre sei a bordo per comandarle di muoversi o voltare di 90 gradi. La barca può trasportare fino a trentadue creature di taglia Media o inferiore. Una creatura Grande conta come quattro creature Medie, mentre una creatura Enorme conta come nove creature Medie. La barca svanisce dopo 24 ore. Puoi congedare la barca con un’azione. Uccello Puoi usare un’azione per lanciare la piuma arcana 1,5 metri nell’aria. La piuma svanisce e un enorme uccello multicolore ne prende il posto. L’uccello ha le statistiche di un roc, ma obbedisce a comandi semplici e non può attaccare. Può trasportare fino a 250 chili mentre vola alla sua velocità massima (24 chilometri all’ora per un massimo di 216 chilometri al giorno, con un’ora di riposo ogni 3 ore di volo), o 500 chili di peso a metà velocità. L’uccello svanisce dopo aver volato per la distanza massima possibile in un giorno o se scende a 0 punti ferita. Puoi congedare l’uccello con un’azione. Ventaglio Se ti trovi su di una barca o una nave, puoi usare un’azione per lanciare la piuma arcana fino a 3 metri in aria. La piuma svanisce e un gigantesco ventaglio compare al suo posto. Il ventaglio galleggia e crea un vento forte abbastanza da gonfiare le vele della nave, aumentandone la velocità di 7,5 chilometri all’ora per 8 ore. Puoi congedare il ventaglio con un’azione."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/piuma-di-quaal",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "polvere-della-sparizione",
    "name": "Polvere Della Sparizione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Rinvenuta in piccoli sacchetti, questa polverina sembra sabbia molto sottile. In un sacchetto ce n’è a sufficienza per un uso. Quando usi un’azione per lanciare la polvere in aria, tu e ciascuna creatura e oggetto entro 3 metri da te diventate invisibili per 2d4 minuti. La durata è la stessa per tutti i soggetti, e quando la magia prende effetto la polvere si consuma. Se una creatura sotto l’effetto della polvere attacca o lancia un incantesimo, l’invisibilità ha fine solo per quella creatura."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/polvere-della-sparizione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "polvere-dello-starnuto-e-del-soffocamento",
    "name": "Polvere Dello Starnuto E Del Soffocamento",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Trovata in piccoli contenitori, questa polverina sembra sabbia sottile. Appare simile alla polvere della sparizione, e l’incantesimo identificare la rivela come tale. Ce n’è a sufficienza per un uso.Quando usi un’azione per lanciare una manciata di polvere in aria, tu e tutte le creature che necessitano di respirare e si trovino entro 9 metri da te dovete superare un tiro salvezza di Costituzione con CD 15 o smettere di respirare, e iniziare a starnutire in maniera incontrollabile. Una creatura afflitta a questo modo è inabile e soffoca. Finché è cosciente, la creatura può ripetere il tiro salvezza alla fine di ciascun suo turno, terminando l’effetto in caso lo superi. Anche l’incantesimo ristorare inferiore può terminare l’effetto che affligge la creatura."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/polvere-dello-starnuto-e-del-soffocamento",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "polvere-prosciugante",
    "name": "Polvere Prosciugante",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa piccola confezione contiene 1d6 + 4 pizzichi di polvere. Puoi usare un’azione per spargere un pizzico di polvere sull’acqua. La polvere trasforma un cubo d’acqua di 4,5 metri di spigolo in una pallina delle dimensioni di una biglia, che fluttua o si deposita nel punto in cui è stata gettata la polvere. Il peso della pallina è trascurabile.Chiunque può usare un’azione per spaccare la pallina contro una superficie dura, facendo sì che la pallina si rompa e liberi l’acqua assorbita dalla polvere. Farlo esaurisce la magia della pallina.Un elementale composto principalmente d’acqua e che venga esposto a un pizzico di questa polvere, deve effettuare un tiro salvezza di Costituzione con CD 13, subendo 10d6 danni necrotici se lo fallisce, o la metà di questi danni se lo riesce."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/polvere-prosciugante",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-del-respirare-sottacqua",
    "name": "Pozione Del Respirare Sottacqua",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Dopo aver bevuto questa pozione, puoi respirare sott’acqua per 1 ora."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-del-respirare-sottacqua",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-della-forma-dei-giganti",
    "name": "Pozione Della Forma Dei Giganti",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, per 1 ora il tuo punteggio di Forza cambia. Il tipo di gigante determina il punteggio (vedi la tabella seguente). La pozione non ha effetto se il tuo punteggio di Forza è pari o superiore al nuovo punteggio.La pozione della forza del gigante del gelo e la pozione della forza del gigante di pietra hanno lo stesso effetto."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-della-forma-dei-giganti",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-della-forma-gassosa",
    "name": "Pozione Della Forma Gassosa",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, per 1 ora o finché non terminerai l’effetto con un’azione bonus, ottieni l’effetto dell’incantesimo forma gassosa (non richiede concentrazione)."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-della-forma-gassosa",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-amicizia-con-gli-animali",
    "name": "Pozione Di Amicizia Con Gli Animali",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, per 1 ora puoi lanciare a volontà l’incantesimo amicizia con gli animali (CD del tiro salvezza 13)."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-amicizia-con-gli-animali",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-chiaroveggenza",
    "name": "Pozione Di Chiaroveggenza",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, ottieni l’effetto dell’incantesimo chiaroveggenza."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-chiaroveggenza",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-crescita",
    "name": "Pozione Di Crescita",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, per 1d4 ore ottieni l’effetto “ingrandire” dell’incantesimo ingrandire/ridurre (non richiede concentrazione)."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-crescita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-diminuzione",
    "name": "Pozione Di Diminuzione",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, per 1d4 ore ottieni l’effetto “ridurre” dell’incantesimo ingrandire/ridurre (non richiede concentrazione)."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-diminuzione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-eroismo",
    "name": "Pozione Di Eroismo",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, ottieni 10 punti ferita temporanei che durano 1 ora. Per la stessa durata sei sotto l’effetto dell’incantesimo benedizione (non richiede concentrazione)."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-eroismo",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-guarigione",
    "name": "Pozione Di Guarigione",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Molto Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi da questa pozione, recuperi un numero di punti ferita che varia a seconda della rarità della pozione, come mostrato sulla tabella Pozioni di Guarigione."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-guarigione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-invisibilita",
    "name": "Pozione Di Invisibilita",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Molto Rara"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, per 1 ora diventi invisibile. Mentre sei invisibile, tutto ciò che trasporti o indossi resta anch’esso invisibile assieme a te. L’effetto ha termine qualora tu attacchi o lanci un incantesimo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-invisibilita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-lettura-della-mente",
    "name": "Pozione Di Lettura Della Mente",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, ottieni l’effetto dell’incantesimo individuazione dei pensieri (CD del tiro salvezza 13)."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-lettura-della-mente",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-resistenza",
    "name": "Pozione Di Resistenza",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, per 1 ora ottieni resistenza a un tipo di danno. Il GM sceglie il tipo di danno o lo determina casualmente."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-resistenza",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-scalare",
    "name": "Pozione Di Scalare",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, per 1 ora ottieni velocità di scalata pari alla tua velocità di passeggio. Durante questo periodo hai vantaggio alle prove di Forza (Atletica) che compi per effettuare una scalata."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-scalare",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-velocita",
    "name": "Pozione Di Velocita",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, ottieni l’effetto dell’incantesimo velocità per 1 minuto (non richiede concentrazione)."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-velocita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-di-volare",
    "name": "Pozione Di Volare",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando bevi questa pozione, per 1 ora ottieni velocità di volo pari alla tua normale velocità di passeggio e puoi fluttuare. Se la pozione ha termine mentre stai volando, cadi a meno che non possiedi qualche altro metodo per restare in aria."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-di-volare",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozione-velenosa",
    "name": "Pozione Velenosa",
    "equipment_category": {
      "index": "potion",
      "name": "Pozione",
      "url": "/api/2014/equipment-categories/potion"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo distillato assomiglia, odora e ha il sapore di una pozione di guarigione o di un’altra pozione benefica. Tuttavia è in realtà un veleno mascherato da magie di illusione. L’incantesimo identificare ne rivela la vera natura.Se lo bevi, subisci 3d6 danni da veleno, e devi superare un tiro salvezza di Costituzione con CD 13 o restare avvelenato. All’inizio di ciascun tuo turno, finché resti avvelenato a questo modo, subisci 3d6 danni da veleno. Puoi ripetere il tiro salvezza al termine di ciascun tuo turno. Se il tiro salvezza riesce, il danno da veleno subito nei turni successivi diminuisce di 1d6. Il veleno cessa i suoi effetti quando il danno scende a 0."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozione-velenosa",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pozzo-dei-mondi",
    "name": "Pozzo Dei Mondi",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo elegante tessuto nero, soffice come la seta, è avvolto fino alle dimensioni di un fazzoletto. Si dispiega in un foglio circolare di 1,8 metri di diametro.Puoi usare un’azione per dispiegare e piazzare il pozzo dei molti mondi su di una superficie solida, su cui crea un portale bidirezionale verso un altro mondo o piano di esistenza. Ogni volta che l’oggetto apre un portale, il GM decide il posto a cui conduce. Puoi usare un’azione per chiudere un portale aperto afferrando i margini del tessuto e ripiegandoli. Una volta che un pozzo dei molti mondi ha aperto un portale, non potrà farlo di nuovo prima che siano passate 1d8 ore."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pozzo-dei-mondi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "pugnale-avvelenato",
    "name": "Pugnale Avvelenato",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Hai un bonus di +1 ai tiri per colpire e tiri di danno per gli attacchi effettuati con quest’arma magica.Una volta al giorno, puoi usare un’azione per far sì che un denso veleno nero ricopra la lama. Il veleno resta per 1 minuto o finché non colpisci con un attacco usando quest’arma. Quando colpisci una creatura con il pugnale avvelenato, il bersaglio deve effettuare un tiro salvezza di Costituzione con CD 15. Se fallisce il tiro salvezza, il bersaglio diventa avvelenato per 1 minuto e subisce 2d10 danni da veleno. Il pugnale non può essere usato di nuovo a questo modo fino alla prossima alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/pugnale-avvelenato",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "sacro-vendicatore",
    "name": "Sacro Vendicatore",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ottieni un bonus di +3 ai tiri per colpire e danno effettuati con quest’arma magica. Quando con essa colpisci un immondo o un non morto, quella creatura subisce 2d10 danni radianti aggiuntivi.Mentre impugni la spada sguainata, essa crea un’aura di 3 metri di raggio attorno a te. Tu e tutte le creature a te amichevoli all’interno dell’aura ottenete vantaggio ai tiri salvezza contro incantesimi e altri effetti magici. Se hai 17 o più livelli nella classe del paladino, il raggio dell’aura aumenta a 9 metri."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/sacro-vendicatore",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "scarabeo-di-protezione",
    "name": "Scarabeo Di Protezione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Se tieni questo medaglione a forma di scarabeo tra le tue mani per 1 round, su di esso compare un’iscrizione che ne rivela la natura magica. Mentre è addosso a te, fornisce due benefici: Hai vantaggio ai tiri salvezza contro incantesimi. Lo scarabeo ha 12 cariche. Se fallisci un tiro salvezza contro un incantesimo di necromanzia o un effetto nocivo originante da una creatura non morta, puoi usare la tua reazione per spendere 1 carica e trasformare il tiro salvezza fallito in un successo. Lo scarabeo si riduce in polvere ed è distrutto quando viene spesa la sua ultima carica."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/scarabeo-di-protezione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "scimitarra-della-velocita",
    "name": "Scimitarra Della Velocita",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ottieni un bonus di +2 ai tiri per colpire e danno effettuati con quest’arma magica. Inoltre, come azione bonus durante ciascun tuo turno puoi effettuare un attacco aggiuntivo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/scimitarra-della-velocita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "scudo-1-2-3",
    "name": "Scudo 1 2 3",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questo scudo, hai un bonus alla CA determinato dalla rarità dello scudo. Questo bonus è in aggiunta al normale bonus alla CA fornito dallo scudo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/scudo-1-2-3",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "scudo-anti-incantesimi",
    "name": "Scudo Anti Incantesimi",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questo scudo, hai vantaggio ai tiri salvezza contro incantesimi e altri effetti magici, e gli attacchi con incantesimo subiscono svantaggio quando effettuati contro di te."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/scudo-anti-incantesimi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "scudo-attiraproiettili",
    "name": "Scudo Attiraproiettili",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questo scudo hai resistenza ai danni da parte degli attacchi con arma a distanza. Maledizione Questo scudo è maledetto. Sintonizzarsi con esso ti maledice finché non sarai bersaglio dell’incantesimo rimuovi maledizione o simile magia. Togliersi lo scudo non pone fine alla maledizione. Ogni qualvolta un attacco con arma a distanza viene effettuato contro un bersaglio entro 3 metri da te, la maledizione fa sì che diventi tu il bersaglio dell’attacco."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/scudo-attiraproiettili",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "scudo-catturafrecce",
    "name": "Scudo Catturafrecce",
    "equipment_category": {
      "index": "armor",
      "name": "Armatura",
      "url": "/api/2014/equipment-categories/armor"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questo scudo, hai un bonus di +2 alla CA contro gli attacchi a distanza. Questo bonus è in aggiunta al normale bonus dello scudo alla CA. Inoltre, ogni volta che una creatura effettua un attacco a distanza contro un bersaglio entro 1,5 metri da te, puoi usare la tua reazione per divenire il bersaglio dell’attacco."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/scudo-catturafrecce",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "sfera-annientatrice",
    "name": "Sfera Annientatrice",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa sfera nera di 50 centimetri di diametro è in realtà un foro nella struttura del multiverso, che fluttua nello spazio ed è stabilizzata dal campo magico che la circonda.La sfera annienta tutta la materia che attraversa e tutta la materia che l’attraversa. L’unica eccezione sono gli artefatti. A meno che l’artefatto non sia suscettibile ai danni della sfera dell’annientamento, esso può attraversare la sfera senza problemi. Qualsiasi altra cosa tocchi la sfera e non ne sia completamente avvolta e annientata da essa, subisce 4d10 danni da forza.La sfera resta immobile fino a quando qualcuno non la controlla. Se ti trovi entro 18 metri da una sfera incontrollata, puoi impiegare un’azione per effettuare una prova di Intelligenza (Arcano) con CD 25. Se la superi, la sfera levita in una direzione a tua scelta, per un numero di metri pari a 1,5 x il tuo modificatore di Intelligenza (minimo 1,5 metri). Se fallisci, la sfera si muove di 3 metri verso di te. Una creatura nel cui spazio entri la sfera, deve superare un tiro salvezza di Destrezza con CD 13 o venire toccata da essa, subendo 4d10 danni da forza.Se tenti di controllare una sfera che si trova sotto il controllo di un’altra creatura, effettui una prova contesa di Intelligenza (Arcano) contro l’Intelligenza (Arcano) dell’altra creatura. Il vincitore della contesa ottiene il controllo della sfera e può farla levitare come di norma.Se la sfera entra in contatto con un portale planare, come quello creato dall’incantesimo portale, o uno spazio extradimensionale, come quello all’interno di un buco portatile, il GM determina casualmente ciò che accade, utilizzando la tabella seguente."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/sfera-annientatrice",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "solvente-universale",
    "name": "Solvente Universale",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo tubetto contiene un liquido bianco con un forte odore di alcool. Puoi usare un’azione per versarne i contenuti su di una superficie a portata. Il liquido dissolve istantaneamente 1.000 cm2 di adesivo con cui entra in contatto, compresa la colla suprema."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/solvente-universale",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "spada-affilata",
    "name": "Spada Affilata",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando attacchi un oggetto con quest’arma magica e colpisci, massimizza i dadi di danno della tua arma contro il bersaglio.Quando attacchi una creatura con quest’arma e ottieni 20 al tiro per colpire, il bersaglio subisce 14 danni taglienti aggiuntivi. Tira poi un altro d20. Se il risultato è ancora 20, recidi uno degli arti del bersaglio: l’effetto di questa perdita è determinato dal GM. Se la creatura non ha arti da recidere, verrà tagliata una parte del suo corpo.Inoltre, puoi pronunciare la parola di comando della spada per far sì che la lama irradi luce intensa in un raggio di 3 metri e luce fioca per ulteriori 3 metri. Pronunciando di nuovo la parola di comando o rinfoderando la spada, la luce si spegne."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/spada-affilata",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "spada-del-ferimento",
    "name": "Spada Del Ferimento",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "I punti ferita persi a causa dei danni di quest’arma, possono essere recuperati solo tramite un riposo breve o lungo, anziché tramite la rigenerazione, la magia o altri metodi.Una volta per turno, quando colpisci una creatura con un attacco usando quest’arma magica, puoi far sanguinare il bersaglio. All’inizio di ciascun turno della creatura sanguinante, essa subisce 1d4 danni necrotici per ogni volta che l’hai ferita a questo modo, ed essa può effettuare un tiro salvezza di Costituzione con CD 15, terminando l’effetto su tutte le ferite sanguinanti in caso di successo. In alternativa, la creatura sanguinante, o una creatura entro 1,5 metri da essa, può usare un’azione per effettuare una prova di Saggezza (Medicina) con CD 15, terminando l’effetto del sanguinamento in caso la superi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/spada-del-ferimento",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "spada-del-furto-vitale",
    "name": "Spada Del Furto Vitale",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando attacchi una creatura con quest’arma magica e ottieni 20 al tiro per colpire, il bersaglio, a parte i costrutti e i non morti, subisce 10 danni necrotici aggiuntivi. Inoltre, tu guadagni 10 punti ferita temporanei."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/spada-del-furto-vitale",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "spada-vorpal",
    "name": "Spada Vorpal",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Ottieni un bonus di +3 ai tiri per colpire e danno effettuati con quest’arma magica. Inoltre, l’arma ignora la resistenza ai danni taglienti.Quando attacchi una creatura che abbia almeno una testa con quest’arma e ottieni 20 al tiro per colpire, tagli una delle teste della creatura. La creatura muore se non può sopravvivere senza la perdita della testa. Una creatura è immune a questo effetto se è immune ai danni taglienti, non possiede o non ha bisogno di una testa, possiede azioni leggendarie o il GM decide che la creatura è troppo grossa perché la sua testa sia recisa da quest’arma. Una creatura del genere subisce invece 6d8 danni taglienti aggiuntivi dal colpo subito."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/spada-vorpal",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "specchio-imprigionante",
    "name": "Specchio Imprigionante",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando questo specchio alto 120 centimetri viene guardato in maniera indiretta, la sua superficie mostra una vaga immagine della creatura. Lo specchio pesa 25 chili, ha CA 11, 10 punti ferita e vulnerabilità ai danni contundenti. Si frantuma ed è distrutto quando viene ridotto a 0 punti ferita.Se lo specchio è appeso a una superficie verticale e ti trovi entro 1,5 metri da esso, puoi usare un’azione per pronunciare la sua parola di comando e attivarlo. Rimarrà attivo fino a quando non pronuncerai di nuovo la parola di comando.Qualsiasi creatura, a parte te, che veda il suo riflesso nello specchio attivato mentre si trova entro 9 metri da esso deve superare un tiro salvezza di Carisma con CD 15 o finire intrappolata, insieme a tutto ciò che indossa o trasporta, in una delle dodici celle extradimensionali dello specchio. Questo tiro salvezza riceve vantaggio se la creatura conosce la natura dello specchio, e i costrutti riescono automaticamente il tiro salvezza.Una cella extradimensionale è uno spazio infinito colmo di una densa foschia che riduce la visibilità a 3 metri. Le creature intrappolate nelle celle dello specchio non invecchiano, e non hanno bisogno di mangiare, bere o dormire. Una creatura intrappolata all’interno di una cella può fuggirne usando la magia che permette di viaggiare tra i piani. Altrimenti, la creatura è confinata nella cella fino a quando non sarà liberata.Se lo specchio intrappola una creatura ma le sue dodici celle extradimensionali sono già occupate, lo specchio libera una delle creature intrappolate a caso per alloggiare il nuovo prigioniero. La creatura liberata compare in uno spazio non occupato in vista dello specchio ma rivolta dalla parte opposta. Se lo specchio viene infranto, tutte le creature che contiene sono liberate e ricompaiono in uno spazio non occupato in sua prossimità.Mentre ti trovi entro 1,5 metri dallo specchio, puoi usare un’azione per pronunciare il nome di una delle creature intrappolate al suo interno o richiamare un particolare numero di cella. La creatura nominata o contenuta nella cella nominata appare come immagine sulla superficie dello specchio. Dopodiché tu e la creatura nominata potete comunicare normalmente.In un modo simile, puoi usare un’azione per pronunciare una seconda parola di comando e liberare una delle creature intrappolate nello specchio. La creatura liberata compare, insieme a tutte le sue proprietà, nello spazio non occupato più vicino allo specchio e rivolta nella direzione opposta a esso."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/specchio-imprigionante",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "statuine-del-potere-meraviglioso",
    "name": "Statuine Del Potere Meraviglioso",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Una miniatura dal potere meraviglioso è una statuetta di una bestia, piccola a sufficienza da entrare in tasca. Se usi un’azione per pronunciare una parola di comando e lanciare la miniatura in un punto del terreno entro 18 metri da te, la miniatura diventa una creatura vivente. Se lo spazio in cui la creatura dovesse apparire è occupato da un’altra creatura o oggetto, o se non c’è spazio sufficiente per la creatura, la miniatura non si trasforma.La creatura è amichevole nei confronti tuoi e dei tuoi compagni. Comprende i tuoi linguaggi e obbedisce agli ordini impartitele. Se non le impartisci ordini, la creatura si difende ma non effettua altre azioni. Vedi il Bestiario per le altre statistiche della creatura, eccetto per la mosca gigante (vedi sotto).La creatura resta per la durata specificata per ciascuna miniatura. Al termine della durata, la creatura ritorna alla sua forma di miniatura. Si trasforma anticipatamente se scende a 0 punti ferita o se usi un’azione per pronunciare la parola di comando di nuovo mentre la tocchi. Dopo che la creatura è tornata a essere una miniatura, le sue proprietà non possono più essere usate fino a quando non sarà trascorso un certo ammontare di tempo, come specificato nella descrizione della miniatura. Cane di Onice (Raro) Questa statuetta di onice raffigura un cane. Può diventare un mastino per un massimo di 6 ore. Il mastino ha Intelligenza 8 e può parlare Comune. Inoltre ha scurovisione con una gittata di 18 metri e può vedere le creature e gli oggetti invisibili entro quella gittata. Una volta usata, non può essere usata di nuovo prima che siano passati 7 giorni. Capre d’Avorio (Raro) Queste statuette d’avorio di caproni sono sempre create in set da tre. Ogni caprone ha un aspetto unico e funziona in modo diverso dagli altri. Le loro proprietà sono le seguenti: La capra del terrorepuò diventare un caprone gigante per un massimo di 3 ore. Il caprone non può attaccare, ma puoi rimuoverne i corni e usarli come armi. Un corno diventa una lancia da cavaliere +1 mentre l’altro diventa una spada lunga +2. Rimuovere un corno richiede un’azione, e le armi scompaiono e i corni ricompaiono quando il caprone torna alla sua forma di miniatura. Inoltre, il caprone irradia un’aura di terrore con raggio 9 metri finché lo cavalchi. Qualsiasi creatura a te ostile che inizi il proprio turno all’interno dell’aura deve superare un tiro salvezza di Saggezza con CD 15 o restare spaventata dal caprone per 1 minuto, o finché il caprone non torna alla forma di miniatura. La creatura spaventata può ripetere il tiro salvezza al termine di ciascun suo turno, terminando l’effetto se lo supera. Una volta che ha riuscito il tiro salvezza contro questo effetto, una creatura è immune all’aura del caprone per le successive 24 ore. Una volta usata, la miniatura non può essere usato di nuovo prima che siano passati 15 giorni. La capra del dolorepuò diventare un caprone giganteper un massimo di 3 ore. Una volta usato, non può essereusato di nuovo prima che siano passati 30 giorni. La capra del viaggiopuò diventare un caprone Grande con le stesse statistiche di un cavallo da corsa. Ha 24 cariche, e ciascuna ora o porzione di essa che trascorre in forma di bestia costa 1 carica. Finché ha cariche, lo puoi usare quanto ti pare. Una volta terminate le cariche, ritorna a essere una miniatura e non può essere usato di nuovo prima che siano passati 7 giorni, allorché avrà recuperato tutte le sue cariche. Corvo d’Argento (Non Comune) Questa statuetta d’argento raffigura un corvo. Può diventare un corvo per un massimo di 6 ore. Una volta usata, non può essere usata di nuovo prima che siano passati 2 giorni. Mentre è in forma di corvo, la miniatura ti permette di lanciare a volontà l’incantesimo messaggero animale su di essa. Stallone di Ossidiana (Molto raro) Questa statuetta di ossidiana liscia diventa un incubo per un massimo di 24 ore. L’incubo combatte solo per difendersi. Una volta usata, non può essere usata di nuovo prima che siano passati 5 giorni.Se sei di allineamento buono, c’è una probabilità del 10% che ogni volta che la usi, la miniatura ignori i tuoi ordini, compreso l’ordine di tornare alla sua normale forma di miniatura. Se cavalchi l’incubo mentre ignora i tuoi ordini, venite entrambi trasportati in un luogo casuale sul piano dell’Ade, dove l’incubo torna alla sua forma di miniatura. Elefante di Marmo (Raro) Questa statuetta di marmo è larga e alta circa 10 centimetri. Può diventare un elefante per un massimo di 24 ore. Una volta usata, non può essere usata di nuovo prima che siano passati 7 giorni. Grifone di Bronzo (Raro) Questa statuetta di bronzo raffigura un grifone rampante. Può diventare un grifone per un massimo di 6 ore. Una volta usata, non può essere usata di nuovo prima che siano passati 5 giorni. Gufo di Serpentino (Raro) Questa statuetta serpentina di un gufo può diventare un gufo gigante per un massi..."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/statuine-del-potere-meraviglioso",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "stivali-alati",
    "name": "Stivali Alati",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questi stivali, hai una velocità di volo pari alla tua velocità di passeggio. Puoi usare questi stivali per volare per un massimo di 4 ore, tutte insieme o divise in brevi voli, ciascuno dei quali impiega un minimo di 1 minuto di durata. Se la durata termina mentre stai volando, scendi alla velocità di 9 metri per round finché non atterri.Gli stivali recuperano 2 ore di capacità di volo ogni 12 ore che non sono in uso."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/stivali-alati",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "stivali-dellinverno",
    "name": "Stivali Dellinverno",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questi stivali, ottieni i seguenti benefici: Hai resistenza ai danni da freddo. Ignori il terreno difficile prodotto da neve o ghiaccio. Puoi tollerare le temperature fino ai -45° C senza bisogno di ulteriori protezioni. Se indossi abiti pesanti, puoi tollerare temperature fino a -75° C."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/stivali-dellinverno",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "stivali-della-velocita",
    "name": "Stivali Della Velocita",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questi stivali, puoi usare un’azione bonus per raddoppiare la tua velocità di passeggio, e qualsiasi creatura che effettui un attacco di opportunità contro di te, ha svantaggio al tiro per colpire. Puoi terminare l’effetto quando vuoi.Quando la proprietà degli stivali è stata usata per un totale di 10 minuti, la magia cessa di funzionare fino al termine di un riposo lungo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/stivali-della-velocita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "talismano-anti-veleno",
    "name": "Talismano Anti Veleno",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo pendente i veleni non hanno alcun effetto su di te. Sei immune alla condizione avvelenato e hai immunità ai danni da veleno."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/talismano-anti-veleno",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "talismano-del-bene-puro",
    "name": "Talismano Del Bene Puro",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo talismano è un potente simbolo del bene. Una creatura che non sia di allineamento né buono né malvagio subisce 6d6 danni radianti se tocca il talismano. Una creatura malvagia subisce 8d6 danni radianti se tocca il talismano. Entrambi questi tipi di creature subiscono i danni di nuovo ogni volta che terminano il turno impugnando o trasportando il talismano.Se sei un chierico o paladino buono, puoi usare il talismano come simbolo sacro, e ottieni un bonus di +2 ai tiri per colpire con gli incantesimi finché lo indossi o impugni.Se lo stai indossando o impugnando, puoi usare un’azione per spendere 1 sua carica e scegliere una creatura visibile sul terreno entro 36 metri da te. Se il bersaglio è di allineamento malvagio, una fenditura fiammeggiante si apre sul terreno sotto di lui. Il bersaglio deve superare un tiro salvezza di Destrezza con CD 20 o cadere nelle fenditura e venire distrutto, senza lasciare resti. La fenditura poi si richiude, senza lasciare tracce della sua esistenza. Il talismano ha 7 cariche, e quando spendi l’ultima carica, il talismano si dissolve in particelle di luce dorata ed è distrutto."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/talismano-del-bene-puro",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "talismano-del-male-estremo",
    "name": "Talismano Del Male Estremo",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo oggetto rappresenta il male impenitente. Una creatura che non sia di allineamento né buono né malvagio subisce 6d6 danni necrotici se tocca il talismano. Una creatura buona subisce 8d6 danni necrotici se tocca il talismano. Entrambi questi tipi di creature subiscono i danni di nuovo ogni volta che terminano il turno impugnando o trasportando il talismano.Se sei un chierico o paladino malvagio, puoi usare il talismano come simbolo sacrilego, e ottieni un bonus di +2 ai tiri per colpire con gli incantesimi finché lo indossi o impugni.Se lo stai indossando o impugnando, puoi usare un’azione per spendere 1 sua carica e scegliere una creatura visibile sul terreno entro 36 metri da te. Se il bersaglio è di allineamento buono, una fenditura fiammeggiante si apre sul terreno sotto di lui. Il bersaglio deve superare un tiro salvezza di Destrezza con CD 20 o cadere nelle fenditura e venire distrutto, senza lasciare resti. La fenditura poi si richiude, senza lasciare tracce della sua esistenza. Il talismano ha 6 cariche, e quando spendi l’ultima carica, il talismano si dissolve in una melma maleodorante ed è distrutto."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/talismano-del-male-estremo",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "talismano-della-rimarginazione",
    "name": "Talismano Della Rimarginazione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo pendente, ogni volta che sei morente ti stabilizzi all’inizio del tuo turno. Inoltre, ogni qual volta tiri i Dadi Vita per recuperare punti ferita, raddoppia il numero di punti ferita che recuperi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/talismano-della-rimarginazione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "talismano-della-salute",
    "name": "Talismano Della Salute",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questo pendente sei immune alla possibilità di contrarre qualsiasi malattia. Se sei già infetto da una malattia, i suoi effetti vengono sospesi finché indossi questo pendente."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/talismano-della-salute",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "talismano-della-sfera",
    "name": "Talismano Della Sfera",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Quando effettui una prova di Intelligenza (Arcano) per controllare una sfera dell’annientamento mentre stai impugnando questo talismano, raddoppi il bonus di competenza che applichi alla prova. Inoltre, quando inizi il turno con il controllo di una sfera dell’annientamento, puoi usare un’azione per farla levitare di 3 metri più un numero di metri aggiuntivi pari a 3 x il tuo modificatore di Intelligenza."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/talismano-della-sfera",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "tomo-del-comando-e-dellinfluenza",
    "name": "Tomo Del Comando E Dellinfluenza",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo libro contiene indicazioni su come influenzare e affascinare il prossimo, e le sue parole sono soffuse di magia. Se trascorri 48 ore in un periodo di 6 giorni o meno a studiare i contenuti del libro e praticarne le indicazioni, il tuo punteggio di Carisma aumenta di 2, e così fa il tuo punteggio massimo per quella caratteristica . Poi il manuale perde la sua magia, per recuperarla dopo un secolo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/tomo-del-comando-e-dellinfluenza",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "tomo-del-nitido-pensiero",
    "name": "Tomo Del Nitido Pensiero",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo libro contiene esercizi di memoria e logica, e le sue parole sono soffuse di magia. Se trascorri 48 ore in un periodo di 6 giorni o meno a studiare i contenuti del libro e praticarne le indicazioni, il tuo punteggio di Intelligenza aumenta di 2, e così fa il tuo punteggio massimo per quella caratteristica. Poi il manuale perde la sua magia, per recuperarla dopo un secolo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/tomo-del-nitido-pensiero",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "tomo-della-comprensione",
    "name": "Tomo Della Comprensione",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo libro contiene esercizi di intuizione e discernimento, e le sue parole sono soffuse di magia. Se trascorri 48 ore in un periodo di 6 giorni o meno a studiare i contenuti del libro e praticarne le indicazioni, il tuo punteggio di Saggezza aumenta di 2, e così fa il tuo punteggio massimo per quella caratteristica. Poi il manuale perde la sua magia, per recuperarla dopo un secolo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/tomo-della-comprensione",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "tridente-del-comando-dei-pesci",
    "name": "Tridente Del Comando Dei Pesci",
    "equipment_category": {
      "index": "weapon",
      "name": "Arma",
      "url": "/api/2014/equipment-categories/weapon"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo tridente è un’arma magica. Finché lo porti con te, puoi usare un’azione e spendere 1 carica per lanciare tramite esso dominare bestie (CD del tiro salvezza 15) su di una bestia che abbia una velocità di nuoto innata. Il tridente ha 3 cariche, e recupera 1d3 cariche spese ogni giorno all’alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/tridente-del-comando-dei-pesci",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "tunica-degli-occhi",
    "name": "Tunica Degli Occhi",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa tunica è adornata da un disegno di occhi. Mentre la indossi, ottieni i seguenti benefici: La tunica ti permette di vedere in tutte le direzioni e hai vantaggio alle prove di Saggezza (Percezione) basate sulla vista. Hai scurovisione con una gittata di 36 metri. Puoi vedere creature e oggetti invisibili, oltre che nel Piano Etereo, fino a una gittata di 36 metri Gli occhi della tunica non possono essere chiusi o distolti, e mentre indossi questa tunica non viene mai considerato a occhi chiusi o distolti.L’incantesimo luce lanciato sulla tunica o l’incantesimo luce diurna lanciato entro 1, 5 metri dalla tunica ti rendono accecato per 1 minuto. Al termine di ciascun tuoturno, puoi effettuare un tiro salvezza di Costituzione (CD11 per luce o CD 15 per luce diurna ), ponendo fine alla condizione accecato in caso lo superi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/tunica-degli-occhi",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "tunica-degli-oggetti-utili",
    "name": "Tunica Degli Oggetti Utili",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa tunica ricoperta da toppe di varie forme e colori, puoi usare un’azione per staccare una delle toppe, facendola diventare l’oggetto o la creatura che rappresenta. Quando l’ultima toppa viene rimossa, la tunica diventa un indumento normale.La tunica possiede due di ciascuna delle seguenti toppe: Asta di 3 metri, Corda di canapa (15 metri, arrotolata), Lanterna a lente sporgente (piena e accesa), Pugnale, Sacco, Specchio d’acciaio.Inoltre, la tunica ha 4d4 altre toppe. Il GM sceglie le toppe o le determina a caso, scegliendo tra proprietà totalmente diverse da quelle già presenti."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/tunica-degli-oggetti-utili",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "tunica-dei-colori-scintillanti",
    "name": "Tunica Dei Colori Scintillanti",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa tunica ha 3 cariche, e recupera 1d3 cariche spese ogni giorno all’alba. Quando la indossi, puoi usare un’azione e spendere 1 carica per far sì che l’indumento produca una trama mutevole di colori abbaglianti fino al termine del tuo prossimo turno. Durante questo periodo, la tunica emana luce intensa in un raggio di 9 metri e luce fioca per ulteriori 9 metri. Le creature che ti vedono hanno svantaggio ai tiri per colpire contro di te. Inoltre, qualsiasi creatura sotto la luce intensa e che ti veda quando il potere della tunica viene attivato, deve superare un tiro salvezza di Saggezza con CD 15 o restare stordita fino al termine dell’effetto."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/tunica-dei-colori-scintillanti",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "tunica-dellarcimago",
    "name": "Tunica Dellarcimago",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Il colore della tunica corrisponde all’allineamento per cui è stata creata. Una tunica bianca è fatta per i buoni, quella grigia per i neutrali, e quella nera per i malvagi. Non puoi entrare in sintonia con una tunica dell’arcimago che non corrisponda al tuo allineamento.Mentre indossi questa tunica ottieni i seguenti benefici: Se non indossi alcuna armatura, la tua Classe Armatura base è 15 + il tuo modificatore di Destrezza. Hai vantaggio ai tiri salvezza contro incantesimi e altri effetti magici. La CD del tiro salvezza degli incantesimi e il bonus di attacco degli incantesimi aumentano entrambi di +2."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/tunica-dellarcimago",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "tunica-delle-stelle",
    "name": "Tunica Delle Stelle",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre indossi questa tunica, ottieni un bonus di +1 ai tiri salvezza.Sei stelle, posizionate sulla parte superiore frontale della tunica, sono più grosse delle altre. Mentre indossi questa tunica, puoi usare un’azione per estrarre una delle stelle e usarla per lanciare dardo incantato come fosse un incantesimo di 5° livello. Ogni giorno al tramonto, la stella rimossa ricompare sulla tunica.Mentre indossi la tunica, puoi usare un’azione per entrare nel Piano Astrale assieme a tutto ciò che indossi o trasporti. Resterai lì fino a quando userai un’azione per ritornare al piano in cui ti trovavi prima. Ricompari nell’ultimo spazio da te occupato, o se quello spazio è occupato, nel lo spazio non occupato più vicino."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/tunica-delle-stelle",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "unguento-di-keoghtom",
    "name": "Unguento Di Keoghtom",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa giara di vetro, 7,5 centimetri di diametro, contiene 1d4 + 1 dosi di una densa mistura. La giara e i suoi contenuti pesano 250 grammi.Con un’azione, si può inghiottire o applicare sulla pelle una dose di unguento. La creatura che lo riceve recupera 2d8 + 2 punti ferita, smette di essere avvelenata e viene curata da qualsiasi malattia."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/unguento-di-keoghtom",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "ventaglio",
    "name": "Ventaglio",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questo ventaglio, puoi usare un’azione per lanciare tramite esso l’incantesimo folata di vento (CD del tiro salvezza 13). Una volta usato, il ventaglio non dovrebbe essere usato di nuovo fino alla prossima alba. Ogni volta che venga usato prima di allora, c’è una probabilità cumulativa del 20% che non funzioni e si rompa in inutili brandelli privi di magia."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/ventaglio",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "verga-dei-tentacoli",
    "name": "Verga Dei Tentacoli",
    "equipment_category": {
      "index": "rod",
      "name": "Verga",
      "url": "/api/2014/equipment-categories/rod"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa verga è un’arma magica che termina in tre tentacoli gommosi. Mentre impugni la verga, puoi usare un’azione per dirigere ciascun tentacolo per attaccare una creatura visibile entro 4,5 metri da te. Ogni tentacolo effettua un tiro per colpire da mischia con un bonus di +9. Se colpisci, il tentacolo infligge 1d6 danni contundenti. Se colpisci un bersaglio con tutti e tre i tentacoli, esso deve effettuare un tiro salvezza di Costituzione con CD 15. Se lo fallisce, la velocità della creatura è dimezzata, ha svantaggio ai tiri salvezza di Destrezza, e per 1 minuto non può usare le sue reazioni. Inoltre, durante ciascun suo turno, egli può effettuare un’azione o un’azione bonus, ma non entrambe. Il bersaglio può ripetere il tiro salvezza al termine di ciascun suo turno, terminando l’effetto su di sé in caso lo superi."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/verga-dei-tentacoli",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "verga-dellallerta",
    "name": "Verga Dellallerta",
    "equipment_category": {
      "index": "rod",
      "name": "Verga",
      "url": "/api/2014/equipment-categories/rod"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa verga dalla testa flangiata ha le seguenti proprietà. Allerta Mentre impugni questa verga, hai vantaggio alle prove di Saggezza (Percezione) e ai tiri di iniziativa. Incantesimi Mentre impugni questa verga, puoi usare un’azione per lanciare tramite essa uno dei seguenti incantesimi: individuazione del bene e del male, individuazione del magico, individuazione del veleno e delle malattie o vedere invisibilità. Aura Protettiva Con un’azione, puoi piantare l’estremità appuntita della verga nel terreno. A quel punto la testa della verga irradierà luce intensa in un raggio di 18 metri e luce fioca per ulteriori 18 metri. All’interno di questa luce intensa, tu e qualsiasi creatura a te amichevole otterrete un bonus di +1 alla CA e ai tiri salvezza e potrete percepire la posizione di qualsiasi creatura invisibile ostile che si trovi anch’essa all’interno della luce intensa.La testa della verga smette di emettere luce e termina l’effetto dopo 10 minuti, o quando una creatura usa un’azione per estrarre la verga dal terreno. Questa proprietà non può essere usata di nuovo fino all’alba del giorno successivo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/verga-dellallerta",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "verga-dellassorbimento",
    "name": "Verga Dellassorbimento",
    "equipment_category": {
      "index": "rod",
      "name": "Verga",
      "url": "/api/2014/equipment-categories/rod"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa verga, puoi usare la tua reazione per assorbire un incantesimo che prenda come bersaglio solo te e privo di un’area di effetto. L’effetto dell’incantesimo assorbito è cancellato, e l’energia dell’incantesimo (non l’incantesimo stesso) viene assorbita dalla verga. L’energia ha lo stesso livello dell’incantesimo quando è stato lanciato. Nel corso della sua esistenza la verga può assorbire e contenere fino a 50 livelli di energia. Una volta che la verga ha assorbito 50 livelli di energia, non ne potrà più assorbire. Se sei il bersaglio di un incantesimo che la verga non può contenere, la verga non ha alcun effetto sull’incantesimo.Quando entri in sintonia con la verga, sai quanti livelli di energia la verga ha assorbito finora, e quanti livelli di energia di incantesimi contiene.Se sei un incantatore e impugni la verga, puoi convertire l’energia contenuta al suo interno in slot incantesimo per lanciare gli incantesimi da te preparati o conosciuti. Puoi creare slot incantesimo di qualsiasi livello pari o inferiore ai tuoi, fino a un massimo del 5° livello. Usi i livelli immagazzinati al posto dei tuoi slot, ma per il resto l’incantesimo è lanciato come di norma.Una verga che non può più assorbire energia dagli incantesimi e a cui non rimane più energia perde i suoi poteri."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/verga-dellassorbimento",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "verga-della-potenza-divina",
    "name": "Verga Della Potenza Divina",
    "equipment_category": {
      "index": "rod",
      "name": "Verga",
      "url": "/api/2014/equipment-categories/rod"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa verga ha una testa flangiata, e funziona come una mazza magica che conferisce un bonus di +3 ai tiri per colpire e danno effettuati con essa. La verga ha delle proprietà associate ai sei diversi pulsanti che sono disposti lungo il manico. Possiede anche altre tre proprietà descritte di seguito. Sei Pulsanti Puoi premere uno dei sei pulsanti della verga con un’azione bonus. L’effetto del pulsante dura finché non premi un pulsante differente o premi di nuovo lo stesso pulsante, facendo tornare la verga alla sua forma normale.Se premi il pulsante1, la verga diventa un’arma lingua di fuoco, e una lama infuocata fuoriesce dall’estremità opposta alla testa flangiata.Se premi il pulsante2, la testa flangiata della verga si ripiega e fuoriescono due lame a mezzaluna, che trasformano la verga in un’ascia da battaglia magica che conferisce un bonus di +3 ai tiri per colpire e danno effettuati con essa.Se premi il pulsante3, la testa flangiata della verga si ripiega, e una punta di lancia esce fuori dall’estremità della verga, mentre il manico si allunga fino a 1,8 metri, trasformando la verga in una lancia magica che conferisce un bonus di +3 ai tiri per colpire e danno effettuati con essa.Se premi il pulsante4, la verga si trasforma in un’asta per scalare lunga fino a 15 metri, come specificato da te. Sulle superfici dure come il granito, uno spuntone sul fondo e tre in cima tengono l’asta fissa sul posto. Sbarre orizzontali lunghe 7,5 centimetri si dipanano lungo i lati della verga, a 30 centimetri di distanza l’uno dall’altro, per formare una scala. L’asta può sostenere 2.000 chili. Un peso superiore o la mancanza di un ancoraggio solido fa sì che la verga torni alla sua forma normale.Se premi il pulsante5, la verga si trasforma in un ariete da sfondamento e conferisce a chi lo usa un bonus di +10 alle prove di Forza effettuate per sfondare porte, barricate o altre barriere.Se premi il pulsante6, la verga assume o rimane nella sua forma normale e indica il nord magnetico non accade nulla se questa funzione della verga viene impiegata inzone prive di un nord magnetico). La verga ti fornisce anche un’approssimativa conoscenza della profondità sottoterra e della tua altezza sul livello del mare. Risucchio Vitale Quando colpisci una creatura con un attacco in mischia utilizzando la verga, puoi obbligare il bersaglio a effettuare un tiro salvezza di Costituzione con CD 17. Se lo fallisce, il bersaglio subisce 4d6 danni necrotici aggiuntivi, e tu recuperi un numero di punti ferita pari alla metà del danno necrotico inflitto. Una volta usata, questa proprietà non più essere usata fino all’alba del giorno successivo. Paralizzante Quando colpisci una creatura con un attacco da mischia utilizzando la verga, puoi obbligare il bersaglio a effettuare un tiro salvezza di Forza con CD 17. Se lo fallisce, il bersaglio è paralizzato per 1 minuto. Il bersaglio può ripetere il tiro salvezza al termine di ciascun suo turno, terminando l’effetto su di sé in caso lo superi. Una volta usata, questa proprietà non può più essere usata fino all’alba del giorno successivo. Terrorizzante Mentre impugni questa verga, puoi obbligare ogni creatura che vedi entro 9 metri da te aeffettuare un tiro salvezza di Volontà con CD 17. Se lo fallisce, il bersaglio è spaventato da te per 1 minuto. Il bersaglio spaventato può ripetere il tiro salvezza al termine di ciascun suo turno, terminando l’effetto su di sé in caso lo superi . Una volta usata questa proprietà non può più essere usata fino all’alba del giorno successivo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/verga-della-potenza-divina",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "verga-della-sicurezza",
    "name": "Verga Della Sicurezza",
    "equipment_category": {
      "index": "rod",
      "name": "Verga",
      "url": "/api/2014/equipment-categories/rod"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Mentre impugni questa verga, puoi usare un’azione per attivarla. Di conseguenza la verga trasporta te e fino ad altre 199 altre creature consenzienti visibili in un paradiso collocato in uno spazio extraplanare. Sarai tu a scegliere la forma di questo paradiso. Potrebbe essere un placido giardino, una gradevole radura, un’allegra taverna, un immenso palazzo, un’isola tropicale, o una fantastica fiera o qualsiasi altra cosa tu riesca a immaginare. Quale che sia la sua natura, il paradiso contiene cibo e bevande sufficienti ad alimentare i suoi visitatori. Tutto ciò con cui si può interagire nello spazio extraplanare può esistere solo al suo interno.Per ogni ora trascorsa in questo paradiso, un visitatore recupera punti ferita come se avesse speso 1 Dado Vita. Inoltre, finché le creature restano nel paradiso non invecchiano, sebbene il tempo trascorra normalmente. I visitatori possono restare nel paradiso per un massimo di 200 giorni diviso il numero di creature presenti (arrotondare per difetto).Quando il tempo termina o usi un’azione per farlo terminare, tutti i visitatori ricompaiono nel luogo da loro occupato quando hai attivato la verga, o nello spazio non occupato più vicino a quello. La verga non potrà essere usata"
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/verga-della-sicurezza",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "verga-della-sovranita",
    "name": "Verga Della Sovranita",
    "equipment_category": {
      "index": "rod",
      "name": "Verga",
      "url": "/api/2014/equipment-categories/rod"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Puoi usare un’azione e presentare la verga e richiedere obbedienza a ciascuna creatura visibile entro 36 metri da te di tua scelta. Ogni bersaglio deve superare un tiro salvezza di Saggezza con CD 15 o restare affascinato da te per 8 ore. Mentre è affascinata in questa maniera, la creatura ti considera un capo fidato. Se le viene recato danno da te o dai tuoi compagni, o le viene ordinato di fare qualcosa contrario alla sua natura, il bersaglio smetterà di essere affascinato in questa maniera. La verga non può essere usata di nuovo prima della prossima alba."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/verga-della-sovranita",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "verga-inamovibile",
    "name": "Verga Inamovibile",
    "equipment_category": {
      "index": "rod",
      "name": "Verga",
      "url": "/api/2014/equipment-categories/rod"
    },
    "rarity": {
      "name": "Non Comune"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questa verga di ferro piatta ha un pulsante a un’estremità. Puoi usare un’azione per premere il pulsante, che fa sì che la verga resti magicamente fissata sul posto. Fino a quando tu o un’altra creatura userete un’azione per premere di nuovo il pulsante, la verga non si muoverà, anche se dovesse sfidare la gravità. La verga può sostenere fino a 4.000 chili di peso. Un peso maggiore fa sì che la verga si disattivi e cada. Una creatura può usare un’azione per effettuare una prova di Forza con CD 30, spostando la verga di 3 metri in caso di successo."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/verga-inamovibile",
    "updated_at": "2025-01-15T00:00:00.000Z"
  },
  {
    "index": "zainetto-pratico-di-heward",
    "name": "Zainetto Pratico Di Heward",
    "equipment_category": {
      "index": "wondrous-item",
      "name": "Oggetto Meraviglioso",
      "url": "/api/2014/equipment-categories/wondrous-item"
    },
    "rarity": {
      "name": "Varia"
    },
    "variants": [],
    "variant": false,
    "desc": [
      "Questo zaino ha una sacca centrale e due laterali, ciascuna delle quali è in realtà uno spazio extradimensionale. Ogni sacca laterale può contenere 10 chili di materiale, che non ecceda un volume di 60 dm3. La grande sacca centrale può contenere fino a 240 dm3 o 40 chili di materiale. Lo zaino pesa sempre 2,5 chili, quali che siano i suoi contenuti.Piazzare un oggetto all’interno dello zainetto segue le normali regole di interazione con gli oggetti. Recuperare un oggetto dallo zainetto richiede l’uso di un’azione. Quando cerchi un oggetto nello zainetto, questo magicamente si troverà sempre in cima alla pila degli oggetti che questo contiene.Lo zainetto ha alcune limitazioni. Se sovraccarico, o un oggetto affilato lo taglia o si strappa, lo zainetto si spacca e viene distrutto. Se lo zainetto è distrutto, ciò che conteneva è perso per sempre, sebbene un artefatto ricomparirà sempre da qualche parte nel multiverso. Se lo zainetto viene rivoltato, ciò che contiene viene espulso, senza recargli danno, e lo zainetto deve essere rimesso al verso giusto prima che possa essere usato di nuovo. Se una creatura che respira viene posta all’interno dello zainetto, vi può sopravvivere per al massimo 10 minuti, prima di cominciare a soffocare.Piazzare lo zainetto all’interno dello spazio extradimensionale creato da una borsa conservante, un buco portatile o un oggetto simile distrugge immediatamente entrambi gli oggetti e apre un portale verso il Piano Astrale. Il portale origina dal punto in cui gli oggetti sono stati posti l’uno dentro l’altro. Qualsiasi creatura entro 3 metri dal portale viene risucchiata attraverso di esso e trascinata in un luogo casuale del Piano Astrale. Poi il portale si chiude. Il portale è a senso unico e non può essere riaperto."
    ],
    "requires_attunement": true,
    "url": "/api/2014/magic-items/zainetto-pratico-di-heward",
    "updated_at": "2025-01-15T00:00:00.000Z"
  }
];