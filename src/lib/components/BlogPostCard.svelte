<!-- src/lib/components/BlogPostCard.svelte -->
<script lang="ts">
    import type { BlogPost } from '$lib/types/blog';
    
    export let post: BlogPost;
</script>
  
<a href={`/blog/${post.slug}`} class="group flex h-full flex-col overflow-hidden rounded-lg bg-surface-200-700-token shadow-lg transition-transform hover:-translate-y-1">
    {#if post.image && post.image.medium}
      <div class="relative h-48 overflow-hidden bg-surface-100-800-token">
        <img 
          src={post.image.medium.url} 
          alt={post.title} 
          class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" 
        />
        
        <!-- Category badge if available -->
        {#if post.display_category}
          <span class="absolute left-3 top-3 rounded bg-primary-500 px-2 py-1 text-xs font-semibold text-white">
            {post.display_category}
          </span>
        {/if}
      </div>
    {/if}
    
    <div class="flex grow flex-col p-4">
      <!-- Meta info -->
      <div class="mb-2 flex items-center justify-between text-xs text-surface-600-300-token">
        <span>{new Date(post.date).toLocaleDateString()}</span>
        <span>{post.read_time} min read</span>
      </div>
      
      <!-- Title -->
      <h3 class="mb-2 text-lg font-semibold text-surface-900-50-token group-hover:text-primary-500">
        {post.title}
      </h3>
      
      <!-- Intro text -->
      <p class="mb-4 text-surface-700-200-token line-clamp-3">
        {post.intro}
      </p>
      
      <!-- Author if available -->
      {#if post.author}
        <div class="mt-auto pt-2 text-sm text-surface-600-300-token">
          By {post.author}
        </div>
      {/if}
    </div>
  </a>