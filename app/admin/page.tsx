import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import AdminDashboard from '@/components/admin-dashboard'

// 🔒 LISTA DE ADMINS (puedes mover esto a env si quieres)
const ADMIN_EMAILS = ['chasebromige@aol.com']

export default async function AdminPage() {

  // ===============================
  // 🔐 AUTH SSR (NEXT 15 READY)
  // ===============================
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 🚫 NO LOGIN → FUERA
  if (!session) {
    redirect('/login')
  }

  // 🔒 CONTROL EXTRA (solo tú entras)
  const userEmail = session.user.email

  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    redirect('/') // o página 403 si quieres
  }

  // ===============================
  // 📊 (OPCIONAL) MÉTRICAS BÁSICAS
  // ===============================
  const [maintenance, problems, insurance] = await Promise.all([
    supabase.from('maintenance').select('id', { count: 'exact', head: true }),
    supabase.from('problems').select('id', { count: 'exact', head: true }),
    supabase.from('insurance').select('id', { count: 'exact', head: true }),
  ])

  const totalEntries =
    (maintenance.count || 0) +
    (problems.count || 0) +
    (insurance.count || 0)

  // ===============================
  // 🚀 UI SAAS
  // ===============================
  return (
    <div className="space-y-8 text-white">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Admin <span className="text-orange-400">Dashboard</span>
        </h1>

        <div className="text-sm text-gray-400">
          {userEmail}
        </div>
      </div>

      {/* 📊 KPIs */}
      <div className="grid grid-cols-3 gap-6">

        <Card title="Total Entries" value={totalEntries} highlight />

        <Card title="Maintenance" value={maintenance.count || 0} />

        <Card title="Problems" value={problems.count || 0} />

      </div>

      {/* 🧠 MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* 🔥 LEFT (DATA) */}
        <div className="col-span-2">
          <AdminDashboard />
        </div>

        {/* 🔥 RIGHT (ACTIVITY / QUICK) */}
        <div className="space-y-4">

          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <h3 className="font-semibold mb-3">System</h3>

            <div className="text-sm text-gray-400 space-y-1">
              <p>✔ Auth protected</p>
              <p>✔ Supabase connected</p>
              <p>✔ Storage active</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <h3 className="font-semibold mb-3">Quick Actions</h3>

            <div className="flex flex-col gap-2">
              <button className="bg-orange-500 py-2 rounded text-black font-semibold">
                Add Content
              </button>

              <button className="bg-white/10 py-2 rounded">
                Upload Images
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ===============================
// 💎 CARD COMPONENT
// ===============================
function Card({
  title,
  value,
  highlight,
}: {
  title: string
  value: number
  highlight?: boolean
}) {
  return (
    <div
      className={`p-5 rounded-xl border border-white/10 ${
        highlight ? 'bg-orange-500/20' : 'bg-white/5'
      }`}
    >
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}