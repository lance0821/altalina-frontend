<!-- src/routes/blog/+page.svelte -->
<script lang="ts">
  import BlogPostCard from "$lib/components/BlogPostCard.svelte";
  import type { BlogPost, BlogIndex } from '$lib/types/blog';
  
  // Data from load function with proper type annotation
  export let data: {
    blogIndex: BlogIndex | null;
    posts: BlogPost[];
    featuredPosts: BlogPost[];
    trendingPosts: BlogPost[];
  };
  
  // Destructure for convenience
  const { blogIndex, posts } = data;
  
  // Debug function to check image data
  function getImageUrl(post: BlogPost): string | undefined {
    // Log the image structure for debugging
    console.log('Post image data:', post.image);
    
    // Try different possible locations of the image URL
    if (post.image?.medium?.url) return post.image.medium.url;
    if (post.image?.thumbnail?.url) return post.image.thumbnail.url;
    if (post.image?.small?.url) return post.image.small.url;
    if (post.image?.large?.url) return post.image.large.url;
    
    // If the image is a string (direct URL)
    if (typeof post.image === 'string') return post.image;
    
    // Fallback
    return undefined;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-4xl mx-auto">
    {#if blogIndex}
      <h1 class="text-3xl md:text-4xl font-bold mb-6">{blogIndex.title}</h1>
      {#if blogIndex.intro}
        <div class="text-xl text-surface-600 dark:text-surface-300 mb-12">
          {@html blogIndex.intro}
        </div>
      {:else}
        <p class="text-xl text-surface-600 dark:text-surface-300 mb-12">
          The latest articles and tutorials on web development, design, and technology.
        </p>
      {/if}
    {:else}
      <h1 class="text-3xl md:text-4xl font-bold mb-6">Blog</h1>
      <p class="text-xl text-surface-600 dark:text-surface-300 mb-12">
        The latest articles and tutorials on web development, design, and technology.
      </p>
    {/if}
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {#if posts && posts.length > 0}
      {#each posts as post}
        <BlogPostCard 
          title={post.title}
          excerpt={post.intro || ''}
          date={post.date}
          readingTime={post.read_time ? `${post.read_time} min read` : ''}
          slug={post.slug}
          tags={post.tags || []}
          coverImage={getImageUrl(post)}
        />
      {/each}
    {:else}
      <div class="col-span-3 py-12 text-center">
        <p class="text-xl text-surface-600 dark:text-surface-300">
          No blog posts found. Check back soon!
        </p>
      </div>
    {/if}
  </div>
</div>