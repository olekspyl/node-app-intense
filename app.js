const express = require('express')
const path = require('path')
const errorController = require('./controllers/error')
const sequelize = require('./utils/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const { adminRouter } = require('./routes/admin')
const { shopRouter } = require('./routes/shop')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
	User.findByPk(1)
		.then(user => {
			req.user = user
			next()
		})
		.catch(err => console.log(err))
})

app.use('/admin', adminRouter)
app.use(shopRouter)

app.use(errorController.get404)

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
Order.belongsToMany(Product, { through: OrderItem })
User.hasMany(Order)

sequelize
	// .sync({ force: true }) - рядок для того, щоб оновити дропнути і оновити вже створену таблицю, після 1 разу використання його вимикають
	.sync()
	.then(result => {
		//шукає юзера, якщо не знаходить, створює нового
		return User.findByPk(1)
	})
	.then(user => {
		if (!user) {
			return User.create({ name: 'Max', email: 'test@test.com' })
		}
		return Promise.resolve(user)
	})
	.then(user => {
		// console.log(user)
		return user.createCart()
	})
	.then(result => app.listen(3001))
	.catch(err => console.log(err))
