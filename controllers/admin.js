const Product = require('../models/product')
const { ObjectId } = require('mongodb')

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add product',
		path: '/admin/add-product',
		editing: false,
		product: {},
	})
}

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
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
	const prodId = req.params.productId
	if (!prodId) {
		return res.redirect('/')
	} else {
		Product.findById(prodId)
			.then(product => {
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
	const prodId = req.body.productId
	const updatedTitle = req.body.title
	const updatedPrice = req.body.price
	const updatedImageUrl = req.body.imageUrl
	const updatedDescription = req.body.description
	Product.findById(prodId).then(product => {
		product = new Product(
			updatedTitle,
			updatedPrice,
			updatedImageUrl,
			updatedDescription,
			new ObjectId(prodId)
		)
		return product
			.save()
			.then(
				result => console.log('updated product'),
				res.redirect('/admin/products')
			)
			.catch(err => console.log(err))
	})
}

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title
	const imageUrl = req.body.imageUrl
	const price = req.body.price
	const description = req.body.description
	const product = new Product(
		title,
		price,
		description,
		imageUrl,
		null,
		req.user._id
	)
	product
		.save()
		.then(result => console.log('Created Product'), res.redirect('/'))
		.catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId
	Product.deleteById(productId)
		.then(
			result => console.log('DESTROYED PRODUCT'),
			res.redirect('/admin/products')
		)
		.catch(err => console.log(err))
}
