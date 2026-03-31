import { averageRating as averageWineRating } from './recommendation/semantic'
import {
  asRecipeCategoryArray,
  detectRecipeDishTypes,
  detectRecipeMainIngredients,
  detectRecipeMeatTypes,
} from './recipeCategories'

const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : [])

const normalizeText = (value) =>
  (value ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const uniqueNormalized = (values) => [...new Set(values.map(normalizeText).filter(Boolean))]

const recipeAverageRating = (recipe) => {
  const ratings = asArray(recipe?.ratings)
    .map((entry) => Number(entry?.rating))
    .filter((value) => Number.isFinite(value))

  if (!ratings.length) return 0
  return ratings.reduce((sum, value) => sum + value, 0) / ratings.length
}

const FOOD_HINT_SIGNAL_MAP = [
  { keyword: 'desszert', categories: ['desszert'], dishTypes: ['desszert'] },
  { keyword: 'vegetarianus', categories: ['vegetarianus'] },
  { keyword: 'vegetáriánus', categories: ['vegetarianus'] },
  { keyword: 'vegan', categories: ['vegan'] },
  { keyword: 'vegán', categories: ['vegan'] },
  { keyword: 'glutenmentes', categories: ['glutenmentes'] },
  { keyword: 'gluténmentes', categories: ['glutenmentes'] },
  { keyword: 'csirke', meatTypes: ['csirke'], mainIngredients: ['csirke'] },
  { keyword: 'pulyka', meatTypes: ['pulyka'], mainIngredients: ['pulyka'] },
  { keyword: 'marha', meatTypes: ['marha'], mainIngredients: ['marha'] },
  { keyword: 'sertes', meatTypes: ['sertes'], mainIngredients: ['sertes'] },
  { keyword: 'sertés', meatTypes: ['sertes'], mainIngredients: ['sertes'] },
  { keyword: 'hal', meatTypes: ['hal'], mainIngredients: ['hal'] },
  {
    keyword: 'tenger gyumolcsei',
    meatTypes: ['tenger gyumolcsei'],
    mainIngredients: ['tenger gyumolcsei'],
  },
  {
    keyword: 'tenger gyümölcsei',
    meatTypes: ['tenger gyumolcsei'],
    mainIngredients: ['tenger gyumolcsei'],
  },
  { keyword: 'kacsa', meatTypes: ['kacsa'], mainIngredients: ['kacsa'] },
  { keyword: 'barany', meatTypes: ['barany'], mainIngredients: ['barany'] },
  { keyword: 'bárány', meatTypes: ['barany'], mainIngredients: ['barany'] },
  { keyword: 'salata', dishTypes: ['salata'] },
  { keyword: 'saláta', dishTypes: ['salata'] },
  { keyword: 'leves', dishTypes: ['leves'] },
  { keyword: 'sajt', mainIngredients: ['sajt'] },
  { keyword: 'gomba', mainIngredients: ['gomba'] },
  { keyword: 'rizs', mainIngredients: ['rizs'] },
  { keyword: 'teszta', mainIngredients: ['teszta'] },
  { keyword: 'tészta', mainIngredients: ['teszta'] },
  { keyword: 'burgonya', mainIngredients: ['burgonya'] },
  { keyword: 'krumpli', mainIngredients: ['burgonya'] },
]

function extractRecipeSignals(recipe = {}) {
  const categories = uniqueNormalized(asRecipeCategoryArray(recipe.recipeCategories))
  const meatTypes = uniqueNormalized(detectRecipeMeatTypes(recipe))
  const dishTypes = uniqueNormalized(detectRecipeDishTypes(recipe))
  const mainIngredients = uniqueNormalized(detectRecipeMainIngredients(recipe))
  const text = normalizeText(
    [
      recipe.name,
      ...asArray(recipe.ingredients),
      ...asArray(recipe.instructions),
      ...asArray(recipe.recipeCategories),
    ].join(' ')
  )

  return {
    categories,
    meatTypes,
    dishTypes,
    mainIngredients,
    text,
  }
}

function extractWineSignals(wine = {}) {
  const foodHints = uniqueNormalized(wine.foodPairingHints || [])
  const type = normalizeText(wine.type)
  const style = normalizeText(wine.style)
  const flavours = uniqueNormalized(wine.flavorProfiles || [])
  const tags = uniqueNormalized(wine.tags || [])
  const text = normalizeText(
    [
      wine.name,
      wine.description,
      wine.type,
      wine.style,
      ...asArray(wine.foodPairingHints),
      ...asArray(wine.flavorProfiles),
      ...asArray(wine.tags),
      ...asArray(wine.grapeVarieties),
    ].join(' ')
  )

  const targets = {
    categories: [],
    meatTypes: [],
    dishTypes: [],
    mainIngredients: [],
  }

  for (const hint of [text, ...foodHints]) {
    for (const rule of FOOD_HINT_SIGNAL_MAP) {
      if (!hint.includes(rule.keyword)) continue
      targets.categories.push(...(rule.categories || []))
      targets.meatTypes.push(...(rule.meatTypes || []))
      targets.dishTypes.push(...(rule.dishTypes || []))
      targets.mainIngredients.push(...(rule.mainIngredients || []))
    }
  }

  if (style.includes('edes') || style.includes('édes')) {
    targets.categories.push('desszert')
    targets.dishTypes.push('desszert')
  }

  return {
    type,
    style,
    flavours,
    foodHints,
    tags,
    text,
    targets: {
      categories: uniqueNormalized(targets.categories),
      meatTypes: uniqueNormalized(targets.meatTypes),
      dishTypes: uniqueNormalized(targets.dishTypes),
      mainIngredients: uniqueNormalized(targets.mainIngredients),
    },
  }
}

const overlapCount = (a, b) => a.filter((item) => b.includes(item)).length

function collectReasons(recipeSignals, wineSignals, scoreParts) {
  const reasons = []

  if (scoreParts.categoryMatches > 0)
    reasons.push('The wine pairing hints match the recipe category')
  if (scoreParts.meatMatches > 0) reasons.push('This wine pairs well with this type of meat')
  if (scoreParts.dishMatches > 0) reasons.push('This wine matches this type of dish')
  if (scoreParts.mainIngredientMatches > 0)
    reasons.push('This wine is also a good match for the recipe main ingredient')
  if (scoreParts.styleBonus > 0)
    reasons.push('The wine type generally works well with this dish')

  if (!reasons.length && wineSignals.foodHints.length) {
    reasons.push('A generally good pairing based on the wine food pairing hints')
  }

  if (!reasons.length && recipeSignals.categories.length) {
    reasons.push('A generally good choice based on the recipe style')
  }

  return reasons.slice(0, 3)
}

function computeStyleBonus(recipeSignals, wineSignals) {
  let score = 0

  const isDessert =
    recipeSignals.categories.includes('desszert') || recipeSignals.dishTypes.includes('desszert')
  const isFish =
    recipeSignals.meatTypes.includes('hal') || recipeSignals.mainIngredients.includes('hal')
  const isSeafood =
    recipeSignals.meatTypes.includes('tenger gyumolcsei') ||
    recipeSignals.mainIngredients.includes('tenger gyumolcsei')
  const isRedMeat =
    recipeSignals.meatTypes.includes('marha') ||
    recipeSignals.meatTypes.includes('sertes') ||
    recipeSignals.meatTypes.includes('barany') ||
    recipeSignals.meatTypes.includes('kacsa')
  const isVegetarian = recipeSignals.categories.includes('vegetarianus')
  const hasCheeseOrMushroom =
    recipeSignals.mainIngredients.includes('sajt') ||
    recipeSignals.mainIngredients.includes('gomba')

  if (isDessert && (wineSignals.style.includes('edes') || wineSignals.style.includes('édes')))
    score += 1.5
  if (
    (isFish || isSeafood) &&
    ['feher', 'fehér', 'roze', 'rozé', 'pezsgo', 'pezsgő'].includes(wineSignals.type)
  )
    score += 1.2
  if (isRedMeat && wineSignals.type.includes('voros')) score += 1.3
  if (
    isVegetarian &&
    ['feher', 'fehér', 'roze', 'rozé', 'pezsgo', 'pezsgő'].includes(wineSignals.type)
  )
    score += 0.7
  if (
    hasCheeseOrMushroom &&
    (wineSignals.type.includes('feher') || wineSignals.type.includes('voros'))
  )
    score += 0.6

  return score
}

function scoreWineForRecipe(recipe, wine) {
  const recipeSignals = extractRecipeSignals(recipe)
  const wineSignals = extractWineSignals(wine)

  const categoryMatches = overlapCount(recipeSignals.categories, wineSignals.targets.categories)
  const meatMatches = overlapCount(recipeSignals.meatTypes, wineSignals.targets.meatTypes)
  const dishMatches = overlapCount(recipeSignals.dishTypes, wineSignals.targets.dishTypes)
  const mainIngredientMatches = overlapCount(
    recipeSignals.mainIngredients,
    wineSignals.targets.mainIngredients
  )
  const textMatches = asArray(wine.foodPairingHints).filter((hint) =>
    recipeSignals.text.includes(normalizeText(hint))
  ).length
  const styleBonus = computeStyleBonus(recipeSignals, wineSignals)

  const score =
    categoryMatches * 3 +
    meatMatches * 4 +
    dishMatches * 2.5 +
    mainIngredientMatches * 2.5 +
    textMatches * 1.5 +
    styleBonus

  const ratingBonus = averageWineRating(wine) * 0.15

  return {
    ...wine,
    pairingScore: Number((score + ratingBonus).toFixed(2)),
    matchPercent: Math.min(99, Math.max(45, Math.round((score + ratingBonus) * 11 + 35))),
    reasons: collectReasons(recipeSignals, wineSignals, {
      categoryMatches,
      meatMatches,
      dishMatches,
      mainIngredientMatches,
      styleBonus,
    }),
  }
}

function scoreRecipeForWine(wine, recipe) {
  const scoredWinePerspective = scoreWineForRecipe(recipe, wine)
  const recipeRating = recipeAverageRating(recipe)

  return {
    ...recipe,
    pairingScore: Number((scoredWinePerspective.pairingScore + recipeRating * 0.1).toFixed(2)),
    matchPercent: scoredWinePerspective.matchPercent,
    reasons: scoredWinePerspective.reasons,
  }
}

function fallbackWines(wines, limit) {
  return wines
    .map((wine) => ({
      ...wine,
      pairingScore: averageWineRating(wine),
      matchPercent: 55,
      reasons: ['A well-rated wine overall'],
    }))
    .sort((a, b) => b.pairingScore - a.pairingScore)
    .slice(0, limit)
}

function fallbackRecipes(recipes, limit) {
  return recipes
    .map((recipe) => ({
      ...recipe,
      pairingScore: recipeAverageRating(recipe),
      matchPercent: 55,
      reasons: ['A generally well-liked recipe'],
    }))
    .sort((a, b) => b.pairingScore - a.pairingScore)
    .slice(0, limit)
}

export function getRecommendedWinesForRecipe(recipe, wines = [], limit = 6) {
  const confirmed = asArray(wines).filter((wine) => wine?.is_confirmed === true)
  const scored = confirmed
    .map((wine) => scoreWineForRecipe(recipe, wine))
    .filter((wine) => wine.pairingScore > 0)
    .sort((a, b) => b.pairingScore - a.pairingScore)
    .slice(0, limit)

  return scored.length ? scored : fallbackWines(confirmed, limit)
}

export function getRecommendedRecipesForWine(wine, recipes = [], limit = 6) {
  const confirmed = asArray(recipes).filter((recipe) => recipe?.is_confirmed === true)
  const scored = confirmed
    .map((recipe) => scoreRecipeForWine(wine, recipe))
    .filter((recipe) => recipe.pairingScore > 0)
    .sort((a, b) => b.pairingScore - a.pairingScore)
    .slice(0, limit)

  return scored.length ? scored : fallbackRecipes(confirmed, limit)
}
