import redis from 'redis';
import NewGames from '../Redis/NewGames';
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
    let randomCard = null;
    let randomIndex = -1;
    do {
        randomIndex = Math.floor(Math.random() * stack.length);
        randomCard = stack[randomIndex];
    } while (randomCard.number === 12 || randomCard.number === 7 || randomCard.number === 8); //do not let some meaningful card be on talon

    stack.splice(randomIndex, 1);

    return randomCard;
}

exp.createGame = (creatorUsername, rules) => {
    return new Promise((resolve, reject) => {
        let game = {};
        game.rules = rules;
        game.status = 'lobby';
        game.logs = [];
        NewGames.setGame(creatorUsername, game).then(() => {
            resolve();
        })
    });
};

exp.startGame = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        //all ready players from lobby become players of game
        NewGames.getLobby(creatorUsername).then((players) => {
            let readyPlayers = {};
            Object.keys(players).forEach((username, index) => {
                if (players[username] === 'true') {
                    readyPlayers[username] ={
                        online: false,
                    };
                }
            });
            NewGames.getGame(creatorUsername).then((game) => {
                game.players = readyPlayers;
                game.playerOnMove = creatorUsername;
                game.handStarter = creatorUsername;
                game.direction = 1;
                game.sevens = 0; //no of sevens played in a row, can not be determinated from openStack because player can draw and then play seven again
                deal(game);

                NewGames.setGame(creatorUsername, game).then(() => {
                    resolve();
                });
            });
        });
    });
};

function deal(game) {
    //kreiraj spilove
    let stack = createStack();

    //stavi kartu na talon (openStack)
    let talon = getTalon(stack);
    game.openStack = [talon];

    //podeli igracima karte
    const cardsPerPlayer = 6;
    Object.keys(game.players).forEach((player, index) => {
        game.players[player].cards = getRandomCards(stack, cardsPerPlayer);
    });
    game.drawStack = stack;
    game.status = 'started';
}

exp.getGame = (creatorUsername) => {
    return NewGames.getGame(creatorUsername);
};


function playerHasOnly12(game, playerUsername) {
    let cards = game.players[playerUsername].cards;
    return _.every(cards, (card) => card.number == 12);
}

function determineNextPlayer(game, playerUsername, card) {
    if (card.number === '1') { //same player
        return nextPlayer(game, 0);
    }
    if (card.number === '11') {//ako su mu ostale samo zace moze sve da ih baci
        if (playerHasOnly12(game, playerUsername)) {
            return nextPlayer(game, 0);
        }
    }
    if (card.number === '8') {
        return nextPlayer(game, 2);
        return nextPlayer(game, 2);
    }

    return nextPlayer(game);
    return nextPlayer(game);
}

function determineDrawCount(game) {
    let lastCard = _.last(game.openStack);
    if (lastCard.number === '2' && lastCard.symbol === 'diamonds') { //dvojka karo
        let num = _.takeRightWhile(game.drawStack, (card) => card.symbol !== 'diamonds').length + 1; //vuce sve do kocke
        return num;
    } else if (lastCard.number !== '7') {
        return 1;
    } else {
        let sevens = game.sevens;
        game.sevens = 0;
        return sevens * 2; //TODO nadji koliko se vuce na sedmicu
    }
}

function fixDrawStack(game) {
    if (game.drawStack.length > 0) {
        return;
    }

    if(game.openStack.length === 0){
        console.log("nema vise karata!!!!");
    }

    //resetuj sve zace
    game.openStack.forEach((card) => card.jackSymbol = null);

    //ostavi samo poslednu kartu na talonu, ostale prebaci u drawStack
    let last = game.openStack.pop();
    game.drawStack = game.openStack.slice();
    game.openStack = [last];
}

function determineConsequences(game, card) {
    if(card.number === '9'){
        game.direction *= -1;
    }

    if(card.number === '7'){
        game.sevens++;
    }
}

function nextPlayer(game, offset = 1) {
    if (offset === 0) {
        return game.playerOnMove;
    }
    offset = offset * game.direction;
    let players = _.keys(game.players);
    let currIndex = players.indexOf(game.playerOnMove);
    let nextIndex = (currIndex + offset) % players.length;
    let next = players[nextIndex];
    game.playerOnMove = next;
    return next;
}

exp.getNextPlayer = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        NewGames.getGame(creatorUsername).then((game) => {
            let playerOnMove = nextPlayer(game);
            NewGames.setGame(creatorUsername, game).then(() => {
                resolve(playerOnMove);
            })
        });
    });
};

exp.playMove = (creatorUsername, playerUsername, card) => {
    return new Promise((resolve, reject) => {
        NewGames.getGame(creatorUsername).then((game) => {
            //remove card from players
            _.remove(game.players[playerUsername].cards, {number: card.number, symbol: card.symbol}); //not using card object because other properties may not be the same
            //add card to openStack
            game.openStack.push(card);
            //add log
            let log = {username: playerUsername, card: card};
            game.logs.push(log);
            //determine next player
            let next = determineNextPlayer(game,playerUsername, card);
            //determine consequences
            determineConsequences(game, card);

            NewGames.setGame(creatorUsername, game).then(() => {
                resolve({playerOnMove: next, log: log});
            });

        });
    });
};

exp.draw = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        NewGames.getGame(creatorUsername).then((game) => {
            fixDrawStack(game);
            let drawCount = determineDrawCount(game);
            let cards = game.drawStack.splice(-drawCount, drawCount);
            game.players[playerUsername].cards = game.players[playerUsername].cards.concat(cards);
            //add log
            let log = {username: playerUsername, draw: drawCount};
            game.logs.push(log);


            NewGames.setGame(creatorUsername, game).then(() => {
                resolve({cards: cards, log: log, cardsNumber: drawCount});
            });
        });
    });
};

exp.setPlayerOnlineStatus = (creatorUsername, playerUsername, status) => {
    return new Promise((resolve, reject) => {
        NewGames.getGame(creatorUsername).then((game) => {
            game.players[playerUsername].online = status;
            NewGames.setGame(creatorUsername, game).then(() => {
                resolve();
            })
        });
    });
};

exp.getGameStatus = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        NewGames.getGame(creatorUsername).then((game) => {
            resolve(game ? game.status : 'not created');
        });
    });
};

exp.getLogs = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        NewGames.getGame(creatorUsername).then((game) => {
            resolve(game.logs);
        });
    });
};

module.exports = exp;