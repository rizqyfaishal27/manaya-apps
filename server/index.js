const express = require('express');
const isDev = process.env.NODE_ENV === 'development';
const ngrok = isDev && process.env.ENABLE_TUNNEL ? require('ngrok') : false;
const port = process.env.PORT || require('./utils/port');
const logger = require('./utils/logger');


let app = express();

if(isDev) {
	const createDevConfig = require('./config/dev');
	app = createDevConfig(app);
} else {
	const createProdConfig = require('./config/prod');
	app = createProdConfig(app);
}

app.listen(port, async function() {
	if(ngrok) {
		try {
			const ngrokUrl = await ngrok.connect(port);
			logger.appStarted(port, ngrokUrl);
		} catch(error) {
			logger.error(error);
		}
	} else {
		logger.appStarted(port, null);
	}
})
