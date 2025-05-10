const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');

module.exports = [
  // CommonJS (for Node) build
  {
    input: 'index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'auto'
    },
    external: Object.keys(pkg.peerDependencies || {}),
    plugins: [
      terser({
        format: {
          comments: 'some',
          preserve_annotations: true
        }
      })
    ]
  },
  // ES module (for bundlers) build
  {
    input: 'index.js',
    output: {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    external: Object.keys(pkg.peerDependencies || {}),
    plugins: [
      terser({
        format: {
          comments: 'some',
          preserve_annotations: true
        }
      })
    ]
  }
]; 