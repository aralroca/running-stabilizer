const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const DuplicatePlugin = require('duplicate-package-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressPlugin = require('compression-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const initPage = path.resolve(__dirname, 'src/index.html')

module.exports = {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  output: {
    filename: '[name].js',
    path: `${__dirname}/dist`,
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff(2)|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Running stabilizer',
      template: initPage,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    // new FaviconsWebpackPlugin({
    //   logo: `${__dirname}/src/assets/images/logo.svg`,
    //   persistentCache: true,
    // }),
    new DuplicatePlugin(),
    new CompressPlugin(),
  ],
}
