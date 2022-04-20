var express = require('express');
var app = express();
const { DB_URI } = require("./src/config");
const mongoose = require("mongoose");
var cors = require("cors")
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser")
var http = require('http').Server(app);
var io = require('socket.io')(http);
const amqp = require('amqplib');
const superagent = require('superagent');

// secret for JWT
process.env.SECRET_KEY = 'AFe7hMen9W'; 
app.use(cookieParser('ztVX2HQJP0')); // secret for cokieParser
//Needed in order to magage http requests.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb', extended: true},))
app.use(cors({ origin: 'http://localhost:8080', credentials: true }))

//Mongo connection
mongoose.connect(DB_URI);

var routes = require('./src/routes/notificationRoutes');
routes(app);

var channel;
connectRabbit();

async function connectRabbit(){
  //setting up rabbitmq..
  connection = await amqp.connect(process.env.MESSAGE_QUEUE);
  channel = await connection.createChannel();
  await channel.assertQueue('adminData', { durable: true });
}

//Real time functionalities
io.on('connection', function(socket) {

  console.log('user connected');

  //disconnection management
  socket.on('disconnect', function() {
      console.log('user disconnected');
  });

  channel.consume("adminData", product => {
    console.log("product:"+product.content.toString())
    let productData = JSON.parse(product.content.toString())
    console.log(productData)
    const url = 'http://account:3000/account/admin_customer';
    superagent.get(url)
    .query({shop_name: productData.shop_name})
    .set('Accept', 'application/json')
    .end((err, response) => {
      if (err) { 
        res.status(404).json({ error: 'Customer does not exist: ' + orderData.customer_id })
        console.log(err); 
      }
      console.log(response.body);
      socket.broadcast.emit(response.body.admin.username, productData);
    });
  }, {
    noAck: true
  })

  channel.consume("orderData", order => {
    console.log("order:"+order.content.toString())
    let orderData = JSON.parse(order.content.toString())
    console.log(orderData.customer_id)

    const url = 'http://account:3000/account/customer_id';
    superagent.get(url)
    .query({id: orderData.customer_id})
    .set('Accept', 'application/json')
    .end((err, response) => {
      if (err) { 
        res.status(404).json({ error: 'Customer does not exist: ' + orderData.customer_id })
        console.log(err); 
      }
      console.log(response.body);
      socket.broadcast.emit(response.body.usr.username, orderData);
    });
  }, {
    noAck: true
  })

  //istant messaging management
  socket.on("new_advertisement", (msg) => {
    const url = 'http://account:3000/account/admin/advertisemnt';
    superagent.post(url)
    .send(msg)
    .set('Accept', 'application/json')
    .end((err, response) => {
      if (err) { 
        console.log(err); 
      }
      console.log(response.body);
      response.body.users.forEach(user => {
        console.log(user + "aa" + msg)
        socket.broadcast.emit(user, msg);
      });
    });
  })
});

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

http.listen(3000, () => {
  console.log("running on port 3000");
  console.log("--------------------------");
});
