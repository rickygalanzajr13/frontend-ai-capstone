create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  imdb_id text not null,
  title text,
  poster text,
  year text,
  created_at timestamptz not null default now(),
  unique (user_id, imdb_id)
);
grant select, insert, update, delete on public.favorites to authenticated;
grant all on public.favorites to service_role;
alter table public.favorites enable row level security;
create policy "own favorites select" on public.favorites for select to authenticated using (auth.uid() = user_id);
create policy "own favorites insert" on public.favorites for insert to authenticated with check (auth.uid() = user_id);
create policy "own favorites update" on public.favorites for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own favorites delete" on public.favorites for delete to authenticated using (auth.uid() = user_id);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);
grant select, insert, update, delete on public.collections to authenticated;
grant all on public.collections to service_role;
alter table public.collections enable row level security;
create policy "own collections select" on public.collections for select to authenticated using (auth.uid() = user_id);
create policy "own collections insert" on public.collections for insert to authenticated with check (auth.uid() = user_id);
create policy "own collections update" on public.collections for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own collections delete" on public.collections for delete to authenticated using (auth.uid() = user_id);

create table if not exists public.recently_viewed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  imdb_id text not null,
  title text,
  poster text,
  year text,
  viewed_at timestamptz not null default now(),
  unique (user_id, imdb_id)
);
create index if not exists recently_viewed_user_viewed_at_idx on public.recently_viewed (user_id, viewed_at desc);
grant select, insert, update, delete on public.recently_viewed to authenticated;
grant all on public.recently_viewed to service_role;
alter table public.recently_viewed enable row level security;
create policy "own recently_viewed select" on public.recently_viewed for select to authenticated using (auth.uid() = user_id);
create policy "own recently_viewed insert" on public.recently_viewed for insert to authenticated with check (auth.uid() = user_id);
create policy "own recently_viewed update" on public.recently_viewed for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own recently_viewed delete" on public.recently_viewed for delete to authenticated using (auth.uid() = user_id);
