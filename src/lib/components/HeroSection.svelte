<!-- src/lib/components/HeroSection.svelte -->
<script lang="ts">
  import FeaturedPost from './FeaturedPost.svelte';
  import TrendingPosts from './TrendingPosts.svelte';
  import type { BlogPost } from '$lib/types/blog';
  
  export let featuredPosts: BlogPost[] = [];
  export let trendingPosts: BlogPost[] = [];
</script>

<section class="mb-16">
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
    <!-- Featured post column -->
    <div class="flex flex-col">
      <h2 class="mb-6 text-2xl font-bold">Featured</h2>
      {#if featuredPosts.length > 0}
        <div class="h-full">
          <FeaturedPost post={featuredPosts[0]} />
        </div>
      {:else}
        <div class="flex h-full items-center justify-center rounded-lg bg-surface-200-700-token p-8">
          <p class="text-surface-600-300-token">No featured posts available</p>
        </div>
      {/if}
    </div>
    
    <!-- Trending posts column -->
    <div class="flex flex-col">
      {#if trendingPosts.length > 0}
        <TrendingPosts posts={trendingPosts} />
      {:else}
        <div>
          <h2 class="mb-6 text-2xl font-bold">Trending</h2>
          <div class="flex h-64 items-center justify-center rounded-lg bg-surface-200-700-token">
            <p class="text-surface-600-300-token">No trending posts available</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section> 