-- Adiciona o ritual "vela" à lista de rituais permitidos na tabela pedidos.
-- Rode este script no SQL Editor do seu projeto Supabase.

alter table public.pedidos drop constraint if exists pedidos_ritual_type_check;

alter table public.pedidos
  add constraint pedidos_ritual_type_check
  check (ritual_type in ('congelador', 'mel_pimenta', 'canela', 'vela'));
