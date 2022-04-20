module.exports = function(app) {
	var accountController = require('../controllers/accountController');

	app.route('/account/get_user_by_username')
		.get(accountController.getUserByUsername);

	app.route('/account/get_user_by_id')
		.get(accountController.getUserByID);
	
};
