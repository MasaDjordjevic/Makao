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
// Game:id:invites = ['username1', 'username2', ...]
// Game:id:openStack = ['card1', 'card2', ...] //cards == stringify
// Game:id:drawStack = ['card1', 'card2', ...] //cards == stringify
// Game:id:cards:username = ['card1, 'card2', ...]
//

///////////////////////////////////////

function rulesString(creatorUsername) {
    return 'Game:' + creatorUsername + ':rules';
}

function stateString(creatorUsername) {
    return 'Game:' + creatorUsername + ':state';
}

exp.storeGame = (creatorUsername, rules) => {
    redisCli.set(stateString(creatorUsername), 'lobby');
    redisCli.set(rulesString(creatorUsername), JSON.stringify(rules));
};

exp.isGameStarted = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get(stateString(creatorUsername), function (err, reply) {
            resolve(reply === 'started'); //TODO mozda neka enumeracija sa ovim stanjima
        });
    });
};

exp.getGameState = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get(stateString(creatorUsername), function (err, reply) {
            resolve(reply);
        });
    });

};

exp.setGameState = (creatorUsername, state) => {
    redisCli.set(stateString(creatorUsername), state);
};

exp.getGameRules = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get(rulesString(creatorUsername), function (err, reply) {
            resolve(JSON.parse(reply));//
        });
    });
};

function cardsOfPlayerString(creatorUsername, playerUsername) {
    return 'Game:' + creatorUsername + ':cards:' + playerUsername;
}

exp.setCardsOfPlayer = (creatorUsername, playerUsername, cards) => {
    let cardsS = cards.map((card) => JSON.stringify(card));
    debugger;
    console.log(cardsS);
    redisCli.rpush(cardsOfPlayerString(creatorUsername, playerUsername), cardsS);
};

exp.getCardsOfPlayer = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.lrange(cardsOfPlayerString(creatorUsername, playerUsername), 0, -1, function (err, reply) {
            reply.map((card) => JSON.parse(card));
            resolve(reply);
        });
    });
};

exp.addInvite = (creatorUsername, inviteUsername) => {
    redisCli.rpush('Game:' + creatorUsername + ':invites', inviteUsername);
};

exp.addPlayers = (creatorsUsername, playersArr) => {
    redisCli.rpush('Game:' + creatorsUsername + ':players', playersArr);
};

function openStackString(creatorUsername) {
    return 'Game:' + creatorUsername + ':openStack';
}

exp.setOpenStack = (creatorUsername, stack) => {
    redisCli.rpush(openStackString(creatorUsername), stack);
};

exp.getOpenStack = (creatorUsername) => {
    return new Promise((resoleve, reject) => {
        redisCli.lrange(openStackString(creatorUsername), 0, -1, (err, reply) => {
            resolve(reply);
        });
    });
};


function drawStackString(creatorUsername) {
    return 'Game:' + creatorUsername + ':drawStack';
}

exp.setDrawStack = (creatorUsername, stack) => {
    redisCli.rpush(drawStackString(creatorUsername), stack);
};

exp.getDrawStack = (creatorUsername) => {
    return new Promise((resoleve, reject) => {
        redisCli.lrange(drawStackString(creatorUsername), 0, -1, (err, reply) => {
            resolve(reply);
        });
    });
};



module.exports = exp;