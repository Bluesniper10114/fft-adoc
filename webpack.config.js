var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var Vue = require('vue')
var entries = require('webpack-entries')
var glob = require('glob');
var $ = require("jquery");

module.exports = {
  context: __dirname,
  entry: {
      'main': glob.sync('./src/js/**/*.*', true)},
  output: {
      path: path.resolve('./dist/js/app/'),
      filename: "formules.bundle.js",
  },
  plugins: [
    new BundleTracker({filename: './webpack-stats.json'})
  ],
  externals: {
    jquery: 'jQuery'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.sass$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader"
        }, {
            loader: "sass-loader",
            options: {}
        }]
      },
    ]
  },
  resolve: {
    modules: ["node_modules", "bower_components"],
    extensions: ['.js', '.jsx', '.es6.js'],
    alias: {
      vue: 'vue/dist/vue.js',
      jquery: "jquery/src/jquery",
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: false
    })
  ])
}
