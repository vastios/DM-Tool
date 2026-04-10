// js/modules/compendio/combatRules.js
// Regole di Combattimento D&D 5e — SRD 5.1 Italiano (pp. 102-113)

// L3 FIX: Importa escapeHtml condiviso invece della versione locale
import { escapeHtml } from '../../../utils/htmlHelpers.js';

const RULES_SECTIONS = [
    {
        id: 'ordine-combattimento',
        title: "1. L'Ordine di Combattimento",
        page: 'p. 102',
        content: `
            <p>Un <strong>round</strong> di combattimento rappresenta circa 6 secondi nel mondo di gioco. Durante un round, ogni personaggio e creatura partecipante prende un <strong>turno</strong>.</p>
            <p>Il combattimento si svolge seguendo queste <strong>5 fasi</strong>:</p>
            <table class="magic-item-table">
                <thead>
                    <tr><th>Fase</th><th>Descrizione</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>1</strong></td><td><strong>Determinare sorpresa</strong> — Il DM stabilisce chi potrebbe essere sorpreso</td></tr>
                    <tr><td><strong>2</strong></td><td><strong>Stabilire posizioni</strong> — Il DM posiziona i personaggi e i nemici sulla mappa</td></tr>
                    <tr><td><strong>3</strong></td><td><strong>Tirare iniziativa</strong> — Ogni parte tira un tiro di Destrezza</td></tr>
                    <tr><td><strong>4</strong></td><td><strong>Svolgere turni</strong> — I partecipanti agiscono in ordine di iniziativa</td></tr>
                    <tr><td><strong>5</strong></td><td><strong>Round successivo</strong> — Si ricomincia dalla fase 4</td></tr>
                </tbody>
            </table>
        `
    },
    {
        id: 'sorpresa',
        title: '2. Sorpresa',
        page: 'p. 102',
        content: `
            <p>La sorpresa si determina confrontando <strong>Destrezza (Furtività)</strong> dell'imboscato con <strong>Saggezza (Percezione) passiva</strong> del bersaglio.</p>
            <div class="cr-rule-box">
                <p><strong>Chi è sorpreso:</strong></p>
                <ul>
                    <li>Non può muoversi o effettuare azioni nel suo primo turno del combattimento</li>
                    <li>Non può utilizzare <strong>reazioni</strong> fino alla fine del suo primo turno</li>
                </ul>
            </div>
            <p>Se un lato riesce a sorprendere l'altro, i membri sorpresi sono sorpresi all'inizio del combattimento. Se i membri di un gruppo non sono tutti sorpresi, il gruppo non è considerato sorpreso nel suo complesso.</p>
        `
    },
    {
        id: 'iniziativa',
        title: '3. Iniziativa',
        page: 'p. 102',
        content: `
            <p>L'ordine dei turni è determinato da una <strong>prova di Destrezza</strong> ( tiro di iniziativa ).</p>
            <div class="cr-rule-box">
                <p><strong>Regole dell'iniziativa:</strong></p>
                <ul>
                    <li>L'ordine va dal <strong>totale più alto al più basso</strong></li>
                    <li>Il DM tira per i mostri e i PNG</li>
                    <li>In caso di <strong>parità</strong>: il DM decide l'ordine, oppure i contendenti tirano un d20 aggiuntivo per decidere</li>
                    <li>L'iniziativa viene tirata una sola volta, all'inizio del combattimento, e mantiene lo stesso ordine per tutti i round</li>
                </ul>
            </div>
            <p>Il DM può combinare l'iniziativa di gruppi di creature identiche per velocizzare il gioco (es. un gruppo di 4 goblin tira una sola iniziativa).</p>
        `
    },
    {
        id: 'il-turno',
        title: '4. Il Turno',
        page: 'p. 102-103',
        content: `
            <p>Sul proprio turno, un personaggio può:</p>
            <table class="magic-item-table">
                <thead>
                    <tr><th>Elemento</th><th>Dettagli</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Movimento</strong></td><td>Muoversi fino alla propria velocità massima</td></tr>
                    <tr><td><strong>Azione</strong></td><td>Effettuare 1 azione (attaccare, lanciare incantesimo, ecc.)</td></tr>
                    <tr><td><strong>Azione bonus</strong></td><td>Solo se un privilegio, incantesimo o capacità lo consente. <em>Massimo 1 per turno.</em></td></tr>
                    <tr><td><strong>Attività gratuite</strong></td><td>Comunicare brevemente, interagire con 1 oggetto gratuitamente (aprire una porta, estrarre un'arma)</td></tr>
                    <tr><td><strong>Reazione</strong></td><td>Risposta istantanea a un innesco (es. attacco di opportunità). <em>Massimo 1 per round.</em></td></tr>
                </tbody>
            </table>
            <div class="cr-rule-box">
                <p><strong>Attività gratuite (interazione con oggetti):</strong></p>
                <ul>
                    <li>Estrarre o riporre un'arma</li>
                    <li>Aprimere o chiudere una porta</li>
                    <li>Raccogliere un oggetto</li>
                    <li>Spostare un oggetto di peso ridotto</li>
                    <li>Se si vogliono compiere più interazioni, ogni ulteriore interazione costa 1 azione</li>
                </ul>
            </div>
        `
    },
    {
        id: 'movimento-posizione',
        title: '5. Movimento e Posizione',
        page: 'p. 103-105',
        content: `
            <p>Sul proprio turno è possibile muoversi fino alla propria velocità.</p>
            <div class="cr-rule-box">
                <p><strong>Spezzare il movimento:</strong></p>
                <p>Il movimento può essere spezzato in più tratti. Ad esempio: muoversi 3m → effettuare un'azione → muoversi ancora 6m, fino alla velocità rimanente.</p>
            </div>
            <div class="cr-rule-box">
                <p><strong>Muoversi tra gli attacchi:</strong></p>
                <p>Se un privilegio permette attacchi multipli (es. <em>Attacco Extra</em>), è possibile muoversi tra un attacco e l'altro. Ad esempio: 3m → attacco → 4,5m → secondo attacco.</p>
            </div>
            <div class="cr-rule-box">
                <p><strong>Terreno difficile:</strong></p>
                <ul>
                    <li>Ogni 30cm di movimento in terreno difficile costa 30cm extra di velocità</li>
                    <li>Non è possibile muoversi attraverso terreno difficile scavalcando (serve movimento extra)</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Creature prone (sdraiate a terra):</strong></p>
                <ul>
                    <li><strong>Buttarsi a terra:</strong> attività gratuita</li>
                    <li><strong>Rialzarsi:</strong> costa metà della velocità</li>
                    <li><strong>Strisciare:</strong> +30cm di velocità per ogni 30cm percorso + effetto terreno difficile</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Muoversi attorno creature ostili:</strong></p>
                <ul>
                    <li>Si può attraversare lo spazio occupato da una creatura ostile solo se la differenza di taglia è di ±2 categorie</li>
                    <li>Lo spazio occupato da una creatura ostile conta sempre come <strong>terreno difficile</strong></li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Uscire dalla portata di un nemico:</strong></p>
                <p>Se ci si muove fuori dalla portata di un nemico visibile, quest'ultimo può effettuare un <strong>attacco di opportunità</strong> come reazione.</p>
            </div>
        `
    },
    {
        id: 'taglia-creature',
        title: '6. Taglia delle Creature',
        page: 'p. 105',
        content: `
            <p>Ogni creatura occupa uno spazio sulla mappa in base alla propria taglia:</p>
            <table class="magic-item-table">
                <thead>
                    <tr><th>Taglia</th><th>Spazio</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Minuscola</strong></td><td>75 × 75 cm</td></tr>
                    <tr><td><strong>Piccola</strong></td><td>1,5 m × 1,5 m</td></tr>
                    <tr><td><strong>Media</strong></td><td>1,5 m × 1,5 m</td></tr>
                    <tr><td><strong>Grande</strong></td><td>3 m × 3 m</td></tr>
                    <tr><td><strong>Enorme</strong></td><td>4,5 m × 4,5 m</td></tr>
                    <tr><td><strong>Mastodontica</strong></td><td>6 × 6 m o più</td></tr>
                </tbody>
            </table>
            <div class="cr-rule-box">
                <p><strong>Intrufolarsi in uno spazio più piccolo:</strong></p>
                <ul>
                    <li>Costo di movimento: +30cm di velocità per ogni 30cm percorso</li>
                    <li>Tiri per colpire: <strong>svantaggio</strong></li>
                    <li>TS Destrezza: <strong>svantaggio</strong></li>
                    <li>Bersaglio ha <strong>vantaggio</strong> contro attacchi di creature intrufolate</li>
                </ul>
            </div>
        `
    },
    {
        id: 'azioni-combattimento',
        title: '7. Azioni in Combattimento',
        page: 'p. 105-106',
        content: `
            <p>Sul proprio turno è possibile effettuare <strong>1 azione</strong> tra le seguenti:</p>
            <table class="magic-item-table">
                <thead>
                    <tr><th>Azione</th><th>Descrizione</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Aiuto</strong></td><td>Conferisci <strong>vantaggio</strong> alla prossima prova di abilità o al primo attacco di un alleato entro 1,5m contro un bersaglio che riesci a vedere</td></tr>
                    <tr><td><strong>Attacco</strong></td><td>Effettua un attacco in mischia o a distanza con un'arma o un attacco disarmato</td></tr>
                    <tr><td><strong>Cercare</strong></td><td>Tira una prova di SAG (Percezione) o INT (Indagare) per trovare qualcosa di nascosto</td></tr>
                    <tr><td><strong>Disimpegno</strong></td><td>Il tuo movimento non provoca <strong>attacchi di opportunità</strong> per il resto del turno</td></tr>
                    <tr><td><strong>Lanciare Incantesimo</strong></td><td>Lancia un incantesimo il cui tempo di lancio è "1 azione". Se il tempo è "1 reazione", "1 minuto" o più, usa quel tipo di azione</td></tr>
                    <tr><td><strong>Nascondersi</strong></td><td>Tira una prova di DES (Furtività) per nasconderti dai nemici. Benefici di oscurità, copertura e altri fattori</td></tr>
                    <tr><td><strong>Preparare</strong></td><td>Usi la tua reazione per rispondere a un innesco specifico che determini (es. "se il nemico entra dalla porta, tiro una freccia")</td></tr>
                    <tr><td><strong>Scatto</strong></td><td>Ottieni <strong>velocità aggiuntiva</strong> uguale alla tua velocità (dopo applicazione di eventuali modificatori). Il movimento extra può incorporare la direzione che preferisci</td></tr>
                    <tr><td><strong>Schivata</strong></td><td>Svantaggio ai tiri per colpire contro di te fino all'inizio del tuo turno successivo. <strong>Vantaggio</strong> ai TS di Destrezza. Non funziona se sei <em>privo di sensi</em>, <em>incapacitato</em> o hai velocità 0</td></tr>
                    <tr><td><strong>Usare un Oggetto</strong></td><td>Per usare un oggetto che non rientra nelle interazioni gratuite, o per usare più di un oggetto in un turno</td></tr>
                </tbody>
            </table>
        `
    },
    {
        id: 'effettuare-attacco',
        title: '8. Effettuare un Attacco',
        page: 'p. 107-108',
        content: `
            <p>Quando un personaggio effettua un attacco, il processo prevede 3 passi:</p>
            <div class="cr-rule-box">
                <p><strong>1. Scegliere il bersaglio</strong></p>
                <p>Il bersaglio deve essere entro la <strong>gittata</strong> dell'arma o dell'attacco. Bisogna poter vedere il bersaglio (o conoscerne la posizione).</p>
            </div>
            <div class="cr-rule-box">
                <p><strong>2. Determinare i modificatori</strong></p>
                <p>Applicare modificatori come copertura, vantaggio/svantaggio, incantesimi attivi, o condizioni.</p>
            </div>
            <div class="cr-rule-box">
                <p><strong>3. Sferrare l'attacco</strong></p>
                <p>Tirare un d20 + modificatori e confrontare con la <strong>Classe Armatura (CA)</strong> del bersaglio.</p>
            </div>
            <table class="magic-item-table">
                <thead>
                    <tr><th>Componente</th><th>Formula</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Tiro per colpire</strong></td><td>d20 + modificatore caratteristica + bonus competenza (se competente) vs CA</td></tr>
                    <tr><td><strong>Arma in mischia</strong></td><td>Modificatore di <strong>Forza</strong></td></tr>
                    <tr><td><strong>Arma a distanza</strong></td><td>Modificatore di <strong>Destrezza</strong></td></tr>
                    <tr><td><strong>Armi finesse</strong></td><td>Si usa la migliore tra FOR e DES (sia per colpire che per danni)</td></tr>
                </tbody>
            </table>
            <div class="cr-rule-box">
                <p><strong>Critici e Fallimenti Naturali:</strong></p>
                <ul>
                    <li><strong>Critico (20 naturale):</strong> colpo a segno sempre, indipendentemente dalla CA. I danni vengono raddoppiati (tira i dadi di danno 2 volte)</li>
                    <li><strong>Fallimento naturale (1 naturale):</strong> manca sempre, indipendentemente dai modificatori</li>
                </ul>
            </div>
        `
    },
    {
        id: 'attaccanti-bersagli-non-visibili',
        title: '9. Attaccanti e Bersagli Non Visibili',
        page: 'p. 107-108',
        content: `
            <p>Quando un attaccante non può vedere il bersaglio, si applicano le seguenti regole:</p>
            <table class="magic-item-table">
                <thead>
                    <tr><th>Situazione</th><th>Effetto</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Attaccare un bersaglio invisibile</strong></td><td><strong>Svantaggio</strong> al tiro per colpire</td></tr>
                    <tr><td><strong>Attaccare da invisibilità</strong></td><td><strong>Vantaggio</strong> al tiro per colpire. L'attacco rivela la tua posizione</td></tr>
                    <tr><td><strong>Bersaglio non nel punto indicato</strong></td><td><strong>Manca automaticamente</strong> (il tiro fallisce)</td></tr>
                </tbody>
            </table>
            <div class="cr-rule-box">
                <p><strong>Regole aggiuntive:</strong></p>
                <ul>
                    <li>Quando un bersaglio invisibile non si trova nel punto in cui lo si crede, l'attacco manca automaticamente</li>
                    <li>Se il bersaglio è nell'area indicata ma non nel punto esatto, il DM può richiedere un tiro con svantaggio</li>
                </ul>
            </div>
        `
    },
    {
        id: 'attacchi-distanza',
        title: '10. Attacchi a Distanza',
        page: 'p. 108',
        content: `
            <p>Le armi a distanza hanno due gittate: <strong>normale</strong> e <strong>lunga</strong>.</p>
            <table class="magic-item-table">
                <thead>
                    <tr><th>Situazione</th><th>Effetto</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Entro gittata normale</strong></td><td>Nessun modificatore</td></tr>
                    <tr><td><strong>Oltre gittata normale (fino a gittata lunga)</strong></td><td><strong>Svantaggio</strong> al tiro per colpire</td></tr>
                    <tr><td><strong>Oltre gittata lunga</strong></td><td><strong>Impossibile</strong> colpire</td></tr>
                    <tr><td><strong>In mischia ravvicinata</strong></td><td>Se un nemico ostile è entro 1,5m: <strong>svantaggio</strong> al tiro per colpire</td></tr>
                </tbody>
            </table>
            <div class="cr-rule-box">
                <p><strong>Armi da lancio:</strong></p>
                <p>Le armi da lancio usano il modificatore di <strong>Forza</strong> per i tiri per colpire e per i danni, a meno che non siano descritte come "armi da lancio" con la proprietà finesse.</p>
            </div>
            <div class="cr-rule-box">
                <p><strong>Attacchi a distanza in mischia:</strong></p>
                <p>Quando un nemico ostile si trova entro 1,5m, un attacco a distanza subisce svantaggio. Il privilegio <em>Tiro Ravvicinato</em> annulla questo svantaggio.</p>
            </div>
        `
    },
    {
        id: 'attacchi-mischia',
        title: '11. Attacchi in Mischia',
        page: 'p. 108',
        content: `
            <p>Gli attacchi in mischia avvengono a distanza ravvicinata.</p>
            <div class="cr-rule-box">
                <p><strong>Regole generali:</strong></p>
                <ul>
                    <li><strong>Portata standard:</strong> 1,5m (armi da mischia normali)</li>
                    <li>Armi con gittata "3m" o superiore possono colpire a distanza maggiore (es. alabarde, picche)</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Attacco disarmato:</strong></p>
                <ul>
                    <li>Invece di usare un'arma, è possibile effettuare un attacco disarmato: un pugno, un calcio, una testata</li>
                    <li><strong>Danni:</strong> 1 + modificatore di Forza (danni contundenti)</li>
                    <li>Se si è competenti in attacchi disarmati (monaco), si aggiunge il bonus competenza al tiro per colpire</li>
                </ul>
            </div>
        `
    },
    {
        id: 'attacchi-opportunita',
        title: '12. Attacchi di Opportunità',
        page: 'p. 108',
        content: `
            <p>L'<strong>attacco di opportunità</strong> è una reazione che si effettua quando un nemico si muove fuori dalla propria portata.</p>
            <table class="magic-item-table">
                <thead>
                    <tr><th>Elemento</th><th>Dettagli</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Tipo</strong></td><td>Reazione (massimo 1 per round)</td></tr>
                    <tr><td><strong>Innesco</strong></td><td>Un nemico visibile si muove fuori dalla portata di un attacco in mischia</td></tr>
                    <tr><td><strong>Momento</strong></td><td>Si verifica <strong>appena prima</strong> che il nemico esca dalla portata</td></tr>
                    <tr><td><strong>Tipo di attacco</strong></td><td>Solo attacco in mischia</td></tr>
                </tbody>
            </table>
            <div class="cr-rule-box">
                <p><strong>Cosa NON provoca un attacco di opportunità:</strong></p>
                <ul>
                    <li><strong>Disimpegno:</strong> se il nemico usa l'azione Disimpegno, il movimento non provoca attacchi di opportunità</li>
                    <li><strong>Teletrasporto:</strong> lo spostamento tramite teletrasporto non provoca attacchi di opportunità</li>
                    <li><strong>Spostamento passivo:</strong> essere spinti, trascinati o lanciati non provoca attacchi di opportunità</li>
                </ul>
            </div>
        `
    },
    {
        id: 'due-armi',
        title: '13. Combattere con Due Armi',
        page: 'p. 108',
        content: `
            <p>Quando un personaggio combatte con due armi, si applicano le seguenti regole:</p>
            <div class="cr-rule-box">
                <p><strong>Requisiti:</strong></p>
                <ul>
                    <li><strong>Mano primaria:</strong> un'arma leggera (o un'arma con la proprietà "due mani" che non la usa)</li>
                    <li><strong>Mano secondaria:</strong> un'arma leggera diversa (non può essere una "arma pesante")</li>
                    <li>Si usa l'<strong>azione bonus</strong> per effettuare l'attacco con l'arma secondaria</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Modificatore ai danni:</strong></p>
                <ul>
                    <li>L'arma secondaria <strong>non aggiunge</strong> il modificatore di caratteristica ai danni (se positivo)</li>
                    <li>Se il modificatore è negativo, viene applicato</li>
                    <li>Il privilegio <em>Combattimento con Due Armi</em> del Combattente aggiunge il modificatore completo ai danni</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Armi da lancio:</strong></p>
                <p>Un'arma leggera con la proprietà <em>lancio</em> (es. pugnale) può essere lanciata come attacco con azione bonus quando si combatte con due armi.</p>
            </div>
        `
    },
    {
        id: 'lottare-spingere',
        title: '14. Lottare e Spingere',
        page: 'p. 109',
        content: `
            <p>Queste azioni speciali sostituiscono un attacco normale e usano l'azione <strong>Attacco</strong>.</p>
            <div class="cr-rule-box">
                <p><strong>Lottare (Afferrare):</strong></p>
                <ul>
                    <li>Usa l'azione <strong>Attacco</strong></li>
                    <li>Prova: <strong>FOR (Atletica)</strong> vs FOR (Atletica) o DES (Acrobazia) del bersaglio</li>
                    <li>Se la prova ha successo: il bersaglio è <strong>afferrato</strong> (condizione)</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Sfuggire da una presa:</strong></p>
                <ul>
                    <li>Richiede un'azione</li>
                    <li>Prova: <strong>FOR (Atletica)</strong> o <strong>DES (Acrobazia)</strong> vs FOR (Atletica) di chi afferra</li>
                    <li>In caso di successo: la condizione afferrato termina</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Trasportare una creatura afferrata:</strong></p>
                <ul>
                    <li>La velocità è <strong>dimezzata</strong></li>
                    <li>La creatura trasportata è afferrata e può provare a sfuggire</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Spingere:</strong></p>
                <ul>
                    <li>Usa l'azione <strong>Attacco</strong></li>
                    <li>Prova: <strong>FOR (Atletica)</strong> vs FOR (Atletica) o DES (Acrobazia) del bersaglio</li>
                    <li>In caso di successo: il bersaglio viene <strong>spinto di 1,5m</strong> oppure reso <strong>prono</strong></li>
                </ul>
            </div>
        `
    },
    {
        id: 'copertura',
        title: '15. Copertura',
        page: 'p. 109',
        content: `
            <p>La copertura protegge dai tiri per colpire e dai TS di Destrezza. Esistono tre livelli di copertura:</p>
            <table class="magic-item-table">
                <thead>
                    <tr><th>Tipo di Copertura</th><th>Bonus CA / TS DES</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Mezza copertura</strong></td><td>+2</td></tr>
                    <tr><td><strong>Tre quarti di copertura</strong></td><td>+5</td></tr>
                    <tr><td><strong>Copertura totale</strong></td><td>Impossibile bersagliare direttamente</td></tr>
                </tbody>
            </table>
            <div class="cr-rule-box">
                <p><strong>Tipi di copertura:</strong></p>
                <ul>
                    <li><strong>Mezza:</strong> muro basso, un personaggio alleato, arbusto fitto</li>
                    <li><strong>Tre quarti:</strong> parapetto, muro con feritoia, abbattitore</li>
                    <li><strong>Totale:</strong> muro solido, porta chiusa, retro di un bersaglio</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Regola importante:</strong></p>
                <p>I bonus di copertura <strong>non sono cumulativi</strong>. Se si è soggetti a più tipi di copertura, si usa <strong>solo quello più protettivo</strong>.</p>
            </div>
        `
    },
    {
        id: 'danni-guarigione',
        title: '16. Danni e Guarigione',
        page: 'p. 110-112',
        content: `
            <p>I danni riducono i <strong>Punti Ferita (PF)</strong> attuali di una creatura. I PF attuali possono variare da 0 al valore massimo.</p>
            <div class="cr-rule-box">
                <p><strong>Tiri per i danni:</strong></p>
                <ul>
                    <li>Tira i dadi di danno dell'arma o dell'incantesimo</li>
                    <li>Aggiungi il <strong>modificatore di caratteristica</strong> usato per il tiro per colpire (FOR per mischia, DES per distanza)</li>
                    <li>Eccezioni: danni fissi, danni da incantesimi con formula propria</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Colpo critico sui danni:</strong></p>
                <ul>
                    <li>Tira i dadi di danno <strong>2 volte</strong> e somma i risultati</li>
                    <li>Aggiungi i modificatori una sola volta (non raddoppiati)</li>
                </ul>
            </div>
            <p><strong>Tipi di danno:</strong></p>
            <table class="magic-item-table">
                <thead>
                    <tr><th>Tipo</th></tr>
                </thead>
                <tbody>
                    <tr><td>Acido</td></tr>
                    <tr><td>Contundente</td></tr>
                    <tr><td>Forza</td></tr>
                    <tr><td>Freddo</td></tr>
                    <tr><td>Fulmine</td></tr>
                    <tr><td>Fuoco</td></tr>
                    <tr><td>Necrotico</td></tr>
                    <tr><td>Perforante</td></tr>
                    <tr><td>Psichico</td></tr>
                    <tr><td>Radiante</td></tr>
                    <tr><td>Tagliente</td></tr>
                    <tr><td>Tuono</td></tr>
                    <tr><td>Veleno</td></tr>
                </tbody>
            </table>
            <div class="cr-rule-box">
                <p><strong>Resistenza, Immunità e Vulnerabilità:</strong></p>
                <ul>
                    <li><strong>Resistenza:</strong> danni dimezzati (arrotondare per difetto)</li>
                    <li><strong>Immunità:</strong> 0 danni</li>
                    <li><strong>Vulnerabilità:</strong> danni raddoppiati</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Guarigione:</strong></p>
                <ul>
                    <li>La guarigione ripristina i PF</li>
                    <li>Non è possibile superare il massimo di PF tramite guarigione</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Scendere a 0 PF:</strong></p>
                <ul>
                    <li><strong>Morte istantanea:</strong> se i danni subiscono sono ≥ PF massimi</li>
                    <li><strong>TS Morte:</strong> CD = 10 + danni in eccesso rispetto ai PF massimi</li>
                    <li><strong>Privo di sensi:</strong> il personaggio è incapace di agire</li>
                    <li><strong>Stabilizzazione:</strong> un successo su un TS con CD 10 (o l'uso di un kit da guarigione) stabilizza il personaggio</li>
                    <li><strong>Tramortire:</strong> a 0 PF ma non morto, incosciente, TS favorevole CD 10 (vittoria → 1 PF)</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>PF Temporanei:</strong></p>
                <ul>
                    <li>I PF temporanei si aggiungono ai PF attuali ma non alla soglia massima</li>
                    <li>Vengono persi <strong>alla fine di un breve o lungo riposo</strong></li>
                    <li>I danni vengono sottratti prima ai PF temporanei, poi a quelli normali</li>
                </ul>
            </div>
        `
    },
    {
        id: 'sellata-sottacqua',
        title: '17. Combattere in Sellata e Sott\'acqua',
        page: 'p. 113',
        content: `
            <p>Questi ambienti speciali modificano le condizioni di combattimento.</p>
            <div class="cr-rule-box">
                <p><strong>In sellata:</strong></p>
                <ul>
                    <li>La sella conta come <strong>terreno difficile</strong> per gli spostamenti</li>
                    <li>Il personaggio si muove alla <strong>velocità della cavalcatura</strong></li>
                    <li>Se la cavalcatura è pronta (non è sorpresa), il cavaliere ha vantaggio ai TS per non essere disarcionato</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Sott'acqua:</strong></p>
                <ul>
                    <li><strong>Attacchi con arma da mischia:</strong> <strong>svantaggio</strong> al tiro per colpire</li>
                    <li><strong>Attacchi a distanza:</strong> <strong>impossibili</strong> (eccetto armi da lancio naturali come reti e tridenti)</li>
                    <li><strong>Incantesimi con componente verbale:</strong> <strong>falliscono</strong> automaticamente</li>
                    <li>Una creatura che respira solo fuori dall'acqua può trattenere il respiro per un numero di minuti = 1 + modificatore CON (minimo 30 secondi)</li>
                </ul>
            </div>
            <div class="cr-rule-box">
                <p><strong>Armatura:</strong></p>
                <ul>
                    <li>Le <strong>armature pesanti</strong> (maglia di piastre, armatura a piastre) <strong>dimezzano la velocità</strong> del personaggio</li>
                    <li>Le armature intermedie (maglia di anelli, mezza armatura, corazza pettorale) riducono la velocità di 3m solo se il modificatore di FOR è inferiore al valore richiesto dall'armatura</li>
                </ul>
            </div>
        `
    }
];

const CombatRules = {
    render(containerElement) {

        // --- STILI INLINE ---
        containerElement.innerHTML = `
            <style>
                .cr-container {
                    display: flex;
                    gap: 20px;
                    padding: 20px;
                    box-sizing: border-box;
                    background-color: #1a1a1a;
                    height: 100%;
                    flex-grow: 1;
                    min-height: 0;
                }

                /* --- Sidebar --- */
                .cr-sidebar {
                    flex: 0 0 280px;
                    background-color: #2a2a2a;
                    border: 1px solid #444;
                    border-radius: 8px;
                    padding: 1rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .cr-sidebar h2 {
                    text-align: center;
                    font-family: 'Cinzel', serif;
                    font-size: 1.1rem;
                    color: #f0ad4e;
                    margin: 0 0 0.5rem 0;
                    border-bottom: 1px solid #555;
                    padding-bottom: 0.5rem;
                }

                .cr-search {
                    width: 100%;
                    padding: 0.5rem;
                    background-color: #333;
                    border: 1px solid #555;
                    color: #ffffff;
                    border-radius: 4px;
                    box-sizing: border-box;
                    font-family: 'Lora', serif;
                    font-size: 0.9rem;
                }

                .cr-search::placeholder {
                    color: #888;
                }

                .cr-search:focus {
                    outline: none;
                    border-color: #f0ad4e;
                }

                .cr-toc-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .cr-toc-item {
                    display: block;
                    padding: 8px 10px;
                    color: #cccccc;
                    font-family: 'Lora', serif;
                    font-size: 0.85rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    border-left: 3px solid transparent;
                }

                .cr-toc-item:hover {
                    background-color: rgba(240, 173, 78, 0.1);
                    color: #f0ad4e;
                }

                .cr-toc-item.active {
                    background-color: rgba(240, 173, 78, 0.15);
                    color: #f0ad4e;
                    border-left-color: #f0ad4e;
                    font-weight: 700;
                }

                .cr-toc-item.hidden-by-search {
                    display: none;
                }

                .cr-toc-page {
                    font-size: 0.7rem;
                    color: #888;
                    margin-left: 6px;
                }

                .cr-toc-count {
                    text-align: center;
                    font-family: 'Lora', serif;
                    font-size: 0.8rem;
                    color: #888;
                    margin-top: auto;
                    padding-top: 0.5rem;
                    border-top: 1px solid #444;
                }

                /* --- Main Content --- */
                .cr-main {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                    border-radius: 8px;
                    background-color: #2a2a2a;
                    scroll-behavior: smooth;
                }

                .cr-main h2 {
                    font-family: 'Cinzel', serif;
                    font-size: 1.4rem;
                    color: #f0ad4e;
                    margin: 0;
                    border-bottom: 1px solid #555;
                    padding-bottom: 0.5rem;
                    margin-bottom: 1rem;
                    text-align: center;
                }

                .cr-no-results {
                    text-align: center;
                    color: #888;
                    font-family: 'Lora', serif;
                    font-size: 1rem;
                    padding: 3rem 1rem;
                    display: none;
                }

                .cr-no-results.visible {
                    display: block;
                }

                /* --- Sections --- */
                .cr-section {
                    margin-bottom: 1.5rem;
                    border: 1px solid #444;
                    border-radius: 8px;
                    overflow: hidden;
                    transition: opacity 0.3s ease;
                }

                .cr-section.hidden-by-search {
                    display: none;
                }

                .cr-section-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 16px;
                    background-color: #333;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    user-select: none;
                }

                .cr-section-header:hover {
                    background-color: #3a3a3a;
                }

                .cr-section-chevron {
                    flex-shrink: 0;
                    width: 20px;
                    height: 20px;
                    transition: transform 0.2s ease;
                    color: #f0ad4e;
                }

                .cr-section.collapsed .cr-section-chevron {
                    transform: rotate(-90deg);
                }

                .cr-section-title {
                    font-family: 'Cinzel', serif;
                    font-size: 1rem;
                    font-weight: 700;
                    color: #f0ad4e;
                    flex: 1;
                    margin: 0;
                }

                .cr-section-page {
                    font-family: 'Lora', serif;
                    font-size: 0.8rem;
                    color: #888;
                    flex-shrink: 0;
                }

                .cr-section-body {
                    padding: 16px;
                    font-family: 'Lora', serif;
                    font-size: 0.92rem;
                    line-height: 1.7;
                    color: #e0d8c8;
                    transition: max-height 0.3s ease, padding 0.3s ease;
                    max-height: 2000px;
                    overflow: hidden;
                }

                .cr-section.collapsed .cr-section-body {
                    max-height: 0;
                    padding-top: 0;
                    padding-bottom: 0;
                }

                .cr-section-body p {
                    margin: 0 0 0.8rem 0;
                }

                .cr-section-body p:last-child {
                    margin-bottom: 0;
                }

                .cr-section-body ul {
                    margin: 0.4rem 0;
                    padding-left: 1.5rem;
                }

                .cr-section-body li {
                    margin-bottom: 0.3rem;
                }

                .cr-section-body strong {
                    color: #f0ad4e;
                }

                .cr-section-body em {
                    color: #87CEFA;
                    font-style: italic;
                }

                .cr-rule-box {
                    background-color: rgba(0, 0, 0, 0.25);
                    border: 1px solid #555;
                    border-left: 3px solid #c9a959;
                    border-radius: 4px;
                    padding: 12px 14px;
                    margin: 10px 0;
                }

                .cr-rule-box p {
                    margin-bottom: 0.5rem;
                }

                .cr-rule-box p:last-child {
                    margin-bottom: 0;
                }

                .cr-rule-box ul {
                    margin: 0.3rem 0 0 0;
                }

                /* --- Search highlight --- */
                .cr-highlight {
                    background-color: rgba(240, 173, 78, 0.35);
                    color: #ffffff;
                    border-radius: 2px;
                    padding: 0 2px;
                }

                /* --- Scrollbar --- */
                .cr-main::-webkit-scrollbar,
                .cr-sidebar::-webkit-scrollbar {
                    width: 6px;
                }

                .cr-main::-webkit-scrollbar-track,
                .cr-sidebar::-webkit-scrollbar-track {
                    background: #2a2a2a;
                }

                .cr-main::-webkit-scrollbar-thumb,
                .cr-sidebar::-webkit-scrollbar-thumb {
                    background-color: #555;
                    border-radius: 3px;
                }

                .cr-main::-webkit-scrollbar-thumb:hover,
                .cr-sidebar::-webkit-scrollbar-thumb:hover {
                    background-color: #777;
                }
            </style>

            <div class="cr-container">
                <!-- SIDEBAR -->
                <div class="cr-sidebar">
                    <h2>&#9876; Regole Combattimento</h2>
                    <input type="text" class="cr-search" placeholder="Cerca tra le regole..." id="cr-search-input">
                    <ul class="cr-toc-list" id="cr-toc">
                        ${RULES_SECTIONS.map(s => `
                            <li>
                                <a class="cr-toc-item" data-section-id="${s.id}" href="#cr-${s.id}">
                                    ${escapeHtml(s.title)}
                                    <span class="cr-toc-page">${escapeHtml(s.page)}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="cr-toc-count" id="cr-section-count">${RULES_SECTIONS.length} sezioni</div>
                </div>

                <!-- MAIN CONTENT -->
                <div class="cr-main" id="cr-main-scroll">
                    <h2>&#9876; Regole di Combattimento — D&D 5e (SRD 5.1)</h2>
                    <div class="cr-no-results" id="cr-no-results">Nessuna sezione trovata per la ricerca corrente.</div>
                    ${RULES_SECTIONS.map(s => `
                        <div class="cr-section" id="cr-${s.id}" data-section-id="${s.id}">
                            <div class="cr-section-header">
                                <svg class="cr-section-chevron" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                </svg>
                                <h3 class="cr-section-title">${escapeHtml(s.title)}</h3>
                                <span class="cr-section-page">${escapeHtml(s.page)}</span>
                            </div>
                            <div class="cr-section-body">
                                ${s.content}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // --- REFERENCES ---
        const searchInput = containerElement.querySelector('#cr-search-input');
        const tocList = containerElement.querySelector('#cr-toc');
        const mainScroll = containerElement.querySelector('#cr-main-scroll');
        const noResults = containerElement.querySelector('#cr-no-results');
        const sectionCount = containerElement.querySelector('#cr-section-count');
        const tocItems = containerElement.querySelectorAll('.cr-toc-item');
        const sections = containerElement.querySelectorAll('.cr-section');

        // --- STORE ORIGINAL HTML for search highlight ---
        const originalContent = new Map();
        RULES_SECTIONS.forEach(s => {
            const sectionEl = containerElement.querySelector(`#cr-${s.id} .cr-section-body`);
            if (sectionEl) {
                originalContent.set(s.id, sectionEl.innerHTML);
            }
        });

        // --- TOC CLICK: scroll to section ---
        tocList.addEventListener('click', (e) => {
            const tocItem = e.target.closest('.cr-toc-item');
            if (!tocItem) return;
            e.preventDefault();
            const sectionId = tocItem.dataset.sectionId;
            const sectionEl = containerElement.querySelector(`#cr-${sectionId}`);
            if (sectionEl) {
                // Expand if collapsed
                sectionEl.classList.remove('collapsed');
                // Scroll into view
                sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Update active TOC
                updateActiveToc(sectionId);
            }
        });

        // --- COLLAPSE/EXPAND sections ---
        mainScroll.addEventListener('click', (e) => {
            const header = e.target.closest('.cr-section-header');
            if (!header) return;
            const section = header.closest('.cr-section');
            section.classList.toggle('collapsed');
        });

        // --- SEARCH ---
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            let visibleCount = 0;

            // Strip previous highlights
            RULES_SECTIONS.forEach(s => {
                const sectionEl = containerElement.querySelector(`#cr-${s.id} .cr-section-body`);
                const tocItem = containerElement.querySelector(`.cr-toc-item[data-section-id="${s.id}"]`);
                if (sectionEl) {
                    sectionEl.innerHTML = originalContent.get(s.id);
                }
            });

            if (!searchTerm) {
                // Show all
                sections.forEach(s => {
                    s.classList.remove('hidden-by-search');
                    s.classList.remove('collapsed');
                });
                tocItems.forEach(t => t.classList.remove('hidden-by-search'));
                noResults.classList.remove('visible');
                sectionCount.textContent = `${RULES_SECTIONS.length} sezioni`;
                return;
            }

            RULES_SECTIONS.forEach(s => {
                const sectionEl = containerElement.querySelector(`#cr-${s.id}`);
                const tocItem = containerElement.querySelector(`.cr-toc-item[data-section-id="${s.id}"]`);
                const sectionBody = containerElement.querySelector(`#cr-${s.id} .cr-section-body`);

                if (!sectionEl || !sectionBody) return;

                // Search in title + content
                const titleText = s.title.toLowerCase();
                const contentText = sectionBody.textContent.toLowerCase();

                if (titleText.includes(searchTerm) || contentText.includes(searchTerm)) {
                    sectionEl.classList.remove('hidden-by-search');
                    sectionEl.classList.remove('collapsed');
                    if (tocItem) tocItem.classList.remove('hidden-by-search');
                    visibleCount++;

                    // Highlight matches in body text
                    highlightText(sectionBody, searchTerm);
                } else {
                    sectionEl.classList.add('hidden-by-search');
                    if (tocItem) tocItem.classList.add('hidden-by-search');
                }
            });

            noResults.classList.toggle('visible', visibleCount === 0);
            sectionCount.textContent = `${visibleCount} / ${RULES_SECTIONS.length} sezioni`;
        });

        // --- HIGHLIGHT helper ---
        function highlightText(container, term) {
            // Walk text nodes only
            const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            textNodes.forEach(textNode => {
                const text = textNode.nodeValue;
                const lowerText = text.toLowerCase();
                const idx = lowerText.indexOf(term);
                if (idx === -1) return;

                // Split and wrap
                const before = text.substring(0, idx);
                const match = text.substring(idx, idx + term.length);
                const after = text.substring(idx + term.length);

                const fragment = document.createDocumentFragment();
                if (before) fragment.appendChild(document.createTextNode(before));

                const span = document.createElement('span');
                span.className = 'cr-highlight';
                span.textContent = match;
                fragment.appendChild(span);

                if (after) fragment.appendChild(document.createTextNode(after));

                textNode.parentNode.replaceChild(fragment, textNode);
            });
        }

        // --- SCROLL SPY: highlight active TOC ---
        function updateActiveToc(activeId) {
            tocItems.forEach(item => {
                item.classList.toggle('active', item.dataset.sectionId === activeId);
            });
        }

        let scrollTimeout;
        mainScroll.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Find which section is currently most visible
                let bestSection = null;
                let bestTop = Infinity;
                const scrollTop = mainScroll.scrollTop;
                const containerRect = mainScroll.getBoundingClientRect();

                sections.forEach(section => {
                    if (section.classList.contains('hidden-by-search')) return;
                    const rect = section.getBoundingClientRect();
                    const relativeTop = rect.top - containerRect.top + mainScroll.scrollTop;
                    if (rect.top <= containerRect.top + 100 && relativeTop >= 0) {
                        if (relativeTop < bestTop || bestTop === Infinity) {
                            // We want the section whose top is closest to (or just past) the scroll position
                        }
                    }
                    // Check if section top is near viewport top
                    if (rect.top <= containerRect.top + 80) {
                        const dist = Math.abs(rect.top - containerRect.top);
                        if (dist < Math.abs(bestTop - containerRect.top) || bestTop === Infinity) {
                            bestTop = rect.top;
                            bestSection = section.dataset.sectionId;
                        }
                    }
                });

                if (bestSection) {
                    updateActiveToc(bestSection);
                }
            }, 50);
        });
    }
};

export default CombatRules;
