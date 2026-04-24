/**
 * performance.js
 * ─────────────────────────────────────────────────────────────
 * Utility per l'ottimizzazione delle performance.
 * 
 * Include:
 * - debounce: Ritarda l'esecuzione fino a che non passa un certo tempo
 * - throttle: Limita l'esecuzione a una volta ogni X ms
 * - rafThrottle: Throttle usando requestAnimationFrame
 * - memoize: Cache risultati di funzioni pure
 * - lazyLoad: Caricamento differito
 * 
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════
// DEBOUNCE
// ═══════════════════════════════════════════════════════════════

/**
 * Ritarda l'esecuzione della funzione finché non passa un certo tempo
 * senza che la funzione venga chiamata nuovamente.
 * 
 * @example
 * // Ricerca dopo che l'utente smette di digitare
 * const debouncedSearch = debounce(search, 300);
 * input.addEventListener('input', debouncedSearch);
 * 
 * @param {Function} fn - Funzione da debouncare
 * @param {number} delay - Ritardo in millisecondi (default: 300)
 * @param {boolean} immediate - Esegui immediatamente alla prima chiamata
 * @returns {Function} Funzione debouncata
 */
export function debounce(fn, delay = 300, immediate = false) {
    let timeoutId = null;
    
    const debounced = function(...args) {
        const context = this;
        
        const later = () => {
            timeoutId = null;
            if (!immediate) {
                fn.apply(context, args);
            }
        };
        
        const callNow = immediate && !timeoutId;
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(later, delay);
        
        if (callNow) {
            fn.apply(context, args);
        }
    };
    
    // Metodo per cancellare il debounce pendente
    debounced.cancel = () => {
        clearTimeout(timeoutId);
        timeoutId = null;
    };
    
    // Metodo per eseguire immediatamente
    debounced.flush = (...args) => {
        debounced.cancel();
        fn.apply(this, args);
    };
    
    return debounced;
}

// ═══════════════════════════════════════════════════════════════
// THROTTLE
// ═══════════════════════════════════════════════════════════════

/**
 * Limita l'esecuzione della funzione a una volta ogni X millisecondi.
 * 
 * @example
 * // Limita aggiornamenti durante lo scroll
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 * 
 * @param {Function} fn - Funzione da throttlare
 * @param {number} limit - Intervallo minimo in millisecondi (default: 100)
 * @param {Object} options - { leading: boolean, trailing: boolean }
 * @returns {Function} Funzione throttled
 */
export function throttle(fn, limit = 100, options = {}) {
    const { leading = true, trailing = true } = options;
    
    let timeoutId = null;
    let lastArgs = null;
    let lastThis = null;
    let lastCallTime = 0;
    
    const throttled = function(...args) {
        const context = this;
        const now = Date.now();
        const timeSinceLastCall = now - lastCallTime;
        
        lastArgs = args;
        lastThis = context;
        
        // Prima chiamata o abbastanza tempo è passato
        if (timeSinceLastCall >= limit) {
            if (leading || lastCallTime > 0) {
                lastCallTime = now;
                fn.apply(context, args);
            }
        } else if (trailing && !timeoutId) {
            // Programma esecuzione trailing
            timeoutId = setTimeout(() => {
                timeoutId = null;
                lastCallTime = Date.now();
                if (lastArgs) {
                    fn.apply(lastThis, lastArgs);
                }
                lastArgs = null;
                lastThis = null;
            }, limit - timeSinceLastCall);
        }
    };
    
    throttled.cancel = () => {
        clearTimeout(timeoutId);
        timeoutId = null;
        lastArgs = null;
        lastThis = null;
    };
    
    return throttled;
}

// ═══════════════════════════════════════════════════════════════
// RAF THROTTLE
// ═══════════════════════════════════════════════════════════════

/**
 * Throttle usando requestAnimationFrame.
 * Ottimo per animazioni e aggiornamenti UI.
 * 
 * @example
 * // Aggiornamenti UI sincronizzati col refresh rate
 * const rafUpdate = rafThrottle(updateUI);
 * window.addEventListener('resize', rafUpdate);
 * 
 * @param {Function} fn - Funzione da throttlare
 * @returns {Function} Funzione throttled con RAF
 */
export function rafThrottle(fn) {
    let rafId = null;
    let lastArgs = null;
    let lastThis = null;
    
    const throttled = function(...args) {
        lastArgs = args;
        lastThis = this;
        
        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                rafId = null;
                fn.apply(lastThis, lastArgs);
                lastArgs = null;
                lastThis = null;
            });
        }
    };
    
    throttled.cancel = () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };
    
    return throttled;
}

// ═══════════════════════════════════════════════════════════════
// MEMOIZE
// ═══════════════════════════════════════════════════════════════

/**
 * Cache i risultati di una funzione pura.
 * 
 * @example
 * const expensiveCalculation = memoize((n) => {
 *     console.log('Calculating...');
 *     return n * n;
 * });
 * expensiveCalculation(5); // "Calculating..." → 25
 * expensiveCalculation(5); // 25 (from cache)
 * 
 * @param {Function} fn - Funzione pura da memoizzare
 * @param {Function} resolver - Funzione per generare chiave cache custom
 * @returns {Function} Funzione memoizzata
 */
export function memoize(fn, resolver) {
    const cache = new Map();
    
    const memoized = function(...args) {
        const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
    
    memoized.cache = cache;
    memoized.clear = () => cache.clear();
    
    return memoized;
}

// ═══════════════════════════════════════════════════════════════
// BATCH UPDATES
// ═══════════════════════════════════════════════════════════════

/**
 * Raggruppa chiamate multiple e le esegue in batch.
 * 
 * @example
 * const batchUpdates = createBatcher((items) => {
 *     console.log('Processing batch:', items);
 * }, 100);
 * 
 * batchUpdates(1);
 * batchUpdates(2);
 * batchUpdates(3);
 * // After 100ms: "Processing batch: [1, 2, 3]"
 * 
 * @param {Function} fn - Funzione che riceve l'array di items
 * @param {number} delay - Delay per raccogliere items
 * @returns {Function} Funzione per aggiungere items al batch
 */
export function createBatcher(fn, delay = 50) {
    let items = [];
    let timeoutId = null;
    
    const flush = () => {
        if (items.length > 0) {
            fn([...items]);
            items = [];
        }
        timeoutId = null;
    };
    
    return function(item) {
        items.push(item);
        
        if (!timeoutId) {
            timeoutId = setTimeout(flush, delay);
        }
    };
}

// ═══════════════════════════════════════════════════════════════
// IDLE CALLBACK
// ═══════════════════════════════════════════════════════════════

/**
 * Esegue una funzione quando il browser è idle.
 * Fallback per browser che non supportano requestIdleCallback.
 * 
 * @param {Function} fn - Funzione da eseguire
 * @param {Object} options - Opzioni per requestIdleCallback
 * @returns {number} ID per cancellare
 */
export function runWhenIdle(fn, options = {}) {
    if (typeof requestIdleCallback !== 'undefined') {
        return requestIdleCallback(fn, options);
    }
    
    // Fallback: esegui dopo un delay
    return setTimeout(fn, 1);
}

/**
 * Cancella un idle callback.
 * @param {number} id - ID del callback
 */
export function cancelIdle(id) {
    if (typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(id);
    } else {
        clearTimeout(id);
    }
}

// ═══════════════════════════════════════════════════════════════
// LAZY LOADER
// ═══════════════════════════════════════════════════════════════

/**
 * Crea un lazy loader per funzioni pesanti.
 * La funzione viene eseguita solo quando chiamata la prima volta.
 * 
 * @example
 * const loadHeavyModule = lazy(() => import('./heavyModule.js'));
 * // Il modulo viene caricato solo alla prima chiamata
 * const module = await loadHeavyModule();
 * 
 * @param {Function} loader - Funzione che carica il modulo
 * @returns {Function} Funzione che restituisce una Promise del modulo
 */
export function lazy(loader) {
    let promise = null;
    
    return function() {
        if (!promise) {
            promise = Promise.resolve(loader());
        }
        return promise;
    };
}

// ═══════════════════════════════════════════════════════════════
// ONCE
// ═══════════════════════════════════════════════════════════════

/**
 * Esegue una funzione una sola volta.
 * 
 * @example
 * const init = once(() => {
 *     console.log('Initialized!');
 * });
 * init(); // "Initialized!"
 * init(); // nothing
 * 
 * @param {Function} fn - Funzione da eseguire una volta
 * @returns {Function} Funzione wrapped
 */
export function once(fn) {
    let called = false;
    let result = null;
    
    return function(...args) {
        if (!called) {
            called = true;
            result = fn.apply(this, args);
        }
        return result;
    };
}

// ═══════════════════════════════════════════════════════════════
// RATE LIMITER
// ═══════════════════════════════════════════════════════════════

/**
 * Crea un rate limiter che limita le chiamate in una finestra temporale.
 * Utile per API calls.
 * 
 * @example
 * const limiter = createRateLimiter(10, 60000); // 10 chiamate al minuto
 * limiter(() => fetch('/api/data'));
 * 
 * @param {number} maxCalls - Numero massimo di chiamate
 * @param {number} windowMs - Finestra temporale in millisecondi
 * @returns {Function} Funzione per eseguire chiamate rate-limited
 */
export function createRateLimiter(maxCalls, windowMs) {
    const calls = [];
    
    return function(fn) {
        const now = Date.now();
        
        // Rimuovi chiamate vecchie
        while (calls.length > 0 && calls[0] <= now - windowMs) {
            calls.shift();
        }
        
        if (calls.length < maxCalls) {
            calls.push(now);
            return Promise.resolve(fn());
        }
        
        // Calcola quando sarà disponibile il prossimo slot
        const oldestCall = calls[0];
        const waitTime = oldestCall + windowMs - now;
        
        return new Promise((resolve) => {
            setTimeout(() => {
                calls.push(Date.now());
                resolve(fn());
            }, waitTime);
        });
    };
}

console.log('⚡ [performance] Utility performance caricate.');
