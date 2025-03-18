<script>
    import { clsx } from 'clsx';
    
    // Component props
    const {
      className = '',
      children = () => null
    } = $props();
  </script>
  
  <div class={clsx('relative px-4 sm:px-8 lg:px-12', className)}>
    <div class="mx-auto max-w-2xl lg:max-w-5xl">
      {@render children()}
    </div>
  </div>