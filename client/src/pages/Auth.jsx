import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { CheckCircle2, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'

export default function Auth() {
  const { user } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/" replace/>
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setMessage(''); setError('')
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name } } })
        if (error) throw error
        setMessage(data.session ? 'Your account is ready. Welcome to TaskFlow!' : 'Account created. Check your email to confirm your address, then sign in.')
        setMode('login')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
        if (error) throw error
      }
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <div className="flex min-h-screen bg-white"><div className="hidden w-[48%] flex-col justify-between bg-[#211d48] p-12 text-white lg:flex"><div className="flex items-center gap-3"><div className="rounded-2xl bg-violet-500 p-3"><Zap size={22} fill="currentColor"/></div><span className="font-display text-2xl font-extrabold">taskflow.</span></div><div className="max-w-lg"><p className="mb-5 text-xs font-bold uppercase tracking-[.25em] text-violet-300">Make space for great work</p><h1 className="font-display text-5xl font-extrabold leading-[1.15]">Your work,<br/>beautifully <span className="text-violet-300">in flow.</span></h1><p className="mt-6 max-w-md text-base leading-7 text-indigo-100/70">A calmer way to plan your day, organize projects, and turn your to-do list into done.</p><div className="mt-10 space-y-4">{['One clear place for all your tasks','See progress without the busywork','Build momentum, one day at a time'].map(x => <div key={x} className="flex items-center gap-3 text-sm text-indigo-100"><CheckCircle2 size={18} className="text-violet-300"/>{x}</div>)}</div></div><p className="text-xs text-indigo-200/50">© {new Date().getFullYear()} TaskFlow. Make today count.</p></div><div className="flex flex-1 items-center justify-center px-6 py-12"><div className="w-full max-w-[410px]"><div className="mb-10 flex items-center gap-3 lg:hidden"><div className="rounded-xl bg-violet-600 p-2.5 text-white"><Zap size={20}/></div><span className="font-display text-xl font-extrabold">taskflow.</span></div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-600">{mode === 'login' ? 'Welcome back' : 'Get started'}</p><h2 className="mt-2 font-display text-3xl font-extrabold text-slate-800">{mode === 'login' ? 'Sign in to TaskFlow' : 'Create your account'}</h2><p className="mt-2 text-sm text-slate-500">{mode === 'login' ? 'Pick up where you left off.' : 'A more focused workday starts here.'}</p>
    {message && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}{error && <p className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    <form onSubmit={submit} className="mt-8 space-y-4">{mode === 'signup' && <label className="block text-sm font-semibold text-slate-600">Full name<input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} className="field mt-2" placeholder="Your name"/></label>}<label className="block text-sm font-semibold text-slate-600">Email address<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} className="field mt-2" placeholder="you@example.com"/></label><label className="block text-sm font-semibold text-slate-600">Password<input type="password" required minLength="6" value={form.password} onChange={e => setForm({...form,password:e.target.value})} className="field mt-2" placeholder="At least 6 characters"/></label><button disabled={busy} className="btn-primary w-full py-3.5 disabled:opacity-60">{busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}</button></form><p className="mt-7 text-center text-sm text-slate-500">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button onClick={() => {setMode(mode === 'login' ? 'signup' : 'login');setError('');setMessage('')}} className="font-bold text-violet-600">{mode === 'login' ? 'Sign up' : 'Sign in'}</button></p><p className="mt-10 text-center text-xs leading-5 text-slate-400">By continuing, you agree to use TaskFlow responsibly. Your data is protected by Supabase authentication and database policies.</p></div></div></div>
}
