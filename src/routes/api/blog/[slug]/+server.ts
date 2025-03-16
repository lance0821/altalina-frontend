// src/routes/api/blog/[slug]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { BlogPost } from '$lib/types/blog';

export const GET: RequestHandler = async ({ params, fetch }) => {
  try {
    // Directly fetch the specific blog post by slug
    const postResponse = await fetch(`http://127.0.0.1:8000/api/v2/blog/slug/${params.slug}/`);
    
    if (!postResponse.ok) {
      return json(
        { error: 'Blog post not found' },
        { status: postResponse.status }
      );
    }
    
    const data = await postResponse.json();
    
    // Also fetch index for related posts
    const indexResponse = await fetch('http://127.0.0.1:8000/api/v2/blog/');
    let relatedPosts: BlogPost[] = [];
    
    if (indexResponse.ok) {
      const indexData = await indexResponse.json();
      // Get other trending posts for related content
      relatedPosts = indexData.trending_posts
        .map((id: number) => indexData.posts[id] as BlogPost)
        .filter((p: BlogPost) => p.id !== data.post.id)
        .slice(0, 3);
    }
    
    return json({
      post: data.post,
      relatedPosts
    });
  } catch (error) {
    console.error(`Error fetching blog post ${params.slug}:`, error);
    return json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
};