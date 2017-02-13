
module.exports = function (socket) {

        console.log('user connected to lobbySocket');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        })

};