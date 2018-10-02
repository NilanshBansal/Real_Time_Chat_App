const http = require('http'); 
const path = require('path');
const publicPath = path.join(__dirname,'../public');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',function(socket){
    console.log("new user connected !");

    socket.emit('newEmail',{
        from:'a@b.com',
        text:"Hello, how are you?",
        createAt:123
    });

    socket.on('createEmail',(newEmail)=>{
        console.log('createEmail',newEmail);
    });

    socket.on('disconnect',function(){
        console.log('User was disconnected!');
    });
});


server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});

