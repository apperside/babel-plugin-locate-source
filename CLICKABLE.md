# Clickable Source Locations

This document explains how to use the clickable source locations feature of the babel-plugin-locate-source.

## Overview

The clickable source locations feature allows you to click on the component info tooltip to open the source file directly in your preferred IDE. This can significantly speed up your development workflow by eliminating the need to manually locate files.

## Setup

1. Enable the feature in your Babel configuration:

```js
// babel.config.js
module.exports = {
  plugins: [
    ["babel-plugin-locate-source", {
      enabled: true,
      clickable: true  // Enable clickable source locations
    }]
  ]
};
```

2. Include the required CSS and JavaScript files in your project:

```html
<!-- In your HTML or in your app's global imports -->
<link rel="stylesheet" href="node_modules/babel-plugin-locate-source/debug-styles.css">
<script src="node_modules/babel-plugin-locate-source/locate-source-clickable.js"></script>
```

For production environments, you can use the minified version from the dist directory:

```html
<script src="node_modules/babel-plugin-locate-source/dist/locate-source-clickable.js"></script>
```

For bundlers like webpack, you can import these files in your entry point:

```js
// In your app entry point
import 'babel-plugin-locate-source/debug-styles.css';
import 'babel-plugin-locate-source/locate-source-clickable.js';
```

## Usage

Once set up, you'll see a small gear icon (⚙️) in the bottom-right corner of your application. Clicking this icon opens a settings panel where you can select your preferred IDE:

- VS Code (default)
- IntelliJ
- Atom
- Sublime Text
- Cursor

When you hover over any component in your application, you'll see an info tooltip showing component details. Clicking on this tooltip will open the corresponding source file in your selected IDE.

## How It Works

The plugin adds special data attributes to your JSX elements:

- `data-filepath`: The full path to the source file
- `data-line`: The line number where the component is defined
- `data-clickable`: Set to "true" to enable click behavior

The JavaScript handler uses these attributes to construct a URI that opens the file in your IDE:

- VS Code: `vscode://file/filepath:line`
- IntelliJ: `idea://open?file=filepath&line=line`
- Atom: `atom://open?file=filepath&line=line`
- Sublime: `subl://open?url=file://filepath&line=line`
- Cursor: `cursor://open?file=filepath&line=line`

## Customization

You can modify the `locate-source-clickable.js` file to add support for additional IDEs or customize the behavior.

## Browser Support

This feature uses modern browser APIs and should work in all modern browsers. It requires:

- LocalStorage API
- CSS ::after pseudo-elements
- JavaScript Event Delegation

## Troubleshooting

If clicking on the tooltip doesn't open your IDE:

1. Make sure you have the correct IDE protocol handlers installed
2. Check that your IDE is properly configured to handle external URI requests
3. Verify that the file paths in your project are correctly resolved

For VS Code, you may need to install the "URL Handler" extension. 