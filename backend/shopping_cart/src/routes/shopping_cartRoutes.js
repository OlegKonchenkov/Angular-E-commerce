module.exports = function(app) {
	var shoppingCartController = require('../controllers/shopping_cartController');

	app.route('/shopping_cart')
		.post(shoppingCartController.addToShoppingCart);

	app.route('/shopping_cart')
		.get(shoppingCartController.getShoppingCart);

	app.route('/shopping_cart')
		.delete(shoppingCartController.removeProductFromCart);

	app.route('/shopping_cart_by_id')
		.get(shoppingCartController.getShoppingCartByCustomerID);

	app.route('/shopping_cart')
		.put(shoppingCartController.updateShoppingCart);

	app.route('/shopping_cart/sale')
		.put(shoppingCartController.updateSale);
			
};
