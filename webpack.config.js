const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const cssGlobalVars = require('medici-ui-kit/assets/css-global-vars');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

const assetsImgOptions = {
    name: '[name].[contenthash:6].[ext]',
    outputPath: 'react-assets/images',
};

const extractLESSconfig = new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
});

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    inject: 'body',
});

const cleanPluginConfig = new CleanWebpackPlugin();

const plugins = [
    cleanPluginConfig,
    HtmlWebpackPluginConfig,
    extractLESSconfig,
    new CopyPlugin([
        { from: './src/assets', to: './' },
    ]),
];

const config = {
    mode: process.env.NODE_ENV,
    entry: {
        main: ['./src/index.tsx'],
    },
    devtool: isProduction ? false : 'source-map',

    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules'),
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.less', '.gif'],
    },

    optimization: {
        minimize: isProduction,
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                // exclude: /node_modules(?!\/medici-ui-kit)/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            allowTsInNodeModules: true,
                        },
                    },
                ],
            },
            {
                test: /\.(less|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDevelopment,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            // modules: true,
                        },
                    },
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            globalVars: cssGlobalVars,
                        },
                    },
                ],
            },
            {
                test: /\.(jpg|png|gif|ico)$/,
                use: {
                    loader: 'file-loader',
                    options: assetsImgOptions,
                },
            },
            {
                test: /\.(svg)$/,
                issuer: {
                    test: /\.(less|css)?$/,
                },
                use: {
                    loader: 'file-loader',
                    options: assetsImgOptions,
                },
            },
            {
                test: /\.(svg)$/,
                issuer: {
                    test: /\.ts(x?)$/,
                },
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: {
                            multiple: [
                                { search: cssGlobalVars.colorBasicFirst, replace: 'var(--fill-color', flags: 'g' },
                                { search: cssGlobalVars.colorWhite, replace: 'var(--back-color', flags: 'g' },
                                { search: 'white', replace: 'var(--back-color)', flags: 'g' },
                                { search: '#fff', replace: 'var(--back-color)', flags: 'g' },
                                { search: '#FFF', replace: 'var(--back-color)', flags: 'g' },
                            ],
                        },
                    },
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgoConfig: {
                                plugins: {
                                    removeViewBox: false,
                                },
                            },
                        },
                    },
                ],
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    plugins,

    devServer: {
        historyApiFallback: true,
        hot: true,
        host: 'localhost',
        port: '8003',
        https: false,
        compress: true,
    },
};

if (process.env.WATCHER === 'true') {
    config.watch = true;
    config.watchOptions = {
        aggregateTimeout: 300,
        poll: 1000,
    };
}

module.exports = config;
