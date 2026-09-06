-- Adiciona suporte a múltiplos rituais na tabela pedidos (Simpatia do Mel e Pimenta)
-- Rode este script no SQL Editor do seu projeto Supabase.

alter table public.pedidos
  add column if not exists ritual_type text not null default 'congelador'
  check (ritual_type in ('congelador', 'mel_pimenta', 'canela'));

create index if not exists pedidos_user_ritual_idx on public.pedidos (user_id, ritual_type);
