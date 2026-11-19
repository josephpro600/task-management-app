import { supabase } from './supabase'

export async function getTasks(userId) {
  const { data, error } = await supabase.from('tasks').select('*, projects(name)').eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
export async function getProjects(userId) {
  const { data, error } = await supabase.from('projects').select('*').eq('owner_id', userId).order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
export async function createTask(task) {
  const { data, error } = await supabase.from('tasks').insert(task).select('*, projects(name)').single()
  if (error) throw error
  return data
}
export async function updateTask(id, updates) {
  const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select('*, projects(name)').single()
  if (error) throw error
  return data
}
export async function removeTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}
export async function createProject(project) {
  const { data, error } = await supabase.from('projects').insert(project).select().single()
  if (error) throw error
  return data
}
