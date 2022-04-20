const jwt = require("jsonwebtoken");
const ShoppingCart = require("../models/shopping_cart_model.js");


exports.addToShoppingCart = function(req, res) {

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id; 
          const vendor_id = req.body.vendor_id;
          const product_name = req.body.product_name;
          const product_price = req.body.product_price;
          const product_quantity = req.body.product_quantity;
          const product_sale = req.body.product_sale;
          const newTotalPrice = (product_price - ((product_price * product_sale) / 100)) * product_quantity;

          const shoppingCartData = {
            client_id: client_id,
            items: [{
              vendor_id: vendor_id,
              name: product_name,
              price: product_price,
              sale: product_sale,
              quantity: product_quantity,
            }],
            totalPrice: newTotalPrice
          }
    
          ShoppingCart.findOne({ client_id: client_id})
          .then(userCart => {
          if (userCart == null) {
            ShoppingCart.create(shoppingCartData)
              .then(shoppingCart => {
                res.status(201).send({ _id: shoppingCart._id })
              }).catch(err => {
                res.status(500).json({ error: err })
              })
          } else {
            ShoppingCart.findOne({client_id: client_id, 'items.name': product_name, 'items.vendor_id': vendor_id})
            .then(item => {
              if(item == null){
                const update = { 
                  $push: { items: {
                  vendor_id: vendor_id,
                  name: product_name,
                  price: product_price,
                  sale: product_sale,
                  quantity: product_quantity
                }},
                  totalPrice: userCart.totalPrice + newTotalPrice
                }
                
                ShoppingCart.findOneAndUpdate({ client_id: client_id}, update)
                .then(shoppingCart => {
                  res.status(201).send({ _id: shoppingCart._id })
                }).catch(err => {
                  res.status(500).json({ error: err })
                })
              }else {
                item.items.forEach(i => {
                  if(i.name == product_name && i.vendor_id == vendor_id){
                    i.quantity = i.quantity + product_quantity
                    item.totalPrice = item.totalPrice + (i.price - ((i.price * i.sale) / 100)) * product_quantity;
                  }
                });
                item.save(function(err, savedObj){
                  if(err) { // some error occurs during save
                    res.status(500).send({ error: "error saving updates" })
                  } else if(!savedObj) {
                    res.status(404).send({ error: 'no user found' })
                  } else { // cart updated correctly
                    res.status(200).send({ cart: item })
                  }
                })
              }
            })
          } 
        }).catch(err => { res.status(500).json({ error: "error performing search of the shopping_cart with specified name"}) })          
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.updateShoppingCart = function(req, res) {

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id; 
          const product_name = req.body.product_name;
          const product_quantity = req.body.product_quantity;
          const vendor_id = req.body.vendor_id
          var currentPrice = 0;
          var newPrice = 0;

          if(product_quantity <= 0){
            ShoppingCart.findOne({client_id: client_id})
            .then(cart => {
              if(cart != null){
                cart.items.forEach(item => {
                  if(item.name == product_name){
                    currentPrice = (item.price - ((item.price * item.sale) / 100)) * item.quantity
                  }
                });
                cart.totalPrice = cart.totalPrice - currentPrice
                console.log(currentPrice)
                cart.save(function(err, savedObj){
                  if(err) { // some error occurs during save
                    res.status(500).send({ error: "error saving updates" })
                  } else if(!savedObj) {
                    res.status(404).send({ error: 'no user found' })
                  } else { // cart updated correctly
                    const update = { 
                      $pull: { items: {
                      name: product_name,
                      vendor_id: vendor_id
                      }}
                    }
                    ShoppingCart.findOneAndUpdate({clientID: client_id}, update)
                      .then(shoppingCart => {
                        res.status(201).send({ _id: shoppingCart._id })
                      }).catch(err => {
                        res.status(500).json({ error: err })
                      })
                  }
                })
              }
            })          
          }else {
            ShoppingCart.findOne({client_id: client_id})
            .then(cart => {
              if(cart != null){
                cart.items.forEach(item => {
                  if(item.name == product_name){
                    currentPrice = (item.price - ((item.price * item.sale) / 100)) * item.quantity
                    newPrice = product_quantity * (item.price - ((item.price * item.sale) / 100))
                    console.log("current:" + currentPrice + "newPRice:" + newPrice)
                  }
                });
                console.log((cart.totalPrice - currentPrice) + newPrice)
                cart.totalPrice = (cart.totalPrice - currentPrice) + newPrice
                cart.save(function(err, savedObj){
                  if(err) { // some error occurs during save
                    res.status(500).send({ error: "error saving updates" })
                  } else if(!savedObj) {
                    res.status(404).send({ error: 'no user found' })
                  } else { // cart updated correctly
                    ShoppingCart.findOneAndUpdate(
                      {client_id: client_id, 'items.name': product_name, 'items.vendor_id': vendor_id},
                      {$set: {"items.$.quantity": product_quantity}})
                      .then(shoppingCart => {
                        res.status(201).send({ _id: shoppingCart._id })
                      }).catch(err => {
                        res.status(500).json({ error: err })
                      })
                  }
                })
              }
            })                 
          }
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.removeProductFromCart = function(req, res) {

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
        const client_id = decodedPayload._id
        const name = req.query.name
        const vendor_id = req.query.vendor_id
        var currentPrice = 0

        ShoppingCart.findOne({client_id: client_id})
        .then(cart => {
          if(cart != null){
            cart.items.forEach(item => {
              if(item.name == name){
                currentPrice = (item.price - ((item.price * item.sale) / 100)) * item.quantity
              }
            });
            cart.totalPrice = cart.totalPrice - currentPrice
            console.log(currentPrice)
            cart.save(function(err, savedObj){
              if(err) { // some error occurs during save
                res.status(500).send({ error: "error saving updates" })
              } else if(!savedObj) {
                res.status(404).send({ error: 'no user found' })
              } else { // cart updated correctly
                const update = { 
                  $pull: { items: {
                  name: name,
                  vendor_id: vendor_id
                  }}
                }
                ShoppingCart.findOneAndUpdate({client_id: client_id}, update)
                  .then(shoppingCart => {
                    res.status(200).send({ cart: shoppingCart })
                  }).catch(err => {
                    res.status(500).json({ error: err })
                  })
              }
            })
          }
        }) 
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.getShoppingCart = function(req, res) {

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

        const client_id = decodedPayload._id
        ShoppingCart.findOne({ client_id: client_id })
        .then(shopping_cart => {
            res.status(200).send({ shopping_cart: shopping_cart })
        }).catch(err => { res.status(500).json({ error: "error performing search of the shopping_cart with specified name"}) })

    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.getShoppingCartByCustomerID = function(req, res) {
  const client_id = req.query.id
  ShoppingCart.findOneAndDelete({ client_id: client_id })
  .then(shopping_cart => {
      res.status(200).send({ shopping_cart: shopping_cart })
  }).catch(err => { res.status(500).json({ error: "error performing search of the shopping_cart with specified name"}) })
};

exports.updateSale = function(req, res) {
  const name = req.body.name
  const new_name = req.body.new_name
  const vendor_id = req.body.vendor_id
  const sale = req.body.sale
  const price = req.body.price

  ShoppingCart.find({'items.name': name, 'items.vendor_id': vendor_id})
    .then(shoppingCart => {
      shoppingCart.forEach(cart => {
        cart.items.forEach(item => {
          if(item.name == name && item.vendor_id == vendor_id){
            let oldPrice = (item.price - ((item.price * item.sale) / 100)) * item.quantity
            let newTotalPrice = cart.totalPrice - oldPrice + (price - ((price * sale) / 100)) * item.quantity
            ShoppingCart.findOneAndUpdate({'items._id' : item.id}, {$set: {"items.$.sale": sale, "items.$.name": new_name, "items.$.price": price, totalPrice: newTotalPrice}})
            .then(p => {
              console.log(p)
            })
          }
        });
      }); 
      res.status(200).send({ shopping_cart: "updated" })
    }).catch(err => {
      res.status(500).json({ error: err })
    })
};
