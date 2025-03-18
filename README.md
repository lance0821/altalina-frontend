# Altalina Frontend

This is the frontend application for Altalina, built with SvelteKit and Skeleton UI.

## Features

- Modern, responsive UI built with SvelteKit and Tailwind CSS
- Blog functionality with featured and trending posts
- Integration with Wagtail CMS for content management
- Type-safe development with TypeScript
- Server-side rendering (SSR) for improved performance and SEO

## Development

### Prerequisites

- Node.js (version 18 or later)
- npm or pnpm

### Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/altalina-frontend.git
cd altalina-frontend
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
pnpm dev
```

4. Open your browser and visit http://localhost:5173

### Backend Integration

This frontend is designed to work with a Wagtail CMS backend. Make sure your backend is running at the appropriate URL (default: http://127.0.0.1:8000).

### Git Workflow

This project follows a branching workflow:

1. The `main` branch contains stable, production-ready code.
2. The `dev` branch is used for development and integration of features.
3. Feature branches should be created from the `dev` branch.

When working on a new feature:

```bash
# Ensure you're on the dev branch and it's up to date
git checkout dev
git pull origin dev

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit them
git add .
git commit -m "Description of your changes"

# Push your feature branch to GitHub
git push -u origin feature/your-feature-name
```

Once your feature is complete:
1. Create a pull request from your feature branch to the `dev` branch
2. After review and testing, merge the PR into `dev`
3. Periodically, create a PR from `dev` to `main` to release stable changes to production

## Building for Production

```bash
npm run build
# or
pnpm build
```

## Storybook

This project includes Storybook for component development and documentation. Storybook provides a sandbox to build UI components in isolation, making it easier to develop and test components without running the entire application.

### Features of the Storybook Setup

- **Theme Switching**: Test components across all Skeleton UI themes using the theme selector in the toolbar
- **Responsive Testing**: Use the viewport addon to test components at different screen sizes
- **Accessibility Testing**: Check components for accessibility issues with the a11y addon
- **Component Documentation**: Auto-generated component documentation from JSDoc comments and stories

### Running Storybook

To start Storybook:

```bash
npm run storybook
```

This will launch Storybook on http://localhost:6006 (by default).

### Building Storybook

To build a static version of Storybook:

```bash
npm run build-storybook
```

The build output will be in the `storybook-static` directory.

### Creating Stories

To create a story for a component:

1. Create a `.stories.ts` file next to your component or in a subdirectory
2. Export a default object with metadata and component reference
3. Export named constants representing each story variant

Example:

```typescript
import MyComponent from './MyComponent.svelte';

export default {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    // component props here
  }
};

export const Variant = {
  args: {
    // different props for a variant
  }
};
```

## License

MIT
