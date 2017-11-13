import path from 'path';

const config = {
  entry: {
    tanda: ['babel-polyfill', './src/index.js'],
    browser: ['./tools/browser.js'],
  },
  output: {
    path: path.join(__dirname, 'out'),
    filename: '[name].js',
  },
  devTool: 'source-map',
  resolve: {
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
};

if (process.env.BUILD_ENV === 'server') {
  config.target = 'node';
}

export default config;
