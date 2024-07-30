const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  watch: false,
  target: 'node',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src/infra/doc/index.html',
          to: 'src/infra/doc/index.html',
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: __dirname,
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
        include: __dirname,
        exclude: /node_modules/,
      },
      {
        test: /\.(yml|yaml)$/,
        use: ['json-loader', 'yaml-loader'],
        include: __dirname,
        exclude: /node_modules/,
      },
    ],
  },
  externals: ['pg', 'sqlite3', 'tedious', 'pg-hstore'],
  output: {
    pathinfo: false,
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  optimization: {
    minimize: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
};
