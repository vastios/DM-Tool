/**
 * lazyLoader.js
 * ─────────────────────────────────────────────────────────────
 * Sistema di lazy loading per immagini e componenti.
 * 
 * Features:
 * - Intersection Observer API per caricamento efficiente
 * - Placeholder con blur/skeleton
 * - Supporto per immagini responsive
 * - Prefetch intelligente
 * - Fallback per browser vecchi
 * 
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURAZIONE
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
    rootMargin: '50px 0px',  // Inizia a caricare 50px prima
    threshold: 0.01,
    placeholderClass: 'lazy-placeholder',
    loadedClass: 'lazy-loaded',
    errorClass: 'lazy-error',
    fadeDuration: 300
};

// ═══════════════════════════════════════════════════════════════
// LAZY LOADER CLASS
// ═══════════════════════════════════════════════════════════════

class LazyLoader {
    constructor() {
        this.observer = null;
        this.loadedImages = new Set();
        this.pendingImages = new Map();
        this.init();
    }
    
    /**
     * Inizializza l'Intersection Observer
     */
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    rootMargin: CONFIG.rootMargin,
                    threshold: CONFIG.threshold
                }
            );
            console.log('🔄 [LazyLoader] Intersection Observer inizializzato');
        } else {
            console.warn('⚠️ [LazyLoader] IntersectionObserver non supportato, fallback a caricamento immediato');
        }
        
        // Inietta stili
        this.injectStyles();
    }
    
    /**
     * Gestisce l'intersezione degli elementi
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadElement(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    /**
     * Inietta gli stili CSS per le animazioni
     */
    injectStyles() {
        if (document.getElementById('lazy-loader-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'lazy-loader-styles';
        style.textContent = `
.lazy-placeholder {
    background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
    background-size: 200% 100%;
    animation: lazy-shimmer 1.5s infinite;
}

@keyframes lazy-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.lazy-loaded {
    animation: lazy-fadeIn ${CONFIG.fadeDuration}ms ease-out;
}

@keyframes lazy-fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.lazy-error {
    background: #2a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ef4444;
    font-size: 0.8rem;
}

.lazy-error::before {
    content: '⚠️ Immagine non disponibile';
}
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Registra un'immagine per il lazy loading
     * @param {HTMLImageElement} img - Elemento immagine
     * @param {Object} options - Opzioni
     */
    observe(img, options = {}) {
        if (!img) return;
        
        // Se l'immagine ha già il src, non serve lazy loading
        if (img.src && !img.dataset.src) {
            return;
        }
        
        // Memorizza opzioni
        this.pendingImages.set(img, options);
        
        // Aggiungi placeholder
        if (!img.classList.contains(CONFIG.loadedClass)) {
            img.classList.add(CONFIG.placeholderClass);
        }
        
        // Usa Intersection Observer se disponibile
        if (this.observer) {
            this.observer.observe(img);
        } else {
            // Fallback: carica immediatamente
            this.loadElement(img);
        }
    }
    
    /**
     * Carica un elemento lazy
     * @param {HTMLElement} element - Elemento da caricare
     */
    loadElement(element) {
        const options = this.pendingImages.get(element) || {};
        
        if (element.tagName === 'IMG') {
            this.loadImage(element, options);
        } else if (element.dataset.backgroundImage) {
            this.loadBackgroundImage(element, options);
        }
    }
    
    /**
     * Carica un'immagine
     * @param {HTMLImageElement} img - Elemento immagine
     * @param {Object} options - Opzioni
     */
    loadImage(img, options = {}) {
        const src = img.dataset.src || img.dataset.lazy;
        const srcset = img.dataset.srcset;
        const sizes = img.dataset.sizes;
        
        if (!src) return;
        
        // Crea immagine temporanea per preload
        const tempImg = new Image();
        
        tempImg.onload = () => {
            // Applica attributi
            img.src = src;
            if (srcset) img.srcset = srcset;
            if (sizes) img.sizes = sizes;
            
            // Rimuovi placeholder
            img.classList.remove(CONFIG.placeholderClass);
            img.classList.add(CONFIG.loadedClass);
            
            // Callback
            if (options.onLoad) {
                options.onLoad(img);
            }
            
            // Traccia
            this.loadedImages.add(src);
            this.pendingImages.delete(img);
            
            // Cleanup data attributes
            delete img.dataset.src;
            delete img.dataset.lazy;
        };
        
        tempImg.onerror = () => {
            img.classList.remove(CONFIG.placeholderClass);
            img.classList.add(CONFIG.errorClass);
            
            if (options.onError) {
                options.onError(img);
            }
            
            console.warn(`⚠️ [LazyLoader] Errore caricamento: ${src}`);
        };
        
        tempImg.src = src;
    }
    
    /**
     * Carica un'immagine di sfondo
     * @param {HTMLElement} element - Elemento con background
     * @param {Object} options - Opzioni
     */
    loadBackgroundImage(element, options = {}) {
        const src = element.dataset.backgroundImage;
        if (!src) return;
        
        const img = new Image();
        
        img.onload = () => {
            element.style.backgroundImage = `url("${src}")`;
            element.classList.remove(CONFIG.placeholderClass);
            element.classList.add(CONFIG.loadedClass);
            
            if (options.onLoad) {
                options.onLoad(element);
            }
            
            this.loadedImages.add(src);
            delete element.dataset.backgroundImage;
        };
        
        img.onerror = () => {
            element.classList.remove(CONFIG.placeholderClass);
            element.classList.add(CONFIG.errorClass);
            
            if (options.onError) {
                options.onError(element);
            }
        };
        
        img.src = src;
    }
    
    /**
     * Registra tutte le immagini con data-src
     */
    observeAll(selector = 'img[data-src], img[data-lazy]') {
        const images = document.querySelectorAll(selector);
        images.forEach(img => this.observe(img));
        return images.length;
    }
    
    /**
     * Forza il caricamento di tutte le immagini
     */
    loadAll() {
        this.pendingImages.forEach((options, element) => {
            this.loadElement(element);
        });
    }
    
    /**
     * Prefetch immagini che verranno probabilmente usate
     * @param {string[]} urls - Array di URL da prefetchare
     */
    prefetch(urls) {
        urls.forEach(url => {
            if (this.loadedImages.has(url)) return;
            
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
        });
    }
    
    /**
     * Ottiene statistiche
     */
    getStats() {
        return {
            loaded: this.loadedImages.size,
            pending: this.pendingImages.size,
            observerActive: this.observer !== null
        };
    }
    
    /**
     * Distrugge l'observer
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.pendingImages.clear();
    }
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE LAZY IMAGE
// ═══════════════════════════════════════════════════════════════

/**
 * Crea un elemento immagine con lazy loading
 * @param {Object} options - Opzioni immagine
 * @returns {HTMLImageElement}
 */
export function createLazyImage(options) {
    const {
        src,
        srcset,
        sizes,
        alt = '',
        className = '',
        placeholder = true,
        onLoad,
        onError
    } = options;
    
    const img = document.createElement('img');
    img.alt = alt;
    
    if (className) {
        img.className = className;
    }
    
    if (placeholder) {
        img.classList.add(CONFIG.placeholderClass);
    }
    
    // Imposta data attributes per lazy loading
    img.dataset.src = src;
    if (srcset) img.dataset.srcset = srcset;
    if (sizes) img.dataset.sizes = sizes;
    
    // Registra per lazy loading
    lazyLoader.observe(img, { onLoad, onError });
    
    return img;
}

/**
 * Crea un placeholder skeleton
 * @param {number} width - Larghezza
 * @param {number} height - Altezza
 * @returns {HTMLDivElement}
 */
export function createPlaceholder(width, height) {
    const div = document.createElement('div');
    div.className = CONFIG.placeholderClass;
    div.style.width = `${width}px`;
    div.style.height = `${height}px`;
    return div;
}

// ═══════════════════════════════════════════════════════════════
// LAZY MODULE LOADER
// ═══════════════════════════════════════════════════════════════

/**
 * Cache per moduli caricati dinamicamente
 */
const moduleCache = new Map();

/**
 * Carica un modulo JavaScript dinamicamente
 * @param {string} modulePath - Path del modulo
 * @returns {Promise<Object>}
 */
export async function loadModule(modulePath) {
    if (moduleCache.has(modulePath)) {
        return moduleCache.get(modulePath);
    }
    
    try {
        const module = await import(modulePath);
        moduleCache.set(modulePath, module);
        return module;
    } catch (error) {
        console.error(`❌ [LazyLoader] Errore caricamento modulo: ${modulePath}`, error);
        throw error;
    }
}

/**
 * Precarica moduli in background
 * @param {string[]} modulePaths - Array di path
 */
export function preloadModules(modulePaths) {
    modulePaths.forEach(path => {
        // Usa <link rel="modulepreload"> se supportato
        const link = document.createElement('link');
        link.rel = 'modulepreload';
        link.href = path;
        document.head.appendChild(link);
    });
}

// ═══════════════════════════════════════════════════════════════
// SINGLETON E API PUBBLICA
// ═══════════════════════════════════════════════════════════════

const lazyLoader = new LazyLoader();

export { lazyLoader };

/**
 * Inizializza lazy loading per tutte le immagini
 */
export function initializeLazyLoading() {
    const count = lazyLoader.observeAll();
    console.log(`🔄 [LazyLoader] Inizializzato per ${count} immagini`);
    return count;
}

export default lazyLoader;

console.log('🖼️ [LazyLoader] Sistema lazy loading caricato.');
