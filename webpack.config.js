const path = require("path");
// import path from 'path';

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "./src/index.tsx"),
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                // Typescript loader
                test: /\.tsx?$/,
                exclude: /(node_modules|\.webpack)/,
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                    },
                },
            },
            {
                test: /\.s?css$/,
                use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
            },
            {
                test: /\.(jpe?g|gif|png|svg)$/i,
                use: [
                {
                  loader:"url-loader",
                  options: {
                    limit: 10000
                  }
                }
              ]
            }
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js",".jsx"],
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        historyApiFallback: true,
        open: true
    },
    output: {
        filename: "bundle.js",
        publicPath: "/",
        path: path.resolve(__dirname, "./dist"),
    },
};