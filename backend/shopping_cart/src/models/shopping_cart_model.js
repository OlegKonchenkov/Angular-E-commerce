const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ShoppingCartSchema = new Schema({
    client_id: String,
    items: [{
        vendor_id: String,
        name: String,
        price: Number,
        quantity: Number,
        sale: Number
    }],
    totalPrice: {
        type: Number,
        default: 0
    }
})

module.exports = ShoppingCart = mongoose.model('shopping_cart', ShoppingCartSchema)