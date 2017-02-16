import Games from '../Redis/Games';
import Gameplay from '../Gameplay/Gameplay';
import _ from 'lodash';

module.exports = function (socket) {

    var name = '';
    var creatorName = '';
    console.log('user connected to gameSocket');

    socket.on('join', (creatorUsername, username) => {
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

    socket.on('play:move', (card)=> {
        //remove card from players cards
        //Games.removeFromPlayersCards(creatorName, name, card).then((cards) => {
        Games.getPlayerCards(creatorName, name).then((cards)=>{
            _.remove(cards, (c) =>  c.number  === card.number && c.symbol === card.symbol);
            Games.removePlayerCards(creatorName, name).then(() => {
                Games.setPlayerCards(creatorName, name, cards).then(()=> {
                    //add card to openStack
                    Games.addToOpenStack(creatorName, [card]).then(()=> {
                        //notify others
                        socket.to(creatorName).broadcast.emit('play:move', name, card);
                    });
                });
            });
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
        console.log('user disconnected from gameSocket');
        Games.setPlayerStatus(creatorName, name, 'offline');
        socket.leave(creatorName);
        socket.broadcast.emit('user:left', name);
    });


};