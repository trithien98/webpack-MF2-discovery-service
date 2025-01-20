const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('@module-federation/enhanced').ModuleFederationPlugin;
const path = require('path');

module.exports = {
    entry: './src/index',
    mode: 'development',
    devServer: {
        static: {
        directory: path.join(__dirname, 'dist'),
        },
        port: 2001,
    },
    output: {
        publicPath: 'auto',
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
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new ModuleFederationPlugin({
            name: 'HomeMFE',
            filename: 'remoteEntry.js',
            exposes: {
                './MFE': './src/App.js',
            },
            shared: {
                react: {
                    singleton: true,
                },
                'react-dom': {
                    singleton: true,
                },
                'react-router-dom': {
                    singleton: true,
                },
            },
        }),
    ],
};