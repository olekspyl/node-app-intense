const mongodb = require('mongodb')
const MongoCLient = mongodb.MongoClient

let db

const mongoConnect = callback => {
	MongoCLient.connect(
		'mongodb+srv://lemocream_db_user:PiNygYbhaAv9FZUe@cluster0.4ocf7qi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
	)
		.then(client => {
			console.log('connected')
			db = client.db()
			callback()
		})
		.catch(err => {
			console.log(err)
			throw err
		})
}

const getDb = () => {
	if (db) {
		return db
	}
	throw 'No database found'
}

module.exports = { mongoConnect, getDb }
