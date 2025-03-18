import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, url }) => {
  const includeSections = url.searchParams.get('include_sections') === 'true';
  const apiUrl = includeSections 
    ? 'http://127.0.0.1:8000/api/v2/homepage/?include_sections=true'
    : 'http://127.0.0.1:8000/api/v2/homepage/';
    
  try {
    const response = await fetch(apiUrl);
    
    if(response.ok) {
      const data = await response.json();
      return json(data);
    }
    
    return json({ error: `Failed to fetch homepage data: ${response.status}` }, { status: response.status });
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
    return json({ error: 'Failed to fetch homepage data' }, { status: 500 });
  }
}; 