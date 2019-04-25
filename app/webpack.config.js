const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "./src/web/assets/styles/bundle.css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: [
        // Set up an ES6-ish environment
        "core-js/shim",

        // Add your application's scripts below
        "./scripts/main.js"
    ],
    output: {
        filename: "./src/web/assets/scripts/bundle.js"
    },
    watchOptions: {
        ignored: /node_modules/
    },
    resolve: {
        unsafeCache: true
    },
    module: {
        loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: [
                        "es2015-ie", [
                            "env",
                            {
                                targets: {
                                    browsers: ["last 2 versions", "ie >= 11"]
                                },
                                include: ["transform-es2015-classes"]
                            }
                        ]
                    ],
                    plugins: [
                        "transform-runtime",
                        "transform-es3-property-literals",
                        "transform-es3-member-expression-literals",
                        "babel-plugin-transform-es2015-parameters",
                        "babel-plugin-transform-es2015-destructuring"
                    ]
                }
            },
            {
                test: /\.coffee$/,
                loader: "coffee-loader",
                options: {
                    sourceMap: true
                }
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                            loader: "css-loader",
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: "autoprefixer-loader"
                        },
                        {
                            loader: "resolve-url-loader"
                        },

                        {
                            loader: "sass-loader",
                            options: {
                                includePaths: ["app/styles"],
                                sourceMap: true
                            }
                        }
                    ],

                    fallback: "style-loader"
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg|xml|ico)$/i,
                exclude: /node_modules/,
                loaders: [
                    "file-loader?name=./src/web/assets/[path][name].[ext]&context=./app",
                    {
                        loader: "image-webpack-loader"
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
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(
            [
                "./src/web/assets/images/",
                "./src/web/assets/fonts/",
                "./src/web/assets/plugins/"
            ], {
                watch: false,
                dangerouslyAllowCleanPatternsOutsideProject: true,
            }
        ),

        new webpack.ProvidePlugin({
            // inject ES5 modules as global vars
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Tether: "tether",
            Popper: ["popper.js", "default"]
        }),

        // new UglifyJSPlugin(),

        extractSass,

        new CopyWebpackPlugin([{
                from: "fonts/",
                to: "./src/web/assets/fonts/"
            },
            {
                from: "plugins/",
                to: "./src/web/assets/plugins/"
            }
        ])

        // new UglifyJSPlugin()
    ]
};