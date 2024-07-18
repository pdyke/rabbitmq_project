const express = require("express");
const Consumer = require("./consumer");
const server = express(); // create a new express server app



createConnection(){
    amqplib.connect(process.env.RABBITMQ_URL).then( async (connection) => {
        
    this.channel = await connection.createChannel(process.env.CHANNEL_NAME);

    console.log('channel created successfully')

    // this.channel is our channel

}).catch(error => {
    console.log("An error occured: " + error.message);
})

}