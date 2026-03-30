export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export const overlapRatio = (prefValues, wineValues) => {
  if (!prefValues.length || !wineValues.length) return 0
  const wineSet = new Set(wineValues)
  const hits = prefValues.filter((value) => wineSet.has(value)).length
  return hits / prefValues.length
}
