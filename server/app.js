const express = require('express');
const { ModuleResolutionKind } = require('typescript');
const app = express();

app.get('/', (req, res, next) => {
	res.send('here');
});

module.exports = app;
