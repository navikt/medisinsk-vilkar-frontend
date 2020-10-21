const process = require('process');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssExtractLoaderConfig = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        hmr: process.env.NODE_ENV === 'development',
    },
};

const CORE_DIR = path.resolve(__dirname, '../node_modules');
const SRC_DIR = path.resolve(__dirname, '../src');

module.exports = {
    entry: path.resolve(__dirname, '../', 'src') + '/app.ts',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.less'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                },
                include: [SRC_DIR],
            },
            {
                test: /\.scss$/,
                use: [cssExtractLoaderConfig, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.less$/,
                use: [
                    cssExtractLoaderConfig,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[name]_[local]_[contenthash:base64:5]',
                            },
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                modules: true,
                                localIdentName: '[name]_[local]_[contenthash:base64:5]',
                                modifyVars: {
                                    nodeModulesPath: '~',
                                    coreModulePath: '~',
                                },
                            },
                        },
                    },
                ],
                exclude: [CORE_DIR],
            },
            {
                test: /\.(less|css)?$/,
                use: [
                    cssExtractLoaderConfig,
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                modifyVars: {
                                    nodeModulesPath: '~',
                                    coreModulePath: '~',
                                },
                            },
                        },
                    },
                ],
                include: [CORE_DIR],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
    ],
};
