#!/bin/bash

# Check if component name is provided
if [ -z "$1" ]; then
  echo "Error: Please provide a component name"
  echo "Usage: ./create_component.sh ComponentName"
  exit 1
fi

# Set component name
COMPONENT_NAME=$1
COMPONENT_DIR="src/lib/components/$COMPONENT_NAME"

# Check if component already exists
if [ -d "$COMPONENT_DIR" ]; then
  echo "Error: Component $COMPONENT_NAME already exists"
  exit 1
fi

# Create component directory
echo "Creating component directory: $COMPONENT_DIR"
mkdir -p "$COMPONENT_DIR"

# Create component file
echo "Creating component file: $COMPONENT_DIR/$COMPONENT_NAME.svelte"
cat > "$COMPONENT_DIR/$COMPONENT_NAME.svelte" << EOF
<script lang="ts">
  // Props and component logic
</script>

<div class="$COMPONENT_NAME">
  <!-- Component markup -->
</div>

<style>
  /* Component styles (if using scoped styles) */
</style>
EOF

# Create story file
echo "Creating story file: $COMPONENT_DIR/$COMPONENT_NAME.stories.ts"
cat > "$COMPONENT_DIR/$COMPONENT_NAME.stories.ts" << EOF
import type { Meta, StoryObj } from '@storybook/svelte';
import $COMPONENT_NAME from './$COMPONENT_NAME.svelte';

const meta: Meta<typeof $COMPONENT_NAME> = {
  title: 'Components/$COMPONENT_NAME',
  component: $COMPONENT_NAME,
  tags: ['autodocs'],
  argTypes: {
    // Define controls for your component props
  },
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof $COMPONENT_NAME>;

export const Default: Story = {
  args: {
    // Default props
  }
};

export const Variation1: Story = {
  args: {
    // Variation props
  }
};
EOF

echo "Component $COMPONENT_NAME created successfully!"
echo "Files:"
echo "- $COMPONENT_DIR/$COMPONENT_NAME.svelte"
echo "- $COMPONENT_DIR/$COMPONENT_NAME.stories.ts" 