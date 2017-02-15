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
// game:id:players = {username1: online1, username2: online2...}   || hash set
// game:id:invites = ['username1', 'username2', ...]    ||=> set
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

function playersKey(creatorUsername) {
    return 'game:' + creatorUsername + ':players';
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
            err ? reject() : resolve(reply);
        });
    });
};

exp.setGameState = (creatorUsername, state) => {
    redisCli.set(gameStateKey(creatorUsername), state);
};

exp.getGameRules = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get(gameRulesKey(creatorUsername), (err, reply) => {
            err ? reject() : resolve(JSON.parse(reply));
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

exp.getPlayerCardsNumber = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.llen(playerCardsKey(creatorUsername, playerUsername), function (err, reply) {
            err ? reject() : resolve(reply);
        });
    });
};

exp.addInvite = (creatorUsername, inviteUsername) => {
    redisCli.rpush('game:' + creatorUsername + ':invites', inviteUsername);
};

exp.addPlayer = (creatorUsername, playerUsername, status) => {
    return new Promise((resolve, reject) => {
        redisCli.hmset(playersKey(creatorUsername), playerUsername, status, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.addPlayers = (playersArray) => {
    return new Promise((resolve, reject) => {
        redisCli.hmset(playersArray, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.removePlayer = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.hdel(playersKey(creatorUsername), playerUsername, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.getPlayers = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.hkeys(playersKey(creatorUsername), (err, reply) => {
            err ? reject() : resolve(reply);
        });
    });
};

exp.getPlayersWithStatus = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        exp.getPlayers(creatorUsername)
            .then((data) => {
                Object.keys(data).forEach((username, index) =>
                    exp.getPlayerCardsNumber(creatorUsername, username).then((len) => {
                        data[username] = {username: username, online: data[username], cardNumber: len};
                        if (index === Object.keys(data).length - 1) {
                            resolve(data);
                        }
                    })
                )
            });
    });
};

exp.getPlayersWithCards = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        exp.getPlayers(creatorUsername)
            .then((data) => {
                Object.keys(data).forEach((username, index) =>
                    exp.getPlayerCards(creatorUsername, username).then((cards) => {
                        data[username] = {username: username, cards: cards};
                        if (index === Object.keys(data).length - 1) {
                            resolve(data);
                        }
                    })
                )
            });
    });
};

exp.getPlayerStatus = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get(playersKey(creatorUsername), playerUsername, (err, reply) => {
            err ? reject() : resolve(reply);
        });
    });
};

exp.setPlayerStatus = (creatorUsername, playerUsername, status) => {
    return new Promise((resolve, reject) => {
        redisCli.hmset(playersKey(creatorUsername), playerUsername, status, (err, reply) => {
            err ? reject() : resolve(reply);
        });
    });
};

exp.addToLobby = (creatorUsername, playerUsername, ready) => {
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

exp.setOpenStack = (creatorUsername, cards) => {
    return new Promise((resolve, reject) => {
        let cardsS = cards.map((card) => JSON.stringify(card));
        redisCli.rpush(openStackKey(creatorUsername), cardsS, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.getOpenStack = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.lrange(openStackKey(creatorUsername), 0, -1, (err, reply) => {
            err ? reject() : resolve(reply.map((card) => JSON.parse(card)));
        });
    });
};

exp.getOpenStackCount = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.llen(openStackKey(creatorUsername), function (err, reply) {
            err ? reject() : resolve(reply);
        });
    });
};

exp.setDrawStack = (creatorUsername, stack) => {
    return new Promise((resolve, reject) => {
        let cardsS = stack.map((card) => JSON.stringify(card));
        redisCli.rpush(drawStackKey(creatorUsername), cardsS, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.getDrawStack = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.lrange(drawStackKey(creatorUsername), 0, -1, (err, reply) => {
            err ? reject() : resolve(reply);
        });
    });
};

exp.getDrawStackCount = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.llen(drawStackKey(creatorUsername), function (err, reply) {
            err ? reject() : resolve(reply);
        });
    });
};

module.exports = exp;