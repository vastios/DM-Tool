// modules/diceRoller.js

import { rollDice } from '../../../utils/dice.js'; // <<< NUOVO IMPORT: Funzione centralizzata per i tiri di dadi

const DiceRoller = {
    render(containerElement) {
        // Inietta l'HTML del lanciatore di dadi nel contenitore fornito
        containerElement.innerHTML = `
            <div class="dice-roller-container">
                <h2>Lancia Dadi</h2>
                <div class="dice-controls">
                    <button class="dice-button" data-dice="4">d4</button>
                    <button class="dice-button" data-dice="6">d6</button>
                    <button class="dice-button" data-dice="8">d8</button>
                    <button class="dice-button" data-dice="10">d10</button>
                    <button class="dice-button" data-dice="12">d12</button>
                    <button class="dice-button" data-dice="20">d20</button>
                    <button class="dice-button" data-dice="100">d100</button>
                </div>
                <div class="dice-result">
                    <span>Risultato:</span> <strong>-</strong>
                </div>
            </div>
        `;

        // Aggiunge gli event listener ai pulsanti dopo che sono stati creati
        const buttons = containerElement.querySelectorAll('.dice-button');
        const resultDisplay = containerElement.querySelector('.dice-result strong');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const diceType = parseInt(button.dataset.dice);
                // <<< MODIFICA QUI: Usa la funzione rollDice importata per un tiro standardizzato
                const result = rollDice(`d${diceType}`); 
                resultDisplay.textContent = result;
            });
        });
    }
};

// Esporta l'oggetto del modulo per poterlo usare in main.js
export default DiceRoller;