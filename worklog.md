
---
Task ID: 1
Agent: Main Agent
Task: Integrazione generazione casuale aspetto e personalità nel modulo PG Manager

Work Log:
- Aggiunti campi `appearance`, `personality`, `gender` al modello EMPTY_PG in PgConstants.js
- Modificato PgStep1Identity.js per includere:
  - Selettore sesso (maschio/femmina/casuale)
  - Pulsante "Genera Aspetto & Personalità"
  - Textarea per aspetto fisico con pulsante rigenerazione singola
  - Textarea per personalità con pulsante rigenerazione singola
  - Supporto autocomplete per i tag @ nei textarea
- Aggiornato PgController.js:
  - Importate funzioni `generateAppearance` e `generatePersonality` dal quickBuilder.js
  - Aggiunta gestione eventi per pulsanti di generazione
  - Aggiunto metodo `generateDescriptions()` per generare entrambi
  - Aggiunto metodo `generateAppearanceOnly()` per rigenerare solo aspetto
  - Aggiunto metodo `generatePersonalityOnly()` per rigenerare solo personalità
  - Aggiornato handleInput per gestire i nuovi campi
  - Aggiornato handleChange per gestire il selettore gender
  - Aggiornato insertTag per autocomplete nei nuovi textarea
- Aggiornato PgCharacterSheet.js:
  - Aggiunta sezione "Aspetto e Personalità" in renderCard2Front
  - Layout a griglia per mostrare aspetto e personalità
- Aggiunti stili CSS in _pgManager.css per la nuova sezione

Stage Summary:
- Funzionalità integrata con successo nel modulo PG Manager
- La generazione casuale usa le stesse funzioni del Quick Builder NPC
- I campi sono modificabili dopo la generazione
- Visualizzazione nella scheda personaggio con stile pergamena coerente
- File modificati: PgConstants.js, PgStep1Identity.js, PgController.js, PgCharacterSheet.js, _pgManager.css
