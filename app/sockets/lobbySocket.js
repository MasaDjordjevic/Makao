import Games from '../Redis/Games';
import App from '../Redis/App';
import Gameplay from '../Gameplay/Gameplay';

module.exports = function (socket, io) {
    var socketUser = socket.decoded_token.name;
    var creatorName = '';

    socket.on('join', (creatorUsername) => {
        console.log('user ' + socketUser + ' connected to lobbySocket');
        creatorName = creatorUsername;
        socket.join(creatorUsername);
        Games.addToLobby(creatorUsername, socketUser, creatorUsername === socketUser)
        .then(() => {
            Games.getLobby(creatorUsername)
            .then((users) => {
                Gameplay.getGameRules(creatorUsername)
                .then((rules) => {
                    socket.emit('init', {
                        creator: creatorUsername,
                        users: users,
                        rules: rules
                    });
                    socket.to(creatorUsername).broadcast.emit('user:joined', socketUser);
                });
            });
        });
    });

    socket.on('user:ready', (username) => {
        Games.setPlayerLobbyStatus(creatorName, socketUser, 'true');
        console.log('user ready: ' + socketUser);
        io.of('/lobby').to(creatorName).emit('user:ready', socketUser);
    });

    socket.on('game:start', () => {
        Gameplay.setGameStatus(creatorName, 'started');
        Gameplay.startGame(creatorName).then(()=> {
            io.of('/lobby').to(creatorName).emit('game:started');
        });
    });

    socket.on('user:invite', (username) => {
        Games.addInvite(creatorName, username);
        // find the invited user socketid and send him an invite
        App.getUserSocket(username).then((socketid) =>
            io.to(socketid).emit('user:invite', creatorName)
        );
    });

    socket.on('disconnect', () => {
        console.log('user ' + socketUser + ' disconnected from lobbySocket');
        Games.removeFromLobby(creatorName, socketUser);
        socket.leave(creatorName);
        socket.broadcast.emit('user:left', socketUser);
    });
};
