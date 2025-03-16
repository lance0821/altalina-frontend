    <!-- src/lib/components/TrendingPosts.svelte -->
<script lang="ts">
import type { BlogPost } from '$lib/types/blog';
    
    export let posts: BlogPost[] = [];
  </script>
  
  <div class="flex flex-col">
    <h2 class="mb-6 text-2xl font-bold">Trending</h2>
    
    <div class="flex flex-col gap-6">
      {#each posts.slice(0, 3) as post, i}
        <a href={`/blog/${post.slug}`} class="group flex overflow-hidden rounded-lg bg-surface-200-700-token shadow-md transition-transform hover:-translate-y-1">
          <div class="flex-grow p-4">
            <!-- Meta info -->
            <div class="mb-2 flex items-center justify-between text-xs text-surface-600-300-token">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              {#if post.read_time}
                <span>{post.read_time} min read</span>
              {/if}
            </div>
            
            <!-- Title -->
            <h3 class="font-semibold text-surface-900-50-token group-hover:text-primary-500 line-clamp-2">
              {post.title}
            </h3>
          </div>
          
          {#if post.image && post.image.thumbnail}
            <div class="relative h-24 w-24 shrink-0 overflow-hidden bg-surface-100-800-token">
              <img 
                src={post.image.thumbnail.url} 
                alt={post.title} 
                class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              
              <!-- Category badge if available -->
              {#if post.display_category}
                <span class="absolute left-0 top-0 rounded-br bg-primary-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {post.display_category}
                </span>
              {/if}
            </div>
          {/if}
        </a>
      {/each}
    </div>
  </div>