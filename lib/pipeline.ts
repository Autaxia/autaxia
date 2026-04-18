type PipelineResult = {
  data: any
  issues: string[]
}

import { enrichWithRealData } from './data/enrich'
import { adaptPrompt } from './ai/learning'
import { normalizeAIResponse } from './normalize'
import { validateCar } from './validate'
import { scoreCar } from './scoring'
import { buildRetryPrompt } from './ai/retry'
import { enhanceSEO } from './seo'
import { generateRealKeywords } from './seo/real-keywords'
import { getCommunityInsights } from './data/community'

// 🔥 NUEVO
import { processCompareJob } from '@/lib/pipeline/compare/process-compare'

// =====================
// SAFE JSON
// =====================
function safeJSON(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        return null
      }
    }
    return null
  }
}

// =====================
// HELPERS
// =====================
function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// =====================
// TYPE LOCALIZATION
// =====================
function getLocalizedType(type: string, locale: string) {
  if (locale === 'es') {
    const map: Record<string, string> = {
      problems: 'problemas',
      maintenance: 'mantenimiento',
      ownership: 'propiedad',
      insurance: 'seguro',
      tires: 'neumaticos',
      'before-buy': 'antes-de-comprar'
    }
    return map[type] || type
  }
  return type
}

// =====================
// MAIN PIPELINE
// =====================
export async function processJob(
  job: any,
  page: any,
  supabase: any
): Promise<PipelineResult | null> {

  try {

    // =====================
    // 🔥 COMPARE MODE (NUEVO)
    // =====================
    if (job.type === 'compare') {
      console.log('⚔️ processing compare:', job.slug)

      const result = await processCompareJob(job, supabase)

      if (!result) return null

      return {
        data: result,
        issues: []
      }
    }

    // =====================
    // NORMAL FLOW
    // =====================
    const brand = job.brand?.name || job.brand_slug
const model = job.model?.name || job.model_slug

console.log(`🚀 ${brand} ${model} ${job.year} (${job.type})`)

    const locales = ['en', 'es', 'pt']
    let finalResult: PipelineResult | null = null

    const keywords = await generateRealKeywords(job)

    const mainKeyword =
      keywords[0] ||
      `${job.brand} ${job.model} ${job.year} ${job.type}`

    const relatedKeywords = keywords.slice(1, 5)

    for (const locale of locales) {

      console.log(`🌍 generating locale: ${locale}`)

      const localizedType = getLocalizedType(job.type, locale)

      const { data: existing } = await supabase
        .from('pages')
        .select('*')
        .eq('brand_slug', job.brand_slug)
.eq('model_slug', job.model_slug)
        .eq('year', job.year)
        .eq('type', job.type)
        .eq('locale', locale)
        .maybeSingle()

      const isUpgrade = existing && existing.level === 'basic'
      const mode = isUpgrade ? 'advanced' : 'basic'

      const enriched = await enrichWithRealData(job)

      // =====================
      // BASIC MODE
      // =====================
      if (mode === 'basic') {

        let community: any[] = []

        try {
          community = await getCommunityInsights(
            `${job.brand} ${job.model} ${job.year}`
          )
        } catch {}

        const intro =
          locale === 'es'
            ? `${job.brand} ${job.model} ${job.year} es conocido por ${pick([
                'su equilibrio entre rendimiento y consumo',
                'su fiabilidad general',
                'su comportamiento en carretera'
              ])}.`
            : `${job.brand} ${job.model} ${job.year} is known for ${pick([
                'balanced performance and efficiency',
                'solid reliability overall',
                'comfortable driving experience'
              ])}.`

        const basicContent = {
  intro,

  overview: {
    summary:
      locale === 'es'
        ? `El ${brand} ${model} ${job.year} destaca por su equilibrio entre rendimiento, comodidad y consumo.`
        : `The ${brand} ${model} ${job.year} stands out for its balance of performance, comfort and efficiency.`
  },

  engines: enriched.engines || [],

  problems: [
    {
      title: locale === 'es' ? 'Problemas comunes' : 'Common issues',
      items: [
        locale === 'es'
          ? 'Problemas eléctricos ocasionales'
          : 'Occasional electrical issues',
        locale === 'es'
          ? 'Desgaste prematuro de suspensión'
          : 'Premature suspension wear',
        locale === 'es'
          ? 'Fugas de aceite en unidades antiguas'
          : 'Oil leaks in older units'
      ]
    }
  ],

  maintenance: [
    {
      title: locale === 'es' ? 'Coste mantenimiento' : 'Maintenance cost',
      items: [
        locale === 'es'
          ? 'Coste anual medio moderado'
          : 'Moderate yearly maintenance cost'
      ]
    }
  ],

  pros: [
    locale === 'es' ? 'Buen confort' : 'Good comfort',
    locale === 'es' ? 'Consumo eficiente' : 'Efficient fuel consumption'
  ],

  cons: [
    locale === 'es'
      ? 'Coste mantenimiento elevado en algunos casos'
      : 'Maintenance can be expensive',
    locale === 'es'
      ? 'Problemas electrónicos ocasionales'
      : 'Occasional electrical issues'
  ],

  buyerAdvice: [
    locale === 'es'
      ? 'Revisar historial de mantenimiento antes de comprar'
      : 'Check maintenance history before buying'
  ],

  faq: [
    {
      q: locale === 'es' ? '¿Es fiable?' : 'Is it reliable?',
      a: locale === 'es'
        ? 'Generalmente sí, pero depende del mantenimiento.'
        : 'Generally yes, but depends on maintenance.'
    },
    {
      q: locale === 'es' ? '¿Es caro mantenerlo?' : 'Is it expensive to maintain?',
      a: locale === 'es'
        ? 'Puede variar según motor y uso.'
        : 'Depends on engine and usage.'
    }
  ],

  community: community.slice(0, 5),
  wiki: enriched.wiki || {}
}

        await supabase.from('pages').upsert({
          brand_slug: job.brand,
          model_slug: job.model,
          year: job.year,
          type: job.type,
          locale,
          title: mainKeyword,
          content: basicContent,
          level: 'basic',
          updated_at: new Date().toISOString()
        })

        continue
      }

      // =====================
      // ADVANCED MODE (IA)
      // =====================
      let prompt = `
You are an automotive expert writing SEO content.

Write a detailed ${job.type} article about:

Car: ${brand} ${model} ${job.year}

STRICT RULES:
- Human tone (NOT robotic)
- No generic phrases
- No repetition
- Must feel written by a real expert

STRUCTURE:
- Introduction (short)
- Key insights
- Real-world usage
- Reliability discussion
- Ownership cost

ADD:
- Pros and cons
- Buyer advice
- 3-4 FAQs

STYLE:
- Short paragraphs
- Bullet points when useful
- Practical, real advice

KEYWORDS:
${mainKeyword}
${relatedKeywords.join(', ')}

RETURN JSON ONLY:
{
  intro: string,
  problems: [],
  maintenance: [],
  ownership: [],
  pros: [],
  cons: [],
  buyerAdvice: [],
  faq: []
}
`

      prompt = adaptPrompt(prompt, [])

      await page.click('[role="textbox"]').catch(() => page.click('body'))
      await page.keyboard.type(prompt)
      await page.keyboard.press('Enter')

      await page.waitForTimeout(15000)

      const content = await page.textContent('body')
      if (!content) continue

      let json = safeJSON(content)

      if (!json) {
        const retryPrompt = buildRetryPrompt(prompt, [])
        await page.keyboard.type(retryPrompt)
        await page.keyboard.press('Enter')
        await page.waitForTimeout(10000)

        const retry = await page.textContent('body')
        json = safeJSON(retry || '')
      }

      if (!json) continue

      const normalized = normalizeAIResponse(json)
      const validated = validateCar(normalized)
      if (!validated) continue

      const enhanced = enhanceSEO(validated)
      enhanced.slug = `${job.brand_slug}-${job.model_slug}-${job.year}-${job.type}`
enhanced.metaTitle = `${brand} ${model} ${job.year} ${job.type} - Full Guide`
enhanced.metaDescription = `Complete guide about ${brand} ${model} ${job.year}: specs, problems, maintenance and ownership tips.`
      const scored = scoreCar(enhanced)

      if (existing?.id) {
        await supabase.from('pages').update({
          content: enhanced,
          level: 'advanced',
          updated_at: new Date().toISOString()
        }).eq('id', existing.id)
      }

      finalResult = {
        data: enhanced,
        issues: scored.issues
      }
    }

    return finalResult

  } catch (err) {
    console.log('❌ pipeline error', err)
    return null
  }
}