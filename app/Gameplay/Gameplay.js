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

function getTalon(stack) {
    let retCards = [];
    let randomCard = null;
    let randomIndex = -1;
    do {
        randomIndex = Math.floor(Math.random() * stack.length);
        randomCard = stack[randomIndex];
    } while (randomCard.number === 12 || randomCard.number === 7 || randomCard.number === 8); //do not let some meaningful card be on talon

    stack.splice(randomIndex, 1);
    retCards.push(randomCard);

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
        let talon = getTalon(stack);
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

exp.playerHasOnly12 = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        Games.getPlayerCards(creatorUsername, playerUsername).then((cards) => {
            const hasOnly12 = _.every(cards, (card) => card.number == 12);
            resolve(hasOnly12);
        })
    });
};

exp.determineNextPlayer = (creatorUsername, playerUsername, card) => {
    if (card.number === 1) { //same player
        return exp.nextPlayer(creatorUsername, playerUsername, 0);
    }
    if (card.number === 11) {//ako su mu ostale samo zace
        exp.playerHasOnly12(creatorUsername, playerUsername).then((reply) => {
            if (reply) {
                return exp.nextPlayer(creatorUsername, playerUsername, 0);
            }
        });
    }


};

exp.determineDrawCount = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        Games.getOpenStack(creatorUsername).then((openStack) => {
            let last = _.last(openStack);
            if (last.number === '2' && last.symbol === 'diamonds') { //dvojka karo
                Games.getDrawStack(creatorUsername).then((drawStack) => {
                    let num = _.takeRightWhile(drawStack, (card) => card.symbol !== 'diamonds').length + 1; //vuce sve do kocke
                    resolve(num);
                });
            } else if (_.last(openStack).number !== '7') {
                resolve(1);
            } else {
                let sevens = _.takeRightWhile(openStack, (card) => card.number == 7).length;
                resolve(sevens * 2); //TODO nadji koliko se vuce na sedmicu
            }
        })
    });
};

exp.fixDrawStack = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        Games.getDrawStackCount(creatorUsername).then((count) => {
            if (count === 0) {
                Games.getOpenStack(creatorUsername).then((openStack) => {
                    let last = openStack.pop();
                    Games.setOpenStack(creatorUsername, [last]).then(() => {
                        openStack.forEach((card) => { //resetuje sve zace
                            if(card.jackSymbol){
                                card.jackSymbol = null;
                            }
                        });
                        Games.setDrawStack(creatorUsername, openStack).then(() => {
                            resolve();
                        })
                    });
                });
            } else {
                resolve();
            }
        });
    });
};

exp.determineConsequences = (creatorUsername, playerUsername, card) => {

};

exp.nextPlayer = (creatorUsername, offset = 1) => {
    return new Promise((resolve, reject) => {
        Games.getPlayerOnMove(creatorUsername).then((curr) => {
            if (offset === 0) {
                resolve(curr);
            }
            Games.getPlayersUsernames(creatorUsername).then((players) => {
                let currIndex = players.indexOf(curr);
                let nextIndex = (currIndex + offset) % players.length;
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

exp.draw = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        exp.fixDrawStack(creatorUsername).then(() => {
            exp.determineDrawCount(creatorUsername).then((num) => {
                //get and remove cards from draw stack
                Games.popDrawStack(creatorUsername, num).then((cards) => {
                    //add that cards to players cards
                    Games.addToPlayerCards(creatorUsername, playerUsername, cards).then(() => {
                        //add log
                        let log = {username: playerUsername, draw: num};
                        Games.addLog(creatorUsername, log).then(() => {
                            //determine next player
                            let offset = num > 1 ? 0 : 1;
                            Games.peakOpenStack(creatorUsername).then((talon) => {
                                if (talon.number === '2' && talon.symbol === 'diamonds') { //ako je vuko nakon dvojke karo
                                    offset = 0;
                                    _.last(cards).mustPlay = true;
                                }
                                exp.nextPlayer(creatorUsername, offset).then((playerOnMove) => {
                                    resolve({playerOnMove: playerOnMove, cards: cards, log: log, cardsNumber: num});
                                });
                            });
                        });
                    })
                });
            });
        });
    });
};

module.exports = exp;