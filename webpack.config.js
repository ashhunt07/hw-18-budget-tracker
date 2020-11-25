const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    entry: {
        index: "./public/index.js",
        db: "./public/db.js"
    },
    output: {
        path: __dirname + "/public/dist",
        filename: "[name].bundle.js",
    },
    mode: "development",

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
            },
        }, ],
    },

    plugins: [
        new WebpackPwaManifest({
            filename: "manifest.json",
            inject: false,
            fingerprints: false,
            name: "Budget Tracker",
            short_name: "Budget",
            background_color: "#ffffff",
            start_url: "/",
            display: "standalone",

            icons: [{
                src: path.resolve(__dirname, "./public/icons/icon-512x512.png"),
                sizes: [96, 128, 192, 256, 384, 512]
            }, ],
        }),
    ],
};

module.exports = config;