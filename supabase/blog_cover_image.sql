-- SimpatIA — adiciona imagem de capa aos posts do blog
-- Rode este script no SQL Editor do Supabase, depois do blog_cms.sql.

alter table public.posts add column if not exists cover_image_url text;

-- Imagem de exemplo no primeiro post, pra já testarmos como fica.
update public.posts
set cover_image_url = 'https://kybevdzcpplztwyozsqi.supabase.co/storage/v1/object/public/Site%20Assets/Imagens-blog/o-que-e-simpatia.png'
where slug = 'o-que-e-uma-simpatia';
