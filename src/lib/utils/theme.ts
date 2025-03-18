// src/lib/utils/theme.ts

// Check if we're running in the browser
const isBrowser = typeof window !== 'undefined';

// Types for theme management
type Theme = 'light' | 'dark';
type SkeletonTheme = 'cerberus'; // Add more theme names as needed

// Get stored theme preference
export function getStoredTheme(): Theme {
  if (!isBrowser) return 'light';
  return localStorage.getItem('theme') as Theme || 'light';
}

// Get system preference
export function getSystemPreference(): Theme {
  if (!isBrowser) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme to document
export function applyTheme(theme: Theme, skeletonTheme: SkeletonTheme = 'cerberus'): void {
  if (!isBrowser) return;
  
  // Set data-theme attribute for Skeleton UI
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : skeletonTheme);
  
  // Set dark class for Tailwind dark mode
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Store preference
  localStorage.setItem('theme', theme);
}

// Toggle theme
export function toggleTheme(currentTheme: Theme): Theme {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  return newTheme;
}

// Initialize theme - call this once during app initialization
export function initializeTheme(): Theme {
  if (!isBrowser) return 'light';
  
  // Check for stored preference
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  
  // Determine theme
  const theme = storedTheme || getSystemPreference();
  
  // Apply it
  applyTheme(theme);
  
  return theme;
}