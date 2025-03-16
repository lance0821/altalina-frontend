export type BlogPost = {
    id: number;
    slug: string;
    title: string;
    date: string;
    url?: string;
    intro?: string;
    read_time?: number;
    display_category?: string;
    is_featured?: boolean;
    is_trending?: boolean;
    author?: string | { name: string };
    body?: string;
    image?: {
      title?: string;
      alt?: string;
      caption?: string;
      small?: { url: string; width?: number; height?: number; };
      medium?: { url: string; width?: number; height?: number; };
      large?: { url: string; width?: number; height?: number; };
      thumbnail?: { url: string; width?: number; height?: number; };
    };
    categories?: Array<{ name: string; slug: string }>;
    tags?: string[];
    [key: string]: any;
  };

  export type BlogIndex = {
    id: number;
    title: string;
    intro?: string;
  };

  export type BlogApiResponse = {
    blog_index: BlogIndex;
    posts: Record<string, BlogPost>;
    featured_posts: number[];
    trending_posts: number[];
  };