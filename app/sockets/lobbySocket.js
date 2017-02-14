var users = {};

module.exports = function (socket) {

    var name = '';
    console.log('user connected to lobbySocket');

    socket.on('join', (username) => {
        name = username;
        users[username] = {ready: false};
        socket.emit('init', users);
        socket.broadcast.emit('user:join', username);
        console.log(users);
    });

    socket.on('user:ready', (username) => {
        users[username].ready = true;
        console.log('user ready: ' + username);
        socket.broadcast.emit('user:ready', username);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete users[name];
        socket.broadcast.emit('user:left', name);
    })

};
