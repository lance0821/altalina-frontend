<!-- SimpleText.svelte -->
<script>
  const { text = 'Hello Storybook' } = $props();
</script>

<div class="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
  {text}
</div> 