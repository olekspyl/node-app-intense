const express = require('express')
const path = require('path')
require('dotenv').config({ quiet: true })
const errorController = require('./controllers/error')
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
// const { mongoConnect } = require('./utils/database')
const User = require('./models/user')
const mongoose = require('mongoose')

const csrfProtection = csrf()
const app = express()
const store = new MongoDBSession({
	uri: process.env.MONGODB_URI,
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
app.use(csrfProtection)
app.use(flash())

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

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn
	res.locals.csrfToken = req.csrfToken()
	next()
})

app.use('/admin', adminRouter)
app.use(shopRouter)
app.use(authRouter)

app.use(errorController.get404)

mongoose
	.connect(process.env.MONGODB_URI)
	.then(result => {
		app.listen(3001)
	})
	.catch(err => console.log(first))
