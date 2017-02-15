import Games from '../Redis/Games';

module.exports = function(socket) {

    var name = '';
    var creatorName = '';
    console.log('user connected to gameSocket');

    socket.on('join', (creatorUsername, username) => {
        debugger;
        name = username;
        creatorName = creatorUsername;
        socket.join(creatorUsername);
        Games.setPlayerStatus(creatorUsername, username, 'online')
            .then(() => {
                Games.getPlayersWithStatus(creatorUsername).then((data) => socket.emit('init', data));
                socket.to(creatorUsername).broadcast.emit('user:join', {username: username, online:true, cardNumber: 1});
            });
    });
/*
    socket.on('user:ready', (username) => {
        Games.setPlayerLobbyStatus(creatorName, username, 'true');
        console.log('user ready: ' + username);
        socket.to(creatorName).broadcast.emit('user:ready', username);
    });

    socket.on('game:started', () => {
        Games.setGameState(creatorName, 'started');
        socket.to(creatorName).broadcast.emit('game:started');
    });
*/
    socket.on('disconnect', () => {
        console.log('user disconnected from game');
        Games.setPlayerStatus(creatorName, name, 'offline');
        socket.leave(creatorName);
        socket.broadcast.emit('user:left', name);
    });


};