const minimist = require('minimist');
const lodash = require('lodash');
const argv = minimist(process.argv.slice(2));

module.exports = lodash.isUndefined(argv.p) ? 8080 : argv.p;
