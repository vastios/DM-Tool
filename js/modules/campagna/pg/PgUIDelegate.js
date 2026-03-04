export class PgUIDelegate {

    // ... (renderPgList rimane invariato)
    static renderPgList(container, pgs) {
        container.innerHTML = '';
        if (pgs.length === 0) {
            container.innerHTML = '<li class="empty-list-message">Nessun personaggio. Creane uno nuovo!</li>';
            return;
        }
        pgs.forEach(pg => {
            const li = document.createElement('li');
            li.className = 'pg-list-item';
            li.innerHTML = `
                <span class="pg-list-item-name" data-id="${pg.id}">${pg.name}</span>
                <div class="pg-list-item-actions">
                    <button class="edit-pg-btn" data-id="${pg.id}" title="Modifica">✏️</button>
                    <button class="delete-pg-btn" data-id="${pg.id}" title="Elimina">🗑️</button>
                </div>
            `;
            container.appendChild(li);
        });
    }

    // >>> NUOVO METODO PRINCIPALE PER LA SCHEDA COMPATTA <<<
    static renderPgSheet(pg) {
        // Dati di esempio, in un'app reale proverrebbero dall'oggetto pg
        const stats = { FOR: 16, DES: 14, COS: 15, INT: 12, SAG: 13, CAR: 10 };
        const modifiers = { FOR: '+3', DES: '+2', COS: '+2', INT: '+1', SAG: '+1', CAR: '+0' };
        const combat = { CA: 16, PF: 52, PF_MAX: 52, Vel: '9m', Iniz: '+2' };
        const skills = [
            { name: 'Atletica', mod: '+5', proficient: true },
            { name: 'Acrobazia', mod: '+2', proficient: false },
            { name: 'Furtività', mod: '+2', proficient: false },
            { name: 'Arcano', mod: '+1', proficient: false },
            { name: 'Storia', mod: '+1', proficient: false },
            { name: 'Indagare', mod: '+1', proficient: false },
            { name: 'Natura', mod: '+1', proficient: false },
            { name: 'Religione', mod: '+1', proficient: false },
            { name: 'Addestrare Animali', mod: '+0', proficient: false },
            { name: 'Intuizione', mod: '+1', proficient: false },
            { name: 'Medicina', mod: '+1', proficient: false },
            { name: 'Percezione', mod: '+3', proficient: true },
            { name: 'Sopravvivenza', mod: '+3', proficient: true },
            { name: 'Inganno', mod: '+0', proficient: false },
            { name: 'Intimidazione', mod: '+5', proficient: true },
            { name: 'Persuasione', mod: '+0', proficient: false },
            { name: 'Rappresentare', mod: '+0', proficient: false }
        ];

        const renderAbilityScores = () => {
            return Object.entries(stats).map(([stat, val]) => `
                <div class="ability-score">
                    <div class="score-value">${val}</div>
                    <div class="score-name">${stat}</div>
                    <div class="score-modifier">(${modifiers[stat]})</div>
                </div>
            `).join('');
        };

        const renderSaves = () => {
            return Object.entries(modifiers).map(([stat, mod]) => `
                <li class="${['FOR', 'COS'].includes(stat) ? 'proficient' : ''}">
                    Tiro Salvezza di ${stat}: <strong>${mod}</strong>
                </li>
            `).join('');
        };
        
        const renderSkills = () => {
            return skills.map(skill => `
                <li class="${skill.proficient ? 'proficient' : ''}">
                    ${skill.name}: <strong>${skill.mod}</strong>
                </li>
            `).join('');
        };

        return `
            <header class="pg-sheet-header">
                <h1>${pg.name}</h1>
                <p>${pg.class || 'N/D'} | ${pg.race || 'N/D'} | ${pg.alignment || 'N/D'}</p>
                <p>Giocatore: ${pg.player || 'N/D'}</p>
            </header>

            <div class="pg-sheet-main-grid">
                <section class="pg-abilities-compact">
                    ${renderAbilityScores()}
                </section>

                <section class="pg-combat-info-compact">
                    <h4>Combattimento</h4>
                    <p><strong>CA:</strong> ${combat.CA}</p>
                    <p><strong>PF:</strong> ${combat.PF} / ${combat.PF_MAX}</p>
                    <p><strong>Velocità:</strong> ${combat.Vel}</p>
                    <p><strong>Iniziativa:</strong> ${combat.Iniz}</p>
                </section>

                <section class="pg-general-info-compact">
                    <h4>Info Generali</h4>
                    <p><strong>Bonus Competenza:</strong> +3</p>
                    <p><strong>Ispezione Passiva:</strong> 13</p>
                </section>
                
                <section class="pg-skills-saves-compact">
                    <div class="pg-saves-list">
                        <h4>Tiri Salvezza</h4>
                        <ul>${renderSaves()}</ul>
                    </div>
                    <div class="pg-skills-list">
                        <h4>Abilità</h4>
                        <ul>${renderSkills()}</ul>
                    </div>
                </section>

                <section class="pg-equipment-spells-compact">
                    <div class="pg-equipment-list">
                        <h4>Equipaggiamento</h4>
                        <ul>
                            <li><span class="pc-item-link">Spada Lunga</span></li>
                            <li><span class="pc-item-link">Scudo</span></li>
                            <li><span class="pc-item-link">Maglia di Scaglie</span></li>
                            <li><span class="pc-item-link">Arco Lungo</span> (20 frecce)</li>
                            <li>Zaino, torcia, razioni.</li>
                        </ul>
                    </div>
                    <div class="pg-spells-list">
                        <h4>Incantesimi</h4>
                        <ul>
                            <li><span class="pc-spell-link">Dardo di Fuoco</span></li>
                            <li><span class="pc-spell-link">Scudo</span></li>
                            <li><span class="pc-spell-link">Immobilizzare Uomo</span></li>
                        </ul>
                    </div>
                </section>
            </div>
        `;
    }
}