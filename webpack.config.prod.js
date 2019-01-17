const { serve, ...common } = require('./webpack.config.common')

module.exports = {
  ...common,
  mode: 'production',
  output: {
    filename: '[name].[chunkhash].js',
    path: `${__dirname}/dist`,
    publicPath: '/running-stabilizer/'
  },
  optimization: {
    runtimeChunk: 'single',
  },
}
