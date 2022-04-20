const Product = require("../models/product_model.js");
const SoldProduct = require("../models/sold_products_model.js");
const superagent = require('superagent');
const jwt = require("jsonwebtoken");
const amqp = require('amqplib');
//var io = require('socket.io-client');
//var socket = io.connect('http://notification:3000', {reconnect: true});

connectRabbit();

async function connectRabbit(){
  //setting up rabbitmq..
  connection = await amqp.connect(process.env.MESSAGE_QUEUE);
  channel = await connection.createChannel();
  await channel.assertQueue('adminData', { durable: true });
}

async function sendMessage(msg){
  await channel.sendToQueue('adminData', Buffer.from(JSON.stringify(msg)), {
    contentType: 'application/json',
    persistent: true
  });
}

/*
// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});
*/

exports.addProduct = function(req, res) {
  const today = new Date()

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

      const productData = {
        vendor_id: decodedPayload._id,
        vendor_name: req.body.vendor_name,
        shop_name: req.body.shop_name,
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        description: req.body.description,
        rating: req.body.rating,
        availability: true,
        sale: req.body.sale,
        quantity: req.body.quantity,
        date_of_creation: today,
        product_picture: req.body.product_picture,
        reviews: []
      }

      if(productData.quantity <= 0){
        productData.availability = false
      }

      Product.findOne({ vendor_id: productData.vendor_id, name: productData.name })
      .then(product => {
        if (product == null) {
            Product.create(productData)
              .then(product => {
                res.status(201).send({ _id: product._id })
              }).catch(err => {
                res.status(500).json({ error: err })
              })
        } else {
          res.json({ error: 'Product already exists' })
        }
      }).catch(err => { res.status(500).json({ error: "error performing search of product with specified name"}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.updateProduct = function(req, res) {
  const today = new Date()

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      const id = req.body._id
      const productData = {
        vendor_name: req.body.vendor_name,
        shop_name: req.body.shop_name,
        name: req.body.new_name,
        type: req.body.type,
        price: req.body.price,
        quantity: req.body.quantity,
        sale: req.body.sale,
        description: req.body.description,
        product_picture: req.body.product_picture,
        availability: false
      }
      if(productData.quantity > 0){
        productData.availability = true
      }

      Product.findOne({ _id: id })
      .then(product => {
        const url = 'http://shopping_cart:3000/shopping_cart/sale';
        superagent.put(url)
        .send({ 
          name: product.name, 
          vendor_id: product.vendor_id, 
          new_name: productData.name,
          price: productData.price,
          sale: productData.sale})
        .set('Accept', 'application/json')
        .end((err, response) => {
          
        if (err) { 
          res.status(404).json({ error: "Error updating shopping carts" })
          console.log(err); 
        }
        console.log(response.body);
        const query = {$set: productData}
        Product.findOneAndUpdate({ _id: id }, query)
        .then(prod => {
          res.status(200).send({ _id: prod._id })
        }).catch(err => {
          res.status(500).json({ error: err })
        }).catch(err => { res.status(500).json({ error: "error performing update of product with specified id"}) })
        });
      }).catch(err => {
        res.status(500).json({ error: err })
      }).catch(err => { res.status(500).json({ error: "error performing update of product with specified id"}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.updateVendorName = function(req, res) {
  const old_name = req.body.old_name;
  const new_name = req.body.new_name;
  const query = {$set: {shop_name: new_name}}

  Product.find({shop_name: old_name})
  .then(products => {
    products.forEach(prod => {
      console.log(prod.shop_name)
      Product.findOneAndUpdate({_id: prod._id}, query)
      .then(product => {
      }).catch(err => { res.status(500).json({ error: "error performing search of products"}) })
    });
    res.status(200).send({ updated: "ok" })
  })
};

exports.getProduct = function(req, res) {
	Product.find({})
    .then(product => {
         res.status(200).send({ products: product })
  }).catch(err => { res.status(500).json({ error: "error performing search of products"}) })
};

exports.getProductByID = function(req, res) {
	Product.findOne({_id: req.query.id})
    .then(product => {
         res.status(200).send({ products: product })
  }).catch(err => { res.status(500).json({ error: "error performing search of products"}) })
};

exports.getProductByVendorIDandName = function(req, res) {
	Product.findOne({vendor_id: req.query.vendor_id, name: req.query.name})
    .then(product => {
         res.status(200).send({ products: product })
  }).catch(err => { res.status(500).json({ error: "error performing search of products"}) })
};

exports.getProductByType = function(req, res) {
	Product.find({type: req.query.type})
    .then(product => {
         res.status(200).send({ products: product })
  }).catch(err => { res.status(500).json({ error: "error performing search of products"}) })
};

exports.getProductsWhitHigherRating = function(req, res) {
	Product.find({ rating: { $gt: 3 } })
    .then(product => {
         res.status(200).send({ products: product })
  }).catch(err => { res.status(500).json({ error: "error performing search of products with higher rating"}) })
};

exports.getProductsInSale = function(req, res) {
	Product.find({ sale: { $gt: 0 } })
    .then(product => {
         res.status(200).send({ products: product })
  }).catch(err => { res.status(500).json({ error: "error performing search of products in sale"}) })
};

exports.getProductsByVendorName = function(req, res) {
	Product.find({ vendor_id: req.query.vendor_id })
    .then(product => {
         res.status(200).send({ products: product })
  }).catch(err => { res.status(500).json({ error: "error performing search of products whit a specified vednor name"}) })
};

exports.getProductByShopName = function(req, res) {
	Product.find({shop_name: req.query.shop_name})
    .then(product => {
         res.status(200).send({ products: product })
  }).catch(err => { res.status(500).json({ error: "error performing search of products"}) })
};

exports.getMostSoldProduct = function(req, res) {
  SoldProduct.find({})
  .sort({quantity: -1})
  .then(products => {
    res.status(200).send({ products: products })
  }).catch(err => { res.status(500).json({ error: "error performing search of products whit a specified vednor name"}) })
};

exports.getSimilarNames = function(req, res) {
  const regex =  req.query.name + ".*" 
  Product.find({name: { $regex: new RegExp(regex, "i")}})
  .then(products => {
    let names = []
    if(products.length == 0){
      res.status(200).send({ names: names })
    }else {
      products.forEach(prod => {
        names.push(prod.name)
        if(names.length == products.length ){
          res.status(200).send({ names: names })
        }
      });
    }
  }).catch(err => { res.status(500).json({ error: "error performing search of products whit a specified name"}) })
};

exports.getProductsWhitSimilarName = function(req, res) {
  const regex =  req.query.name + ".*" 
  Product.find({name: { $regex: new RegExp(regex, "i")}})
  .then(products => {
      res.status(200).send({ products: products })
  }).catch(err => { res.status(500).json({ error: "error performing search of products whit a specified name"}) })
};

exports.addSoldProduct = function(req, res) {
  Product.findOne({vendor_id: req.body.vendor_id, name: req.body.name})
    .then(product => {
      let soldProduct = {
        product: product,
        quantity: req.body.quantity
      }
      SoldProduct.findOne({"product._id": soldProduct.product._id})
      .then(prod => {
        if(prod == null){
          SoldProduct.create(soldProduct)
          .then(products => {
            res.status(200).send({ products: products })
          }).catch(err => { res.status(500).json({ error: "error creating a sold product"}) })
        }else{
          prod.quantity = prod.quantity + soldProduct.quantity
          prod.save(function(err, savedObj){
            if(err) { // some error occurs during save
              res.status(500).send({ error: "error saving updates" })
            } else if(!savedObj) {
              res.status(404).send({ error: 'no product found' })
            } else { // cart updated correctly
              res.status(200).send({ products: prod })
            }
          })
        }
      }).catch(err => { res.status(500).json({ error: "error performing search of a sold product"}) })
      }).catch(err => { res.status(500).json({ error: "error performing search of a product "}) })
};


exports.addReview = function(req, res) {

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id; 
          const product_id = req.body.id


          const url = 'http://account:3000/account/customer_id';
  
          superagent.get(url)
          .query({ id: client_id})
          .set('Accept', 'application/json')
          .end((err, response) => {
            
          if (err) { 
            res.status(404).json({ error: 'User does not exist: ' + client_id })
            console.log(err); 
          }
          console.log(response.body);
        
          const update = { 
            $push: { reviews: {
            username: response.body.usr.username,
            text: req.body.text,
            rating: req.body.rating
          }}}
          let avgRating = 0
          Product.findOneAndUpdate({ _id: product_id }, update)
            .then(product => {
              Product.findOne({_id : product_id })
              .then(prod => {
                if(prod != null){
                  prod.reviews.forEach(review => {
                    avgRating += review.rating
                  });
                  console.log("A: " + prod.rating, prod.reviews.length)
                  prod.rating = avgRating / prod.reviews.length
                  console.log("B: " + prod.rating)

                  prod.save(function(err, savedObj){
                    if(err) { // some error occurs during save
                      res.status(500).send({ error: "error saving updates" })
                    } else if(!savedObj) {
                      res.status(404).send({ error: 'no user found' })
                    } else { // user updated correctly
                      res.status(201).send({ _id: product._id })
                    }
                  })
                } 
              }) 
            }).catch(err => {
              res.status(500).json({ error: err })
          }).catch(err => { res.status(500).json({ error: "error performing search of product with specified name"}) })
          });

    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.updateQuantity = function(req, res) {
  Product.findOne({vendor_id: req.body.vendor_id, name: req.body.name})
  .then(product => {
    product.quantity = product.quantity - req.body.quantity
    res.status(200).send({ products: product })

    if(product.quantity <= 0){
      product.availability = false
      product.quantity = 0
      //socket.emit('admin_notification', 'product' + product.name+ '!')
      sendMessage({prod_id: product._id, shop_name: product.shop_name})
      const saveNotification = 'http://account:3000/account/admin/notification';
      superagent.post(saveNotification)
      .set('Content-Type', 'application/json')
      .send({
        sender_id: product._id,
        sender_type: "Prodotto",
        title: "Prodotto terminato",
        body: "Il prodotto con codice: " + product._id + " e nome: " + product.name + " è stato esaurito",
        admin_id: product.vendor_id
      })
      .end((err, response) => {
          
        if (err) { 
            res.status(404).json({ error: 'product does not exist' })
            console.log(err); 
        }
        console.log(response.body);
      }); 
    }
    product.save(function(err, savedObj){
      if(err) { // some error occurs during save
        res.status(500).send({ error: "error saving updates" })
      } else if(!savedObj) {
        res.status(404).send({ error: 'no product found' })
      } else { // cart updated correctly
        console.log("product quantity updated")
      }
    })   
  }).catch(err => {
    res.status(500).json({ error: err })
  }).catch(err => { res.status(500).json({ error: "error performing search of product with specified name"}) }) 
};

exports.updateSale = function(req, res) {

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      const name = req.body.name
      const vendor_id = req.body.vendor_id
      const sale = req.body.sale

      Product.findOneAndUpdate({ name: name, vendor_id: vendor_id}, {$set: {sale: sale}})
        .then(product => {
          const url = 'http://shopping_cart:3000/shopping_cart/sale';
          superagent.put(url)
          .send({ 
            name: name, 
            vendor_id: vendor_id, 
            sale: sale})
          .set('Accept', 'application/json')
          .end((err, response) => {
            
          if (err) { 
            res.status(404).json({ error: "Error updating shopping carts" })
            console.log(err); 
          }
          console.log(response.body);
          res.status(200).send({ _id: product._id })
          });
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

exports.removeProduct = function(req, res) {

  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
        
      Product.findOneAndDelete({ _id: req.query._id })
        .then(product => {
          res.status(204).send({product: product})
        }).catch(err => {
          res.status(500).json({ error: err })
      }).catch(err => { res.status(500).json({ error: "error while deleting the product"}) })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};

exports.recommendedProducts = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          const client_id = decodedPayload._id; 

          const url = 'http://order:3000/order/customer_id';
  
          superagent.get(url)
          .query({ id: client_id})
          .set('Accept', 'application/json')
          .end((err, response) => {
            if (err) { 
              res.status(404).json({ error: 'Order does not exist: ' + client_id })
              console.log(err); 
            }
            //console.log(response.body);
            let pref = {type: "Videogiochi", quantity: 0}
            response.body.order_info.forEach(order => {
              order.items.forEach(item => {
                if(pref.quantity <= item.quantity){
                  pref.quantity = item.quantity
                  Product.findOne({name: item.name, vendor_id: item.vendor_id})
                  .then(prod => {
                      pref.type = prod.type
                  })
                }
              });     
            });  
            Product.find({type: pref.type})
              .then(p => {
                  if(p != null){
                    Product.find({type: pref.type})
                    .then(prod => {
                      res.json({products: prod, type: pref.type, preference: pref})
                    })
                  }   
              }).catch(err => { res.status(500).json({ error: "error performing search of products"}) })         
          });

    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
  }
};
