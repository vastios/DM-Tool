// js/modules/AlignmentGuide.js

export const AlignmentGuide = {
    // Database degli allineamenti, normalizzato per un accesso più semplice
    alignmentData: {
        "Legale Buono": {
            abbreviation: "LB",
            description: "Una creatura legale buona agisce come ci si aspetterebbe da una persona buona. Ha un codice per cui si batte e combina l'idealismo con la disciplina. Combatterebbe il male senza esitazione e non potrebbe collaborare con un malvagio. Combatterebbe per la legge e il bene, senza compromessi. Aiuterei gli altri, anche a proprio discapito, e si aspetterebbe che gli altri facessero lo stesso. I paladini sono spesso di questo allineamento.",
            example: "Un cavaliere che punisce i malviventi e protegge gli innocenti, seguendo un rigido codice d'onore."
        },
        "Neutrale Buono": {
            abbreviation: "NB",
            description: "Una creatura neutrale buona fa il meglio che può per aiutare gli altri secondo le proprie necessità. Credono nel bene e nel bene, ma non sono così concentrati sull'ordine o sulla legge. Un neutrale buono farebbe del bene per il gusto di farlo, senza preoccuparsi di tradizioni o mandati. Aiuterebbe gli altri in base alle circostanze, senza essere legato a un codice rigido. Molti chierici, druidi e ranger sono di questo allineamento.",
            example: "Un medico che cura chiunque ne abbia bisogno, indipendentemente dalla sua fede o dalla sua lealtà a un regno."
        },
        "Caotico Buono": {
            abbreviation: "CB",
            description: "Una creatura caotica buona fa ciò che il suo cuore le dice è giusto. Sebbene sia gentile e benevola nei suoi confronti, non si sente vincolata dalle leggi o dalle tradizioni. Segue la propria coscienza e fa ciò che crede giusto, anche se ciò significa infrangere le leggi. Combatterebbe il male, ma non si sentirebbe obbligata a farlo in modo organizzato. Un caotico buono aiuterei gli altri in base alle sue emozioni e al suo senso della giustizia. Molti barbari e bardi sono di questo allineamento.",
            example: "Un ribelle che combatte un tiranno per liberare il popolo, anche se questo significa infrangere le leggi del tiranno."
        },
        "Legale Neutrale": {
            abbreviation: "LN",
            description: "Una creatura legale neutrale agisce secondo la legge, la tradizione o un codice personale. Credono nell'ordine e nell'organizzazione, senza preoccuparsi troppo del bene o del male. Rispetta le leggi e l'autorità, e si aspetta che gli altri facciano lo stesso. Un legale neutrale farebbe ciò che è giusto secondo la legge, anche se ciò significa fare del male a qualcuno. Molti monaci e soldati sono di questo allineamento.",
            example: "Un giudice che applica la legge alla lettera, indipendentemente dalle circostanze personali o dalle emozioni."
        },
        "Neutrale": {
            abbreviation: "N",
            description: "Una creatura neutrale fa ciò che sembra essere una buona idea. Non si sente fortemente legata al bene o al male, né all'ordine o al caos. Si preoccupa principalmente della propria sopravvivenza e di quella dei suoi cari. Un neutrale farebbe ciò che è giusto secondo la situazione, senza essere influenzato da leggi o emozioni. Molti comuni mortali e alcuni druidi sono di questo allineamento.",
            example: "Un contadino che vuole solo vivere la sua vita in pace, senza preoccuparsi della politica o della religione."
        },
        "Caotico Neutrale": {
            abbreviation: "CN",
            description: "Una creatura caotica neutrale segue i propri capricci. Non si sente vincolata dalle leggi o dalle tradizioni, ma non è necessariamente malvagia. Fa ciò che vuole, quando vuole, senza preoccuparsi delle conseguenze. Un caotico neutrale farebbe ciò che è giusto secondo i suoi desideri, anche se ciò significa fare del male a qualcuno. Molti ladri e alcuni maghi sono di questo allineamento.",
            example: "Un mercenario che lavora per chi paga di più, senza preoccuparsi della moralità della sua causa."
        },
        "Legale Malvagio": {
            abbreviation: "LM",
            description: "Una creatura legale malvagia si comporta in modo malvagio, ma lo fa in modo organizzato e sistematico. Sfrutta la legge e l'ordine per i propri scopi malvagi. Credono nell'organizzazione, ma la usano per dominare e sfruttare gli altri. Un legale malvagio farebbe ciò che è giusto secondo la legge, ma solo se ciò gli conviene. Molti diavoli e alcuni nani malvagi sono di questo allineamento.",
            example: "Un nobile che sfrutta i suoi contadini e usa la legge per mantenere il suo potere."
        },
        "Neutrale Malvagio": {
            abbreviation: "NM",
            description: "Una creatura neutrale malvagia fa ciò che vuole, senza preoccuparsi degli altri. Non è necessariamente violenta o distruttiva, ma non si preoccupa del bene altrui. È egoista e si preoccupa solo dei propri desideri e bisogni. Un neutrale malvagio farebbe ciò che è giusto secondo i suoi desideri, anche se ciò significa fare del male a qualcuno. Molti orchi e alcuni nani malvagi sono di questo allineamento.",
            example: "Un bandito che ruba ai viaggiatori per sopravvivere, senza provare odio o amore per le sue vittime."
        },
        "Caotico Malvagio": {
            abbreviation: "CM",
            description: "Una creatura caotica malvagia fa ciò che vuole, quando vuole, senza preoccuparsi delle conseguenze. È violenta, distruttiva e egoista. Fa ciò che è giusto secondo i suoi desideri, anche se ciò significa fare del male a qualcuno. Un caotico malvagio farebbe ciò che è giusto secondo i suoi desideri, anche se ciò significa fare del male a qualcuno. Molti demoni e alcuni orchi malvagi sono di questo allineamento.",
            example: "Un barbaro che saccheggia e uccide per puro divertimento."
        }
    },

    render(containerElement) {
        // Stato interno per tracciare l'allineamento selezionato
        let activeAlignment = null;

        containerElement.innerHTML = `
            <div class="align-mid-layout">
                <div class="align-grid-mid" id="alignment-grid">
                    <!-- La griglia 3x3 sarà popolata da JavaScript -->
                </div>
                <div class="align-detail-mid" id="alignment-details">
                    <p id="mid-desc">Seleziona un allineamento dalla griglia per visualizzarne i dettagli.</p>
                </div>
            </div>
        `;

        const gridElement = containerElement.querySelector('#alignment-grid');
        const detailsTitle = containerElement.querySelector('#mid-title');
        const detailsDesc = containerElement.querySelector('#mid-desc');

        // Funzione per renderizzare la griglia
        const renderGrid = () => {
            gridElement.innerHTML = ''; // Svuota la griglia prima di ripopolarla
            for (const name in this.alignmentData) {
                const data = this.alignmentData[name];
                const cell = document.createElement('div');
                cell.className = 'align-cell-mid';
                if (activeAlignment === name) {
                    cell.classList.add('active');
                }
                cell.dataset.alignment = name;

                cell.innerHTML = `
                    <div class="ac-initials">${data.abbreviation}</div>
                    <div class="ac-label">${name}</div>
                `;
                gridElement.appendChild(cell);
            }
        };

        // Funzione per mostrare i dettagli
        const showDetails = (alignmentName) => {
            const data = this.alignmentData[alignmentName];
            if (!data) return;

            activeAlignment = alignmentName; // Aggiorna lo stato attivo
            
            // Ri-renderizza la griglia per aggiornare la classe 'active'
            renderGrid();

            // Aggiorna il pannello dei dettagli
            detailsDesc.innerHTML = `
                <h3 id="mid-title">${alignmentName}</h3>
                <p><strong>Descrizione:</strong> ${data.description}</p>
                <p><strong>Esempio:</strong> <em>${data.example}</em></p>
            `;
        };

        // Event listener per i click sulla griglia
        gridElement.addEventListener('click', (e) => {
            const cell = e.target.closest('.align-cell-mid');
            if (cell) {
                showDetails(cell.dataset.alignment);
            }
        });

        // Render iniziale
        renderGrid();
    }
};

export const render = (containerElement) => AlignmentGuide.render(containerElement);