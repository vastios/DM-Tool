/**
 * WarlockInvocations.js
 * ─────────────────────────────────────────────────────────────
 * Modulo condiviso per la gestione dei prerequisiti delle suppliche occulte
 * del Warlock (Eldritch Invocations).
 *
 * Usato da:
 *   - PgStep4Warlock.js (wizard creazione)
 *   - PgLevelUpManager.js (level-up step 3)
 *   - PgEditChoices.js (modal modifica scelte)
 *   - PgController.js (validazione)
 *   - PgDataManager.js (validazione)
 *
 * Regole D&D 5e (PHB):
 *   - Al liv. 2 il warlock ottiene 2 suppliche occulte
 *   - Al liv. 5/7/9/12/15/18 ottiene 1 supplica aggiuntiva
 *   - Alcune suppliche richiedono un Dono del Patto specifico
 *     (Patto della Catena, Patto della Lama, Patto del Tomo)
 *   - Alcune suppliche richiedono un Patrono specifico
 *     (Il Fey Selvatico, L'Immondo, Il Grande Antico)
 *   - Alcune suppliche richiedono un livello minimo
 *
 * @author DM Tool
 * @version 1.0.0
 */

/**
 * Verifica se una supplica occulta è selezionabile in base ai prerequisiti.
 *
 * @param {Object} supplica - Oggetto supplica da warlock.suppliche_occulte
 * @param {Object} pg - Dati del PG (deve avere level, subclass=patrono, pactBoon=dono)
 * @param {number} [pgLevelOverride] - Se fornito, usa questo livello invece di pg.level
 *                                     (utile per level-up quando il PG sta salendo di livello)
 * @returns {{ok: boolean, reason: string}} ok=true se selezionabile, altrimenti reason con il motivo
 */
export function checkInvocationPrereq(supplica, pg, pgLevelOverride) {
    if (!supplica) return { ok: false, reason: 'Supplica non valida' };

    const lvl = pgLevelOverride !== undefined ? pgLevelOverride : (pg?.level || 1);
    const patrono = pg?.subclass; // Patrono = sottoclasse per warlock
    const dono = pg?.pactBoon;

    // 1. Livello minimo
    if (supplica.livello_minimo && lvl < supplica.livello_minimo) {
        return { ok: false, reason: `Richiede liv. ${supplica.livello_minimo}` };
    }

    // 2. Richiede Dono del Patto specifico
    if (supplica.richiede_dono && dono !== supplica.richiede_dono) {
        return { ok: false, reason: `Richiede ${supplica.richiede_dono}` };
    }

    // 3. Richiede Patrono specifico
    if (supplica.richiede_patrono && patrono !== supplica.richiede_patrono) {
        return { ok: false, reason: `Richiede patrono ${supplica.richiede_patrono}` };
    }

    return { ok: true, reason: '' };
}

/**
 * Calcola il numero massimo di suppliche occulte che un warlock dovrebbe avere
 * in base al livello.
 *
 * Tabella PHB:
 *   liv. 1  → 0 suppliche (le ottiene al liv. 2)
 *   liv. 2  → 2 suppliche
 *   liv. 5  → 3 suppliche (+1)
 *   liv. 7  → 4 suppliche (+1)
 *   liv. 9  → 5 suppliche (+1)
 *   liv. 12 → 6 suppliche (+1)
 *   liv. 15 → 7 suppliche (+1)
 *   liv. 18 → 8 suppliche (+1)
 *
 * @param {number} pgLevel - Livello del warlock
 * @returns {number} Numero massimo di suppliche
 */
export function getMaxWarlockInvocations(pgLevel) {
    const table = { 2: 2, 5: 3, 7: 4, 9: 5, 12: 6, 15: 7, 18: 8 };
    const levels = Object.keys(table).map(Number).sort((a, b) => b - a);
    for (const lvl of levels) {
        if (pgLevel >= lvl) return table[lvl];
    }
    return 0; // liv. 1 → 0 suppliche
}

/**
 * Calcola quante nuove suppliche il warlock ottiene salendo da currentLevel a newLevel.
 *
 * @param {number} currentLevel - Livello attuale
 * @param {number} newLevel - Nuovo livello dopo il level-up
 * @returns {number} Numero di nuove suppliche da selezionare
 */
export function getNewWarlockInvocations(currentLevel, newLevel) {
    const oldMax = getMaxWarlockInvocations(currentLevel);
    const newMax = getMaxWarlockInvocations(newLevel);
    return Math.max(0, newMax - oldMax);
}

/**
 * Filtra la lista di suppliche occulte restituendo solo quelle selezionabili.
 *
 * @param {Array} suppliche - Lista completa da warlock.suppliche_occulte
 * @param {Object} pg - Dati del PG
 * @param {Array} [alreadyKnown] - Nomi di suppliche già conosciute (da escludere)
 * @param {number} [pgLevelOverride] - Livello da usare al posto di pg.level
 * @returns {Array} Suppliche disponibili
 */
export function getAvailableInvocations(suppliche, pg, alreadyKnown = [], pgLevelOverride) {
    if (!Array.isArray(suppliche)) return [];
    const known = Array.isArray(alreadyKnown) ? alreadyKnown : [];
    return suppliche.filter(s => {
        // Escludi già conosciute
        if (known.includes(s.nome)) return false;
        // Verifica prerequisiti
        return checkInvocationPrereq(s, pg, pgLevelOverride).ok;
    });
}

/**
 * Filtra la lista di suppliche occulte restituendo quelle bloccate dai prerequisiti.
 *
 * @param {Array} suppliche - Lista completa
 * @param {Object} pg - Dati del PG
 * @param {Array} [alreadyKnown] - Nomi di suppliche già conosciute (da escludere)
 * @param {number} [pgLevelOverride] - Livello da usare al posto di pg.level
 * @returns {Array<{supplica: Object, reason: string}>} Suppliche bloccate con motivo
 */
export function getLockedInvocations(suppliche, pg, alreadyKnown = [], pgLevelOverride) {
    if (!Array.isArray(suppliche)) return [];
    const known = Array.isArray(alreadyKnown) ? alreadyKnown : [];
    const locked = [];
    for (const s of suppliche) {
        if (known.includes(s.nome)) continue;
        const check = checkInvocationPrereq(s, pg, pgLevelOverride);
        if (!check.ok) {
            locked.push({ supplica: s, reason: check.reason });
        }
    }
    return locked;
}

console.log('📖 [WarlockInvocations] Modulo condiviso caricato v1.0.0');
