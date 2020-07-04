// ******************************************
// SERVER INITIALIZATION
// ******************************************
const http = require('http');
const app = require('./app');
const { debug } = require('console');

// *********** NORMALIZE PORTS **************
const normalizePort = (value) => {
	const port = parseInt(value, 10);
	if (isNaN(port)) return value;
	if (port >= 0) return port;
	return false;
};

const onListening = () => {
	const addr = server.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
	debug('Server is listening on ' + bind);
};

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

// *********** CREATE THE SERVER ************
const server = http.createServer(app);
server.on('listening', onListening);
server.listen(port);
