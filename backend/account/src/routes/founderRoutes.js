module.exports = function(app) {
	var founderController = require('../controllers/founderController');
		
	app.route('/account/founder')
		.post(founderController.registerFounder);
		
	app.route('/account/founder')
		.get(founderController.getFounder);

	app.route('/account/founder')
		.put(founderController.updateFounder);

	app.route('/account/founder/vendor')
		.get(founderController.getAllVendors);

	app.route('/account/founder/vendor')
		.put(founderController.updateVendorState);

	app.route('/account/founder/vendor')
		.delete(founderController.deleteVendor);

	app.route('/account/founder')
		.delete(founderController.deleteFounder);
};
