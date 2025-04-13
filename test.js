/**
 * Simple test script for the babel-plugin-debug-source
 * 
 * This script uses @babel/core to transform code with our plugin
 * Run with: node test.js
 */

const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

// Set environment to development to enable the plugin
process.env.NODE_ENV = 'development';

// Sample JSX code to transform
const sampleCode = `
import React from 'react';

const Button = ({ onClick, children }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

export const App = () => {
  const handleClick = () => {
    console.log('Button clicked');
  };
  
  return (
    <div className="app">
      <h1>Hello World</h1>
      <p>This is a test</p>
      <Button onClick={handleClick}>Click Me</Button>
    </div>
  );
};
`;

// Run the transformation with our plugin
try {
  const result = babel.transformSync(sampleCode, {
    plugins: [path.resolve(__dirname, 'index.js')],
    presets: ['@babel/preset-react'],
    filename: 'sample.jsx', // Provide a filename for the plugin to use
    sourceMaps: true,
    sourceFileName: 'sample.jsx',
  });

  // Output the transformed code
  console.log('Transformed code:');
  console.log('-'.repeat(50));
  console.log(result.code);
  console.log('-'.repeat(50));
  
  // Save the transformed code to a file
  fs.writeFileSync(path.join(__dirname, 'transformed.js'), result.code);
  console.log('Saved transformed code to transformed.js');
  
} catch (error) {
  console.error('Error transforming code:', error);
}

// Check if plugin is working correctly
console.log('\nVerification:');
console.log('-'.repeat(50));
if (sampleCode.includes('data-at')) {
  console.log('❌ Input code already contains data-at attributes');
} else {
  console.log('✅ Input code does not contain debug attributes');
}

const output = fs.readFileSync(path.join(__dirname, 'transformed.js'), 'utf8');
if (output.includes('data-at') && output.includes('data-is')) {
  console.log('✅ Plugin successfully added debug attributes');
} else {
  console.log('❌ Plugin failed to add debug attributes');
}
console.log('-'.repeat(50));

console.log('\nTo use this plugin:');
console.log('\n[Next.js]');
console.log('1. Copy the custom-babel-plugin folder to your Next.js project');
console.log('2. Update your next.config.js as shown in example-next.config.js (requires Next.js 12+)');
console.log('3. Or use the .babelrc approach which works with any Next.js version');

console.log('\n[Vite]');
console.log('1. Copy the custom-babel-plugin folder to your Vite project');
console.log('2. Update your vite.config.js as shown in example-vite.config.js');
console.log('3. Make sure you have @vitejs/plugin-react installed');

console.log('\n4. Restart your development server'); 