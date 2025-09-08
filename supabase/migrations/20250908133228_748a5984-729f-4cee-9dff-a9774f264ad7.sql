-- Create profiles table only if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles') then
        create table public.profiles (
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
    end if;
end $$;

-- Create policies only if they don't exist
do $$
begin
    -- Users can read their own profile
    if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can read own profile') then
        create policy "Users can read own profile"
        on public.profiles for select
        using (auth.uid() = id);
    end if;

    -- Users can insert their own profile
    if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can insert own profile') then
        create policy "Users can insert own profile"
        on public.profiles for insert
        with check (auth.uid() = id);
    end if;

    -- Users can update their own profile
    if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update own profile') then
        create policy "Users can update own profile"
        on public.profiles for update
        using (auth.uid() = id);
    end if;
end $$;

-- Auto-create profile function and trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'traveler')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger only if it doesn't exist
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();