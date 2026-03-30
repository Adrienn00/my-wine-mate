import { asArray, buildRecommendationCatalog } from './recommendationCatalog'
import { buildPreferenceContext, scoreWine } from './recommendation/scorer'
import { averageRating } from './recommendation/semantic'

const fallbackRecommendations = (wines, limit) =>
  wines
    .map((wine) => {
      const rating = averageRating(wine)
      const ratingPercent = Math.round((rating / 5) * 100)
      return {
        ...wine,
        score: rating,
        matchPercent: ratingPercent,
        reasons: rating ? ['Nepszeru a felhasznalok kozott'] : ['Altalanosan ajanlott valasztas'],
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

export function getRecommendedWines(preferences = {}, wines = [], limit = 6, catalogInput = null) {
  const confirmedWines = asArray(wines).filter((wine) => wine?.is_confirmed === true)
  const catalog = catalogInput || buildRecommendationCatalog(confirmedWines, preferences)
  const context = buildPreferenceContext(preferences, catalog)

  if (!context.hasAnyPreference) {
    return fallbackRecommendations(confirmedWines, limit)
  }

  return confirmedWines
    .map((wine) => scoreWine(wine, catalog, context))
    .filter((wine) => wine.score > 0.4)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
