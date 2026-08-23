# Simpatia — Mapa de eventos do Analytics

Referência de onde cada evento do GA4 é disparado no site. Todos passam pela função central `trackEvent()` em `src/lib/analytics.ts`.

| Evento | Onde acontece (visual) | Onde está no código |
|---|---|---|
| `cta_fazer_simpatia` | Home → clique no botão "Fazer uma Simpatia →" (hero, topo da página) | `src/components/HeroCta.tsx` |
| `ritual_view` | Página do Congelador → carregou a página (automático, sem precisar clicar em nada) | `src/app/congelador/page.tsx` |
| `ritual_start` | Página do Congelador → clique no botão "+ Adicionar pedido" (abre o modal amarelo) | `src/app/congelador/page.tsx` |
| `ritual_submit` | Modal "Novo pedido pro congelador" → clique em "Congelar 🧊" (dispara antes de salvar) | `src/app/congelador/page.tsx` |
| `ritual_complete` | Mesmo botão "Congelar 🧊" → dispara depois que salvou com sucesso (aparece o toast "Pedido congelado ❄️") | `src/app/congelador/page.tsx` |
| `ritual_return` | Página do Congelador → clique num post-it já existente na prateleira (abre o modal de detalhe) | `src/app/congelador/page.tsx` |
| `ritual_unfreeze` | Modal de detalhe de um pedido ativo → clique em "Descongelar" / finalizar | `src/app/congelador/page.tsx` |
| `sign_up` | Página de Criar conta (`/signup`) → clique em "Criar conta" (form) ou em "Continuar com Google/Facebook" | `src/components/AuthForm.tsx` |
| `login` | Página de Entrar (`/login`) → clique em "Entrar" (form) ou em "Continuar com Google/Facebook" | `src/components/AuthForm.tsx` |

## Como conferir ao vivo

1. Abra o site numa aba anônima
2. Vá em analytics.google.com → Relatórios → **Tempo real**
3. Clique nos botões/ações da tabela acima, um de cada vez
4. Cada evento deve aparecer na seção "Contagem de eventos por Nome do evento" em poucos segundos

## Convenção pra novos eventos

Sempre que um novo ritual for criado (Mel e Pimenta, Canela), repetir o mesmo padrão de nomes trocando só o `ritual_type`:
- `ritual_view`, `ritual_start`, `ritual_submit`, `ritual_complete` com `{ ritual_type: "mel_e_pimenta" }` ou `{ ritual_type: "canela" }`

Nunca mandar o texto do pedido em si como parâmetro — só metadados seguros (tipo do ritual, método de login, etc.).
