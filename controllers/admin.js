const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add product',
		path: '/admin/add-product',
		editing: false,
		product: {},
	})
}

exports.getProducts = (req, res, next) => {
	req.user
		.getProducts()
		.then(products => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			})
		})
		.catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit
	if (!editMode) {
		return res.redirect('/')
	}
	const prodId = Number(req.params.productId)
	if (!prodId) {
		return res.redirect('/')
	} else {
		req.user
			.getProducts({ where: { id: prodId } })
			.then(products => {
				const product = products[0]
				res.render('admin/edit-product', {
					pageTitle: 'Edit product',
					path: '/admin/edit-product',
					editing: editMode,
					product: product,
				})
			})
			.catch(err => console.log(err))
	}
}

exports.postEditProduct = (req, res, next) => {
	const prodId = Number(req.body.productId)
	const updatedTitle = req.body.title
	const updatedPrice = req.body.price
	const updatedImageUrl = req.body.imageUrl
	const updatedDescription = req.body.description
	Product.findByPk(prodId)
		.then(product => {
			product.title = updatedTitle
			product.price = updatedPrice
			product.imageUrl = updatedImageUrl
			product.description = updatedDescription
			return product.save()
		})
		.then(
			result => console.log('updated product'),
			res.redirect('/admin/products')
		)
		.catch(err => console.log(err))
}

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title
	const imageUrl = req.body.imageUrl
	const price = req.body.price
	const description = req.body.description
	req.user
		.createProduct({
			title,
			imageUrl,
			price,
			description,
		})
		.then(result => console.log('Created Product'), res.redirect('/'))
		.catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
	const productId = Number(req.body.productId)
	Product.findByPk(productId)
		.then(product => {
			return product.destroy()
		})
		.then(
			result => console.log('DESTROYED PRODUCT'),
			res.redirect('/admin/products')
		)
		.catch(err => console.log(err))
}
