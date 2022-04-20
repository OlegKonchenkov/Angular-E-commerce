const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OrderSchema = new Schema({
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
    },
    payment: {
        paymentType: String,
        cardNumber: String
    },
    shippingData: {
        country: String,
        city: String,
        street: String,
        info: String
    },
    orderState: String,
    delivery:{
        delivery_id: String,
        name: String
    },
    date: {
        type: Date,
        default: Date.now
    }, 
})

module.exports = Order = mongoose.model('order', OrderSchema)