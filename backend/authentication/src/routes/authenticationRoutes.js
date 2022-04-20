module.exports = function(app) {
	var authenticationController = require('../controllers/authenticationController');

	app.route('/authentication/login')
        .post(authenticationController.loginUser);

	app.route('/authentication/logout')
		.get(authenticationController.logoutUser)
};
