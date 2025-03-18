<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import { onMount } from 'svelte';
    import { showHydrationDebug, captureElementHTML } from '$lib/utils/hydrationDebug';
    
    // Component props
    const { 
      children = () => null
    } = $props();
    
    // Flag to determine if we're server-side rendering
    const isBrowser = typeof window !== 'undefined';
    
    let isHydrated = $state(false);
    let serverContent = $state('');
    let clientContent = $state('');
    let debugElement: Element | null = $state(null);
    let hydrationErrorDetected = $state(false);
    let childrenType = $state(typeof children);
    
    // Don't attempt to call children() directly - it's meant for Svelte's internal renderer only
    console.log('Layout: children type:', typeof children);
    
    // Store initial server-rendered HTML
    onMount(() => {
      // We've now hydrated on the client
      isHydrated = true;
      console.log('Layout hydrated on client');
      childrenType = typeof children;
      
      // Get debug element
      debugElement = document.querySelector('[data-hydration-debug]');
      
      // Listen for hydration errors
      const originalConsoleError = console.error;
      console.error = function(...args) {
        if (typeof args[0] === 'string' && args[0].includes('hydration')) {
          hydrationErrorDetected = true;
          console.log('[DEBUG] Hydration error detected');
          
          // Capture content for comparison
          setTimeout(() => {
            const mainContent = document.querySelector('main.flex-auto');
            if (mainContent) {
              serverContent = mainContent.getAttribute('data-server-content') || '';
              clientContent = mainContent.innerHTML;
              
              console.log('[DEBUG] Server content:', serverContent.substring(0, 100) + '...');
              console.log('[DEBUG] Client content:', clientContent.substring(0, 100) + '...');
              
              if (serverContent && clientContent && serverContent !== clientContent) {
                // Show visual diff
                showHydrationDebug(serverContent, clientContent);
              }
            }
          }, 100);
        }
        
        return originalConsoleError.apply(console, args);
      };
    });
    
    // Debug handler function for button
    function debugHydration() {
      const mainContent = document.querySelector('main.flex-auto');
      if (mainContent) {
        serverContent = mainContent.getAttribute('data-server-content') || '';
        clientContent = mainContent.innerHTML;
        showHydrationDebug(serverContent, clientContent);
      }
    }
</script>
  
<div class="fixed inset-0 flex justify-center sm:px-8">
  <div class="flex w-full max-w-7xl lg:px-8">
    <div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20"></div>
  </div>
</div>
<div class="relative flex w-full flex-col">
  <Header />
  <!-- IMPORTANT: Do not call children() directly except through the @render tag -->
  <main class="flex-auto" data-hydration-debug>
    <!-- Only use children in @render, let Svelte handle the function call -->
    {#if typeof children === 'function'}
      {@render children()}
    {:else}
      <div class="p-4 text-yellow-500">No content available</div>
    {/if}
  </main>
  <Footer />
</div>

<!-- Add debug button in development mode -->
{#if import.meta.env.DEV && isHydrated}
  <button 
    style="position: fixed; bottom: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 5px; font-size: 12px; z-index: 9999; border: none; cursor: pointer;"
    onclick={debugHydration}
  >
    Debug Hydration
  </button>
{/if}