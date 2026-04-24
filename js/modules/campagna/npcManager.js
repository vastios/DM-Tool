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
 * - ⚡ Creazione Rapida PNG con template predefiniti (12 tipi)
 * - 🎲 Generazione rapida da classe/livello (stile QuickBuilder)
 * - 🏷️ Sistema tag/etichette (Alleato, Nemico, Neutrale...)
 * - 🔗 Integrazione wiki campagna (@tag links)
 * - 👤 Generazione nome automatica editabile (per razza)
 * - 📝 Descrizioni automatiche per ruolo
 * - 🔒 Segreti casuali per DM
 * 
 * @version 3.1.0 - Creazione Rapida PNG
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

// Nomi casuali - Espansi
const NAMES_MALE = [
    'Goran', 'Theron', 'Kael', 'Bran', 'Darius', 'Marcus', 'Eldric', 'Roland', 'Gareth', 'Aldric',
    'Torin', 'Viktor', 'Stefan', 'Nikolai', 'Henrik', 'Alaric', 'Benedict', 'Cedric', 'Duncan', 'Edmund',
    'Finnian', 'Gideon', 'Hadrian', 'Ivan', 'Jasper', 'Klaus', 'Lucian', 'Magnus', 'Nolan', 'Oscar',
    'Percival', 'Quinn', 'Reginald', 'Sebastian', 'Theodore', 'Ulric', 'Vincent', 'Wilhelm', 'Xavier', 'Yorick'
];
const NAMES_FEMALE = [
    'Lyra', 'Kira', 'Elara', 'Mira', 'Thalia', 'Seraphina', 'Isolde', 'Brynn', 'Freya', 'Astrid',
    'Helena', 'Natasha', 'Katya', 'Ingrid', 'Sigrid', 'Adrianna', 'Beatrice', 'Cordelia', 'Diana', 'Eleanor',
    'Fiona', 'Gwendolyn', 'Helena', 'Iris', 'Juliana', 'Katarina', 'Liliana', 'Margaret', 'Natasha', 'Olivia',
    'Penelope', 'Quinn', 'Rosalind', 'Sophia', 'Tatiana', 'Ursula', 'Valentina', 'Willow', 'Xena', 'Yvonne'
];
const SURNAMES = [
    'Stoneheart', 'Nightshade', 'Ironforge', 'Stormwind', 'Shadowmere', 'Brightblade', 'Ashford', 'Blackwood',
    'Silvermoon', 'Fireborn', 'Winterfell', 'Ravencrest', 'Dawnbringer', 'Thornwood', 'Greymane', 'Hawthorn',
    'Whitemane', 'Darkholme', 'Starfall', 'Thunderaxe', 'Seaworth', 'Goldmane', 'Redthorn', 'Bluewater',
    'Greengale', 'Blackstone', 'Whitaker', 'Sterling', 'Vance', 'Moretti', 'Fleming', 'Cromwell'
];

// ═══════════════════════════════════════════════════════════════
// NOMI PER RAZZA
// ═══════════════════════════════════════════════════════════════

const RACIAL_NAMES = {
    'Umano': {
        male: ['Marcus', 'Gareth', 'Elena', 'Roland', 'Isolde', 'Theron', 'Lyra', 'Darius', 'Seraphina', 'Bran'],
        female: ['Elena', 'Isolde', 'Seraphina', 'Lyra', 'Thalia', 'Helena', 'Beatrice', 'Margaret', 'Cordelia', 'Adrianna'],
        surnames: ['Ashford', 'Blackwood', 'Sterling', 'Moretti', 'Cromwell', 'Vance', 'Fleming', 'Whitaker']
    },
    'Elfo': {
        male: ['Aelindel', 'Theron', 'Caladwen', 'Elandorr', 'Faelan', 'Galanodel', 'Hadarion', 'Ilian', 'Jaerith', 'Kaelen'],
        female: ['Arwen', 'Galadriel', 'Lúthien', 'Aredhel', 'Celebrian', 'Elanor', 'Finrod', 'Gilraen', 'Idril', 'Nimrodel'],
        surnames: ['Moonwhisper', 'Starseeker', 'Nightbreeze', 'Dawnblade', 'Shadowdancer', 'Sunstrike', 'Frostwind', 'Leafsong']
    },
    'Nano': {
        male: ['Thorin', 'Balin', 'Dwalin', 'Gimli', 'Gloin', 'Bombur', 'Dori', 'Nori', 'Ori', 'Thrain'],
        female: ['Dis', 'Hilda', 'Brunhild', 'Gerta', 'Helga', 'Sigrid', 'Svala', 'Tora', 'Ulla', 'Yrsa'],
        surnames: ['Ironforge', 'Stonehammer', 'Firebeard', 'Bronzebottom', 'Goldfinder', 'Silveraxe', 'Copperkettle', 'Steelblade']
    },
    'Halfling': {
        male: ['Bilbo', 'Frodo', 'Samwise', 'Peregrin', 'Meriadoc', 'Bungo', 'Drogo', 'Hamfast', 'Rorimac', 'Tolman'],
        female: ['Belladonna', 'Lobelia', 'Rosie', 'Petunia', 'Daisy', 'Primrose', 'Marigold', 'Esmeralda', 'Angelica', 'Peony'],
        surnames: ['Baggins', 'Took', 'Brandybuck', 'Gamgee', 'Cotton', 'Goodbody', 'Greenhand', 'Proudfoot']
    },
    'Mezzorco': {
        male: ['Grom', 'Karg', 'Morg', 'Ragash', 'Throg', 'Zog', 'Brak', 'Durg', 'Gash', 'Krugg'],
        female: ['Baggi', 'Gorga', 'Kargah', 'Morga', 'Sharga', 'Ugga', 'Zaga', 'Braka', 'Durga', 'Gasha'],
        surnames: ['Skullcrusher', 'Bonebreaker', 'Ironfang', 'Bloodaxe', 'Deadeye', 'Gorehowl', 'Skullsplitter', 'Wolfrider']
    },
    'Tiefling': {
        male: ['Azar', 'Barakas', 'Damakos', 'Kairon', 'Mekhet', 'Morgar', 'Nemmon', 'Ravis', 'Sarvin', 'Zevon'],
        female: ['Akta', 'Anakis', 'Bryseis', 'Criella', 'Damaia', 'Ea', 'Kallista', 'Lerissa', 'Makaria', 'Nemeia'],
        surnames: ['Infernal', 'Abysswalker', 'Shadowborn', 'Flameheart', 'Darkwhisper', 'Hellbringer', 'Voidwalker', 'Ashblood']
    },
    'Gnomo': {
        male: ['Alston', 'Boddynock', 'Dimble', 'Fonkin', 'Gerbo', 'Gimble', 'Glim', 'Jebeddo', 'Namfoodle', 'Roondar'],
        female: ['Bimpnottin', 'Breena', 'Calliope', 'Duvamil', 'Ellyjoybell', 'Lilli', 'Lootnud', 'Mardnab', 'Nissa', 'Waywocket'],
        surnames: ['Sparklegem', 'Fiddlewocket', 'Nackle', 'Timbers', 'Turen', 'Zook', 'Bafflestone', 'Gabbletwitch']
    },
    'Draghelnato': {
        male: ['Arjhan', 'Balasar', 'Bharash', 'Donaar', 'Ghesh', 'Heskan', 'Kriv', 'Medrash', 'Nadarr', 'Pandjed'],
        female: ['Akra', 'Biri', 'Daar', 'Farideh', 'Harann', 'Jheri', 'Kava', 'Korinn', 'Mishann', 'Nala'],
        surnames: ['Cafesle', 'Clenched', 'Dazzlebright', 'Eye', 'Firedancer', 'Giantbane', 'Hammerfall', 'Kepeshkmolik']
    }
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE PNG RAPIDI - PER SESSIONI URGENTI
// ═══════════════════════════════════════════════════════════════

const QUICK_TEMPLATES = [
    {
        id: 'guard',
        name: '🛡️ Guardia',
        description: 'Guardia cittadina o soldato semplice',
        race: 'Umano',
        className: 'Guerriero',
        level: 1,
        tag: 'neutrale',
        role: 'Guardia',
        focus: 'defensive',
        appearance: 'Indossa un\'uniforme semplice con lo stemma della città. Porta una lancia e uno scudo.',
        personality: 'Vigile e disciplinato. Segue gli ordini, ma può essere corrotto o comprensibile.',
        inventory: ['Lancia', 'Scudo', 'Armatura di cuoio', 'Fischietto', 'Torcia'],
        personalityTraits: ['Vigile', 'Disciplinato', 'Coraggioso']
    },
    {
        id: 'merchant',
        name: '💰 Mercante',
        description: 'Commerciante viaggiatore o bottegaio',
        race: 'Umano',
        className: 'Ladro',
        level: 2,
        tag: 'contatto',
        role: 'Mercante',
        focus: 'balanced',
        appearance: 'Vestito con abiti di buona fattura, porta una borsa piena di monete e documenti commerciali.',
        personality: 'Affarista nato, sa valutare le persone. Parla molto e ascolta di più.',
        inventory: ['Carro merci', 'Borsa con 200mo', 'Libro mastro', 'Set di pesi', 'Merci varie'],
        personalityTraits: ['Affarista', 'Oculato', 'Loquace']
    },
    {
        id: 'noble',
        name: '👑 Nobile',
        description: 'Aristocratico con influenza politica',
        race: 'Umano',
        className: 'Bardo',
        level: 3,
        tag: 'neutrale',
        role: 'Nobile',
        focus: 'balanced',
        appearance: 'Abiti eleganti e gioielli costosi. Portamento fiero e sguardo superbo.',
        personality: 'Abituato al lusso e al potere. Può essere generoso o arrogante.',
        inventory: ['Abiti signorili', 'Gioielli (50mo)', 'Sigillo nobiliare', 'Lettera di credito', 'Servitore'],
        personalityTraits: ['Ambizioso', 'Raffinato', 'Manipolatore']
    },
    {
        id: 'innkeeper',
        name: '🍺 Oste',
        description: 'Gestore di locanda o taverna',
        race: 'Umano',
        className: 'Ladro',
        level: 1,
        tag: 'contatto',
        role: 'Oste',
        focus: 'balanced',
        appearance: 'Grembiule macchiato, viso rubizzo, mani callose da anni di lavoro.',
        personality: 'Conosce tutti i pettegolezzi locali. Amichevole ma sa tenere i segreti.',
        inventory: ['Locanda', 'Chiavi stanze', 'Botte di birra', 'Cibo per avventori', 'Libro contabile'],
        personalityTraits: ['Pettegolo', 'Ospitale', 'Discreto']
    },
    {
        id: 'sage',
        name: '📚 Saggio',
        description: 'Studioso, bibliotecario o consigliere',
        race: 'Umano',
        className: 'Mago',
        level: 5,
        tag: 'mentore',
        role: 'Saggio',
        focus: 'balanced',
        appearance: 'Vesti logore, occhiali, dita macchiate d\'inchiostro. Sempre con un libro.',
        personality: 'Curioso e pedante. Conosce storie e leggende dimenticate.',
        inventory: ['Libreria personale', 'Libro dei libri', 'Inchiostro e penne', 'Lente d\'ingrandimento', 'Appunti vari'],
        personalityTraits: ['Curioso', 'Pedante', 'Erudito']
    },
    {
        id: 'bandit',
        name: '🗡️ Bandito',
        description: 'Fuorilegge e predone',
        race: 'Umano',
        className: 'Ladro',
        level: 2,
        tag: 'nemico',
        role: 'Bandito',
        focus: 'offensive',
        appearance: 'Vesti logore e armi nascoste. Sguardo circospetto, cicatrici vecchie.',
        personality: 'Disperato o spietato. Sa cogliere le occasioni.',
        inventory: ['Pugnale', 'Cappio', 'Benda per occhi', 'Borsa con 30mo', 'Cavallo rubato'],
        personalityTraits: ['Spregevole', 'Astuto', 'Rancoroso']
    },
    {
        id: 'priest',
        name: '⛪ Chierico',
        description: 'Sacerdote o sacerdotessa di un tempio',
        race: 'Umano',
        className: 'Chierico',
        level: 3,
        tag: 'alleato',
        role: 'Chierico',
        focus: 'balanced',
        appearance: 'Vesti liturgiche, simbolo sacro evidente. Sguardo sereno o fanatico.',
        personality: 'Devoto e compassionevole, oppure intransigente e giudicante.',
        inventory: ['Simbolo sacro', 'Testo sacro', 'Pozioni curative (2)', 'Vesti cerimoniali', 'Chiavi tempio'],
        personalityTraits: ['Devoto', 'Caritatevole', 'Zelante']
    },
    {
        id: 'spy',
        name: '🕵️ Spia',
        description: 'Agente segreto o informatore',
        race: 'Umano',
        className: 'Ladro',
        level: 4,
        tag: 'contatto',
        role: 'Spia',
        focus: 'offensive',
        appearance: 'Aspetto comune, facile da dimenticare. Occhi che osservano tutto.',
        personality: 'Riservato, mente con facilità. Sempre in allerta.',
        inventory: ['Falso documenti', 'Veleno', 'Pugnale nascosto', 'Kit travestimento', 'Codice cifrato'],
        personalityTraits: ['Riservato', 'Mentitore', 'Osservatore']
    },
    {
        id: 'blacksmith',
        name: '⚒️ Fabbro',
        description: 'Artigiano del metallo',
        race: 'Nano',
        className: 'Guerriero',
        level: 2,
        tag: 'contatto',
        role: 'Fabbro',
        focus: 'defensive',
        appearance: 'Braccia muscolose, barba bruciacchiata, grembiule di cuoio spesso.',
        personality: 'Lavoratore instancabile, orgoglioso del suo lavoro. Parla poco.',
        inventory: ['Fucina', 'Martello', 'Incudine', 'Ferro grezzo', 'Armi forgiate'],
        personalityTraits: ['Lavoratore', 'Orgoglioso', 'Testardo']
    },
    {
        id: 'healer',
        name: '💊 Guaritore',
        description: 'Medico o erborista',
        race: 'Mezzelfo',
        className: 'Druido',
        level: 2,
        tag: 'alleato',
        role: 'Guaritore',
        focus: 'balanced',
        appearance: 'Vesti semplici, borsa di erbe, mani delicate.',
        personality: 'Compassionevole e paziente. Odia vedere soffrire.',
        inventory: ['Kit da guaritore', 'Erbe medicinali', 'Bende', 'Pozione cura', 'Libro erbe'],
        personalityTraits: ['Compassionevole', 'Paziente', 'Altruista']
    },
    {
        id: 'rival',
        name: '⚔️ Rivale',
        description: 'Avversario dei PG, competente',
        race: 'Umano',
        className: 'Guerriero',
        level: 3,
        tag: 'rivale',
        role: 'Avventuriero',
        focus: 'offensive',
        appearance: 'Armatura curata, armi di qualità. Portamento sicuro.',
        personality: 'Ambizioso e competitivo. Vuole dimostrare di essere il migliore.',
        inventory: ['Armatura di maglia', 'Spada lunga', 'Scudo', 'Pozione forza', 'Cavallo da guerra'],
        personalityTraits: ['Ambizioso', 'Competitivo', 'Orgoglioso']
    },
    {
        id: 'mentor',
        name: '🎓 Mentore',
        description: 'Guida esperta per i PG',
        race: 'Elfo',
        className: 'Mago',
        level: 8,
        tag: 'mentore',
        role: 'Maestro',
        focus: 'balanced',
        appearance: 'Vesti antiche, occhi saggi, portamento elegante.',
        personality: 'Paziente e saggio. Vede potenziale nei giovani avventurieri.',
        inventory: ['Grimorio', 'Bastone magico', 'Pozioni varie', 'Mappa antica', 'Amuleto protettivo'],
        personalityTraits: ['Saggio', 'Paziente', 'Enigmatico']
    }
];

// ═══════════════════════════════════════════════════════════════
// DESCRIZIONI AUTOMATICHE PER RUOLO
// ═══════════════════════════════════════════════════════════════

const ROLE_DESCRIPTIONS = {
    'Guardia': {
        appearances: [
            'Porta l\'uniforme della guardia locale con orgoglio, armatura lucida e arma al fianco.',
            'Vesti militari semplici ma ben tenute. Sguardo vigile e postura rigida.',
            'Armatura ammaccata da precedenti scontri, ma arma affilata e pronta.'
        ],
        personalities: [
            'Disciplinato e ligio al dovere. Diffida degli stranieri ma rispetta la legge.',
            'Corrotto ma non malvagio. Chiude un occhio per qualche moneta.',
            'Idealista convinto, crede fermamente nella giustizia e nell\'ordine.'
        ],
        secrets: [
            'Accetta tangenti dai mercanti locali per ignorare piccole infrazioni.',
            'Ha un conto in sospeso con una banda di criminali che ha ucciso suo fratello.',
            'In realtà è una spia infiltrata per conto di un nobile rivale.'
        ]
    },
    'Mercante': {
        appearances: [
            'Vesti di buona fattura, anelli alle dita, sempre pronto a mostrare la sua merce.',
            'Abbigliamento pratico da viaggio, borse piene di campioni e contratti.',
            'Aspetto curato ma non vistoso, sa che l\'apparenza è tutto nel commercio.'
        ],
        personalities: [
            'Affarista nato, vede opportunità ovunque. Parla molto, ascolta di più.',
            'Onesto ma astuto. Non imbroglia ma non regala nulla.',
            'Ambizioso e spietato. Schiaccerebbe la concorrenza senza rimorsi.'
        ],
        secrets: [
            'Contrabbanda merci proibite sotto la merce legittima.',
            'È indebitato con la gilda dei ladri e cerca un modo per liberarsi.',
            'In realtà è una spia che raccoglie informazioni per un regno nemico.'
        ]
    },
    'Nobile': {
        appearances: [
            'Abiti di seta e velluto, gioielli sfarzosi, servitori al seguito.',
            'Elegante ma sobrio, preferisce la discrezione all\'ostentazione.',
            'Vesti costose ma leggermente fuori moda, finanzie in difficoltà?'
        ],
        personalities: [
            'Alto e superbo, tratta i comuni con condiscendenza.',
            'Raffinato e colto, patrono delle arti e delle lettere.',
            'Ambizioso e spietato, manovra nell\'ombra per più potere.'
        ],
        secrets: [
            'La sua famiglia è in realtà indebitata fino al collo.',
            'Ha un figlio illegittimo che mantiene segretamente.',
            'Trama per rovesciare il signore locale e prendere il suo posto.'
        ]
    },
    'Oste': {
        appearances: [
            'Grembiule macchiato, viso rubizzo, mani callose da anni di lavoro.',
            'Aspetto gioviale e accogliente, sempre pronto a offrire un boccale.',
            'Cicatrice sul volto, ma sorriso sincero. Ha visto di tutto.'
        ],
        personalities: [
            'Conosce tutti i pettegolezzi della città. Parla troppo quando beve.',
            'Riservato e discreto, la sua locanda è un rifugio sicuro.',
            'Avido ma non malvagio, si fa pagare bene per il silenzio.'
        ],
        secrets: [
            'La locanda è un covile per contrabbandieri, lui chiude un occhio.',
            'Nasconde un fuggitivo in cambio di denaro.',
            'Un tempo era un avventuriero, ma non ne parla mai.'
        ]
    },
    'Bandito': {
        appearances: [
            'Vesti logore e armi nascoste, sguardo circospetto.',
            'Cappuccio calato sul viso, mano sempre sull\'arma.',
            'Aspetto rozzo ma muscoloso, abituato a combattere.'
        ],
        personalities: [
            'Disperato, ha perso tutto e non ha nulla da perdere.',
            'Spregevole e violento, gode nel terrorizzare i deboli.',
            'Reluttante, si è unito alla banda per necessità ma cerca una via d\'uscita.'
        ],
        secrets: [
            'In realtà è un nobile decaduto che cerca di sopravvivere.',
            'Ha un codice d\'onore personale, non uccide innocenti.',
            'Vuole tradire il capobanda e prendere il comando.'
        ]
    },
    'Mentore': {
        appearances: [
            'Vesti antiche e logore, occhi che hanno visto molto.',
            'Portamento sereno, bastone da passeggio, mani delicate.',
            'Aspetto ordinario che nasconde un\'aura di potere.'
        ],
        personalities: [
            'Paziente e saggio, vede potenziale dove altri vedono difetti.',
            'Enigmatico, parla per enigmi e metafore.',
            'Severo ma giusto, richiede dedizione totale.'
        ],
        secrets: [
            'Nasconde un terribile errore del passato che ancora lo perseguita.',
            'È più potente di quanto sembri, ma ha giurato di non usare il suo pieno potere.',
            'Sta cercando un erede degno a cui trasmettere la sua conoscenza.'
        ]
    }
};

// Segreti generici per ruoli senza descrizioni specifiche
const GENERIC_SECRETS = [
    'Nasconde un oscuro segreto del passato che potrebbe rovinarlo.',
    'Ha un debito di gioco con persone pericolose.',
    'È innamorato di qualcuno che non può avere.',
    'Ha una doppia vita che nessuno conosce.',
    'Ha visto qualcosa che non avrebbe dovuto vedere.',
    'Protegge qualcuno in segreto.',
    'Sta morendo di una malattia incurabile.',
    'Ha ereditato una maledizione familiare.',
    'È ricattato da qualcuno.',
    'Ha ucciso qualcuno in passato, per legittima difesa o no.'
];

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

function generateRandomName(gender = 'random', race = null) {
    const actualGender = gender === 'random' ? pickRandom(['male', 'female']) : gender;
    
    // Usa nomi specifici per razza se disponibili
    if (race && RACIAL_NAMES[race]) {
        const racialData = RACIAL_NAMES[race];
        const names = actualGender === 'female' ? racialData.female : racialData.male;
        return `${pickRandom(names)} ${pickRandom(racialData.surnames)}`;
    }
    
    // Fallback ai nomi generici
    const names = actualGender === 'female' ? NAMES_FEMALE : NAMES_MALE;
    return `${pickRandom(names)} ${pickRandom(SURNAMES)}`;
}

// ═══════════════════════════════════════════════════════════════
// GENERAZIONE RAPIDA DA TEMPLATE
// ═══════════════════════════════════════════════════════════════

function generateQuickNpc(templateId) {
    const template = QUICK_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
        console.error(`Template "${templateId}" non trovato`);
        return null;
    }
    
    // Genera dati meccanici
    const generatedData = generateFullNpc(template.className, template.race, template.level, template.focus);
    if (!generatedData) {
        console.error('Errore generazione dati NPC');
        return null;
    }
    
    // Genera nome appropriato per razza
    const name = generateRandomName('random', template.race);
    
    // Genera segreto casuale
    let secret;
    if (ROLE_DESCRIPTIONS[template.role]) {
        secret = pickRandom(ROLE_DESCRIPTIONS[template.role].secrets);
    } else {
        secret = pickRandom(GENERIC_SECRETS);
    }
    
    // Assembla il PNG completo
    const npc = {
        id: `npc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        race: template.race,
        className: template.className,
        classLevel: template.level,
        tag: template.tag,
        role: template.role,
        
        // Dati meccanici generati
        abilities: generatedData.abilities,
        profBonus: generatedData.profBonus,
        hp: generatedData.hp,
        ac: generatedData.ac,
        speed: generatedData.speed,
        savingThrows: generatedData.savingThrows,
        spells: generatedData.spells,
        hitDie: generatedData.hitDie,
        
        // Descrizioni dal template
        appearance: template.appearance,
        personality: template.personality,
        inventory: template.inventory,
        secretNote: secret,
        personalityTraits: template.personalityTraits || [],
        
        // Metadati
        createdAt: Date.now(),
        lastModified: Date.now(),
        isQuickGenerated: true,
        templateId: template.id
    };
    
    return npc;
}

// Genera PNG casuale (qualsiasi template)
function generateRandomNpc() {
    const randomTemplate = pickRandom(QUICK_TEMPLATES);
    return generateQuickNpc(randomTemplate.id);
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
/* Layout principale - Card-separated style */
.npc-manager-layout {
    display: flex;
    height: 100%;
    gap: 20px;
    padding: 20px;
    background: var(--bg-secondary, #1a1a1a);
    overflow: hidden;
    box-sizing: border-box;
}

/* Sidebar - Card style */
.npc-sidebar {
    flex: 0 0 280px;
    background: var(--card-bg, #2a2a2a);
    border: 1px solid var(--border-color, #444);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    padding: 15px;
    overflow: hidden;
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

/* Area principale - Card style */
.npc-main {
    flex: 1;
    display: flex;
    gap: 20px;
    overflow: hidden;
    background: transparent;
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
    gap: 20px;
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
    background: var(--card-bg, #2a2a2a);
    border: 1px solid var(--border-color, #444);
    border-radius: 8px;
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
    color: rgba(240, 173, 78, 0.5);
    font-style: italic;
}

/* Stile scheda PNG - TEMA SCURO CAMPAGNA */
.npc-parchment {
    background: var(--card-bg, #2a2a2a);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-color, #444);
    border-radius: 8px;
    color: var(--text-primary, #f0e6d2);
    font-family: 'Cinzel', serif;
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
    color: var(--accent-color, #f0ad4e);
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    margin: 0 0 0.2rem;
    letter-spacing: 0.03em;
    border-bottom: 1px solid var(--border-color, #444);
    padding-bottom: 0.3rem;
}

.npc-parchment h4 {
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--accent-color, #f0ad4e);
    margin: 0.5rem 0 0.2rem;
    border-bottom: 1px solid var(--border-color, #444);
    padding-bottom: 0.15rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.npc-parchment hr {
    border: none;
    height: 1px;
    background: linear-gradient(to right, var(--border-color, #444), transparent);
    margin: 0.4rem 0;
}

.npc-section {
    margin-bottom: 0.4rem;
}

.npc-section p {
    margin: 0.15rem 0;
    font-size: 0.8rem;
    line-height: 1.3;
    color: var(--text-primary, #f0e6d2);
}

.npc-secret {
    background: rgba(240, 173, 78, 0.1);
    border-left: 3px solid var(--accent-color, #f0ad4e);
    padding: 0.3rem;
    font-style: italic;
    font-size: 0.8rem;
    color: var(--text-primary, #f0e6d2);
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
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    padding: 0.25rem;
}

.npc-stat-label {
    font-size: 0.6rem;
    color: var(--text-muted, #888);
    text-transform: uppercase;
}

.npc-stat-value {
    font-size: 1rem;
    font-weight: bold;
    color: var(--accent-color, #f0ad4e);
}

.npc-stat-mod {
    font-size: 0.75rem;
    color: var(--text-primary, #f0e6d2);
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
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    padding: 0.3rem;
    text-align: center;
}

.npc-combat-stat label {
    font-size: 0.6rem;
    color: var(--text-muted, #888);
    text-transform: uppercase;
    display: block;
}

.npc-combat-stat .value {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--accent-color, #f0ad4e);
}

/* Spells grid 10 blocchi */
.npc-spells-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
}

.npc-spell-block {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-color, #444);
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
    color: var(--accent-color, #f0ad4e);
    border-bottom: 1px solid var(--border-color, #444);
    padding-bottom: 0.15rem;
    margin-bottom: 0.2rem;
}

.npc-spell-tag {
    display: inline-block;
    padding: 0.1rem 0.25rem;
    background: rgba(240, 173, 78, 0.15);
    border-radius: 3px;
    font-size: 0.65rem;
    margin: 0.05rem;
    cursor: pointer;
    color: var(--text-primary, #f0e6d2);
}

.npc-spell-tag:hover {
    background: rgba(240, 173, 78, 0.3);
}

/* Equipment list */
.npc-equipment-list {
    font-size: 0.8rem;
    margin: 0.2rem 0;
    padding-left: 1.2rem;
    color: var(--text-primary, #f0e6d2);
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

/* Quick Templates Panel */
.npc-quick-templates {
    background: linear-gradient(135deg, rgba(240, 173, 78, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%);
    border: 2px solid var(--accent-color, #f0ad4e);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 12px rgba(240, 173, 78, 0.15);
}

.npc-quick-templates-header {
    text-align: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(240, 173, 78, 0.3);
}

.npc-quick-templates-header .npc-quick-gen-title {
    font-size: 1.2rem;
    display: block;
    margin-bottom: 0.25rem;
}

.npc-quick-templates-subtitle {
    font-size: 0.8rem;
    color: var(--text-muted, #888);
    font-style: italic;
}

.npc-templates-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 1rem;
}

.npc-template-btn {
    background: linear-gradient(135deg, rgba(42, 42, 42, 0.9) 0%, rgba(30, 30, 30, 0.95) 100%);
    border: 1px solid #444;
    border-radius: 8px;
    padding: 10px 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-height: 80px;
}

.npc-template-btn:hover {
    background: linear-gradient(135deg, rgba(240, 173, 78, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%);
    border-color: var(--accent-color, #f0ad4e);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(240, 173, 78, 0.25);
}

.npc-template-btn:active {
    transform: translateY(-1px);
}

.npc-template-icon {
    font-size: 1.5rem;
    line-height: 1;
}

.npc-template-name {
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    color: var(--text-primary, #f0e6d2);
    text-align: center;
    font-weight: 600;
}

.npc-template-info {
    font-size: 0.6rem;
    color: var(--text-muted, #888);
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 6px;
    border-radius: 4px;
}

.npc-quick-templates-footer {
    text-align: center;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(240, 173, 78, 0.2);
}

.npc-btn-random {
    background: linear-gradient(135deg, #9b59b6 0%, #6c3483 100%);
    color: #fff;
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
}

.npc-btn-random:hover {
    background: linear-gradient(135deg, #a569bd 0%, #7d3c98 100%);
    box-shadow: 0 4px 12px rgba(155, 89, 182, 0.4);
}

/* Responsive templates grid */
@media (max-width: 900px) {
    .npc-templates-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 600px) {
    .npc-templates-grid {
        grid-template-columns: repeat(2, 1fr);
    }
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
                
                <!-- Quick Templates - Creazione Istantanea -->
                <div class="npc-quick-templates">
                    <div class="npc-quick-templates-header">
                        <span class="npc-quick-gen-title">⚡ Creazione Rapida PNG</span>
                        <span class="npc-quick-templates-subtitle">Un click per PNG pronti all'uso!</span>
                    </div>
                    <div class="npc-templates-grid">
                        ${QUICK_TEMPLATES.map(t => `
                            <button class="npc-template-btn" data-template="${t.id}" title="${t.description}">
                                <span class="npc-template-icon">${t.name.split(' ')[0]}</span>
                                <span class="npc-template-name">${t.name.split(' ').slice(1).join(' ')}</span>
                                <span class="npc-template-info">Liv.${t.level} ${t.className}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div class="npc-quick-templates-footer">
                        <button class="npc-btn npc-btn-random" id="quick-random-npc">🎲 PNG Casuale</button>
                    </div>
                </div>
                
                <!-- Quick Generation Panel - Avanzato -->
                <div class="npc-quick-gen">
                    <div class="npc-quick-gen-header">
                        <span class="npc-quick-gen-title">🔧 Generazione Personalizzata</span>
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
            const raceSelect = main.querySelector('#npc-race');
            const nameInput = main.querySelector('#npc-name');
            const race = raceSelect?.value || null;
            if (nameInput) nameInput.value = generateRandomName('random', race);
        });
        
        // Quick Templates - Click su template button
        main.querySelectorAll('.npc-template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const templateId = btn.dataset.template;
                const npc = generateQuickNpc(templateId);
                
                if (npc) {
                    this.applyTemplateToForm(npc);
                    showToast(`PNG "${npc.name}" creato! Modifica se necessario.`, 'success');
                }
            });
        });
        
        // PNG Casuale
        main.querySelector('#quick-random-npc')?.addEventListener('click', () => {
            const npc = generateRandomNpc();
            if (npc) {
                this.applyTemplateToForm(npc);
                showToast(`PNG casuale "${npc.name}" creato!`, 'success');
            }
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
    
    // Applica un template completo al form
    applyTemplateToForm(npc) {
        const main = this.container.querySelector('#npc-main');
        
        // Nome
        const nameInput = main.querySelector('#npc-name');
        if (nameInput) nameInput.value = npc.name;
        
        // Razza
        const raceSelect = main.querySelector('#npc-race');
        if (raceSelect) raceSelect.value = npc.race;
        
        // Tag
        const tagSelect = main.querySelector('#npc-tag');
        if (tagSelect) tagSelect.value = npc.tag;
        
        // Ruolo
        const roleInput = main.querySelector('#npc-role');
        if (roleInput) roleInput.value = npc.role;
        
        // Stats
        ABILITY_NAMES.forEach(ab => {
            const input = main.querySelector(`#stat-${ab}`);
            if (input) input.value = npc.abilities[ab] || 10;
        });
        
        // Derived stats
        const hpInput = main.querySelector('#npc-hp');
        const acInput = main.querySelector('#npc-ac');
        const speedInput = main.querySelector('#npc-speed');
        
        if (hpInput) hpInput.value = npc.hp;
        if (acInput) acInput.value = npc.ac;
        if (speedInput) speedInput.value = npc.speed;
        
        // Descrizioni
        const appearanceInput = main.querySelector('#npc-appearance');
        const personalityInput = main.querySelector('#npc-personality');
        const secretInput = main.querySelector('#npc-secret');
        const inventoryInput = main.querySelector('#npc-inventory');
        
        if (appearanceInput) appearanceInput.value = npc.appearance || '';
        if (personalityInput) personalityInput.value = npc.personality || '';
        if (secretInput) secretInput.value = npc.secretNote || '';
        if (inventoryInput) inventoryInput.value = (npc.inventory || []).join('\n');
        
        // Quick generation panel
        const quickClass = main.querySelector('#quick-class');
        const quickLevel = main.querySelector('#quick-level');
        
        if (quickClass) quickClass.value = npc.className;
        if (quickLevel) quickLevel.value = npc.classLevel;
        
        // Salva tutto in tempData
        this.tempData = {
            ...this.tempData,
            ...npc
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
