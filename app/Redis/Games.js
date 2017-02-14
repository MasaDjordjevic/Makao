import redis from 'redis';

let redisCli = redis.createClient();
let exp = {}; //da ne pisem svaki put module.exports

exp.test = () => {
    redisCli.set('cc', 'dd');
};

///////////////GAME////////////////////
// id of game is username of its creator
// Game:id:state = 'lobby' | 'started' | 'finished'
// Game:id:rules = stringify(rules)
// Game:id:players = ['username1', 'username2'...]
// Game:id:openStack = ['card1', 'card2', ...] //cards == stringify
// Game:id:drawStack = ['card1', 'card2', ...] //cards == stringify
// Game:id:cards:username = ['card1, 'card2', ...]
//

///////////////////////////////////////

exp.storeGame = (creatorUsername, rules) => {
    redisCli.set('Game:' + creatorUsername + ':state', 'lobby');
    redisCli.set('Game:' + creatorUsername + ':rules', JSON.stringify(rules));
};

exp.isGameStarted = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get('Game:' + creatorUsername + ':state', function (err, reply) {
            resolve(reply === 'started'); //TODO mozda neka enumeracija sa ovim stanjima
        });
    });
};

exp.getGameState = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get('Game:' + creatorUsername + ':state', function (err, reply) {
            resolve(reply);
        });
    });

};

exp.getGameRules = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get('Game:' + creatorUsername + ':rules', function (err, reply) {
            resolve(JSON.parse(reply));//
        });
    });
};

exp.setCardsOfPlayer = (creatorUsername, playerUsername, cards) => {
    let cardsS = cards.map((card) => JSON.stringify(card));
    debugger;
    console.log(cardsS);
    redisCli.rpush('Game:' + creatorUsername + ':cards:' + playerUsername, cardsS);
};

exp.getCardsOfPlayer = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.lrange('Game:' + creatorUsername + ':cards:' + playerUsername, 0, -1, function (err, reply) {
            reply.map((card) => JSON.parse(card));
            resolve(reply);
        });
    });
};


module.exports = exp;