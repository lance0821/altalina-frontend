// src/routes/blog/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { BlogPost } from '$lib/types/blog';

export async function load({ params, fetch }) {
  try {
    // Fetch from our internal API endpoint
    const response = await fetch(`/api/blog/${params.slug}`);
    
    if (!response.ok) {
      throw error(response.status, 'Blog post not found');
    }
    
    return await response.json() as {
      post: BlogPost;
      relatedPosts: BlogPost[];
    };
  } catch (err) {
    console.error('Error loading blog post:', err);
    throw error(500, 'Failed to load blog post');
  }
}