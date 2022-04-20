module.exports = function(app) {
	var productController = require('../controllers/productController');

	app.route('/product')
		.post(productController.addProduct);
	
	app.route('/product')
		.put(productController.updateProduct);

	app.route('/product')
		.get(productController.getProduct);

	app.route('/product/info')
		.get(productController.getProductByVendorIDandName);

	app.route('/product/info_id')
		.get(productController.getProductByID);

	app.route('/product/sale')
		.get(productController.getProductsInSale);

	app.route('/product/shop_name')
		.get(productController.getProductByShopName);

	app.route('/product/rating')
		.get(productController.getProductsWhitHigherRating);
		
	app.route('/product/recommended')
		.get(productController.recommendedProducts);

	app.route('/product/vendor')
		.get(productController.getProductsByVendorName);

	app.route('/product/type')
		.get(productController.getProductByType);

	app.route('/product/most_sold')
		.get(productController.getMostSoldProduct);

	app.route('/product/names/similar_name')
		.get(productController.getSimilarNames);

	app.route('/product/similar_name')
		.get(productController.getProductsWhitSimilarName);

	app.route('/product/most_sold')
		.post(productController.addSoldProduct);
	
	app.route('/product/review')
		.post(productController.addReview);

	app.route('/product/quantity')
		.put(productController.updateQuantity);

	app.route('/product/sale')
		.put(productController.updateSale);

	app.route('/product')
		.delete(productController.removeProduct);

	app.route('/product/vendor_name')
		.put(productController.updateVendorName);
};
