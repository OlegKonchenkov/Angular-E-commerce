var express = require('express');
var app = express();
const { DB_URI } = require("./src/config");
const mongoose = require("mongoose");
var cors = require("cors")
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser")

// secret for JWT
process.env.SECRET_KEY = 'AFe7hMen9W'; 
app.use(cookieParser('ztVX2HQJP0')); // secret for cokieParser
//Needed in order to magage http requests.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb', extended: true},))
app.use(cors({ origin: 'http://localhost:8080', credentials: true }))

//Mongo connection
mongoose.connect(DB_URI);

var accountRoutes = require('./src/routes/accountRoutes');
var adminRoutes = require('./src/routes/adminRoutes');
var customerRoutes = require('./src/routes/customerRoutes');
var deliveryRoutes = require('./src/routes/deliveryRoutes');
var founderRoutes = require('./src/routes/founderRoutes');

accountRoutes(app);
adminRoutes(app);
customerRoutes(app);
deliveryRoutes(app);
founderRoutes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(3000, () => {
  console.log("running on port 3000");
  console.log("--------------------------");
});
