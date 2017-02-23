import Games from '../Redis/Games';
import Gameplay from '../Gameplay/Gameplay';

import _ from 'lodash';


module.exports = function (socket, io) {

    let name = '';
    let creatorName = '';
    let timer;
    let timeLimit;
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
                let timer = game.players[game.playerOnMove].timer;
                let timeLeft = timer ? game.rules.timeLimit - (new Date() - new Date(timer))/1000 : game.rules.timeLimit;
                socket.emit('init', {
                    players: players,
                    cards: cards,
                    talon: talon,
                    playerOnMove: game.playerOnMove,
                    scores: game.scores,
                    moveTime: game.rules.timeLimit,
                    sevenDrawed: game.sevens === 0,
                    timeLeft: timeLeft,
                });
                timeLimit = game.rules.timeLimit * 1000;
                socket.to(creatorUsername).broadcast.emit('user:join', {
                    username: username,
                    online: true,
                    cardNumber: 1,
                    timeLeft: game.playerOnMove === username ? timeLeft: null,
                });
            });
        });

    });

    function emitToEveryone(key, value) {
        socket.emit(key, value);
        socket.to(creatorName).broadcast.emit(key, value);
    }

    function setTimer(){
        timer = setTimeout(timeUp, timeLimit);
        Gameplay.setPlayerTimer(creatorName, name, new Date());
    }

    function emitPlayerOnMove(creatorUsername, username) {
        emitToEveryone('play:playerOnMove', username);

    }

    function emitEveryoneLeft(){
        emitToEveryone('game:everyoneLeft', null);
    }

    function emitLog(log) {
        emitToEveryone('log:new', log);
    }

    socket.on('myMove', () => {
        setTimer();
    });

    socket.on('play:move', (card) => {
        clearTimeout(timer);
        Gameplay.playMove(creatorName, name, card).then((data) => {
            socket.to(creatorName).broadcast.emit('play:move', name, card);
            emitLog(data.log);
            if(data.everyoneLeft){
                emitEveryoneLeft();
            }
            if (data.gameOver) {
                emitToEveryone('game:over', data.scores);
            } else if (data.newHand) {
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

                    players.forEach((player) => {
                        let username = player.username;
                        let cards = game.players[username].cards.slice();
                        io.of('/game').to(sockets[username]).emit('game:newHand', {
                            players: players,
                            cards: cards,
                            talon: talon,
                            playerOnMove: game.playerOnMove,
                            scores: game.scores,
                        });
                    })
                });
            } else {
                emitPlayerOnMove(creatorName, data.playerOnMove);
            }
        });
    });

    function timeUp() {
        clearTimeout(timer);
        let creatorUsername = creatorName;
        let playerUsername = name;
        Gameplay.draw(creatorUsername, playerUsername, true).then((data) => {
            Gameplay.getNextPlayer(creatorUsername, playerUsername).then((passData) => {
                Games.getGameSockets(creatorUsername).then((sockets) => {
                    io.of('/game').to(sockets[playerUsername]).emit('play:get', data.cards);
                    if(data.kicked){
                        io.of('/game').to(sockets[playerUsername]).emit('game:kicked', data.cards);
                    }
                    Object.keys(sockets).forEach((username) => {
                        if(username === playerUsername){
                            return;
                        }
                        io.of('/game').to(sockets[username]).emit('play:draw', playerUsername, data.cardsNumber);
                    });
                    emitLog(data.log);
                    emitLog(passData.logs);
                    if(passData.gameOver){
                        emitEveryoneLeft();
                    }else {
                        emitPlayerOnMove(creatorName, passData.playerOnMove);
                    }

                });

            });

        })
    }

    socket.on('play:draw', () => {
        clearTimeout(timer);
        setTimer(creatorName, name);
        Gameplay.draw(creatorName, name).then((data) => {
            socket.emit('play:get', data.cards);
            socket.to(creatorName).broadcast.emit('play:draw', name, data.cardsNumber);
            emitLog(data.log);
        });
    });

    socket.on('play:pass', () => {
        clearTimeout(timer);
        Gameplay.getNextPlayer(creatorName, name).then((data) => {
            if(data.gameOver){
                emitEveryoneLeft();
            }else {
                emitPlayerOnMove(creatorName, data.playerOnMove);
                emitLog(data.logs);
            }
        });
    });

    socket.on('log:get', (creatorUsername) => {
        Gameplay.getLogs(creatorUsername).then((logs) => {
            socket.emit('log:get', logs);
        })
    });

    socket.on('game:started', (creatorUsername) => {
        Gameplay.getGameStatus(creatorUsername).then((status) => {
            socket.emit('game:started', status === 'started' ? true : status === 'lobby' ? false : null);
        });
    });


    socket.on('disconnect', () => {
        console.log('user disconnected from gameSocket');
        Gameplay.setPlayerOnlineStatus(creatorName, name, false);
        socket.leave(creatorName);
        socket.broadcast.emit('user:left', name);
    });


};