"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError("Não foi possível salvar a nova senha. O link pode ter expirado — solicite um novo.");
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push("/painel");
      router.refresh();
    }, 1500);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Criar nova senha</h2>
        <p className="sub">Escolha uma nova senha para sua conta.</p>

        {error && <div className="auth-error">{error}</div>}

        {done ? (
          <div
            className="auth-error"
            style={{ background: "rgba(15,46,54,0.08)", color: "var(--deep-teal)" }}
          >
            Senha atualizada! Redirecionando...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="password">Nova senha</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="mínimo 6 caracteres"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              Salvar nova senha
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
