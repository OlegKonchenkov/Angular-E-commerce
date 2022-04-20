const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    vendor_id: String,
    vendor_name: String,
    shop_name: String,
    name: String,
    type: String,
    price: Number,
    description: String,
    rating: Number,
    availability: Boolean,
    sale: Number,
    quantity: Number,
    date_of_creation: {
        type: Date,
        default: Date.now
    },
    product_picture: {
        type: String
    },
    reviews:[{
        username: String,
        text: String,
        rating: Number
    }]
})

module.exports = Product = mongoose.model('product', ProductSchema)