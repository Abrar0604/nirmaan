import type { HistoryEntry } from "./types"

// In-memory storage for demo purposes
// In production, this would use a database or S3
let historyStore: HistoryEntry[] = []

export async function saveToHistory(entry: HistoryEntry): Promise<void> {
  historyStore.unshift(entry) // Add to beginning
  // Keep only last 100 entries in memory
  if (historyStore.length > 100) {
    historyStore = historyStore.slice(0, 100)
  }
}

export async function getHistory(limit?: number): Promise<HistoryEntry[]> {
  if (limit) {
    return historyStore.slice(0, limit)
  }
  return historyStore
}

export async function clearHistory(): Promise<void> {
  historyStore = []
}
