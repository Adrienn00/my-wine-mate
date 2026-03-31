import { normalizeText } from '../recommendationCatalog'

const parsePriceRange = (rangeText) => {
  const raw = normalizeText(rangeText).replace(/\s+/g, '')
  if (!raw) return null
  if (raw.startsWith('>')) {
    const min = Number(raw.slice(1))
    return Number.isFinite(min) ? { min, max: Infinity } : null
  }
  const [minStr, maxStr] = raw.split('-')
  const min = Number(minStr)
  const max = Number(maxStr)
  if (Number.isFinite(min) && Number.isFinite(max)) return { min, max }
  return null
}

const rangesOverlap = (a, b) => {
  if (!a || !b) return false
  return a.min <= b.max && b.min <= a.max
}

export const priceMatchScore = (prefPrices, winePrice) => {
  if (!prefPrices.length || !winePrice) return 0
  const wineRange = parsePriceRange(winePrice)
  if (!wineRange) return prefPrices.includes(normalizeText(winePrice)) ? 1 : 0
  const hits = prefPrices.filter((prefPrice) =>
    rangesOverlap(parsePriceRange(prefPrice), wineRange)
  ).length
  return hits / prefPrices.length
}
