const path = require('path');

module.exports = {
  entry: [
    './js/game.js',
    './js/stat.js',
    './js/data.js',
    './js/util.js',
    './js/backend.js',
    './js/script.js',
    './js/setup.js',
    './js/render.js',
    './js/avatar.js',
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname),
    iife: true,
  },
  devtool: false,
};
