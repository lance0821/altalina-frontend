<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import ThemeToggle from './ThemeToggle.svelte';
    import MobileNavigation from './MobileNavigation.svelte';
    import Avatar from './Avatar.svelte';
    
    // Using Svelte 5 runes for state
    let isInitial = $state(true);
    
    // Using Svelte 5's $derived syntax
    let currentPath = $derived($page.url.pathname);
    
    // Navigation items
    const navItems = [
        { href: '/about', label: 'About' },
        { href: '/articles', label: 'Articles' },
        { href: '/projects', label: 'Projects' },
        { href: '/speaking', label: 'Speaking' },
        { href: '/uses', label: 'Uses' }
    ];
    
    // Update styles based on scroll position 
    function updateStyles() {
        isInitial = window.scrollY === 0;
    }
    
    // Listen for scroll events and update styles accordingly
    onMount(() => {
        // Run once to set initial styles
        updateStyles();
        
        // Add event listener for scroll
        window.addEventListener('scroll', updateStyles, { passive: true });
        
        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('scroll', updateStyles, { passive: true } as EventListenerOptions);
        };
    });
</script>
  
<header class="pointer-events-none relative z-50 flex flex-none flex-col" style="height:var(--header-height);margin-bottom:var(--header-mb);">
    <div class="top-0 z-10 h-16 pt-6" style="position:var(--header-position);">
        <div class="sm:px-8 top-0 w-full" style="position:var(--header-inner-position);">
            <div class="mx-auto w-full max-w-7xl lg:px-8">
                <div class="relative px-4 sm:px-8 lg:px-12">
                    <div class="mx-auto max-w-2xl lg:max-w-5xl">
                        <div class="relative flex gap-4">
                            <div class="flex flex-1">
                                <div class="h-10 w-10 rounded-full bg-white/90 p-0.5 ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10">
                                    <Avatar />
                                </div>
                            </div>
                            <div class="flex flex-1 justify-end md:justify-center">
                                <MobileNavigation className="pointer-events-auto md:hidden" />
                                <nav class="pointer-events-auto hidden md:block">
                                    <ul class="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                                        {#each navItems as { href, label }}
                                            <li>
                                                <a 
                                                    class="relative block px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400 {currentPath === href ? 'text-teal-500 dark:text-teal-400' : ''}" 
                                                    href={href}
                                                >
                                                    {label}
                                                    {#if currentPath === href}
                                                        <span class="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0"></span>
                                                    {/if}
                                                </a>
                                            </li>
                                        {/each}
                                    </ul>
                                </nav>
                            </div>
                            <div class="flex justify-end md:flex-1">
                                <div class="pointer-events-auto">
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>
