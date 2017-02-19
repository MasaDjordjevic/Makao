import Games from '../Redis/Games';
import Gameplay from '../Gameplay/Gameplay';

module.exports = function (socket) {
    var socketUser = socket.decoded_token.name;
    console.log('user ' + socketUser + ' connected to playSocket');

    socket.on('game:list', () => {
        Games.getGameList();
    });

    socket.on('game:create', (rules) => {
        let creator = socketUser;
        Gameplay.createGame(creator, rules)
            .then(() => socket.emit('game:created', { creator, rules }))
            .catch((reason) => socket.emit('game:failed', reason));
    });

    socket.on('disconnect', () => {
        console.log('user ' + socketUser + ' disconnected from playSocket');
    });
};