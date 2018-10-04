var socket = io();

socket.on('connect',function(){
    console.log('connected to server!');
});

socket.on('disconnect',function(){
    console.log('disconnected from server!');
});

socket.on('newMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a')
    // console.log('new Message !',message);
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text} `);

    // jQuery('#messages').append(li);

    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formattedTime
    });

    jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage',{
        from:'User',
        text:messageTextbox.val()
    },function(){
        
        messageTextbox.val('')  //Emptying text box
    });
});