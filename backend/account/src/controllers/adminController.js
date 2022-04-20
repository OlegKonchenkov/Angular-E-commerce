const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const superagent = require('superagent');
const Customer = require("../models/customer_model.js");
const Admin = require("../models/admin_model.js");
const Founder = require("../models/founder_model.js");
const Delivery = require("../models/delivery_guy_model.js");

exports.registerAdmin = function(req, res) {
  const today = new Date()

  const location = { // GeoJSON
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [44.127286, 12.251577]
    },
    properties: {
      shop_name: req.body.shop_name,
      profile_picture: req.body.shop_picture
    }
  }

  const adminData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone_number: req.body.phone_number,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    shop_name: req.body.shop_name,
    shop_picture: req.body.shop_picture,
    advertisements: [],
    notifications: [],
    description: req.body.description,
    date: today,
    followers: [],
    location: location,
  }

  Promise.all([
    Customer.findOne({ username: req.body.username }),
    Admin.findOne({ username: req.body.username, shop_name: adminData.shop_name }),
    Founder.findOne({ username: req.body.username }),
    Delivery.findOne({ username: req.body.username })
  ]).then(([customer, admin, founder, delivery]) => {
    if (delivery == null && customer == null && admin == null && founder == null) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        adminData.password = hash
        Admin.create(adminData)
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

exports.getAdmin = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const admin_id = decodedPayload._id; 

          Admin.findOne({_id: admin_id})
          .then(admin => {
            if(admin != null){
              res.json({admin: admin})
            }
          }).catch(err => { res.status(500).json({ error: "error performing search of admin"}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.getAdminForCustomer = function(req, res) {
  Admin.findOne({shop_name: req.query.shop_name})
  .then(admin => {
    if(admin != null){
      res.json({admin: {
        _id: admin._id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        phone_number: admin.phone_number,
        registration_status: admin.registration_status,
        email: admin.email,
        username: admin.username,
        shop_name: admin.shop_name,
        shop_picture: admin.shop_picture,
        location: admin.location,
        description: admin.description,
        date: admin.date
      }})
    }
  }).catch(err => { res.status(500).json({ error: "error performing search of admin"}) })
};

exports.getAdmins = function(req, res) {
  Admin.find({})
  .then(admin => {
    if(admin != null){
      res.json({admin: admin})
    }
  }).catch(err => { res.status(500).json({ error: "error performing search of admin"}) })
};

exports.updateAdmin = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id

          const shop_picture = req.body.shop_picture
          const location = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: req.body.coordinates,
            },
            properties: {
              shop_name: req.body.shop_name,
              profile_picture: shop_picture
            }
          }
          const adminData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number,
            email: req.body.email,
            username: req.body.username,
            password: (req.body.new_password == null) ? req.body.old_password : req.body.new_password,
            shop_name: req.body.shop_name,
            shop_picture: shop_picture,
            description: req.body.description,
            location: location
          }
          Admin.findOne({_id: client_id})
          .then(admin => {
            if(bcrypt.compareSync(req.body.old_password, admin.password)){
              bcrypt.hash(adminData.password, 10, (err, hash) => {
                adminData.password = hash
                const query = {$set: adminData}
                
                const url = 'http://products:3000/product/vendor_name';
                superagent.put(url)
                .send({ 
                  old_name: admin.shop_name, 
                  new_name: adminData.shop_name
                })
                .set('Accept', 'application/json')
                .end((err, response) => {
                  
                if (err) { 
                  res.status(404).json({ error: "Error updating shopping carts" })
                  console.log(err); 
                }
                console.log(response.body);
                });

                Admin.findOneAndUpdate({ _id: client_id }, query)
                  .then(adm => {
                    res.status(200).send({ _id: adm._id })
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

exports.addFollower = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id; 

          const daliveryGuyData = {followers: {
            follower_id: client_id,
            follower_type: "Customer"
          }}
          const query = {$push: daliveryGuyData}

          Admin.findOneAndUpdate({ shop_name: req.body.shop_name }, query)
            .then(admin => {
              res.status(200).send({ _id: admin._id})
            }).catch(err => {
              res.status(500).json({ error: err })
          }).catch(err => { res.status(500).json({ error: "error performing search of product with specified name"}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.isFollower = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id;

          Admin.findOne({ shop_name: req.query.shop_name })
            .then(admin => {
              console.log(admin)
              if(admin.followers.some(e => e.follower_id == client_id)){
                res.status(200).send({ is_follower: true})
              }else{
                res.status(200).send({ is_follower: false})
              }
            }).catch(err => { res.status(500).json({ error: "error performing search of admin with specified shop name"}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.getFollowers = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id;

          Admin.findOne({ _id: client_id })
            .then(admin => {
              res.status(200).send({ admin_id: admin._id, followers: admin.followers})
            }).catch(err => {
              res.status(500).json({ error: err })
          }).catch(err => { res.status(500).json({ error: "error performing search of product with specified name"}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.removeFollower = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id; 

          const daliveryGuyData = {followers: {
            follower_id: client_id,
            follower_type: "Customer"
          }}
          const query = {$pull: daliveryGuyData}

          Admin.findOneAndUpdate({ shop_name: req.query.shop_name }, query)
            .then(admin => {
              res.status(200).send({ _id: admin._id })
            }).catch(err => {
              res.status(500).json({ error: err })
          }).catch(err => { res.status(500).json({ error: "error performing search of product with specified name"}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.modifyAdminPosition = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      if (req.body.new_coordinates == null) {
        res.status(400).send({ error: 'no coordinates specified' })
        return;
      }
      Admin.findOne({ _id: decodedPayload._id })
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
          res.status(500).send({ error: "error looking for vendor" })
        })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user"}); // No JWT specified
  }
};

exports.deleteAdmin = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const user_id = decodedPayload._id; 
          
          Admin.findOneAndDelete({_id: user_id})
          .then(admin => {
            res.status(204).send()
          }).catch(err => {
            res.status(500).json({ error: err })
        }).catch(err => { res.status(500).json({ error: "error while deleting the admin"}) })

    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.createAdvertisement = function(req, res) {

  const adv_title = req.body.title
  const adv_body = req.body.body

  const query = { 
    $push: { advertisements: {
      title: adv_title,
      body: adv_body
    }
    }
  }

  Admin.findOneAndUpdate({_id: req.body.admin_id}, query)
  .then(admin => {
    const queryCustomer = { 
      $push: { notifications: {
        sender_id: admin._id,
        sender_type: "Admin",
        title: adv_title,
        body: adv_body,
        visualized: false
      }
      }
    }
    let users = []
    admin.followers.forEach(follower => {
      Customer.findOneAndUpdate({_id: follower.follower_id}, queryCustomer)
      .then(customer => {
        
        users.push(customer.username)
        if(users.length == admin.followers.length){
          res.json({users: users})
        }
      }).catch(err => { res.status(500).json({ error: "error while searching the customer"}) })
    });
  }).catch(err => { res.status(500).json({ error: "error while searching the admin"}) })
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
  Admin.findOneAndUpdate({_id: req.body.admin_id}, query)
  .then(admin => {   
     res.json({admin: admin})
  }).catch(err => { res.status(500).json({ error: "error while searching the admin"}) })
};

exports.visualizeNotification = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const user_id = decodedPayload._id; 
          
          Admin.findOneAndUpdate(
            {_id: user_id, 'notifications._id': req.body.notification_id},
            {$set: {"notifications.$.visualized": true}})
            .then(admin => {
              res.status(200).send({ _id: admin._id })
            }).catch(err => { res.status(500).json({ error: "error while updating the admin"}) })

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
          
          Admin.findOne({_id: user_id})
            .then(admin => {
              let notifications = []
              admin.notifications.forEach(notification => {
                if(notification.visualized == false){
                  notifications.push(notification)
                }
              });
              res.status(200).send({ notifications: notifications })
            }).catch(err => { res.status(500).json({ error: "error seraching the admin"}) })

    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};