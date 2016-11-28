var webpack = require("webpack");
var path = require('path');

module.exports = {
    entry: "./js/main.js",
    output: {
        path: __dirname+"/dist_bundles/",
        publicPath: "/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    sassLoader: {
        includePaths: [
            path.resolve(__dirname, "./node_modules/compass-mixins/lib"),
            path.resolve(__dirname, "./node_modules/breakpoint-sass/stylesheets")
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],

    devtool: "source-map"
};