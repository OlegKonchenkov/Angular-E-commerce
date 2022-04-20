const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SoldProductSchema = new Schema({
    product: Object,
    quantity: Number,
    date_of_creation: {
        type: Date,
        default: Date.now
    },
})

module.exports = SoldProduct = mongoose.model('sold_product', SoldProductSchema)