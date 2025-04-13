# Debugging the Plugin

If you're having issues with the plugin or want to understand how it works under the hood, here are some tips.

## Verifying Installation

To verify the plugin is correctly installed and running:

1. Check your browser's developer tools element inspector
2. Look for `data-at`, `data-is`, and `data-in` attributes on your JSX elements
3. If these are missing, the plugin might not be properly configured

## Common Issues

### Plugin Not Running

If you don't see the debug attributes:

1. Ensure you're in development mode (`NODE_ENV=development`)
2. Check that the plugin is properly integrated in your babel configuration
3. Make sure you've restarted your development server after adding the plugin
4. Verify you're using Next.js 12+ for the webpack config approach (if using Next.js)

```bash
# Force development mode if needed
NODE_ENV=development npm run dev
```

### Debugging Babel Configuration

To see what Babel plugins are being loaded, you can set:

```bash
DEBUG=babel:config-chain npm run dev
```

### Vite-Specific Debugging

For Vite projects, you can debug the Babel configuration by setting:

```bash
DEBUG=vite:plugin-react npm run dev
```

This will show you the Babel configuration being used by the `@vitejs/plugin-react` plugin.

You can also create a `.babelrc` file in your project root as an alternative approach:

```json
{
  "presets": ["@babel/preset-react"],
  "plugins": [
    "./custom-babel-plugin"
  ]
}
```

However, when using `.babelrc` with Vite, make sure to configure `@vitejs/plugin-react` to use it:

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Use .babelrc file
      babel: {
        babelrc: true
      }
    })
  ],
});
```

### Inspecting Webpack Configuration

For Next.js, you can inspect the webpack configuration with:

```bash
NODE_OPTIONS=--inspect npm run dev
```

Then open Chrome DevTools for Node.js using chrome://inspect.

## Advanced: Add Logging to the Plugin

You can modify the plugin to include logging for debugging:

```js
// In index.js
module.exports = function debugSourcePlugin(babel) {
  const { types: t } = babel;
  
  return {
    name: "debug-source-plugin",
    visitor: {
      JSXElement(path, state) {
        console.log('Processing JSX in file:', state.file.opts.filename);
        
        // Rest of the plugin code...
      }
    }
  };
};
```

## Viewing the Transformed Output

To see the actual transformed code from the plugin:

```bash
# For Next.js
npx next build --debug

# For Vite
# Vite doesn't have a built-in way to see the transformed output, but
# you can use the following approach in your index.js file:

module.exports = function debugSourcePlugin(babel) {
  const { types: t } = babel;
  
  return {
    name: "debug-source-plugin",
    visitor: {
      JSXElement(path, state) {
        // Only log for specific files to avoid flooding the console
        if (state.file.opts.filename.includes('YourComponent.jsx')) {
          console.log('Original:', path.toString());
          // Continue with the transformation...
          
          // After transformation
          console.log('Transformed:', path.toString());
        }
        
        // Rest of the plugin code...
      }
    }
  };
};
```

## Using the Debug Styles

To make it even easier to visualize your components, you can add the included debug-styles.css to your project:

```jsx
// Only in development mode
if (process.env.NODE_ENV === 'development') {
  require('./debug-styles.css');
}

// For Vite, you can import the CSS file directly:
import './debug-styles.css';
```

Then, you can add the `.debug-mode` class to your body element when you want to see all component outlines:

```jsx
// Toggle debug mode
function toggleDebugMode() {
  document.body.classList.toggle('debug-mode');
}

// Add a button somewhere in your app
<button onClick={toggleDebugMode}>Toggle Debug Mode</button>
```

## Customizing the Plugin

You can modify the plugin to customize what information is shown and how:

- Change attribute names (`data-at`, `data-is`, `data-in`)
- Add more information like props or component state
- Filter certain components or only target specific components

See the main `index.js` file for the places where you can make these modifications. 