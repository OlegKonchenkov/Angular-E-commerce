module.exports = function(app) {
	var adminController = require('../controllers/adminController');

	app.route('/account/admin')
		.post(adminController.registerAdmin);

	app.route('/account/admin')
		.get(adminController.getAdmin);

	app.route('/account/admin')
		.put(adminController.updateAdmin);
	
	app.route('/account/admin/position')
		.put(adminController.modifyAdminPosition);

	app.route('/account/admin/follower')
		.post(adminController.addFollower);

	app.route('/account/admin/follows')
		.get(adminController.isFollower);

	app.route('/account/admin/follower')
		.get(adminController.getFollowers);

	app.route('/account/admin/follower')
		.delete(adminController.removeFollower);
	
	app.route('/account/admin')
		.delete(adminController.deleteAdmin);

	app.route('/account/admin/advertisemnt')
		.post(adminController.createAdvertisement);

	app.route('/account/admin_customer')
		.get(adminController.getAdminForCustomer);

	app.route('/account/admins')
		.get(adminController.getAdmins);

	app.route('/account/admin/notification')
		.post(adminController.addNotification);

	app.route('/account/admin/notification')
		.get(adminController.getNotvisualizedNotifications);

	app.route('/account/admin/notification')
		.put(adminController.visualizeNotification);
};
