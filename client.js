const express = require("express");
const Producer = require("./producer");
const server = express(); // create a new express server app

//middleware
server.use(express.json());

//create producer
const producer = new Producer();

//route
server.get("/", (req, res) => {
    res.status(200).send({
        message: "Everything Works fine",
        code: "success"
    })
})

// send a message to the queue
server.post("/send-message", async (req, res) => {
    let message_title = req.body.title.trim();
    let message_content = req.body.content.trim();

    if(message_title.length > 0 && message_content.length > 0){
        //proceed to send message to the queue
        let message = {
            title: message_title,
            content: message_content
        }
        await producer.publishMessage("process.env.ROUTING_KEY", message);
        res.status(200).send({
            message: "Message sent successfully",
            code: "success",
            data: message
        })
    }    
});

server.get("/consume", (req, res) => {

    producer.consumeMessage();
    res.status(200).send({
        message: "Message consumed successfully",
        data: null
    })
    
})
//server needs to be listening
server.listen(1234, () => {
    console.log("server is listening on port 1234");
})