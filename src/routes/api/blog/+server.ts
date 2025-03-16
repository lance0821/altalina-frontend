// src/routes/api/blog/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { BlogPost, BlogApiResponse } from '$lib/types/blog';

// Simple in-memory cache
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes


export const GET: RequestHandler = async ({ fetch, request, url }) => {
  try {
    // Create a cache key from the URL
    const cacheKey = url.toString();
    
    // Check for refresh header
    const skipCache = request.headers.get('x-refresh-cache') === 'true';
    
    // Check if we have a valid cache entry
    if (!skipCache && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return json(cached.data);
      }
      
      // Cache expired, remove it
      if (cached) {
        cache.delete(cacheKey);
      }
    }
    
    // Fetch from your Wagtail API
    const response = await fetch('http://127.0.0.1:8000/api/v2/blog/');
    
    if (!response.ok) {
      return json(
        { error: 'Failed to fetch blog data' }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Optional: Transform the data here to make it easier to use in components
    const transformed = {
      blogIndex: data.blog_index,
      posts: Object.values(data.posts) as BlogPost[],
      featuredPosts: data.featured_posts.map((id: number) => data.posts[id] as BlogPost),
      trendingPosts: data.trending_posts.map((id: number) => data.posts[id] as BlogPost)
    };
    
    // Cache the transformed response
    cache.set(cacheKey, {
      data: transformed,
      timestamp: Date.now()
    });
    
    return json(transformed);
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return json(
      { error: 'Failed to fetch blog data' },
      { status: 500 }
    );
  }
};