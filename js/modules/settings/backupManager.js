/**
 * backupManager.js
 * ─────────────────────────────────────────────────────────────
 * Modulo UI per gestione backup/restore campagne.
 * Integrato nella home page o accessibile da menu.
 * 
 * @version 1.0.0
 */

import { advancedStorage } from '../../services/advancedStorage.js';
import { showToast } from '../../utils/toast.js';
import { escapeHtml } from '../../utils/htmlHelpers.js';
import { getCurrentCampaignId, getCampaignsList } from '../../stateManager.js';

const BackupManager = {
    container: null,
    
    render(containerElement) {
        this.container = containerElement;
        this.container.innerHTML = this.getTemplate();
        this.bindEvents();
        this.updateStorageInfo();
    },
    
    getTemplate() {
        const usage = advancedStorage.getStorageUsage();
        const lastBackup = advancedStorage.getLastBackupDate();
        const campaigns = getCampaignsList();
        
        return `
<style>
${this.getStyles()}
</style>
<div class="backup-manager">
    <div class="backup-header">
        <h2>💾 Gestione Backup</h2>
        <p class="backup-subtitle">Esporta e ripristina le tue campagne</p>
    </div>
    
    <div class="backup-storage-info">
        <div class="storage-bar-container">
            <div class="storage-bar" style="width: ${Math.min(usage.percentage, 100)}%; background: ${usage.percentage > 80 ? '#ef4444' : usage.percentage > 60 ? '#f59e0b' : '#22c55e'}"></div>
        </div>
        <div class="storage-text">
            <span>Spazio utilizzato: ${usage.usedMB} MB / ${usage.totalMB} MB (${usage.percentage.toFixed(1)}%)</span>
            ${lastBackup ? `<span class="last-backup">Ultimo backup: ${lastBackup}</span>` : '<span class="no-backup">⚠️ Nessun backup recente</span>'}
        </div>
    </div>
    
    <div class="backup-actions-grid">
        <!-- Export Section -->
        <div class="backup-card">
            <div class="backup-card-header">
                <span class="backup-card-icon">📤</span>
                <h3>Esporta</h3>
            </div>
            <p>Scarica un backup delle tue campagne in formato JSON</p>
            <div class="backup-card-actions">
                <button class="backup-btn" id="export-current-btn">
                    📦 Esporta Campagna Corrente
                </button>
                <button class="backup-btn backup-btn-secondary" id="export-all-btn">
                    🗄️ Esporta Tutte le Campagne
                </button>
            </div>
        </div>
        
        <!-- Import Section -->
        <div class="backup-card">
            <div class="backup-card-header">
                <span class="backup-card-icon">📥</span>
                <h3>Importa</h3>
            </div>
            <p>Ripristina una campagna da un file di backup</p>
            <div class="backup-card-actions">
                <label class="backup-btn backup-btn-primary" for="import-file-input">
                    📂 Seleziona File Backup
                </label>
                <input type="file" id="import-file-input" accept=".json" style="display: none;">
            </div>
            <div class="import-options hidden" id="import-options">
                <label class="checkbox-label">
                    <input type="checkbox" id="import-overwrite">
                    Sovrascrivi se esistente
                </label>
                <button class="backup-btn backup-btn-success" id="import-confirm-btn">
                    ✅ Conferma Importazione
                </button>
            </div>
        </div>
        
        <!-- Cleanup Section -->
        <div class="backup-card">
            <div class="backup-card-header">
                <span class="backup-card-icon">🧹</span>
                <h3>Manutenzione</h3>
            </div>
            <p>Pulisci dati obsoleti e libera spazio</p>
            <div class="backup-card-actions">
                <button class="backup-btn backup-btn-warning" id="cleanup-btn">
                    🧹 Pulisci Dati Orfani
                </button>
                <button class="backup-btn backup-btn-secondary" id="verify-btn">
                    🔍 Verifica Integrità
                </button>
            </div>
        </div>
    </div>
    
    <!-- Campaigns List -->
    <div class="backup-campaigns-section">
        <h3>📋 Campagne (${campaigns.length})</h3>
        <div class="backup-campaigns-list" id="campaigns-list">
            ${this.renderCampaignsList(campaigns)}
        </div>
    </div>
    
    <!-- Import Preview Modal -->
    <div class="backup-modal-overlay" id="import-modal-overlay"></div>
    <div class="backup-modal" id="import-modal">
        <div class="backup-modal-header">
            <h3>📥 Anteprima Importazione</h3>
            <button class="backup-modal-close" id="close-import-modal">✕</button>
        </div>
        <div class="backup-modal-content" id="import-preview-content">
            <!-- Dynamic content -->
        </div>
        <div class="backup-modal-footer">
            <button class="backup-btn" id="cancel-import-btn">Annulla</button>
            <button class="backup-btn backup-btn-success" id="confirm-import-btn">Importa</button>
        </div>
    </div>
</div>
        `;
    },
    
    renderCampaignsList(campaigns) {
        if (campaigns.length === 0) {
            return '<p class="no-campaigns">Nessuna campagna trovata</p>';
        }
        
        const currentId = getCurrentCampaignId();
        
        return campaigns.map(campaign => {
            const integrity = advancedStorage.verifyDataIntegrity(campaign.id);
            const statusClass = integrity.valid ? 'status-ok' : 'status-warning';
            const statusIcon = integrity.valid ? '✅' : '⚠️';
            
            return `
                <div class="campaign-item ${campaign.id === currentId ? 'current' : ''}">
                    <div class="campaign-info">
                        <span class="campaign-name">${escapeHtml(campaign.name)}</span>
                        <span class="campaign-date">Creata: ${new Date(campaign.createdAt).toLocaleDateString('it-IT')}</span>
                    </div>
                    <div class="campaign-stats ${statusClass}">
                        <span title="${integrity.issues.join('\\n')}">${statusIcon} ${integrity.stats.locations} luoghi, ${integrity.stats.npcs} NPC</span>
                    </div>
                    <div class="campaign-actions">
                        <button class="campaign-action-btn" data-campaign-id="${campaign.id}" data-action="export" title="Esporta">📤</button>
                        <button class="campaign-action-btn" data-campaign-id="${campaign.id}" data-action="verify" title="Verifica">🔍</button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    getStyles() {
        return `
.backup-manager {
    padding: 1.5rem;
    max-width: 900px;
    margin: 0 auto;
}

.backup-header {
    text-align: center;
    margin-bottom: 2rem;
}

.backup-header h2 {
    font-family: 'Cinzel', serif;
    font-size: 1.8rem;
    color: var(--text-primary, #fff);
    margin: 0 0 0.5rem;
}

.backup-subtitle {
    color: var(--text-muted, #888);
    font-size: 0.95rem;
}

.backup-storage-info {
    background: var(--card-bg, #252525);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-color, #333);
}

.storage-bar-container {
    height: 8px;
    background: var(--bg-tertiary, #333);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.storage-bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
}

.storage-text {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--text-muted, #888);
}

.last-backup { color: #22c55e; }
.no-backup { color: #f59e0b; }

.backup-actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.backup-card {
    background: var(--card-bg, #252525);
    border-radius: 8px;
    padding: 1.25rem;
    border: 1px solid var(--border-color, #333);
}

.backup-card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.backup-card-icon { font-size: 1.5rem; }

.backup-card-header h3 {
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    color: var(--text-primary, #fff);
    margin: 0;
}

.backup-card p {
    color: var(--text-muted, #888);
    font-size: 0.85rem;
    margin: 0 0 1rem;
}

.backup-card-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.backup-btn {
    padding: 0.6rem 1rem;
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    border: none;
    border-radius: 6px;
    color: #fff;
    font-family: 'Lora', serif;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
}

.backup-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
}

.backup-btn-secondary {
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
}

.backup-btn-primary { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }

.backup-btn-success { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); }

.backup-btn-warning { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }

.import-options {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color, #333);
}

.import-options.hidden { display: none; }

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-muted, #888);
    margin-bottom: 0.5rem;
}

.backup-campaigns-section {
    background: var(--card-bg, #252525);
    border-radius: 8px;
    padding: 1.25rem;
    border: 1px solid var(--border-color, #333);
}

.backup-campaigns-section h3 {
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    color: var(--text-primary, #fff);
    margin: 0 0 1rem;
}

.backup-campaigns-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
}

.campaign-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--bg-tertiary, #333);
    border-radius: 6px;
    border: 1px solid var(--border-color, #444);
    transition: all 0.2s;
}

.campaign-item:hover {
    border-color: #0891b2;
}

.campaign-item.current {
    border-color: #0891b2;
    background: rgba(8, 145, 178, 0.1);
}

.campaign-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.campaign-name {
    font-family: 'Cinzel', serif;
    color: var(--text-primary, #fff);
}

.campaign-date {
    font-size: 0.75rem;
    color: var(--text-muted, #888);
}

.campaign-stats {
    font-size: 0.8rem;
    color: var(--text-muted, #888);
}

.campaign-stats.status-ok { color: #22c55e; }
.campaign-stats.status-warning { color: #f59e0b; }

.campaign-actions {
    display: flex;
    gap: 0.25rem;
}

.campaign-action-btn {
    padding: 0.4rem;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.campaign-action-btn:hover { opacity: 1; }

.no-campaigns {
    text-align: center;
    color: var(--text-muted, #666);
    padding: 2rem;
}

/* Modal */
.backup-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    display: none;
}

.backup-modal-overlay.active { display: block; }

.backup-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 500px;
    background: var(--card-bg, #252525);
    border-radius: 12px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none;
}

.backup-modal.active { display: block; }

.backup-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color, #333);
}

.backup-modal-header h3 {
    font-family: 'Cinzel', serif;
    color: var(--text-primary, #fff);
    margin: 0;
}

.backup-modal-close {
    background: none;
    border: none;
    color: var(--text-muted, #888);
    font-size: 1.5rem;
    cursor: pointer;
}

.backup-modal-content {
    padding: 1.5rem;
    max-height: 60vh;
    overflow-y: auto;
}

.backup-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-color, #333);
}
        `;
    },
    
    bindEvents() {
        // Export buttons
        this.container.querySelector('#export-current-btn')?.addEventListener('click', () => {
            const campaignId = getCurrentCampaignId();
            if (!campaignId) {
                showToast('Seleziona prima una campagna', 'warning');
                return;
            }
            const data = advancedStorage.exportCampaign(campaignId);
            if (data) {
                advancedStorage.downloadAsJson(data, `campaign_${campaignId}_${Date.now()}.json`);
            }
        });
        
        this.container.querySelector('#export-all-btn')?.addEventListener('click', () => {
            const data = advancedStorage.exportAllCampaigns();
            advancedStorage.downloadAsJson(data, `dmtool_backup_${Date.now()}.json`);
        });
        
        // Import
        let pendingImportData = null;
        
        this.container.querySelector('#import-file-input')?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                pendingImportData = await advancedStorage.readJsonFile(file);
                this.showImportPreview(pendingImportData);
                this.container.querySelector('#import-options')?.classList.remove('hidden');
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
        
        this.container.querySelector('#confirm-import-btn')?.addEventListener('click', () => {
            if (!pendingImportData) return;
            
            const overwrite = this.container.querySelector('#import-overwrite')?.checked || false;
            const result = advancedStorage.importCampaign(pendingImportData, { overwrite });
            
            if (result.success) {
                showToast(result.message, 'success');
                this.closeImportModal();
                this.updateStorageInfo();
                // Refresh campaigns list
                this.container.querySelector('#campaigns-list').innerHTML = 
                    this.renderCampaignsList(getCampaignsList());
            } else {
                showToast(result.message, 'error');
            }
        });
        
        // Cleanup
        this.container.querySelector('#cleanup-btn')?.addEventListener('click', () => {
            const freed = advancedStorage.cleanupOldData();
            this.updateStorageInfo();
        });
        
        // Verify
        this.container.querySelector('#verify-btn')?.addEventListener('click', () => {
            const campaignId = getCurrentCampaignId();
            if (!campaignId) {
                showToast('Seleziona prima una campagna', 'warning');
                return;
            }
            const result = advancedStorage.verifyDataIntegrity(campaignId);
            if (result.valid) {
                showToast(`Integrità verificata: ${result.stats.locations} luoghi, ${result.stats.npcs} NPC`, 'success');
            } else {
                showToast(`Trovati ${result.issues.length} problemi`, 'warning');
                console.warn('Problemi integrità:', result.issues);
            }
        });
        
        // Campaign actions
        this.container.querySelector('#campaigns-list')?.addEventListener('click', (e) => {
            const btn = e.target.closest('.campaign-action-btn');
            if (!btn) return;
            
            const campaignId = btn.dataset.campaignId;
            const action = btn.dataset.action;
            
            if (action === 'export') {
                const data = advancedStorage.exportCampaign(campaignId);
                if (data) {
                    advancedStorage.downloadAsJson(data, `campaign_${campaignId}.json`);
                }
            } else if (action === 'verify') {
                const result = advancedStorage.verifyDataIntegrity(campaignId);
                if (result.valid) {
                    showToast('Campagna integra ✅', 'success');
                } else {
                    showToast(`${result.issues.length} problemi trovati`, 'warning');
                    console.warn('Problemi:', result.issues);
                }
            }
        });
        
        // Modal close
        this.container.querySelector('#close-import-modal')?.addEventListener('click', () => {
            this.closeImportModal();
        });
        
        this.container.querySelector('#cancel-import-btn')?.addEventListener('click', () => {
            this.closeImportModal();
        });
        
        this.container.querySelector('#import-modal-overlay')?.addEventListener('click', () => {
            this.closeImportModal();
        });
    },
    
    showImportPreview(data) {
        const modal = this.container.querySelector('#import-modal');
        const overlay = this.container.querySelector('#import-modal-overlay');
        const content = this.container.querySelector('#import-preview-content');
        
        const campaignsCount = data.type === 'fullBackup' ? data.campaigns.length : 1;
        const campaignName = data.campaignName || data.campaigns?.[0]?.campaignName || 'Sconosciuto';
        
        content.innerHTML = `
            <div class="import-preview">
                <p><strong>Tipo:</strong> ${data.type === 'fullBackup' ? 'Backup completo' : 'Singola campagna'}</p>
                <p><strong>Nome:</strong> ${escapeHtml(campaignName)}</p>
                <p><strong>Versione:</strong> ${data.version || 'N/A'}</p>
                <p><strong>Data export:</strong> ${new Date(data.exportDate).toLocaleString('it-IT')}</p>
                <p><strong>Campagne:</strong> ${campaignsCount}</p>
            </div>
        `;
        
        modal?.classList.add('active');
        overlay?.classList.add('active');
    },
    
    closeImportModal() {
        this.container.querySelector('#import-modal')?.classList.remove('active');
        this.container.querySelector('#import-modal-overlay')?.classList.remove('active');
    },
    
    updateStorageInfo() {
        const usage = advancedStorage.getStorageUsage();
        const storageBar = this.container.querySelector('.storage-bar');
        const storageText = this.container.querySelector('.storage-text');
        
        if (storageBar) {
            storageBar.style.width = `${Math.min(usage.percentage, 100)}%`;
            storageBar.style.background = usage.percentage > 80 ? '#ef4444' : 
                                          usage.percentage > 60 ? '#f59e0b' : '#22c55e';
        }
        
        if (storageText) {
            const lastBackup = advancedStorage.getLastBackupDate();
            storageText.innerHTML = `
                <span>Spazio utilizzato: ${usage.usedMB} MB / ${usage.totalMB} MB (${usage.percentage.toFixed(1)}%)</span>
                ${lastBackup ? `<span class="last-backup">Ultimo backup: ${lastBackup}</span>` : '<span class="no-backup">⚠️ Nessun backup recente</span>'}
            `;
        }
    },
    
    destroy() {
        this.container = null;
    }
};

export default BackupManager;
