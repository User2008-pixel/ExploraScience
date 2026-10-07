import { StudentProgress, CompletedInvestigation } from '../types/science';

const DB_NAME = 'ScienceLabDB';
const DB_VERSION = 1;
const PROGRESS_STORE = 'progress';
const INVESTIGATIONS_STORE = 'investigations';

/**
 * ScienceLabStorage provides a persistent IndexedDB-based storage layer
 * for student progress and experimental data. This serves as a secondary 
 * durable cache that survives service worker purges and browser cache clearing.
 */
export class ScienceLabStorage {
  private db: IDBDatabase | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    if (typeof indexedDB === 'undefined') {
      return Promise.reject(new Error('IndexedDB is not supported in this environment'));
    }

    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
          console.error('[Storage] IndexedDB open error:', request.error);
          reject(request.error);
        };
        
        request.onsuccess = () => {
          this.db = request.result;
          resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Store for a single progress object
          if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
            db.createObjectStore(PROGRESS_STORE);
          }
          
          // Store for individual investigation records
          if (!db.objectStoreNames.contains(INVESTIGATIONS_STORE)) {
            db.createObjectStore(INVESTIGATIONS_STORE, { keyPath: 'id' });
          }
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Persists the entire progress object
   */
  async saveProgress(progress: StudentProgress): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
        const store = transaction.objectStore(PROGRESS_STORE);
        const request = store.put(progress, 'current_user_progress');
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('[Storage] Failed to save progress to IndexedDB:', e);
    }
  }

  /**
   * Retrieves the persisted progress object
   */
  async getProgress(): Promise<StudentProgress | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([PROGRESS_STORE], 'readonly');
        const store = transaction.objectStore(PROGRESS_STORE);
        const request = store.get('current_user_progress');
        
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn('[Storage] Could not retrieve progress from IndexedDB:', e);
      return null;
    }
  }

  /**
   * Saves an individual investigation result
   */
  async saveInvestigation(investigation: CompletedInvestigation): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([INVESTIGATIONS_STORE], 'readwrite');
        const store = transaction.objectStore(INVESTIGATIONS_STORE);
        const request = store.put(investigation);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('[Storage] Failed to save investigation to IndexedDB:', e);
    }
  }

  /**
   * Retrieves all saved investigations
   */
  async getAllInvestigations(): Promise<CompletedInvestigation[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([INVESTIGATIONS_STORE], 'readonly');
        const store = transaction.objectStore(INVESTIGATIONS_STORE);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn('[Storage] Could not retrieve investigations from IndexedDB:', e);
      return [];
    }
  }

  /**
   * Clears all data from IndexedDB
   */
  async clearAllData(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PROGRESS_STORE, INVESTIGATIONS_STORE], 'readwrite');
      transaction.objectStore(PROGRESS_STORE).clear();
      transaction.objectStore(INVESTIGATIONS_STORE).clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const storage = new ScienceLabStorage();
