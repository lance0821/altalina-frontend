import type { PageLoad } from './$types';
import type { Homepage, ContentSection } from '$lib/types';

// Fallback data for homepage
const fallbackHomepage: Partial<Homepage> = {
    id: 0,
    title: 'Altalina',
    url: '/',
    page_theme: 'light',
    meta: {
        slug: '/',
        seo_title: 'Altalina - Welcome',
        search_description: 'Welcome to Altalina'
    },
    sections: [],
    primary_nav: []
};

export const load: PageLoad = async ({ fetch }) => {
    try {
        // Fetch homepage data with sections
        const response = await fetch('/api/homepage?include_sections=true');
        
        if (response.ok) {
            const homepage: Homepage = await response.json();
            return { homepage };
        } else {
            console.error(`Failed to fetch homepage data: ${response.status}`);
            return { homepage: fallbackHomepage };
        }
    } catch (error) {
        console.error('Error loading homepage:', error);
        return { homepage: fallbackHomepage };
    }
};