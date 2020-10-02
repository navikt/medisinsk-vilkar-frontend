const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const commonWebpackConfig = require('./webpack.common.js');

const webpackConfig = merge(commonWebpackConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html'),
        }),
    ],
});

const devServerOptions = { hot: true };
WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);
const devServer = new WebpackDevServer(webpack(webpackConfig), devServerOptions);

devServer.listen(8080, 'localhost', (error) => {
    if (error) {
        return console.error(error);
    }
    console.log('Listening at port 8080');
});
