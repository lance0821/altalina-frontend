<script>
    const { title, description, canonical = undefined, metadata } = $props();
    
    // Format the title using the template if not the default title
    const formattedTitle = $derived(title === metadata.title 
      ? title 
      : metadata.titleTemplate.replace('%s', title));
  </script>
  
  <svelte:head>
    <title>{formattedTitle}</title>
    <meta name="description" content={description} />
    {#if canonical}
      <link rel="canonical" href={canonical} />
    {/if}
  </svelte:head>