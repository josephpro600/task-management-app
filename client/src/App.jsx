import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AlertCircle, LoaderCircle, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from './lib/useAuth'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { createProject, createTask, getProjects, getTasks, removeTask, updateTask } from './lib/data'
import Layout from './components/Layout'
import TaskModal from './components/TaskModal'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Projects from './pages/Projects'
import Calendar from './pages/Calendar'

function SetupNotice(){return <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] p-5"><div className="max-w-lg rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><AlertCircle size={27}/></div><h1 className="mt-5 font-display text-2xl font-extrabold">Connect your Supabase project</h1><p className="mt-3 text-sm leading-6 text-slate-500">Create <code className="rounded bg-slate-100 px-1">client/.env</code> using <code className="rounded bg-slate-100 px-1">.env.example</code>, then add your Supabase Project URL and publishable key. Restart the Vite server after saving.</p><p className="mt-5 text-xs text-slate-400">Do not add your service-role or secret key to this frontend.</p></div></div>}
function ProtectedApp(){
 const {user}=useAuth();const navigate=useNavigate();const [tasks,setTasks]=useState([]);const [projects,setProjects]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [modal,setModal]=useState(false);const [editing,setEditing]=useState(null);const [toast,setToast]=useState('')
 const load=useCallback(async()=>{if(!user)return;setLoading(true);setError('');try{const [t,p]=await Promise.all([getTasks(user.id),getProjects(user.id)]);setTasks(t);setProjects(p)}catch(e){setError(e.message)}finally{setLoading(false)}},[user])
 useEffect(()=>{load()},[load])
 useEffect(()=>{if(!user)return;const channel=supabase.channel(`tasks-${user.id}`).on('postgres_changes',{event:'*',schema:'public',table:'tasks',filter:`user_id=eq.${user.id}`},()=>load()).subscribe();return()=>{supabase.removeChannel(channel)}},[user,load])
 const notify=msg=>{setToast(msg);window.setTimeout(()=>setToast(''),2800)}
 const saveTask=async form=>{try{if(editing){const updated=await updateTask(editing.id,form);setTasks(old=>old.map(t=>t.id===updated.id?updated:t));notify('Task updated successfully')}else{const created=await createTask({...form,user_id:user.id});setTasks(old=>[created,...old]);notify('Task created successfully')}setModal(false);setEditing(null)}catch(e){setError(e.message);throw e}}
 const editTask=task=>{setEditing(task);setModal(true)}
 const statusTask=async(task,status)=>{try{const updated=await updateTask(task.id,{status});setTasks(old=>old.map(t=>t.id===updated.id?updated:t));notify('Task status updated')}catch(e){setError(e.message)}}
 const deleteTask=async task=>{if(!window.confirm(`Delete "${task.title}"? This cannot be undone.`))return;try{await removeTask(task.id);setTasks(old=>old.filter(t=>t.id!==task.id));notify('Task deleted')}catch(e){setError(e.message)}}
 const newTask=()=>{setEditing(null);setModal(true)}
 const newProject=async form=>{try{const project=await createProject({...form,owner_id:user.id});setProjects(old=>[project,...old]);notify('Project created successfully')}catch(e){setError(e.message);throw e}}
 const signOut=async()=>{await supabase.auth.signOut();navigate('/login')}
 if(loading)return <div className="flex min-h-screen items-center justify-center text-violet-600"><LoaderCircle className="animate-spin" size={28}/></div>
 return <Layout user={user} onSignOut={signOut} onNewTask={newTask}><div className="mb-4 flex justify-end"><button onClick={load} className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-violet-600"><RefreshCw size={13}/>Refresh data</button></div>{error&&<div className="mb-5 flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700"><span>{error}</span><button onClick={()=>setError('')}>Dismiss</button></div>}<Routes><Route path="/" element={<Dashboard tasks={tasks} projects={projects} onEdit={editTask} onStatus={statusTask}/>}/><Route path="/tasks" element={<Tasks tasks={tasks} onEdit={editTask} onDelete={deleteTask} onStatus={statusTask}/>}/><Route path="/projects" element={<Projects projects={projects} tasks={tasks} onCreate={newProject}/>}/><Route path="/calendar" element={<Calendar tasks={tasks} onEdit={editTask}/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes><TaskModal open={modal} onClose={()=>{setModal(false);setEditing(null)}} onSave={saveTask} projects={projects} task={editing}/>{toast&&<div className="fixed bottom-5 right-5 z-[60] rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div>}</Layout>
}
export default function App(){const {user,loading}=useAuth();if(!isSupabaseConfigured)return <SetupNotice/>;if(loading)return <div className="flex min-h-screen items-center justify-center"><LoaderCircle className="animate-spin text-violet-600"/></div>;return <Routes><Route path="/login" element={<Auth/>}/><Route path="/signup" element={<Auth/>}/><Route path="/*" element={user?<ProtectedApp/>:<Navigate to="/login" replace/>}/></Routes>}
