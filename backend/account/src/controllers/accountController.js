const jwt = require("jsonwebtoken");
const Customer = require("../models/customer_model.js");
const Admin = require("../models/admin_model.js");
const Founder = require("../models/founder_model.js");
const Delivery = require("../models/delivery_guy_model.js");

exports.getUserByUsername = function(req, res) {

  Promise.all([
    Customer.findOne({ username: req.query.username }),
    Admin.findOne({ username: req.query.username }),
    Founder.findOne({ username: req.query.username }),
    Delivery.findOne({ username: req.query.username })
  ]).then(([customer, admin, founder, delivery]) => {
    var user;
    var user_type;
    if (customer != null) {
      user = customer
      user_type = "Customer"
    } else if (admin != null) {
      user = admin
      user_type = "Admin"
    } else if (founder != null) {
      user = founder
      user_type = "Founder"
    } else if (delivery != null) {
      user = delivery
      user_type = "Delivery Guy"
    }

    if (user != null) {  
      console.log("psw :" + user.password)
      res.type('application/json')
      res.status(200).send({profile_type: user_type, usr : user})
    }else{
      res.status(404).send({error: "user not found"})
    }

  }).catch(err => {
    res.status(500).json({ error: "error while looking for user" })
  })
};

exports.getUserByID = function(req, res) {

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const user_id = decodedPayload._id; 
          Promise.all([
            Customer.findOne({ _id: user_id }),
            Admin.findOne({ _id: user_id }),
            Founder.findOne({ _id: user_id }),
            Delivery.findOne({ _id: user_id })
          ]).then(([customer, admin, founder, delivery]) => {
            var user;
            var user_type;
            if (customer != null) {
              user = customer
              user_type = "Customer"
            } else if (admin != null) {
              user = admin
              user_type = "Admin"
            } else if (founder != null) {
              user = founder
              user_type = "Founder"
            } else if (delivery != null) {
              user = delivery
              user_type = "Delivery Guy"
            }

            if (user != null) {  
              res.type('application/json')
              res.status(200).send({profile_type: user_type, usr : user})
            }else{
              res.status(404).send({error: "user not found"})
            }
          }).catch(err => {
            res.status(500).json({ error: "error while looking for user" })
          })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};
