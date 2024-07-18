const amqplib = require('amqplib');
require('dotenv').config()

class Producer {

    // create a constructor
    constructor(){
        // create connection
        this.createConnection();
    }
    
    // // channel;
    // async createConnection(){
    //     const connection = await amqplib.connect(process.env.RABBITMQ_URL);

    //     let channel = await connection.createChannel(process.env.CHANNEL_NAME);
    //     return channel

    // }

    async publishMessage(routingKey, message){
        if (!this.channel){
            this.channel = await this.createConnection()
        }

        //console.log(this.channel);

        await this.channel.assertExchange(process.env.EXCHANGE_NAME, "direct");

        this.channel.assertQueue(process.env.QUEUE_NAME)

        this.channel.bindQueue(process.env.QUEUE_NAME, process.env.EXCHANGE_NAME, routingKey)

        this.channel.publish(process.env.EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)))

    }    

    createConnection(){
        amqplib.connect(process.env.RABBITMQ_URL).then( async (connection) => {
            
        this.channel = await connection.createChannel(process.env.CHANNEL_NAME);

        console.log('channel created successfully')

        // this.channel is our channel

    }).catch(error => {
        console.log("An error occured: " + error.message);
    })

    }

    consumeMessage(){
        this.channel.consume(process.env.QUEUE_NAME, (message) => {
           
            console.log("Consumed: ", message.content.toString())

            this.channel.ack(message)

            return {
                message:"Message Consumed",
                data: message
            }
        })
    }
}

module.exports = Producer