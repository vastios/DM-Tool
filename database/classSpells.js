/**
 * classSpells.js
 * ─────────────────────────────────────────────────────────────
 * Database degli incantesimi per classe, organizzati per livello.
 */

// Mappatura del livello degli incantesimi per classe
const spellLevelsByClass = {
    "Bardo": {
        0: ["Beffa crudele", "Colpo accurato", "Illusione minore", "Luce", "Luci danzanti", 
            "Mano magica", "Messaggio", "Prestidigitazione", "Riparare"],
        1: ["Amicizia con gli animali", "Anatema", "Caduta morbida", "Camuffare se stesso", 
            "Charme su persone", "Comprensione dei linguaggi", "Cura ferite", "Eroismo", 
            "Identificare", "Immagine silenziosa", "Individuazione del magico", "Luminescenza", 
            "Onda tonante", "Parlare con gli animali", "Parola guaritrice", "Passo veloce", 
            "Risata incontenibile", "Scritto illusorio", "Servitore inosservato", "Sonno"],
        2: ["Animale messaggero", "Blocca persone", "Bocca magica", "Calmare emozioni", 
            "Caratteristica potenziata", "Cecità/Sordità", "Estasiare", "Frantumare", 
            "Individuazione dei pensieri", "Invisibilità", "Localizza animali o vegetali", 
            "Localizza oggetto", "Riscaldare il metallo", "Ristorare inferiore", "Scassinare", 
            "Silenzio", "Suggestione", "Vedere invisibilità", "Zona di verità"],
        3: ["Anti-individuazione", "Capanna", "Chiaroveggenza", "Crescita vegetale", 
            "Dissolvi magie", "Glifo di interdizione", "Immagine maggiore", "Inviare", 
            "Linguaggi", "Nube maleodorante", "Parlare con i morti", "Parlare con i vegetali", 
            "Paura", "Scagliare maledizione", "Trama ipnotica"],
        4: ["Compulsione", "Confusione", "Invisibilità superiore", "Libertà di movimento", 
            "Localizza creatura", "Metamorfosi", "Porta dimensionale", "Terreno illusorio"],
        5: ["Animare oggetti", "Blocca mostri", "Cerchio di teletrasporto", "Conoscenza delle leggende", 
            "Costrizione", "Cura ferite di massa", "Dominare persone", "Fuorviare", 
            "Legame planare", "Modificare memoria", "Rianimare morti", "Ristorare superiore", 
            "Risveglio", "Scrutare", "Sembrare", "Sogno"],
        6: ["Danza irresistibile", "Illusione programmata", "Scopri il percorso", "Sguardo penetrante", 
            "Suggestione di massa", "Vigilanza e interdizione", "Visione del vero"],
        7: ["Forma eterea", "Gabbia di forza", "Immagine proiettata", "Miraggio arcano", 
            "Reggia meravigliosa", "Resurrezione", "Rigenerazione", "Simbolo", 
            "Spada arcana", "Teletrasporto"],
        8: ["Dominare mostri", "Loquacità", "Parola del potere stordire", "Regressione mentale", 
            "Vuoto mentale"],
        9: ["Metamorfosi pura", "Parola del potere uccidere", "Previsione"]
    },
    "Chierico": {
        0: ["Fiamma sacra", "Guida", "Luce", "Resistenza", "Riparare", "Salvare i morenti", "Taumaturgia"],
        1: ["Anatema", "Benedizione", "Comando", "Creare o distruggere acqua", "Cura ferite", 
            "Dardo Tracciante", "Individuazione del bene e del male", "Individuazione del magico", 
            "Individuazione delle malattie e dei veleni", "Infliggi ferite", "Parola guaritrice", 
            "Protezione dal bene e dal male", "Purificare cibo e bevande", "Santuario", "Scudo della fede"],
        2: ["Aiuto", "Arma spirituale", "Blocca persone", "Calmare emozioni", "Caratteristica potenziata", 
            "Cecità/Sordità", "Fiamma perenne", "Localizza oggetto", "Preghiera di guarigione", 
            "Presagio", "Protezione dai veleni", "Riposo inviolato", "Ristorare inferiore", 
            "Scopri trappole", "Silenzio", "Vincolo di interdizione", "Zona di verità"],
        3: ["Animare morti", "Camminare sull'acqua", "Cerchio magico", "Chiaroveggenza", 
            "Creare cibo e acqua", "Dissolvi magie", "Faro di speranza", "Fondersi nella pietra", 
            "Glifo di interdizione", "Guardiani spirituali", "Inviare", "Linguaggi", "Luce diurna", 
            "Parlare con i morti", "Parola guaritrice di massa", "Protezione dall'energia", 
            "Rimuovi maledizione", "Rinascita", "Scagliare maledizione"],
        4: ["Controllare acqua", "Divinazione", "Esilio", "Guardiano della fede", "Interdizione alla morte", 
            "Libertà di movimento", "Localizza creatura", "Scolpire pietra"],
        5: ["Colpo infuocato", "Comunione", "Conoscenza delle leggende", "Contagio", "Costrizione", 
            "Cura ferite di massa", "Dissolvi il bene e il male", "Legame planare", "Piaga degli insetti", 
            "Rianimare morti", "Ristorare superiore", "Santificare", "Scrutare"],
        6: ["Alleato planare", "Banchetto degli eroi", "Barriera di lame", "Creare non morti", 
            "Ferire", "Guarigione", "Parola del ritiro", "Proibizione", "Scopri il percorso", "Visione del vero"],
        7: ["Evoca celestiale", "Forma eterea", "Parola divina", "Resurrezione", "Rigenerazione", 
            "Simbolo", "Spostamento planare", "Tempesta di fuoco"],
        8: ["Aura sacra", "Campo anti-magia", "Controllare tempo atmosferico", "Terremoto"],
        9: ["Guarigione di massa", "Portale", "Proiezione astrale", "Resurrezione pura"]
    },
    "Druido": {
        0: ["Artiglio di druido", "Guida", "Produrre fiamma", "Randello incantato", "Resistenza", 
            "Riparare", "Spruzzo velenoso"],
        1: ["Amicizia con gli animali", "Bacche benefiche", "Charme su persone", "Creare o distruggere acqua", 
            "Cura ferite", "Individuazione del magico", "Individuazione delle malattie e dei veleni", 
            "Intralciare", "Luminescenza", "Nube di nebbia", "Onda tonante", "Parlare con gli animali", 
            "Parola guaritrice", "Passo veloce", "Purificare cibo e bevande", "Saltare"],
        2: ["Animale messaggero", "Bagliore lunare", "Blocca persone", "Caratteristica potenziata", 
            "Crescita di spine", "Folata di vento", "Lama infuocata", "Localizza animali o vegetali", 
            "Localizza oggetto", "Passare senza tracce", "Pelle coriacea", "Protezione dai veleni", 
            "Riscaldare il metallo", "Ristorare inferiore", "Scopri trappole", "Scurovisione", "Sfera infuocata"],
        3: ["Camminare sull'acqua", "Crescita vegetale", "Dissolvi magie", "Evoca animali", 
            "Fondersi nella pietra", "Invocare il fulmine", "Luce diurna", "Muro di vento", 
            "Parlare con i vegetali", "Protezione dall'energia", "Respirare sott'acqua", "Tempesta di nevischio"],
        4: ["Confusione", "Controllare acqua", "Dominare bestie", "Evoca creature boschive", 
            "Evoca elementali minori", "Inaridire", "Insetto gigante", "Libertà di movimento", 
            "Localizza creatura", "Metamorfosi", "Muro di fuoco", "Pelle di pietra", "Scolpire pietra", 
            "Tempesta di ghiaccio", "Terreno illusorio"],
        5: ["Comunione con la natura", "Contagio", "Costrizione", "Cura ferite di massa", "Evoca elementale", 
            "Guscio anti-vita", "Legame planare", "Muro di pietra", "Piaga degli insetti", 
            "Reincarnazione", "Ristorare superiore", "Risveglio", "Scrutare", "Traslazione arborea"],
        6: ["Bagliore solare", "Banchetto degli eroi", "Camminare nel vento", "Evoca folletto", 
            "Guarigione", "Muovere il terreno", "Muro di spine", "Scopri il percorso", "Trasporto vegetale"],
        7: ["Inversione della gravità", "Miraggio arcano", "Rigenerazione", "Spostamento planare", "Tempesta di fuoco"],
        8: ["Antipatia/Simpatia", "Controllare tempo atmosferico", "Esplosione solare", "Forme animali", 
            "Regressione mentale", "Terremoto"],
        9: ["Previsione", "Resurrezione pura", "Tempesta di vendetta", "Trasformazione"]
    },
    "Mago": {
        0: ["Colpo accurato", "Dardo di fuoco", "Fiammella", "Illusione minore", "Luce", 
            "Luci danzanti", "Mano magica", "Messaggio", "Prestidigitazione", "Raggio di gelo", 
            "Riparare", "Spruzzo velenoso", "Stretta folgorante", "Tocco gelido"],
        1: ["Allarme", "Armatura magica", "Caduta morbida", "Camuffare se stesso", "Charme su persone", 
            "Comprensione dei linguaggi", "Dardo incantato", "Disco fluttuante", "Identificare", 
            "Immagine silenziosa", "Individuazione del magico", "Mani brucianti", "Nube di nebbia", 
            "Onda tonante", "Passo veloce", "Protezione dal bene e dal male", "Risata incontenibile", 
            "Ritirata rapida", "Saltare", "Scritto illusorio", "Scudo", "Servitore inosservato", 
            "Sonno", "Spruzzo colorato", "Trova famiglio", "Unto", "Vita falsata"],
        2: ["Alterare se stesso", "Arma magica", "Aura magica dell'arcanista", "Blocca persone", 
            "Bocca magica", "Cecità/Sordità", "Fiamma perenne", "Folata di vento", "Frantumare", 
            "Freccia acida", "Immagine speculare", "Individuazione dei pensieri", "Ingrandire/Ridurre", 
            "Invisibilità", "Levitazione", "Localizza oggetto", "Movimenti del ragno", "Oscurità", 
            "Passo velato", "Raggio di affaticamento", "Raggio rovente", "Ragnatela", "Riposo inviolato", 
            "Scassinare", "Scurovisione", "Serratura arcana", "Sfera infuocata", "Sfocatura", 
            "Suggestione", "Trucco della corda", "Vedere invisibilità"],
        3: ["Animare morti", "Anti-individuazione", "Capanna", "Cerchio magico", "Chiaroveggenza", 
            "Controincantesimo", "Destriero fantomatico", "Dissolvi magie", "Forma gassosa", 
            "Fulmine", "Glifo di interdizione", "Immagine maggiore", "Intermittenza", "Inviare", 
            "Lentezza", "Linguaggi", "Nube maleodorante", "Palla di fuoco", "Paura", 
            "Protezione dall'energia", "Respirare sott'acqua", "Rimuovi maledizione", "Scagliare maledizione", 
            "Tempesta di nevischio", "Tocco del vampiro", "Trama ipnotica", "Velocità", "Volare"],
        4: ["Allucinazione mortale", "Confusione", "Controllare acqua", "Esilio", "Evoca elementali minori", 
            "Fabbricare", "Inaridire", "Invisibilità superiore", "Localizza creatura", "Metamorfosi", 
            "Muro di fuoco", "Occhio arcano", "Pelle di pietra", "Porta dimensionale", "Santuario privato", 
            "Scolpire pietra", "Scrigno segreto", "Scudo di fuoco", "Segugio fedele", "Sfera elastica", 
            "Tempesta di ghiaccio", "Tentacoli neri", "Terreno illusorio"],
        5: ["Animare oggetti", "Blocca mostri", "Cerchio di teletrasporto", "Cono di freddo", 
            "Conoscenza delle leggende", "Contattare altri piani", "Costrizione", "Creazione", 
            "Dominare persone", "Evoca elementale", "Fuorviare", "Legame planare", "Legame telepatico", 
            "Mano arcana", "Modificare memoria", "Muro di forza", "Muro di pietra", "Nube mortale", 
            "Passapareti", "Scrutare", "Sembrare", "Sogno", "Telecinesi"],
        6: ["Bagliore solare", "Carne in pietra", "Catena di fulmini", "Cerchio di morte", "Contingenza", 
            "Creare non morti", "Danza irresistibile", "Disintegrazione", "Evocazioni istantanee", 
            "Giara magica", "Globo di invulnerabilità", "Illusione programmata", "Muovere il terreno", 
            "Muro di ghiaccio", "Sfera congelante", "Sguardo penetrante", "Suggestione di massa", 
            "Vigilanza e interdizione", "Visione del vero"],
        7: ["Celare", "Dito della morte", "Forma eterea", "Gabbia di forza", "Immagine proiettata", 
            "Inversione della gravità", "Miraggio arcano", "Palla di fuoco ritardata", "Reggia meravigliosa", 
            "Simbolo", "Simulacro", "Spada arcana", "Spostamento planare", "Spruzzo prismatico", "Teletrasporto"],
        8: ["Antipatia/Simpatia", "Campo anti-magia", "Clone", "Controllare tempo atmosferico", 
            "Dominare mostri", "Esplosione solare", "Labirinto", "Nube incendiaria", "Parola del potere stordire", 
            "Regressione mentale", "Semipiano", "Vuoto mentale"],
        9: ["Desiderio", "Fatale", "Fermare il tempo", "Imprigionare", "Metamorfosi pura", 
            "Muro prismatico", "Parola del potere uccidere", "Portale", "Previsione", 
            "Proiezione astrale", "Sciame di meteori", "Trasformazione"]
    },
    "Paladino": {
        1: ["Benedizione", "Comando", "Cura ferite", "Eroismo", "Favore divino", 
            "Individuazione del bene e del male", "Individuazione del magico", "Individuazione delle malattie e dei veleni", 
            "Protezione dal bene e dal male", "Purificare cibo e bevande", "Scudo della fede"],
        2: ["Aiuto", "Arma magica", "Localizza oggetto", "Protezione dai veleni", 
            "Punizione marchiante", "Ristorare inferiore", "Trova cavalcatura", "Zona di verità"],
        3: ["Cerchio magico", "Creare cibo e acqua", "Dissolvi magie", "Luce diurna", 
            "Rimuovi maledizione", "Rinascita"],
        4: ["Esilio", "Interdizione alla morte", "Localizza creatura"],
        5: ["Costrizione", "Dissolvi il bene e il male", "Rianimare morti"]
    },
    "Ranger": {
        1: ["Allarme", "Amicizia con gli animali", "Bacche benefiche", "Cura ferite", 
            "Individuazione del magico", "Individuazione delle malattie e dei veleni", "Marchio del cacciatore", 
            "Nube di nebbia", "Parlare con gli animali", "Passo veloce", "Saltare"],
        2: ["Animale messaggero", "Crescita di spine", "Localizza animali o vegetali", 
            "Localizza oggetto", "Passare senza tracce", "Pelle coriacea", "Protezione dai veleni", 
            "Ristorare inferiore", "Scopri trappole", "Scurovisione", "Silenzio"],
        3: ["Anti-individuazione", "Camminare sull'acqua", "Crescita vegetale", "Evoca animali", 
            "Luce diurna", "Muro di vento", "Parlare con i vegetali", "Protezione dall'energia", 
            "Respirare sott'acqua"],
        4: ["Evoca creature boschive", "Libertà di movimento", "Localizza creatura", "Pelle di pietra"],
        5: ["Comunione con la natura", "Traslazione arborea"]
    },
    "Stregone": {
        0: ["Colpo accurato", "Dardo di fuoco", "Fiammella", "Illusione minore", "Luce", 
            "Luci danzanti", "Mano magica", "Messaggio", "Prestidigitazione", "Raggio di gelo", 
            "Riparare", "Spruzzo velenoso", "Stretta folgorante", "Tocco gelido"],
        1: ["Armatura magica", "Caduta morbida", "Camuffare se stesso", "Charme su persone", 
            "Comprensione dei linguaggi", "Dardo incantato", "Immagine silenziosa", "Individuazione del magico", 
            "Mani brucianti", "Nube di nebbia", "Onda tonante", "Ritirata rapida", "Saltare", 
            "Scudo", "Sonno", "Spruzzo colorato", "Vita falsata"],
        2: ["Alterare se stesso", "Blocca persone", "Caratteristica potenziata", "Cecità/Sordità", 
            "Folata di vento", "Frantumare", "Immagine speculare", "Individuazione dei pensieri", 
            "Ingrandire/Ridurre", "Invisibilità", "Levitazione", "Movimenti del ragno", "Oscurità", 
            "Passo velato", "Raggio rovente", "Ragnatela", "Scassinare", "Scurovisione", 
            "Sfocatura", "Suggestione", "Vedere invisibilità"],
        3: ["Camminare sull'acqua", "Chiaroveggenza", "Controincantesimo", "Dissolvi magie", 
            "Forma gassosa", "Fulmine", "Immagine maggiore", "Intermittenza", "Lentezza", 
            "Linguaggi", "Luce diurna", "Nube maleodorante", "Palla di fuoco", "Paura", 
            "Protezione dall'energia", "Respirare sott'acqua", "Tempesta di nevischio", "Trama ipnotica", 
            "Velocità", "Volare"],
        4: ["Confusione", "Dominare bestie", "Esilio", "Inaridire", "Invisibilità superiore", 
            "Metamorfosi", "Muro di fuoco", "Pelle di pietra", "Porta dimensionale", "Tempesta di ghiaccio"],
        5: ["Animare oggetti", "Blocca mostri", "Cerchio di teletrasporto", "Cono di freddo", 
            "Creazione", "Dominare persone", "Muro di pietra", "Nube mortale", "Piaga degli insetti", 
            "Sembrare", "Telecinesi"],
        6: ["Bagliore solare", "Catena di fulmini", "Cerchio di morte", "Disintegrazione", 
            "Globo di invulnerabilità", "Muovere il terreno", "Sguardo penetrante", "Suggestione di massa", 
            "Visione del vero"],
        7: ["Dito della morte", "Forma eterea", "Inversione della gravità", "Palla di fuoco ritardata", 
            "Spostamento planare", "Spruzzo prismatico", "Teletrasporto", "Tempesta di fuoco"],
        8: ["Dominare mostri", "Esplosione solare", "Nube incendiaria", "Parola del potere stordire", "Terremoto"],
        9: ["Desiderio", "Fermare il tempo", "Parola del potere uccidere", "Portale", "Sciame di meteori"]
    },
    "Warlock": {
        0: ["Colpo accurato", "Deflagrazione occulta", "Illusione minore", "Mano magica", 
            "Prestidigitazione", "Spruzzo velenoso", "Tocco gelido"],
        1: ["Charme su persone", "Comprensione dei linguaggi", "Intimorire infernale", 
            "Protezione dal bene e dal male", "Ritirata rapida", "Scritto illusorio", "Servitore inosservato"],
        2: ["Blocca persone", "Estasiare", "Frantumare", "Immagine speculare", "Invisibilità", 
            "Movimenti del ragno", "Oscurità", "Passo velato", "Raggio di affaticamento", "Suggestione"],
        3: ["Cerchio magico", "Controincantesimo", "Dissolvi magie", "Forma gassosa", 
            "Immagine maggiore", "Linguaggi", "Paura", "Rimuovi maledizione", "Tocco del vampiro", 
            "Trama ipnotica", "Volare"],
        4: ["Esilio", "Inaridire", "Porta dimensionale", "Terreno illusorio"],
        5: ["Blocca mostri", "Contattare altri piani", "Scrutare", "Sogno"],
        6: ["Carne in pietra", "Cerchio di morte", "Creare non morti", "Evoca folletto", 
            "Sguardo penetrante", "Suggestione di massa", "Visione del vero"],
        7: ["Dito della morte", "Forma eterea", "Gabbia di forza", "Spostamento planare"],
        8: ["Dominare mostri", "Loquacità", "Parola del potere stordire", "Regressione mentale", "Semipiano"],
        9: ["Imprigionare", "Metamorfosi pura", "Parola del potere uccidere", "Previsione", "Proiezione astrale"]
    }
};

// Livello massimo di incantesimo accessibile in base al livello PG
// Per incantatori completi (Bardo, Chierico, Druido, Mago, Stregone, Warlock)
const maxSpellLevelFullCaster = {
    1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5,
    11: 6, 12: 6, 13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9, 19: 9, 20: 9
};

// Per incantatori parziali (Paladino, Ranger)
const maxSpellLevelHalfCaster = {
    1: 0, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3,
    11: 3, 12: 3, 13: 4, 14: 4, 15: 4, 16: 4, 17: 5, 18: 5, 19: 5, 20: 5
};

// Numero massimo di incantesimi conoscibili per livello (per classi che hanno limite)
const spellsKnownByLevel = {
    "Bardo": { 1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 10, 8: 11, 9: 12, 10: 14, 11: 15, 12: 16, 13: 17, 14: 18, 15: 19, 16: 20, 17: 22, 18: 23, 19: 24, 20: 25 },
    "Stregone": { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 12, 13: 13, 14: 13, 15: 14, 16: 14, 17: 15, 18: 15, 19: 16, 20: 16 },
    // Per Mago, Chierico, Druido non c'è limite (preparano incantesimi)
    "Mago": null,
    "Chierico": null,
    "Druido": null,
    "Warlock": null, // Warlock ha regole speciali
    "Paladino": null, // Prepara come Chierico
    "Ranger": null // Prepara come Druido
};

// Slot incantesimi per incantatori completi (Bardo, Chierico, Druido, Mago, Stregone)
const spellSlotsFullCaster = {
    1: { 1: 2 },
    2: { 1: 3 },
    3: { 1: 4, 2: 2 },
    4: { 1: 4, 2: 3 },
    5: { 1: 4, 2: 3, 3: 2 },
    6: { 1: 4, 2: 3, 3: 3 },
    7: { 1: 4, 2: 3, 3: 3, 4: 1 },
    8: { 1: 4, 2: 3, 3: 3, 4: 2 },
    9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
    11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 }
};

// Slot incantesimi per incantatori parziali (Paladino, Ranger)
const spellSlotsHalfCaster = {
    1: {},
    2: { 1: 2 },
    3: { 1: 3 },
    4: { 1: 3 },
    5: { 1: 4, 2: 2 },
    6: { 1: 4, 2: 2 },
    7: { 1: 4, 2: 3 },
    8: { 1: 4, 2: 3 },
    9: { 1: 4, 2: 3, 3: 2 },
    10: { 1: 4, 2: 3, 3: 2 },
    11: { 1: 4, 2: 3, 3: 2 },
    12: { 1: 4, 2: 3, 3: 2 },
    13: { 1: 4, 2: 3, 3: 3 },
    14: { 1: 4, 2: 3, 3: 3 },
    15: { 1: 4, 2: 3, 3: 3, 4: 1 },
    16: { 1: 4, 2: 3, 3: 3, 4: 1 },
    17: { 1: 4, 2: 3, 3: 3, 4: 2 },
    18: { 1: 4, 2: 3, 3: 3, 4: 2 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3 }
};

// Slot per Warlock (tutti allo stesso livello, si ricaricano con riposo breve)
const warlockSpellSlots = {
    1: { 1: 1 },
    2: { 1: 2 },
    3: { 1: 2 },
    4: { 1: 2 },
    5: { 1: 2, 2: 0, 3: 2 },  // 2 slot di 3° livello
    6: { 1: 2, 2: 0, 3: 2 },
    7: { 1: 2, 2: 0, 3: 0, 4: 2 },  // 2 slot di 4° livello
    8: { 1: 2, 2: 0, 3: 0, 4: 2 },
    9: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 2 },  // 2 slot di 5° livello
    10: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 2 },
    11: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 3 },  // 3 slot di 5° livello
    12: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 3 },
    13: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 3 },
    14: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 3 },
    15: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 3 },
    16: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 3 },
    17: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 4 },  // 4 slot di 5° livello
    18: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 4 },
    19: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 4 },
    20: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 4 }
};

/**
 * Restituisce il tipo di incantatore per una classe
 * @returns {'known'|'prepared'|'warlock'|'none'}
 */
export function getCasterType(className) {
    const knownCasters = ['Bardo', 'Stregone'];
    const preparedCasters = ['Mago', 'Chierico', 'Druido', 'Paladino', 'Ranger'];
    
    if (className === 'Warlock') return 'warlock';
    if (knownCasters.includes(className)) return 'known';
    if (preparedCasters.includes(className)) return 'prepared';
    return 'none';
}

/**
 * Verifica se una classe è un incantatore "known" (Bardo, Stregone)
 */
export function isKnownCaster(className) {
    return ['Bardo', 'Stregone'].includes(className);
}

/**
 * Verifica se una classe è un incantatore "prepared" (Mago, Chierico, Druido, Paladino, Ranger)
 */
export function isPreparedCaster(className) {
    return ['Mago', 'Chierico', 'Druido', 'Paladino', 'Ranger'].includes(className);
}

/**
 * Ottiene il numero massimo di incantesimi conosciuti per classe e livello
 * Restituisce null per gli incantatori che preparano (non hanno limite)
 */
export function getMaxSpellsKnown(className, pgLevel) {
    const classData = spellsKnownByLevel[className];
    if (!classData) return null;
    return classData[pgLevel] || null;
}

/**
 * Restituisce una descrizione del tipo di incantatore
 */
export function getCasterTypeDescription(className) {
    const descriptions = {
        'Mago': 'Prepara incantesimi dopo un riposo lungo. Il numero di incantesimi preparabili equivale al tuo livello + modificatore di Intelligenza.',
        'Chierico': 'Prepara incantesimi dopo un riposo lungo. Il numero di incantesimi preparabili equivale al tuo livello + modificatore di Saggezza.',
        'Druido': 'Prepara incantesimi dopo un riposo lungo. Il numero di incantesimi preparabili equivale al tuo livello + modificatore di Saggezza.',
        'Paladino': 'Prepara incantesimi dopo un riposo lungo. Il numero di incantesimi preparabili equivale al tuo livello + modificatore di Carisma.',
        'Ranger': 'Prepara incantesimi dopo un riposo lungo. Il numero di incantesimi preparabili equivale al tuo livello + modificatore di Saggezza.',
        'Bardo': 'Conosce un numero limitato di incantesimi che può lanciare liberamente.',
        'Stregone': 'Conosce un numero limitato di incantesimi che può lanciare liberamente.',
        'Warlock': 'Ha pochi slot incantesimi che si ricaricano con un riposo breve. Conosce incantesimi limitati.'
    };
    return descriptions[className] || 'Non è un incantatore.';
}

/**
 * Ottiene gli slot incantesimi per classe e livello
 */
export function getSpellSlots(className, pgLevel) {
    const halfCasters = ['Paladino', 'Ranger'];
    
    if (className === 'Warlock') {
        return warlockSpellSlots[pgLevel] || {};
    }
    
    if (halfCasters.includes(className)) {
        return spellSlotsHalfCaster[pgLevel] || {};
    }
    
    // Full casters: Bardo, Chierico, Druido, Mago, Stregone
    return spellSlotsFullCaster[pgLevel] || {};
}

/**
 * Ottiene il livello massimo di incantesimo accessibile per una classe e livello PG
 */
export function getMaxSpellLevel(className, pgLevel) {
    const halfCasters = ['Paladino', 'Ranger'];
    
    if (halfCasters.includes(className)) {
        return maxSpellLevelHalfCaster[pgLevel] || 0;
    }
    return maxSpellLevelFullCaster[pgLevel] || 0;
}

/**
 * Ottiene gli incantesimi di una classe per un determinato livello
 */
export function getSpellsByLevel(className, spellLevel) {
    const classSpells = spellLevelsByClass[className];
    if (!classSpells) return [];
    return classSpells[spellLevel] || [];
}

/**
 * Ottiene tutti gli incantesimi di una classe fino a un certo livello
 */
export function getSpellsUpToLevel(className, maxLevel, pgLevel) {
    const classSpells = spellLevelsByClass[className];
    if (!classSpells) return [];
    
    const maxAccessible = getMaxSpellLevel(className, pgLevel);
    const effectiveMax = Math.min(maxLevel, maxAccessible);
    
    const spells = [];
    for (let level = 0; level <= effectiveMax; level++) {
        if (classSpells[level]) {
            spells.push(...classSpells[level].map(name => ({ name, level })));
        }
    }
    return spells;
}

/**
 * Esporta la lista completa per compatibilità
 */
export const classSpellList = {
    "Bardo": Object.values(spellLevelsByClass["Bardo"]).flat(),
    "Chierico": Object.values(spellLevelsByClass["Chierico"]).flat(),
    "Druido": Object.values(spellLevelsByClass["Druido"]).flat(),
    "Mago": Object.values(spellLevelsByClass["Mago"]).flat(),
    "Paladino": Object.values(spellLevelsByClass["Paladino"]).flat(),
    "Ranger": Object.values(spellLevelsByClass["Ranger"]).flat(),
    "Stregone": Object.values(spellLevelsByClass["Stregone"]).flat(),
    "Warlock": Object.values(spellLevelsByClass["Warlock"]).flat()
};

// Esporta anche i dati strutturati per livello
export { spellLevelsByClass, spellsKnownByLevel };

console.log('📜 [ClassSpells] Database incantesimi caricato.');
