import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
  // Fetch menu data from your Wagtail admin during SSR
  const response = await fetch('http://127.0.0.1:8000/api/v2/navbar/?name=Main%20Navigation');

  if(response.ok) {
    const data = await response.json();
    return json(data);
  }

  console.error('Failed to fetch navbar data');
  
  // Fallback if no menu is found
  return json({ name: 'Navigation', menu_items: [] });
};