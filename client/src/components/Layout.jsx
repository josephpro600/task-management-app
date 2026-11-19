import { useState } from 'react'
import { Menu, Search, Plus } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const titles = { '/': ['Good things happen when you focus.', 'Here is what is happening with your work today.'], '/tasks': ['My tasks', 'Keep your priorities clear and your momentum going.'], '/projects': ['Your projects', 'Bring your ideas together and make progress.'], '/calendar': ['Your calendar', 'A clear view of what is coming up.'] }
export default function Layout({ user, onSignOut, onNewTask, children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const [title, subtitle] = titles[location.pathname] ?? titles['/']
  return <div className="min-h-screen bg-[#f7f8fc]"><Sidebar user={user} onSignOut={onSignOut} open={menuOpen} onClose={() => setMenuOpen(false)}/><main className="min-h-screen lg:pl-[260px]"><header className="sticky top-0 z-20 border-b border-slate-100/80 bg-[#f7f8fc]/90 px-5 py-4 backdrop-blur-xl sm:px-8"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4"><div className="flex items-center gap-3"><button onClick={() => setMenuOpen(true)} className="rounded-xl bg-white p-2 text-slate-600 shadow-sm lg:hidden"><Menu size={20}/></button><div><p className="hidden text-xs font-semibold text-slate-400 sm:block">Workspace / <span className="text-violet-600">{location.pathname === '/' ? 'Overview' : location.pathname.slice(1)}</span></p><p className="text-sm font-bold text-slate-700">Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'} 👋</p></div></div><div className="flex items-center gap-2"><div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-400 sm:flex"><Search size={16}/><span className="text-xs">Your workspace</span></div><button onClick={onNewTask} className="btn-primary flex items-center gap-2 text-sm"><Plus size={17}/><span className="hidden sm:inline">New task</span></button></div></div></header><div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8"><div className="mb-7"><h1 className="max-w-3xl text-2xl font-extrabold leading-tight tracking-tight text-slate-800 sm:text-[30px]">{title}</h1><p className="mt-2 text-sm text-slate-500">{subtitle}</p></div>{children}</div></main></div>
}
