/**
 * PgStep7Summary.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza lo Step 7 del wizard: Riepilogo finale.
 * 
 * @author DM Tool
 * @version 1.0.0
 */

import { 
    ABILITY_KEY_TO_PROPERTY,
    calculateModifier, 
    escapeHtml
} from './PgConstants.js';
import { linkifyConditions } from '../../../../utils/htmlHelpers.js';

/**
 * Formatta le monete per il display (sistema D&D: pp, gp, ep, sp, cp)
 */
function formatCoins(treasure) {
    if (!treasure) return '-';
    const parts = [];
    if (treasure.pp) parts.push(`${treasure.pp} pp`);
    if (treasure.gp) parts.push(`${treasure.gp} mo`);
    if (treasure.ep) parts.push(`${treasure.ep} me`);
    if (treasure.sp) parts.push(`${treasure.sp} ma`);
    if (treasure.cp) parts.push(`${treasure.cp} mr`);
    return parts.length > 0 ? parts.join(', ') : '-';
}

/**
 * Calcola il peso totale dell'inventario
 */
function calculateTotalWeight(inventory) {
    if (!inventory || !Array.isArray(inventory)) return 0;
    return inventory.reduce((total, item) => {
        return total + ((item.weight || 0) * (item.quantity || 1));
    }, 0);
}

/**
 * Renderizza lo Step 7: Riepilogo finale
 * @param {Object} pgData - Dati del personaggio
 * @param {Object} databases - Database con razza, classe, etc.
 * @param {string} traitsHtml - HTML dei tratti e privilegi (già renderizzati)
 * @returns {string} HTML dello step
 */
export function renderStep7Summary(pgData, databases, traitsHtml = '') {
    const { selectedRace, selectedClass } = databases;
    // Le capacità qui includono bonus razziali + ASI (applicati in calculateFinalStats)
    const racialBonuses = pgData._racialBonuses || selectedRace?.ability_bonuses || [];
    const asiBonuses = pgData._asiBonuses || {};
    const inventory = pgData.inventory || [];
    const totalWeight = calculateTotalWeight(inventory);
    
    return `
        <div class="wizard-form">
            <div class="summary-header">
                <h2>${escapeHtml(pgData.name || 'Nome PG')}</h2>
                <p>${escapeHtml(pgData.raceName || selectedRace?.classe || selectedRace?.name || '')} ${escapeHtml(pgData.className || selectedClass?.classe || selectedClass?.name || '')} Lv.${pgData.level || 1}</p>
            </div>
            
            <div class="summary-grid">
                <div class="sum-section">
                    <h4>Caratteristiche</h4>
                    <div class="sum-abilities">
                        ${['str', 'dex', 'con', 'int', 'wis', 'cha'].map(key => {
                            const prop = ABILITY_KEY_TO_PROPERTY[key];
                            const total = pgData.abilities?.[prop] || 10;
                            const racial = racialBonuses.find(b => b.ability_score?.index === key)?.bonus || 0;
                            const asi = asiBonuses[prop] || 0;
                            const mod = calculateModifier(total);
                            const bonusStr = (racial > 0 || asi > 0) ? ` (+${racial} razza${asi > 0 ? ', +' + asi + ' ASI' : ''})` : '';
                            return `<div class="sum-ab"><strong>${key.toUpperCase()}</strong>: ${total}${bonusStr} (${mod >= 0 ? '+' : ''}${mod})</div>`;
                        }).join('')}
                    </div>
                </div>
                
                <div class="sum-section">
                    <h4>Combattimento</h4>
                    <p><strong>HP:</strong> ${pgData.hp?.max || 0}</p>
                    <p><strong>CA:</strong> ${pgData.armorClass || 10}</p>
                    <p><strong>Velocità:</strong> ${pgData.speed || 9}m</p>
                    <p><strong>Competenza:</strong> +${pgData.proficiencyBonus || 2}</p>
                </div>
                
                <div class="sum-section">
                    <h4>Competenze</h4>
                    <p><strong>TS:</strong> ${(pgData.savingThrows || []).join(', ') || '-'}</p>
                    <p><strong>Abilità:</strong> ${(pgData.skills || []).join(', ') || '-'}</p>
                </div>
                
                <div class="sum-section">
                    <h4>Inventario</h4>
                    <p><strong>Oggetti:</strong> ${inventory.length}</p>
                    <p><strong>Peso:</strong> ${totalWeight.toFixed(1)} kg</p>
                    <p><strong>Monete:</strong> ${formatCoins(pgData.treasure)}</p>
                </div>

                ${(selectedClass?.index === 'warlock') ? `
                    <div class="sum-section warlock-summary">
                        <h4>🔮 scelte Warlock</h4>
                        <p><strong>Patrono:</strong> ${escapeHtml(pgData.subclass || '— non scelto —')}</p>
                        <p><strong>Dono del Patto:</strong> ${escapeHtml(pgData.pactBoon || '— non scelto —')}</p>
                        <p><strong>Suppliche Occulte:</strong> ${(pgData.eldritchInvocations || []).length > 0 ? (pgData.eldritchInvocations || []).join(', ') : '— nessuna —'}</p>
                        ${pgData.mysticArcanum && Object.keys(pgData.mysticArcanum).length > 0 ? `
                            <p><strong>Arcanum Mistico:</strong> ${Object.entries(pgData.mysticArcanum).map(([l,n]) => n ? `${l}°: ${n}` : '').filter(Boolean).join(', ')}</p>
                        ` : ''}
                        ${(pgData.pactTomeCantrips || []).length > 0 ? `
                            <p><strong>Trucchetti Patto del Tomo:</strong> ${(pgData.pactTomeCantrips || []).join(', ')}</p>
                        ` : ''}
                    </div>
                ` : (pgData.scelte_permanenti && selectedClass) ? `
                    <div class="sum-section class-choices-summary">
                        <h4>⚔️ Scelte di Classe</h4>
                        ${(() => {
                            const sp = pgData.scelte_permanenti;
                            const rows = [];
                            if (sp.stili_combattimento?.length) rows.push(`<p><strong>Stile${sp.stili_combattimento.length > 1 ? 'i' : ''} di Combattimento:</strong> ${sp.stili_combattimento.join(', ')}</p>`);
                            if (sp.metamagia?.length) rows.push(`<p><strong>Metamagia:</strong> ${sp.metamagia.join(', ')}</p>`);
                            if (sp.ascendenza_draconica) rows.push(`<p><strong>Ascendenza Draconica:</strong> ${sp.ascendenza_draconica}</p>`);
                            if (sp.maestria?.length) rows.push(`<p><strong>Maestria:</strong> ${sp.maestria.join(', ')}</p>`);
                            if (sp.segreti_magici?.length) rows.push(`<p><strong>Segreti Magici:</strong> ${sp.segreti_magici.join(', ')}</p>`);
                            if (sp.nemici_prescelti?.length) rows.push(`<p><strong>Nemico Prescelto:</strong> ${sp.nemici_prescelti.join(', ')}</p>`);
                            if (sp.terreni_prescelti?.length) rows.push(`<p><strong>Terreno Prescelto:</strong> ${sp.terreni_prescelti.join(', ')}</p>`);
                            const opts = [];
                            if (sp.preda_cacciatore) opts.push(`Preda: ${sp.preda_cacciatore}`);
                            if (sp.difesa_cacciatore) opts.push(`Difesa: ${sp.difesa_cacciatore}`);
                            if (sp.cacciatore_supremo) opts.push(`Supremo: ${sp.cacciatore_supremo}`);
                            if (opts.length) rows.push(`<p><strong>Opzioni Cacciatore:</strong> ${opts.join(' · ')}</p>`);
                            if (sp.maestria_incantesimi_1 || sp.maestria_incantesimi_2) {
                                const m = [];
                                if (sp.maestria_incantesimi_1) m.push(`1°: ${sp.maestria_incantesimi_1}`);
                                if (sp.maestria_incantesimi_2) m.push(`2°: ${sp.maestria_incantesimi_2}`);
                                rows.push(`<p><strong>Maestria Incantesimi:</strong> ${m.join(' · ')} (a volontà)</p>`);
                            }
                            return rows.length ? rows.join('') : '<p class="lu-hint">Nessuna scelta specifica registrata.</p>';
                        })()}
                    </div>
                ` : ''}
            </div>
            
            <!-- Tratti e Privilegi nel Riepilogo -->
            ${traitsHtml}
            
            ${pgData.backstory ? `<div class="sum-section full"><h4>Background</h4><p>${linkifyConditions(escapeHtml(pgData.backstory))}</p></div>` : ''}
        </div>
    `;
}

console.log('📋 [PgStep7Summary] Modulo caricato.');
