var webpack = require('webpack')

var isProd = process.env.NODE_ENV === 'production';
var outputPath = './output/release/dashboard-manage/';

module.exports = {
  entry: {
    'app': './src/js/app.js',
    'login': './src/js/login.js'
  },
  output: {
    path: isProd ? outputPath + 'js' : './output/dev/js',
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    // avoid webpack trying to shim process
    noParse: /es6-promise\.js$/,
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        // excluding some local linked packages.
        // for normal use cases only node_modules is needed.
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          // limit for base64 inlining in bytes
          limit: 10000,
          // custom naming format if file is larger than
          // the threshold
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  watch: !isProd,
  vue: {
    loaders: {
      // html: 'raw'
    }
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }
}

if (isProd) {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
} else {
  module.exports.devtool = '#source-map'
}
