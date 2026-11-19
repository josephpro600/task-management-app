import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function TaskModal({ open, onClose, onSave, projects, task }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '', project_id: '' })
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (open) setForm(task ? { title: task.title, description: task.description ?? '', priority: task.priority, status: task.status, due_date: task.due_date ?? '', project_id: task.project_id ?? '' } : { title: '', description: '', priority: 'medium', status: 'todo', due_date: '', project_id: '' })
  }, [open, task])
  if (!open) return null
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async (e) => { e.preventDefault(); if (!form.title.trim()) return; setSaving(true); try { await onSave({ ...form, project_id: form.project_id || null, due_date: form.due_date || null }) } finally { setSaving(false) } }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <form onSubmit={submit} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
      <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-500">Task details</p><h2 className="mt-1 text-xl font-extrabold">{task ? 'Edit task' : 'Create a task'}</h2></div><button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={19}/></button></div>
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-600">Task title<input autoFocus required name="title" value={form.title} onChange={change} placeholder="e.g. Prepare project presentation" className="field mt-1.5" /></label>
        <label className="block text-sm font-semibold text-slate-600">Description<textarea name="description" value={form.description} onChange={change} rows="3" placeholder="Add some details..." className="field mt-1.5 resize-none" /></label>
        <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold text-slate-600">Priority<select name="priority" value={form.priority} onChange={change} className="field mt-1.5"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label className="text-sm font-semibold text-slate-600">Status<select name="status" value={form.status} onChange={change} className="field mt-1.5"><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Completed</option></select></label></div>
        <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold text-slate-600">Due date<input type="date" name="due_date" value={form.due_date} onChange={change} className="field mt-1.5" /></label><label className="text-sm font-semibold text-slate-600">Project<select name="project_id" value={form.project_id} onChange={change} className="field mt-1.5"><option value="">No project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div>
      </div>
      <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onClose} className="btn-muted">Cancel</button><button disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving...' : task ? 'Save changes' : 'Create task'}</button></div>
    </form>
  </div>
}
