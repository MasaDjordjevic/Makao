import redis from 'redis';
import Games from '../Redis/Games';
import _ from 'lodash';
import Card from '../client/src/components/Card/Card';

let redisCli = redis.createClient();
let exp = {}; //da ne pisem svaki put module.exports

function createStack() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14];
    let signs = ["spades", "diamonds", "clubs", "hearts"];
    let deck = [];
    numbers.forEach((number) => signs.forEach((s) => deck.push(new Card(s, number.toString()))));
    return deck;
}

function getRandomCards(stack, number) {
    let retCards = [];
    for (let i = 0; i < number; i++) {
        let randomIndex = Math.floor(Math.random() * stack.length);
        let randomElement = stack[randomIndex];
        stack.splice(randomIndex, 1);
        retCards.push(randomElement);
    }
    return retCards;
}

exp.startGame = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        //all ready players from lobby become players of game
        Games.getLobby(creatorUsername).then((players) => {
            let readyPlayers = [];
            readyPlayers.push(creatorUsername);
            Object.keys(players).forEach((username, index) => {
                if (players[username] === 'true') {
                    readyPlayers.push(username);
                    readyPlayers.push('offline');
                }
            });
            Games.setPlayers(readyPlayers).then(() => {
                Games.removeLogs(creatorUsername);
                //set player on move
                Games.setPlayerOnMove(creatorUsername, creatorUsername);
                //set hand starter
                Games.setHandStarter(creatorUsername, creatorUsername);

                //start the game
                exp.deal(creatorUsername).then(() => {
                    resolve();
                });
            });
        });
    });
};

exp.deal = (creatorUsername) => {
    return new Promise((resolve, reject) => {

        //kreiraj spilove
        let stack = createStack();

        //stavi kartu na talon (openStack)
        let openStack = [];
        let talon = getRandomCards(stack, 1)[0];
        openStack.push(talon);
        Games.setOpenStack(creatorUsername, openStack);


        //podeli igracima karte
        const cardsPerPlayer = 6;
        Games.getPlayersUsernames(creatorUsername).then((players) => players.forEach((username, index) => {
            let cards = getRandomCards(stack, cardsPerPlayer);
            Games.setPlayerCards(creatorUsername, username, cards).then(() => {
                if (index === players.length - 1) {
                    //stavi ostalo u drawStack
                    Games.setDrawStack(creatorUsername, stack).then(() => {
                        Games.setGameState(creatorUsername, 'started').then(() => resolve());
                    });
                }
            });
        }));
    });
};

exp.getGame = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        let ret = {};
        Games.getGameState(creatorUsername)
            .then((data) => {
                ret.state = data;
                Games.getGameRules(creatorUsername).then((data) => {
                    ret.rules = data;
                    Games.getLogs(creatorUsername).then((data) => {
                        ret.logs = data;
                        Games.getPlayerOnMove(creatorUsername).then((data) => {
                            ret.playerOnMove = data;
                            Games.getHandStarter(creatorUsername).then((data) => {
                                ret.handStarter = data;
                                Games.getPlayersWithStatus(creatorUsername).then((data) => {
                                    ret.players = data;
                                    Games.getOpenStack(creatorUsername).then((data) => {
                                        ret.openStack = data;
                                        Games.getDrawStack(creatorUsername).then((data) => {
                                            ret.drawStack = data;
                                            Games.getPlayersWithCards(creatorUsername).then((data) => {
                                                ret.playersCards = data;
                                                resolve(ret);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
    });
};

exp.determineNextPlayer = (creatorUsername, playerUsername, card) => {
    return new Promise((resolve, reject) => {

    });
};

exp.nextPlayer = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        Games.getPlayersUsernames(creatorUsername).then((players) => {
            Games.getPlayerOnMove(creatorUsername).then((curr) => {
                let currIndex = players.indexOf(curr);
                let nextIndex = (currIndex + 1) % players.length;
                let next = players[nextIndex];
                Games.setPlayerOnMove(creatorUsername, next).then(() => {
                    resolve(next);
                })
            });
        });
    });
};

exp.playMove = (creatorUsername, playerUsername, card) => {
    return new Promise((resolve, reject) => {
        //remove card from players cards
        //ne radi
        //Games.removeFromPlayersCards(creatorUsername, playerUsername, card).then((cards) => {
        Games.getPlayerCards(creatorUsername, playerUsername).then((cards) => {
            _.remove(cards, (c) => c.number === card.number && c.symbol === card.symbol);
            Games.setPlayerCards(creatorUsername, playerUsername, cards).then(() => {
                //add card to openStack
                Games.addToOpenStack(creatorUsername, [card]).then(() => {
                    //add log
                    let log = {username: playerUsername, card: card};
                    Games.addLog(creatorUsername, log).then(() => {
                        //determine next player
                        exp.nextPlayer(creatorUsername).then((playerOnMove) => {
                            resolve({playerOnMove: playerOnMove, log: log});
                        });
                    });
                });
            });
        });
    });
};

exp.draw = (creatorUsername, playerUsername, cardsNumber) => {
    return new Promise((resolve, reject) => {
        //get and remove cards from draw stack
        Games.popDrawStack(creatorUsername, cardsNumber).then((cards) => {
            //add that cards to players cards
            Games.addToPlayerCards(creatorUsername, playerUsername, cards).then(() => {
                //add log
                let log = {username: playerUsername, draw: cardsNumber};
                Games.addLog(creatorUsername, log).then(() => {
                    //determine next player
                    exp.nextPlayer(creatorUsername).then((playerOnMove) => {
                        resolve({playerOnMove: playerOnMove, cards: cards, log: log});
                    });
                });
            })
        });

    });
};

module.exports = exp;