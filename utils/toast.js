// utils/toast.js

/**
 * Mostra una notifica "toast" sullo schermo.
 * @param {string} message Il messaggio da visualizzare.
 * @param {'success' | 'error' | 'warning' | 'info'} type Il tipo di notifica, determina lo stile.
 * @param {number} duration La durata in millisecondi prima che la notifica scompaia.
 */
export function showToast(message, type = 'info', duration = 3000) {
    // Crea il container per le toast se non esiste già
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Crea l'elemento della toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Aggiungi un'icona basata sul tipo
    let icon = '';
    switch (type) {
        case 'success':
            icon = '✅';
            break;
        case 'error':
            icon = '❌';
            break;
        case 'warning':
            icon = '⚠️';
            break;
        case 'info':
        default:
            icon = 'ℹ️';
            break;
    }
    
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message">${message}</span>`;
    
    // Aggiungi la toast al container
    toastContainer.appendChild(toast);

    // Attiva l'animazione di entrata
    requestAnimationFrame(() => {
        toast.classList.add('toast-show');
    });

    // Imposta un timer per rimuovere la toast
    setTimeout(() => {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');

        // Rimuovi l'elemento dal DOM dopo l'animazione di uscita
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500); // Deve corrispondere alla durata dell'animazione di uscita nel CSS
    }, duration);
}