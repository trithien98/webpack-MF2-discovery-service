const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    publicPath: 'auto',
    clean: true
  },
  devServer: {
    port: 2003,
    historyApiFallback: true,
    hot: false,
    liveReload: false
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
      name: 'myAccountMFE',
      filename: 'remoteEntry.js',
      exposes: {
        './MFE': './src/MyAccount',
      },
      shared: {
        react: { 
          singleton: true,
          eager: true,
          requiredVersion: '18.2.0'
        },
        'react-dom': { 
          singleton: true,
          eager: true,
          requiredVersion: '18.2.0'
        },
        'react-router-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '6.21.3'
        },
        tseep: {
          singleton: true,
          eager: true
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}; 