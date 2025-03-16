// src/routes/blog/+page.server.ts
import { error } from '@sveltejs/kit';
import type { BlogPost, BlogIndex } from '$lib/types/blog';

export async function load({ fetch }) {
  try {
    // Now fetching from our internal API proxy instead of Wagtail directly
    const response = await fetch('/api/blog');
    
    if (!response.ok) {
      throw error(response.status, 'Failed to load blog posts');
    }
    
    // The data is already transformed by our API endpoint
    return await response.json() as {
      blogIndex: BlogIndex;
      posts: BlogPost[];
      featuredPosts: BlogPost[];
      trendingPosts: BlogPost[];
    };
  } catch (err) {
    console.error('Error loading blog posts:', err);
    return {
      blogIndex: null,
      posts: [],
      featuredPosts: [],
      trendingPosts: []
    };
  }
}