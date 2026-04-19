import 'server-only'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

// 🔥 evitar múltiples conexiones en dev (muy importante)
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('❌ DATABASE_URL no está definido')
}

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool
}

export const db = drizzle(pool)