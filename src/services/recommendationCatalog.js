export const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : [])

export const normalizeText = (value) =>
  (value ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const unique = (values) => [...new Set(values.filter(Boolean))]

export const resolveCatalogValue = (value, catalogValues = []) => {
  const clean = normalizeText(value)
  if (!clean) return ''
  if (catalogValues.includes(clean)) return clean
  const fuzzy = catalogValues.find((item) => item.includes(clean) || clean.includes(item))
  return fuzzy || clean
}

export function buildRecommendationCatalog(wines = [], preferences = {}) {
  const typeValues = wines.map((wine) => normalizeText(wine?.type))
  const styleValues = wines.map((wine) => normalizeText(wine?.style))
  const flavourValues = wines.flatMap((wine) => asArray(wine?.flavorProfiles).map(normalizeText))
  const regionValues = wines.flatMap((wine) =>
    [wine?.origin?.region, wine?.origin?.country].map(normalizeText)
  )
  const foodValues = wines.flatMap((wine) => asArray(wine?.foodPairingHints).map(normalizeText))
  const priceValues = wines.map((wine) => normalizeText(wine?.priceRange))

  const prefTypes = asArray(preferences.wineTypes).map(normalizeText)
  const prefStyles = asArray(preferences.style).map(normalizeText)
  const prefFlavours = asArray(preferences.flavourProfile).map(normalizeText)
  const prefRegions = asArray(preferences.regions).map(normalizeText)
  const prefFoods = asArray(preferences.foodPreferences).map(normalizeText)
  const prefPrices = asArray(preferences.priceRanges).map(normalizeText)

  return {
    types: unique([...typeValues, ...prefTypes]),
    styles: unique([...styleValues, ...prefStyles]),
    flavours: unique([...flavourValues, ...prefFlavours]),
    regions: unique([...regionValues, ...prefRegions]),
    foods: unique([...foodValues, ...prefFoods]),
    prices: unique([...priceValues, ...prefPrices]),
  }
}
