import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch }) => {
const res = await fetch('/api/pages/3');
if (!res.ok) {
throw error(res.status, 'Failed to load page data');
}
const pageData = await res.json();
console.log(pageData);
return { pageData };
};