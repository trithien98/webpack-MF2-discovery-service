const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    publicPath: 'auto',
    clean: true
  },
  devServer: {
    port: 2004, 
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
      }
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'UserDetailsMFE',
      filename: 'remoteEntry.js',
      exposes: {
        './MFE': './src/UserDetails'
      },
      shared: {
        'react17': { 
          import: 'react',
          singleton: true,
          requiredVersion: '17.0.2'
        },
        'react17-dom': { 
          import: 'react-dom',
          singleton: true,
          requiredVersion: '17.0.2'
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}; 