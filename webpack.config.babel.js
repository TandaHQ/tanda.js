// import webpack from 'webpack';
import path from 'path';

const config = {
  entry: [
    'babel-polyfill',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'out'),
    filename: 'tanda.js',
  },
  devTool: 'inline-source-map',
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
