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
    joi: 'joi',
    joiBrowser: 'joi-browser',
    lodash: 'lodash',
    localStore: 'store',
    md5: 'md5',
    SearchBar: 'vstx-search-bar',
    // DraggableList: 'vue-stacks-draggable-list',
    // LoaderWaveBars: 'vue-stacks-wave-bars'
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