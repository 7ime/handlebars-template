const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(appDirectory, relativePath);

const mode = process.env.NODE_ENV;
const devMode = (mode === 'development');

const pages = [];

const fileNamesForTemplates = fs.readdirSync(resolvePath('src/templates'));

fileNamesForTemplates && fileNamesForTemplates.forEach((fileName) => {
    if(fileName.match(/\.handlebars/)) {
        pages.push(fileName.split('.')[0])
    }
});

const prodPlugins = [
    new CleanWebpackPlugin(),
    new CopyPlugin([
        {
            from: resolvePath('src/images/**/*'),
            to: resolvePath('dist/static/')
        }
    ]),
];

const devPlugins = [];

const commonPlugins = [
    new webpack.LoaderOptionsPlugin({
        options: {
            handlebarsLoader: {

            }
        }
    }),
    new MiniCssExtractPlugin({
        filename: devMode ? 'main.css' : 'main.[contenthash:8].css'
    }),
    ...pages.map((pageName) => {
        return new HtmlWebpackPlugin({
            filename: `${pageName}.html`,
            templateParameters: require(resolvePath(`src/data/${pageName}.js`)),
            template: resolvePath(`src/templates/${pageName}.handlebars`),
        })
    })
];

let plugins = commonPlugins.concat(devMode ? devPlugins : prodPlugins);

module.exports = {
    context: resolvePath('src'),
    entry: resolvePath('src/js/index.js'),
    output: {
        filename: devMode ? '[name].bundle.js' : '[name].[contenthash:8].bundle.js',
        path: resolvePath('dist')
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.handlebars$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: "handlebars-loader"
                    }
                ]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env', {
                                    modules: false
                                }
                                ]
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-object-rest-spread',
                                "@babel/plugin-transform-react-constant-elements"
                            ]
                        }
                    }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: devMode,
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                oneOf: [
                    {
                        test: /\.(bmp|gif|jpe?g|svg|png)$/,
                        use: [
                            {
                                loader: "file-loader",
                                options: {
                                    name: '[name].[ext]',
                                    outputPath: 'static/images',
                                    useRelativePath: true
                                }
                            },
                            {
                                loader: 'image-webpack-loader'
                            }
                        ]
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/,
                        loader: 'file-loader',
                        options: {
                            name: `static/fonts/[name].[hash:8].[ext]`,
                        },
                    },
                    {
                        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.handlebars$/, /\.html$/, /\.json$/, /\.(sa|sc|c)ss$/],
                        loader: 'file-loader',
                        options: {
                            name: `static/other/[name].[hash:8].[ext]`,
                        },
                    },
                ]
            }
        ]
    },
    plugins: plugins,
    devServer: {
        contentBase: resolvePath('src'),
        port: 8081,
        hot: true,
        open: false,
        publicPath: '/',
        watchContentBase: true,
        historyApiFallback: true,
        watchOptions: {
            ignored: /node_modules/
        }
    },
    devtool: devMode && 'inline-source-map',
};

