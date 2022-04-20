module.exports = function(app) {
	var customerController = require('../controllers/customerController');

	app.route('/account/customer')
		.post(customerController.registerCustomer);

	app.route('/account/customer')
		.get(customerController.getCustomer);

	app.route('/account/customer_id')
		.get(customerController.getCustomerByID);
	
	app.route('/account/customer')
		.put(customerController.updateCustomer);
	
	app.route('/account/customer')
		.delete(customerController.deleteCustomer);

	app.route('/account/customer/notification')
		.put(customerController.visualizeNotification);

	app.route('/account/customer/notification')
		.post(customerController.addNotification);

	app.route('/account/customer/not_visualized_notification')
		.get(customerController.getNotvisualizedNotifications);
};
