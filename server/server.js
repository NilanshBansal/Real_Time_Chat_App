const http = require('http'); 
const path = require('path');
const publicPath = path.join(__dirname,'../public');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation'); 
const{Users} = require('./utils/users'); 

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',function(socket){
    console.log("new user connected !");
  

    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return  callback('Name & room name are required!  ')    
        } 

        socket.join(params.room)
        users.removeUser(socket.id); //if user with same id joins them remove him from any other rooms
        users.addUser(socket.id,params.name,params.room);
        //socket.leave('ROOM NAME')

        //Earlier --> Now
        //io.emit (To send a message to all users)  -----> io.to('ROOM NAME').emit
        //socket.broadcast.emit (To all users except the current user) -----> socket.broadcast.to('ROOM NAME').emit
        //socket.emit (Only to one user)  ------> SAME
        
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app!'));
    
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has Joined!`));

        callback();
    });

    socket.on('createMessage',(message,callback)=>{
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
        var user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
        }
    });
    
});


server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});

