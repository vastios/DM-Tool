// utils/dice.js

/**
 * Tira i dadi basandosi su una stringa standard (es. "2d6+3", "1d8", "d20").
 * @param {string} diceString La stringa che rappresenta il tiro di dadi.
 * @returns {number} Il risultato totale del tiro.
 */
export function rollDice(diceString) {
    if (!diceString || typeof diceString !== 'string') return 0;
    
    const parts = diceString.toLowerCase().trim().split('d');
    if (parts.length !== 2 || parts[0] === '' && parts[1] === '') return 0;

    const numDiceStr = parts[0];
    const diceFacesAndBonus = parts[1];
    
    let numDice = 1; // Default per stringhe come "d6"
    if (numDiceStr !== '') {
        numDice = parseInt(numDiceStr, 10);
    }
    
    let bonus = 0;
    let diceFaces = 0;

    if (diceFacesAndBonus.includes('+')) {
        const bonusParts = diceFacesAndBonus.split('+');
        diceFaces = parseInt(bonusParts[0], 10);
        bonus = parseInt(bonusParts[1], 10);
    } else if (diceFacesAndBonus.includes('-')) {
        const bonusParts = diceFacesAndBonus.split('-');
        diceFaces = parseInt(bonusParts[0], 10);
        bonus = -parseInt(bonusParts[1], 10);
    } else {
        diceFaces = parseInt(diceFacesAndBonus, 10);
    }
    
    if (isNaN(numDice) || isNaN(diceFaces) || numDice <= 0 || diceFaces <= 0) {
        return 0; // Stringa di dadi non valida
    }

    let total = bonus;
    for (let i = 0; i < numDice; i++) {
        total += Math.floor(Math.random() * diceFaces) + 1;
    }
    return total;
}