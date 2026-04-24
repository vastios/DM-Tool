/**
 * performanceMonitor.js
 * ─────────────────────────────────────────────────────────────
 * Sistema di monitoraggio performance per debug e ottimizzazione.
 * 
 * Features:
 * - Metriche render time
 * - Memory usage tracking
 * - Network timing
 * - Custom metrics
 * - Performance budget alerts
 * - Debug dashboard
 * 
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURAZIONE
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
    enabled: true,
    debugMode: false,
    sampleRate: 1, // 1 = 100% delle operazioni
    maxSamples: 100,
    alertThresholds: {
        renderTime: 100,    // ms
        memoryUsage: 50,    // MB
        storageUsage: 0.8   // 80%
    }
};

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE MONITOR CLASS
// ═══════════════════════════════════════════════════════════════

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.marks = new Map();
        this.samples = [];
        this.observers = [];
        
        if (CONFIG.enabled) {
            this.init();
        }
    }
    
    /**
     * Inizializza il monitor
     */
    init() {
        // Registra metriche iniziali
        this.recordInitialMetrics();
        
        // Setup Performance Observer
        this.setupObserver();
        
        // Track memory (se disponibile)
        this.trackMemory();
        
        console.log('📊 [PerformanceMonitor] Monitor attivo');
    }
    
    /**
     * Registra metriche iniziali
     */
    recordInitialMetrics() {
        if (!performance.timing) return;
        
        const timing = performance.timing;
        
        this.setMetric('pageLoad', {
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            tcp: timing.connectEnd - timing.connectStart,
            request: timing.responseStart - timing.requestStart,
            response: timing.responseEnd - timing.responseStart,
            domProcessing: timing.domComplete - timing.domInteractive,
            total: timing.loadEventEnd - timing.navigationStart
        });
        
        // Navigation Timing API Level 2
        if (performance.getEntriesByType) {
            const [nav] = performance.getEntriesByType('navigation');
            if (nav) {
                this.setMetric('navigation', {
                    domContentLoaded: nav.domContentLoadedEventEnd,
                    loadComplete: nav.loadEventEnd,
                    domInteractive: nav.domInteractive
                });
            }
        }
    }
    
    /**
     * Setup Performance Observer
     */
    setupObserver() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            // Long Tasks
            const longTaskObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.recordSample('longTask', entry.duration, {
                        name: entry.name,
                        startTime: entry.startTime
                    });
                    
                    if (entry.duration > CONFIG.alertThresholds.renderTime) {
                        console.warn(`⚠️ [PerformanceMonitor] Long task: ${entry.duration.toFixed(0)}ms`);
                    }
                });
            });
            
            longTaskObserver.observe({ entryTypes: ['longtask'] });
            this.observers.push(longTaskObserver);
            
            // Layout Shifts
            const layoutShiftObserver = new PerformanceObserver((list) => {
                let cumulativeShift = 0;
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        cumulativeShift += entry.value;
                    }
                });
                
                if (cumulativeShift > 0) {
                    this.setMetric('cumulativeLayoutShift', cumulativeShift);
                }
            });
            
            layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(layoutShiftObserver);
            
            // Paint timing
            const paintObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.setMetric(entry.name, entry.startTime);
                });
            });
            
            paintObserver.observe({ entryTypes: ['paint'] });
            this.observers.push(paintObserver);
            
        } catch (e) {
            // Observer non supportato per alcuni tipi
        }
    }
    
    /**
     * Track memoria
     */
    trackMemory() {
        if (!performance.memory) return;
        
        setInterval(() => {
            const memory = performance.memory;
            this.setMetric('memory', {
                usedJSHeapSize: memory.usedJSHeapSize / 1048576, // MB
                totalJSHeapSize: memory.totalJSHeapSize / 1048576,
                jsHeapSizeLimit: memory.jsHeapSizeLimit / 1048576
            });
            
            // Alert se memoria alta
            if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > CONFIG.alertThresholds.storageUsage) {
                console.warn(`⚠️ [PerformanceMonitor] Memoria alta: ${(memory.usedJSHeapSize / 1048576).toFixed(1)}MB`);
            }
        }, 30000); // Ogni 30 secondi
    }
    
    // ═══════════════════════════════════════════════════════════════
    // MARKS & MEASURES
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Crea un mark di performance
     * @param {string} name - Nome del mark
     */
    mark(name) {
        const markName = `dm-tool-${name}`;
        performance.mark(markName);
        this.marks.set(name, performance.now());
        
        if (CONFIG.debugMode) {
            console.log(`📍 [PerformanceMonitor] Mark: ${name}`);
        }
    }
    
    /**
     * Misura tra due marks
     * @param {string} name - Nome della misura
     * @param {string} startMark - Mark iniziale
     * @param {string} endMark - Mark finale (opzionale, usa now se omesso)
     */
    measure(name, startMark, endMark = null) {
        const startMarkName = `dm-tool-${startMark}`;
        const endMarkName = endMark ? `dm-tool-${endMark}` : null;
        const measureName = `dm-tool-${name}`;
        
        try {
            if (endMarkName) {
                performance.measure(measureName, startMarkName, endMarkName);
            } else {
                performance.measure(measureName, startMarkName);
            }
            
            const entries = performance.getEntriesByName(measureName);
            const duration = entries[entries.length - 1]?.duration || 0;
            
            this.recordSample(name, duration);
            
            performance.clearMeasures(measureName);
            performance.clearMarks(startMarkName);
            if (endMarkName) performance.clearMarks(endMarkName);
            
            if (CONFIG.debugMode) {
                console.log(`⏱️ [PerformanceMonitor] ${name}: ${duration.toFixed(2)}ms`);
            }
            
            return duration;
        } catch (e) {
            return 0;
        }
    }
    
    /**
     * Timestamp helper
     * @param {string} label - Label
     */
    time(label) {
        this.marks.set(label, performance.now());
    }
    
    /**
     * Fine timestamp
     * @param {string} label - Label
     * @returns {number} Durata in ms
     */
    timeEnd(label) {
        const start = this.marks.get(label);
        if (!start) return 0;
        
        const duration = performance.now() - start;
        this.marks.delete(label);
        this.recordSample(label, duration);
        
        if (CONFIG.debugMode) {
            console.log(`⏱️ [PerformanceMonitor] ${label}: ${duration.toFixed(2)}ms`);
        }
        
        return duration;
    }
    
    // ═══════════════════════════════════════════════════════════════
    // METRICS
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Imposta una metrica
     * @param {string} name - Nome
     * @param {any} value - Valore
     */
    setMetric(name, value) {
        this.metrics.set(name, {
            value,
            timestamp: Date.now()
        });
    }
    
    /**
     * Ottiene una metrica
     * @param {string} name - Nome
     */
    getMetric(name) {
        return this.metrics.get(name)?.value;
    }
    
    /**
     * Registra un sample
     * @param {string} name - Nome
     * @param {number} value - Valore
     * @param {Object} metadata - Metadata aggiuntivi
     */
    recordSample(name, value, metadata = {}) {
        this.samples.push({
            name,
            value,
            metadata,
            timestamp: Date.now()
        });
        
        // Limita dimensione
        if (this.samples.length > CONFIG.maxSamples) {
            this.samples.shift();
        }
    }
    
    /**
     * Ottiene statistiche per un tipo di sample
     * @param {string} name - Nome
     */
    getStats(name) {
        const samples = this.samples.filter(s => s.name === name);
        
        if (samples.length === 0) {
            return null;
        }
        
        const values = samples.map(s => s.value);
        
        return {
            count: samples.length,
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            last: values[values.length - 1]
        };
    }
    
    /**
     * Ottiene tutte le metriche
     */
    getAllMetrics() {
        const result = {};
        this.metrics.forEach((data, key) => {
            result[key] = data.value;
        });
        return result;
    }
    
    /**
     * Ottiene report completo
     */
    getReport() {
        return {
            metrics: this.getAllMetrics(),
            samples: this.samples.slice(-20), // Ultimi 20
            storage: this.getStorageInfo(),
            timestamp: Date.now()
        };
    }
    
    /**
     * Info storage
     */
    getStorageInfo() {
        let totalSize = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            totalSize += (key.length + value.length) * 2; // UTF-16
        }
        
        return {
            usedBytes: totalSize,
            usedKB: (totalSize / 1024).toFixed(2),
            keys: localStorage.length
        };
    }
    
    // ═══════════════════════════════════════════════════════════════
    // WRAPPER FUNZIONI
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Wrappa una funzione per misurarne le performance
     * @param {Function} fn - Funzione da wrappare
     * @param {string} label - Label per la misura
     */
    wrap(fn, label) {
        const self = this;
        
        return function(...args) {
            self.time(label);
            const result = fn.apply(this, args);
            
            // Se è una Promise
            if (result && typeof result.then === 'function') {
                return result.finally(() => {
                    self.timeEnd(label);
                });
            }
            
            self.timeEnd(label);
            return result;
        };
    }
    
    /**
     * Misura tempo di render di un componente
     * @param {string} componentName - Nome componente
     * @param {Function} renderFn - Funzione di render
     */
    measureRender(componentName, renderFn) {
        this.time(`render:${componentName}`);
        renderFn();
        return this.timeEnd(`render:${componentName}`);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // DEBUG UI
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Mostra dashboard debug
     */
    showDebugPanel() {
        const existing = document.getElementById('perf-debug-panel');
        if (existing) {
            existing.remove();
            return;
        }
        
        const panel = document.createElement('div');
        panel.id = 'perf-debug-panel';
        
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            max-height: 400px;
            background: var(--card-bg, #1a1a1a);
            border: 1px solid var(--border-color, #333);
            border-radius: 8px;
            padding: 1rem;
            font-family: monospace;
            font-size: 12px;
            color: var(--text-primary, #fff);
            z-index: 99999;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        
        const updatePanel = () => {
            const metrics = this.getAllMetrics();
            const storage = this.getStorageInfo();
            
            let html = `<h4 style="margin:0 0 0.5rem 0; color: var(--accent-color);">📊 Performance Monitor</h4>`;
            
            // Memory
            if (metrics.memory) {
                html += `
                    <div style="margin-bottom: 0.5rem;">
                        <strong>Memory:</strong> ${metrics.memory.usedJSHeapSize.toFixed(1)}MB / ${metrics.memory.jsHeapSizeLimit.toFixed(0)}MB
                    </div>
                `;
            }
            
            // Storage
            html += `
                <div style="margin-bottom: 0.5rem;">
                    <strong>LocalStorage:</strong> ${storage.usedKB}KB (${storage.keys} keys)
                </div>
            `;
            
            // Page Load
            if (metrics.pageLoad) {
                html += `
                    <div style="margin-bottom: 0.5rem;">
                        <strong>Page Load:</strong> ${metrics.pageLoad.total}ms
                    </div>
                `;
            }
            
            // Render stats
            const renderSamples = this.samples.filter(s => s.name.startsWith('render:'));
            if (renderSamples.length > 0) {
                html += `<details style="margin-top: 0.5rem;">
                    <summary style="cursor:pointer;">Render Times (${renderSamples.length})</summary>
                    <ul style="margin:0.5rem 0; padding-left:1rem; font-size:11px;">
                `;
                
                const grouped = {};
                renderSamples.forEach(s => {
                    if (!grouped[s.name]) grouped[s.name] = [];
                    grouped[s.name].push(s.value);
                });
                
                Object.entries(grouped).forEach(([name, values]) => {
                    const avg = values.reduce((a,b) => a+b, 0) / values.length;
                    html += `<li>${name.replace('render:', '')}: avg ${avg.toFixed(1)}ms (${values.length}x)</li>`;
                });
                
                html += `</ul></details>`;
            }
            
            html += `
                <div style="margin-top: 0.5rem; font-size: 10px; color: var(--text-muted);">
                    Ultimo aggiornamento: ${new Date().toLocaleTimeString()}
                </div>
            `;
            
            panel.innerHTML = html;
        };
        
        updatePanel();
        document.body.appendChild(panel);
        
        // Auto-update
        const interval = setInterval(updatePanel, 2000);
        
        // Chiudi con click fuori o Escape
        const close = () => {
            clearInterval(interval);
            panel.remove();
        };
        
        panel.addEventListener('click', (e) => {
            if (e.target === panel) close();
        });
        
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }
    
    /**
     * Distrugge il monitor
     */
    destroy() {
        this.observers.forEach(o => o.disconnect());
        this.observers = [];
        this.metrics.clear();
        this.samples = [];
    }
}

// ═══════════════════════════════════════════════════════════════
// SINGLETON E API PUBBLICA
// ═══════════════════════════════════════════════════════════════

const perfMonitor = new PerformanceMonitor();

export { perfMonitor };

/**
 * Avvia misura
 */
export function perfMark(name) {
    perfMonitor.mark(name);
}

/**
 * Termina misura
 */
export function perfMeasure(name, startMark, endMark = null) {
    return perfMonitor.measure(name, startMark, endMark);
}

/**
 * Timestamp
 */
export function perfTime(label) {
    perfMonitor.time(label);
}

export function perfTimeEnd(label) {
    return perfMonitor.timeEnd(label);
}

/**
 * Wrappa funzione
 */
export function perfWrap(fn, label) {
    return perfMonitor.wrap(fn, label);
}

/**
 * Ottieni report
 */
export function getPerfReport() {
    return perfMonitor.getReport();
}

/**
 * Mostra panel debug
 */
export function showPerfDebug() {
    perfMonitor.showDebugPanel();
}

export default perfMonitor;

console.log('📊 [PerformanceMonitor] Sistema monitoraggio caricato.');
