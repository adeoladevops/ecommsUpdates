const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust to your app's entry point
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  mode: 'production'
};
