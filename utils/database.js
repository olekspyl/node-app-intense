// const Sequelize = require('sequelize')
// const sequelize = new Sequelize('node_complete', 'root', 'Sonce123_+', {
// 	dialect: 'mysql',
// 	host: 'localhost',
// })

// module.exports = sequelize

const mongodb = require('mongodb')
const MongoCLient = mongodb.MongoClient

const mongoConnect = callback => {
	MongoCLient.connect(
		'mongodb+srv://lemocream_db_user:PiNygYbhaAv9FZUe@cluster0.4ocf7qi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
	)
		.then(client => {
			console.log('connected')
			callback(client)
		})
		.catch(err => console.log(err))
}

module.exports = mongoConnect
