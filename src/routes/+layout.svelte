<script lang="ts">
	import '../app.css'; // Your TailwindCSS styles
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';

	// Set server/client flag - IMPORTANT: must be set before any conditional rendering
	const isBrowser = typeof window !== 'undefined';
	console.log(`+layout.svelte is running on ${isBrowser ? 'client' : 'server'}`);
	
	// Initialize app state with safe defaults
	let isDarkMode = false;
	let hydrated = false;

	// Capture unhandled errors
	if (isBrowser) {
		// Capture any unhandled errors that might cause the UI to disappear
		window.addEventListener('error', (event) => {
			console.error('GLOBAL ERROR CAUGHT:', event.error);
		});
		
		// Also capture unhandled promise rejections
		window.addEventListener('unhandledrejection', (event) => {
			console.error('UNHANDLED PROMISE REJECTION:', event.reason);
		});
	}

	// Only run client-side code in onMount - this is crucial for hydration
	onMount(() => {
	  try {
		// Mark as hydrated first thing
		hydrated = true;
		console.log('Root layout hydrated on client');
		
		// Theme logic - only runs on client
		const savedTheme = localStorage.getItem('theme');
		
		if (savedTheme) {
			document.documentElement.setAttribute('data-theme', savedTheme);
			isDarkMode = savedTheme === 'dark';
		} else {
			// Check system preference
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
			isDarkMode = prefersDark;
		}
		
		// Apply dark mode class
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		
		// Monitor hydration errors
		const originalConsoleError = console.error;
		console.error = function(...args) {
			if (args[0]?.includes?.('hydration')) {
				console.log('HYDRATION ERROR DETECTED:', args);
			}
			return originalConsoleError.apply(this, args);
		};
		
		// Debug HTML structure
		console.log('Layout structure:', document.body.innerHTML.substring(0, 500) + '...');
		
		// Log that we finished mounting without errors
		console.log('onMount completed successfully');
	  } catch (err) {
		console.error('ERROR IN LAYOUT MOUNT:', err);
	  }
	});
</script>

<svelte:head>
	<title>Spencer Sharp - Software designer, founder, and amateur astronaut</title>
	<meta name="description" content="Software designer, founder, and amateur astronaut." />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="color-scheme" content="dark light" />
	<link rel="alternate" type="application/rss+xml" href="https://spotlight.tailwindui.com/feed.xml" />
	<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
</svelte:head>

<!-- Fixed background -->
<div class="fixed inset-0 flex justify-center sm:px-8">
	<div class="flex w-full max-w-7xl lg:px-8">
		<div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20"></div>
	</div>
</div>

<!-- Content that sits on top of the background -->
<div class="relative">
	<Header />
	<main class="flex-auto">
		<slot />
	</main>
	<Footer />
</div>

<!-- Debug button -->
{#if isBrowser && hydrated && import.meta.env.DEV}
	<div data-debug-controls>
		<button 
			style="position: fixed; bottom: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; 
				padding: 8px 12px; border-radius: 4px; font-size: 12px; z-index: 9999; border: none; cursor: pointer;"
			onclick={() => {
				console.log('DEBUG: Hydration state:', { 
					hydrated, 
					isDarkMode,
					mainHTML: document.querySelector('main')?.innerHTML.substring(0, 500) + '...' 
				});
			}}
		>
			Debug
		</button>
	</div>
{/if}