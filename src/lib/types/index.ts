// Navbar types
export interface MenuItem {
    id: number;
    label: string;
    url: string;
    is_external: boolean;
}

export interface Navbar {
    id: number;
    name: string;
    menu_items: MenuItem[];
}

// Homepage types
export interface Button {
    text: string;
    link: string;
    style: string;
}

export interface HeroContent {
    type: string;
    id: string;
    value: string | Button[];
}

export interface ImageObject {
    url: string;
    width: number;
    height: number;
    alt: string;
    rendition_url: string;
}

export interface TwoColumnHero {
    type: string;
    id: string;
    rendered: {
        background_color: string;
        left_column: HeroContent[];
        right_column_image: ImageObject | null;
    };
}

export interface ContentSection {
    type: string;
    id: string;
    rendered: any; // Generic rendered content, will vary by section type
}

export interface Homepage {
    id: number;
    title: string;
    url: string;
    page_theme: string;
    meta: {
        slug: string;
        seo_title: string;
        search_description: string;
    };
    sections?: ContentSection[];
    primary_nav: MenuItem[];
} 