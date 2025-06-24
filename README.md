<div align="center">
  <img src="landing-page/images/hero-illustration.png" alt="babel-plugin-locate-source logo" width="400" />
  <h1>babel-plugin-locate-source</h1>
  <p>Easily locate your React components in the DOM with source file and line information</p>
  <hr />
  
  [![npm version](https://img.shields.io/npm/v/babel-plugin-locate-source.svg?style=flat)](https://www.npmjs.com/package/babel-plugin-locate-source)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

## 🔍 What It Does

When enabled, this plugin adds the following HTML attributes to JSX elements in development mode:

- `data-at`: The source file and line numbers (e.g., "Button.tsx:42-45")
- `data-is`: The component name (e.g., "Button")
- `data-in`: The parent component where this JSX appears (e.g., "Header")
- `data-filepath`: The full file path for IDE integration
- `data-line`: The starting line number
- `data-clickable`: Added when devTools feature is enabled (value: "true")

<div align="center">
  <img src="landing-page/images/debug-styles-preview.png" alt="Debug preview" width="600" />
</div>

## 🚀 Installation

```bash
npm install --save-dev babel-plugin-locate-source
# or
yarn add --dev babel-plugin-locate-source
```

### For Vite + React Projects

Update your `vite.config.js`:

```js
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// https://vite.dev/config/
export default defineConfig({
  // ..rest of your config,
  plugins: [
    // ...rest of your plugins
    react({
      
      babel: {
        plugins: [
          [
            /**
             * the plugin, by default, is enabled if
             * 
             * process.env.NODE_ENV === 'development'
             * 
             * you can pass the enabled parameter to fit your custom rules
             */
            "babel-plugin-locate-source",
            { enabled: true },
          ],
        ],
      },
    }),
  ],
});
```

### Alternative: Using `.babelrc` or `babel.config.js`

Create or update your `.babelrc` file:

```json
{
  "presets": ["next/babel"],
  "env": {
    "development": {
      "plugins": [
        "babel-plugin-locate-source"
      ]
    }
  }
}
```

Or use a `babel.config.js` file:

```js
// babel.config.js
module.exports = {
  presets: ["next/babel"],
  plugins: [
    /**
     * the plugin, by default, is enabled if
     * 
     * process.env.NODE_ENV === 'development'
     * 
     * you can pass the enabled parameter to fit your custom rules
     */
    ["babel-plugin-locate-source", { enabled: true }]
  ]
};
```

> **⚠️ WARNING**: Using a `babel.config.js` file with Next.js will disable the SWC compiler

## ⚡ Step-by-Step Integration

<div align="center">
  <img src="landing-page/images/step1-illustration.png" alt="Step 1" width="180" />
  <img src="landing-page/images/step2-illustration.png" alt="Step 2" width="180" />
  <img src="landing-page/images/step3-illustration.png" alt="Step 3" width="180" />
</div>

1. **Install the plugin** using npm or yarn
2. **Update your Babel configuration** to include the plugin
3. **Start your development server** and inspect elements to see source information

## ⚙️ Next.js Compatibility

When using this plugin with Next.js, be aware that it will disable the [SWC compiler](https://nextjs.org/docs/architecture/nextjs-compiler) in favor of Babel. This is a necessary trade-off to enable the source location features.

## 🛠️ Configuration

The plugin accepts the following options:

### `enabled` (boolean)
- **Default**: `process.env.NODE_ENV === 'development'`
- **Description**: Controls whether the plugin is active
- **Usage**: Set to `true` to force enable, `false` to force disable, or omit to use automatic detection

### `devTools` (boolean)
- **Default**: `false`
- **Description**: Enables interactive features for clicking elements to open source files in your IDE
- **Usage**: Set to `true` to enable clickable tooltips and element picker functionality

### Configuration Examples

**Basic usage (auto-enabled in development):**
```json
{
  "plugins": ["babel-plugin-locate-source"]
}
```

**Force enable with devTools features:**
```json
{
  "plugins": [
    ["babel-plugin-locate-source", {
      "enabled": true,
      "devTools": true
    }]
  ]
}
```

**Force disable:**
```json
{
  "plugins": [
    ["babel-plugin-locate-source", {
      "enabled": false
    }]
  ]
}
```

**Environment-specific configuration:**
```json
{
  "env": {
    "development": {
      "plugins": [
        ["babel-plugin-locate-source", { "devTools": true }]
      ]
    },
    "production": {
      "plugins": [
        ["babel-plugin-locate-source", { "enabled": false }]
      ]
    }
  }
}
```

### Data Attributes Added

When the plugin is enabled, it adds the following data attributes to each JSX element:

| Attribute | Description | Example Value |
|-----------|-------------|---------------|
| `data-at` | Source file and line range | `"Button.tsx:42-45"` |
| `data-is` | Component/element name | `"Button"` or `"div"` |
| `data-in` | Parent component name | `"HomePage"` |
| `data-filepath` | Full file path | `"/src/components/Button.tsx"` |
| `data-line` | Starting line number | `"42"` |
| `data-clickable` | Clickable feature flag | `"true"` (only when `devTools: true`) |

### Using Clickable Source Locations

When the `devTools` option is enabled, you'll need to:

1. Include the `debug-styles.css` file in your project
2. Include the `dev-tools.js` script in your project

```html
<!-- In your HTML or component that loads globally -->
<link rel="stylesheet" href="node_modules/babel-plugin-locate-source/debug-styles.css">
<script src="node_modules/babel-plugin-locate-source/dev-tools.js"></script>
```

Or you can use the minified version from the dist directory:

```html
<script src="node_modules/babel-plugin-locate-source/dist/dev-tools.js"></script>
```

This will allow you to click on the component info tooltip to open the source file directly in your IDE. 
The script supports VS Code, IntelliJ, Atom, Sublime Text, and Cursor editors. You can select your preferred
editor through a settings panel that appears in the bottom-right corner of your application.

<div align="center">
  <img src="landing-page/images/debug-styles-preview.png" alt="Clickable feature preview" width="600" />
</div>

#### IDE Support

The devTools feature works with the following editors:
- VS Code (default)
- IntelliJ IDEA
- Atom
- Sublime Text
- Cursor

#### How to Use

1. Enable the devTools feature in your Babel config
2. Include the necessary CSS and JS files
3. Hover over any component to see its information tooltip
4. Click on the tooltip to open the source file in your preferred editor
5. Use the settings gear (⚙️) in the bottom-right corner to configure your editor preference
6. Use the target icon (🎯) to enter "picker mode" for clicking any element to open its source

For more detailed information about the devTools feature, see [CLICKABLE.md](CLICKABLE.md).

## ✨ Features

- ✅ Only adds attributes in development mode by default
- ✅ Skips node_modules files
- ✅ Provides file path, line numbers, component name, and parent component info
- ✅ Automatically disabled in production builds
- ✅ Zero runtime performance impact in production
- ✅ Optional devTools source locator that open files directly in your IDE
- ✅ Interactive element picker to quickly locate any component's source
- ✅ Prevents duplicate attributes when plugin runs multiple times

## 🔧 How It Helps

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
4. **Jump directly to the source code** with the devTools feature

<div align="center">
  <img src="landing-page/images/app-screenshot.png" alt="Application screenshot" width="600" />
</div>

## 📝 Example

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

## 📜 License

MIT

## 🧑‍💻 Development

If you want to contribute to this project, you can follow these steps:

1. Clone the repository
2. Install dependencies with `npm install`
3. Run tests with `npm test`
4. Make your changes
5. Build the package with `npm run build`

### Building

The build process uses Rollup to create optimized CommonJS and ES Module versions of the plugin. To build the package:

```bash
npm run build
```

This creates:
- `dist/index.js` - CommonJS module for Node.js environments
- `dist/index.esm.js` - ES module for bundlers like webpack, Rollup, etc.

