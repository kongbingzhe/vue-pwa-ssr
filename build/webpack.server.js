const { resolve } = require('path');
const VueLoaderPlugin = require('vue-loader-plugin');
const { DefinePlugin, NormalModuleReplacementPlugin } = require('webpack');
const VueSSRDynamicChunkPlugin = require('./VueSSRDynamicChunkPlugin');
const env = {
  development : '"dev"',
  testing : '"test"',
  production: '"prod"',
}
module.exports = {
  entry: { app: resolve(__dirname, '../web/framework/index.js') },
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    path: resolve(__dirname, '../app/view'),
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
  mode: 'development',
  devtool: 'eval',
  target: 'node',
  node: { __filename: false, __dirname: false },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          { loader: 'thread-loader', options: {} },
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
          'vue-style-loader',
          'css-loader',
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
          'vue-style-loader',
          'css-loader',
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
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      EASY_ENV: env[process.env.NODE_ENV],
      EASY_ENV_IS_DEV: process.env.NODE_ENV === 'development'? true :false,
      EASY_ENV_IS_TEST: process.env.NODE_ENV === 'testing'? true :false,
      EASY_ENV_IS_PROD: process.env.NODE_ENV === 'production'? true :false,
      EASY_ENV_IS_BROWSER: false,
      EASY_ENV_IS_NODE: true,
      EASY_ENV_LOCAL_PUBLIC_PATH: '"/public/"',
      EASY_ENV_PUBLIC_PATH: '"/public/"',
      EASY_ENV_HOST_URL: process.env.NODE_ENV === 'development'? '"http://192.168.1.101:9002"' : '""',
      APP_RESOURCE_URL: '"https://ct.getucloud.com/resource"',
      APP_PLATFORM_URL: '"https://it.getucloud.com"'
    }),
    new NormalModuleReplacementPlugin(
      {test:() => {}},
      'node-noop/index.js'
    ),
    new VueSSRDynamicChunkPlugin({
      chunk: true
    }),
  ],
};
