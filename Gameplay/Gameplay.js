import redis from 'redis';
import Games from '../Redis/Games';
import GameEnd from './GameEnd';
import _ from 'lodash';
import Card from '../client/src/components/Card/Card';

let redisCli = redis.createClient();
let exp = {}; //da ne pisem svaki put module.exports

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function createStack(stackNum) {
    let numbers = [ 3, 4, 5, 6, 7, 8, 10, 13, 14, 9, 2, 12, 1];
    let signs = ["spades", "diamonds", "clubs", "hearts"];
    let deck = [];
    Array(stackNum).fill(null).forEach((i) => {
        numbers.forEach((number) => signs.forEach((s) => deck.push(new Card(s, number.toString()))));
    });
    shuffle(deck);
    return deck;
}

function getCards(stack, number) {
    return stack.splice(0, number);
}

function getTalon(stack) {
    let card = null;
    let index = 0;
    do {
        card = stack[index++];
    } while (card.number === '12' || card.number === '7' || card.number === '8' ); //do not let some meaningful card be on talon
    index--;
    stack.splice(index, 1)
    return card;
}

exp.createGame = (creatorUsername, rules) => {
    return new Promise((resolve, reject) => {
        let game = {};
        game.rules = rules;
        game.status = 'lobby';
        game.logs = [];
        game.scores = [];
        Games.setGame(creatorUsername, game).then(() => {
            Games.addPendingGame(creatorUsername).then(() => {
                resolve();
            });
        });
    });
};

exp.startGame = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        //all ready players from lobby become players of game
        Games.getLobby(creatorUsername).then((players) => {
            let readyPlayers = {};
            players.forEach((player) => {
                if (player.ready) {
                    readyPlayers[player.username] = {
                        online: false,
                        timeUp: 0,
                    }
                }
            });
            Games.getGame(creatorUsername).then((game) => {
                game.start = new Date();
                game.players = readyPlayers;
                game.playerOnMove = creatorUsername;
                game.handStarter = creatorUsername;
                game.direction = 1;
                game.sevens = 0; //no of sevens played in a row, can not be determinated from openStack because player can draw and then play seven again
                deal(game);

                Games.setGame(creatorUsername, game).then(() => {
                    Games.delGameInvites(creatorUsername).then(() => {
                        Games.delLobby(creatorUsername).then(() => {
                            Games.remPendingGame(creatorUsername).then(() => {
                                Games.addStartedGame(creatorUsername).then(() => {
                                    resolve();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

function nextHand(game) {
    game.direction = 1;
    let nextStarter = nextHandStarter(game);
    game.playerOnMove = nextStarter;
    deal(game);
}

function deal(game) {
    //kreiraj spilove
    let stack = createStack(game.rules.deckNumber);

    //stavi kartu na talon (openStack)
    let talon = getTalon(stack);
    game.openStack = [talon];

    //podeli igracima karte
    const cardsPerPlayer = 6;
    Object.keys(game.players).forEach((player, index) => {
        game.players[player].cards = getCards(stack, cardsPerPlayer);
    });
    game.drawStack = stack;
    game.status = 'started';
}

exp.getGame = (creatorUsername) => {
    return Games.getGame(creatorUsername);
};


function playerHasOnly12(game, playerUsername) {
    let cards = game.players[playerUsername].cards;
    return _.every(cards, (card) => card.number == 12);
}

function determineNextPlayer(game, playerUsername, card, newLogs) {
    if (card.number === '1') { //same player
        return nextPlayer(game, 0);
    }
    if (card.number === '12') {//ako su mu ostale samo zace moze sve da ih baci
        if (playerHasOnly12(game, playerUsername)) {
            return nextPlayer(game, 0);
        }
    }
    if (card.number === '8') {
        newLogs.push({message: 'player skipped'});
        return nextPlayer(game, 2);
    }

    return nextPlayer(game);
}

function determineDrawCount(game) {
    let lastCard = _.last(game.openStack);
    if (lastCard.number === '2' && lastCard.symbol === 'diamonds') { //dvojka karo
        return _.takeRightWhile(game.drawStack, (card) => card.symbol !== 'diamonds').length + 1; //vuce sve do kocke
    } else if (lastCard.number !== '7') {
        return 1;
    } else {
        let sevens = game.sevens;
        game.sevens = 0;
        if (sevens === 0) {
            return 1;
        }
        return sevens * 2; //TODO nadji koliko se vuce na sedmicu
    }
}

function fixDrawStack(game) {
    if (game.drawStack.length > 0) {
        return;
    }

    if (game.openStack.length === 0) {
        console.log("nema vise karata!!!!");
    }

    //resetuj sve zace
    game.openStack.forEach((card) => card.jackSymbol = null);

    //ostavi samo poslednu kartu na talonu, ostale prebaci u drawStack
    let last = game.openStack.pop();
    game.drawStack = game.openStack.slice();
    game.openStack = [last];
}

function determineConsequences(game, card, newLogs) {

    if (card.number === '9') {
        game.direction *= -1;
        newLogs.push({message: 'direction changed'});
    }

    if (card.number === '7') {
        game.sevens++;
    } else {
        game.sevens = 0;
    }


}

function nextHandStarter(game, offset = 1) {
    let next = nextUser(game, game.handStarter, offset);
    game.handStarter = next;
    return next;
}

function nextPlayer(game, offset = 1) {
    let next = nextUser(game, game.playerOnMove, offset);
    game.playerOnMove = next;
    return next;
}

function nextUser(game, currentUsername, offset = 1) {
    if (offset === 0) {
        return currentUsername;
    }
    offset = offset * game.direction;
    let players = _.keys(game.players);
    let currIndex = players.indexOf(currentUsername);
    let nextIndex = (currIndex + offset + players.length) % players.length;

    let count = 0;
    while (game.players[players[nextIndex]].kicked && count < players.length) {
        nextIndex = (currIndex + 1 + players.length) % players.length;
        count++;
    }

    //nema vise igraca, kraj igre
    if (count === players.length) {
        return null;
    }

    return players[nextIndex];
}

exp.getNextPlayer = (creatorUsername, name) => {
    return new Promise((resolve, reject) => {
        Games.getGame(creatorUsername).then((game) => {
            let playerOnMove = nextPlayer(game);
            let log = {username: name, message: "pass"};
            game.logs.push(log);
            let newLogs = [log];

            if (!playerOnMove) {
                handleGameEnd(game, newLogs);
                Games.setGame(creatorUsername, game).then(() => {
                    resolve({gameOver: true, logs: newLogs});
                    GameEnd.handleGameEnd(game);
                })
            }

            Games.setGame(creatorUsername, game).then(() => {
                resolve({playerOnMove: playerOnMove, logs: newLogs});
            })
        });
    });
};

function isTwoDiamonds(game) {
    let talon = _.last(game.openStack);
    return talon.number === '2' && talon.symbol === 'diamonds';
}

function setScores(game, playerUsername) {
    let scores = [];
    // winner
    let winnerScore;
    let scoresFactor = 1;
    let jackNum = _.takeRightWhile(game.openStack, (card) => card.number === '12').length;
    if (jackNum > 0) {
        scoresFactor = Math.pow(2, jackNum);
        winnerScore = -10 * scoresFactor;
    } else {
        winnerScore = -10;
    }
    scores.push({username: playerUsername, score: winnerScore});

    //losers
    Object.keys(game.players).forEach((username, index) => {
        if (username === playerUsername) {
            return;
        }

        let score = 0;
        game.players[username].cards.forEach((card, i) => {
            let cardNum = +card.number;
            if (cardNum < 10) {
                score += +card.number;
            } else if (cardNum === 12) {
                score += 20;
            } else {
                score += 10;
            }
        });
        score *= scoresFactor;
        scores.push({username: username, score: score});
    });

    game.scores.push(scores);

    return scores;
}

function handEnd(game, playerUsername) {
    if (game.players[playerUsername].cards.length === 0) {
        setScores(game, playerUsername);
        nextHand(game);
        return true;
    }
    return false;
}

function gameEnd(game) {
    let scores = JSON.parse(JSON.stringify(game.scores));
    scores = scores.map((round, i) => {
        round.map((s, j) => {
            s.score += i === 0 ? 0 : _.find(scores[i - 1], {username: s.username}).score;
            return s;
        });
        return round;
    });

    let end = false;
    let limit = game.rules.gameLimit;
    _.last(scores).forEach((user, i) => {
        if (user.score > limit || user.score < -limit) {
            end = true;
            saveWinner(game);
        }
    });

    return end;
}

function handleGameEnd(game, newLogs) {
    let log = {message: 'game over'};
    newLogs.push(log);

    game.status = 'finished';
    //utvrdi vreme trajanja
    game.end = new Date();
    let durationMiliseconds = new Date(game.end) - new Date(game.start);
    game.duration = ((durationMiliseconds % 86400000) % 3600000) / 60000;
}

function saveWinner(game) {
    let playerScores = {};
    Object.keys(game.players).forEach((username) => {
        playerScores[username] = 0;
    });
    game.scores.forEach((handScore) => {
        handScore.forEach((playerScore) => {
            playerScores[playerScore.username] += playerScore.score;
        });
    });
    let minScore = 999999;
    let winner = '';
    Object.keys(playerScores).forEach((username) => {
        if (playerScores[username] < minScore) {
            minScore = playerScores[username];
            winner = username;
        }
    });

    game.winner = winner;
}

exp.playMove = (creatorUsername, playerUsername, card) => {
    return new Promise((resolve, reject) => {
        Games.getGame(creatorUsername).then((game) => {
            //remove card from players
            _.remove(game.players[playerUsername].cards, {number: card.number, symbol: card.symbol}); //not using card object because other properties may not be the same
            //add card to openStack
            game.openStack.push(card);
            //add log
            let log = {username: playerUsername, card: card};
            let newLogs = [log];
            //check if hand is over
            if (handEnd(game, playerUsername, newLogs)) {
                let log = {username: playerUsername, win: true};
                newLogs.push(log);

                //check if game is over
                if (gameEnd(game)) {
                    handleGameEnd(game, newLogs);
                    game.logs = game.logs.concat(newLogs);

                    Games.setGame(creatorUsername, game).then(() => {
                        resolve({gameOver: true, scores: game.scores, log: newLogs});
                        GameEnd.handleGameEnd(game);

                        Games.delGame(creatorUsername);
                        Games.delGameSockets(creatorUsername);
                        Games.remStartedGame(creatorUsername);
                    });
                }

                Games.setGame(creatorUsername, game).then(() => {
                    resolve({newHand: game, log: newLogs});
                });
            } else {
                let next;
                if (!isTwoDiamonds(game)) {
                    //determine consequences
                    determineConsequences(game, card, newLogs);
                    //determine next player
                    next = determineNextPlayer(game, playerUsername, card, newLogs);
                } else {
                    next = nextPlayer(game);
                }



                if (!next) {
                    handleGameEnd(game, newLogs);
                    game.logs = game.logs.concat(newLogs);
                    Games.setGame(creatorUsername, game).then(() => {
                        resolve({everyoneLeft: true, logs: newLogs});
                    })
                }

                game.logs = game.logs.concat(newLogs);
                Games.setGame(creatorUsername, game).then(() => {
                    resolve({playerOnMove: next, log: newLogs});
                });
            }
        });
    });
};

exp.draw = (creatorUsername, playerUsername, timeUp = false) => {
    return new Promise((resolve, reject) => {
        Games.getGame(creatorUsername).then((game) => {
            fixDrawStack(game);
            let drawCount = determineDrawCount(game);
            let cards = game.drawStack.splice(-drawCount, drawCount);
            _.reverse(cards); //to be in order like if player took one by one
            game.players[playerUsername].cards = game.players[playerUsername].cards.concat(cards);
            //add log
            let log = {username: playerUsername, draw: drawCount};
            let newLogs = [log];
            game.logs.push(log);

            //time up

            if (timeUp) {
                let timeUpLog = {username: playerUsername, message: "time's up"};
                newLogs = [timeUpLog, ...newLogs];
                game.logs.push(timeUpLog);

                game.players[playerUsername].timeUp++;

                if (game.players[playerUsername].timeUp > 1) {
                    game.players[playerUsername].kicked = true;
                    var kicked = true;
                    console.log("Igrac " + playerUsername + ' izbacen.');
                }
            }

            if (isTwoDiamonds(game)) {
                _.last(cards).mustPlay = true;
            }

            Games.setGame(creatorUsername, game).then(() => {
                resolve({cards: cards, log: newLogs, cardsNumber: drawCount, kicked: kicked});
            });
        });
    });
};

exp.setPlayerOnlineStatus = (creatorUsername, playerUsername, status) => {
    return new Promise((resolve, reject) => {
        Games.getGame(creatorUsername).then((game) => {
            game.players[playerUsername].online = status;
            Games.setGame(creatorUsername, game).then(() => {
                resolve();
            })
        });
    });
};

exp.getGameStatus = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        Games.getGame(creatorUsername).then((game) => {
            resolve(game ? game.status : 'not created');
        });
    });
};

exp.setGameStatus = (creatorUsername, status) => {
    return new Promise((resolve, reject) => {
        Games.getGame(creatorUsername).then((game) => {
            game.status = status;
            Games.setGame(creatorUsername, game).then(() => {
                resolve();
            })
        });
    });
};

exp.getLogs = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        Games.getGame(creatorUsername).then((game) => {
            resolve(game.logs);
        });
    });
};

exp.getGameRules = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        Games.getGame(creatorUsername).then((game) => {
            resolve(game.rules);
        });
    });
};


exp.setPlayerTimer = (creatorUsername, playerUsername, timer) => {
    return new Promise((resolve, reject) => {
        Games.getGame(creatorUsername).then((game) => {
            game.players[playerUsername].timer = timer;
            Games.setGame(creatorUsername, game).then(() => {
                resolve();
            })
        });
    });
};

module.exports = exp;