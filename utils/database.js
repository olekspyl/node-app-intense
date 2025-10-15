const mysql = require('mysql2')

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	database: 'node_complete',
	password: 'Sonce123_+',
})

module.exports = pool.promise()
