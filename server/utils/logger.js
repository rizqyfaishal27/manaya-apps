const chalk = require('chalk');
 
module.exports = {
	error: function(error) {
		console.log(chalk.red(error));
	},
	appStarted: function(port, ngrokTunnelUrl) {
		console.log(chalk.blue(`\tApp started at localhost:${port}`));
		if(ngrokTunnelUrl) {
			console.log(chalk.green(`\tNgrok url:${ngrokTunnelUrl}`));
		}
	}	
}