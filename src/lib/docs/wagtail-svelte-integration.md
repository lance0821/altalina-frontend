# Wagtail API Integration with SvelteKit

This documentation provides a comprehensive guide on connecting to a Wagtail CMS API endpoint, loading data, and rendering it in Svelte components. It covers the entire flow from initial API setup to UI rendering with best practices.

## Table of Contents
1. [Wagtail API Overview](#wagtail-api-overview)
2. [Setting Up the API Client](#setting-up-the-api-client)
3. [Creating API Endpoints in SvelteKit](#creating-api-endpoints-in-sveltekit)
4. [Loading Data in Svelte Components](#loading-data-in-svelte-components)
5. [Rendering Wagtail Content](#rendering-wagtail-content)
6. [Handling Specific Content Types](#handling-specific-content-types)
7. [Performance Optimization](#performance-optimization)
8. [Error Handling](#error-handling)
9. [Complete Examples](#complete-examples)

## Wagtail API Overview

Wagtail provides a powerful REST API that exposes content as JSON data. The API follows a predictable structure:

- `/api/v2/pages/` - Lists all pages
- `/api/v2/pages/{id}/` - Gets a specific page by ID
- `/api/v2/pages/?type=blog.BlogPage` - Filters pages by type
- `/api/v2/pages/?fields=title,body` - Selects specific fields
- `/api/v2/images/` - Lists all images
- `/api/v2/documents/` - Lists all documents

## Setting Up the API Client

Create a dedicated API client module to centralize all Wagtail API calls:

```typescript
// src/lib/api/wagtail.ts

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
```

## Creating API Endpoints in SvelteKit

Create SvelteKit server endpoints to proxy Wagtail API requests. This approach provides several benefits:

1. Keeps API keys secure on the server
2. Enables server-side caching
3. Allows for data transformation before sending to the client
4. Simplifies client-side code

### Pages Endpoint

```typescript
// src/routes/api/pages/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
  try {
    // Forward query parameters from the request
    const wagtailUrl = new URL(`${import.meta.env.VITE_WAGTAIL_URL}/api/v2/pages`);
    
    // Copy all search parameters
    url.searchParams.forEach((value, key) => {
      wagtailUrl.searchParams.append(key, value);
    });
    
    const res = await fetch(wagtailUrl.toString());
    
    if (!res.ok) {
      return json(
        { error: 'Failed to fetch data from Wagtail API' },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    
    // Optional: Transform data here if needed
    
    return json(data);
  } catch (error) {
    console.error('Error connecting to Wagtail backend:', error);
    return json(
      { error: 'Error connecting to Wagtail backend', details: error.message },
      { status: 500 }
    );
  }
};
```

### Single Page Endpoint

```typescript
// src/routes/api/pages/[id]/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, fetch }) => {
  const { id } = params;
  try {
    const res = await fetch(`${import.meta.env.VITE_WAGTAIL_URL}/api/v2/pages/${id}`);
    
    if (!res.ok) {
      return json(
        { error: `Failed to fetch page ${id} from Wagtail API` },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    return json(data);
  } catch (error) {
    console.error(`Error fetching page ${id}:`, error);
    return json(
      { error: 'Error connecting to Wagtail backend', details: error.message },
      { status: 500 }
    );
  }
};
```

## Loading Data in Svelte Components

### In Page Components with Server Load Functions

For the best performance, load data server-side using SvelteKit's `load` function:

```typescript
// src/routes/pages/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  try {
    // Use our API endpoint to fetch the data
    const response = await fetch(`/api/pages?slug=${params.slug}`);
    const data = await response.json();
    
    if (!response.ok || data.items.length === 0) {
      throw error(404, 'Page not found');
    }
    
    return {
      page: data.items[0]
    };
  } catch (err) {
    // Let SvelteKit handle the error
    console.error('Error loading page:', err);
    throw error(500, 'Failed to load page');
  }
};
```

### Client-Side Data Loading

For dynamic content that should be loaded in the browser:

```svelte
<!-- src/routes/dynamic-content/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  let pageData: any = null;
  let loading = true;
  let error: string | null = null;
  
  // Load data when component mounts
  onMount(async () => {
    try {
      const response = await fetch('/api/pages?type=app.DynamicPage');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      pageData = data.items;
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  });
</script>

<!-- Loading state -->
{#if loading}
  <div class="loading-spinner">Loading...</div>
{:else if error}
  <div class="error-message">Failed to load content: {error}</div>
{:else}
  <!-- Render content -->
  <div class="dynamic-content">
    {#each pageData as page}
      <article>
        <h2>{page.title}</h2>
        {#if page.body}
          <div class="content">
            {@html page.body}
          </div>
        {/if}
      </article>
    {/each}
  </div>
{/if}
```

## Rendering Wagtail Content

### Basic Page Content

```svelte
<!-- src/routes/pages/[slug]/+page.svelte -->
<script lang="ts">
  // Data comes from the server load function
  export let data;
  
  // Destructure the page data
  const { page } = data;
</script>

<svelte:head>
  <title>{page.title} | Your Site Name</title>
  <meta name="description" content={page.meta.seo_text || page.title} />
</svelte:head>

<article class="page-content">
  <h1>{page.title}</h1>
  
  {#if page.hero_image}
    <div class="hero-image">
      <img 
        src={page.hero_image.url} 
        alt={page.hero_image.alt} 
        width={page.hero_image.width}
        height={page.hero_image.height}
      />
    </div>
  {/if}
  
  {#if page.body}
    <div class="rich-text-content">
      {@html page.body}
    </div>
  {/if}
</article>
```

### Creating Reusable Components for Streamfield Blocks

Wagtail's StreamField blocks can be rendered as components:

```svelte
<!-- src/lib/components/StreamField.svelte -->
<script lang="ts">
  import ImageBlock from './blocks/ImageBlock.svelte';
  import QuoteBlock from './blocks/QuoteBlock.svelte';
  import RichTextBlock from './blocks/RichTextBlock.svelte';
  import CTABlock from './blocks/CTABlock.svelte';
  
  // Map of block types to components
  const blockComponents = {
    'image': ImageBlock,
    'quote': QuoteBlock,
    'rich_text': RichTextBlock,
    'call_to_action': CTABlock
  };
  
  // Accept blocks array from Wagtail
  export let blocks: Array<{
    type: string;
    value: any;
    id: string;
  }>;
</script>

{#if blocks && blocks.length > 0}
  <div class="stream-field">
    {#each blocks as block (block.id)}
      <div class="stream-block" data-block-type={block.type}>
        {#if blockComponents[block.type]}
          <svelte:component this={blockComponents[block.type]} value={block.value} />
        {:else}
          <!-- Fallback for unknown block types -->
          <div class="unknown-block">
            <p>Unknown block type: {block.type}</p>
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}
```

Example of a block component:

```svelte
<!-- src/lib/components/blocks/ImageBlock.svelte -->
<script lang="ts">
  export let value: {
    image: number;
    caption: string;
    alt_text: string;
    alignment: 'left' | 'center' | 'right';
    width: number;
  };
  
  // Format alignment class
  $: alignmentClass = `align-${value.alignment || 'center'}`;
</script>

<figure class="image-block {alignmentClass}">
  {#if value.image}
    <img 
      src={`/api/images/${value.image}/`} 
      alt={value.alt_text || value.caption}
      width={value.width}
      loading="lazy"
    />
  {/if}
  
  {#if value.caption}
    <figcaption>{value.caption}</figcaption>
  {/if}
</figure>

<style>
  .image-block {
    margin: 2rem 0;
  }
  
  .align-left {
    float: left;
    margin-right: 2rem;
    margin-bottom: 1rem;
  }
  
  .align-right {
    float: right;
    margin-left: 2rem;
    margin-bottom: 1rem;
  }
  
  .align-center {
    text-align: center;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  figcaption {
    font-size: 0.9rem;
    font-style: italic;
    margin-top: 0.5rem;
  }
</style>
```

## Handling Specific Content Types

### Blog Posts Listing

```svelte
<!-- src/routes/blog/+page.svelte -->
<script lang="ts">
  export let data;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
</script>

<svelte:head>
  <title>Blog | Your Site Name</title>
</svelte:head>

<section class="blog-listing">
  <h1>Blog Posts</h1>
  
  {#if data.posts.length > 0}
    <div class="post-grid">
      {#each data.posts as post}
        <article class="post-card">
          {#if post.featured_image}
            <div class="post-image">
              <a href="/blog/{post.meta.slug}">
                <img 
                  src={post.featured_image.url} 
                  alt={post.featured_image.alt || post.title}
                  width="400"
                  height="225"
                  loading="lazy"
                />
              </a>
            </div>
          {/if}
          
          <div class="post-content">
            <h2>
              <a href="/blog/{post.meta.slug}">{post.title}</a>
            </h2>
            
            <div class="post-meta">
              <time datetime={post.first_published_at}>
                {formatDate(post.first_published_at)}
              </time>
              
              {#if post.author}
                <span class="author">by {post.author.name}</span>
              {/if}
            </div>
            
            {#if post.excerpt}
              <p class="excerpt">{post.excerpt}</p>
            {/if}
            
            <a href="/blog/{post.meta.slug}" class="read-more">
              Read more
            </a>
          </div>
        </article>
      {/each}
    </div>
    
    <!-- Pagination controls -->
    {#if data.pagination}
      <div class="pagination">
        {#if data.pagination.previous}
          <a href="/blog?page={data.pagination.previous}" class="previous">
            Previous
          </a>
        {/if}
        
        <span class="page-info">
          Page {data.pagination.current} of {data.pagination.total}
        </span>
        
        {#if data.pagination.next}
          <a href="/blog?page={data.pagination.next}" class="next">
            Next
          </a>
        {/if}
      </div>
    {/if}
  {:else}
    <p>No posts found.</p>
  {/if}
</section>
```

With the corresponding server load function:

```typescript
// src/routes/blog/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
  // Get page number from query parameter
  const page = Number(url.searchParams.get('page') || '1');
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  
  // Fetch blog posts
  const response = await fetch(`/api/pages?type=blog.BlogPage&limit=${pageSize}&offset=${offset}&order=-first_published_at&fields=title,excerpt,featured_image,first_published_at,author`);
  
  if (!response.ok) {
    throw new Error('Failed to load blog posts');
  }
  
  const data = await response.json();
  
  // Calculate pagination info
  const totalPages = Math.ceil(data.meta.total_count / pageSize);
  
  return {
    posts: data.items,
    pagination: {
      current: page,
      total: totalPages,
      previous: page > 1 ? page - 1 : null,
      next: page < totalPages ? page + 1 : null
    }
  };
};
```

## Performance Optimization

### Client-Side Caching

Use a simple store to cache API responses:

```typescript
// src/lib/stores/apiCache.ts
import { writable } from 'svelte/store';

interface CacheEntry {
  data: any;
  timestamp: number;
  expiry: number; // Time in milliseconds
}

// Create a store for the cache
const createApiCache = () => {
  const { subscribe, update, set } = writable<Record<string, CacheEntry>>({});
  
  return {
    subscribe,
    set: (key: string, data: any, expiry = 5 * 60 * 1000) => {
      update(cache => {
        cache[key] = {
          data,
          timestamp: Date.now(),
          expiry
        };
        return cache;
      });
    },
    get: (key: string): any | null => {
      let result = null;
      
      update(cache => {
        const entry = cache[key];
        
        if (entry && Date.now() - entry.timestamp < entry.expiry) {
          result = entry.data;
        } else if (entry) {
          // Remove expired entry
          delete cache[key];
        }
        
        return cache;
      });
      
      return result;
    },
    clear: () => set({})
  };
};

export const apiCache = createApiCache();
```

Use the cache in your API client:

```typescript
// Modified fetchPages function with caching
export async function fetchPages(options = {}) {
  const url = new URL(`${API_URL}/pages/`);
  // Add query parameters as before...
  
  const cacheKey = url.toString();
  
  // Check for cached data
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // No cache hit, fetch from API
  const response = await fetch(url.toString(), {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Cache the result (5 minutes expiry)
  apiCache.set(cacheKey, data);
  
  return data;
}
```

### Server-Side Caching in SvelteKit Endpoints

```typescript
// src/routes/api/pages/+server.ts (modified with caching)
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

// Simple in-memory cache
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const GET: RequestHandler = async ({ url, fetch, request }) => {
  try {
    // Create a cache key from the URL
    const cacheKey = url.toString();
    
    // Check for refresh header
    const skipCache = request.headers.get('x-refresh-cache') === 'true';
    
    // Check if we have a valid cache entry
    if (!skipCache && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      
      if (Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return json(cached.data);
      }
      
      // Cache expired, remove it
      cache.delete(cacheKey);
    }
    
    // Proceed with the API call as normal
    const wagtailUrl = new URL(`${import.meta.env.VITE_WAGTAIL_URL}/api/v2/pages`);
    
    // Copy all search parameters
    url.searchParams.forEach((value, key) => {
      wagtailUrl.searchParams.append(key, value);
    });
    
    const res = await fetch(wagtailUrl.toString());
    
    if (!res.ok) {
      return json(
        { error: 'Failed to fetch data from Wagtail API' },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    
    // Cache the response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return json(data);
  } catch (error) {
    console.error('Error connecting to Wagtail backend:', error);
    return json(
      { error: 'Error connecting to Wagtail backend', details: error.message },
      { status: 500 }
    );
  }
};
```

## Error Handling

### Creating a Reusable Error Boundary Component

```svelte
<!-- src/lib/components/ErrorBoundary.svelte -->
<script lang="ts">
  import { onError } from 'svelte';
  
  export let fallback: any = null;
  
  let error: Error | null = null;
  
  // Handle errors in child components
  onError((e) => {
    error = e;
    console.error('Caught in error boundary:', e);
  });
</script>

{#if error}
  {#if fallback}
    <svelte:component this={fallback} {error} />
  {:else}
    <div class="error-boundary">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button on:click={() => window.location.reload()}>
        Refresh the page
      </button>
    </div>
  {/if}
{:else}
  <slot />
{/if}
```

Using the error boundary:

```svelte
<ErrorBoundary>
  <WagtailContent data={pageData} />
</ErrorBoundary>
```

## Complete Examples

### Full Blog Post Page with Comments

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import StreamField from '$lib/components/StreamField.svelte';
  import RelatedPosts from '$lib/components/RelatedPosts.svelte';
  import Comments from '$lib/components/Comments.svelte';
  import ShareButtons from '$lib/components/ShareButtons.svelte';
  
  export let data;
  
  const { post } = data;
  
  // Format the publication date
  const formattedDate = new Date(post.first_published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Set up structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'image': post.featured_image ? post.featured_image.url : null,
    'datePublished': post.first_published_at,
    'dateModified': post.last_published_at || post.first_published_at,
    'author': {
      '@type': 'Person',
      'name': post.author ? post.author.name : 'Admin'
    }
  };
</script>

<svelte:head>
  <title>{post.title} | Blog | Your Site Name</title>
  <meta name="description" content={post.meta.search_description || post.excerpt} />
  
  <!-- Open Graph tags for social sharing -->
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.excerpt} />
  {#if post.featured_image}
    <meta property="og:image" content={post.featured_image.url} />
  {/if}
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`https://yourdomain.com/blog/${post.meta.slug}`} />
  
  <!-- Structured data for SEO -->
  <script type="application/ld+json">
    {JSON.stringify(structuredData)}
  </script>
</svelte:head>

<article class="blog-post">
  <header class="post-header">
    <h1>{post.title}</h1>
    
    <div class="post-meta">
      <time datetime={post.first_published_at}>{formattedDate}</time>
      
      {#if post.author}
        <span class="author">
          by {post.author.name}
        </span>
      {/if}
      
      {#if post.categories && post.categories.length > 0}
        <div class="categories">
          {#each post.categories as category, i}
            <a href="/blog?category={category.slug}" class="category">
              {category.name}
            </a>
            {#if i < post.categories.length - 1},{/if}
          {/each}
        </div>
      {/if}
    </div>
  </header>
  
  {#if post.featured_image}
    <div class="featured-image">
      <img 
        src={post.featured_image.url} 
        alt={post.featured_image.alt || post.title}
        width={post.featured_image.width}
        height={post.featured_image.height}
      />
      {#if post.featured_image.caption}
        <figcaption>{post.featured_image.caption}</figcaption>
      {/if}
    </div>
  {/if}
  
  {#if post.body_blocks}
    <div class="post-content">
      <StreamField blocks={post.body_blocks} />
    </div>
  {:else if post.body}
    <div class="post-content rich-text">
      {@html post.body}
    </div>
  {/if}
  
  {#if post.tags && post.tags.length > 0}
    <div class="post-tags">
      <h3>Tags:</h3>
      <ul>
        {#each post.tags as tag}
          <li>
            <a href="/blog?tag={tag}">{tag}</a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  
  <ShareButtons 
    url={`https://yourdomain.com/blog/${post.meta.slug}`}
    title={post.title}
  />
  
  {#if data.relatedPosts && data.relatedPosts.length > 0}
    <RelatedPosts posts={data.relatedPosts} />
  {/if}
  
  <Comments postId={post.id} />
</article>
```

With its server load function:

```typescript
// src/routes/blog/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  try {
    // Fetch the blog post
    const response = await fetch(`/api/pages?type=blog.BlogPage&slug=${params.slug}&fields=*`);
    const data = await response.json();
    
    if (!response.ok || data.items.length === 0) {
      throw error(404, 'Blog post not found');
    }
    
    const post = data.items[0];
    
    // Fetch related posts based on tags or categories
    let relatedPosts = [];
    
    if (post.tags && post.tags.length > 0) {
      const tagsQuery = post.tags.join(',');
      const relatedResponse = await fetch(
        `/api/pages?type=blog.BlogPage&tags=${tagsQuery}&limit=3&exclude_ids=${post.id}`
      );
      
      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        relatedPosts = relatedData.items;
      }
    }
    
    return {
      post,
      relatedPosts
    };
  } catch (err) {
    console.error('Error loading blog post:', err);
    throw error(500, 'Failed to load blog post');
  }
};
```

This documentation provides a comprehensive guide to integrating Wagtail CMS with a SvelteKit frontend, covering the entire flow from API connection to UI rendering. You can extend and adapt these patterns to match your specific project requirements. 