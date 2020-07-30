require('dotenv').config();

const server = require('./server.js');

console.log('port:', port)

const port = process.env.PORT || 8000;

server.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});