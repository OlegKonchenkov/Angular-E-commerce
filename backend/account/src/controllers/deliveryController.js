const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer_model.js");
const Admin = require("../models/admin_model.js");
const Founder = require("../models/founder_model.js");
const Delivery = require("../models/delivery_guy_model.js");

exports.registerDelivery = function(req, res) {
  const today = new Date()

  const location = { // GeoJSON
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [44.127286, 12.251577]
    },
    properties: {
      shop_name: req.body.shop_name,
      profile_picture: ""
    }
  }

  const daliveryGuyData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    profile_picture: req.body.profile_picture,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    date: today,
    location: location,
  }

  Promise.all([
    Customer.findOne({ username: req.body.username }),
    Admin.findOne({ username: req.body.username }),
    Founder.findOne({ username: req.body.username }),
    Delivery.findOne({ username: req.body.username })
  ]).then(([customer, admin, founder, delivery]) => {
    if (delivery == null && customer == null && admin == null && founder == null) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        daliveryGuyData.password = hash
        Delivery.create(daliveryGuyData)
          .then(user => {
            const payload = { _id: user._id }
            // JWT generation
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 30 * 86400}) //expiresIn expressed in seconds
            const cookieConfig = {
              httpOnly: true,
              maxAge: 30 * 86400 * 1000, // 30 days cookie
              signed: true
            }
            res.cookie('jwt', token, cookieConfig)
            res.status(201).send({ _id: user._id })
          }).catch(err => {
            res.status(500).json({ error: err })
          })
      })
    } else {
      res.json({ error: 'User already exists' })
    }
  }).catch(err => {
    res.status(500).json({ error: "error while looking for user" })
  })
};

exports.getDelivery = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const delivery_id = decodedPayload._id; 

          Delivery.findOne({_id: delivery_id})
          .then(delivery => {
            if(delivery != null){
              res.json({delivery: delivery})
            }
          }).catch(err => { res.status(500).json({ error: "error performing search of delivery"}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.getDeliveryByID = function(req, res) {
  Delivery.findOne({_id: req.query.delivery_id})
  .then(delivery => {
    if(delivery != null){
      res.json({delivery: delivery})
    }
  }).catch(err => { res.status(500).json({ error: "error performing search of delivery"}) })
};

exports.updateDelivery = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id; 

          const daliveryGuyData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            profile_picture: req.body.profile_picture,
            email: req.body.email,
            username: req.body.username,
            password: req.body.new_password,
          }

          Delivery.findOne({ _id: client_id })
          .then(delivery => {
            if(bcrypt.compareSync(req.body.old_password, delivery.password)){
              bcrypt.hash(req.body.new_password, 10, (err, hash) => {
                daliveryGuyData.password = hash
                const query = {$set: daliveryGuyData}
    
                Delivery.findOneAndUpdate({ _id: client_id }, query)
                  .then(deliv => {
                    res.status(200).send({ delivery: deliv })
                  }).catch(err => {
                    res.status(500).json({ error: err })
                }).catch(err => { res.status(500).json({ error: "error performing search of user "}) })
              })
            }else{
              res.json({error: "wrong old password"})
            }
        }).catch(err => { res.status(500).json({ error: "error performing search of user "}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.modifyDeliveryPosition = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      if (req.body.new_coordinates == null) {
        res.status(400).send({ error: 'no coordinates specified' })
        return;
      }
      Delivery.findOne({ _id: decodedPayload._id })
        .then(user => {
          if (user != null) { 
            user.location.geometry.coordinates = [req.body.new_coordinates.lat, req.body.new_coordinates.lng]
            user.save(function(err, savedObj){
              if(err) { // some error occurs during save
                res.status(500).send({ error: "error saving updates" })
              } else if(!savedObj) {
                res.status(404).send({ error: 'no user found' })
              } else { // user updated correctly
                res.json({updatedUser: user})
              }
            })
          } else {
            res.status(404).send({ error: 'User does not exist' })
          }
        }).catch(err => {
          res.status(500).send({ error: "error looking for delivery guy" })
        })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user"}); // No JWT specified
  }
};

exports.deleteDelivery = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const user_id = decodedPayload._id; 
          
          Delivery.findOneAndDelete({_id: user_id})
          .then(customer => {
            res.status(204).send()
          }).catch(err => {
            res.status(500).json({ error: err })
        }).catch(err => { res.status(500).json({ error: "error while deleting the delivery guy"}) })

    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};