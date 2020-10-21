const path = require('path');
const { merge } = require('webpack-merge');
const commonWebpackConfig = require('./webpack.common.js');
const pkg = require('./../package.json');

module.exports = merge(commonWebpackConfig, {
    mode: 'production',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, `../build/${pkg.version}`),
    },
});
