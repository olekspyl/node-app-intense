const User = require('../models/user')
const bcrypt = require('bcrypt')

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		errorMessage: req.flash('error'),
	})
}

exports.postLogin = (req, res, next) => {
	const email = req.body.email
	const password = req.body.password

	User.findOne({ email: email }).then(userDoc => {
		if (!userDoc) {
			req.flash('error', 'invalid email or password')
			return res.redirect('/login')
		}
		return bcrypt
			.compare(password, userDoc.password)
			.then(doMatch => {
				if (!doMatch) {
					req.flash('error', 'invalid email or password')
					req.session.isLoggedIn = false
					return res.redirect('/login')
				}
				req.session.isLoggedIn = true
				req.session.user = userDoc
				req.session.save(err => {
					console.log(err)
					return res.redirect('/')
				})
			})
			.catch(err => {
				console.log(err)
				res.redirect('/login')
			})
	})
}

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		pageTitle: 'Signup',
		path: '/signup',
		isAuthenticated: false,
	})
}

exports.postSignup = (req, res, next) => {
	const email = req.body.email
	const password = req.body.password
	const confirmPassword = req.body.confirmPassword

	User.findOne({ email: email })
		.then(userDoc => {
			if (userDoc) {
				return res.redirect('/signup')
			}
			return bcrypt
				.hash(password, 12)
				.then(hashedPassword => {
					const user = new User({
						email: email,
						password: hashedPassword,
						cart: { items: [] },
					})
					return user.save()
				})
				.then(result => {
					res.redirect('/login')
				})
		})

		.catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err)
		res.redirect('/')
	})
}
