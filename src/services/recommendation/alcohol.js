import { normalizeText } from '../recommendationCatalog'

export const alcoholBucketFromLabel = (label) => {
  const clean = normalizeText(label)
  if (!clean) return ''
  if (clean.includes('alacsony') || clean.includes('low')) return 'low'
  if (clean.includes('kozepes') || clean.includes('medium') || clean.includes('mid'))
    return 'medium'
  if (clean.includes('magas') || clean.includes('high')) return 'high'
  return ''
}

export const alcoholBucketFromValue = (value) => {
  const level = Number.parseFloat(value)
  if (!Number.isFinite(level)) return ''
  if (level < 11) return 'low'
  if (level <= 13.5) return 'medium'
  return 'high'
}
