/**
 * Wagtail CMS API Client
 * 
 * This module provides functions for interacting with the Wagtail CMS API.
 * It handles fetching pages, images, and other content types from the Wagtail API.
 */

// Base configuration for API requests
const API_URL = import.meta.env.VITE_WAGTAIL_API_URL || 'https://your-wagtail-cms.com/api/v2';
const API_KEY = import.meta.env.VITE_WAGTAIL_API_KEY;

// Common headers for API requests
const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (API_KEY) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
  }
  
  return headers;
};

/**
 * Fetches a list of pages from the Wagtail API
 * @param options Query parameters and fetch options
 * @returns Promise with the API response
 */
export async function fetchPages(options: {
  type?: string;
  fields?: string[];
  limit?: number;
  offset?: number;
  order?: string;
  search?: string;
} = {}) {
  const url = new URL(`${API_URL}/pages/`);
  
  // Add query parameters
  if (options.type) url.searchParams.append('type', options.type);
  if (options.fields) url.searchParams.append('fields', options.fields.join(','));
  if (options.limit) url.searchParams.append('limit', options.limit.toString());
  if (options.offset) url.searchParams.append('offset', options.offset.toString());
  if (options.order) url.searchParams.append('order', options.order);
  if (options.search) url.searchParams.append('search', options.search);
  
  const response = await fetch(url.toString(), {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetches a specific page by ID
 * @param id The page ID
 * @param fields Optional array of fields to include
 * @returns Promise with the API response
 */
export async function fetchPageById(id: number, fields?: string[]) {
  const url = new URL(`${API_URL}/pages/${id}/`);
  
  if (fields) {
    url.searchParams.append('fields', fields.join(','));
  }
  
  const response = await fetch(url.toString(), {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch page ${id}: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetches a page by slug
 * @param slug The page slug
 * @param type Optional page type for filtering
 * @returns Promise with the API response
 */
export async function fetchPageBySlug(slug: string, type?: string) {
  const url = new URL(`${API_URL}/pages/`);
  url.searchParams.append('slug', slug);
  
  if (type) {
    url.searchParams.append('type', type);
  }
  
  const response = await fetch(url.toString(), {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch page by slug ${slug}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (data.items.length === 0) {
    throw new Error(`Page not found: ${slug}`);
  }
  
  return data.items[0];
}

/**
 * Fetches images from the Wagtail API
 * @param options Query parameters
 * @returns Promise with the API response
 */
export async function fetchImages(options: {
  limit?: number;
  offset?: number;
} = {}) {
  const url = new URL(`${API_URL}/images/`);
  
  if (options.limit) url.searchParams.append('limit', options.limit.toString());
  if (options.offset) url.searchParams.append('offset', options.offset.toString());
  
  const response = await fetch(url.toString(), {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetches a specific image by ID
 * @param id The image ID
 * @returns Promise with the API response
 */
export async function fetchImageById(id: number) {
  const url = new URL(`${API_URL}/images/${id}/`);
  
  const response = await fetch(url.toString(), {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch image ${id}: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetches documents from the Wagtail API
 * @param options Query parameters
 * @returns Promise with the API response
 */
export async function fetchDocuments(options: {
  limit?: number;
  offset?: number;
} = {}) {
  const url = new URL(`${API_URL}/documents/`);
  
  if (options.limit) url.searchParams.append('limit', options.limit.toString());
  if (options.offset) url.searchParams.append('offset', options.offset.toString());
  
  const response = await fetch(url.toString(), {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetches a specific document by ID
 * @param id The document ID
 * @returns Promise with the API response
 */
export async function fetchDocumentById(id: number) {
  const url = new URL(`${API_URL}/documents/${id}/`);
  
  const response = await fetch(url.toString(), {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch document ${id}: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get a rendition (sized version) of an image
 * @param id The image ID
 * @param rendition The rendition name (e.g., 'width-800', 'fill-400x300')
 * @returns The URL for the image rendition
 */
export function getImageRendition(id: number, rendition: string) {
  return `${API_URL}/images/${id}/renditions/${rendition}/`;
}

/**
 * Search across all content types
 * @param query The search query
 * @param options Additional search options
 * @returns Promise with the API response
 */
export async function search(query: string, options: {
  limit?: number;
  offset?: number;
  type?: string;
} = {}) {
  const url = new URL(`${API_URL}/search/`);
  
  url.searchParams.append('query', query);
  
  if (options.limit) url.searchParams.append('limit', options.limit.toString());
  if (options.offset) url.searchParams.append('offset', options.offset.toString());
  if (options.type) url.searchParams.append('type', options.type);
  
  const response = await fetch(url.toString(), {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }
  
  return response.json();
} 