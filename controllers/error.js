exports.get404 = (req, res, next) => {
	res.render('404', {
		pageTitle: 'Page was not found',
		path: '/404',
	})
}
