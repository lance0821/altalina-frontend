<script>
    import { onMount } from 'svelte';
    
    // Using Svelte 5 runes for local state
    let mounted = $state(false);
    let theme = $state('light'); // Default theme
    
    onMount(() => {
      try {
        // Initialize the theme from data-theme attribute
        const currentTheme = document.documentElement.getAttribute('data-theme');
        theme = currentTheme === 'dark' ? 'dark' : 'light';
        mounted = true;
        console.log('ThemeToggle mounted successfully, theme:', theme);
      } catch (err) {
        console.error('Error in ThemeToggle mount:', err);
      }
    });
    
    // Derived values using Svelte 5 approach
    let otherTheme = $derived(theme === 'dark' ? 'light' : 'dark');
    
    // Toggle theme function
    function toggleTheme() {
      try {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        // Update component state
        theme = newTheme;
        
        // Apply theme to the document
        document.documentElement.setAttribute('data-theme', newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Save preference to localStorage
        localStorage.setItem('theme', newTheme);
        console.log('Theme toggled to:', newTheme);
      } catch (err) {
        console.error('Error toggling theme:', err);
      }
    }
</script>
  
<button
  type="button"
  aria-label={mounted ? `Switch to ${otherTheme} theme` : 'Toggle theme'}
  class="group rounded-full bg-white/90 px-3 py-2 ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
  onclick={toggleTheme}
>
  <!-- Sun icon for light mode -->
  <svg 
    viewBox="0 0 24 24" 
    stroke-width="1.5" 
    stroke-linecap="round" 
    stroke-linejoin="round" 
    aria-hidden="true" 
    class="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden"
  >
    <path d="M8 12.25A4.25 4.25 0 0 1 12.25 8v0a4.25 4.25 0 0 1 4.25 4.25v0a4.25 4.25 0 0 1-4.25 4.25v0A4.25 4.25 0 0 1 8 12.25v0Z"></path>
    <path d="M12.25 3v1.5M21.5 12.25H20M18.791 18.791l-1.06-1.06M18.791 5.709l-1.06 1.06M12.25 20v1.5M4.5 12.25H3M6.77 6.77 5.709 5.709M6.77 17.73l-1.061 1.061" fill="none"></path>
  </svg>
  
  <!-- Moon icon for dark mode -->
  <svg 
    viewBox="0 0 24 24" 
    aria-hidden="true" 
    class="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:block"
  >
    <path d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C17 7 17 2.75 17 2.75S17 7 21.25 7C17 7 17 11.25 17 11.25S17 7 12.75 7Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
</button>