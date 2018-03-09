var express = require('express');
var router = express.Router();

var Item = require('../models/items');

/* GET list of items out of db*/
router.get('/', function(req, res, next) {
	Item.find({}, function(err, items){
		res.render('Shop/shop', {
			title: 'Grab your ingredients',
			items: items
		});
	});
});

/* This checks if an input is an isogram */
cart = {items:{}, totalPrice: 0, totalQty: 0}
// Responsible of accepting items
router.get('/cart/:id', function(req, res){
	var id=req.params.id;
	Item.findOne({_id: req.params.id}, function(err, item){
		if(err){ console.log(err) }
		var price = parseInt(item.price);
		if(!cart.items[id]){
			cart.items[id] = {'id': item._id,'price': price, 'qty': 1, 'goodsImage': item.goodsImage, 'description': item.description}
			cart.totalPrice+=price;
			cart.totalQty++;
		}else{
			cart.items[id].qty++;
			cart.totalPrice+=price;
			cart.totalQty++;
		}
	});
	/*
	var good = {'id': id,'price': price, 'qty': 1}
	cart.push(good);
	*/
	res.redirect('/shop');
});

/* GET list of items for the search */
router.get('/items/:id', function(req, res, next) {
	res.render('Shop/itemSearch', {title: 'DacRecipe: Ingredient search result'});
});

/* GET list of selected items on the cart */
router.get('/cart', function(req, res, next){
	res.render('Shop/cart', {
		title: 'DacRecipe: Your shopping list',
		cart: cart,
		items: cart.items
	});
});

/* GET '/shop/#{item.id}/delete' to delete an item from cart */
router.get('/:id/delete', function(req, res, next){
	var id = req.params.id;
	cart.totalQty-=cart.items[id].qty;
	cart.totalPrice-=(cart.items[id].qty*cart.items[id].price);
	delete cart.items[id];
	res.redirect('/shop/cart');
});

/* GET '/shop/#{item.id}/addMore' to add to an item in cart */
router.get('/:id/addMore', function(req, res, next){
	var id = req.params.id;
	cart.items[id].qty++;
	cart.totalQty++;
	cart.totalPrice+=cart.items[id].price;
	res.redirect('/shop/cart');
});

/* GET '/shop/#{item.id}/remove' to remove an item from cart */
router.get('/:id/remove', function(req, res, next){
	var id = req.params.id;
	cart.items[id].qty--;
	cart.totalQty--;
	cart.totalPrice-=cart.items[id].price;
	if(cart.items[id].qty===0){
		delete cart.items[id];
	}
	res.redirect('/shop/cart');
});

/* GET '/shop/cart/empty' to empty all item from cart */
router.get('/empty', function(req, res, next){
	cart.items={};
	cart.totalQty=0;
	cart.totalPrice=0;
	res.redirect('/shop/cart');
});

/* GET checkout form */
router.get('/checkout', function(req, res, next) {
	res.render('Shop/checkout', {title: 'DacRecipe: Checkout'});
});

module.exports = router;