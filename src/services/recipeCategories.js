export const RECIPE_DIET_CATEGORIES = ['Vegetarian', 'Vegan', 'Meaty', 'Gluten-free', 'Dessert']

export const RECIPE_MEAT_TYPES = [
  'Chicken',
  'Turkey',
  'Beef',
  'Pork',
  'Fish',
  'Seafood',
  'Duck',
  'Lamb',
]

export const RECIPE_DISH_TYPES = [
  'Soup',
  'Main course',
  'Side dish',
  'Salad',
  'Breakfast',
  'Dessert',
  'Snack',
  'Sauce / Cream',
  'Jam / Preserves',
]

export const RECIPE_MAIN_INGREDIENTS = [
  'Chicken',
  'Turkey',
  'Beef',
  'Pork',
  'Fish',
  'Seafood',
  'Potato',
  'Rice',
  'Pasta',
  'Vegetable',
  'Fruit',
  'Cheese',
  'Mushroom',
]

export const asRecipeCategoryArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value) return []
  return [value].filter(Boolean)
}

const normalizeText = (value) =>
  (value ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const RECIPE_MEAT_TYPE_KEYWORDS = [
  { label: 'Chicken', keywords: ['csirke'] },
  { label: 'Turkey', keywords: ['pulyka'] },
  { label: 'Beef', keywords: ['marha', 'borju', 'borjú'] },
  {
    label: 'Pork',
    keywords: [
      'sertes',
      'sertés',
      'diszno',
      'disznó',
      'sonka',
      'kolbasz',
      'kolbász',
      'szalonna',
      'bacon',
    ],
  },
  {
    label: 'Fish',
    keywords: [
      'lazac',
      'tonhal',
      'hekk',
      'pisztrang',
      'harcsa',
      'ponty',
      'tokehal',
      'tőkehal',
      'szardinia',
      'makrela',
    ],
  },
  {
    label: 'Seafood',
    keywords: [
      'garnela',
      'garnéla',
      'polip',
      'kagyló',
      'kagylo',
      'tenger gyumolcsei',
      'tenger gyümölcsei',
    ],
  },
  { label: 'Duck', keywords: ['kacsa'] },
  { label: 'Lamb', keywords: ['barany', 'bárány'] },
]

const RECIPE_DISH_TYPE_KEYWORDS = [
  { label: 'Soup', keywords: ['leves'] },
  { label: 'Side dish', keywords: ['koret', 'köret', 'pure', 'püré', 'rizs', 'krumpli', 'burgonya'] },
  { label: 'Salad', keywords: ['salata', 'saláta'] },
  { label: 'Breakfast', keywords: ['reggeli', 'bundas kenyer', 'bundás kenyér', 'omlett'] },
  {
    label: 'Dessert',
    keywords: [
      'desszert',
      'torta',
      'suti',
      'süti',
      'keksz',
      'fagylalt',
      'fagyi',
      'lekvar',
      'lekvár',
      'pite',
      'palacsinta',
      'muffin',
    ],
  },
  { label: 'Snack', keywords: ['pogacsa', 'pogácsa', 'kifli', 'szendvics', 'falatka'] },
  { label: 'Sauce / Cream', keywords: ['szosz', 'szósz', 'krem', 'krém', 'martas', 'mártás'] },
  { label: 'Jam / Preserves', keywords: ['lekvar', 'lekvár', 'befott', 'befőtt', 'dzsem'] },
]

const RECIPE_MAIN_INGREDIENT_KEYWORDS = [
  { label: 'Chicken', keywords: ['csirke'] },
  { label: 'Turkey', keywords: ['pulyka'] },
  { label: 'Beef', keywords: ['marha', 'borju', 'borjú'] },
  { label: 'Pork', keywords: ['sertes', 'sertés', 'diszno', 'disznó', 'karaj', 'tarja'] },
  {
    label: 'Fish',
    keywords: ['lazac', 'tonhal', 'hekk', 'pisztrang', 'harcsa', 'ponty', 'tokehal', 'tőkehal'],
  },
  { label: 'Seafood', keywords: ['garnela', 'garnéla', 'polip', 'kagyló', 'kagylo'] },
  { label: 'Potato', keywords: ['burgonya', 'krumpli'] },
  { label: 'Rice', keywords: ['rizs', 'rizotto', 'rizottó'] },
  {
    label: 'Pasta',
    keywords: [
      'teszta',
      'tészta',
      'spagetti',
      'penne',
      'fusilli',
      'lasagne',
      'lasagna',
      'metelt',
      'metélt',
    ],
  },
  {
    label: 'Vegetable',
    keywords: [
      'karfiol',
      'brokkoli',
      'cukkini',
      'padlizsan',
      'padlizsán',
      'zeller',
      'spenot',
      'spenót',
      'spárga',
      'bab',
      'zoldseg',
      'zöldség',
    ],
  },
  {
    label: 'Fruit',
    keywords: [
      'alma',
      'korte',
      'körte',
      'eper',
      'málna',
      'malna',
      'cseresznye',
      'barack',
      'narancs',
      'citrom',
      'szilva',
    ],
  },
  {
    label: 'Cheese',
    keywords: ['sajt', 'mozzarella', 'parmezan', 'parmezán', 'camembert', 'feta', 'ricotta'],
  },
  { label: 'Mushroom', keywords: ['gomba'] },
]

export const detectRecipeMeatTypes = (recipe = {}) => {
  const text = normalizeText(
    [
      recipe.name,
      ...(Array.isArray(recipe.ingredients) ? recipe.ingredients : []),
      ...(Array.isArray(recipe.instructions) ? recipe.instructions : []),
    ].join(' ')
  )

  return RECIPE_MEAT_TYPE_KEYWORDS.filter(({ keywords }) =>
    keywords.some((keyword) => text.includes(normalizeText(keyword)))
  ).map(({ label }) => label)
}

export const detectRecipeDishTypes = (recipe = {}) => {
  const nameText = normalizeText(recipe.name)
  const allText = normalizeText(
    [
      recipe.name,
      ...(Array.isArray(recipe.ingredients) ? recipe.ingredients : []),
      ...(Array.isArray(recipe.instructions) ? recipe.instructions : []),
      ...(Array.isArray(recipe.recipeCategories) ? recipe.recipeCategories : []),
    ].join(' ')
  )

  const matches = RECIPE_DISH_TYPE_KEYWORDS.filter(({ keywords }) =>
    keywords.some((keyword) => allText.includes(normalizeText(keyword)))
  ).map(({ label }) => label)

  if (
    !matches.length &&
    !nameText.includes('leves') &&
    !nameText.includes('salata') &&
    !nameText.includes('saláta')
  ) {
    matches.push('Main course')
  }

  if (
    allText.includes('desszert') ||
    asRecipeCategoryArray(recipe.recipeCategories).includes('Dessert')
  ) {
    if (!matches.includes('Dessert')) matches.push('Dessert')
  }

  return [...new Set(matches)]
}

export const detectRecipeMainIngredients = (recipe = {}) => {
  const text = normalizeText(
    [
      recipe.name,
      ...(Array.isArray(recipe.ingredients) ? recipe.ingredients : []),
      ...(Array.isArray(recipe.instructions) ? recipe.instructions : []),
    ].join(' ')
  )

  const matches = RECIPE_MAIN_INGREDIENT_KEYWORDS.filter(({ keywords }) =>
    keywords.some((keyword) => text.includes(normalizeText(keyword)))
  ).map(({ label }) => label)

  return [...new Set(matches)]
}
