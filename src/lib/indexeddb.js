/**
 * SurakshaAR — IndexedDB Offline Storage & Sync
 * Uses the `idb` library for a promise-based IndexedDB API.
 * 
 * Offline flow:
 *   1. When offline, write records to sync_queue
 *   2. When online, processOfflineQueue() uploads them
 *   3. Deduplication via client-generated UUIDs + ON CONFLICT DO NOTHING
 */
import { openDB } from 'idb'
import { supabase, isSupabaseConfigured } from './supabase'

const DB_NAME = 'suraksha_ar_offline'
const DB_VERSION = 1

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Sync queue for offline actions
        if (!db.objectStoreNames.contains('sync_queue')) {
          const store = db.createObjectStore('sync_queue', { keyPath: 'id' })
          store.createIndex('status', 'status')
        }
        // Cached scenarios for offline training
        if (!db.objectStoreNames.contains('scenarios')) {
          db.createObjectStore('scenarios', { keyPath: 'id' })
        }
        // Cached assessment questions
        if (!db.objectStoreNames.contains('assessment_questions')) {
          db.createObjectStore('assessment_questions', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

/** Add an action to the offline sync queue */
export async function queueOfflineAction(actionType, payload) {
  const db = await getDB()
  const item = {
    id: crypto.randomUUID(),
    action_type: actionType,
    payload,
    created_at: new Date().toISOString(),
    status: 'pending',
  }
  await db.put('sync_queue', item)
  return item
}

/** Get all pending sync items */
export async function getPendingQueue() {
  const db = await getDB()
  const all = await db.getAll('sync_queue')
  return all.filter(item => item.status === 'pending')
}

/** Mark a sync item as done */
export async function markSynced(id) {
  const db = await getDB()
  const item = await db.get('sync_queue', id)
  if (item) {
    item.status = 'synced'
    item.synced_at = new Date().toISOString()
    await db.put('sync_queue', item)
  }
}

/** Cache scenarios for offline use */
export async function cacheScenarios(scenarios) {
  const db = await getDB()
  const tx = db.transaction('scenarios', 'readwrite')
  for (const s of scenarios) {
    await tx.store.put(s)
  }
  await tx.done
}

/** Get cached scenarios */
export async function getCachedScenarios() {
  const db = await getDB()
  return db.getAll('scenarios')
}

/** Cache assessment questions */
export async function cacheQuestions(questions) {
  const db = await getDB()
  const tx = db.transaction('assessment_questions', 'readwrite')
  for (const q of questions) {
    await tx.store.put(q)
  }
  await tx.done
}

/** Get cached questions for a scenario */
export async function getCachedQuestions(scenarioId) {
  const db = await getDB()
  const all = await db.getAll('assessment_questions')
  return all.filter(q => q.scenario_id === scenarioId)
}

/**
 * Process offline sync queue — upload pending records to Supabase.
 * Called when network comes back online.
 */
export async function processOfflineQueue() {
  if (!isSupabaseConfigured) return
  const pending = await getPendingQueue()
  if (pending.length === 0) return

  for (const item of pending) {
    try {
      switch (item.action_type) {
        case 'complete_session': {
          const { error } = await supabase
            .from('training_sessions')
            .upsert(item.payload, { onConflict: 'id', ignoreDuplicates: true })
          if (!error) await markSynced(item.id)
          break
        }
        case 'complete_assessment': {
          const { error } = await supabase
            .from('assessment_attempts')
            .upsert(item.payload, { onConflict: 'id', ignoreDuplicates: true })
          if (!error) await markSynced(item.id)
          break
        }
        case 'submit_answer': {
          const { error } = await supabase
            .from('assessment_answers')
            .upsert(item.payload, { onConflict: 'id', ignoreDuplicates: true })
          if (!error) await markSynced(item.id)
          break
        }
        default:
          console.warn('[Offline sync] Unknown action type:', item.action_type)
      }
    } catch (err) {
      console.error('[Offline sync] Failed to sync item', item.id, err)
    }
  }
}
