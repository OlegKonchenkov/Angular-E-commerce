const jwt = require("jsonwebtoken");
const Order = require("../models/order_model.js");
const superagent = require('superagent');
const amqp = require('amqplib');

connectRabbit();

async function connectRabbit(){
  //setting up rabbitmq..
  connection = await amqp.connect(process.env.MESSAGE_QUEUE);
  channel = await connection.createChannel();
  await channel.assertQueue('orderData', { durable: true });
}

async function sendMessage(msg){
  await channel.sendToQueue('orderData', Buffer.from(JSON.stringify(msg)), {
    contentType: 'application/json',
    persistent: true
  });
}

exports.createOrder = function(req, res) {

    if (req.signedCookies.jwt != null) {
      const token = req.signedCookies.jwt;
      try {
            var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
            const client_id = decodedPayload._id; 
            const payment_type = req.body.payment_type;
            const card_number = req.body.card_number;
            const country = req.body.country;
            const city = req.body.city;
            const street = req.body.street;
            const info = req.body.info;
            let outOfStock = []

            const url = 'http://shopping_cart:3000/shopping_cart_by_id';
  
            superagent.get(url)
            .query({ id: client_id})
            .set('Accept', 'application/json')
            .end((err, response) => {
                
            if (err) { 
                res.status(404).json({ error: 'shopping cart does not exist' })
                console.log(err); 
            }
            console.log(response.body);

            const items = response.body.shopping_cart.items

            const orderData = {
                client_id: client_id,
                items: items,
                totalPrice: response.body.shopping_cart.totalPrice,
                payment: {
                    paymentType: payment_type,
                    cardNumber: card_number,
                },
                shippingData: {
                    country: country,
                    city: city,
                    street: street,
                    info: info
                },
                orderState: "Created",
                delivery:{
                    delivery_id: "",
                    name: ""
                }
              }
              
              Order.create(orderData)
                  .then(order => {
                    items.forEach(item => {
                      let i = 1
                      const urlQunatityUpdate = 'http://products:3000/product/quantity';
                      superagent.put(urlQunatityUpdate)
                      .set('Content-Type', 'application/json')
                      .send({
                        vendor_id: item.vendor_id,
                        name: item.name,
                        quantity: item.quantity})
                      .end((err, response) => {
                          
                        if (err) { 
                            res.status(404).json({ error: 'product does not exist' })
                            console.log(err); 
                        }
                        console.log(response.body);
                        if(response.body.products.quantity < 0){
                          console.log("OUT OF STOCK")
                          outOfStock.push(response.body.products)
                        }else{
                          const urlMostSold = 'http://products:3000/product/most_sold';
                          superagent.post(urlMostSold)
                          .set('Content-Type', 'application/json')
                          .send({
                            vendor_id: item.vendor_id,
                            name: item.name,
                            quantity: item.quantity})
                          .end((err, response) => {
                              
                            if (err) { 
                                res.status(404).json({ error: 'product does not exist' })
                                console.log(err); 
                            }
                            console.log(response.body);
  
                          }); 
                        }
                        //check if all products info was updated
                        i < items.lenght ? i++ : res.status(201).send({ _id: order._id, order_info: order, outOfStock: outOfStock})
                      }); 
                    });      
                  }).catch(err => {
                    res.status(500).json({ error: err })
                  }) 
            });   
      } catch (error) {
        res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
      }
    } else {
      res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
    }
  };

exports.getOrder = function(req, res) {
    if (req.signedCookies.jwt != null) {
        const token = req.signedCookies.jwt;
        try {
          var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
    
            const client_id = decodedPayload._id
            Order.find({ client_id: client_id })
            .then(order => {
                res.status(200).send({ order_info: order })
            }).catch(err => { res.status(500).json({ error: "error performing search of the order"}) })
    
        } catch (error) {
          res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
        }
      } else {
        res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
      }
}

exports.getOrderByID = function(req, res) {
  if (req.signedCookies.jwt != null) {
      const token = req.signedCookies.jwt;
      try {
        var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
        
          Order.findOne({ _id: req.query.id })
          .then(order => {
              res.status(200).send({ order_info: order })
          }).catch(err => { res.status(500).json({ error: "error performing search of the order"}) })
  
      } catch (error) {
        res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
      }
    } else {
      res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
    }
}

exports.getOrderByCustomerID = function(req, res) {
  Order.find({ client_id: req.query.id })
  .then(order => {
      res.status(200).send({ order_info: order })
  }).catch(err => { res.status(500).json({ error: "error performing search of the order"}) })
}

exports.getOrders = function(req, res) {
  Order.find({orderState: req.query.state})
  .then(order => {
      res.status(200).send({ order_info: order })
  }).catch(err => { res.status(500).json({ error: "error performing search of the order"}) })
}

exports.deleteOrder = function(req, res) {
  Order.findByIdAndDelete({_id: req.query.id})
  .then(order => {
      res.status(204).send()
  }).catch(err => { res.status(500).json({ error: "error deleting order"}) })
}

exports.setDelivery = function(req, res) {
  if (req.signedCookies.jwt != null) {
      const token = req.signedCookies.jwt;
      try {
        var decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
          Order.findOne({ _id: req.body._id })
          .then(order => {
            order.delivery.delivery_id = req.body.delivery_id
            order.delivery.name = req.body.name
            order.orderState = req.body.orderStatus
            order.save(function(err, savedObj){
              if(err) { // some error occurs during save
                res.status(500).send({ error: "error saving updates" })
              } else if(!savedObj) {
                res.status(404).send({ error: 'no order found' })
              } else { // user updated correctly
                sendMessage({
                  customer_id: order.client_id, 
                  order_state: order.orderState, 
                  order_date: order.date,
                  order_delivery: order.delivery, 
                  order_items: order.items
                })
                const saveNotification = 'http://account:3000/account/customer/notification';
                superagent.post(saveNotification)
                .set('Content-Type', 'application/json')
                .send({
                  sender_id: order.delivery.delivery_id,
                  sender_type: "Spedizione",
                  title: "Cambio stato dell'ordine",
                  body: "L'ordine con codice: " +order._id +" è stato " + order.orderState,
                  customer_id: order.client_id
                })
                .end((err, response) => {
                    
                  if (err) { 
                      res.status(404).json({ error: 'product does not exist' })
                      console.log(err); 
                  }
                  console.log(response.body);
                  res.status(200).send({ order_info: order })
                }); 
              }
            })   
          }).catch(err => { res.status(500).json({ error: "error performing search of the order "}) })
  
      } catch (error) {
        res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
      }
    } else {
      res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
    }
}