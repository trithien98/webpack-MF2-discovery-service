const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    publicPath: 'auto',
    clean: true
  },
  devServer: {
    port: 2004,  // Assuming this is the port for UserDetails
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
        './MFE': './src/UserDetails',  // Expose UserDetails directly
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
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}; 