import { createClient } from "@supabase/supabase-js";

// ATENÇÃO: usa a service role key, que tem acesso total ao banco.
// Só pode ser importado em código que roda no servidor (Route Handlers,
// Server Components) — nunca em componentes "use client".
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
