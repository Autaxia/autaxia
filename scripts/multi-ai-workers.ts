import 'dotenv/config'
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import readline from 'readline'
import { processJob } from '../lib/pipeline'

// =====================
// ENTER LOGIN
// =====================
function waitEnter(message = '➡️ Pulsa ENTER cuando hayas iniciado sesión manualmente y estés en la página principal...') {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    rl.question(message + '\n', () => { rl.close(); resolve(null) })
  })
}

// =====================
// HUMAN DELAY (variabilidad alta)
// =====================
function humanDelay(min = 800, max = 7200) {
  return new Promise(res => setTimeout(res, Math.random() * (max - min) + min))
}

// =====================
// PATRÓN HUMANO REAL (2026) - Curvas + jitter + inercia
// =====================
async function humanInteraction(page: any) {
  try {
    const viewport = await page.viewportSize() || { width: 1366, height: 768 }
    const width = viewport.width
    const height = viewport.height

    // Número variable de movimientos por interacción
    const moves = 3 + Math.floor(Math.random() * 5)

    for (let i = 0; i < moves; i++) {
      const targetX = 80 + Math.random() * (width - 160)
      const targetY = 80 + Math.random() * (height - 200)

      // Movimiento con steps variables + jitter (imperfección humana)
      await page.mouse.move(targetX, targetY, {
        steps: 6 + Math.floor(Math.random() * 22)   // muy variable
      })

      // Pequeño jitter post-movimiento (temblor natural)
      if (Math.random() > 0.6) {
        await page.mouse.move(
          targetX + (Math.random() * 12 - 6),
          targetY + (Math.random() * 12 - 6),
          { steps: 3 }
        )
      }

      await humanDelay(60, 520)
    }

    // Scroll con inercia y posible overshoot (comportamiento muy humano)
    if (Math.random() > 0.45) {
      const scrollAmount = 140 + Math.random() * 480
      await page.evaluate((dist: number) => {
        window.scrollBy({ top: dist, left: 0, behavior: 'smooth' })
      }, scrollAmount)

      await humanDelay(420, 1350)

      // Overshoot + corrección (humano típico)
      if (Math.random() > 0.65) {
        const correction = -(50 + Math.random() * 160)
        await page.evaluate((dist: number) => {
          window.scrollBy({ top: dist, left: 0, behavior: 'smooth' })
        }, correction)
      }
    }

    // Pausa idle realista (leyendo, pensando, distraído)
    if (Math.random() > 0.5) {
      await humanDelay(950, 3850)
    }

  } catch (e) {
    // silencioso si la página cambia
  }
}

// =====================
// SUPABASE
// =====================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getJob() {
  const { data, error } = await supabase.rpc('get_next_job')
  if (error) console.log('❌ getJob error', error)
  return data?.[0]
}

async function savePage(result: any, job: any) {
  const { error } = await supabase
    .from('pages')
    .upsert({
      slug: result.slug,
      brand_slug: job.brand_slug,
      model_slug: job.model_slug,
      year: job.year,
      type: job.type,
      content: result.content,
      meta_title: result.metaTitle,
      meta_description: result.metaDescription,
      status: 'published'
    }, { onConflict: 'slug' })

  if (error) console.log('❌ savePage error', error)
}

// =====================
// STEALTH LIMPIO (solo lo necesario)
// =====================
async function applyStealth(page: any) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined })

    Object.defineProperty(navigator, 'plugins', {
      get: () => [
        { name: 'Chrome PDF Plugin' },
        { name: 'Chrome PDF Viewer' },
        { name: 'Native Client' }
      ]
    })

    Object.defineProperty(navigator, 'languages', { get: () => ['es-ES', 'es', 'en-US', 'en'] })
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 })
    Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 })

    //@ts-ignore
    window.chrome = { runtime: { id: undefined } }

    const origQuery = window.navigator.permissions.query
    window.navigator.permissions.query = (params: any) =>
      params.name === 'notifications'
        ? Promise.resolve({ state: 'denied' } as PermissionStatus)
        : origQuery(params)

    // Canvas con ruido mínimo y sutil
    const origGetContext = HTMLCanvasElement.prototype.getContext

HTMLCanvasElement.prototype.getContext = function (
  this: HTMLCanvasElement,
  ...args: any[]
): any {
  const type = args[0]
  const ctx = origGetContext.call(this, type, ...args)

  if (type === '2d' && ctx) {
    const context2D = ctx as CanvasRenderingContext2D

    const origFillText = context2D.fillText

    context2D.fillText = function (
      text: string,
      x: number,
      y: number,
      ...rest: any[]
    ) {
      return origFillText.call(
        this,
        text,
        x + (Math.random() * 0.35 - 0.17),
        y + (Math.random() * 0.35 - 0.17),
        ...rest
      )
    }

    return context2D
  }

  return ctx
}
  })
}

// =====================
// WORKER
// =====================
async function createWorker(name: string, url: string) {
  console.log(`🚀 Iniciando ${name} con comportamiento humano real...`)

  const context = await chromium.launchPersistentContext(
    `./sessions/${name}`,
    {
      channel: 'chrome',
      headless: false,
      viewport: { width: 1366, height: 768 },
      screen: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--no-first-run'
      ],
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
      bypassCSP: true,
      ignoreHTTPSErrors: true,
    }
  )

  const page = await context.newPage()
  await applyStealth(page)
  await context.grantPermissions(['notifications'], { origin: url })

  console.log(`🌐 Abriendo ${url}`)
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  console.log(`🔐 ${name.toUpperCase()} - Inicia sesión manualmente`)
  await waitEnter()

  console.log(`✅ ${name} listo. Aplicando comportamiento humano inicial...`)
  await humanDelay(7500, 16000)
  await humanInteraction(page)   // primera interacción natural

  while (true) {
    try {
      console.log(`[${name}] 🔍 Buscando job...`)

      const job = await getJob()
      if (!job) {
        console.log(`[${name}] ⏳ Sin jobs...`)
        await humanDelay(11000, 23000)
        await humanInteraction(page)
        continue
      }

      console.log(`🚗 [${name}] → ${job.brand_slug} ${job.model_slug} ${job.year} (${job.type})`)

      // Comportamiento humano variable antes de procesar
      await humanDelay(1800, 6500)
      await humanInteraction(page)

      const result = await processJob(job, page, supabase)

      if (!result) {
        await supabase.from('jobs').update({ status: 'error' }).eq('id', job.id)
        await humanDelay(4500, 9500)
        continue
      }

      await savePage(result, job)
      await supabase.from('jobs').update({ status: 'done' }).eq('id', job.id)

      console.log(`✅ [${name}] Job completado`)

      // Comportamiento post-job (como si revisaras el resultado)
      await humanInteraction(page)
      await humanDelay(5200, 14800)

    } catch (err: any) {
      console.log(`❌ [${name}] Error:`, err?.message || err)
      await humanDelay(14000, 30000)
    }
  }
}

// =====================
// RUN
// =====================
async function run() {
  await createWorker('GPT', 'https://chat.openai.com')
  await createWorker('Claude', 'https://claude.ai')
  await createWorker('Gemini', 'https://gemini.google.com')
}

run().catch(console.error)