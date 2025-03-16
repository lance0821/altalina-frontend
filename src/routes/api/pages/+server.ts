import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

// Simple in-memory cache
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

/**
 * GET handler for pages API endpoint
 * This endpoint proxies requests to the Wagtail API, with caching and error handling
 */
export const GET: RequestHandler = async ({ url, fetch, request }) => {
  try {
    // Create a cache key from the URL
    const cacheKey = url.toString();
    
    // Check for refresh header or query parameter
    const skipCache = 
      request.headers.get('x-refresh-cache') === 'true' || 
      url.searchParams.get('refresh') === 'true';
    
    // Check if we have a valid cache entry
    if (!skipCache && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      
      // TypeScript narrowing - check that cached is defined
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return json(cached.data);
      }
      
      // Cache expired or missing, remove it if it exists
      if (cached) {
        cache.delete(cacheKey);
      }
    }
    
    // Forward query parameters from the request to Wagtail
    const wagtailUrl = new URL(`${import.meta.env.VITE_WAGTAIL_URL}/api/v2/pages`);
    
    // Copy all search parameters
    url.searchParams.forEach((value, key) => {
      // Skip the 'refresh' parameter as it's only for our endpoint
      if (key !== 'refresh') {
        wagtailUrl.searchParams.append(key, value);
      }
    });
    
    console.log(`Fetching from Wagtail API: ${wagtailUrl.toString()}`);
    
    const res = await fetch(wagtailUrl.toString());
    
    if (!res.ok) {
      return json(
        { error: 'Failed to fetch data from Wagtail API', status: res.status },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    
    // Optional: Transform data here if needed
    // For example, add additional fields, filter sensitive information, etc.
    
    // Cache the response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return json(data);
  } catch (error: unknown) {
    console.error('Error connecting to Wagtail backend:', error);
    
    // Safely extract error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return json(
      { error: 'Error connecting to Wagtail backend', details: errorMessage },
      { status: 500 }
    );
  }
};