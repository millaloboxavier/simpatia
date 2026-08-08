-- SimpatIA — schema inicial (Simpatia do Congelador)
-- Rode este script no SQL Editor do seu projeto Supabase (Supabase Dashboard > SQL Editor > New query).

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  text text not null check (char_length(text) between 1 and 140),
  status text not null default 'ativo' check (status in ('ativo', 'finalizado')),
  color text not null default 'color-amber',
  rotation numeric not null default -2,
  created_at timestamptz not null default now(),
  finalized_at timestamptz
);

create index if not exists pedidos_user_id_idx on public.pedidos (user_id);

alter table public.pedidos enable row level security;

create policy "Usuárias veem apenas seus próprios pedidos"
  on public.pedidos for select
  using (auth.uid() = user_id);

create policy "Usuárias criam apenas seus próprios pedidos"
  on public.pedidos for insert
  with check (auth.uid() = user_id);

create policy "Usuárias atualizam apenas seus próprios pedidos"
  on public.pedidos for update
  using (auth.uid() = user_id);

create policy "Usuárias apagam apenas seus próprios pedidos"
  on public.pedidos for delete
  using (auth.uid() = user_id);
