const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "./src/web/assets/styles/bundle.[hash].css",
    disable: process.env.NODE_ENV === "development"
});

const ImageminPlugin = require('imagemin-webpack-plugin').default

module.exports = {
    entry: './app/scripts/main.js',
    output: {
        filename: './src/web/assets/scripts/bundle.js'
    },
    module: {

        loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.coffee$/,
                loader: 'coffee-loader'
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true
                        }
                    }, {
                        loader: "autoprefixer-loader"
                    }, {
                        loader: "sass-loader",
                        options: {
                            includePaths: ["app/styles"]
                        }
                    }],

                    fallback: "style-loader"
                })

            },
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/i,
                loaders: [
                    "file-loader?name=./src/web/assets/[path][name].[ext]&context=./app",
                    {
                        loader: 'image-webpack-loader',
                    }
                ]
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                exclude: /app/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/', // where the fonts will go
                        publicPath: '../' // override the default path
                    }
                }]
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['../src/web/assets/images/', '../src/web/assets/styles/'], {
            watch: false,
            dangerouslyAllowCleanPatternsOutsideProject: true
        }),

        new webpack.ProvidePlugin({ // inject ES5 modules as global vars
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Tether: 'tether',
            Popper: ['popper.js', 'default']
        }),

        new UglifyJSPlugin(),

        extractSass,

        new ManifestPlugin({
            fileName: './src/web/assets/manifest.json',
            filter(file) { return file.name == 'main.css'; }, // Only care about bundle.css
            map(file) { return { name: file.name, path: file.path.slice(10) }; }, // Remove './site/craft/html' from the path
        })
    ]
};