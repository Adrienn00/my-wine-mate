const WINE_IMAGES = {
  red: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80',
  white: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=900&q=80',
  rose: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=80',
  sparkling: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=900&q=80',
  dessert: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80',
  default: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80',
}

const RECIPE_IMAGES = {
  pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80',
  meat: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80',
  seafood: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=80',
  fish: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=900&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  dessert: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
  soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80',
  vegetarian: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
  default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
}

function includesAny(source, terms) {
  const value = String(source || '').toLowerCase()
  return terms.some((term) => value.includes(term))
}

export function wineImageFor(wine = {}) {
  if (wine.imageUrl) return wine.imageUrl

  const text = [
    wine.name,
    wine.wine_name,
    wine.type,
    wine.style,
    ...(wine.tags || []),
    ...(wine.flavorProfiles || []),
  ].join(' ')

  if (includesAny(text, ['sparkling', 'champagne', 'prosecco', 'pezsg'])) return WINE_IMAGES.sparkling
  if (includesAny(text, ['rosé', 'rose'])) return WINE_IMAGES.rose
  if (includesAny(text, ['white', 'fehér'])) return WINE_IMAGES.white
  if (includesAny(text, ['dessert', 'sweet', 'édes'])) return WINE_IMAGES.dessert
  if (includesAny(text, ['red', 'vörös'])) return WINE_IMAGES.red
  return WINE_IMAGES.default
}

export function recipeImageFor(recipe = {}) {
  if (recipe.imageUrl) return recipe.imageUrl

  const text = [
    recipe.name,
    recipe.recipe_name,
    recipe.title,
    ...(recipe.recipeCategories || []),
    ...(recipe.categories || []),
    ...(recipe.ingredients || []),
  ].join(' ')

  if (includesAny(text, ['pasta', 'spaghetti', 'tagliatelle', 'risotto'])) return RECIPE_IMAGES.pasta
  if (includesAny(text, ['beef', 'steak', 'pork', 'chicken', 'lamb', 'meat', 'hús'])) return RECIPE_IMAGES.meat
  if (includesAny(text, ['seafood', 'shrimp', 'prawn', 'mussel'])) return RECIPE_IMAGES.seafood
  if (includesAny(text, ['fish', 'salmon', 'tuna', 'hal'])) return RECIPE_IMAGES.fish
  if (includesAny(text, ['salad', 'fresh', 'zöldség'])) return RECIPE_IMAGES.salad
  if (includesAny(text, ['dessert', 'cake', 'chocolate', 'sweet', 'desszert'])) return RECIPE_IMAGES.dessert
  if (includesAny(text, ['soup', 'leves'])) return RECIPE_IMAGES.soup
  if (includesAny(text, ['vegetarian', 'vegan', 'mushroom', 'gomba'])) return RECIPE_IMAGES.vegetarian
  return RECIPE_IMAGES.default
}
