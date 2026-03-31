import { asArray, normalizeText, resolveCatalogValue } from '../recommendationCatalog'
import { alcoholBucketFromLabel, alcoholBucketFromValue } from './alcohol'
import { clamp, overlapRatio } from './math'
import { priceMatchScore } from './price'
import { wineSemanticTokens } from './semantic'

const mapPrefValues = (values, catalogValues) =>
  asArray(values)
    .map((value) => resolveCatalogValue(value, catalogValues))
    .filter(Boolean)

const WEIGHTS = {
  type: 2.5,
  style: 2,
  flavour: 2.5,
  region: 1.5,
  food: 1.8,
  price: 1.3,
  alcohol: 1.1,
  year: 0.9,
  semantic: 1.4,
}

export const buildPreferenceContext = (preferences, catalog) => {
  const prefTypes = mapPrefValues(preferences.wineTypes, catalog.types)
  const prefStyles = mapPrefValues(preferences.style, catalog.styles)
  const prefFlavours = mapPrefValues(preferences.flavourProfile, catalog.flavours)
  const prefRegions = mapPrefValues(preferences.regions, catalog.regions)
  const prefFood = mapPrefValues(preferences.foodPreferences, catalog.foods)
  const prefPrices = mapPrefValues(preferences.priceRanges, catalog.prices)
  const prefAlcoholBuckets = asArray(preferences.alcoholLevels)
    .map(alcoholBucketFromLabel)
    .filter(Boolean)
  const prefYear = normalizeText(preferences.wineYears)

  const prefSemanticTokens = new Set(
    [
      ...prefTypes,
      ...prefStyles,
      ...prefFlavours,
      ...prefRegions,
      ...prefFood,
      ...prefPrices,
      prefYear,
    ].filter((token) => token && token.length > 2)
  )

  const hasAnyPreference =
    prefTypes.length ||
    prefStyles.length ||
    prefFlavours.length ||
    prefRegions.length ||
    prefFood.length ||
    prefPrices.length ||
    prefAlcoholBuckets.length ||
    !!prefYear

  const maxScore =
    (prefTypes.length ? WEIGHTS.type : 0) +
    (prefStyles.length ? WEIGHTS.style : 0) +
    (prefFlavours.length ? WEIGHTS.flavour : 0) +
    (prefRegions.length ? WEIGHTS.region : 0) +
    (prefFood.length ? WEIGHTS.food : 0) +
    (prefPrices.length ? WEIGHTS.price : 0) +
    (prefAlcoholBuckets.length ? WEIGHTS.alcohol : 0) +
    (prefYear ? WEIGHTS.year : 0) +
    (prefSemanticTokens.size ? WEIGHTS.semantic : 0)

  return {
    prefTypes,
    prefStyles,
    prefFlavours,
    prefRegions,
    prefFood,
    prefPrices,
    prefAlcoholBuckets,
    prefYear,
    prefSemanticTokens,
    maxScore,
    hasAnyPreference,
  }
}

export const scoreWine = (wine, catalog, context) => {
  let score = 0
  const reasons = []

  const wineType = resolveCatalogValue(wine.type, catalog.types)
  const wineStyle = resolveCatalogValue(wine.style, catalog.styles)
  const wineFlavours = mapPrefValues(wine.flavorProfiles, catalog.flavours)
  const wineRegions = mapPrefValues([wine.origin?.region, wine.origin?.country], catalog.regions)
  const wineFood = mapPrefValues(wine.foodPairingHints, catalog.foods)
  const winePrice = resolveCatalogValue(wine.priceRange, catalog.prices)
  const wineAlcohol = alcoholBucketFromValue(wine.alcohol)

  const typeScore = context.prefTypes.includes(wineType) ? 1 : 0
  if (typeScore) {
    score += WEIGHTS.type * typeScore
    reasons.push(`Tipus passzol: ${wine.type}`)
  }

  const styleScore = context.prefStyles.includes(wineStyle) ? 1 : 0
  if (styleScore) {
    score += WEIGHTS.style * styleScore
    reasons.push(`Stilus passzol: ${wine.style}`)
  }

  const flavourScore = overlapRatio(context.prefFlavours, wineFlavours)
  if (flavourScore) {
    score += WEIGHTS.flavour * flavourScore
    reasons.push('Izprofil kozel all az izlesedhez')
  }

  const regionScore = overlapRatio(context.prefRegions, wineRegions)
  if (regionScore) {
    score += WEIGHTS.region * regionScore
    reasons.push(`Regio egyezes: ${wine.origin?.region || wine.origin?.country}`)
  }

  const foodScore = overlapRatio(context.prefFood, wineFood)
  if (foodScore) {
    score += WEIGHTS.food * foodScore
    reasons.push('Jol illik a valasztott etelpreferenciakhoz')
  }

  const priceScore = priceMatchScore(context.prefPrices, winePrice)
  if (priceScore) {
    score += WEIGHTS.price * priceScore
    reasons.push(`Arkategoria egyezik: ${wine.priceRange}`)
  }

  if (context.prefAlcoholBuckets.includes(wineAlcohol)) {
    score += WEIGHTS.alcohol
    reasons.push('Alkoholszint passzol')
  }

  if (context.prefYear && wine.year) {
    const preferredYear = Number(context.prefYear)
    const wineYear = Number(wine.year)
    let yearScore = 0
    if (Number.isFinite(preferredYear) && Number.isFinite(wineYear)) {
      const yearDiff = Math.abs(preferredYear - wineYear)
      yearScore = yearDiff === 0 ? 1 : yearDiff === 1 ? 0.6 : 0
    } else if (normalizeText(wine.year).includes(context.prefYear)) {
      yearScore = 0.6
    }

    if (yearScore) {
      score += WEIGHTS.year * yearScore
      reasons.push(`Evjarat kozel van: ${wine.year}`)
    }
  }

  const tokens = new Set(wineSemanticTokens(wine))
  const semanticHits = [...context.prefSemanticTokens].filter((token) => tokens.has(token)).length
  const semanticScore = context.prefSemanticTokens.size
    ? semanticHits / context.prefSemanticTokens.size
    : 0
  if (semanticScore) {
    score += WEIGHTS.semantic * clamp(semanticScore * 1.8)
    reasons.push('Leiras/tagek alapjan is jo egyezes')
  }

  const matchPercent = context.maxScore ? Math.round(clamp(score / context.maxScore) * 100) : 0

  return {
    ...wine,
    score,
    matchPercent,
    reasons,
  }
}
