const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

module.exports = function createDevConfig(app) {
	const webpackConfig = require('../../webpack.dev.js');
	const compiler = webpack(webpackConfig);

	app.use(webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath,
		silent: true,
		logLevel: 'warn',
		stats: 'errors-only'
	}));
  
  app.use(webpackHotMiddleware(compiler));

	app.get('*', function(req, res) {
		res.sendFile(path.resolve(compiler.outputPath, 'index.html'));
	})

	return app;
}
