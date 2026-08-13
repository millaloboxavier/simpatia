-- SimpatIA — CMS do blog (autoras, posts)
-- Rode este script no SQL Editor do seu projeto Supabase, depois do schema.sql.

-- Quem pode escrever no blog. Adicione uma linha aqui pra cada amiga que vai
-- publicar (veja instruções no README sobre como pegar o user_id dela).
create table if not exists public.authors (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.authors enable row level security;

create policy "Autoras veem se elas mesmas são autoras"
  on public.authors for select
  using (auth.uid() = user_id);

-- Posts do blog
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  seo_title text,
  seo_description text,
  author_id uuid references auth.users (id) on delete set null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx on public.posts (published, created_at desc);
create index if not exists posts_author_id_idx on public.posts (author_id);

alter table public.posts enable row level security;

create policy "Qualquer pessoa lê posts publicados"
  on public.posts for select
  using (published = true);

create policy "Autoras leem também seus próprios posts (mesmo despublicados)"
  on public.posts for select
  using (auth.uid() = author_id);

create policy "Só autoras cadastradas podem criar posts"
  on public.posts for insert
  with check (
    auth.uid() = author_id
    and exists (select 1 from public.authors where user_id = auth.uid())
  );

create policy "Autoras editam só os próprios posts"
  on public.posts for update
  using (auth.uid() = author_id);

create policy "Autoras apagam só os próprios posts"
  on public.posts for delete
  using (auth.uid() = author_id);

-- Migra os 3 posts que já existiam fixos no código, pra não perder o conteúdo.
insert into public.posts (slug, title, excerpt, content, seo_title, seo_description, published, created_at)
values
  (
    'o-que-e-uma-simpatia',
    'O que é uma simpatia (e por que ela funciona pra tanta gente)',
    'Simpatias fazem parte da cultura popular brasileira há gerações. Entenda a origem desse costume e por que ele ainda faz tanto sentido hoje.',
    '<p>Simpatias são pequenos rituais populares, passados de geração em geração, que misturam fé, intenção e gestos simbólicos para lidar com o que está fora do nosso controle.</p><p>Elas não substituem terapia, medicina ou ação prática — mas oferecem algo que a ciência também reconhece como valioso: um ritual de fechamento. Escrever, nomear e simbolicamente ''guardar'' aquilo que nos incomoda ajuda a organizar a cabeça.</p><p>A Simpatia do Congelador é uma das mais populares: escreva o que você quer que esfrie — uma situação, uma pessoa, uma ansiedade — e coloque no congelador. Enquanto ela está lá, você dá um passo atrás emocionalmente.</p>',
    null,
    null,
    true,
    '2026-07-20T00:00:00Z'
  ),
  (
    'simpatia-do-congelador-como-fazer',
    'Simpatia do Congelador: como fazer (e por que ela é tão popular)',
    'O passo a passo tradicional da simpatia mais compartilhada entre amigas — e como a versão digital do Simpatia.me recria essa experiência.',
    '<p>A versão tradicional é simples: escreva num papel o nome da pessoa ou da situação que você quer ''esfriar'', dobre o papel e coloque no congelador, entre os cubos de gelo ou embaixo de algum pote.</p><p>A crença é que, enquanto o papel estiver congelado, aquela energia fica ''parada'' — sem avançar, sem te afetar. Muita gente relata alívio só pelo gesto de colocar no papel o que estava só na cabeça.</p><p>No Simpatia.me, a lógica é a mesma, mas com acompanhamento: você vê os dias passando, o gelo se formando visualmente, e tem um momento de fechamento — descongelar — quando sentir que já resolveu.</p>',
    null,
    null,
    true,
    '2026-07-27T00:00:00Z'
  ),
  (
    'rituais-que-ajudam-a-soltar',
    'Rituais que ajudam a soltar o que não está em nossas mãos',
    'De velas a fitas do Bonfim, conheça outras simpatias queridas pelo Brasil afora — e o que todas têm em comum.',
    '<p>Vela do Amor, Jarro da Prosperidade, Fita do Bonfim — cada região do Brasil tem seus próprios rituais, mas todos compartilham uma estrutura parecida: uma intenção clara, um gesto simbólico e um tempo de espera.</p><p>Esse padrão não é coincidência. Rituais com começo, meio e fim ajudam a mente a processar incertezas. É por isso que essas práticas atravessam gerações, mesmo em um mundo cada vez mais digital.</p><p>Em breve, essas simpatias também vão ganhar vida no Simpatia.me — cada uma com sua própria forma de acompanhar o tempo e comemorar o resultado.</p>',
    null,
    null,
    true,
    '2026-08-02T00:00:00Z'
  )
on conflict (slug) do nothing;
