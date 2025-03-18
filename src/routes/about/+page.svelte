<script>
    import Head from '$lib/components/Head.svelte';
  
    /** @type {import('./$types').PageData} */
    export let data;
  
    // Access metadata from layout.js file
    const { metadata } = data;
    
    // Page-specific metadata
    const pageTitle = 'About';
    const pageDescription = 'Learn more about Spencer Sharp and his work.';
  </script>
  
  <Head 
    title={pageTitle}
    description={pageDescription}
    metadata={metadata}
  />
  
  <!-- About page content goes here -->
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold">About</h1>
    <!-- More content -->
  </div>