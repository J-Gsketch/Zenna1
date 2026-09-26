import { openDB, IDBPDatabase } from 'idb';

export const DB_NAME = 'zenna_offline_v1';
export const DB_VERSION = 1;

export interface QueuedAction {
  id: string;
  url: string;
  method: string;
  payload: any;
  headers?: Record<string, string>;
  timestamp: number;
  createdAt: string;
  retryCount?: number;
  lastError?: string;
}

export interface CacheEntry<T = any> {
  id: string;
  data: T;
  timestamp: number;
  updatedAt: string;
  [key: string]: any;
}

export interface SyncFlushResult {
  total: number;
  purged: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

/**
 * Initializes and retrieves the IndexedDB instance
 */
export function getDB(): Promise<IDBPDatabase> {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only available in browser environments'));
  }

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id' });
        }
      }
    });
  }

  return dbPromise;
}

/**
 * Saves an action to IndexedDB syncQueue optimistically and attempts immediate flush if online
 */
export async function executeOptimisticAction(
  url: string,
  method: string = 'POST',
  payload: any = {},
  headers?: Record<string, string>
): Promise<QueuedAction> {
  const actionId = `action_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date();

  const action: QueuedAction = {
    id: actionId,
    url,
    method: method.toUpperCase(),
    payload,
    headers: headers || { 'Content-Type': 'application/json' },
    timestamp: now.getTime(),
    createdAt: now.toISOString(),
    retryCount: 0
  };

  try {
    const db = await getDB();
    await db.put('syncQueue', action);
  } catch (err) {
    console.error('[OfflineSync] Failed to store optimistic action in syncQueue:', err);
  }

  // Trigger immediate flush if online
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    flushSyncQueue().catch((err) => {
      console.warn('[OfflineSync] Immediate queue flush attempt error:', err);
    });
  }

  return action;
}

let isFlushing = false;

/**
 * Iterates through queued mutations in syncQueue, sends them via fetch(),
 * and purges items from queue on HTTP 2xx or 409 responses.
 */
export async function flushSyncQueue(): Promise<SyncFlushResult> {
  if (isFlushing) {
    return { total: 0, purged: 0, failed: 0, errors: [] };
  }

  try {
    isFlushing = true;
    const db = await getDB();
    const actions: QueuedAction[] = await db.getAll('syncQueue');

    const result: SyncFlushResult = {
      total: actions.length,
      purged: 0,
      failed: 0,
      errors: []
    };

    if (actions.length === 0) {
      return result;
    }

    // Sort chronologically by timestamp
    actions.sort((a, b) => a.timestamp - b.timestamp);

    for (const action of actions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: action.headers || { 'Content-Type': 'application/json' },
          body: action.payload ? JSON.stringify(action.payload) : undefined
        });

        // Purge from queue on HTTP 2xx or 409 (conflict/already applied) responses
        if (response.ok || response.status === 409) {
          await db.delete('syncQueue', action.id);
          result.purged++;
        } else {
          result.failed++;
          const errMessage = `HTTP ${response.status}: ${response.statusText}`;
          action.retryCount = (action.retryCount || 0) + 1;
          action.lastError = errMessage;
          await db.put('syncQueue', action);
          result.errors.push({ id: action.id, error: errMessage });
        }
      } catch (networkError: any) {
        result.failed++;
        const errMessage = networkError?.message || 'Network request failed';
        action.retryCount = (action.retryCount || 0) + 1;
        action.lastError = errMessage;
        await db.put('syncQueue', action);
        result.errors.push({ id: action.id, error: errMessage });
        // If offline network failure, pause flush sequence
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          break;
        }
      }
    }

    return result;
  } finally {
    isFlushing = false;
  }
}

/**
 * Cache store helpers
 */
export async function getCachedData<T = any>(id: string): Promise<T | null> {
  try {
    const db = await getDB();
    const entry: CacheEntry<T> | undefined = await db.get('cache', id);
    return entry ? entry.data : null;
  } catch (err) {
    console.error(`[OfflineSync] Failed to get cached data for key ${id}:`, err);
    return null;
  }
}

export async function setCachedData<T = any>(id: string, data: T): Promise<void> {
  try {
    const db = await getDB();
    const now = new Date();
    const entry: CacheEntry<T> = {
      id,
      data,
      timestamp: now.getTime(),
      updatedAt: now.toISOString()
    };
    await db.put('cache', entry);
  } catch (err) {
    console.error(`[OfflineSync] Failed to set cached data for key ${id}:`, err);
  }
}

export async function getAllCachedData<T = any>(): Promise<Array<CacheEntry<T>>> {
  try {
    const db = await getDB();
    return await db.getAll('cache');
  } catch (err) {
    console.error('[OfflineSync] Failed to get all cached data:', err);
    return [];
  }
}

export async function getSyncQueue(): Promise<QueuedAction[]> {
  try {
    const db = await getDB();
    return await db.getAll('syncQueue');
  } catch (err) {
    console.error('[OfflineSync] Failed to retrieve sync queue:', err);
    return [];
  }
}

export async function clearSyncQueue(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('syncQueue');
  } catch (err) {
    console.error('[OfflineSync] Failed to clear sync queue:', err);
  }
}

// Auto-register online sync listener in browser environment
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[OfflineSync] Online network event detected. Flushing sync queue...');
    flushSyncQueue().catch((err) => {
      console.error('[OfflineSync] Error during auto-sync flush:', err);
    });
  });
}
