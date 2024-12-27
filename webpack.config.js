// config file use common js syntax

const path= require('path');
const hwp= require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports= {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'bundle.js'
    },
    devServer:{
        static: {
            directory: path.resolve(__dirname,'dist'),//This specifies the directory (dist in this case) that the dev server will serve as the base for static files. Any files in the dist directory will be accessible via the server, such as images, fonts, or other assets.
        },
            
            port: 3000,//By default, Webpack Dev Server runs on port 8080, but this allows you to customize it.

            open: true,//Automatically opens the default web browser to the server's URL when the dev server starts.

            hot: true,//Hot Module Replacement (HMR), which allows modules to be updated in the browser without a full page reload.

            compress: true,//improve the loading speed of files by reducing their size, though it's primarily beneficial for production-like environments.

            historyApiFallback: true,//If the server gets a request for a route like /about and can't find a physical file at that path, it automatically serves index.html instead. The browser then loads index.html, and your SPA's client-side routing takes over.The JavaScript code for your app parses the URL (/about in this case) and displays the correct content.

    },
    module:{
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: // can be an array or an object
                {
                    loader: 'babel-loader',
                    options:{
                        presets: ['@babel/preset-env'],
                    }
                }
            },
        ]
    },

    plugins: [
        new hwp({
            title: 'Webpack App',
            filename: 'index.html',
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin(),
    ]
}