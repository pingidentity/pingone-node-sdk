/*
 * This config builds a minified version that can be imported
 * anywhere without any dependencies.
 */
const path = require("path");
const webpack = require("webpack");
const SDK_VERSION = require("./package.json").version;

module.exports = {
    target: "node",
    entry: "./src/api.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "@pingone/nodejs-sdk-api.min.js",
        library: "PingOneAuth",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: "pre",
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env"],
                        plugins: ["@babel/plugin-transform-runtime"],
                        sourceType: "unambiguous"
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            SDK_VERSION: JSON.stringify(SDK_VERSION)
        })
    ],
    // Excluding dependencies from the output bundles.
    // Instead, the created bundle relies on that dependency to be present in the consumer's environment
    externals: ["tls", "net", "fs"],
    devtool: "source-map"
};
