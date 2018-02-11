const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

var config = {
  output: {
    path: path.resolve(__dirname + '/dist/'),
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
    lodash: 'lodash',
    md5: 'md5',
    moment: 'moment',
    vstxDraggableList: 'vstx-draggable-list',
    vstxLoader: 'vstx-loader',
    vstxSearchBar: 'vstx-search-bar',
    vstxSelect: 'vstx-select',
    xlsx: 'xlsx'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin( {
      minimize : true,
      sourceMap : false,
      mangle: true,
      compress: {
        warnings: false
      }
    } )
  ]
};


module.exports = [
  merge(config, {
    entry: path.resolve(__dirname + '/src/plugin.js'),
    output: {
      filename: 'vstx-data-table.min.js',
      libraryTarget: 'window',
      library: 'vstxDataTable',
    }
  }),
  merge(config, {
    entry: path.resolve(__dirname + '/src/vstxDataTable.vue'),
    output: {
      filename: 'vstx-data-table.js',
      libraryTarget: 'umd',
      library: 'vstx-data-table',
      umdNamedDefine: true
    }
  })
];