const path = require('path');
const compression = require('compression');
const express = require('express');

module.exports = function createProdConfig(app) {
	const buildPath = path.resolve(process.cwd(), 'dist');

	app.use(compression());
	app.use(express.static(buildPath));
	app.get('*', function(req, res) {
		return res.sendFile(path.resolve(buildPath, 'index.html'));
	})

  return app;
}
