import { asArray, normalizeText } from '../recommendationCatalog'

export const averageRating = (wine) => {
  const ratings = asArray(wine?.ratings)
  if (!ratings.length) return 0
  const validRatings = ratings
    .map((r) => (Number.isFinite(Number(r?.overall)) ? Number(r.overall) : Number(r?.rating)))
    .filter((x) => Number.isFinite(x))
  if (!validRatings.length) return 0
  return validRatings.reduce((sum, value) => sum + value, 0) / validRatings.length
}

export const wineSemanticTokens = (wine) =>
  [
    wine.name,
    wine.winery,
    wine.description,
    ...(wine.tags || []),
    ...(wine.grapeVarieties || []),
    ...(wine.foodPairingHints || []),
    wine.style,
    wine.type,
    wine.origin?.region,
  ].flatMap((entry) =>
    normalizeText(entry)
      .split(/[^a-z0-9]+/g)
      .filter((token) => token.length > 2)
  )
