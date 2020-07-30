require('dotenv').config();

const server = require('./server.js');

const port = process.env.PORT || 8000;

console.log('port:', port)

server.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});