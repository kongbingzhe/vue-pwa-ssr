const { resolve } = require('path');
const isDev = process.env.NODE_ENV === 'development';
const VueLoaderPlugin = require('vue-loader-plugin');
const { HotModuleReplacementPlugin, DefinePlugin } = require('webpack');
const ManifestResourcePlugin = require('webpack-manifest-resource-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const env = {
  development : '"dev"',
  testing : '"test"',
  production: '"prod"',
}
const plugins = isDev ? [
  new HotModuleReplacementPlugin(),
  new WriteFilePlugin()
] : [
  new CleanWebpackPlugin(),
]

module.exports = {
  entry: {
    app: isDev
      ? [
        'webpack-hot-middleware/client?path=http://192.168.1.101:9000/__webpack_hmr&noInfo=false&reload=false&quiet=false',
        resolve(__dirname, '../web/framework/index.js'),
      ]
      : resolve(__dirname, '../web/framework/index.js'),
  },
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/chunk/[name].js',
    path: resolve(__dirname, '../public'),
    publicPath: '/public/',
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue: 'vue/dist/vue.runtime.common.js',
      asset: resolve(__dirname, '../web/asset'),
      framework: resolve(__dirname, '../web/framework'),
      '@': resolve(__dirname, '../web'),
      page: resolve(__dirname, '../web/page'),
      components: resolve(__dirname, '../web/components'),
    },
  },
  optimization: {
    minimize: isDev? false : true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
    runtimeChunk: { name: 'runtime' },
    splitChunks: {
      name: false,
      chunks: 'all',
      minSize: 10000,
      minChunks: 1,
      cacheGroups: {
        default: false,
        vendors: { name: 'common', chunks: 'all', minChunks: 1 },
      },
    },
  },
  resolveLoader: {
    modules: ['node_modules'],
  },
  stats: {
    colors: true,
    children: false,
    modules: false,
    chunks: false,
    chunkModules: false,
    entrypoints: false,
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval' : false,
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              envName: 'web',
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.vue$/i,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { options: isDev ? { sourceMap: true } : {}, loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { options: isDev ? { sourceMap: true } : {}, loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          'less-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // { test: {}, use: [{ loader: "vue-html-loader", options: {} }] },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    ...plugins,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static/**/*',
          to({ context, absoluteFilename }) {
            console.log(absoluteFilename);
            return absoluteFilename.replace('static', 'public');
          }
        }
      ]
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      EASY_ENV: env[process.env.NODE_ENV],
      EASY_ENV_IS_DEV: isDev? true : false,
      EASY_ENV_IS_TEST: process.env.NODE_ENV === 'testing' ? true : false,
      EASY_ENV_IS_PROD: process.env.NODE_ENV === 'production' ? true : false,
      EASY_ENV_IS_BROWSER: true,
      EASY_ENV_IS_NODE: false,
      EASY_ENV_LOCAL_PUBLIC_PATH: '"/public/"',
      EASY_ENV_PUBLIC_PATH: '"/public/"',
      EASY_ENV_HOST_URL: isDev ? '"http://192.168.1.101:9002"' : '""',
      APP_RESOURCE_URL: '"https://ct.getucloud.com/resource"',
      APP_PLATFORM_URL: '"https://it.getucloud.com"'
    }),
    new ManifestResourcePlugin({
      buildPath: resolve(__dirname, '../public'),
      fileName: '../config/manifest.json',
      commonsChunk:['runtime','default','common'],
      writeToFileEmit:true,
      assets:false,
    }),
    new InjectManifest({
      mode: process.env.NODE_ENV,
      swSrc: resolve(__dirname, '../web/framework/sw.js')
    }),
    new MiniCssExtractPlugin({
      filename: isDev ?  'css/[name].css' : 'css/[name].[contenthash:8].css',
      ignoreOrder:  false,
      chunkFilename: isDev ? 'css/[id].css' : 'css/[id].[contenthash:8].css',
    }),
  ],
};
