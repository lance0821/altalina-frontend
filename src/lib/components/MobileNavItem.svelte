<script>
    // Props for the nav item
    const { 
      href, 
      closeMenu,
      children = () => null
    } = $props();
  </script>
  
  <li>
    <a {href} class="block py-2" onclick={closeMenu}>
      {@render children()}
    </a>
  </li>