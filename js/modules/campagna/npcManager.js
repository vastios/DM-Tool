//modules/npcManager.js

import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { rollDice } from '../../../utils/dice.js';
import { spellDatabase } from '../../../database/spells.js';
//import { monsterDatabase } from '../../../database/monsterDatabase.js';
import { addMonsterToCombat } from '../../../stateManager.js';


// --- FUNZIONI PER LA GESTIONE DEL LOCAL STORAGE ---
function getStorageKey() {
const campaignId = getCurrentCampaignId();
if (!campaignId) {
console.warn("⚠️ [NpcManager] Tentativo di accedere al localStorage senza una campagna selezionata.");
return null;
}
return `dungeonMasterToolNpcs_${campaignId}`;
}

function saveNpcs(npcs) {
const storageKey = getStorageKey();
if (!storageKey) return;
try {
localStorage.setItem(storageKey, JSON.stringify(npcs));
console.log(`💾 [NpcManager] PNG salvati per la campagna ${getCurrentCampaignId()}.`);
} catch (error) {
console.error("❌ [NpcManager] Impossibile salvare i PNG:", error);
}
}

function loadNpcs() {
const storageKey = getStorageKey();
if (!storageKey) return [];
try {
const savedNpcsJSON = localStorage.getItem(storageKey);
return savedNpcsJSON ? JSON.parse(savedNpcsJSON) : [];
} catch (error) {
console.error("❌ [NpcManager] Impossibile caricare i PNG:", error);
return [];
}
}

// --- NUOVA FUNZIONE: Genera un array di 6 statistiche ---
function rollStats() {
const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const rolledStats = {};
abilities.forEach(ability => {
const rolls = [];
for (let i = 0; i < 4; i++) {
rolls.push(rollDice('1d6'));
}
rolls.sort((a, b) => b - a);
const finalScore = rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
rolledStats[ability] = finalScore;
});
return rolledStats;
}

// --- NUOVA FUNZIONE: Crea un oggetto "mostro" minimo da un PNG ---
function createMinimalMonsterFromNpc(npc) {
const stats = {
strength: npc.strength || 10, dexterity: npc.dexterity || 10, constitution: npc.constitution || 10,
intelligence: npc.intelligence || 10, wisdom: npc.wisdom || 10, charisma: npc.charisma || 10,
};
const dexMod = Math.floor((stats.dexterity - 10) / 2);
const conMod = Math.floor((stats.constitution - 10) / 2);
const highestStat = Math.max(...Object.values(stats));
const estimatedLevel = Math.max(1, Math.floor((highestStat - 10) / 2));
const hp = 8 + conMod + (estimatedLevel * 8);

return {
name: npc.name, size: "Medio", type: "Umanoide", subtype: npc.race || "Umano", alignment: npc.alignment || "Neutrale",
armor_class: [{ type: "naturale", value: 10 + dexMod }], hit_points: hp, hit_dice: `${estimatedLevel}d8 + ${8 + conMod}`,
speed: { camminare: "9 m." }, strength: stats.strength, dexterity: stats.dexterity, constitution: stats.constitution,
intelligence: stats.intelligence, wisdom: stats.wisdom, charisma: stats.charisma, proficiencies: [], damage_vulnerabilities: [],
damage_resistances: [], damage_immunities: [], condition_immunities: [], senses: { "Percezione passiva": 10 },
languages: "Comune", challenge_rating: estimatedLevel, xp: (estimatedLevel * estimatedLevel) * 10,
special_abilities: [], actions: [], reactions: [], legendary_actions: [], source: "Gestore PNG", isNpc: true
};
}

const NpcManager = {
render(containerElement) {
// --- STILE SPECIFICO DEL MODULO ---
const moduleStyles = `
<style>
/* Modifica larghezza pannello sinistro e ottimizzazione layout */
.npc-manager-container .npc-list-panel {
flex: 0 0 280px; /* Ridotto da 350px a 280px */
}
.npc-manager-container .panel-header {
margin-bottom: 10px; /* Ridotto margine */
}
/* Stili per le carte voltabili */
.npc-viewer-cards-container {
display: flex; height: 100%; gap: 20px;
}
.flip-card-container { flex: 1; perspective: 1000px; }
.flip-card { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.6s; }
.flip-card.flipped { transform: rotateY(180deg); }
.flip-card-front, .flip-card-back {
position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden;
overflow-y: auto; box-sizing: border-box;
}
.flip-card-back { transform: rotateY(180deg); }
.flip-button {
position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); color: #fff; border: none;
border-radius: 50%; width: 30px; height: 30px; font-size: 16px; cursor: pointer; z-index: 10;
display: flex; align-items: center; justify-content: center;
}
.flip-button:hover { background: rgba(0,0,0,0.8); }
</style>
`;

containerElement.innerHTML = `
${moduleStyles}
<div class="npc-manager-container">
<div class="npc-list-panel">
<div class="panel-header"><h2>Gestore PNG</h2></div>

<div style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; align-items: center;">
<input type="text" id="npc-search" class="list-search" placeholder="Cerca un PNG..." style="width: 100%;">
<button id="new-npc-btn" class="action-btn" style="width: 50%; padding: 4px 6px; font-size: 0.7rem; line-height: 1;">NUOVO</button>
</div>

<ul id="saved-npcs-list" class="saved-npcs-list"></ul>
</div>
<div class="npc-editor-panel">
<div id="editor-content" style="height: 100%;">
<p style="text-align: center; color: #888; margin-top: 3rem;">Seleziona un PNG esistente o creane uno nuovo per iniziare.</p>
</div>
</div>
</div>
`;

const savedList = containerElement.querySelector('#saved-npcs-list');
const editorContent = containerElement.querySelector('#editor-content');
const newNpcBtn = containerElement.querySelector('#new-npc-btn');
const searchInput = containerElement.querySelector('#npc-search');

let npcs = loadNpcs();
let currentEditingId = null;
let selectedSpells = []; let selectedInventory = []; let selectedSpecialItems = [];

// --- FUNZIONI DI RENDERING ---
const renderNpcList = (searchTerm = '') => {
savedList.innerHTML = '';
const filteredNpcs = npcs.filter(npc =>
(npc.name && npc.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
(npc.role && npc.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
(npc.race && npc.race.toLowerCase().includes(searchTerm.toLowerCase()))
);
if (filteredNpcs.length === 0) { savedList.innerHTML = '<li class="empty-list">Nessun PNG trovato.</li>'; return; }
const sortedNpcs = [...filteredNpcs].sort((a, b) => a.name.localeCompare(b.name));
sortedNpcs.forEach(npc => {
const li = document.createElement('li'); li.className = 'npc-list-item'; li.dataset.id = npc.id;
li.innerHTML = `
<div class="npc-item-info">
<h3>${npc.name}</h3><p><em>${npc.race}</em> - ${npc.role}</p>
${npc.location ? `<small><strong>Luogo:</strong> ${npc.location}</small>` : ''}
</div>
<div class="npc-item-actions">
<button class="action-btn small edit-list-btn" data-npc-id="${npc.id}" title="Modifica">✏️</button>
<button class="action-btn small danger delete-list-btn" data-npc-id="${npc.id}" title="Elimina">🗑️</button>
<button class="action-btn small add-to-combat-list-btn" data-npc-id="${npc.id}" title="Aggiungi al Combattimento">⚔️</button>
</div>
`;
savedList.appendChild(li);
});
};

const renderNpcViewer = (npc) => {
const stats = { strength: npc.strength || 10, dexterity: npc.dexterity || 10, constitution: npc.constitution || 10, intelligence: npc.intelligence || 10, wisdom: npc.wisdom || 10, charisma: npc.charisma || 10 };
const getMod = (score) => (score >= 10 ? '+' : '') + Math.floor((score - 10) / 2);
const dexMod = Math.floor((stats.dexterity - 10) / 2); const conMod = Math.floor((stats.constitution - 10) / 2);
const estimatedLevel = Math.max(1, Math.floor((Math.max(...Object.values(stats)) - 10) / 2)); const hp = 8 + conMod + (estimatedLevel * 8); const ac = 10 + dexMod;
const createList = (items) => items.length > 0 ? `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>` : '<p>Nessuno</p>';
const createDescList = (items) => items.length > 0 ? `<ul>${items.map(item => `<li><strong>${item.name}:</strong> ${item.description}</li>`).join('')}</ul>` : '<p>Nessuno</p>';

editorContent.innerHTML = `
<div class="npc-viewer-cards-container">
<div class="flip-card-container"><div class="flip-card" id="card-1"><button class="flip-button">↻</button>
<div class="flip-card-front npc-stat-block">
<div class="npc-stat-block-header"><h3>${npc.name}</h3><p><em>${npc.race}, ${npc.role}</em></p></div><hr>
<div class="npc-section"><p><strong>Allineamento:</strong> ${npc.alignment || 'Non specificato'}</p><p><strong>Luogo:</strong> ${npc.location || 'Errante'}</p></div>
<div class="npc-section"><h4>Aspetto Fisico</h4><p>${npc.appearance || 'Nessuna descrizione disponibile.'}</p></div>
<div class="npc-section"><h4>Personalità</h4><p>${npc.personality || 'Nessuna descrizione disponibile.'}</p></div>
</div>
<div class="flip-card-back npc-stat-block">
<div class="npc-stat-block-header"><h3>${npc.name} (Meccaniche)</h3></div><hr>
<div class="npc-stats-grid">
<div><strong>FOR</strong> ${stats.strength} (${getMod(stats.strength)})</div><div><strong>DES</strong> ${stats.dexterity} (${getMod(stats.dexterity)})</div>
<div><strong>COS</strong> ${stats.constitution} (${getMod(stats.constitution)})</div><div><strong>INT</strong> ${stats.intelligence} (${getMod(stats.intelligence)})</div>
<div><strong>SAG</strong> ${stats.wisdom} (${getMod(stats.wisdom)})</div><div><strong>CAR</strong> ${stats.charisma} (${getMod(stats.charisma)})</div>
</div><hr>
<div class="npc-section"><p><strong>Classe Armatura:</strong> ${ac}</p><p><strong>Punti Ferita:</strong> ${hp}</p><p><strong>Velocità:</strong> 9 m.</p></div>
</div>
</div></div>
<div class="flip-card-container"><div class="flip-card" id="card-2"><button class="flip-button">↻</button>
<div class="flip-card-front npc-stat-block">
<div class="npc-stat-block-header"><h3>${npc.name} (Contesto)</h3></div><hr>
<div class="npc-section"><h4>Relazioni</h4><p>${npc.relazioni || 'Nessuna relazione nota.'}</p></div>
<div class="npc-section"><h4>Nota Segreta del DM</h4><p class="secret-note">${npc.secretNote || 'Nessuna nota segreta.'}</p></div>
</div>
<div class="flip-card-back npc-stat-block">
<div class="npc-stat-block-header"><h3>${npc.name} (Equipaggiamento)</h3></div><hr>
<div class="npc-section"><h4>Inventario</h4>${createList(npc.inventory || [])}</div>
<div class="npc-section"><h4>Oggetti Speciali</h4>${createDescList(npc.specialItems || [])}</div>
<div class="npc-section"><h4>Incantesimi</h4>${createList(npc.spells || [])}</div>
</div>
</div></div>
</div>
`;
};

const renderNpcEditor = (npc = null) => {
const isNew = !npc; currentEditingId = isNew ? null : npc.id;
selectedSpells = isNew ? [] : (npc.spells || []); selectedInventory = isNew ? [] : (npc.inventory || []); selectedSpecialItems = isNew ? [] : (npc.specialItems || []);
editorContent.innerHTML = `
<div class="editor-form">
<div class="form-group"><label for="npc-name">Nome del PNG:</label><input type="text" id="npc-name" value="${isNew ? '' : npc.name}" placeholder="Es. Elara Mezzosangue"></div>
<div class="form-row"><div class="form-group"><label for="npc-race">Razza:</label><input type="text" id="npc-race" value="${isNew ? '' : npc.race}" placeholder="Es. Elfo"></div>
<div class="form-group"><label for="npc-role">Ruolo:</label><input type="text" id="npc-role" value="${isNew ? '' : npc.role}" placeholder="Es. Capitano della guardia"></div></div>
<div class="form-row"><div class="form-group"><label for="npc-location">Luogo:</label><input type="text" id="npc-location" value="${isNew ? '' : npc.location}" placeholder="Es. Città di Waterdeep"></div>
<div class="form-group"><label for="npc-alignment">Allineamento:</label><input type="text" id="npc-alignment" value="${isNew ? '' : npc.alignment}" placeholder="Es. Caotico Neutrale"></div></div>
<div class="form-group"><div class="form-section-header"><h4>Caratteristiche</h4><button id="roll-stats-btn" class="action-btn" type="button">Lancia Dadi</button></div>
<div class="stats-editor-grid">
<div class="form-group"><label for="npc-strength">FOR:</label><input type="number" id="npc-strength" value="${npc?.strength || 10}" min="1" max="20"></div>
<div class="form-group"><label for="npc-dexterity">DES:</label><input type="number" id="npc-dexterity" value="${npc?.dexterity || 10}" min="1" max="20"></div>
<div class="form-group"><label for="npc-constitution">COS:</label><input type="number" id="npc-constitution" value="${npc?.constitution || 10}" min="1" max="20"></div>
<div class="form-group"><label for="npc-intelligence">INT:</label><input type="number" id="npc-intelligence" value="${npc?.intelligence || 10}" min="1" max="20"></div>
<div class="form-group"><label for="npc-wisdom">SAG:</label><input type="number" id="npc-wisdom" value="${npc?.wisdom || 10}" min="1" max="20"></div>
<div class="form-group"><label for="npc-charisma">CAR:</label><input type="number" id="npc-charisma" value="${npc?.charisma || 10}" min="1" max="20"></div>
</div>
</div>
<div class="form-group"><label for="npc-relazioni">Relazioni:</label><textarea id="npc-relazioni" rows="3" placeholder="Descrivi le relazioni del PNG...">${isNew ? '' : (npc.relazioni || '')}</textarea></div>
<div class="form-group"><label for="npc-appearance">Aspetto Fisico:</label><textarea id="npc-appearance" rows="3" placeholder="Descrivi l'aspetto del PNG...">${isNew ? '' : npc.appearance}</textarea></div>
<div class="form-group"><label for="npc-personality">Personalità:</label><textarea id="npc-personality" rows="3" placeholder="Descrivi il carattere...">${isNew ? '' : npc.personality}</textarea></div>
<div class="form-group"><label for="npc-secret-note">Nota Segreta:</label><textarea id="npc-secret-note" rows="3" placeholder="Informazioni nascoste...">${isNew ? '' : npc.secretNote}</textarea></div>
<div class="form-group"><div class="form-section-header"><h4>Inventario</h4><button id="add-inventory-btn" class="action-btn small">Aggiungi</button></div><ul id="npc-inventory-list" class="npc-inventory-list"></ul></div>
<div class="form-group"><div class="form-section-header"><h4>Oggetti Speciali</h4><button id="add-special-item-btn" class="action-btn small">Crea</button></div><ul id="special-items-list" class="special-items-list"></ul></div>
<div class="form-group"><div class="form-section-header"><h4>Incantesimi</h4></div><div class="spell-search"><input type="text" id="spell-search" class="list-search" placeholder="Cerca un incantesimo..."></div><ul id="npc-spell-list" class="npc-spell-list"></ul></div>
<div class="editor-actions"><button id="save-npc-btn" class="action-btn">Salva PNG</button></div>
</div>
`;
setupEditorListeners(); updateSpellList(); updateInventoryList(); updateSpecialItemsList();
};

const updateSpellList = () => { const list = containerElement.querySelector('#npc-spell-list'); if (!list) return; list.innerHTML = selectedSpells.map(spellName => `<li>${spellName} <button class="remove-item-btn" data-type="spell" data-name="${spellName}">✕</button></li>`).join(''); };
const updateInventoryList = () => { const list = containerElement.querySelector('#npc-inventory-list'); if (!list) return; list.innerHTML = selectedInventory.map(item => `<li>${item} <button class="remove-item-btn" data-type="inventory" data-name="${item}">✕</button></li>`).join(''); };
const updateSpecialItemsList = () => { const list = containerElement.querySelector('#special-items-list'); if (!list) return; list.innerHTML = selectedSpecialItems.map(item => `<li><strong>${item.name}:</strong> ${item.description} <button class="remove-item-btn" data-type="special" data-name="${item.name}">✕</button></li>`).join(''); };

// --- SETUP DEGLI EVENT LISTENER ---
savedList.addEventListener('click', (e) => {
const li = e.target.closest('.npc-list-item'); if (!li) return;
const npcId = li.dataset.id; const npc = npcs.find(n => n.id === npcId);
if (e.target.closest('.npc-item-actions')) { e.stopPropagation();
if (e.target.classList.contains('edit-list-btn')) { if (npc) renderNpcEditor(npc); }
else if (e.target.classList.contains('delete-list-btn')) { if (npc && confirm(`Eliminare "${npc.name}"?`)) { npcs = npcs.filter(n => n.id !== npcId); saveNpcs(npcs); renderNpcList(); if (editorContent.querySelector('.npc-stat-block')?.dataset.npcId === npcId) { editorContent.innerHTML = `<p style="text-align: center; color: #888; margin-top: 3rem;">PNG eliminato.</p>`; } showToast(`PNG "${npc.name}" eliminato.`, 'warning'); } }
else if (e.target.classList.contains('add-to-combat-list-btn')) { if (npc) { addMonsterToCombat(createMinimalMonsterFromNpc(npc)); showToast(`${npc.name} aggiunto al combattimento!`, 'success'); } }
} else { if (npc) renderNpcViewer(npc); }
});
editorContent.addEventListener('click', (e) => { if (e.target.classList.contains('flip-button')) { e.target.closest('.flip-card').classList.toggle('flipped'); } });

const setupEditorListeners = () => {
const saveBtn = containerElement.querySelector('#save-npc-btn'); const rollBtn = containerElement.querySelector('#roll-stats-btn');
const addInvBtn = containerElement.querySelector('#add-inventory-btn'); const addSpecBtn = containerElement.querySelector('#add-special-item-btn');
const spellSearchInput = containerElement.querySelector('#spell-search');
if (rollBtn) { rollBtn.addEventListener('click', () => { const stats = rollStats(); for (const [key, value] of Object.entries(stats)) { const input = editorContent.querySelector(`#npc-${key}`); if (input) input.value = value; } }); }
if (saveBtn) {
saveBtn.addEventListener('click', () => {
const name = editorContent.querySelector('#npc-name').value.trim(); if (!name) { showToast('Il nome del PNG è obbligatorio.', 'error'); return; }
const now = Date.now(); const npcData = {
name, race: editorContent.querySelector('#npc-race').value.trim(), role: editorContent.querySelector('#npc-role').value.trim(),
location: editorContent.querySelector('#npc-location').value.trim(), alignment: editorContent.querySelector('#npc-alignment').value.trim(),
appearance: editorContent.querySelector('#npc-appearance').value.trim(), personality: editorContent.querySelector('#npc-personality').value.trim(),
secretNote: editorContent.querySelector('#npc-secret-note').value.trim(), relazioni: editorContent.querySelector('#npc-relazioni').value.trim(),
lastModified: now, strength: parseInt(editorContent.querySelector('#npc-strength').value) || 10, dexterity: parseInt(editorContent.querySelector('#npc-dexterity').value) || 10,
constitution: parseInt(editorContent.querySelector('#npc-constitution').value) || 10, intelligence: parseInt(editorContent.querySelector('#npc-intelligence').value) || 10,
wisdom: parseInt(editorContent.querySelector('#npc-wisdom').value) || 10, charisma: parseInt(editorContent.querySelector('#npc-charisma').value) || 10,
spells: selectedSpells, inventory: selectedInventory, specialItems: selectedSpecialItems,
};
if (currentEditingId) { const index = npcs.findIndex(n => n.id === currentEditingId); npcs[index] = { ...npcs[index], ...npcData }; saveNpcs(npcs); renderNpcViewer(npcs[index]); }
else { const newNpc = { id: now.toString(), ...npcData }; npcs.push(newNpc); saveNpcs(npcs); renderNpcViewer(newNpc); }
renderNpcList(); showToast('PNG salvato con successo!', 'success');
});
}
if (addInvBtn) { addInvBtn.addEventListener('click', () => { const itemName = prompt("Nome dell'oggetto:"); if (itemName && itemName.trim()) { selectedInventory.push(itemName.trim()); updateInventoryList(); } }); }
if (addSpecBtn) { addSpecBtn.addEventListener('click', () => { const itemName = prompt("Nome dell'oggetto speciale:"); const itemDesc = prompt("Descrizione:"); if (itemName && itemName.trim() && itemDesc && itemDesc.trim()) { selectedSpecialItems.push({ name: itemName.trim(), description: itemDesc.trim() }); updateSpecialItemsList(); } }); }
if (spellSearchInput) {
spellSearchInput.addEventListener('input', (e) => {
const searchTerm = e.target.value.toLowerCase(); const list = containerElement.querySelector('#npc-spell-list'); if (!list) return;
if (searchTerm.length < 2) { list.innerHTML = ''; return; }
const matchingSpells = Object.keys(spellDatabase).filter(spellName => spellName.toLowerCase().includes(searchTerm) && !selectedSpells.includes(spellName));
list.innerHTML = matchingSpells.map(spellName => `<li class="add-spell-item" data-spell="${spellName}">${spellName}</li>`).join('');
});
}
};
editorContent.addEventListener('click', (e) => {
if (e.target.classList.contains('remove-item-btn')) {
const type = e.target.dataset.type; const name = e.target.dataset.name;
if (type === 'spell') { selectedSpells = selectedSpells.filter(s => s !== name); updateSpellList(); }
else if (type === 'inventory') { selectedInventory = selectedInventory.filter(i => i !== name); updateInventoryList(); }
else if (type === 'special') { selectedSpecialItems = selectedSpecialItems.filter(i => i.name !== name); updateSpecialItemsList(); }
}
if (e.target.classList.contains('add-spell-item')) { const spellName = e.target.dataset.spell; if (!selectedSpells.includes(spellName)) { selectedSpells.push(spellName); updateSpellList(); e.target.style.display = 'none'; } }
});
newNpcBtn.addEventListener('click', () => renderNpcEditor());
searchInput.addEventListener('input', (e) => renderNpcList(e.target.value));

// --- INIZIALIZZAZIONE ---
if (npcs.length > 0) { const mostRecentNpc = [...npcs].sort((a, b) => b.lastModified - a.lastModified)[0]; renderNpcViewer(mostRecentNpc); }
renderNpcList();
}
};

export default NpcManager;