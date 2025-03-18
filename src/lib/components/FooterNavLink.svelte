<script>
    // Component props
    const { 
      href,
      children = () => null
    } = $props();
  </script>
  
  <a 
    {href}
    class="transition hover:text-teal-500 dark:hover:text-teal-400"
  >
    {@render children()}
  </a>