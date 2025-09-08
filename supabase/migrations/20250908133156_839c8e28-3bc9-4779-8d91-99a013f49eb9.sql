-- Create profiles table with role-based access
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  role text not null check (role in ('traveler','partner','admin')) default 'traveler',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Basic RLS Policies
-- Users can read their own profile
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

-- Users can insert their own profile (used at signup)
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'traveler')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger for auto profile creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Add updated_at trigger for profiles
create trigger update_profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();