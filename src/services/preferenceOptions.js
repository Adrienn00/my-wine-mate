import { RECIPE_DIET_CATEGORIES } from './recipeCategories'

const normalizeText = (value) =>
  (value ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : [])

const uniqueDisplayValues = (values) => {
  const map = new Map()
  values.forEach((value) => {
    const clean = (value ?? '').toString().trim()
    if (!clean) return
    const key = normalizeText(clean)
    if (!map.has(key)) map.set(key, clean)
  })
  return [...map.values()]
}

const alcoholBucketLabel = (alcoholValue) => {
  const level = Number.parseFloat(alcoholValue)
  if (!Number.isFinite(level)) return ''
  if (level < 11) return 'Low'
  if (level <= 13.5) return 'Medium'
  return 'High'
}

const sortYearsDesc = (years) =>
  [...years].sort((a, b) => {
    const an = Number(a)
    const bn = Number(b)
    if (Number.isFinite(an) && Number.isFinite(bn)) return bn - an
    return String(b).localeCompare(String(a))
  })

export function buildPreferenceOptionsFromWines(wines = [], preferences = {}) {
  const sourceWines = asArray(wines)

  const wineTypes = uniqueDisplayValues([
    ...sourceWines.map((wine) => wine?.type),
    ...asArray(preferences.wineTypes),
  ])

  const style = uniqueDisplayValues([
    ...sourceWines.map((wine) => wine?.style),
    ...asArray(preferences.style),
  ])

  const flavourProfile = uniqueDisplayValues([
    ...sourceWines.flatMap((wine) => asArray(wine?.flavorProfiles)),
    ...asArray(preferences.flavourProfile),
  ])

  const regions = uniqueDisplayValues([
    ...sourceWines.map((wine) => wine?.origin?.region),
    ...asArray(preferences.regions),
  ])

  const priceRanges = uniqueDisplayValues([
    ...sourceWines.map((wine) => wine?.priceRange),
    ...asArray(preferences.priceRanges),
  ])

  const alcoholLevels = uniqueDisplayValues([
    ...sourceWines.map((wine) => alcoholBucketLabel(wine?.alcohol)),
    ...asArray(preferences.alcoholLevels),
  ])

  const foodPreferences = uniqueDisplayValues([
    ...sourceWines.flatMap((wine) => asArray(wine?.foodPairingHints)),
    ...asArray(preferences.foodPreferences),
  ])

  const wineYears = sortYearsDesc(
    uniqueDisplayValues([...sourceWines.map((wine) => wine?.year), preferences.wineYears])
  )

  const recipeCategories = uniqueDisplayValues([
    ...RECIPE_DIET_CATEGORIES,
    ...asArray(preferences.recipeCategories),
  ])

  return {
    wineTypes,
    style,
    flavourProfile,
    regions,
    priceRanges,
    alcoholLevels,
    foodPreferences,
    recipeCategories,
    wineYears,
  }
}
