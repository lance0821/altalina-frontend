<script>
    import NavItem from './NavItem.svelte';
    
    // Component props
    const { className = '' } = $props();
  </script>
  
  <nav class={className}>
    <ul class="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
      <NavItem href="/about" children={() => "About"} />
      <NavItem href="/articles" children={() => "Articles"} />
      <NavItem href="/projects" children={() => "Projects"} />
      <NavItem href="/speaking" children={() => "Speaking"} />
      <NavItem href="/uses" children={() => "Uses"} />
    </ul>
  </nav>