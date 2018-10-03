var socket = io();

socket.on('connect',function(){
    console.log('connected to server!');
});

socket.on('disconnect',function(){
    console.log('disconnected from server!');
});

socket.on('newMessage',function(data){
    console.log('new Message !',data);
});

socket.emit('createMessage',{
    from: 'Frank',
    text:'Hi'
},function(data){
    console.log(data);
});