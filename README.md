# SimpatIA

Site de "simpatias virtuais" — a primeira funcionalidade é a **Simpatia do Congelador**:
escreva o que você quer "congelar", acompanhe os dias passando e finalize quando resolver.

Stack: **Next.js** (App Router) + **Supabase** (autenticação e banco de dados), hospedado na
**Vercel**.

Este README é o guia passo a passo pra colocar o site no ar, escrito pra quem nunca fez isso
antes. Siga na ordem.

---

## 1. Criar o projeto no Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard) e clique em **New project**.
2. Dê um nome (ex: `simpatia`), escolha uma senha de banco de dados forte (guarde num lugar
   seguro, mas você não vai precisar dela no dia a dia) e a região mais próxima (ex: São Paulo).
3. Espere o projeto terminar de ser criado (leva ~2 minutos).

### 1.1. Rodar o script que cria a tabela de dados

1. No menu lateral do seu projeto Supabase, clique em **SQL Editor** → **New query**.
2. Abra o arquivo [`supabase/schema.sql`](./supabase/schema.sql) deste repositório, copie todo
   o conteúdo e cole no editor.
3. Clique em **Run**. Isso cria a tabela `pedidos` (onde ficam guardadas as simpatias de cada
   pessoa) já com as regras de segurança que garantem que cada usuária só vê os próprios dados.

### 1.2. Pegar as chaves de API

1. No menu lateral, vá em **Project Settings** (ícone de engrenagem) → **Data API**.
2. Copie a **Project URL** e a chave **anon public** (em **API Keys**). Você vai usar isso no
   passo 3.

### 1.3. Ativar login com Google e Facebook (opcional, mas recomendado)

O cadastro por e-mail e senha já funciona sem nenhuma configuração extra. Para ativar os botões
"Continuar com Google" e "Continuar com Facebook":

1. No Supabase, vá em **Authentication** → **Sign In / Providers**.
2. Clique em **Google**, ative o provider e siga o link do Supabase para criar as credenciais no
   [Google Cloud Console](https://console.cloud.google.com/) (é um passo a passo guiado — você
   vai criar um "OAuth Client ID" e colar o Client ID/Secret de volta no Supabase).
3. Repita o processo para **Facebook**, criando um app em
   [developers.facebook.com](https://developers.facebook.com/).
4. Em **Authentication** → **URL Configuration**, defina a **Site URL** como o endereço do seu
   site depois do deploy (ex: `https://simpatia.vercel.app`) — você atualiza isso no passo 4,
   depois de ter o domínio da Vercel.

> Se quiser colocar o site no ar rápido e configurar Google/Facebook depois, sem problema: o
> login por e-mail e senha já cobre o cadastro obrigatório.

---

## 2. Rodar o projeto na sua máquina (opcional, mas ajuda a testar)

```bash
npm install
cp .env.local.example .env.local
```

Abra o `.env.local` criado e cole a **Project URL** e a **anon public key** que você pegou no
passo 1.2:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

Depois:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — o site deve abrir com o visual do
protótipo. Crie uma conta, adicione um pedido no congelador e confira se ele aparece em "Minhas
simpatias".

---

## 3. Publicar na Vercel

1. Suba este projeto para um repositório no GitHub (se ainda não estiver lá).
2. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório.
3. Na tela de configuração do projeto, abra **Environment Variables** e adicione as mesmas duas
   variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**. Em ~1 minuto o site estará no ar num endereço tipo
   `https://simpatia.vercel.app`.

### 3.1. Atalho final no Supabase

Volte no Supabase → **Authentication** → **URL Configuration** e confirme:
- **Site URL**: `https://simpatia.vercel.app` (ou seu domínio)
- **Redirect URLs**: adicione `https://simpatia.vercel.app/auth/callback`

Isso garante que o login (inclusive Google/Facebook) funcione corretamente em produção.

---

## O que já está pronto

- **Simpatia do Congelador** completa: adicionar pedido, ver o gelo se formar com os dias,
  descongelar/finalizar, compartilhar no WhatsApp.
- **Cadastro obrigatório** para criar simpatias: e-mail/senha, Google e Facebook (via Supabase
  Auth), com Row Level Security no banco — cada pessoa só acessa os próprios dados.
- **Painel "Minhas simpatias"** com histórico e filtros.
- **Blog** simples com 3 posts iniciais sobre o universo das simpatias
  (`src/lib/posts.ts` — adicionar novos posts é só adicionar um item nessa lista).
- **Vitrine na home** com as próximas simpatias marcadas como "Em breve" (Vela do Amor, Jarro da
  Prosperidade, Fita do Bonfim) — ainda não construídas, só ilustrativas.

## Estrutura do projeto

```
src/
  app/            → páginas (rotas) do site
  components/      → Nav, formulário de login/cadastro, toast
  lib/
    supabase/      → clientes Supabase (browser, server, proxy/sessão)
    posts.ts       → conteúdo do blog
    toast.ts       → notificações simples
supabase/
  schema.sql       → script que cria a tabela `pedidos` e as regras de segurança
```

## Próximos passos sugeridos

- Trocar o favicon e adicionar um domínio próprio na Vercel.
- Configurar Google Search Console para acompanhar o SEO orgânico.
- Construir as próximas simpatias (Vela do Amor, Jarro da Prosperidade, Fita do Bonfim) seguindo
  o mesmo padrão visual e a mesma tabela de auth.
