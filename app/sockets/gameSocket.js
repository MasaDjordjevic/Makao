import Games from '../Redis/Games';
import Gameplay from '../Gameplay/Gameplay';

import _ from 'lodash';


module.exports = function (socket, io) {

    var name = '';
    var creatorName = '';
    console.log('user connected to gameSocket');

    socket.on('join', (creatorUsername, username) => {
        if (!creatorUsername || !username) {
            return;
        }

        Games.setPlayerSocket(creatorUsername, username, socket.id).then(() => {

            Games.getGame(creatorUsername).then((game) => {
                if (!game.players[username]) {
                    return;
                }

                name = username;
                creatorName = creatorUsername;
                socket.join(creatorUsername);
                Gameplay.setPlayerOnlineStatus(creatorUsername, username, true);
                let cards = game.players[username].cards.slice();
                let players = [];
                Object.keys(game.players).forEach((player) => {
                    players.push({
                        username: player,
                        online: game.players[player].online,
                        cardNumber: game.players[player].cards.length
                    });
                });
                let talon = _.last(game.openStack);
                socket.emit('init', {players: players, cards: cards, talon: talon, playerOnMove: game.playerOnMove});
                socket.to(creatorUsername).broadcast.emit('user:join', {
                    username: username,
                    online: true,
                    cardNumber: 1
                });
            });
        });

    });

    function emitToEveryone(key, value) {
        socket.emit(key, value);
        socket.to(creatorName).broadcast.emit(key, value);
    }

    function emitPlayerOnMove(username) {
        emitToEveryone('play:playerOnMove', username);
    }

    function emitLog(log) {
        emitToEveryone('log:new', log);
    }

    socket.on('play:move', (card) => {
        Gameplay.playMove(creatorName, name, card).then((data) => {
            socket.to(creatorName).broadcast.emit('play:move', name, card);
            if (data.newHand) {
                Games.getGameSockets(creatorName).then((sockets) => {
                    let game = data.newHand;
                    let players = [];
                    let talon = _.last(game.openStack);
                    Object.keys(game.players).forEach((username) => {
                        players.push({
                            username: username,
                            online: game.players[username].online,
                            cardNumber: game.players[username].cards.length
                        });
                    });

                    players.forEach((player)=> {
                        let username = player.username;
                        let cards = game.players[username].cards.slice();
                        io.to(sockets[username]).emit('init', {
                            players: players,
                            cards: cards,
                            talon: talon,
                            playerOnMove: game.playerOnMove
                        });
                    })
                });

            } else {
                emitPlayerOnMove(data.playerOnMove);
            }
            emitLog(data.log);
        });
    });

    socket.on('play:draw', () => {
        Gameplay.draw(creatorName, name).then((data) => {
            socket.emit('play:get', data.cards);
            socket.to(creatorName).broadcast.emit('play:draw', name, data.cardsNumber);
            emitLog(data.log);
        });

    });

    socket.on('play:pass', () => {
        Gameplay.getNextPlayer(creatorName).then((playerOnMove) => {
            emitPlayerOnMove(playerOnMove);
            emitLog([{username: name, message: "pass"}]);
        });
    });

    socket.on('log:get', (creatorUsername) => {
        Gameplay.getLogs(creatorUsername).then((logs) => {
            socket.emit('log:get', logs);
        })
    });


    socket.on('disconnect', () => {
        console.log('user disconnected from gameSocket');
        Gameplay.setPlayerOnlineStatus(creatorName, name, false);
        socket.leave(creatorName);
        socket.broadcast.emit('user:left', name);
    });


};