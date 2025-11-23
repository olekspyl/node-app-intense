const express = require('express')
const path = require('path')
const errorController = require('./controllers/error')
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)
// const { mongoConnect } = require('./utils/database')
const User = require('./models/user')
const mongoose = require('mongoose')

const MONGODB_URI =
	'mongodb+srv://lemocream_db_user:PiNygYbhaAv9FZUe@cluster0.4ocf7qi.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
const app = express()
const store = new MongoDBSession({
	uri: MONGODB_URI,
	collection: 'sessions',
})

app.set('view engine', 'ejs')
app.set('views', 'views')

const { adminRouter } = require('./routes/admin')
const { shopRouter } = require('./routes/shop')
const { authRouter } = require('./routes/auth')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
)

app.use((req, res, next) => {
	if (!req.session.user) {
		return next()
	}
	User.findById(req.session.user._id)
		.then(user => {
			req.user = user
			next()
		})
		.catch(err => {
			console.log(err)
		})
})

app.use('/admin', adminRouter)
app.use(shopRouter)
app.use(authRouter)

app.use(errorController.get404)

mongoose
	.connect(MONGODB_URI)
	.then(result => {
		User.findOne().then(user => {
			if (!user) {
				const user = new User({
					name: 'Max',
					email: 'email@email.com',
					cart: { items: [] },
				})
				user.save()
			}
		})

		app.listen(3001)
	})
	.catch(err => console.log(first))
