const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer_model.js");
const Admin = require("../models/admin_model.js");
const Founder = require("../models/founder_model.js");
const Delivery = require("../models/delivery_guy_model.js");

exports.registerFounder = function(req, res) {
  const today = new Date()
  const founderData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone_number: req.body.phone_number,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    profile_picture: req.body.profile_picture,
    date: today,
  }

  Promise.all([
    Customer.findOne({ username: req.body.username }),
    Admin.findOne({ username: req.body.username }),
    Founder.findOne({ username: req.body.username }),
    Delivery.findOne({ username: req.body.username })
  ]).then(([customer, admin, founder, delivery]) => {
    if (delivery == null && customer == null && admin == null && founder == null) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        founderData.password = hash
        Founder.create(founderData)
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

exports.updateFounder = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id

          const founderData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number,
            profile_picture: req.body.profile_picture,
            email: req.body.email,
            username: req.body.username,
            password: (req.body.new_password == null) ? req.body.old_password : req.body.new_password,
          }
          Founder.findOne({_id: client_id})
          .then(founder => {
            if(bcrypt.compareSync(req.body.old_password, founder.password)){
              bcrypt.hash(founderData.password, 10, (err, hash) => {
                founderData.password = hash
                const query = {$set: founderData}
    
                Founder.findOneAndUpdate({ _id: client_id }, query)
                  .then(founde => {
                    res.status(200).send({ _id: founde._id })
                  }).catch(err => {
                    res.status(500).json({ error: err })
                }).catch(err => { res.status(500).json({ error: "error performing search of product with specified name" + err}) })
              })
            }else{
              res.json({error: "wrong old password" + old_password})
            }
          }).catch(err => { res.status(500).json({ error: err + "wrong old password or user not found"}) }) 
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.getFounder = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const founder_id = decodedPayload._id; 

          Founder.findOne({_id: founder_id})
          .then(founder => {
            if(founder != null){
              res.json({founder: founder})
            }
          }).catch(err => { res.status(500).json({ error: "error performing search of founder"}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.getAllVendors = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      Admin.find({})
        .then(vendors => {
          if (vendors != null) { 
           res.json({vendors: vendors}) 
          }
        }).catch(err => {
          res.status(500).send({ error: "error looking for vendor" })
        })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user"}); // No JWT specified
  }
};

exports.deleteVendor = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      Admin.findOneAndDelete({username: req.query.username})
        .then(vendors => {
           res.json({success: "vedor deleted"}) 
        }).catch(err => {
          res.status(500).send({ error: "error looking for vendor" })
        })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user"}); // No JWT specified
  }
};

exports.updateVendorState = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      Admin.findOne({_id: req.body.vendor_id})
        .then(vendor => {
           vendor.registration_status = req.body.registration_status
           vendor.save(function(err, savedObj){
            if(err) { // some error occurs during save
              res.status(500).send({ error: "error saving updates" })
            } else if(!savedObj) {
              res.status(404).send({ error: 'no user found' })
            } else { // user updated correctly
              res.json({updatedVendor: vendor})
            }
          })
        }).catch(err => {
          res.status(500).send({ error: "error looking for vendor" })
        })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user"}); // No JWT specified
  }
};

exports.deleteFounder = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const user_id = decodedPayload._id; 
          
          Founder.findOneAndDelete({_id: user_id})
          .then(customer => {
            res.status(204).send()
          }).catch(err => {
            res.status(500).json({ error: err })
        }).catch(err => { res.status(500).json({ error: "error while deleting the founder"}) })

    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};