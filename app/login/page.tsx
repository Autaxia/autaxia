'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleLogin(e: any) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center text-white">
      <form onSubmit={handleLogin} className="space-y-4 w-80">

        <h1 className="text-2xl font-bold">Admin Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-black border border-white/20 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-black border border-white/20 rounded"
        />

        <button className="w-full py-2 bg-orange-500 rounded">
          Login
        </button>
      </form>
    </div>
  )
}