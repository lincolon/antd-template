

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const projectConfig = require('../project.config.json');

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
    entry: path.resolve(__dirname, '..', 'src/app.js'),
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        clean: true,
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    resolve:{
        extensions:['.js','.jsx','.json'],//这几个后缀名的文件后缀可以省略不写
        alias:{
            '@':path.join(__dirname, '../src'), //这样 @就表示根目录src这个路径
            '@modules': path.join(__dirname, '../node_modules'),
            '@service': path.join(__dirname, '../src/service'),
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    "postcss-preset-env",
                                ]
                            }
                        }
                    },
                ],
            },
            {
                test: /\.less$/i,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    "postcss-preset-env",
                                ]
                            }
                        }
                    }, 
                    {
                        loader: "less-loader", 
                        options: {
                            lessOptions:{
                                javascriptEnabled:true,
                                modifyVars: projectConfig.theme,
                            }
                        }
                    }
                ],
            },
            {
                test: /\.js(x)?$/i,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": [
                            [
                                "@babel/preset-env", 
                                {
                                    "targets": "> 0.25%, not dead" 
                                }   
                            ], 
                            [
                                "@babel/preset-react",
                                {
                                    "runtime": "automatic"
                                }
                            ]
                        ],
                        "plugins": [
                            "@babel/plugin-transform-runtime",
                        ],
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(csv|tsv)$/i,
                use: ['csv-loader'],
            },
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
            linkType: false,
        }),
        new HtmlWebpackPlugin({
            title: projectConfig.name,
            template: path.resolve(__dirname, '..', 'public/index.ejs')
        }),
    ]
}