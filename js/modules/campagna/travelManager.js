const TravelManager = {
    // Database espanso degli incontri
    encounterDatabase: {
        "Pianura": [
            "Un gruppo di contadini in festa per il raccolto (offrono cibo e alloggio).",
            "Un cavaliere errante in cerca di un degno avversario per un duello non letale.",
            "Uno stormo di corvi che segue il gruppo (presagio o spia?).",
            "Una vecchia pietra miliare con iscrizioni in una lingua dimenticata.",
            "Incontro Ostile: Un piccolo gruppo di Goblin esploratori.",
            "Un carro mercantile rovesciato con il conducente intrappolato sotto.",
            "Un cerchio di pietre antiche che risuona di una debole magia di divinazione.",
            "Un cane randagio addestrato che sembra voler condurre il gruppo verso una fattoria.",
            "Una pattuglia della guardia cittadina che chiede i documenti di viaggio.",
            "Un bue solitario che trasporta una borsa piena di monete d'argento.",
            "Un nobile in fuga con la sua scorta, travestiti da semplici viaggiatori.",
            "Un improvviso sciame di locuste che riduce la visibilità a pochi metri."
        ],
        "Foresta": [
            "Un ruscello dalle acque stranamente luminescenti.",
            "Un cacciatore intrappolato in una delle sue stesse trappole.",
            "Alberi che sembrano sussurrare quando il vento soffia tra i rami.",
            "Un cerchio di funghi (Fairy Ring): entrarvi potrebbe avere effetti magici.",
            "Incontro Ostile: Un Orso Bruno territoriale o un Owlbear.",
            "Una capanna di rami intrecciati che appartiene a una vecchia erborista cieca.",
            "Un totem di legno che rappresenta una divinità della natura dimenticata.",
            "Un cucciolo di creatura magica (es. un piccolo di Ippogrifo) smarrito.",
            "Una zona di foresta pietrificata dove regna un silenzio assoluto.",
            "Incontro Ostile: Ragni Giganti che calano dalle alte chiome degli alberi.",
            "Un elfo silvano che osserva il gruppo dall'alto, senza rivelarsi subito.",
            "Un portale naturale fatto di rami intrecciati che conduce in una radura sacra."
        ],
        "Montagna": [
            "Un sentiero interrotto da una recente frana (richiede prove di Atletica).",
            "Un eremita che vive in una grotta e offre consigli criptici.",
            "L'aria si fa rarefatta: i personaggi senza equipaggiamento adatto faticano.",
            "Un nido di aquile giganti sulla cima di un picco vicino.",
            "Incontro Ostile: Arpie che attirano i viaggiatori verso il baratro.",
            "Una sorgente termale naturale nascosta tra le rocce (permette un riposo breve curativo).",
            "Resti di una vecchia miniera di nanica, l'ingresso è pericolante.",
            "Incontro Ostile: Un elementale della terra che dorme sotto forma di masso.",
            "Un ponte di corda teso sopra un abisso profondo centinaia di metri.",
            "Una fortezza nanica abbandonata le cui porte sono sigillate magicamente.",
            "Un caprone di montagna gigante che sembra voler sfidare i personaggi a una gara di salto.",
            "Una bufera di neve improvvisa che rende impossibile avanzare per 1d4 ore."
        ],
        "Deserto": [
            "Un miraggio di un'oasi che svanisce non appena ci si avvicina.",
            "Una tempesta di sabbia imminente: bisogna trovare riparo subito.",
            "Resti ossei di una creatura gigantesca ormai estinta.",
            "Una carovana di mercanti di spezie disperatamente a corto d'acqua.",
            "Incontro Ostile: Scorpioni giganti che emergono dalla sabbia.",
            "Un'antica piramide seminterrata che rivela solo la sua punta dorata.",
            "Un pozzo artesiano protetto da una tribù di nomadi sospettosi.",
            "Incontro Ostile: Una mummia errante risvegliata dal passaggio del gruppo.",
            "Una distesa di sabbia vetrificata da un antico fulmine magico.",
            "Un vento caldo che trasporta canti lontani in una lingua sconosciuta.",
            "Una duna che nasconde l'ingresso a una tomba dimenticata.",
            "Un collezionista di scarafaggi rari che offre informazioni in cambio di acqua."
        ]
    },

    render(containerElement) {
        this.state = {
            weather: "Sereno",
            temperature: "Gradevole",
            wind: "Assente",
            terrain: "Pianura",
            day: 1
        };

        containerElement.innerHTML = `
            <div class="travel-manager-layout">
                <header class="travel-header">
                    <h1><i class="fas fa-compass"></i> Navigazione e Incontri</h1>
                    <div class="header-controls">
                        <div class="day-counter">Giorno ${this.state.day}</div>
                        <button id="rest-button" class="btn-rest"><i class="fas fa-bed"></i> Riposa</button>
                    </div>
                </header>

                <div class="travel-grid">
                    <section class="travel-card weather-card">
                        <h2><i class="fas fa-cloud-sun"></i> Meteo Locale</h2>
                        <div id="weather-display" class="weather-info">
                            <div class="weather-main">${this.state.weather}</div>
                            <div class="weather-details">
                                <span><i class="fas fa-thermometer-half"></i> ${this.state.temperature}</span>
                                <span><i class="fas fa-wind"></i> ${this.state.wind}</span>
                            </div>
                        </div>
                        <button id="roll-weather" class="btn-primary">Aggiorna Meteo</button>
                    </section>

                    <section class="travel-card terrain-card">
                        <h2><i class="fas fa-mountain"></i> Ambiente di Viaggio</h2>
                        <div class="terrain-selector-wrapper">
                            <label for="terrain-select">Tipo di Terreno:</label>
                            <select id="terrain-select" class="travel-select">
                                <option value="Pianura">Pianura / Prateria</option>
                                <option value="Foresta">Foresta Antica</option>
                                <option value="Montagna">Picchi Montuosi</option>
                                <option value="Deserto">Deserto di Sabbia</option>
                            </select>
                        </div>
                        <div class="terrain-status">
                            <p id="travel-status-text">Il viaggio procede senza ostacoli naturali.</p>
                        </div>
                    </section>

                    <section class="travel-card event-card full-width">
                        <h2><i class="fas fa-dice-d20"></i> Incontro Ambientale</h2>
                        <div class="event-content">
                            <div id="event-display" class="event-box">
                                Seleziona un terreno e genera un incontro per popolare la giornata di viaggio.
                            </div>
                            <div class="event-controls">
                                <button id="roll-event" class="btn-secondary">Genera Incontro su <span id="current-terrain-label">Pianura</span></button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `;

        this.initEventListeners(containerElement);
    },

    initEventListeners(container) {
        const weatherBtn = container.querySelector('#roll-weather');
        const eventBtn = container.querySelector('#roll-event');
        const restBtn = container.querySelector('#rest-button');
        const terrainSelect = container.querySelector('#terrain-select');
        const terrainLabel = container.querySelector('#current-terrain-label');

        terrainSelect.addEventListener('change', (e) => {
            this.state.terrain = e.target.value;
            terrainLabel.innerText = e.target.value;
            this.updateTerrainStatus(container);
        });

        weatherBtn.addEventListener('click', () => this.generateWeather(container));
        eventBtn.addEventListener('click', () => this.generateEvent(container));
        
        restBtn.addEventListener('click', () => {
            this.state.day++;
            container.querySelector('.day-counter').innerText = `Giorno ${this.state.day}`;
            this.generateWeather(container);
            container.querySelector('#event-display').innerHTML = `Il gruppo ha riposato. Inizia un nuovo giorno di viaggio nel terreno: <strong>${this.state.terrain}</strong>.`;
        });
    },

    updateTerrainStatus(container) {
        const statusText = container.querySelector('#travel-status-text');
        const terrainInfo = {
            "Pianura": "Visibilità ottima. Marcia agevole.",
            "Foresta": "Visibilità ridotta. Terreno difficile: velocità dimezzata.",
            "Montagna": "Clima rigido. Pericolo cadute. Velocità ridotta del 75%.",
            "Deserto": "Calore estremo. Necessario doppio consumo di acqua."
        };
        statusText.innerText = terrainInfo[this.state.terrain];
    },

    generateWeather(container) {
        const weathers = [
            { cond: "Sereno", temp: "Gradevole", wind: "Assente" },
            { cond: "Soleggiato", temp: "Caldo", wind: "Brezza Leggera" },
            { cond: "Pioggia", temp: "Fresco", wind: "Moderato" },
            { cond: "Nebbia", temp: "Umido", wind: "Assente" },
            { cond: "Temporale", temp: "Freddo", wind: "Molto Forte" },
            { cond: "Nuvoloso", temp: "Gradevole", wind: "Forte" }
        ];
        const res = weathers[Math.floor(Math.random() * weathers.length)];
        const display = container.querySelector('#weather-display');
        display.innerHTML = `
            <div class="weather-main">${res.cond}</div>
            <div class="weather-details">
                <span><i class="fas fa-thermometer-half"></i> ${res.temp}</span>
                <span><i class="fas fa-wind"></i> ${res.wind}</span>
            </div>
        `;
    },

    generateEvent(container) {
        const terrain = this.state.terrain;
        const encounters = this.encounterDatabase[terrain];
        const randomEnc = encounters[Math.floor(Math.random() * encounters.length)];
        
        const eventBox = container.querySelector('#event-display');
        eventBox.innerHTML = `<strong>Incontro in ${terrain}:</strong><br>${randomEnc}`;
        eventBox.classList.add('new-event');
        setTimeout(() => eventBox.classList.remove('new-event'), 600);
    }
};

export default TravelManager;