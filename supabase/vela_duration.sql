-- Adiciona duração escolhida da vela (em horas) na tabela pedidos.
-- Já foi aplicado direto no projeto via MCP do Supabase; este arquivo
-- só documenta a migração pra manter o histórico do schema no repositório.

alter table public.pedidos add column if not exists burn_hours integer not null default 24;
