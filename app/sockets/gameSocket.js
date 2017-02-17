import Games from '../Redis/Games';
import Gameplay from '../Gameplay/Gameplay';
import _ from 'lodash';

module.exports = function (socket) {

    var name = '';
    var creatorName = '';
    console.log('user connected to gameSocket');

    socket.on('join', (creatorUsername, username) => {
        if (!creatorUsername || !username) {
            return;
        }
        Games.getPlayers(creatorUsername).then((players) => {
            if (!players[username]) {
                return;
            }

            Gameplay.startGame();
            name = username;
            creatorName = creatorUsername;
            socket.join(creatorUsername);
            Games.setPlayerStatus(creatorUsername, username, 'online')
                .then(() => {
                    let sendData = {};
                    Games.getPlayersWithStatus(creatorUsername).then((players) => {
                        Games.getPlayerCards(creatorUsername, username).then((cards) => {
                            Games.peakOpenStack(creatorUsername).then((talon) => {
                                socket.emit('init', {players: players, cards: cards, talon: talon});
                            })
                        })
                    });
                    socket.to(creatorUsername).broadcast.emit('user:join', {
                        username: username,
                        online: true,
                        cardNumber: 1
                    });
                });

        });


    });

    socket.on('play:move', (card) => {
        Gameplay.playMove(creatorName, name, card).then(() => {
            socket.to(creatorName).broadcast.emit('play:move', name, card);
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected from gameSocket');
        Games.setPlayerStatus(creatorName, name, 'offline');
        socket.leave(creatorName);
        socket.broadcast.emit('user:left', name);
    });


};