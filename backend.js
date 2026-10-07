// ===== BACKEND INTEGRATION =====
const BACKEND = {
    apiUrl: APP_CONFIG.apiUrl,
    isOnline: navigator.onLine,
    syncQueue: [],
    
    init() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncPendingData();
        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
        
        // Load sync queue from localStorage
        const queue = localStorage.getItem('syncQueue');
        if (queue) {
            this.syncQueue = JSON.parse(queue);
        }
    },
    
    async syncPendingData() {
        if (this.syncQueue.length === 0) return;
        
        console.log('Syncing pending data...');
        const failedItems = [];
        
        for (const item of this.syncQueue) {
            try {
                const response = await this.sendToServer(item);
                if (response.success) {
                    // Remove from queue
                    this.syncQueue = this.syncQueue.filter(i => i.id !== item.id);
                } else {
                    failedItems.push(item);
                }
            } catch (error) {
                failedItems.push(item);
            }
        }
        
        this.syncQueue = failedItems;
        localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
        
        if (this.syncQueue.length === 0) {
            console.log('All data synced successfully!');
        } else {
            console.log(`${this.syncQueue.length} items still pending sync.`);
        }
    },
    
    async sendToServer(data) {
        // Simulate API call - replace with actual API endpoint
        try {
            const response = await fetch(`${this.apiUrl}/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Sync error:', error);
            return { success: false, error: error.message };
        }
    },
    
    queueForSync(data) {
        const item = {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            data: data,
            timestamp: new Date().toISOString()
        };
        this.syncQueue.push(item);
        localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
        
        if (this.isOnline) {
            this.syncPendingData();
        }
    },
    
    getToken() {
        const school = localStorage.getItem('jokpe_current_school');
        if (school) {
            const schoolData = JSON.parse(school);
            return schoolData.schoolCode || '';
        }
        return '';
    }
};

// Initialize backend on load
document.addEventListener('DOMContentLoaded', function() {
    BACKEND.init();
});

