import Games from '../Redis/Games';

module.exports = function (socket) {

    console.log('user connected to appSocket');

    socket.on('disconnect', () => {
        console.log('user disconnected from appSocket');
    });
};
