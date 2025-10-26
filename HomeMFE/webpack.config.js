const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced');
const path = require('path');

module.exports = {
    entry: './src/index',
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 2001,
        historyApiFallback: true,
        hot: false,
        liveReload: false
    },
    output: {
        publicPath: 'auto',
        clean: true
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
            name: 'HomeMFE',
            filename: 'remoteEntry.js',
            exposes: {
                './MFE': './src/App'
            },
            shared: {
                'react-router-dom': {
                    singleton: true,
                    requiredVersion: '6.21.3'
                },
                react: { 
                    import: 'react',
                    shareScope: 'react17',
                    singleton: true,
                    requiredVersion: '17.0.2'
                },
                'react-dom': { 
                    import: 'react-dom',
                    shareScope: 'react17',
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