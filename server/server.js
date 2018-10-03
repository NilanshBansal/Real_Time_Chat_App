const http = require('http'); 
const path = require('path');
const publicPath = path.join(__dirname,'../public');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',function(socket){
    console.log("new user connected !");
    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app!'));
    
    socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined!'));

    socket.on('createMessage',(message,callback)=>{
        console.log('newMessage',message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback();
        //Everyone gets this event except the sender
        // socket.broadcast.emit('newMessage',{
        //     from:message.from,
        //     text:message.text,
        //     createAt:new Date().getTime()
        // });

    });

    socket.on('disconnect',function(){
        console.log('User was disconnected!');
    });
});


server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});

