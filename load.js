'use strict';

// node commonjs entrypoint

require = require('esm')(module);
module.exports = require(process.argv[2]);