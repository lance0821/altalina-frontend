// TestExample.stories.js
import ExampleCard from './ExampleCard.svelte';

export default {
  title: 'Test/ExampleCard',
  component: ExampleCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    message: { control: 'text' },
    subtext: { control: 'text' },
  },
};

export const Default = {
  args: {
    message: 'Hello Storybook!',
    subtext: 'This is a test component for Storybook',
  },
}; 