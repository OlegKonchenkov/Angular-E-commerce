module.exports = function(app) {
	var deliveryController = require('../controllers/deliveryController');

	app.route('/account/delivery')
		.post(deliveryController.registerDelivery)

	app.route('/account/delivery')
		.get(deliveryController.getDelivery);

	app.route('/account/delivery_id')
		.get(deliveryController.getDeliveryByID);

	app.route('/account/delivery')
		.put(deliveryController.updateDelivery);
	
	app.route('/account/delivery/position')
		.put(deliveryController.modifyDeliveryPosition);
	
	app.route('/account/delivery')
		.delete(deliveryController.deleteDelivery);
};
