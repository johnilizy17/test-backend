const express = require('express');
const app = express.Router();

require('./endpoints/User')(app);
require('./endpoints/Loan')(app);

module.exports = app;