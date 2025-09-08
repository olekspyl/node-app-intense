const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json')

module.exports = class Cart {
   static addProduct(id, productPrice, cb) {
  fs.readFile(p, (err, fileContent) => {
    let cart = { products: [], totalPrice: 0 };

    if (!err && fileContent && fileContent.length > 0) {
      try {
        cart = JSON.parse(fileContent);
      } catch (e) {
        console.warn('Broken cart.json, reset cart', e);
        cart = { products: [], totalPrice: 0 };
      }
    }

    console.log('addProduct:', { id, productPrice, cartBefore: cart });

    const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
    const existingProduct = cart.products[existingProductIndex];
    let updatedProduct;

    if (existingProduct) {
      updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
      cart.products = [...cart.products];
      cart.products[existingProductIndex] = updatedProduct;
    } else {
      updatedProduct = { id, qty: 1 };
      cart.products = [...cart.products, updatedProduct];
    }

    let price = parseFloat(productPrice);
    if (isNaN(price)) {
      console.warn('productPrice is not a number, setting price = 0. Received:', productPrice);
      price = 0;
    }

    cart.totalPrice = Number(cart.totalPrice || 0) + price;

    fs.writeFile(p, JSON.stringify(cart, null, 2), err => {
      if (err) {
        console.error('Failed to write cart.json', err);
      } else {
        console.log('Cart saved OK:', cart);
      }
      if (typeof cb === 'function') cb(err);
    });
  });
}


   static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
        if(err) {
            return
        }
        const cart = JSON.parse(fileContent)
        const updatedCart = {...cart}
        const product = updatedCart.products.find(prod => prod.id === id)
        if(!product) {
            return
        }
        const productQty = product.qty
        updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)
        updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty

        fs.writeFile(p, JSON.stringify(updatedCart), err => {
    console.log(err)
})
    })
   }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
        if (err || fileContent.length === 0) {
            cb({ products: [], totalPrice: 0 });
        } else {
            try {
                const cart = JSON.parse(fileContent);
                cb(cart);
            } catch (e) {
                cb({ products: [], totalPrice: 0 });
            }
        }
    });
}
}