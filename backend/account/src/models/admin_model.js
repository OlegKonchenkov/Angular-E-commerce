const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AdminSchema = new Schema({
    first_name: String,
    last_name: String,
    phone_number: String,
    registration_status: {
        type: String,
        default: "Pending"
    },
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
    shop_name: {
        type: String,
        required: true
    },
    shop_picture: String,
    advertisements: [{
        title: String,
        body: String
      }],
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    //vendor followers
    followers: [{
        follower_id: String,
        follower_type: String
    }],
    //info to geolocalize vendor's shop
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
    },
    //notifications about products out of sock
    notifications: [{
      sender_id: String,
      sender_type: String,
      title: String,
      body: String,
      visualized: Boolean
    }]
})

module.exports = Admin = mongoose.model('admin', AdminSchema)