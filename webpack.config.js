var path = require("path");
var webpack = require("webpack");

var isProd = process.env.NODE_ENV === "production";
var outputFolder = isProd ? "dist" : "build";


module.exports = {
  devtool: "eval",
  entry: [
    "webpack-dev-server/client?http://localhost:3000",
    "./src/index"
  ],
  output: {
    path: path.join(__dirname, outputFolder),
    filename: "app.js",
    publicPath: "/"
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __PRODUCTION__: isProd,
    })
  ],
  module: {
    preLoaders: [
    {
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules/
    }
    ],
    loaders: [
    {
        test: /\.js$/,
        loader: "babel?optional[]=runtime&stage=1",
        exclude: /node_modules/
    }
    ]
  }
};
