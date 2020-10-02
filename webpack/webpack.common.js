const process = require('process');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('./../package');

const cssExtractLoaderConfig = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        hmr: process.env.NODE_ENV === 'development',
    },
};

module.exports = {
    entry: path.resolve(__dirname, '../', 'src') + '/app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, `../build/${pkg.version}`),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.scss$/,
                use: [cssExtractLoaderConfig, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.less$/,
                use: [cssExtractLoaderConfig, 'css-loader', 'less-loader'],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
    ],
};
