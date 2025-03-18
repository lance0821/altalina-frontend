<script>
  // Component props
  const { 
    large = false, 
    className = '',
    style = ''
  } = $props();
</script>

<a
  href="/"
  class={`block ${large ? 'h-16 w-16' : 'h-9 w-9'} rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10 ${className}`}
  style={style}
  aria-label="Home"
>
  <img
    src="https://placehold.co/400x400/2dd4bf/ffffff?text=S"
    alt=""
    sizes={large ? "4rem" : "2.25rem"}
    class="rounded-full bg-zinc-100 object-cover dark:bg-zinc-800 h-full w-full"
    style="color: transparent;"
  />
</a> 