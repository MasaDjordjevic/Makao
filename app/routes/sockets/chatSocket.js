

module.exports = function (socket) {

    console.log('user connected to chatSocket');

    socket.on('send:message', (data) => {
       console.log('user ' + data.username + ' sent message');
       socket.broadcast.emit('send:message', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })

};