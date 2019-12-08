const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {

    watch: process.argv[3] === 'production' ? false : true,

    target: 'electron-renderer',

    entry: {
        main: './app/src/index.js',
        window: './app/src/window.js'
    },

    output: {
        path: __dirname + '/app/build',
        publicPath: 'build/',
        filename: '[name].bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
            },
            {
              test: /\.css$/,
              use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin({
            filename: '[name].bundle.css',
            disable: false,
            allChunks: true
        })
    ],

    resolve: {
      extensions: ['.js', '.json', '.jsx']
    }

}
