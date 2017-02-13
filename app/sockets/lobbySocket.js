var users = {};

module.exports = function (socket) {

    var username = '';
    console.log('user connected to lobbySocket');

    socket.on('join', (username) => {
            username = username;
            users[username] = {ready: false};
            socket.emit('init', users);
            socket.broadcast.emit('user:join', username);
            console.log(users);
        }
    );

    socket.on('user:ready', (username) => {
        users[username].ready = true;
        console.log('user ready: ' + username);
        socket.broadcast.emit('user:ready', username);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete users[username];
    })

};
