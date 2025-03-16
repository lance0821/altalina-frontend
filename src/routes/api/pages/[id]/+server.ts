import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  try {
    const res = await fetch(`${import.meta.env.VITE_WAGTAIL_URL}/api/v2/pages/${id}`);
    if (res.ok) {
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(
        JSON.stringify({ status: res.status, error: 'Failed to fetch page from Wagtail API' }),
        {
          status: res.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ error: 'Error connecting to Wagtail backend', details: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};