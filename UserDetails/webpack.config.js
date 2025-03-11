const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:2004/',
  },
  devServer: {
    port: 2004,
    historyApiFallback: {
      index: '/index.html',
    },
  },
  module: {
    rules: [
        {
            test: /\.m?js$/,
            type: 'javascript/auto',
            resolve: {
            fullySpecified: false,
            },
        },
        {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
            presets: ['@babel/preset-react'],
            },
        }],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'UserDetailsMFE',
      filename: 'remoteEntry.js',
      exposes: {
        './MFE': './src/App',
      },
      shared: {
        react: {
          singleton: true,
          // requiredVersion: "^19.0.0",
        },
        "react-dom": {
          singleton: true,
          // requiredVersion: "^19.0.0",
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}; 