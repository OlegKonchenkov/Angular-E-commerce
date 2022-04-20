const amqp = require('amqplib');

/*
var connection;
var channel;

connectRabbit();

async function connectRabbit(){
  //setting up rabbitmq..
  connection = await amqp.connect(process.env.MESSAGE_QUEUE);
  channel = await connection.createChannel();
  await channel.assertQueue('login', { durable: true });
  await channel.assertQueue('userData', { durable: true });

  channel.consume("login", function(user) {
    User.findOne({ username: user.content.toString()})
        .then(user => {
            sendToAuth(user)
        })
  }, {
    noAck: true
  })
}

async function sendToAuth(user){
  await channel.sendToQueue('userData', Buffer.from(JSON.stringify(user)), {
    contentType: 'application/json',
    persistent: true
  });
}
*/
