import Games from '../Redis/Games';
import Chat from '../Redis/Chat';
import Gameplay from '../Gameplay/Gameplay';

module.exports = function (socket) {
    let socketUser = socket.decoded_token.name;
    console.log('user ' + socketUser + ' connected to playSocket');

    socket.on('game:list', () => {
        Games.getPendingGames().then((games) => {
            socket.emit('game:list', games);
        });
    });

    socket.on('game:create', (rules) => {
        let creator = socketUser;
        Chat.removeMessages(creator);
        Gameplay.createGame(creator, rules)
            .then(() => socket.emit('game:created', { creator, rules }))
            .catch((reason) => socket.emit('game:failed', reason));
    });

    socket.on('disconnect', () => {
        console.log('user ' + socketUser + ' disconnected from playSocket');
    });
};