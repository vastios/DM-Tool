export const ENTRY_STATUS = {
    PLANNING: 'planning',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    ON_HOLD: 'on-hold'
};

export const OBJECTIVE_PRIORITY = {
    MAIN: 'main',
    SECONDARY: 'secondary',
    OPTIONAL: 'optional'
};

export function toRoman(num) {
    if (!num || isNaN(num) || num <= 0) return '';
    const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
    return romanNumerals[num] || num.toString();
}