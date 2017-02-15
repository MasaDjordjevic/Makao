import Chat from '../Redis/Chat';

module.exports = function (socket) {
    console.log('user connected to chatSocket');

    var name = '';
    var creatorName = '';

    socket.on('subscribe', (creatorUsername, playerUsername) => {
        creatorName = creatorUsername;
        name = playerUsername;
        socket.join(creatorUsername);
        Chat.getMessages(creatorUsername)
            .then((messages) => socket.emit('init', messages));
    });

    socket.on('send:message', (data) => {
        console.log('user ' + data.username + ' sent message');
        Chat.addMessage(creatorName, data)
            .then(() => socket.broadcast.to(creatorName).emit('send:message', data))
            .catch((reason) => {
            }); //TODO send user message that something went wrong

    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })

};