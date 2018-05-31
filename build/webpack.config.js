const path = require("path");
const eslintFriendlyFormatter = require("eslint-friendly-formatter");

const WebpackConfig = {
  context: __dirname,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(js|vue)$/,
        loader: "eslint-loader",
        enforce: "pre",
        options: {
          formatter: eslintFriendlyFormatter
        }
      },
      {
        test: /\.js/,
        loaders: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.sass$/,
        loaders: ['sass-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: ['css-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loaders: ["vue-loader"],
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      vue: "vue/dist/vue.js"
    }
  },

  entry: "./src/plugin.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js",
    publicPath: "/dist/"
  },

  devServer: {
    contentBase: __dirname,
    port: 2000
  }
}

module.exports = WebpackConfig
