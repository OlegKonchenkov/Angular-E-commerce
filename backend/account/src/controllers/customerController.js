const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer_model.js");
const Admin = require("../models/admin_model.js");
const Founder = require("../models/founder_model.js");
const Delivery = require("../models/delivery_guy_model.js");

exports.registerCustomer = function(req, res) {
  const today = new Date()
  const customerData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    profile_picture: req.body.profile_picture,
    date: today,
    notifications: []
  }

  Promise.all([
    Customer.findOne({ username: req.body.username }),
    Admin.findOne({ username: req.body.username }),
    Founder.findOne({ username: req.body.username }),
    Delivery.findOne({ username: req.body.username })
  ]).then(([customer, admin, founder, delivery]) => {
    if (delivery == null && customer == null && admin == null && founder == null) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        customerData.password = hash
        Customer.create(customerData)
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

exports.getCustomerByID = function(req, res) {

  Customer.findOne({ _id: req.query.id })
  .then(user => {

    if (user != null) {  
      res.type('application/json')
      res.status(200).send({usr : user})
    }else{
      res.status(404).send({error: "user not found"})
    }

  }).catch(err => {
    res.status(500).json({ error: "error while looking for user" })
  })
};

exports.getCustomer = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const customer_id = decodedPayload._id; 

          Customer.findOne({_id: customer_id})
          .then(customer => {
            if(customer != null){
              res.json({customer: customer})
            }
          }).catch(err => { res.status(500).json({ error: "error performing search of customer"}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.updateCustomer = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id; 

          const customerData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            profile_picture: req.body.profile_picture,
            email: req.body.email,
            username: req.body.username,
            password: req.body.new_password,
          }

          Customer.findOne({ _id: client_id })
          .then(customer => {
            if(bcrypt.compareSync(req.body.old_password, customer.password)){
              bcrypt.hash(req.body.new_password, 10, (err, hash) => {
                customerData.password = hash
                const query = {$set: customerData}
    
                Customer.findOneAndUpdate({ _id: client_id }, query)
                  .then(cust => {
                    res.status(200).send({ customer: cust })
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

exports.deleteCustomer = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const user_id = decodedPayload._id; 
          
          Customer.findOneAndDelete({_id: user_id})
          .then(customer => {
            res.status(204).send()
          }).catch(err => {
            res.status(500).json({ error: err })
        }).catch(err => { res.status(500).json({ error: "error while deleting the customer"}) })

    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.visualizeNotification = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const user_id = decodedPayload._id; 
          
          Customer.findOneAndUpdate(
            {_id: user_id, 'notifications._id': req.body.notification_id},
            {$set: {"notifications.$.visualized": true}})
            .then(customer => {
              res.status(200).send({ _id: customer._id })
            }).catch(err => { res.status(500).json({ error: "error while updating the customer"}) })

    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.getNotvisualizedNotifications = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const user_id = decodedPayload._id; 
          
          Customer.findOne({_id: user_id})
            .then(customer => {
              let notifications = []
              customer.notifications.forEach(notification => {
                if(notification.visualized == false){
                  notifications.push(notification)
                }
              });
              res.status(200).send({ notifications: notifications })
            }).catch(err => { res.status(500).json({ error: "error seraching the customer"}) })

    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.addNotification = function(req, res) {
  const query = { 
    $push: { notifications: {
      sender_id: req.body.sender_id,
      sender_type: req.body.sender_type,
      title: req.body.title,
      body: req.body.body,
      visualized: false
    }
    }
  }
  Customer.findOneAndUpdate({_id: req.body.customer_id}, query)
  .then(customer => {   
     res.json({customer: customer})
  }).catch(err => { res.status(500).json({ error: "error while searching the customer"}) })
};