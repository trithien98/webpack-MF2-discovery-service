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
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
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
                    presets: ['@babel/preset-react', '@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime'],
                },
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            name: 'AppShell',
            filename: 'remoteEntry.js',
            exposes: {
                './EmitterContext': './src/App'
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
                }
            }
        })
    ],
};