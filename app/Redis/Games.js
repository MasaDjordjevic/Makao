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
    return new Promise((resolve, reject) => {
        redisCli.set(gameStateKey(creatorUsername), state, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.getGameRules = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.get(gameRulesKey(creatorUsername), (err, reply) => {
            err ? reject() : resolve(JSON.parse(reply));
        });
    });
};

exp.addToPlayerCards = (creatorUsername, playerUsername, cards) => {
    return new Promise((resolve, reject) => {
        let cardsS = cards.map((card) => JSON.stringify(card));
        redisCli.rpush(playerCardsKey(creatorUsername, playerUsername), cardsS, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.getPlayerCards = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.lrange(playerCardsKey(creatorUsername, playerUsername), 0, -1, function (err, reply) {
            resolve(reply.map((card) => JSON.parse(card)));
        });
    });
};

exp.removePlayerCards = (creatorUsername, playerUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.del(playerCardsKey(creatorUsername, playerUsername), (err, reply) => {
            err ? reject(err) : resolve();
        });
    });
};

exp.setPlayerCards = (creatorUsername, playerUsername, cards) => {
    return new Promise((resolve, reject) => {
        exp.removePlayerCards(creatorUsername, playerUsername).then(() => {
            exp.addToPlayerCards(creatorUsername, playerUsername, cards).then( () => {
               resolve();
            });
        }).catch((reason) => {
            reject(reason);
        });
    });
};

exp.removeFromPlayersCards = (creatorUsername, playerUsername, card) => {
    return new Promise((resolve, reject) => {
        redisCli.lrem(playerCardsKey(creatorUsername, playerUsername), 1, JSON.stringify(card), function (err, reply) {
            err ? reject() : resolve();
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
    return new Promise((resolve, reject) => {
        redisCli.rpush('game:' + creatorUsername + ':invites', inviteUsername, (err, reply) => {
            err ? reject() : resolve();
        });
    });
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
        redisCli.hgetall(playersKey(creatorUsername), (err, reply) => {
            err ? reject() : resolve(reply);
        });
    });
};


exp.getPlayersUsernames = (creatorUsername) => {
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
                        data[username] = cards;
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

exp.addToOpenStack = (creatorUsername, cards) => {
    return new Promise((resolve, reject) => {
        let cardsS = cards.map((card) => JSON.stringify(card));
        redisCli.rpush(openStackKey(creatorUsername), cardsS, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};


exp.deleteOpenStack = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.del(openStackKey(creatorUsername), (err, reply) => {
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


exp.setOpenStack = (creatorUsername, cards) => {
    return new Promise((resolve, reject) => {
        exp.deleteOpenStack(creatorUsername).then(() => {
            exp.addToOpenStack(creatorUsername, cards, (err, reply) => {
                err ? reject() : resolve();
            });
        });
    });
};


exp.peakOpenStack = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.lrange(openStackKey(creatorUsername), -1, -1, function (err, reply) {
            err ? reject() : resolve(JSON.parse(reply));
        });
    });
};

exp.addToDrawStack = (creatorUsername, stack) => {
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
            err ? reject() : resolve(reply.map((card) => JSON.parse(card)));
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

exp.popDrawStack = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.rpop(drawStackKey(creatorUsername), function (err, reply) {
            err ? reject() : resolve(JSON.parse(reply));
        });
    });
};


exp.deleteDrawStack = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.del(drawStackKey(creatorUsername), (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.setDrawStack = (creatorUsername, cards) => {
    return new Promise((resolve, reject) => {
        exp.deleteDrawStack(creatorUsername).then(() => {
            exp.addToDrawStack(creatorUsername, cards, (err, reply) => {
                err ? reject() : resolve();
            });
        });
    });
};

module.exports = exp;