const User = require('../models/user')

exports.getLogin = (req, res, next) => {
	console.log(req.get('Cookie'))
	res.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		isAuthenticated: req.session.isLoggedIn,
	})
}

exports.postLogin = (req, res, next) => {
	User.findById('6918c1313a3a957b158eedba')
		.then(user => {
			req.session.isLoggedIn = true
			req.session.user = user
			req.session.save(err => {
				console.log(err)
				res.redirect('/')
			})
		})
		.catch(err => {
			console.log(err)
		})
}

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err)
		res.redirect('/')
	})
}
