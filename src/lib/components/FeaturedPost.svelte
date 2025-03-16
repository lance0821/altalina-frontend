<!-- src/lib/components/FeaturedPost.svelte -->
<script lang="ts">
    import type { BlogPost } from '$lib/types/blog';
    
    export let post: BlogPost;
</script>
  
<a href={`/blog/${post.slug}`} class="featured-post group w-full overflow-hidden rounded-lg bg-surface-200-700-token">
  <div class="relative h-80 overflow-hidden bg-surface-100-800-token">
    {#if post.image && post.image.large}
      <img 
        src={post.image.large.url} 
        alt={post.title} 
        class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
    {/if}
    
    <!-- Category label --> 
    {#if post.display_category}
      <span class="absolute left-4 top-4 rounded bg-primary-500 px-2 py-1 text-xs font-semibold text-white">
        {post.display_category}
      </span>
    {/if}
  </div>
  
  <div class="p-6">
    <!-- Meta info -->
    <div class="mb-2 flex items-center gap-4 text-xs text-surface-600-300-token">
      <span>{new Date(post.date).toLocaleDateString()}</span>
      <span>•</span>
      <span>{post.read_time} min read</span>
    </div>
    
    <!-- Title -->
    <h2 class="mb-3 text-2xl font-bold text-surface-900-50-token group-hover:text-primary-500">
      {post.title}
    </h2>
    
    <!-- Intro text -->
    <p class="text-surface-700-200-token line-clamp-2">
      {post.intro}
    </p>
  </div>
</a>