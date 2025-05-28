/**
 * Test script to verify duplicate attribute prevention
 * This test simulates running the plugin multiple times on the same code
 */

const babel = require('@babel/core');
const path = require('path');

async function testDuplicatePrevention() {
  console.log('Testing duplicate attribute prevention...');
  console.log('='.repeat(50));

  const testCode = `
import React from 'react';

const TestComponent = () => {
  return (
    <div className="test">
      <h1>Test Header</h1>
      <p>Test paragraph</p>
    </div>
  );
};
`;

  try {
    // First transformation
    console.log('Running first transformation...');
    const firstResult = await babel.transformAsync(testCode, {
      plugins: [
        [path.resolve(__dirname, 'index.js'), { enabled: true, clickable: true }]
      ],
      presets: ['@babel/preset-react'],
      filename: 'test-duplicate.jsx',
    });

    // Count attributes in first result
    const firstOutput = firstResult.code;
    const countDataAt = (str) => (str.match(/"data-at"/g) || []).length;
    const firstDataAtCount = countDataAt(firstOutput);
    
    console.log(`First transformation - data-at count: ${firstDataAtCount}`);

    // Second transformation on the already transformed code
    console.log('Running second transformation on already transformed code...');
    const secondResult = await babel.transformAsync(firstOutput, {
      plugins: [
        [path.resolve(__dirname, 'index.js'), { enabled: true, clickable: true }]
      ],
      presets: ['@babel/preset-react'],
      filename: 'test-duplicate.jsx',
    });

    const secondOutput = secondResult.code;
    const secondDataAtCount = countDataAt(secondOutput);
    
    console.log(`Second transformation - data-at count: ${secondDataAtCount}`);

    // Verify no duplicates were added
    const noDuplicates = firstDataAtCount === secondDataAtCount;
    
    console.log('\nResults:');
    console.log(`✅ No duplicate attributes added: ${noDuplicates ? 'PASS' : 'FAIL'}`);
    
    if (!noDuplicates) {
      console.log('\n❌ FAILURE: Duplicate attributes were added!');
      console.log('First transformation output (first 500 chars):');
      console.log(firstOutput.substring(0, 500) + '...');
      console.log('\nSecond transformation output (first 500 chars):');
      console.log(secondOutput.substring(0, 500) + '...');
    } else {
      console.log('\n✅ SUCCESS: Plugin correctly prevents duplicate attributes');
    }

    return noDuplicates;
  } catch (error) {
    console.error('❌ Error during duplicate prevention test:', error);
    return false;
  }
}

// Run the test
testDuplicatePrevention()
  .then(success => {
    console.log('\n' + '='.repeat(50));
    console.log(`Overall test result: ${success ? '✅ PASSED' : '❌ FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed with error:', error);
    process.exit(1);
  }); 