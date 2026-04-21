/**
 * searchIndex.js
 * ─────────────────────────────────────────────────────────────
 * Motore di ricerca full-text ottimizzato con:
 * - Inverted index per ricerche O(1)
 * - Fuzzy matching per tolleranza errori di digitazione
 * - Ricerca per prefisso (autocomplete)
 * - Highlight dei risultati
 * - Supporto entità multiple (NPC, Luoghi, PG, etc.)
 * 
 * @version 1.0.0
 */

/**
 * @typedef {Object} SearchDocument
 * @property {string} id - ID univoco del documento
 * @property {string} type - Tipo entità (npc, location, pg, etc.)
 * @property {string} name - Nome principale
 * @property {string} content - Contenuto indicizzato
 * @property {Object} metadata - Metadati aggiuntivi
 */

/**
 * @typedef {Object} SearchResult
 * @property {string} id
 * @property {string} type
 * @property {string} name
 * @property {number} score - Rilevanza (0-1)
 * @property {string[]} matches - Termini trovati
 * @property {string} highlightedName - Nome con highlight
 */

/**
 * Classe per l'indicizzazione e ricerca full-text
 */
class SearchIndex {
    constructor() {
        /** @type {Map<string, SearchDocument>} */
        this.documents = new Map();
        
        /** @type {Map<string, Set<string>>} - Inverted index: term -> docIds */
        this.index = new Map();
        
        /** @type {Map<string, Map<string, number>>} - TF-IDF scores */
        this.termFrequency = new Map();
        
        /** @type {Map<string, number>} - Document frequency */
        this.docFrequency = new Map();
        
        /** @type {Map<string, string[]>} - N-gram index per fuzzy search */
        this.ngramIndex = new Map();
        
        this.ngramSize = 3;
        this.maxResults = 50;
        this.minScore = 0.1;
        
        // Stop words italiane
        this.stopWords = new Set([
            'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una',
            'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra',
            'e', 'o', 'ma', 'che', 'di', 'non', 'si', 'è', 'sono',
            'ha', 'hanno', 'come', 'più', 'della', 'del', 'dello',
            'della', 'degli', 'delle', 'nella', 'nel', 'nello'
        ]);
    }

    // ═══════════════════════════════════════════════════════════════
    // INDICIZZAZIONE
    // ═══════════════════════════════════════════════════════════════

    /**
     * Indicizza un documento
     * @param {SearchDocument} doc
     */
    indexDocument(doc) {
        if (!doc || !doc.id || !doc.name) {
            console.warn('⚠️ [SearchIndex] Documento non valido:', doc);
            return;
        }
        
        // Rimuovi vecchio indice se esiste
        this.removeDocument(doc.id);
        
        // Salva documento
        this.documents.set(doc.id, doc);
        
        // Tokenizza e indicizza
        const tokens = this.tokenize(doc.name + ' ' + (doc.content || ''));
        const uniqueTokens = [...new Set(tokens)];
        
        // Aggiorna inverted index
        uniqueTokens.forEach(token => {
            if (!this.index.has(token)) {
                this.index.set(token, new Set());
            }
            this.index.get(token).add(doc.id);
            
            // Aggiorna document frequency
            this.docFrequency.set(token, (this.docFrequency.get(token) || 0) + 1);
        });
        
        // Calcola e salva term frequency per questo documento
        const tf = new Map();
        tokens.forEach(token => {
            tf.set(token, (tf.get(token) || 0) + 1);
        });
        this.termFrequency.set(doc.id, tf);
        
        // Indicizza n-grams per fuzzy search
        this.indexNgrams(doc.id, doc.name);
        
        // Indicizza anche il tipo come token
        if (doc.type) {
            const typeToken = `type:${doc.type}`;
            if (!this.index.has(typeToken)) {
                this.index.set(typeToken, new Set());
            }
            this.index.get(typeToken).add(doc.id);
        }
    }

    /**
     * Indicizza multipli documenti
     * @param {SearchDocument[]} docs
     */
    indexDocuments(docs) {
        docs.forEach(doc => this.indexDocument(doc));
        console.log(`🔍 [SearchIndex] Indicizzati ${docs.length} documenti`);
    }

    /**
     * Rimuove un documento dall'indice
     * @param {string} docId
     */
    removeDocument(docId) {
        const doc = this.documents.get(docId);
        if (!doc) return;
        
        // Rimuovi dall'inverted index
        this.index.forEach((docIds, token) => {
            docIds.delete(docId);
            if (docIds.size === 0) {
                this.index.delete(token);
            }
        });
        
        // Rimuovi term frequency
        this.termFrequency.delete(docId);
        
        // Rimuovi n-grams
        this.ngramIndex.forEach((docIds) => {
            docIds.delete(docId);
        });
        
        // Rimuovi documento
        this.documents.delete(docId);
    }

    /**
     * Aggiorna un documento esistente
     * @param {SearchDocument} doc
     */
    updateDocument(doc) {
        this.indexDocument(doc);
    }

    /**
     * Ricostruisce l'indice da zero
     */
    rebuildIndex() {
        const docs = [...this.documents.values()];
        this.clear();
        this.indexDocuments(docs);
    }

    // ═══════════════════════════════════════════════════════════════
    // RICERCA
    // ═══════════════════════════════════════════════════════════════

    /**
     * Esegue una ricerca full-text
     * @param {string} query - Query di ricerca
     * @param {object} options - Opzioni di ricerca
     * @returns {SearchResult[]}
     */
    search(query, options = {}) {
        if (!query || query.trim().length === 0) {
            return [];
        }
        
        const {
            types = null,           // Filtra per tipo
            fuzzy = true,           // Abilita fuzzy matching
            maxResults = this.maxResults,
            minScore = this.minScore,
            highlightTag = 'mark'
        } = options;
        
        const queryTokens = this.tokenize(query);
        const candidateScores = new Map();
        
        // Trova documenti candidati
        queryTokens.forEach(token => {
            // Match esatto
            const exactMatches = this.index.get(token);
            if (exactMatches) {
                exactMatches.forEach(docId => {
                    const score = candidateScores.get(docId) || 0;
                    candidateScores.set(docId, score + 1);
                });
            }
            
            // Fuzzy match
            if (fuzzy) {
                this.index.forEach((docIds, indexToken) => {
                    if (this.fuzzyMatch(token, indexToken)) {
                        docIds.forEach(docId => {
                            const score = candidateScores.get(docId) || 0;
                            candidateScores.set(docId, score + 0.5);
                        });
                    }
                });
            }
        });
        
        // Filtra per tipo se specificato
        let results = [...candidateScores.entries()];
        
        if (types && types.length > 0) {
            const typeSet = new Set(types);
            results = results.filter(([docId]) => {
                const doc = this.documents.get(docId);
                return doc && typeSet.has(doc.type);
            });
        }
        
        // Calcola score finale e ordina
        results = results
            .map(([docId, score]) => {
                const doc = this.documents.get(docId);
                if (!doc) return null;
                
                // Normalizza score
                const normalizedScore = Math.min(score / queryTokens.length, 1);
                
                // Calcola TF-IDF per ranking più accurato
                const tfidfScore = this.calculateTfIdf(docId, queryTokens);
                const finalScore = (normalizedScore * 0.6) + (tfidfScore * 0.4);
                
                return {
                    id: doc.id,
                    type: doc.type,
                    name: doc.name,
                    score: finalScore,
                    matches: queryTokens.filter(t => {
                        const docTokens = this.tokenize(doc.name + ' ' + (doc.content || ''));
                        return docTokens.some(dt => dt.includes(t) || t.includes(dt));
                    }),
                    highlightedName: this.highlightMatches(doc.name, queryTokens, highlightTag),
                    metadata: doc.metadata
                };
            })
            .filter(r => r !== null && r.score >= minScore)
            .sort((a, b) => b.score - a.score)
            .slice(0, maxResults);
        
        return results;
    }

    /**
     * Ricerca con autocomplete (prefisso)
     * @param {string} prefix - Prefisso da cercare
     * @param {number} limit - Numero massimo risultati
     * @returns {SearchResult[]}
     */
    autocomplete(prefix, limit = 10) {
        if (!prefix || prefix.length < 2) {
            return [];
        }
        
        const normalizedPrefix = this.normalize(prefix);
        const results = [];
        
        this.documents.forEach((doc, docId) => {
            const normalizedName = this.normalize(doc.name);
            if (normalizedName.startsWith(normalizedPrefix)) {
                results.push({
                    id: doc.id,
                    type: doc.type,
                    name: doc.name,
                    score: 1,
                    matches: [prefix],
                    highlightedName: `<mark>${doc.name.substring(0, prefix.length)}</mark>${doc.name.substring(prefix.length)}`
                });
            }
        });
        
        return results
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, limit);
    }

    /**
     * Ottiene suggerimenti di ricerca
     * @param {string} partial - Query parziale
     * @returns {string[]} Suggerimenti
     */
    getSuggestions(partial) {
        const suggestions = new Set();
        const normalized = this.normalize(partial);
        
        this.index.forEach((_, token) => {
            if (token.startsWith(normalized) && !this.stopWords.has(token)) {
                suggestions.add(token);
            }
        });
        
        return [...suggestions].slice(0, 10);
    }

    // ═══════════════════════════════════════════════════════════════
    // STATISTICHE E UTILITÀ
    // ═══════════════════════════════════════════════════════════════

    /**
     * Ottiene statistiche sull'indice
     */
    getStats() {
        const typesCount = {};
        this.documents.forEach(doc => {
            typesCount[doc.type] = (typesCount[doc.type] || 0) + 1;
        });
        
        return {
            totalDocuments: this.documents.size,
            totalTerms: this.index.size,
            byType: typesCount,
            avgTermsPerDoc: this.index.size / Math.max(this.documents.size, 1)
        };
    }

    /**
     * Pulisce l'indice
     */
    clear() {
        this.documents.clear();
        this.index.clear();
        this.termFrequency.clear();
        this.docFrequency.clear();
        this.ngramIndex.clear();
    }

    /**
     * Esporta l'indice per persistenza
     */
    exportIndex() {
        return {
            documents: [...this.documents.entries()],
            index: [...this.index.entries()].map(([k, v]) => [k, [...v]]),
            docFrequency: [...this.docFrequency.entries()]
        };
    }

    /**
     * Importa un indice precedentemente esportato
     */
    importIndex(data) {
        this.clear();
        
        data.documents.forEach(([id, doc]) => {
            this.documents.set(id, doc);
        });
        
        data.index.forEach(([token, docIds]) => {
            this.index.set(token, new Set(docIds));
        });
        
        data.docFrequency.forEach(([token, freq]) => {
            this.docFrequency.set(token, freq);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // METODI PRIVATI
    // ═══════════════════════════════════════════════════════════════

    tokenize(text) {
        return this.normalize(text)
            .split(/\s+/)
            .filter(token => token.length > 1 && !this.stopWords.has(token));
    }

    normalize(text) {
        if (!text) return '';
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Rimuovi accenti
            .replace(/[^a-z0-9\s]/g, ' ')    // Solo alfanumerici
            .replace(/\s+/g, ' ')
            .trim();
    }

    indexNgrams(docId, text) {
        const normalized = this.normalize(text);
        
        for (let i = 0; i <= normalized.length - this.ngramSize; i++) {
            const ngram = normalized.substring(i, i + this.ngramSize);
            if (!this.ngramIndex.has(ngram)) {
                this.ngramIndex.set(ngram, new Set());
            }
            this.ngramIndex.get(ngram).add(docId);
        }
    }

    fuzzyMatch(token1, token2, threshold = 0.7) {
        if (token1 === token2) return true;
        
        const len1 = token1.length;
        const len2 = token2.length;
        
        // Distanza di Levenshtein semplificata
        if (Math.abs(len1 - len2) > 2) return false;
        
        const minLen = Math.min(len1, len2);
        const maxLen = Math.max(len1, len2);
        
        let matches = 0;
        for (let i = 0; i < minLen; i++) {
            if (token1[i] === token2[i]) matches++;
        }
        
        return matches / maxLen >= threshold;
    }

    calculateTfIdf(docId, queryTokens) {
        const tf = this.termFrequency.get(docId);
        if (!tf) return 0;
        
        let score = 0;
        const totalDocs = this.documents.size;
        
        queryTokens.forEach(token => {
            const termFreq = tf.get(token) || 0;
            const docFreq = this.docFrequency.get(token) || 1;
            
            // TF-IDF formula
            const tfidf = (termFreq / (tf.size || 1)) * Math.log(totalDocs / docFreq);
            score += tfidf;
        });
        
        return Math.min(score / queryTokens.length, 1);
    }

    highlightMatches(text, tokens, tag = 'mark') {
        let result = text;
        
        tokens.forEach(token => {
            const regex = new RegExp(`(${this.escapeRegex(token)})`, 'gi');
            result = result.replace(regex, `<${tag}>$1</${tag}>`);
        });
        
        return result;
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Esporta singleton
export const searchIndex = new SearchIndex();
export default searchIndex;

console.log('🔍 [SearchIndex] Motore di ricerca caricato.');
