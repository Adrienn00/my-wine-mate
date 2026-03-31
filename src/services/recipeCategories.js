export const RECIPE_DIET_CATEGORIES = ['Vegetáriánus', 'Vegán', 'Húsos', 'Gluténmentes', 'Desszert']

export const RECIPE_MEAT_TYPES = [
  'Csirke',
  'Pulyka',
  'Marha',
  'Sertés',
  'Hal',
  'Tenger gyümölcsei',
  'Kacsa',
  'Bárány',
]

export const RECIPE_DISH_TYPES = [
  'Leves',
  'Főétel',
  'Köret',
  'Saláta',
  'Reggeli',
  'Desszert',
  'Snack',
  'Szósz / Krém',
  'Lekvár / Befőtt',
]

export const RECIPE_MAIN_INGREDIENTS = [
  'Csirke',
  'Pulyka',
  'Marha',
  'Sertés',
  'Hal',
  'Tenger gyümölcsei',
  'Burgonya',
  'Rizs',
  'Tészta',
  'Zöldség',
  'Gyümölcs',
  'Sajt',
  'Gomba',
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
  { label: 'Csirke', keywords: ['csirke'] },
  { label: 'Pulyka', keywords: ['pulyka'] },
  { label: 'Marha', keywords: ['marha', 'borju', 'borjú'] },
  {
    label: 'Sertés',
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
    label: 'Hal',
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
    label: 'Tenger gyümölcsei',
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
  { label: 'Kacsa', keywords: ['kacsa'] },
  { label: 'Bárány', keywords: ['barany', 'bárány'] },
]

const RECIPE_DISH_TYPE_KEYWORDS = [
  { label: 'Leves', keywords: ['leves'] },
  { label: 'Köret', keywords: ['koret', 'köret', 'pure', 'püré', 'rizs', 'krumpli', 'burgonya'] },
  { label: 'Saláta', keywords: ['salata', 'saláta'] },
  { label: 'Reggeli', keywords: ['reggeli', 'bundas kenyer', 'bundás kenyér', 'omlett'] },
  {
    label: 'Desszert',
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
  { label: 'Szósz / Krém', keywords: ['szosz', 'szósz', 'krem', 'krém', 'martas', 'mártás'] },
  { label: 'Lekvár / Befőtt', keywords: ['lekvar', 'lekvár', 'befott', 'befőtt', 'dzsem'] },
]

const RECIPE_MAIN_INGREDIENT_KEYWORDS = [
  { label: 'Csirke', keywords: ['csirke'] },
  { label: 'Pulyka', keywords: ['pulyka'] },
  { label: 'Marha', keywords: ['marha', 'borju', 'borjú'] },
  { label: 'Sertés', keywords: ['sertes', 'sertés', 'diszno', 'disznó', 'karaj', 'tarja'] },
  {
    label: 'Hal',
    keywords: ['lazac', 'tonhal', 'hekk', 'pisztrang', 'harcsa', 'ponty', 'tokehal', 'tőkehal'],
  },
  { label: 'Tenger gyümölcsei', keywords: ['garnela', 'garnéla', 'polip', 'kagyló', 'kagylo'] },
  { label: 'Burgonya', keywords: ['burgonya', 'krumpli'] },
  { label: 'Rizs', keywords: ['rizs', 'rizotto', 'rizottó'] },
  {
    label: 'Tészta',
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
    label: 'Zöldség',
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
    label: 'Gyümölcs',
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
    label: 'Sajt',
    keywords: ['sajt', 'mozzarella', 'parmezan', 'parmezán', 'camembert', 'feta', 'ricotta'],
  },
  { label: 'Gomba', keywords: ['gomba'] },
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
    matches.push('Főétel')
  }

  if (
    allText.includes('desszert') ||
    asRecipeCategoryArray(recipe.recipeCategories).includes('Desszert')
  ) {
    if (!matches.includes('Desszert')) matches.push('Desszert')
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
