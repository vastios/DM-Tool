// js/modules/campagna/uniqueItemManager/uniqueItemData.js

// NOTA: Questo array è un campione del tuo file items.js.
// In un'applicazione reale, questo file importerebbe il tuo `items.js` completo.
const BASE_ITEMS_DATABASE = [
    {
        index: "whetstone", name: "Pietra per affilare", equipment_category: { name: "Equipaggiamento da Avventura" },
        cost: { quantity: 1, unit: "mr" }, weight: 0.5
    },
    {
        index: "whip", name: "Frusta", equipment_category: { name: "Arma" },
        weapon_category: "Marziale", weapon_range: "Mischia",
        cost: { quantity: 2, unit: "mo" },
        damage: { damage_dice: "1d4", damage_type: { name: "Tagliente" } }, properties: [{ name: "Finesse" }, { name: "Portata" }],
        weight: 1.5
    },
    {
        index: "wooden-staff", name: "Bastone di legno", equipment_category: { name: "Equipaggiamento da Avventura" },
        gear_category: { name: "Focalizzatori Druidici" },
        cost: { quantity: 5, unit: "mo" }, weight: 2,
        desc: ["Un focalizzatore druidico..."]
    },
    {
        index: "warhammer", name: "Martello da guerra", equipment_category: { name: "Arma" },
        weapon_category: "Marziale", weapon_range: "Mischia",
        cost: { quantity: 15, unit: "mo" },
        damage: { damage_dice: "1d8", damage_type: { name: "Contundente" }}, properties: [{ name: "Versatile" }],
        weight: 1,
        two_handed_damage: { damage_dice: "1d10", damage_type: { name: "Contundente" }}
    },
    {
        index: "trident", name: "Tridente", equipment_category: { name: "Arma" },
        weapon_category: "Marziale", weapon_range: "Mischia",
        cost: { quantity: 5, unit: "mo" },
        damage: { damage_dice: "1d6", damage_type: { name: "Perforante" }}, properties: [{ name: "Lancio" }, { name: "Versatile" }],
        weight: 2, throw_range: { normal: 6, long: 18 },
        two_handed_damage: { damage_dice: "1d8", damage_type: { name: "Perforante" }}
    },
    {
        index: "longbow", name: "Arco lungo", equipment_category: { name: "Arma" },
        weapon_category: "Marziale", weapon_range: "Distanza",
        cost: { quantity: 50, unit: "mo" },
        damage: { damage_dice: "1d8", damage_type: { name: "Perforante" }}, properties: [{ name: "Munizioni" }, { name: "Pesante" }, { name: "A Due Mani" }],
        weight: 1, range: { normal: 45, long: 180 }
    },
    {
        index: "chain-mail", name: "Cotta di Maglia", equipment_category: { name: "Armatura" },
        armor_class: { base: 16, dex_bonus: false },
        weight: 27.5, cost: { quantity: 75, unit: "gp" },
        strength_minimum: 13
    },
    {
        index: "shield", name: "Scudo", equipment_category: { name: "Armatura" },
        armor_class: { base: 2 },
        weight: 3, cost: { quantity: 10, unit: "gp" }
    }
    // Aggiungi qui altri oggetti dal tuo database completo
];

/**
 * Ottiene tutti gli oggetti base dal database.
 */
export const getAllBaseItems = () => BASE_ITEMS_DATABASE;

/**
 * Ottiene una lista unica di tipi di categoria (es. "Arma", "Armatura").
 */
export const getItemTypes = () => {
    const types = [...new Set(BASE_ITEMS_DATABASE.map(item => item.equipment_category?.name).filter(Boolean))];
    return types;
};

/**
 * Filtra gli oggetti base per un tipo di categoria specifico.
 * @param {string} type - Il nome della categoria (es. "Arma").
 * @returns {Array} Un array di oggetti base di quel tipo.
 */
export const getItemsByType = (type) => {
    return BASE_ITEMS_DATABASE.filter(item => item.equipment_category?.name === type);
};

/**
 * Trova un oggetto base per nome e ne estrae le statistiche rilevanti.
 * @param {string} name - Il nome dell'oggetto da cercare.
 * @returns {Object|null} Un oggetto con le statistiche o null se non trovato.
 */
export const getBaseItemByName = (name) => {
    const item = BASE_ITEMS_DATABASE.find(i => i.name === name);
    if (!item) return null;

    const stats = {
        damageDice: item.damage?.damage_dice || '',
        damageType: item.damage?.damage_type?.name || '',
        properties: item.properties?.map(p => p.name) || [],
        armorClass: item.armor_class?.base || null,
        armorDexBonus: item.armor_class?.dex_bonus || false,
        strengthMinimum: item.strength_minimum || null,
        weight: item.weight || 0,
        cost: item.cost || {},
        description: (item.desc || []).join(' '),
        range: item.range || {},
        throw_range: item.throw_range || {},
        two_handed_damage: item.two_handed_damage || {}
    };
    return stats;
};