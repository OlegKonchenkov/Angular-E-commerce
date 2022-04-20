const mongoose = require("mongoose")
const Schema = mongoose.Schema

const FounderSchema = new Schema({
    first_name: String,
    last_name: String,
    phone_number: String,
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
})

module.exports = Founder = mongoose.model('founder', FounderSchema)