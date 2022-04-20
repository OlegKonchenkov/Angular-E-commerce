const mongoose = require("mongoose")
const Schema = mongoose.Schema

const DeliveryGuySchema = new Schema({
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
    //info to geolocalize delivery guy position
    location: {
        type: {
          type: String,
          enum: ['Feature'],
          required: true
        },
        geometry: {
          type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
        },
        properties: {
          brand_name: String,
          profile_picture: String,
        }
      }
})

module.exports = DeliveryGuy = mongoose.model('deliveryGuy', DeliveryGuySchema)