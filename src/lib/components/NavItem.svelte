<script>
    import { page } from '$app/stores';
    import { clsx } from 'clsx';
    
    // Using Svelte 5 runes for props
    const { 
      href,
      children = () => null 
    } = $props();
    
    // Using $derived from Svelte 5 to check if this item is active
    let isActive = $derived($page.url.pathname === href);
  </script>
  
  <li>
    <a
      {href}
      class={clsx(
        'relative block px-3 py-2 transition',
        isActive
          ? 'text-teal-500 dark:text-teal-400'
          : 'hover:text-teal-500 dark:hover:text-teal-400',
      )}
    >
      {@render children()}
      {#if isActive}
        <span class="absolute inset-x-1 -bottom-px h-px bg-linear-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0"></span>
      {/if}
    </a>
  </li>