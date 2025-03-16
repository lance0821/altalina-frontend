<!-- src/routes/blog/+page.svelte -->
<script lang="ts">
  import HeroSection from '$lib/components/HeroSection.svelte';
  import BlogPostCard from '$lib/components/BlogPostCard.svelte';
  import type { BlogPost, BlogIndex } from '$lib/types/blog';
  
  // Data from load function with proper type annotation
  export let data: {
    blogIndex: BlogIndex | null;
    posts: BlogPost[];
    featuredPosts: BlogPost[];
    trendingPosts: BlogPost[];
  };
  
  // Destructure for convenience
  const { blogIndex, featuredPosts, trendingPosts, posts } = data;
</script>

<div class="container mx-auto px-4 py-12">
  <!-- Blog header -->
  <header class="mb-12 text-center">
    {#if blogIndex}
      <h1 class="mb-4 text-4xl font-bold">{blogIndex.title}</h1>
      {#if blogIndex.intro}
        <div class="mx-auto max-w-2xl">{@html blogIndex.intro}</div>
      {/if}
    {/if}
  </header>
  
  <!-- Hero section with featured and trending posts -->
  <HeroSection {featuredPosts} {trendingPosts} />
  
  <!-- Regular blog posts -->
  <section class="mt-16">
    <h2 class="mb-6 text-2xl font-bold">Latest Articles</h2>
    
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {#each posts as post}
        <!-- Don't repeat posts that were already shown as featured or trending -->
        {#if !featuredPosts.some((p: BlogPost) => p.id === post.id) && 
             !trendingPosts.some((p: BlogPost) => p.id === post.id)}
          <BlogPostCard {post} />
        {/if}
      {/each}
    </div>
  </section>
</div>