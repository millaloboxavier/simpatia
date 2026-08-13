"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LOGO_URL } from "@/lib/brand";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function syncUser(userId: string | null | undefined, userEmail: string | null | undefined) {
      setEmail(userEmail ?? null);
      if (!userId) {
        setIsAuthor(false);
        return;
      }
      const { data } = await supabase.from("authors").select("user_id").eq("user_id", userId).maybeSingle();
      setIsAuthor(!!data);
    }

    supabase.auth.getUser().then(({ data }) => syncUser(data.user?.id, data.user?.email));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user?.id, session?.user?.email);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="nav nav-v2">
      <div className="nav-inner">
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URL} alt="Simpatia" style={{ height: 34, width: "auto" }} />
        </Link>
        <nav className="links">
          <Link href="/blog" className={`navbtn-v2 ${isActive("/blog") ? "active" : ""}`}>
            Blog
          </Link>
          <Link href="/painel" className={`navbtn-v2 ${isActive("/painel") ? "active" : ""}`}>
            Minhas simpatias
          </Link>
          {email ? (
            <>
              {isAuthor && (
                <Link href="/admin/posts" className={`navbtn-v2 ${isActive("/admin") ? "active" : ""}`}>
                  Escrever
                </Link>
              )}
              <Link href="/conta" className={`navbtn-v2 ${isActive("/conta") ? "active" : ""}`} title={email}>
                Minha conta
              </Link>
              <button onClick={handleLogout} className="navbtn-v2">
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="navbtn-v2 cta">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
