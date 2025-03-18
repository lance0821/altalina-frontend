<script>
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { clickOutside } from '$lib/actions/clickOutside';
    import { page } from '$app/stores';
    
    // Using Svelte 5 runes for state
    let isOpen = $state(false);
    
    // Function to toggle the mobile menu
    function toggleMenu() {
      try {
        isOpen = !isOpen;
        console.log('Mobile menu toggled:', isOpen ? 'open' : 'closed');
      } catch (err) {
        console.error('Error toggling mobile menu:', err);
      }
    }
    
    // Function to close the mobile menu
    function closeMenu() {
      try {
        isOpen = false;
        console.log('Mobile menu closed');
      } catch (err) {
        console.error('Error closing mobile menu:', err);
      }
    }
    
    // Navigation items
    const navItems = [
        { href: '/about', label: 'About' },
        { href: '/articles', label: 'Articles' },
        { href: '/projects', label: 'Projects' },
        { href: '/speaking', label: 'Speaking' },
        { href: '/uses', label: 'Uses' }
    ];
    
    // Current URL for active navigation
    let currentPath = $derived($page.url.pathname);
    
    // Component props
    const { className = '' } = $props();
</script>
  
<!-- Clickoutside action for closing the menu when clicking outside -->
<div class={className} use:clickOutside={() => closeMenu()} data-headlessui-state="">
  <!-- Mobile menu button -->
  <button 
    class="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20"
    type="button"
    aria-expanded={isOpen}
    data-headlessui-state=""
    id="headlessui-popover-button-:Rbmiqja:"
    onclick={toggleMenu}
  >
    Menu
    <svg viewBox="0 0 8 6" aria-hidden="true" class="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400">
      <path d="M1.75 1.75 4 4.25l2.25-2.5" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  </button>
  
  <!-- Hidden div for accessibility -->
  <div hidden style="position:fixed;top:1px;left:1px;width:1px;height:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0;display:none"></div>
  
  <!-- Mobile menu panel -->
  {#if isOpen}
    <div
      class="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800"
      transition:slide={{ duration: 150, easing: quintOut }}
    >
      <div class="flex flex-row-reverse items-center justify-between">
        <button 
          aria-label="Close menu" 
          class="-m-1 p-1"
          onclick={closeMenu}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6 text-zinc-500 dark:text-zinc-400">
            <path d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
        <h2 class="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Navigation
        </h2>
      </div>
      <nav class="mt-6">
        <ul class="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
          {#each navItems as { href, label }}
            <li>
              <a 
                href={href} 
                class="block py-2 transition hover:text-teal-500 dark:hover:text-teal-400 {currentPath === href ? 'text-teal-500 dark:text-teal-400' : ''}"
                onclick={closeMenu}
              >
                {label}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    </div>
  {/if}
</div>