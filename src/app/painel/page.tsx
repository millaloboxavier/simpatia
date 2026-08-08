"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Pedido = {
  id: string;
  text: string;
  status: "ativo" | "finalizado";
  created_at: string;
  finalized_at: string | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function daysFrozen(p: Pedido) {
  const end = p.status === "finalizado" && p.finalized_at ? new Date(p.finalized_at).getTime() : Date.now();
  return Math.max(0, Math.floor((end - new Date(p.created_at).getTime()) / DAY_MS));
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
          Tudo o que você já colocou pra congelar, esteja esperando ou já resolvido.
        </p>
        <div className="tabs">
          <button className={`tab ${filter === "todos" ? "active" : ""}`} onClick={() => setFilter("todos")}>
            Todos
          </button>
          <button className={`tab ${filter === "ativos" ? "active" : ""}`} onClick={() => setFilter("ativos")}>
            Congelados
          </button>
          <button className={`tab ${filter === "finalizados" ? "active" : ""}`} onClick={() => setFilter("finalizados")}>
            Descongelados
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
                  <div className="s">{p.status === "ativo" ? "Ainda congelado" : "Descongelado e resolvido"}</div>
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
