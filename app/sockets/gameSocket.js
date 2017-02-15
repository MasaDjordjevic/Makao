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
        Games.addPlayer(creatorUsername, username, JSON.stringify({online:true, cardNumber: 1}))
            .then(() => {
                Games.getPlayers(creatorUsername)
                    .then((data) => {
                        Object.keys(data).forEach((key, index) => data[key] = JSON.parse(data[key]));
                        socket.emit('init', data)
                    });
                socket.to(creatorUsername).broadcast.emit('user:join', username);
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
        Games.getPlayerStatus(creatorName, name).then((reply)=> {
            Games.setPlayerStatus(creatorName, name, JSON.stringify({online:false, cardNumber: JSON.parse(reply).cardNumber}));
        });
        socket.leave(creatorName);
        socket.broadcast.emit('user:left', name);
    });


};