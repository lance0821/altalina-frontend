// Simple.stories.js
import SimpleText from './SimpleText.svelte';

export default {
  title: 'Example/Simple',
  component: SimpleText,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    text: { control: 'text' }
  }
};

export const BasicText = {
  args: {
    text: 'Hello Storybook'
  }
};

export const LongerText = {
  args: {
    text: 'This is a longer text to demonstrate how the component handles more content.'
  }
}; 