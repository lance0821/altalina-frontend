/** @type { import('@storybook/svelte').StorybookConfig } */
const config = {
  stories: [
    '../src/stories/**/*.stories.@(js|ts)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-viewport'
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  typescript: {
    reactDocgen: false
  },
  core: {
    disableTelemetry: true
  }
};

export default config; 