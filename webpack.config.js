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
        loader: 'babel',
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.css$/,
        loader: 'style!less!css'
      }
    ]
  },
  externals: {
    joi: 'joi',
    joi-browser: 'joi-browser',
    lodash: 'lodash',
    localStore: 'store',
    md5: 'md5',
    SearchBar: 'vstx-search-bar',
    DraggableList: 'vstx-draggable-list',
    LoaderWaveBars: 'vstx-loader-wave-bars'
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
      library: 'DataTable',
    }
  }),
  merge(config, {
    entry: path.resolve(__dirname + '/src/DataTable.vue'),
    output: {
      filename: 'vstx-data-table.js',
      libraryTarget: 'umd',
      library: 'data-table',
      umdNamedDefine: true
    }
  })
];