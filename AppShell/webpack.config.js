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
        port: 2000,
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
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            name: 'AppShell',
            shared: {
                react: {
                    singleton: true,
                    requiredVersion: '^19.0.0',
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: '^19.0.0',
                },
                'react-router-dom': {
                    singleton: true,
                    requiredVersion: '^6.21.3',
                },
            },
        }),
    ],
};