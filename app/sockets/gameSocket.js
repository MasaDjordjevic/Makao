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

    function emitToEveryone(key, value){
        socket.emit(key, value);
        socket.to(creatorName).broadcast.emit(key, value);
    }

    function emitPlayerOnMove(username){
        emitToEveryone('play:playerOnMove', username);
    }

    function emitLog(log){
        emitToEveryone('log:new', log);
    }

    socket.on('play:move', (card) => {
        Gameplay.playMove(creatorName, name, card).then((data) => {
            socket.to(creatorName).broadcast.emit('play:move', name, card);
            emitPlayerOnMove(data.playerOnMove);
            emitLog(data.log);
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
           emitLog(data.log);
       });

    });

    socket.on('play:pass', () => {
       Gameplay.nextPlayer(creatorName).then((playerOnMove) => {
           emitPlayerOnMove(playerOnMove);
           emitLog({username: name, message: "pass"});
       });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected from gameSocket');
        Games.setPlayerStatus(creatorName, name, 'offline');
        socket.leave(creatorName);
        socket.broadcast.emit('user:left', name);
    });


};