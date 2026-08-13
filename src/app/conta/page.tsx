"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ContaPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login?next=/conta");
        return;
      }
      setEmail(data.user.email ?? null);
      setLoadingUser(false);
    });
  }, [supabase, router]);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);
    setPasswordErr(null);
    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordSaving(false);
    if (error) {
      setPasswordErr("Não foi possível trocar a senha. Tente novamente.");
      return;
    }
    setNewPassword("");
    setPasswordMsg("Senha atualizada com sucesso.");
  }

  async function handleDeleteAccount() {
    setDeleteErr(null);
    setDeleting(true);
    const res = await fetch("/api/account/delete", { method: "POST" });
    if (!res.ok) {
      setDeleting(false);
      setDeleteErr("Não foi possível excluir a conta agora. Tente novamente em instantes.");
      return;
    }
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loadingUser) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <p className="sub">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Minha conta</h2>
        <p className="sub">{email}</p>

        <form onSubmit={handleChangePassword} style={{ marginTop: 24 }}>
          <div className="field">
            <label htmlFor="new-password">Trocar senha</label>
            <input
              id="new-password"
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="nova senha (mínimo 6 caracteres)"
            />
          </div>
          {passwordErr && <div className="auth-error">{passwordErr}</div>}
          {passwordMsg && (
            <div className="auth-error" style={{ background: "rgba(15,46,54,0.08)", color: "var(--deep-teal)" }}>
              {passwordMsg}
            </div>
          )}
          <button className="btn btn-dark" type="submit" disabled={passwordSaving}>
            Salvar nova senha
          </button>
        </form>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: 16, marginBottom: 8, color: "var(--ember-dark)" }}>Zona de risco</h3>
          <p className="sub" style={{ marginBottom: 16 }}>
            Excluir sua conta apaga permanentemente seu login e todas as suas simpatias. Essa ação não pode
            ser desfeita.
          </p>
          {!showDeleteConfirm ? (
            <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(true)}>
              Excluir minha conta
            </button>
          ) : (
            <div>
              {deleteErr && <div className="auth-error">{deleteErr}</div>}
              <p style={{ fontWeight: 700, marginBottom: 12 }}>Tem certeza? Isso não pode ser desfeito.</p>
              <div className="modal-actions" style={{ margin: 0 }}>
                <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleDeleteAccount} disabled={deleting}>
                  {deleting ? "Excluindo..." : "Sim, excluir tudo"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="auth-switch">
          <Link href="/painel">Voltar para minhas simpatias</Link>
        </div>
      </div>
    </div>
  );
}
