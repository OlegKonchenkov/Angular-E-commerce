const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    first_name: String,
    last_name: String,
    profile_picture: String,
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    //notifications about advertisement published by vendors followed by this user
    notifications: [{
      sender_id: String,
      sender_type: String,
      title: String,
      body: String,
      visualized: Boolean
    }]
})

module.exports = Customer = mongoose.model('user', CustomerSchema)