<!-- ExampleCard.svelte -->
<script>
  // Define props with default values
  const { message = 'Hello Storybook!', subtext = 'This is a test component for Storybook' } = $props();
</script>

<div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{message}</h1>
  <p class="mt-2 text-gray-600 dark:text-gray-300">{subtext}</p>
</div> 