import redis from 'redis';

let redisCli = redis.createClient();
let exp = {}; //da ne pisem svaki put module.exports

exp.test = () => {
    redisCli.set('cc', 'dd');
};

///////////////GAME////////////////////
// id of game is username of its creator
// game:id:state = 'lobby' | 'started' | 'finished'
// game:id:rules = stringify(rules)
// game:id:players = ['username1', 'username2', ...]                        ||
// game:id:invites = ['username1', 'username2', ...]|                       ||=> sets
// game:id:lobby = {username1:ready1, username2: ready2...} || hash set
// game:id:openStack = ['card1', 'card2', ...] //cards == stringify
// game:id:drawStack = ['card1', 'card2', ...] //cards == stringify
// game:id:cards:username = ['card1, 'card2', ...]
//

///////////////////////////////////////

function gameRulesKey(creatorUsername) {
    return 'game:' + creatorUsername + ':rules';
}

function gameStateKey(creatorUsername) {
    return 'game:' + creatorUsername + ':state';
}

function playerCardsKey(creatorUsername, playerUsername) {
    return 'game:' + creatorUsername + ':cards:' + playerUsername;
}

function lobbyKey(creatorUsername) {
    return 'game:' + creatorUsername + ':lobby';
}

function openStackKey(creatorUsername) {
    return 'game:' + creatorUsername + ':openStack';
}

function drawStackKey(creatorUsername) {
    return 'game:' + creatorUsername + ':drawStack';
}

exp.storeGame = (creatorUsername, rules) => {
    return new Promise((resolve, reject) => {
        redisCli.set(gameStateKey(creatorUsername), 'lobby', (err, reply) => {
            if (err) {
                reject();
            }
            redisCli.set(gameRulesKey(creatorUsername), JSON.stringify(rules), (err, reply) => {
                err ? reject() : resolve();
            });
        });
    });
};

exp.isGameStarted = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get(gameStateKey(creatorUsername), (err, reply) => {
            resolve(reply === 'started'); //TODO mozda neka enumeracija sa ovim stanjima
        });
    });
};

exp.getGameState = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get(gameStateKey(creatorUsername), (err, reply) => {
            resolve(reply);
        });
    });
};

exp.setGameState = (creatorUsername, state) => {
    redisCli.set(gameStateKey(creatorUsername), state);
};

exp.getGameRules = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get(gameRulesKey(creatorUsername), (err, reply) => {
            resolve(JSON.parse(reply));//
        });
    });
};

exp.setPlayerCards = (creatorUsername, playerUsername, cards) => {
    let cardsS = cards.map((card) => JSON.stringify(card));
    debugger;
    console.log(cardsS);
    redisCli.rpush(playerCardsKey(creatorUsername, playerUsername), cardsS);
};

exp.getPlayerCards = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.lrange(playerCardsKey(creatorUsername, playerUsername), 0, -1, function (err, reply) {
            reply.map((card) => JSON.parse(card));
            resolve(reply);
        });
    });
};

exp.addInvite = (creatorUsername, inviteUsername) => {
    redisCli.rpush('game:' + creatorUsername + ':invites', inviteUsername);
};

exp.addPlayers = (creatorUsername, playersArr) => {
    redisCli.rpush('game:' + creatorUsername + ':players', playersArr);
};

exp.addToLobby = (creatorUsername, playerUsername, ready) => {
    //let pUsaname = playerUsername.toString();
    //let ready = ready.toString();
    return new Promise((resolve, reject) => {
        redisCli.hmset(lobbyKey(creatorUsername), playerUsername, ready, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.removeFromLobby = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.hdel(lobbyKey(creatorUsername), playerUsername, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.getLobby = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.hgetall(lobbyKey(creatorUsername), (err, reply) => {
            err ? reject() : resolve(reply);
        });
    });
};

exp.getPlayerLobbyStatus = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get(lobbyKey(creatorUsername), playerUsername, (err, reply) => {
            err ? reject() : resolve(reply);
        });
    });
};

exp.setPlayerLobbyStatus = (creatorUsername, playerUsername, ready) => {
    return new Promise((resolve, reject) => {
        redisCli.hmset(lobbyKey(creatorUsername), playerUsername, ready, (err, reply) => {
            err ? reject() : resolve(reply);
        });
    });
};

exp.setOpenStack = (creatorUsername, stack) => {
    redisCli.rpush(openStackKey(creatorUsername), stack);
};

exp.getOpenStack = (creatorUsername) => {
    return new Promise((resoleve, reject) => {
        redisCli.lrange(openStackKey(creatorUsername), 0, -1, (err, reply) => {
            resolve(reply);
        });
    });
};

exp.setDrawStack = (creatorUsername, stack) => {
    redisCli.rpush(drawStackKey(creatorUsername), stack);
};

exp.getDrawStack = (creatorUsername) => {
    return new Promise((resoleve, reject) => {
        redisCli.lrange(drawStackKey(creatorUsername), 0, -1, (err, reply) => {
            resolve(reply);
        });
    });
};

module.exports = exp;