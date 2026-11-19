import { CheckSquare, LayoutDashboard, CalendarDays, FolderKanban, Settings, LogOut, Zap, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'My tasks', icon: CheckSquare },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
]
export default function Sidebar({ user, onSignOut, open, onClose }) {
  return <><div className={`fixed inset-0 z-30 bg-slate-950/30 lg:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose}/><aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-100 bg-white px-5 py-6 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="mb-10 flex items-center justify-between px-1"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200"><Zap size={21} fill="currentColor"/></div><div><p className="font-display text-xl font-extrabold tracking-tight">taskflow<span className="text-violet-600">.</span></p><p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">Work, organized</p></div></div><button className="lg:hidden" onClick={onClose}><X size={20}/></button></div>
    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Workspace</p><nav className="space-y-1">{links.map(({to,label,icon:Icon,end}) => <NavLink key={to} to={to} end={end} onClick={onClose} className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}><Icon size={18}/>{label}</NavLink>)}</nav>
    <div className="mt-auto"><div className="mb-5 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-4 text-white"><div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/15"><Zap size={16}/></div><p className="text-sm font-bold">Make today count</p><p className="mt-1 text-xs leading-5 text-violet-100">Small steps every day lead to big results.</p></div><div className="flex items-center gap-3 border-t border-slate-100 pt-4"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">{(user?.email?.[0] ?? 'U').toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-700">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p><p className="truncate text-xs text-slate-400">{user?.email}</p></div><button title="Sign out" onClick={onSignOut} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-500"><LogOut size={17}/></button></div></div>
  </aside></>
}
