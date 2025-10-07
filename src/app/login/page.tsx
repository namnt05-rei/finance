'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login(){
  const [email,setEmail]=useState('admin@local')
  const [password,setPassword]=useState('admin')
  const [err,setErr]=useState('')
  const router=useRouter()
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault()
    setErr('')
    const res=await fetch('/api/login',{
      method:'POST',
      headers:{'content-type':'application/json'},
      credentials:'include',               // để nhận Set-Cookie
      body:JSON.stringify({email,password})
    })
    if(res.ok) router.push('/transactions'); else setErr('Sai tài khoản hoặc mật khẩu')
  }
  return (
    <div className="max-w-sm mx-auto bg-white shadow p-6 rounded-xl">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email"/>
        <input className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password"/>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full bg-slate-900 text-white py-2 rounded">Sign in</button>
      </form>
      <p className="text-xs mt-3 opacity-70">Demo: admin@local / admin</p>
    </div>
  )
}
