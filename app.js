const express = require('express')
const path = require('path')
const errorController = require('./controllers/error')
const db = require('/utils/database')
// const expressHbs = require('express-handlebars')

const app = express()

// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: "main-layout", extname: 'hbs'}))
app.set('view engine', 'ejs')
app.set('views', 'views')

const { adminRouter } = require('./routes/admin')
const clientRoutes = require('./routes/shop')

db.execute('SELECT * FROM products').then().catch()

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRouter)
app.use(clientRoutes)

app.use(errorController.get404)

app.listen(3000)
