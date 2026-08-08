"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError("E-mail ou senha incorretos.");
        return;
      }
      router.push(next);
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` },
      });
      setLoading(false);
      if (error) {
        setError(error.message === "User already registered" ? "Este e-mail já tem conta." : "Não foi possível criar a conta.");
        return;
      }
      setInfo("Quase lá! Confira seu e-mail para confirmar a conta.");
    }
  }

  async function handleOAuth(provider: "google" | "facebook") {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>{mode === "login" ? "Entrar" : "Criar conta"}</h2>
        <p className="sub">
          {mode === "login"
            ? "Suas simpatias são pessoais — faça login para acompanhá-las com segurança."
            : "Crie sua conta para guardar suas simpatias com segurança."}
        </p>

        {error && <div className="auth-error">{error}</div>}
        {info && <div className="auth-error" style={{ background: "rgba(15,46,54,0.08)", color: "var(--deep-teal)" }}>{info}</div>}

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
          <div className="field">
            <label htmlFor="password">Senha</label>
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
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="auth-divider">ou continue com</div>
        <div className="oauth-row">
          <button className="btn-oauth" onClick={() => handleOAuth("google")}>
            Continuar com Google
          </button>
          <button className="btn-oauth" onClick={() => handleOAuth("facebook")}>
            Continuar com Facebook
          </button>
        </div>

        <div className="auth-switch">
          {mode === "login" ? (
            <>
              Não tem conta? <Link href={`/signup?next=${next}`}>Criar conta</Link>
            </>
          ) : (
            <>
              Já tem conta? <Link href={`/login?next=${next}`}>Entrar</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
