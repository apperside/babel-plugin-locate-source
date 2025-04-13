# Debug Source Babel Plugin

This Babel plugin adds source file and line information to JSX elements in your React/Next.js application, making it easier to debug and locate components when inspecting the DOM. It mimics the behavior found in Tamagui, but works with any React or Next.js application.

## What It Does

When enabled, this plugin adds the following HTML attributes to JSX elements in development mode:

- `data-at`: The source file and line numbers (e.g., "Button.tsx:42-45")
- `data-is`: The component name (e.g., "Button")
- `data-in`: The parent component where this JSX appears (e.g., "Header")

## Installation

### Local Installation

1. Clone or copy this plugin directory into your project
2. Install the necessary dependencies:

```bash
npm install --save-dev @babel/core
# or
yarn add --dev @babel/core
```

### For Vite + React Projects

Update your `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Configure Babel with our plugin
      babel: {
        plugins: [
          // Only use the plugin in development mode
          process.env.NODE_ENV !== 'production' && 
            path.resolve(__dirname, './custom-babel-plugin/index.js')
        ].filter(Boolean)
      }
    })
  ],
});
```

Make sure you have `@vitejs/plugin-react` installed, which is typically included by default in Vite React projects:

```bash
npm install --save-dev @vitejs/plugin-react
# or
yarn add --dev @vitejs/plugin-react
```

### For Next.js 12+ Applications

Update your `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    // Only add in development mode
    if (dev) {
      // Find the rule that handles JSX/TSX files
      const jsRule = config.module.rules.find(
        rule => rule.oneOf && Array.isArray(rule.oneOf)
      );
      
      if (jsRule && jsRule.oneOf) {
        const babelRule = jsRule.oneOf.find(
          rule => rule.test && rule.test.toString().includes('jsx|tsx')
        );
        
        if (babelRule && babelRule.use && babelRule.use.options) {
          // Add our plugin to babel options
          babelRule.use.options.plugins = babelRule.use.options.plugins || [];
          babelRule.use.options.plugins.push(
            require.resolve('./custom-babel-plugin')
          );
        }
      }
    }
    
    return config;
  },
};

module.exports = nextConfig;
```

### Alternative: Using `.babelrc`

Create or update your `.babelrc` file:

```json
{
  "presets": ["next/babel"],
  "env": {
    "development": {
      "plugins": [
        "./custom-babel-plugin"
      ]
    }
  }
}
```

## Features

- Only adds attributes in development mode
- Skips node_modules files
- Provides file path, line numbers, component name, and parent component info
- Automatically disabled in production builds
- Zero runtime performance impact in production

## How It Helps

When inspecting your application in the browser's devtools, you'll see:

```html
<div data-in="HomePage" data-is="Card" data-at="ProductCard.tsx:12-35">
  <!-- Your component content -->
</div>
```

This makes it much easier to:

1. Identify which component is rendering what markup
2. Locate the exact file and line number where the component is defined
3. Understand component hierarchy and nesting relationships

## Example

Original JSX:
```jsx
// src/components/Button.jsx
export const Button = ({ children, ...props }) => {
  return <button className="my-button" {...props}>{children}</button>
}
```

Resulting HTML (in dev mode):
```html
<button data-in="Button" data-is="button" data-at="Button.jsx:3" class="my-button">
  Click me
</button>
```

## License

MIT 