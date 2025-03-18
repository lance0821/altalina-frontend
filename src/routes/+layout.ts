// This file handles static metadata for your SvelteKit site
// It runs both on the server and client

// Using a default empty string in case the env var isn't defined
const PUBLIC_SITE_URL = '';

/** @type {import('./$types').LayoutLoad} */
export function load() {
  return {
    // These are accessible in all pages via data.metadata
    metadata: {
      title: 'Spencer Sharp - Software designer, founder, and amateur astronaut',
      titleTemplate: '%s - Spencer Sharp',
      description: "I'm Spencer, a software designer and entrepreneur based in New York City. I'm the founder and CEO of Planetaria, where we develop technologies that empower regular people to explore space on their own terms.",
      alternates: {
        types: {
          'application/rss+xml': `${PUBLIC_SITE_URL}/feed.xml`
        }
      }
    }
  };
}

// Enable SPA navigation for all routes
export const prerender = false;
export const ssr = true;