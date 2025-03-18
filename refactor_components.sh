#!/bin/bash

# Components to refactor
COMPONENTS=(
  "TrendingPosts"
  "ServicesSection"
  "Header"
  "HeroSection"
  "BlogPostCard"
  "FeaturedPost"
  "ContentSection"
)

# Create directories and move components
for component in "${COMPONENTS[@]}"; do
  # Skip if component directory already exists
  if [ -d "src/lib/components/$component" ]; then
    echo "Directory for $component already exists"
    
    # Check if the component is in root and needs to be moved
    if [ -f "src/lib/components/$component.svelte" ]; then
      echo "Moving $component.svelte to its directory"
      mv "src/lib/components/$component.svelte" "src/lib/components/$component/"
    else
      echo "$component.svelte is already in the right place"
    fi
  else
    echo "Creating directory for $component"
    mkdir -p "src/lib/components/$component"
    
    # Move component if it exists in root
    if [ -f "src/lib/components/$component.svelte" ]; then
      echo "Moving $component.svelte to its directory"
      mv "src/lib/components/$component.svelte" "src/lib/components/$component/"
    else
      echo "Warning: $component.svelte not found in root components directory"
    fi
  fi
done

echo "Refactoring completed!" 