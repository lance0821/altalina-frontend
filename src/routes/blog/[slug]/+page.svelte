<script lang="ts">
  import type { BlogPost } from '$lib/types/blog';
  
  // The data property is provided by SvelteKit
  export let data: {
    post: BlogPost;
    relatedPosts: BlogPost[];
  };
  
  // Format the publication date
  const formattedDate = new Date(data.post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Set up structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': data.post.title,
    'image': data.post.image?.large?.url || null,
    'datePublished': data.post.date,
    'dateModified': data.post.date,
    'author': {
      '@type': 'Person',
      'name': typeof data.post.author === 'object' ? data.post.author.name : data.post.author || 'Admin'
    }
  };
</script>

<svelte:head>
  <title>{data.post.title} | Blog | Altalina</title>
  <meta name="description" content={data.post.intro || data.post.title} />
  
  <!-- Open Graph tags for social sharing -->
  <meta property="og:title" content={data.post.title} />
  <meta property="og:description" content={data.post.intro || data.post.title} />
  {#if data.post.image?.large}
    <meta property="og:image" content={data.post.image.large.url} />
  {/if}
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`https://your-site.com${data.post.url || `/blog/${data.post.slug}`}`} />
  
  <!-- Structured data for SEO -->
  <script type="application/ld+json">
    {JSON.stringify(structuredData)}
  </script>
</svelte:head>

<article class="max-w-4xl mx-auto px-4 py-12">
  <header class="mb-8">
    <h1 class="text-4xl font-bold mb-4">{data.post.title}</h1>
    
    <div class="flex items-center text-gray-600 mb-6">
      <time datetime={data.post.date} class="text-sm">
        {formattedDate}
      </time>
      
      {#if data.post.author}
        <span class="mx-2">•</span>
        <span class="text-sm">
          by <span class="font-medium">{typeof data.post.author === 'object' ? data.post.author.name : data.post.author}</span>
        </span>
      {/if}
    </div>
    
    <!-- Categories section - we'll hide this if there are no categories in the API response -->
    {#if data.post.categories && data.post.categories.length > 0}
      <div class="flex flex-wrap gap-2 mb-6">
        {#each data.post.categories as category}
          <a href="/blog?category={category.slug}" class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors">
            {category.name}
          </a>
        {/each}
      </div>
    {:else if data.post.display_category}
      <div class="mb-6">
        <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          {data.post.display_category}
        </span>
      </div>
    {/if}
  </header>
  
  {#if data.post.image?.large}
    <figure class="mb-8">
      <img 
        src={data.post.image.large.url} 
        alt={data.post.title}
        width={data.post.image.large.width}
        height={data.post.image.large.height}
        class="w-full h-auto rounded-lg shadow-md object-contain mx-auto"
      />
      {#if data.post.image.caption}
        <figcaption class="mt-2 text-sm text-gray-600 italic text-center">
          {data.post.image.caption}
        </figcaption>
      {/if}
    </figure>
  {/if}
  
  <div class="prose prose-lg max-w-none">
    {@html data.post.body}
  </div>
  
  {#if data.post.tags && data.post.tags.length > 0}
    <div class="mt-8 pt-6 border-t border-gray-200">
      <h3 class="text-lg font-semibold mb-3">Tags:</h3>
      <div class="flex flex-wrap gap-2">
        {#each data.post.tags as tag}
          <a href="/blog?tag={tag}" class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
            #{tag}
          </a>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Social sharing buttons -->
  <div class="mt-8 flex gap-3">
    <a href={`https://twitter.com/intent/tweet?url=https://your-site.com${data.post.url || `/blog/${data.post.slug}`}&text=${encodeURIComponent(data.post.title)}`} 
       target="_blank" 
       rel="noopener noreferrer"
       class="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors">
      Share on Twitter
    </a>
    
    <a href={`https://www.facebook.com/sharer/sharer.php?u=https://your-site.com${data.post.url || `/blog/${data.post.slug}`}`} 
       target="_blank" 
       rel="noopener noreferrer"
       class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
      Share on Facebook
    </a>
    
    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=https://your-site.com${data.post.url || `/blog/${data.post.slug}`}&title=${encodeURIComponent(data.post.title)}`} 
       target="_blank" 
       rel="noopener noreferrer"
       class="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition-colors">
      Share on LinkedIn
    </a>
  </div>
  
  {#if data.relatedPosts && data.relatedPosts.length > 0}
    <div class="mt-12 pt-8 border-t border-gray-200">
      <h2 class="text-2xl font-bold mb-6">Related Posts</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each data.relatedPosts as post}
          <a href={post.url || `/blog/${post.slug}`} class="group">
            <div class="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform group-hover:scale-105">
              {#if post.image?.medium}
                <div class="h-40 overflow-hidden">
                  <img 
                    src={post.image.medium.url} 
                    alt={post.title}
                    class="w-full h-full object-contain bg-surface-100-800-token"
                    loading="lazy"
                  />
                </div>
              {/if}
              
              <div class="p-4">
                <h3 class="font-medium text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                
                {#if post.intro}
                  <p class="text-gray-600 text-sm line-clamp-2">
                    {post.intro}
                  </p>
                {/if}
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</article> 