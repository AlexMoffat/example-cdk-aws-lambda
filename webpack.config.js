const path = require('path');

module.exports = {
  // Base directory for resolving entry points. This is where tsc has put
  // the output of its compilation process.
  context: path.resolve(__dirname, './dist/src/main'),
  // Entry point for the bundle. 
  entry: {
    index: './index.js'
  },
  output: {
    // Directory where bundles should be placed.
    path: path.resolve(__dirname, 'build'),
    // Name of the bundle.
    filename: '[name].js',
    // Format of the library (AMD, commonjs, etc).
    library: {
      // Using commonjs2 to target NodeJS.
      type: 'commonjs2',
    },
  },
  // Mode to use webpack's built-in optimizations.
  mode: 'production',
  // node18 is the most recent AWS Lambda version.
  target: 'node18',
  // Produce source maps for production. The rule below that refers to source-map-loader
  // collects the source maps created by the TypeScript compiler. The end result is 
  // source maps that point back to the TypeScript source files.
  devtool: 'source-map',
  // Switch to verbose for more information.
  infrastructureLogging: {
    level: 'warn',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        include: [
          // Only source maps from our code.
          path.resolve(__dirname, './dist/src/main'),
        ],
      },
    ],
  },
}