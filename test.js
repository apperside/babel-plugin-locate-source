/**
 * Test script for babel-plugin-locate-source
 * 
 * This script uses @babel/core to transform code with our plugin
 * Run with: npm test
 */

const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'test-transform-output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Test cases
const testCases = [
  {
    name: 'Basic JSX transformation',
    code: `
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
`,
    filename: 'sample.jsx'
  },
  {
    name: 'Nested components',
    code: `
import React from 'react';

const Card = ({ children }) => (
  <div className="card">{children}</div>
);

const Header = ({ title }) => (
  <header className="header">
    <h1>{title}</h1>
  </header>
);

export const Page = () => (
  <Card>
    <Header title="Welcome" />
    <p>Content goes here</p>
  </Card>
);
`,
    filename: 'nested.jsx'
  }
];

// Function to run a single test case
async function runTest(testCase, options = {}) {
  console.log(`\nTesting: ${testCase.name}`);
  if (options.enabled !== undefined) {
    console.log(`Plugin enabled: ${options.enabled}`);
  }
  if (options.env) {
    console.log(`NODE_ENV: ${options.env}`);
  }
  console.log('-'.repeat(50));

  try {
    // Set NODE_ENV for this test if specified
    const originalNodeEnv = process.env.NODE_ENV;
    if (options.env) {
      process.env.NODE_ENV = options.env;
    }

    const result = await babel.transformAsync(testCase.code, {
      plugins: [
        [path.resolve(__dirname, 'index.js'), options]
      ],
      presets: ['@babel/preset-react'],
      filename: testCase.filename,
      sourceMaps: true,
      sourceFileName: testCase.filename,
    });

    // Restore original NODE_ENV
    if (options.env) {
      process.env.NODE_ENV = originalNodeEnv;
    }

    // Verify the transformation
    const output = result.code;
    
    // Check for debug attributes
    const hasDataAt = output.includes('data-at');
    const hasDataIs = output.includes('data-is');
    const hasDataIn = output.includes('data-in');

    console.log('Transformation successful:');
    console.log(`✅ data-at attribute: ${hasDataAt ? 'present' : 'missing'}`);
    console.log(`✅ data-is attribute: ${hasDataIs ? 'present' : 'missing'}`);
    console.log(`✅ data-in attribute: ${hasDataIn ? 'present' : 'missing'}`);

    // Save the transformed code to the output directory
    const outputFile = path.join(
      outputDir, 
      `transformed-${path.basename(testCase.filename, '.jsx')}-${options.enabled ? 'enabled' : 'disabled'}.js`
    );
    fs.writeFileSync(outputFile, output);
    console.log(`\nSaved transformed code to ${outputFile}`);

    // Check if the result matches the expected behavior
    const shouldHaveAttributes = options.enabled === true || 
                               (options.enabled === undefined && options.env === 'development');
    
    const attributesPresent = hasDataAt && hasDataIs && hasDataIn;
    const resultMatches = attributesPresent === shouldHaveAttributes;

    if (!resultMatches) {
      console.log(`❌ Expected attributes to be ${shouldHaveAttributes ? 'present' : 'missing'}, but they were ${attributesPresent ? 'present' : 'missing'}`);
    }

    return resultMatches;
  } catch (error) {
    console.error('❌ Error transforming code:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('Running tests for babel-plugin-locate-source');
  console.log('='.repeat(50));

  let allPassed = true;
  
  // Test with explicit enabled=true
  for (const testCase of testCases) {
    const passed = await runTest(testCase, { enabled: true });
    allPassed = allPassed && passed;
  }
  
  // Test with explicit enabled=false
  for (const testCase of testCases) {
    const passed = await runTest(testCase, { enabled: false });
    allPassed = allPassed && passed;
  }
  
  // Test with NODE_ENV=development (should enable by default)
  for (const testCase of testCases) {
    const passed = await runTest(testCase, { env: 'development' });
    allPassed = allPassed && passed;
  }
  
  // Test with NODE_ENV=production (should disable by default)
  for (const testCase of testCases) {
    const passed = await runTest(testCase, { env: 'production' });
    allPassed = allPassed && passed;
  }

  console.log('\nTest Summary:');
  console.log('='.repeat(50));
  console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed');
}

// Run the tests
runAllTests().catch(console.error); 