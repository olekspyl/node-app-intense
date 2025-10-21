const express = require('express')
const path = require('path')
const errorController = require('./controllers/error')
const { mongoConnect } = require('./utils/database')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const { adminRouter } = require('./routes/admin')
// const { shopRouter } = require('./routes/shop')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
	next()
})

app.use('/admin', adminRouter)
// app.use(shopRouter)

app.use(errorController.get404)

mongoConnect(() => {
	app.listen(3001)
})
