export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  author_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};
