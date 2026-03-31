export const WINE_RATING_CRITERIA = [
  { key: 'tasteProfile', label: 'Taste profile' },
  { key: 'aroma', label: 'Aroma' },
  { key: 'valueForMoney', label: 'Value for money' },
  { key: 'pairing', label: 'Food pairing' },
]

export function getOverallRatingValue(entry) {
  const overall = Number(entry?.overall)
  if (Number.isFinite(overall)) return overall

  const rating = Number(entry?.rating)
  if (Number.isFinite(rating)) return rating

  return 0
}
