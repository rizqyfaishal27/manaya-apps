const merge = require('webpack-merge');
const baseConfig  = require('./webpack.base');

module.exports = merge(baseConfig, {
	mode: 'development',
	devtool: 'cheap-source-map',
	devServer: {
    contentBase: './www',
    hot: true,
    historyApiFallback: true,
    inline: true,
    progress: true,

      // Display only errors to reduce the amount of output.
    stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
    host: process.env.HOST,
    port: process.env.PORT,
	}
});
