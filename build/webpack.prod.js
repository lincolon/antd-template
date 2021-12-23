const merge = require('webpack-merge').merge;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const common = require('./webpack.default.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
    ]
})