const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var config = {
  output: {
    path: path.resolve(`${__dirname}/dist/`)
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        loader: 'css-loader'
      },
      {
        test: /\.sass$/,
        loader: 'sass-loader'
      }
    ]
  },
  externals: {
    accounting: 'accounting',
    joi: 'joi',
    joiBrowser: 'joi-browser',
    localforage: 'localforage',
    md5: 'md5',
    moment: 'moment',
    'bulma': 'bulma',
    'vue-worker': 'vue-worker',
    'vue-async-computed': 'vue-async-computed',
    'vstx-draggable-list': 'vstx-draggable-list',
    'vstx-loader': 'vstx-loader',
    'vstx-search-bar': 'vstx-search-bar',
    'vstx-select': 'vstx-select',
    '@fortawesome/fontawesome-free-solid': '@fortawesome/fontawesome-free-solid',
    '@fortawesome/fontawesome': '@fortawesome/fontawesome',
    '@fortawesome/vue-fontawesome': '@fortawesome/vue-fontawesome'
  },
  plugins: [
    new UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    new BundleAnalyzerPlugin({})
  ]
}

module.exports = [
  merge(config, {
    entry: path.resolve(`${__dirname}/src/plugin.js`),
    output: {
      filename: 'vstx-data-table.min.js',
      libraryTarget: 'window',
      library: 'vstxDataTable'
    }
  }),
  merge(config, {
    entry: path.resolve(`${__dirname}/src/vstxDataTable.vue`),
    output: {
      filename: 'vstx-data-table.window.js',
      libraryTarget: 'window',
      library: 'vstx-data-table'
    }
  }),
  merge(config, {
    entry: path.resolve(`${__dirname}/src/vstxDataTable.vue`),
    output: {
      filename: 'vstx-data-table.js',
      libraryTarget: 'umd',
      library: 'vstx-data-table',
      umdNamedDefine: true
    }
  }),
  merge(config, {
    entry: path.resolve(`${__dirname}/src/plugin.js`),
    output: {
      filename: 'vstx-data-table-install.js',
      libraryTarget: 'umd',
      library: 'vstx-data-table',
      umdNamedDefine: true
    }
  })
]
