const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "util": require.resolve("util/")
    }
  },
  module: {
    rules: [
      // Add other rules here if needed
    ]
  },
  // Add other configurations if necessary
};
