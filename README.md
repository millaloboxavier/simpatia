# Simpatia

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
4. Abra uma **New query** de novo, copie o conteúdo de
   [`supabase/blog_cms.sql`](./supabase/blog_cms.sql) e rode também. Isso cria as tabelas do
   blog (`posts` e `authors`) e já migra os 3 posts que existiam fixos no código.
5. Abra uma **New query** de novo, copie o conteúdo de
   [`supabase/mel_pimenta.sql`](./supabase/mel_pimenta.sql) e rode também. Isso adiciona suporte
   a múltiplos rituais na tabela `pedidos` (necessário pra Simpatia do Mel e Pimenta funcionar).

### 1.2. Pegar as chaves de API

1. No menu lateral, vá em **Project Settings** (ícone de engrenagem) → **Data API** ou **API
   Keys**.
2. Copie a **Project URL** e a chave **`anon` `public`** (ou a nova `publishable`). Você vai usar
   isso no passo 3.
3. Copie também a chave **`service_role`** (nessa mesma tela, ou em **API Keys**). Ela é
   **secreta** — nunca cole ela em código, só nas variáveis de ambiente da Vercel. É usada só
   para permitir que a própria usuária exclua a própria conta (funcionalidade em **Minha
   conta**).

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

Abra o `.env.local` criado e cole as chaves que você pegou no passo 1.2:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
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
3. Na tela de configuração do projeto, abra **Environment Variables** e adicione as mesmas
   variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (essa é secreta — a Vercel já trata variáveis de ambiente como
     privadas, então está segura ali; só não a coloque em nenhum outro lugar público)
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
- **Página "Minha conta"**, com opção de excluir a conta permanentemente.
- **Blog com CMS próprio**: os posts ficam guardados no Supabase (não mais fixos no código), e
  qualquer conta marcada como "autora" pode escrever, editar e publicar direto pelo site, em
  **simpatia.me/admin/posts** — sem precisar mexer em código. Veja como liberar acesso pra uma
  autora na seção abaixo.
- **Vitrine na home** com as próximas simpatias marcadas como "Em breve" (Vela do Amor, Jarro da
  Prosperidade, Fita do Bonfim) — ainda não construídas, só ilustrativas.

## Como dar acesso de autora do blog pra alguém

1. A pessoa precisa **criar uma conta normal no site** primeiro (em simpatia.me/signup).
2. No Supabase, vá em **Authentication** → **Users** e encontre o e-mail dela. Copie o **User
   UID** (um código tipo `a1b2c3d4-...`).
3. Vá em **SQL Editor** → **New query** e rode (trocando pelo UID copiado):
   ```sql
   insert into public.authors (user_id, display_name) values ('cole-o-uid-aqui', 'Nome da autora');
   ```
4. Pronto — da próxima vez que ela entrar no site, vai aparecer um link **"Escrever"** no menu,
   levando pra área de posts dela.

Pra tirar o acesso de alguém, é só apagar a linha correspondente na tabela `authors` (pelo
**Table Editor** do Supabase, é bem visual).

## Estrutura do projeto

```
src/
  app/            → páginas (rotas) do site
    admin/posts/   → área onde autoras escrevem/editam posts do blog
  components/      → Nav, formulário de login/cadastro, editor de texto, toast
  lib/
    supabase/      → clientes Supabase (browser, server, admin, proxy/sessão)
    blog.ts        → tipo dos posts
    toast.ts       → notificações simples
supabase/
  schema.sql       → tabela `pedidos` (Simpatia do Congelador) e regras de segurança
  blog_cms.sql     → tabelas `posts` e `authors` (CMS do blog) e regras de segurança
  mel_pimenta.sql  → coluna `ritual_type` em `pedidos` (Simpatia do Mel e Pimenta)
```

## Próximos passos sugeridos

- Trocar o favicon e adicionar um domínio próprio na Vercel.
- Configurar Google Search Console para acompanhar o SEO orgânico.
- Construir as próximas simpatias (Vela do Amor, Jarro da Prosperidade, Fita do Bonfim) seguindo
  o mesmo padrão visual e a mesma tabela de auth.
