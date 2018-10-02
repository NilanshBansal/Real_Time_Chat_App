var socket = io();

socket.on('connect',function(){
    console.log('connected to server!');

    socket.emit('createEmail',{
        to:'a@b.com',
        text:'hello how r you?'
    });
});

socket.on('disconnect',function(){
    console.log('disconnected from server!');
});

socket.on('newEmail',function(data){
    console.log('new Email !',data);
});