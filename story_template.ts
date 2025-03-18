// Component Story Template
// Copy this to YourComponent/YourComponent.stories.ts and modify as needed

import type { Meta, StoryObj } from '@storybook/svelte';
import YourComponent from './YourComponent.svelte';

// Define the story metadata
const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent', // Change to match your component name
  component: YourComponent,
  tags: ['autodocs'], // Enables automatic documentation generation
  argTypes: {
    // Define controls for your component props
    // Example:
    // propName: {
    //   control: 'text', // or 'boolean', 'select', 'radio', 'number', etc.
    //   description: 'Description of this prop',
    //   defaultValue: 'Default value',
    //   options: ['option1', 'option2'], // For select/radio controls
    // },
  },
  parameters: {
    // Additional story parameters
    layout: 'centered', // or 'fullscreen', 'padded'
    // backgrounds: { default: 'light' }, // If you need custom backgrounds
    // docs: { description: { component: 'Detailed description of the component' } }
  }
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

// Default story - The basic/standard usage of the component
export const Default: Story = {
  args: {
    // Set the default props for your component
    // prop1: 'value1',
    // prop2: true,
  }
};

// Additional stories - Variations of your component
export const Variation1: Story = {
  args: {
    // Different props for this variation
    // ...Default.args, // Extend from default if needed
    // prop1: 'different value',
  }
};

// Add more variations as needed
// export const AnotherVariation: Story = { ... }

// Example of a story with custom render function (for complex scenarios)
/*
export const CustomRender: Story = {
  render: (args) => ({
    Component: YourComponent,
    props: args,
    // You can provide a custom template here if needed
  })
};
*/ 