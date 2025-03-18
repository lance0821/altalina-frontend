<script>
    import { clsx } from 'clsx';
    
    // Component props
    const {
      className = '',
      children = () => null,
      innerChildren = () => null
    } = $props();
  </script>
  
  <!-- ContainerOuter -->
  <div class={clsx('sm:px-8', className)}>
    <div class="mx-auto max-w-7xl lg:px-8">
      {@render children()}
    </div>
  </div>
  
  <!-- Inner container slot is now rendered using the innerChildren function -->
  {@render innerChildren()}