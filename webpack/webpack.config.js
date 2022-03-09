/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const srcDir = path.join(__dirname, '..', 'src');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    background: path.resolve(srcDir, 'background.ts'),
    popup: path.join(srcDir, 'popup.tsx'),
    options: path.join(srcDir, 'options.tsx'),
    content_script: path.join(srcDir, 'content_script.tsx'),
  },

  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: '[name].js',
  },

  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks(chunk) {
        return chunk.name !== 'background';
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [/node_modules/, /^_test/],
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: '.',
          to: '../',
          context: 'public',
          // filter: async (resourcePath) => {
          //   const excludePatterns = ['_test'];

          //   if (excludePatterns.includes(resourcePath)) {
          //     return false;
          //   }

          //   return true;
          // },
        },
      ],
    }),
  ],
};
