const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, Packer } = require('docx');
const fs = require('fs');

// Paletta colori per report tecnico
const palette = {
  primary: "1A2330",
  body: "333333",
  accent: "D4875A",
  surface: "F8F0EB",
  secondary: "606070"
};

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
          size: 24,
          color: palette.body
        },
        paragraph: {
          spacing: { line: 312 }
        }
      }
    },
    heading1: {
      run: {
        font: { ascii: "Calibri", eastAsia: "SimHei" },
        size: 32,
        bold: true,
        color: palette.primary
      }
    },
    heading2: {
      run: {
        font: { ascii: "Calibri", eastAsia: "SimHei" },
        size: 28,
        bold: true,
        color: palette.primary
      }
    },
    heading3: {
      run: {
        font: { ascii: "Calibri", eastAsia: "SimHei" },
        size: 24,
        bold: true,
        color: palette.accent
      }
    }
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
      }
    },
    children: [
      // Titolo
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Report Analisi Grafica", bold: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "Strumento CAMPAGNA - DM-Tool", size: 24, color: palette.secondary })]
      }),
      
      // Introduzione
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1. Panoramica")] }),
      new Paragraph({
        children: [new TextRun("Questo report analizza le differenze grafiche tra i moduli dello strumento CAMPAGNA di DM-Tool. L'analisi si concentra su tre aspetti principali: tipo di layout, dimensioni degli elementi e palette colori utilizzate. L'obiettivo è identificare incoerenze e proporre linee guida per un'armonizzazione visiva.")]
      }),
      
      // Moduli analizzati
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2. Moduli Analizzati")] }),
      new Paragraph({
        children: [new TextRun("Sono stati analizzati i seguenti moduli appartenenti allo strumento CAMPAGNA, ciascuno con il proprio file CSS dedicato:")]
      }),
      new Paragraph({ children: [new TextRun({ text: "• Dungeon Generator ", bold: true }), new TextRun("(_dungeon-generator.css)")] }),
      new Paragraph({ children: [new TextRun({ text: "• Encounter Builder ", bold: true }), new TextRun("(_encounter-builder.css)")] }),
      new Paragraph({ children: [new TextRun({ text: "• Travel Manager ", bold: true }), new TextRun("(_travel-manager.css)")] }),
      new Paragraph({ children: [new TextRun({ text: "• PG Manager ", bold: true }), new TextRun("(_pgManager.css)")] }),
      new Paragraph({ children: [new TextRun({ text: "• Combat Tracker ", bold: true }), new TextRun("(_combat-tracker.css)")] }),
      new Paragraph({ children: [new TextRun({ text: "• NPC Manager ", bold: true }), new TextRun("(_npc-manager.css)")] }),
      new Paragraph({ children: [new TextRun({ text: "• Session Notes ", bold: true }), new TextRun("(_session-notes.css)")] }),
      new Paragraph({ children: [new TextRun({ text: "• Wiki ", bold: true }), new TextRun("(_wiki.css)")] }),
      new Paragraph({ children: [new TextRun({ text: "• PG Editor ", bold: true }), new TextRun("(_pgEditor.css)")] }),
      new Paragraph({ children: [new TextRun({ text: "• Factions ", bold: true }), new TextRun("(_factions.css)")] }),
      
      // Analisi Layout
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun("3. Analisi per Tipo di Layout")] }),
      
      // Dungeon Generator
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.1 Dungeon Generator")] }),
      new Paragraph({ children: [new TextRun({ text: "Layout: ", bold: true }), new TextRun("Layout a colonna singola con header + main content. Il contenuto principale è diviso in due sezioni: mappa (flex: 2) e pannello info (flex: 1). Utilizza flexbox con overflow hidden per gestire lo scroll interno.")] }),
      new Paragraph({ children: [new TextRun({ text: "Dimensioni: ", bold: true }), new TextRun("Container full-height con padding 15px. Header con padding 12px 15px. Pannello info con max-width 280px e min-width 220px. Dimensione font base: 0.9rem per etichette, 1rem per titoli.")] }),
      new Paragraph({ children: [new TextRun({ text: "Colori: ", bold: true }), new TextRun("Palette verde foresta scuro. Background: linear-gradient(135deg, #1a2a1a, #0d1a0d). Accento principale: #4CAF50 (verde brillante). Testo: #e0e0e0 (chiaro). Bordi: rgba(76, 175, 80, 0.3). Sistema colori coerente interno ma completamente diverso dagli altri moduli.")] }),
      
      // Encounter Builder
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.2 Encounter Builder")] }),
      new Paragraph({ children: [new TextRun({ text: "Layout: ", bold: true }), new TextRun("Layout a due colonne con pannello lista (flex: 0 0 350px) e pannello editor (flex: 1). Grid system per il generatore con auto-fit minmax(200px, 1fr).")] }),
      new Paragraph({ children: [new TextRun({ text: "Dimensioni: ", bold: true }), new TextRun("Padding 20px. Panel width fissa 350px per la lista. Grid cards con min-width 280px. Font: 0.9rem per body, 1rem per titoli h3, 1.2rem per pulsanti principali.")] }),
      new Paragraph({ children: [new TextRun({ text: "Colori: ", bold: true }), new TextRun("Palette scura standard. Background: #2a2a2a. Cards: #333. Accento: #f0ad4e (oro/arancione). Testo: #ffffff, #cccccc. Pulsante primario: background #f0ad4e con testo nero. Segue lo stile base comune ma con accento dorato.")] }),
      
      // Travel Manager
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.3 Travel Manager")] }),
      new Paragraph({ children: [new TextRun({ text: "Layout: ", bold: true }), new TextRun("Layout a griglia 2 colonne con grid-template-columns: repeat(2, 1fr). Card full-width con grid-column: span 2. Header separato con controlli.")] }),
      new Paragraph({ children: [new TextRun({ text: "Dimensioni: ", bold: true }), new TextRun("Padding 30px. height: 100vh con overflow-y: auto. Gap 20px tra card. Font famiglia base: Lora serif. Titoli: Cinzel 1.1rem. Weather main: 2.5rem.")] }),
      new Paragraph({ children: [new TextRun({ text: "Colori: ", bold: true }), new TextRun("Palette molto scura. Background: #121212. Cards: #1e1e1e. Accento: #f0ad4e (titoli) e #a0783a (sottotitoli). Bordi: #333, #58180d. Event box con bord-left #58180d. Stile scuro con accenti marroni/dorati che richiamano temi fantasy medievali.")] }),
      
      // PG Manager
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.4 PG Manager")] }),
      new Paragraph({ children: [new TextRun({ text: "Layout: ", bold: true }), new TextRun("Layout a due colonne con sidebar sinistra (25%, min 220px, max 300px) e contenuto destra (75%). Wizard multi-step con header steps indicator. Sistema a card flip per visualizzazione personaggio.")] }),
      new Paragraph({ children: [new TextRun({ text: "Dimensioni: ", bold: true }), new TextRun("Height: calc(100vh - 120px). Sidebar card padding: 0.75rem. Content padding: 1.5rem. Font sizes vari: card name 0.95rem, wizard title 1.25rem, section headers 1rem. Grid abilities con minmax(130px, 1fr).")] }),
      new Paragraph({ children: [new TextRun({ text: "Colori: ", bold: true }), new TextRun("Sistema a doppio tema. Tema scuro per editor: background #1a1a1a, card #2a2a2a. Tema pergamena per scheda: background #f4e4bc, testo #3d2914, accento #8b6914 (oro), titolo #DC143C (crimson). Usa CSS variables con --parchment-* e --bg-*, --text-*, --accent-color.")] }),
      
      // Combat Tracker
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.5 Combat Tracker")] }),
      new Paragraph({ children: [new TextRun({ text: "Layout: ", bold: true }), new TextRun("Layout complesso a tre colonne: lista ordine (flex: 0 0 220px), dettaglio centrale (flex: 1). All'interno del dettaglio: layout 2 colonne con tabs (sinistra 360px, destra flex: 1). Header compatto con controlli.")] }),
      new Paragraph({ children: [new TextRun({ text: "Dimensioni: ", bold: true }), new TextRun("Header padding: 6px 12px. Round input width: 40px. Action buttons height: 28px. Order column: 220px width. Left column min-width: 300px. Font header: 1rem, dettaglio: 0.9rem, condizioni: 0.7rem.")] }),
      new Paragraph({ children: [new TextRun({ text: "Colori: ", bold: true }), new TextRun("Sistema dinamico con stato combat-active. Base: background #1a1a1a, card #252525, accento #d4af37. In combattimento: sfondo rosso sangue con gradient e animazione bloodPulse. Box-shadow: inset 0 0 100px rgba(139, 0, 0, 0.3). Border attivo: #ff4444. Complesso sistema di stati visivi.")] }),
      
      // NPC Manager
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.6 NPC Manager")] }),
      new Paragraph({ children: [new TextRun({ text: "Layout: ", bold: true }), new TextRun("Layout a due colonne: sidebar (flex: 0 0 280px) e main area con 2 card flippabili (perspective: 1200px). Sistema flip-card con transform: rotateY(180deg). Parchment style per la visualizzazione.")] }),
      new Paragraph({ children: [new TextRun({ text: "Dimensioni: ", bold: true }), new TextRun("Gap 15px, padding 15px. Sidebar width: 280px. Card con height 100% e min-width 0. Search input padding: 10px 12px. Flip animation: 0.6s cubic-bezier. Font: titolo 1.3rem, nome card 0.95rem.")] }),
      new Paragraph({ children: [new TextRun({ text: "Colori: ", bold: true }), new TextRun("Doppio tema. Sidebar: background #2a2a2a, accento #d4af37. Card pergamena: background gradient #f5e8b0, testo #3d2817, titolo #822000 (rosso scuro). Tags colorati per tipo NPC: alleato (verde), nemico (rosso), contatto (blu), mentore (viola), rivale (arancione).")] }),
      
      // Session Notes
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.7 Session Notes")] }),
      new Paragraph({ children: [new TextRun({ text: "Layout: ", bold: true }), new TextRun("Layout a due colonne: lista note (flex: 0 0 350px) e editor (flex: 1). Note viewer con header + content scrollabile. Sistema di badge per stati (planning, active, completed, on-hold).")] }),
      new Paragraph({ children: [new TextRun({ text: "Dimensioni: ", bold: true }), new TextRun("Padding 20px. Lista panel: 350px. Note list item padding: 10px. Viewer header font: 2rem. Content line-height: 1.7. Badge padding: 4px 12px, border-radius: 20px.")] }),
      new Paragraph({ children: [new TextRun({ text: "Colori: ", bold: true }), new TextRun("Palette scura standard. Background: #2a2a2a, card #333. Accento: #f0ad4e. Stati: planning (#9e9e9e), active (#28a745 verde), completed (#007bff blu), on-hold (#ffc107 giallo). Secrets: bord-left #f0ad4e (unrevealed), #6c757d (revealed). Viewer: background #1a1a1a.")] }),
      
      // Wiki
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.8 Wiki")] }),
      new Paragraph({ children: [new TextRun({ text: "Layout: ", bold: true }), new TextRun("Tab navigation orizzontale + content area. NPC sheet con layout griglia: riga superiore (1fr 1.2fr), riga centrale (auto 1fr), riga inferiore. Sezioni con display grid.")] }),
      new Paragraph({ children: [new TextRun({ text: "Dimensioni: ", bold: true }), new TextRun("Tab padding: 8px 15px. Sheet padding: 0.75rem. Combat grid: repeat(5, 1fr). Combat stat padding: 0.25rem 0.15rem. Font nome: 1.4rem, sezioni h3: 0.8rem. Combat values: 0.9rem.")] }),
      new Paragraph({ children: [new TextRun({ text: "Colori: ", bold: true }), new TextRun("Tema pergamena completo. Background: #f6f5ee, #f0efd1e9. Sheet: linear-gradient 180deg #f4e4bc. Accento: #822000 (rosso scuro). Tab attivo: #d81d1d. Combat stats: background rgba(255,255,255,0.3), border #8b7355. Secrets section: background #2a2a2a con border #742307.")] }),
      
      // PG Editor
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("3.9 PG Editor")] }),
      new Paragraph({ children: [new TextRun({ text: "Layout: ", bold: true }), new TextRun("Layout a griglia 2 colonne (grid-template-columns: 1fr 1fr) con gap 2rem. Sezioni collassabili con header cliccabile. Stats editor con grid 3 colonne. Modal overlay per selezione incantesimi.")] }),
      new Paragraph({ children: [new TextRun({ text: "Dimensioni: ", bold: true }), new TextRun("Padding 1.5rem. Section border-radius: 5px. Form group input padding: 0.5rem. Stats grid gap: 1rem. Modal max-width: 500px, max-height: 80vh. Font header: 1.1rem, body: 0.9rem.")] }),
      new Paragraph({ children: [new TextRun({ text: "Colori: ", bold: true }), new TextRun("Tema pergamena chiaro. Background: #fdf5e6. Section: #f9f0d2. Header section: #e8d9a0. Border: #d4af37, #c9a961. Testo: #3d2817, #5a3a1a. Focus: border #822000 con box-shadow. Skill tags: background #822000, text #fdf5e6. Completamente diverso dal tema scuro di base.")] }),
      
      // Tabella comparativa
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun("4. Tabella Comparativa Colori Principali")] }),
      
      // Tabella
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          // Header
          new TableRow({
            children: [
              new TableCell({ shading: { fill: "1A2330", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Modulo", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ shading: { fill: "1A2330", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Background", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ shading: { fill: "1A2330", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Accento", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ shading: { fill: "1A2330", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Testo", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ shading: { fill: "1A2330", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Tema", bold: true, color: "FFFFFF" })] })] }),
            ]
          }),
          // Rows
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun("Dungeon Generator")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#1a2a1a")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#4CAF50")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#e0e0e0")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("Verde foresta")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Encounter Builder")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#2a2a2a")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#f0ad4e")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#ffffff")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Scuro standard")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun("Travel Manager")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#121212")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#f0ad4e")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#e0e0e0")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("Scuro marrone")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("PG Manager")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#1a1a1a / #f4e4bc")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#d4af37 / #DC143C")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#fff / #3d2914")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Doppio tema")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun("Combat Tracker")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#1a1a1a / rosso")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#d4af37 / #ff4444")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#fff")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("Dinamico")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("NPC Manager")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#2a2a2a / #f5e8b0")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#d4af37 / #822000")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#fff / #3d2817")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Doppio tema")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun("Session Notes")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#2a2a2a")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#f0ad4e")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#ffffff")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("Scuro standard")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Wiki")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#f6f5ee")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#822000 / #d81d1d")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("#000 / #3d2817")] })] }),
              new TableCell({ shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun("Pergamena")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun("PG Editor")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#fdf5e6")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#d4af37 / #822000")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("#3d2817")] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun("Pergamena")] })] }),
            ]
          }),
        ]
      }),
      
      // Problemi identificati
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun("5. Problemi Identificati")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("5.1 Incoerenza dei Temi")] }),
      new Paragraph({
        children: [new TextRun("La principale problematica è l'utilizzo di temi completamente diversi tra i moduli. Alcuni utilizzano il tema scuro standard (#1a1a1a, #2a2a2a), altri il tema pergamena (#f4e4bc, #fdf5e6), e Dungeon Generator ha un tema verde unico. Questo crea disorientamento quando l'utente passa da un modulo all'altro all'interno dello stesso strumento.")]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("5.2 Varianti dell'Accento Dorato")] }),
      new Paragraph({
        children: [new TextRun("Anche dove viene utilizzato l'accento dorato, le tonalità variano sensibilmente: #f0ad4e (Encounter Builder, Travel Manager, Session Notes), #d4af37 (PG Manager, NPC Manager, Combat Tracker), #8b6914 (PG Manager pergamena). Questa mancanza di standardizzazione rende l'interfaccia visivamente frammentata.")]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("5.3 Dimensioni Font Inconsistenti")] }),
      new Paragraph({
        children: [new TextRun("Le dimensioni dei font variano tra i moduli senza un sistema coerente. I titoli h2 vanno da 1rem (Combat Tracker) a 2rem (Session Notes viewer). Il body text varia da 0.75rem a 1rem. Non esiste una gerarchia tipografica unificata.")]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("5.4 Layout Pattern Diversi")] }),
      new Paragraph({
        children: [new TextRun("Ogni modulo implementa il proprio pattern di layout: due colonne con sidebar, griglia 2x2, tabs, wizard multi-step, card flippabili. Sebbene la diversità possa essere funzionale alle esigenze specifiche, manca un linguaggio visivo comune per elementi ricorrenti come header, card e pannelli.")]
      }),
      
      // Raccomandazioni
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun("6. Raccomandazioni")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("6.1 Definire un Design System Unificato")] }),
      new Paragraph({
        children: [new TextRun("Creare un file CSS di base con variabili CSS custom properties per: colori primari, secondari, accento, sfondi, bordi; scale tipografiche (h1-h6, body, caption); spaziature standard (padding, margin, gap); border-radius standardizzati. Questo permetterà di mantenere personalizzazioni specifiche dove necessario, garantendo al contempo coerenza visiva.")]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("6.2 Standardizzare il Tema Scuro")] }),
      new Paragraph({
        children: [new TextRun("Adottare il tema scuro come base per tutti i moduli di editing/gestione (background #1a1a1a, card #2a2a2a, accento #d4af37). Riservare il tema pergamena esclusivamente per le viste di sola lettura (schede personaggio, wiki, visualizzazione PNG). Dungeon Generator dovrebbe essere aggiornato per allinearsi al tema scuro, sostituendo il verde con l'accento dorato standard.")]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("6.3 Unificare i Pattern di Layout")] }),
      new Paragraph({
        children: [new TextRun("Definire 3 pattern di layout standard: Layout Editor (sidebar + contenuto), Layout Viewer (singola colonna con card), Layout Tabs (navigazione a tab con contenuto). Ogni modulo dovrebbe adattarsi a uno di questi pattern, utilizzando classi CSS comuni per header, pannelli, liste e card.")]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("6.4 Creare Componenti Riutilizzabili")] }),
      new Paragraph({
        children: [new TextRun("Sviluppare classi CSS per componenti comuni: .card-base per le card standard, .panel-header per gli header dei pannelli, .status-badge per i badge di stato, .action-button per i pulsanti. Questo ridurrà la duplicazione del codice e garantirà coerenza visiva automatica.")]
      }),
      
      // Conclusione
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun("7. Conclusione")] }),
      new Paragraph({
        children: [new TextRun("L'analisi ha evidenziato una significativa frammentazione grafica tra i moduli dello strumento CAMPAGNA. Sebbene ogni modulo risponda a esigenze funzionali specifiche, l'assenza di un design system unificato compromette l'esperienza utente e la percezione di coerenza dell'applicazione. L'implementazione delle raccomandazioni proposte richiederebbe un intervento coordinato sui file CSS, con priorità per la definizione delle variabili di base e la standardizzazione dei colori. Un approccio incrementale, iniziando dai moduli più utilizzati (Combat Tracker, PG Manager, NPC Manager), permetterebbe di ottenere miglioramenti visibili con un impatto gestibile sullo sviluppo.")]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/z/my-project/download/Report_Analisi_Grafica_CAMPAGNA.docx', buffer);
  console.log('Report creato: /home/z/my-project/download/Report_Analisi_Grafica_CAMPAGNA.docx');
});
