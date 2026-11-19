-- TaskFlow database schema for Supabase PostgreSQL.
-- Run the complete script in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  description text,
  color text not null default '#7567e7',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_project_id_idx on public.tasks(project_id);
create index if not exists tasks_due_date_idx on public.tasks(due_date);
create index if not exists projects_owner_id_idx on public.projects(owner_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at before update on public.tasks for each row execute function public.set_updated_at();

-- Automatically create a profile when a user registers.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

-- Profiles: users can read and update only their own profile.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Projects: each owner has exclusive access to their projects.
drop policy if exists "Owners can read projects" on public.projects;
create policy "Owners can read projects" on public.projects for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists "Owners can create projects" on public.projects;
create policy "Owners can create projects" on public.projects for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists "Owners can update projects" on public.projects;
create policy "Owners can update projects" on public.projects for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists "Owners can delete projects" on public.projects;
create policy "Owners can delete projects" on public.projects for delete to authenticated using ((select auth.uid()) = owner_id);

-- Tasks: a user can access only their own tasks. If linked to a project,
-- that project must also belong to the same user.
drop policy if exists "Users can read own tasks" on public.tasks;
create policy "Users can read own tasks" on public.tasks for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users can create own tasks" on public.tasks;
create policy "Users can create own tasks" on public.tasks for insert to authenticated with check (
  (select auth.uid()) = user_id and
  (project_id is null or exists (select 1 from public.projects p where p.id = project_id and p.owner_id = (select auth.uid())))
);
drop policy if exists "Users can update own tasks" on public.tasks;
create policy "Users can update own tasks" on public.tasks for update to authenticated using ((select auth.uid()) = user_id) with check (
  (select auth.uid()) = user_id and
  (project_id is null or exists (select 1 from public.projects p where p.id = project_id and p.owner_id = (select auth.uid())))
);
drop policy if exists "Users can delete own tasks" on public.tasks;
create policy "Users can delete own tasks" on public.tasks for delete to authenticated using ((select auth.uid()) = user_id);

-- Realtime is used by the frontend to refresh task changes.
do $$ begin
  alter publication supabase_realtime add table public.tasks;
exception when duplicate_object then null;
when undefined_object then null;
end $$;
