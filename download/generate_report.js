const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, HeadingLevel, PageNumber, BorderStyle,
        ShadingType, WidthType, PageBreak } = require("docx");
const fs = require("fs");

// Palette per report tecnico - Warm neutral (consulting)
const P = { 
  primary: "#241E1A", 
  body: "#3A3430", 
  secondary: "#68605A",
  accent: "#B08050", 
  surface: "#FDFBF9",
  highlight: "#DC143C"  // Crimson per evidenziare differenze
};
const c = (hex) => hex.replace("#", "");

// Bordi tabella
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const accentBorder = { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) };

const tableBorders = {
  top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder,
  insideHorizontal: thinBorder, insideVertical: noBorder
};

const headerBorders = {
  top: accentBorder, bottom: accentBorder, left: noBorder, right: noBorder,
  insideHorizontal: noBorder, insideVertical: noBorder
};

// Helper functions
function createHeading(text, level) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "SimHei" } })]
  });
}

function createBody(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 0 },
    spacing: { line: 312, after: 120 },
    children: [new TextRun({ text, size: 22, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })]
  });
}

function createBullet(text, level = 0) {
  return new Paragraph({
    indent: { left: 400 + (level * 200) },
    spacing: { line: 312, after: 60 },
    children: [
      new TextRun({ text: "\u2022 ", size: 22, color: c(P.accent) }),
      new TextRun({ text, size: 22, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })
    ]
  });
}

function createHighlight(text) {
  return new Paragraph({
    spacing: { line: 312, after: 120 },
    shading: { type: ShadingType.CLEAR, fill: "FFF3CD" },
    indent: { left: 200, right: 200 },
    children: [new TextRun({ text: "\u26A0 " + text, size: 22, color: c(P.highlight), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })]
  });
}

function createTableCell(text, isHeader = false, highlight = false) {
  return new TableCell({
    children: [new Paragraph({
      alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { before: 80, after: 80 },
      children: [new TextRun({ 
        text, 
        bold: isHeader, 
        size: isHeader ? 22 : 20, 
        color: isHeader ? c(P.primary) : (highlight ? c(P.highlight) : c(P.body)),
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }
      })]
    })],
    shading: { type: ShadingType.CLEAR, fill: isHeader ? c(P.surface) : (highlight ? "FFF0F0" : "FFFFFF") },
    borders: isHeader ? headerBorders : tableBorders,
    margins: { top: 60, bottom: 60, left: 100, right: 100 }
  });
}

// === CONTENUTO DOCUMENTO ===

// Cover Section
const coverSection = {
  properties: { page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
  children: [
    new Paragraph({ spacing: { before: 3000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ 
        text: "DM-TOOL", 
        bold: true, 
        size: 56, 
        color: c(P.accent),
        font: { ascii: "Cinzel", eastAsia: "SimHei" }
      })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
      children: [new TextRun({ 
        text: "Report Analisi Grafica", 
        size: 36, 
        color: c(P.primary),
        font: { ascii: "Cinzel", eastAsia: "SimHei" }
      })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ 
        text: "Strumento: CAMPAGNA", 
        size: 28, 
        color: c(P.secondary),
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }
      })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ 
        text: "Moduli: Wiki della Campagna, Pianificatore di Campagna, Note di Sessione", 
        size: 22, 
        color: c(P.secondary),
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }
      })]
    }),
    new Paragraph({ spacing: { before: 4000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ 
        text: "Analisi delle differenze in: Layout, Dimensioni e Colori", 
        size: 20, 
        color: c(P.secondary),
        italics: true,
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }
      })]
    })
  ]
};

// Body Section
const bodySection = {
  properties: { 
    page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } }
  },
  headers: {
    default: new Header({
      children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "DM-Tool - Analisi Grafica CAMPAGNA", size: 18, color: c(P.secondary) })]
      })]
    })
  },
  footers: {
    default: new Footer({
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary) })]
      })]
    })
  },
  children: [
    // === INTRODUZIONE ===
    createHeading("1. Introduzione", HeadingLevel.HEADING_1),
    createBody("Questo report analizza le differenze grafiche tra i tre moduli principali dello strumento CAMPAGNA di DM-Tool: Wiki della Campagna, Pianificatore di Campagna e Note di Sessione. L'obiettivo è identificare le incoerenze visive per guidare una successiva fase di unificazione stilistica."),
    createBody("L'analisi si concentra su tre aspetti fondamentali: il tipo di layout utilizzato, le dimensioni degli elementi e i colori applicati. Ogni modulo presenta caratteristiche distintive che, sebbene funzionali singolarmente, creano un'esperienza utente frammentata quando si passa da uno all'altro."),
    
    // === TABELLA RIEPILOGATIVA ===
    createHeading("2. Tabella Riepilogativa", HeadingLevel.HEADING_1),
    createBody("La seguente tabella sintetizza le principali differenze riscontrate tra i tre moduli analizzati:"),
    
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createTableCell("Aspetto", true),
            createTableCell("Wiki Campagna", true),
            createTableCell("Pianificatore", true),
            createTableCell("Note Sessione", true)
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Layout"),
            createTableCell("Grid 2 colonne (350px + 1fr)"),
            createTableCell("Flexbox 2 colonne (350px + flex:1)"),
            createTableCell("Flexbox 2 colonne (350px + flex:1)")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Background"),
            createTableCell("#f6f5ee (pergamena chiaro)", false, true),
            createTableCell("#2a2a2a (scuro)", false, true),
            createTableCell("#2a2a2a (scuro)", false, true)
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Colore Titoli"),
            createTableCell("#401101 (marrone scuro)", false, true),
            createTableCell("#f0ad4e (dorato)", false, true),
            createTableCell("#f0ad4e (dorato)", false, true)
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Colore Label"),
            createTableCell("#742307 small-caps"),
            createTableCell("#333 (viewer)"),
            createTableCell("#f0ad4e")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Font Titolo"),
            createTableCell("2.8rem Cinzel"),
            createTableCell("2rem Cinzel"),
            createTableCell("2rem Cinzel")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Border Radius"),
            createTableCell("4px - 8px"),
            createTableCell("8px"),
            createTableCell("8px")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Padding"),
            createTableCell("Sidebar: 15px, Main: 40px"),
            createTableCell("Pannelli: 15px, Container: 20px"),
            createTableCell("Pannelli: 15px, Container: 20px")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Tema"),
            createTableCell("Pergamena chiaro", false, true),
            createTableCell("Scuro / Dark mode", false, true),
            createTableCell("Scuro / Dark mode", false, true)
          ]
        })
      ]
    }),
    
    new Paragraph({ spacing: { before: 200 }, children: [] }),
    
    // === ANALISI DETTAGLIATA ===
    createHeading("3. Analisi Dettagliata per Modulo", HeadingLevel.HEADING_1),
    
    // === WIKI DELLA CAMPAGNA ===
    createHeading("3.1 Wiki della Campagna", HeadingLevel.HEADING_2),
    createBody("Il modulo Wiki della Campagna presenta uno stile distintivo ispirato al tema 'pergamena', con una palette di colori caldi e un'atmosfera medievale che richiama l'estetica classica di Dungeons & Dragons. Questo approccio tematico è coerente con la natura del contenuto (archivio di informazioni della campagna), ma differisce significativamente dagli altri moduli."),
    
    createHeading("Layout", HeadingLevel.HEADING_3),
    createBullet("Struttura: Grid CSS a 2 colonne (350px per sidebar + 1fr per area principale)"),
    createBullet("Altezza: calc(100vh - 100px) per adattamento viewport"),
    createBullet("Sidebar: Bordo destro 2px solid #742307, sfondo #eee, overflow-y auto"),
    createBullet("Main area: Overflow-y auto con scroll interno indipendente"),
    
    createHeading("Colori", HeadingLevel.HEADING_3),
    createBullet("Background principale: #f6f5ee (beige pergamena chiaro)"),
    createBullet("Background sidebar: #eee (grigio chiaro)"),
    createBullet("Bordo principale: #742307 (marrone scuro/rosso)"),
    createBullet("Titoli: #401101 (marrone molto scuro)"),
    createBullet("Label: #742307 con font-variant: small-caps"),
    createBullet("Testo: #000000 (nero puro)"),
    createBullet("Scheda NPC: Variabili CSS --parchment-bg, --parchment-border, --crimson-red"),
    
    createHeading("Dimensioni", HeadingLevel.HEADING_3),
    createBullet("Font titolo principale: 2.8rem"),
    createBullet("Font titolo scheda NPC: 1.4rem (Cinzel Decorative)"),
    createBullet("Padding sidebar: 15px"),
    createBullet("Padding main content: 40px"),
    createBullet("Input search: padding 10px, border-radius 4px"),
    
    createHighlight("Problema principale: Il tema pergamena chiaro è in forte contrasto con il tema scuro degli altri due moduli."),
    
    // === PIANIFICATORE DI CAMPAGNA ===
    createHeading("3.2 Pianificatore di Campagna", HeadingLevel.HEADING_2),
    createBody("Il Pianificatore di Campagna utilizza un tema scuro/night mode con accenti dorati. Questo modulo condivide il file CSS con Note di Sessione (_session-notes.css), garantendo una certa coerenza tra questi due strumenti. La struttura è progettata per la gestione di capitoli e side quest con un sistema di stato visivo (badge colorati per planning, active, completed, on-hold)."),
    
    createHeading("Layout", HeadingLevel.HEADING_3),
    createBullet("Struttura: Flexbox a 2 colonne (notes-list-panel flex: 0 0 350px + note-editor-panel flex: 1)"),
    createBullet("Gap: 20px tra i pannelli"),
    createBullet("Container padding: 20px"),
    createBullet("Pannelli: Border-radius 8px, border 1px solid #444"),
    
    createHeading("Colori", HeadingLevel.HEADING_3),
    createBullet("Background pannelli: #2a2a2a (grigio scuro)"),
    createBullet("Background viewer: #f5f5f5 (chiaro nel viewer, ma inconsistente)"),
    createBullet("Border: #444 (grigio medio)"),
    createBullet("Titoli: #f0ad4e (dorato/arancione)"),
    createBullet("Label nel viewer: #333 (nero/grigio)"),
    createBullet("Testo viewer: #333 (chiaro su sfondo chiaro nel viewer)"),
    createBullet("Status badges: Verde #28a745 (active), Blu #007bff (completed), Giallo #ffc107 (on-hold)"),
    createBullet("Note segrete: Background #333 con bordo dashed #f0ad4e"),
    
    createHeading("Dimensioni", HeadingLevel.HEADING_3),
    createBullet("Font titolo: 2rem (Cinzel)"),
    createBullet("Padding pannelli: 15px"),
    createBullet("Border-radius: 8px"),
    createBullet("Font status badges: 0.8rem"),
    
    createHighlight("Problema principale: Il viewer ha uno sfondo chiaro (#f5f5f5) mentre la lista ha sfondo scuro, creando dissonanza visiva interna al modulo stesso."),
    
    // === NOTE DI SESSIONE ===
    createHeading("3.3 Note di Sessione", HeadingLevel.HEADING_2),
    createBody("Il modulo Note di Sessione condivide completamente gli stili CSS con il Pianificatore di Campagna, utilizzando le stesse classi (.session-notes-container, .notes-list-panel, .note-editor-panel). Questo garantisce coerenza tra i due moduli, ma entrambi differiscono significativamente dalla Wiki. Il modulo presenta un visualizzatore di note con stile dark mode e accenti dorati coerenti con il Pianificatore."),
    
    createHeading("Layout", HeadingLevel.HEADING_3),
    createBullet("Struttura: Identica al Pianificatore (Flexbox 2 colonne)"),
    createBullet("Gap: 20px"),
    createBullet("Container padding: 20px"),
    createBullet("Nota: Riutilizza .session-notes-container e classi correlate"),
    
    createHeading("Colori", HeadingLevel.HEADING_3),
    createBullet("Background pannelli: #2a2a2a (grigio scuro)"),
    createBullet("Background viewer: #1a1a1a (ancora più scuro)"),
    createBullet("Border: #444 e #333"),
    createBullet("Titoli: #f0ad4e (dorato/arancione)"),
    createBullet("Label: #f0ad4e"),
    createBullet("Testo viewer: #ffffff (bianco su sfondo scuro)"),
    createBullet("Note segrete: Background #1a1a1a con bordo dashed #f0ad4e"),
    
    createHeading("Dimensioni", HeadingLevel.HEADING_3),
    createBullet("Font titolo: 2rem (Cinzel)"),
    createBullet("Padding viewer: 20px"),
    createBullet("Border-radius: 8px"),
    createBullet("Line height contenuto: 1.7"),
    
    createHighlight("Nota: A differenza del Pianificatore, il viewer di Note Sessione mantiene lo sfondo scuro (#1a1a1a), risultando più coerente con la lista laterale."),
    
    // === DIFFERENZE CHIAVE ===
    createHeading("4. Sintesi delle Differenze Chiave", HeadingLevel.HEADING_1),
    
    createHeading("4.1 Tema Cromatico", HeadingLevel.HEADING_2),
    createBody("La differenza più evidente riguarda il tema cromatico: la Wiki utilizza un tema chiaro 'pergamena' con tonalità beige/marrone, mentre Pianificatore e Note di Sessione adottano un tema scuro con accenti dorati. Questa differenza crea un evidente stacco visivo quando l'utente passa da un modulo all'altro."),
    
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createTableCell("Elemento", true),
            createTableCell("Wiki (chiaro)", true),
            createTableCell("Pianificatore/Note (scuro)", true)
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Background principale"),
            createTableCell("#f6f5ee", false, true),
            createTableCell("#2a2a2a", false, true)
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Colore testo"),
            createTableCell("#000000"),
            createTableCell("#ffffff / #f0e6d2")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Colore enfasi"),
            createTableCell("#742307 (marrone)"),
            createTableCell("#f0ad4e (dorato)")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Bordature"),
            createTableCell("#742307, #8b7355"),
            createTableCell("#444, #333")
          ]
        })
      ]
    }),
    
    createHeading("4.2 Sistema di Layout", HeadingLevel.HEADING_2),
    createBody("Sebbene tutti e tre i moduli utilizzino una struttura a due colonne (lista laterale + area principale), le implementazioni tecniche differiscono:"),
    createBullet("Wiki: CSS Grid con colonne fisse (350px + 1fr), con calc() per l'altezza"),
    createBullet("Pianificatore/Note: Flexbox con flex-basis per la lista e flex:1 per l'editor"),
    createBody("Entrambi gli approcci funzionano correttamente, ma la coerenza migliorerebbe la manutenibilità del codice e l'uniformità del rendering."),
    
    createHeading("4.3 Gerarchia Tipografica", HeadingLevel.HEADING_2),
    createBody("Le dimensioni dei titoli differiscono significativamente:"),
    createBullet("Wiki: Titoli molto più grandi (2.8rem) per enfatizzare il contenuto enciclopedico"),
    createBullet("Pianificatore/Note: Titoli più contenuti (2rem) adatti a interfacce di gestione"),
    createBody("Anche la famiglia di font è la stessa (Cinzel per i titoli), ma l'uso di Cinzel Decorative nella Wiki per i nomi dei PNG aggiunge un'ulteriore variante."),
    
    // === RACCOMANDAZIONI ===
    createHeading("5. Raccomandazioni per l'Unificazione", HeadingLevel.HEADING_1),
    
    createBody("Per ottenere una coerenza grafica tra i tre moduli, si propongono le seguenti linee guida:"),
    
    createHeading("5.1 Scelta del Tema", HeadingLevel.HEADING_2),
    createBody("Si raccomanda di estendere il tema scuro (attualmente usato da Pianificatore e Note di Sessione) anche alla Wiki, oppure implementare un sistema di tema dinamico (light/dark mode) che l'utente può selezionare. Il tema scuro è preferibile perché:"),
    createBullet("Già utilizzato da 2 dei 3 moduli"),
    createBullet("Migliora la leggibilità in sessioni prolungate"),
    createBullet("L'accento dorato (#f0ad4e) è coerente con l'estetica D&D"),
    
    createHeading("5.2 Unificazione Layout", HeadingLevel.HEADING_2),
    createBody("Adottare un sistema di layout standardizzato:"),
    createBullet("Container: Flexbox, gap 20px, padding 20px"),
    createBullet("Sidebar: Larghezza fissa 350px, border-radius 8px"),
    createBullet("Main panel: flex: 1, border-radius 8px"),
    createBullet("Altezza: calcolata su calc(100vh - headerOffset)"),
    
    createHeading("5.3 Palette Colori Consigliata", HeadingLevel.HEADING_2),
    createBody("Si propone una palette unificata per tutti e tre i moduli:"),
    
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createTableCell("Elemento", true),
            createTableCell("Colore Hex", true),
            createTableCell("Utilizzo", true)
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Background container"),
            createTableCell("#1a1a1a"),
            createTableCell("Sfondo principale moduli")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Background pannello"),
            createTableCell("#2a2a2a"),
            createTableCell("Sidebar e viewer")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Titoli"),
            createTableCell("#f0ad4e"),
            createTableCell("Heading principali")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Label"),
            createTableCell("#f0ad4e"),
            createTableCell("Etichette sezioni")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Testo corpo"),
            createTableCell("#f0e6d2"),
            createTableCell("Contenuto principale")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Bordi"),
            createTableCell("#444"),
            createTableCell("Separazione elementi")
          ]
        }),
        new TableRow({
          children: [
            createTableCell("Accento/Enfasi"),
            createTableCell("#DC143C"),
            createTableCell("Elementi in rilievo")
          ]
        })
      ]
    }),
    
    createHeading("5.4 Dimensioni Standard", HeadingLevel.HEADING_2),
    createBullet("Titolo modulo: 2rem (Cinzel, bold)"),
    createBullet("Sottotitoli: 1.5rem (Cinzel)"),
    createBullet("Testo corpo: 1rem (Lora, line-height 1.7)"),
    createBullet("Padding contenuto: 20px"),
    createBullet("Border-radius: 8px (unificato)"),
    createBullet("Gap elementi: 20px"),
    
    // === CONCLUSIONI ===
    createHeading("6. Conclusioni", HeadingLevel.HEADING_1),
    createBody("L'analisi ha evidenziato una significativa frammentazione stilistica tra i tre moduli dello strumento CAMPAGNA. La Wiki della Campagna adotta un tema chiaro 'pergamena' che, sebbene tematicamente appropriato, interrompe la continuità visiva con gli altri moduli che utilizzano un tema scuro."),
    createBody("Per una coerenza ottimale dell'esperienza utente, si raccomanda di:"),
    createBullet("Estendere il tema scuro a tutti i moduli della sezione CAMPAGNA"),
    createBullet("Standardizzare il sistema di layout (Flexbox con classi condivise)"),
    createBullet("Adottare una palette colori unificata con dorato come accent"),
    createBullet("Uniformare le dimensioni tipografiche e il spacing"),
    createBody("Queste modifiche migliorerebbero non solo l'estetica complessiva, ma anche la manutenibilità del codice e l'esperienza utente durante la navigazione tra i diversi strumenti."),
    
    new Paragraph({ spacing: { before: 400 }, children: [] })
  ]
};

// === GENERAZIONE DOCUMENTO ===
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 22, color: c(P.body) },
        paragraph: { spacing: { line: 312 } }
      }
    }
  },
  sections: [coverSection, bodySection]
});

// Output
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/z/my-project/download/Report_Analisi_Grafica_CAMPAGNA.docx", buf);
  console.log("Report generato: /home/z/my-project/download/Report_Analisi_Grafica_CAMPAGNA.docx");
});
