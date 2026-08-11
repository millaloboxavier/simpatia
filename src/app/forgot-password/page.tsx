"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError("Não foi possível enviar o e-mail agora. Tente novamente em instantes.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Esqueceu sua senha?</h2>
        <p className="sub">Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>

        {error && <div className="auth-error">{error}</div>}

        {sent ? (
          <div
            className="auth-error"
            style={{ background: "rgba(15,46,54,0.08)", color: "var(--deep-teal)" }}
          >
            Enviamos um link de redefinição para {email}. Confira sua caixa de entrada (e o spam).
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              Enviar link de redefinição
            </button>
          </form>
        )}

        <div className="auth-switch">
          <Link href="/login">Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
}
