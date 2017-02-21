import Game from '../models/game';
import User from '../models/user';

let exp = {};

exp.handleGameEnd = (game) => {
    console.log('game end. Duration: ' + game.duration);
    let gameData = {};
    let players = [], kicked = [];
    Object.keys(game.players).forEach((username) => {
        if (game.players[username].kicked) {
            kicked.push(username);
        } else {
            players.push(username);
        }
    });
    gameData.rules = game.rules;
    gameData.date = game.end;
    gameData.duration = game.duration;
    gameData.players = players;
    gameData.kicked = kicked;
    gameData.handNum = game.scores.length;
    gameData.scores = game.scores;

    let newGame = new Game(gameData);
    newGame.save((err) => {
        if (!err) {
            Object.keys(game.players).forEach((username) => {
                User.insertGame(username, newGame._id, (err) => {
                    if (err) { console.log(err) }
                });
            });
        }
    });
};

module.exports = exp;