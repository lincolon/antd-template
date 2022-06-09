const merge = require('webpack-merge').merge;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const common = require('./webpack.default.js');

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                // minify: TerserPlugin.swcMinify,
                extractComments: false,
            }),
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
})