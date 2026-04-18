import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

const DEBUG = false

export async function enrichWithAI(
  brand: string,
  model: string,
  year: number
) {
  const prompt = `
Return ONLY valid JSON.

Car: ${brand} ${model} ${year}

Rules:
- Different engines MUST have different specs
- Use realistic engine variations (petrol, diesel, hybrid)
- Each engine should have different power, fuel or transmission
- Avoid duplicate engines
- reliability.score MUST always exist (0-100)
- performance must be realistic for base engine

{
"engines":[{"name":"","power_hp":0,"fuel":"","transmission":""}],
"performance":{"acceleration_0_100":0,"top_speed_kmh":0},
"efficiency":{"consumption_l_100km":0},
"maintenance_items":[{"item":"","interval_km":0,"cost_eur":0}],
"common_problems":[{"issue":"","description":""}],
"reliability":{"score":0},
"seo":{"intro":""}
}
`

  try {
    const res = await openai.responses.create({
      model: 'gpt-4.1-mini',
      temperature: 0.1,              // 🔥 más estable
      max_output_tokens: 550,        // 🔥 evita cortes
      input: prompt
    })

    // =========================
    // 🔥 EXTRAER TEXTO (ROBUSTO)
    // =========================
    let raw = (res as any).output_text || ''

    if (!raw && Array.isArray((res as any).output)) {
      for (const item of (res as any).output) {
        for (const c of item?.content || []) {
          if (c?.text) {
            raw = c.text
            break
          }
        }
        if (raw) break
      }
    }

    if (!raw) {
      console.log('❌ empty AI response')
      return {}
    }

    if (DEBUG) {
      console.log('\n=== RAW AI ===\n', raw, '\n=============\n')
    }

    // =========================
    // 🔥 LIMPIEZA
    // =========================
    raw = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/\n/g, ' ')
      .trim()

    // 🔥 FIX CRÍTICO: cortar basura después del JSON
    const firstBrace = raw.indexOf('{')
    const lastBrace = raw.lastIndexOf('}')

    if (firstBrace !== -1 && lastBrace !== -1) {
      raw = raw.slice(firstBrace, lastBrace + 1)
    }

    // =========================
    // 🔥 PARSE SEGURO
    // =========================
    let parsed: any

    try {
      parsed = JSON.parse(raw)
    } catch (e) {
      console.log('❌ JSON parse fail')
      return {}
    }

    // =========================
    // 🔥 VALIDACIÓN REAL
    // =========================
    if (!Array.isArray(parsed.engines) || parsed.engines.length === 0) {
      console.log('❌ invalid AI structure')
      return {}
    }

    // =========================
    // 🔥 NORMALIZACIÓN PRO
    // =========================
    return {
      engines: parsed.engines.slice(0, 2),

      performance: parsed.performance ?? {},

      efficiency: parsed.efficiency ?? {},

      maintenance_items: Array.isArray(parsed.maintenance_items)
        ? parsed.maintenance_items.slice(0, 2)
        : [],

      problems: Array.isArray(parsed.common_problems)
        ? parsed.common_problems.slice(0, 2)
        : [],

      tires: parsed.tires ?? {},

      reliability:
        typeof parsed?.reliability?.score === 'number'
          ? parsed.reliability
          : {},

      seo: {
        intro: parsed?.seo?.intro ?? ''
      }
    }

  } catch (e) {
    console.log('❌ AI request error', e)
    return {}
  }
}