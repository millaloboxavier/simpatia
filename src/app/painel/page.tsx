"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { daysFrozen as computeDaysFrozen } from "@/lib/pedidos";

type Pedido = {
  id: string;
  text: string;
  status: "ativo" | "finalizado";
  created_at: string;
  finalized_at: string | null;
};

function daysFrozen(p: Pedido) {
  return computeDaysFrozen(p.created_at, p.finalized_at, p.status);
}

type Filter = "todos" | "ativos" | "finalizados";

export default function PainelPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("todos");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, [supabase]);

  useEffect(() => {
    if (userId === undefined) return;
    if (userId === null) {
      setLoading(false);
      return;
    }
    supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setPedidos(data as Pedido[]);
        setLoading(false);
      });
  }, [supabase, userId]);

  const items = pedidos.filter((p) => {
    if (filter === "ativos") return p.status === "ativo";
    if (filter === "finalizados") return p.status === "finalizado";
    return true;
  });

  return (
    <div className="view">
      <div className="panel-header">
        <div className="eyebrow">Seu histórico</div>
        <h2>Minhas simpatias</h2>
        <p style={{ color: "var(--ink-soft)", marginTop: 10, maxWidth: 560, fontSize: "15.5px" }}>
          Tudo o que você já pediu, esteja em andamento ou já resolvido.
        </p>
        <div className="tabs">
          <button className={`tab ${filter === "todos" ? "active" : ""}`} onClick={() => setFilter("todos")}>
            Todas
          </button>
          <button className={`tab ${filter === "ativos" ? "active" : ""}`} onClick={() => setFilter("ativos")}>
            Ativas
          </button>
          <button className={`tab ${filter === "finalizados" ? "active" : ""}`} onClick={() => setFilter("finalizados")}>
            Resolvidas
          </button>
        </div>
      </div>

      <div className="panel-list">
        {userId === null ? (
          <div className="empty-state">
            <h3>Faça login pra ver suas simpatias</h3>
            <p>Seu histórico fica guardado com segurança, ligado à sua conta.</p>
            <Link href="/login?next=/painel" className="btn btn-dark" style={{ marginTop: 16, display: "inline-flex" }}>
              Entrar
            </Link>
          </div>
        ) : loading ? (
          <div className="empty-state">
            <h3>Carregando...</h3>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <h3>Nada por aqui ainda</h3>
            <p>Vá até o congelador e adicione seu primeiro pedido.</p>
          </div>
        ) : (
          items.map((p) => {
            const days = daysFrozen(p);
            return (
              <div
                key={p.id}
                className="row-item"
                style={p.status === "ativo" ? { cursor: "pointer" } : undefined}
                onClick={() => {
                  if (p.status === "ativo") router.push("/congelador");
                }}
              >
                <span className={`dot ${p.status === "ativo" ? "active-dot" : "done-dot"}`}></span>
                <div className="txt-col">
                  <div className="t">{p.text}</div>
                  <div className="s">{p.status === "ativo" ? "Ainda em andamento" : "Resolvido"}</div>
                </div>
                <span className={`days-chip ${p.status === "finalizado" ? "done" : ""}`}>
                  {days} dia{days === 1 ? "" : "s"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
