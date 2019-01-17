const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const history = require('connect-history-api-fallback')
const proxy = require('http-proxy-middleware')
const convert = require('koa-connect')
const common = require('./webpack.config.common')

module.exports = {
  ...common,
  plugins: [
    ...common.plugins,
    new BundleAnalyzerPlugin(),
  ],
  serve: {
    content: [__dirname],
    add: app => {
      app.use(convert(proxy('/api', { target: 'http://localhost:8081' })))
      app.use(convert(history()))
    },
  },
}
