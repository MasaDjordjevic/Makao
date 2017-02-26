import Game from '../models/game';
import User from '../models/user';
import Stats from '../models/stats';

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
    gameData.duration = Math.round(game.duration);
    gameData.players = players;
    gameData.kicked = kicked;
    gameData.handNum = game.scores.length;
    gameData.scores = game.scores;
    gameData.winner = game.winner;

    let newGame = new Game(gameData);
    newGame.save((err) => {
        if (!err) {
            // sum up scores for each player
            let playerScores = {};
            gameData.players.forEach((username) => {
                playerScores[username] = 0;
            });
            gameData.scores.forEach((handScore) => {
                handScore.forEach((playerScore) => {
                    playerScores[playerScore.username] += playerScore.score;
                });
            });
            // add gameid to db for each player
            Object.keys(game.players).forEach((username) => {
                User.insertGame(username, newGame._id, (err) => {
                    if (err) { console.log(err) }
                });
                // and also update his statistics
                let userGameStats = {
                    kicked: gameData.kicked.indexOf(username) !== -1,
                    won: gameData.winner === username,
                    timeSpent: gameData.duration,
                    gameScore: playerScores[username]
                };
                User.findByUsername(username, (err, user) => {
                    Stats.updateStats(user.stats, userGameStats , (err) => {
                        if (err) { console.log(err) }
                    });
                });
            });
        }
    });
};

module.exports = exp;