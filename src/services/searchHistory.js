const STORAGE_KEY = 'wine_search_history_v1'
const MAX_ITEMS = 8

function normalizeFilters(filters = {}) {
  return {
    query: (filters.query || '').trim(),
    type: filters.type || '',
    style: filters.style || '',
    price: filters.price || '',
    flavor: filters.flavor || '',
  }
}

function hasAnyFilter(filters) {
  return Object.values(filters).some((value) => value !== '')
}

function safeParse(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function getSearchHistory() {
  if (typeof window === 'undefined') return []
  const parsed = safeParse(localStorage.getItem(STORAGE_KEY))
  if (!Array.isArray(parsed)) return []
  return parsed
}

export function addSearchHistoryEntry(filters) {
  if (typeof window === 'undefined') return []
  const normalized = normalizeFilters(filters)
  if (!hasAnyFilter(normalized)) return getSearchHistory()

  const serialized = JSON.stringify(normalized)
  const previous = getSearchHistory().filter((entry) => {
    return JSON.stringify(normalizeFilters(entry.filters)) !== serialized
  })

  const next = [
    { id: Date.now(), createdAt: new Date().toISOString(), filters: normalized },
    ...previous,
  ]
  const limited = next.slice(0, MAX_ITEMS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(limited))
  return limited
}

export function clearSearchHistory() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function removeSearchHistoryEntry(entryId) {
  if (typeof window === 'undefined') return []
  const next = getSearchHistory().filter((entry) => entry.id !== entryId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}
