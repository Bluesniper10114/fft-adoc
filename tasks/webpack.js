import path from 'path'
import webpack from 'webpack'
import BundleTracker from 'webpack-bundle-tracker'
import Vue from 'vue'
import entries from 'webpack-entries'
import glob from 'glob'
import $ from "jquery"

let config = {
    context: path.resolve(__dirname, '../'),
    entry: {
        'main': glob.sync('./src/js/app/**/*.*', true)},
    output: {
        path: path.resolve('./dist/app/'),
        filename: "bundle.js",
    },
    plugins: [
      new BundleTracker({filename: './webpack-stats.json'}),
      new webpack.ProvidePlugin({
              $: "jquery",
              jQuery: "jquery"
          })
    ],
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
              options: {
              }
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

function scripts() {

    return new Promise(resolve => webpack(config, (err, stats) => {

        if (err) console.log('Webpack', err)

        console.log(stats.toString({ /* stats options */ }))

        resolve()
    }))
}


module.exports = {config, scripts}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
