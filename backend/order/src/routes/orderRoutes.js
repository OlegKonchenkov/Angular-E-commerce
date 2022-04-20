module.exports = function(app) {
	var shoppingCartController = require('../controllers/orderController');

	app.route('/order')
		.post(shoppingCartController.createOrder);
	
	app.route('/order')
		.get(shoppingCartController.getOrder);

	app.route('/orders')
		.get(shoppingCartController.getOrders);

	app.route('/order')
		.delete(shoppingCartController.deleteOrder);

	app.route('/order/info')
		.get(shoppingCartController.getOrderByID);
	
	app.route('/order/customer_id')
		.get(shoppingCartController.getOrderByCustomerID);

	app.route('/order/delivery')
		.put(shoppingCartController.setDelivery);
};
