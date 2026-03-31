import {
  RECIPE_DIET_CATEGORIES,
  RECIPE_DISH_TYPES,
  RECIPE_MAIN_INGREDIENTS,
  RECIPE_MEAT_TYPES,
  detectRecipeDishTypes,
  detectRecipeMainIngredients,
  detectRecipeMeatTypes,
} from './recipeCategories'

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

export function buildRecipePreferenceOptions(recipes = [], preferences = {}) {
  const recipeCategories = uniqueDisplayValues([
    ...RECIPE_DIET_CATEGORIES,
    ...recipes.flatMap((recipe) => asArray(recipe?.recipeCategories)),
    ...asArray(preferences.recipeCategories),
  ])

  const recipeMeatTypes = uniqueDisplayValues([
    ...RECIPE_MEAT_TYPES,
    ...recipes.flatMap((recipe) => detectRecipeMeatTypes(recipe)),
    ...asArray(preferences.recipeMeatTypes),
  ])

  const recipeDishTypes = uniqueDisplayValues([
    ...RECIPE_DISH_TYPES,
    ...recipes.flatMap((recipe) => detectRecipeDishTypes(recipe)),
    ...asArray(preferences.recipeDishTypes),
  ])

  const recipeMainIngredients = uniqueDisplayValues([
    ...RECIPE_MAIN_INGREDIENTS,
    ...recipes.flatMap((recipe) => detectRecipeMainIngredients(recipe)),
    ...asArray(preferences.recipeMainIngredients),
  ])

  return {
    recipeCategories,
    recipeMeatTypes,
    recipeDishTypes,
    recipeMainIngredients,
  }
}
