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

            name = username;
            creatorName = creatorUsername;
            socket.join(creatorUsername);
            Games.setPlayerStatus(creatorUsername, username, 'online')
                .then(() => {
                    let sendData = {};
                    Games.getPlayersWithStatus(creatorUsername).then((players) => {
                        Games.getPlayerCards(creatorUsername, username).then((cards) => {
                            Games.peakOpenStack(creatorUsername).then((talon) => {
                                Games.getPlayerOnMove(creatorUsername).then((playerOnMove) => {
                                    socket.emit('init', {players: players, cards: cards, talon: talon, playerOnMove: playerOnMove});
                                });
                            });
                        });
                    });
                    socket.to(creatorUsername).broadcast.emit('user:join', {
                        username: username,
                        online: true,
                        cardNumber: 1
                    });
                });

        });


    });

    function emitPlayerOnMove(username){
        socket.emit('play:playerOnMove', username);
        socket.to(creatorName).broadcast.emit('play:playerOnMove', username);
    }

    socket.on('play:move', (card) => {
        Gameplay.playMove(creatorName, name, card).then((playerOnMove) => {
            socket.to(creatorName).broadcast.emit('play:move', name, card);
            emitPlayerOnMove(playerOnMove);
        });
    });

    socket.on('play:draw', (cardsNumber) => {
       if(cardsNumber === undefined){
           cardsNumber = 1;
       }

       Gameplay.draw(creatorName, name, cardsNumber).then((data)=> {
           socket.emit('play:get', data.cards);
           socket.to(creatorName).broadcast.emit('play:draw', name, cardsNumber);
           emitPlayerOnMove(data.playerOnMove);
       });

    });

    socket.on('play:pass', () => {
       Gameplay.nextPlayer(creatorName).then((playerOnMove) => {
           emitPlayerOnMove(playerOnMove);
       });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected from gameSocket');
        Games.setPlayerStatus(creatorName, name, 'offline');
        socket.leave(creatorName);
        socket.broadcast.emit('user:left', name);
    });


};