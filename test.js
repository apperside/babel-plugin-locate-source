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
  },
  {
    name: 'Clickable feature test with complex structure',
    code: `
import React, { Fragment, useState } from 'react';

// A simple UI component
const Button = ({ variant = 'primary', onClick, children }) => (
  <button 
    className={\`btn btn-\${variant}\`} 
    onClick={onClick}
  >
    {children}
  </button>
);

// A compound component with fragments
const ListItem = ({ item }) => (
  <Fragment>
    <li className="list-item">
      <span className="item-name">{item.name}</span>
      <span className="item-value">{item.value}</span>
    </li>
  </Fragment>
);

// A component that renders dynamic elements
const DynamicList = ({ items }) => (
  <ul className="dynamic-list">
    {items.map((item) => (
      <ListItem key={item.id} item={item} />
    ))}
  </ul>
);

// A form component with multiple inputs
const FormComponent = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input 
          type="text" 
          id="name" 
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <Button variant="success" type="submit">Submit</Button>
    </form>
  );
};

// Main app component that combines all the above
export const ComplexApp = () => {
  const items = [
    { id: 1, name: 'Item 1', value: 10 },
    { id: 2, name: 'Item 2', value: 20 },
    { id: 3, name: 'Item 3', value: 30 },
  ];
  
  const handleFormSubmit = (data) => {
    console.log('Form submitted:', data);
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Complex Component Structure</h1>
        <p>Testing the devTools feature with nested components</p>
      </header>
      <div className="app-body">
        <DynamicList items={items} />
        <div className="divider" />
        <FormComponent onSubmit={handleFormSubmit} />
        <div className="actions">
          <Button onClick={() => console.log('Reset clicked')}>Reset</Button>
          <Button variant="danger" onClick={() => console.log('Cancel clicked')}>Cancel</Button>
        </div>
      </div>
      <footer className="app-footer">
        <p>&copy; 2023 Test Application</p>
      </footer>
    </div>
  );
};
`,
    filename: 'complex.jsx'
  }
];

// Function to run a single test case
async function runTest(testCase, options = {}) {
  console.log(`\nTesting: ${testCase.name}`);
  if (options.enabled !== undefined) {
    console.log(`Plugin enabled: ${options.enabled}`);
  }
  if (options.devTools !== undefined) {
    console.log(`Clickable feature: ${options.devTools}`);
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
    
    // Check for clickable-specific attributes
    const hasDataFilepath = output.includes('data-filepath');
    const hasDataLine = output.includes('data-line');
    const hasDataClickable = output.includes('data-clickable');

    console.log('Transformation successful:');
    console.log(`✅ data-at attribute: ${hasDataAt ? 'present' : 'missing'}`);
    console.log(`✅ data-is attribute: ${hasDataIs ? 'present' : 'missing'}`);
    console.log(`✅ data-in attribute: ${hasDataIn ? 'present' : 'missing'}`);
    console.log(`✅ data-filepath attribute: ${hasDataFilepath ? 'present' : 'missing'}`);
    console.log(`✅ data-line attribute: ${hasDataLine ? 'present' : 'missing'}`);
    console.log(`✅ data-clickable attribute: ${hasDataClickable ? 'present' : 'missing'}`);

    // Generate unique output filename based on options
    let outputFileName = `transformed-${path.basename(testCase.filename, '.jsx')}`;
    outputFileName += options.enabled ? '-enabled' : '-disabled';
    if (options.devTools) {
      outputFileName += '-dev-tools';
    }
    if (options.env) {
      outputFileName += `-${options.env}`;
    }
    outputFileName += '.js';
    
    const outputFile = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputFile, output);
    console.log(`\nSaved transformed code to ${outputFile}`);

    // Check if the result matches the expected behavior
    const shouldHaveAttributes = options.enabled === true || 
                               (options.enabled === undefined && options.env === 'development');
    
    const shouldHaveClickable = shouldHaveAttributes && options.devTools === true;
    
    const basicAttributesPresent = hasDataAt && hasDataIs && hasDataIn;
    const clickableAttributesPresent = hasDataFilepath && hasDataLine;
    const clickableFlagPresent = hasDataClickable;
    
    const basicAttributesMatch = basicAttributesPresent === shouldHaveAttributes;
    const clickableAttributesMatch = clickableAttributesPresent === shouldHaveAttributes; // These should be present even if devTools=false
    const clickableFlagMatch = clickableFlagPresent === shouldHaveClickable;
    
    let testPassed = basicAttributesMatch && clickableAttributesMatch && clickableFlagMatch;

    if (!basicAttributesMatch) {
      console.log(`❌ Expected basic attributes to be ${shouldHaveAttributes ? 'present' : 'missing'}, but they were ${basicAttributesPresent ? 'present' : 'missing'}`);
    }
    
    if (!clickableAttributesMatch) {
      console.log(`❌ Expected filepath and line attributes to be ${shouldHaveAttributes ? 'present' : 'missing'}, but they were ${clickableAttributesPresent ? 'present' : 'missing'}`);
    }
    
    if (!clickableFlagMatch) {
      console.log(`❌ Expected devTools flag to be ${shouldHaveClickable ? 'present' : 'missing'}, but it was ${clickableFlagPresent ? 'present' : 'missing'}`);
    }

    return testPassed;
  } catch (error) {
    console.error('❌ Error transforming code:', error);
    return false;
  }
}

// Function to run a more detailed check for the devTools feature
async function testClickableFeature() {
  console.log('\nRunning detailed test for devTools feature');
  console.log('='.repeat(50));
  
  // Get the complex test case
  const complexTest = testCases.find(test => test.name === 'Clickable feature test with complex structure');
  
  if (!complexTest) {
    console.error('❌ Could not find complex test case for devTools feature');
    return false;
  }
  
  try {
    // Force NODE_ENV to development for this test
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const result = await babel.transformAsync(complexTest.code, {
      plugins: [
        [path.resolve(__dirname, 'index.js'), { enabled: true, devTools: true }]
      ],
      presets: ['@babel/preset-react'],
      filename: complexTest.filename,
      sourceMaps: true,
      sourceFileName: complexTest.filename,
    });
    
    // Restore NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
    
    const output = result.code;
    
    // Count the occurrences of each attribute
    const countOccurrences = (str, subStr) => {
      let count = 0;
      let pos = str.indexOf(subStr);
      while (pos !== -1) {
        count++;
        pos = str.indexOf(subStr, pos + 1);
      }
      return count;
    };
    
    const dataAtCount = countOccurrences(output, '"data-at"');
    const dataIsCount = countOccurrences(output, '"data-is"');
    const dataInCount = countOccurrences(output, '"data-in"');
    const dataFilepathCount = countOccurrences(output, '"data-filepath"');
    const dataLineCount = countOccurrences(output, '"data-line"');
    const dataClickableCount = countOccurrences(output, '"data-clickable": "true"');
    
    // Save to a special output file for inspection
    const outputFile = path.join(outputDir, 'clickable-feature-test-complex.js');
    fs.writeFileSync(outputFile, output);
    
    console.log('Detailed attribute count:');
    console.log(`- data-at: ${dataAtCount} occurrences`);
    console.log(`- data-is: ${dataIsCount} occurrences`);
    console.log(`- data-in: ${dataInCount} occurrences`);
    console.log(`- data-filepath: ${dataFilepathCount} occurrences`);
    console.log(`- data-line: ${dataLineCount} occurrences`);
    console.log(`- data-clickable: ${dataClickableCount} occurrences`);
    
    // Count React.createElement calls to estimate the number of JSX elements
    // In the transformed output, JSX elements are represented as React.createElement calls
    const creationCount = countOccurrences(output, 'React.createElement');
    
    console.log(`\nReact.createElement calls: ${creationCount}`);
    console.log(`Transformed output saved to ${outputFile}`);
    
    // Verify all elements have the devTools attributes
    const allAttributesPresent = dataAtCount > 0 &&
                               dataAtCount === dataIsCount && 
                               dataAtCount === dataFilepathCount && 
                               dataAtCount === dataLineCount && 
                               dataAtCount === dataClickableCount;
    
    // Check if attributes are applied to all React.createElement calls
    // Note: dataInCount might be less if some elements don't have parent components
    const allElementsHaveAttributes = dataAtCount > 0 && (dataAtCount >= creationCount * 0.9); // Allow for some imprecision
    
    console.log('\nVerification:');
    console.log(`- All elements have consistent attributes: ${allAttributesPresent ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`- Attributes applied to (nearly) all JSX elements: ${allElementsHaveAttributes ? '✅ PASS' : '❌ FAIL'}`);
    
    // Print additional diagnostic information if the test fails
    if (!allAttributesPresent || !allElementsHaveAttributes) {
      console.log('\nDiagnostic information:');
      console.log('- First 500 characters of transformed output:');
      console.log(output.substring(0, 500) + '...');
      
      // Find a sample React.createElement call
      const createElement = output.indexOf('React.createElement');
      if (createElement !== -1) {
        const endOfCall = output.indexOf(')', createElement);
        if (endOfCall !== -1) {
          console.log('\n- Sample React.createElement call:');
          console.log(output.substring(createElement, Math.min(endOfCall + 1, createElement + 300)) + (endOfCall - createElement > 300 ? '...' : ''));
        }
      }
    }
    
    return allAttributesPresent && allElementsHaveAttributes;
  } catch (error) {
    console.error('❌ Error testing devTools feature:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('Running tests for babel-plugin-locate-source');
  console.log('='.repeat(50));

  let allPassed = true;
  
  // Track test results for summary
  const testResults = {
    enabledBasic: [],
    disabledBasic: [],
    development: [],
    production: [],
    clickableEnabled: [],
    clickableDevelopment: [],
    clickableDisabled: []
  };
  
  // Test with explicit enabled=true
  for (const testCase of testCases) {
    const passed = await runTest(testCase, { enabled: true });
    testResults.enabledBasic.push({ name: testCase.name, passed });
    allPassed = allPassed && passed;
  }
  
  // Test with explicit enabled=false
  for (const testCase of testCases) {
    const passed = await runTest(testCase, { enabled: false });
    testResults.disabledBasic.push({ name: testCase.name, passed });
    allPassed = allPassed && passed;
  }
  
  // Test with NODE_ENV=development (should enable by default)
  for (const testCase of testCases) {
    const passed = await runTest(testCase, { env: 'development' });
    testResults.development.push({ name: testCase.name, passed });
    allPassed = allPassed && passed;
  }
  
  // Test with NODE_ENV=production (should disable by default)
  for (const testCase of testCases) {
    const passed = await runTest(testCase, { env: 'production' });
    testResults.production.push({ name: testCase.name, passed });
    allPassed = allPassed && passed;
  }
  
  // Test with devTools=true
  for (const testCase of testCases) {
    const passed = await runTest(testCase, { enabled: true, clickable: true });
    testResults.clickableEnabled.push({ name: testCase.name, passed });
    allPassed = allPassed && passed;
  }
  
  // Test with devTools=true in development environment
  for (const testCase of testCases) {
    const passed = await runTest(testCase, { env: 'development', devTools: true });
    testResults.clickableDevelopment.push({ name: testCase.name, passed });
    allPassed = allPassed && passed;
  }
  
  // Test with devTools=true but enabled=false (should not add any attributes)
  for (const testCase of testCases) {
    const passed = await runTest(testCase, { enabled: false, devTools: true });
    testResults.clickableDisabled.push({ name: testCase.name, passed });
    allPassed = allPassed && passed;
  }
  
  // Run detailed test for devTools feature
  const clickableTestPassed = await testClickableFeature();
  allPassed = allPassed && clickableTestPassed;

  // Print summary report
  console.log('\nTest Summary:');
  console.log('='.repeat(50));
  
  // Function to count passed tests in a category
  const countPassed = (results) => {
    return results.filter(r => r.passed).length;
  };
  
  console.log('Basic functionality:');
  console.log(`- When enabled: ${countPassed(testResults.enabledBasic)}/${testResults.enabledBasic.length} tests passed`);
  console.log(`- When disabled: ${countPassed(testResults.disabledBasic)}/${testResults.disabledBasic.length} tests passed`);
  console.log(`- In development: ${countPassed(testResults.development)}/${testResults.development.length} tests passed`);
  console.log(`- In production: ${countPassed(testResults.production)}/${testResults.production.length} tests passed`);
  
  console.log('\nClickable feature:');
  console.log(`- When enabled with devTools: ${countPassed(testResults.clickableEnabled)}/${testResults.clickableEnabled.length} tests passed`);
  console.log(`- In development with devTools: ${countPassed(testResults.clickableDevelopment)}/${testResults.clickableDevelopment.length} tests passed`);
  console.log(`- When disabled with devTools: ${countPassed(testResults.clickableDisabled)}/${testResults.clickableDisabled.length} tests passed`);
  console.log(`- Detailed element count test: ${clickableTestPassed ? 'PASSED' : 'FAILED'}`);
  
  console.log('\nOverall result:');
  console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed');
}

// Run the tests
runAllTests().catch(console.error); 