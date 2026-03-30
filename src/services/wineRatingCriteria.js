export const WINE_RATING_CRITERIA = [
  { key: 'tasteProfile', label: 'Ízprofil' },
  { key: 'aroma', label: 'Aroma' },
  { key: 'valueForMoney', label: 'Ár/érték' },
  { key: 'pairing', label: 'Ételpárosítás' },
]

export function getOverallRatingValue(entry) {
  const overall = Number(entry?.overall)
  if (Number.isFinite(overall)) return overall

  const rating = Number(entry?.rating)
  if (Number.isFinite(rating)) return rating

  return 0
}
