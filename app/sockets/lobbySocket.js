import Games from '../Redis/Games';

var users = {};

module.exports = function (socket) {

    var name = '';
    var creatorName = '';
    console.log('user connected to lobbySocket');

    socket.on('join', (creatorUsername, username) => {
        name = username;
        creatorName = creatorUsername;
        socket.join(creatorUsername);
        Games.addToLobby(creatorUsername, username, creatorUsername === username)
            .then(() => {
                Games.getLobby(creatorUsername)
                    .then((users) => socket.emit('init', users));
                socket.to(creatorUsername).broadcast.emit('user:join', username);
            });
    });

    socket.on('user:ready', (username) => {
        Games.setPlayerLobbyStatus(creatorName, username, 'true');
        console.log('user ready: ' + username);
        socket.to(creatorName).broadcast.emit('user:ready', username);
    });

    socket.on('game:started', () => {
        Games.setGameState(creatorName, 'started');
        //all ready players from lobby become players of game
        Games.getLobby(creatorName).then((players) => {
            let readyPlayers = [];
            readyPlayers.push(creatorName);
            Object.keys(players).forEach((username, index) => {
                if(players[username] === 'ready'){
                    readyPlayers.push(username);
                    readyPlayers.push('offline');
                }
            });
            Games.addPlayers(readyPlayers).then(() => {
                //start the game

                //notify other players that game has started
                socket.to(creatorName).broadcast.emit('game:started');
            });
        });



    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        Games.removeFromLobby(creatorName, name);
        socket.leave(creatorName);
        socket.broadcast.emit('user:left', name);
    });
};
