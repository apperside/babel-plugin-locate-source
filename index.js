/**
 * Babel plugin to add source file and line information to JSX elements
 * Similar to what Tamagui does automatically
 */
module.exports = function debugSourcePlugin(babel, options = {}) {
  const { types: t } = babel;
  const { 
    enabled = process.env.NODE_ENV === 'development',
    devTools = false 
  } = options;
  
  return {
    name: "locate-source-plugin",
    visitor: {
      JSXElement(path, state) {
        // Skip if plugin is disabled
        if (!enabled) {
          return;
        }
        
        // Get filename from babel state
        const filename = state.file.opts.filename;
        
        // Skip node_modules files
        if (filename.includes('node_modules')) {
          return;
        }
        
        // Skip if the element doesn't have location info
        if (!path.node.loc) {
          return;
        }
        
        // Get location information
        const { line, column } = path.node.loc.start;
        const endLine = path.node.loc.end.line;
        const lineNumbers = line === endLine ? `${line}` : `${line}-${endLine}`;
        
        // Get component name
        let componentName = 'Unknown';
        if (path.node.openingElement && path.node.openingElement.name) {
          if (t.isJSXIdentifier(path.node.openingElement.name)) {
            componentName = path.node.openingElement.name.name;
          } else if (t.isJSXMemberExpression(path.node.openingElement.name)) {
            // Handle cases like Namespace.Component
            componentName = path.node.openingElement.name.property.name;
          }
        }
        
        // Try to determine the parent component name (where this JSX appears)
        let parentComponentName = '';
        
        // Walk up the path to find a function declaration or arrow function
        let parentPath = path.findParent((p) => 
          t.isFunctionDeclaration(p.node) || 
          t.isArrowFunctionExpression(p.node) ||
          t.isFunctionExpression(p.node) ||
          t.isClassDeclaration(p.node)
        );
        
        if (parentPath) {
          if (t.isFunctionDeclaration(parentPath.node) && parentPath.node.id) {
            parentComponentName = parentPath.node.id.name;
          } else if (t.isClassDeclaration(parentPath.node) && parentPath.node.id) {
            parentComponentName = parentPath.node.id.name;
          } else {
            // For arrow functions, try to get variable name
            const variableParent = parentPath.findParent((p) => 
              t.isVariableDeclarator(p.node)
            );
            if (variableParent && t.isIdentifier(variableParent.node.id)) {
              parentComponentName = variableParent.node.id.name;
            }
          }
        }
        
        // Get relative file path (more readable)
        // Use basename to get just the filename, more similar to Tamagui's approach
        const path_segments = filename.split('/');
        const shortFilename = path_segments[path_segments.length - 1];
        
        // Store the full path for clickable links
        const fullPath = filename;
        
        // Check if attributes already exist to prevent duplicates
        const existingAttributes = path.node.openingElement.attributes;
        const hasDataAt = existingAttributes.some(attr => 
          t.isJSXAttribute(attr) && 
          t.isJSXIdentifier(attr.name) && 
          attr.name.name === 'data-at'
        );
        
        // Skip if attributes already exist (prevents duplicate processing)
        if (hasDataAt) {
          return;
        }
        
        // Add data attributes to the JSX element (following Tamagui's pattern)
        path.node.openingElement.attributes.unshift(
          t.jsxAttribute(
            t.jsxIdentifier('data-at'),
            t.stringLiteral(`${shortFilename}:${lineNumbers}`)
          )
        );
        
        path.node.openingElement.attributes.unshift(
          t.jsxAttribute(
            t.jsxIdentifier('data-is'), 
            t.stringLiteral(componentName)
          )
        );
        
        if (parentComponentName) {
          path.node.openingElement.attributes.unshift(
            t.jsxAttribute(
              t.jsxIdentifier('data-in'),
              t.stringLiteral(parentComponentName)
            )
          );
        }
        
        // Add full path and line info for picker functionality
        path.node.openingElement.attributes.unshift(
          t.jsxAttribute(
            t.jsxIdentifier('data-filepath'),
            t.stringLiteral(fullPath)
          )
        );
        
        path.node.openingElement.attributes.unshift(
          t.jsxAttribute(
            t.jsxIdentifier('data-line'),
            t.stringLiteral(line.toString())
          )
        );
        
        // Add clickable attribute only if explicitly enabled
        if (devTools) {
          path.node.openingElement.attributes.unshift(
            t.jsxAttribute(
              t.jsxIdentifier('data-clickable'),
              t.stringLiteral("true")
            )
          );
        }
      }
    }
  };
}; 