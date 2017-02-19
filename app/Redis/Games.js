import redis from 'redis';

let redisCli = redis.createClient();
let exp = {}; //da ne pisem svaki put module.exports

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
// game:id:log = ['msg1', 'msg2', ...]
// game:id:playerOnMove = 'username'
// game:id:handStarter = 'username'

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


function invitesKey(creatorUsername) {
    return 'game:' + creatorUsername + ':invites';
}

function logKey(creatorUsername) {
    return 'game:' + creatorUsername + ':log';
}

function playerOnMoveKey(creatorUsername) {
    return 'game:' + creatorUsername + ':playerOnMove';
}

function handStarterKey(creatorUsername) {
    return 'game:' + creatorUsername + ':handStarter';
}


function _get(key, func) {
    return new Promise((resolve, reject) => {
        redisCli.get(key, (err, reply) => {
            if (func) {
                reply = func(reply);
            }
            err ? reject(err) : resolve(reply);
        });
    });
}

function _set(key, value) {
    return new Promise((resolve, reject) => {
        redisCli.set(key, value, (err, reply) => {
            err ? reject(err) : resolve(reply);
        });
    });
}

function _del(key) {
    return new Promise((resolve, reject) => {
        redisCli.del(key, (err, reply) => {
            err ? reject(err) : resolve(reply);
        });
    });
}

function _addToList(key, values) {
    return new Promise((resolve, reject) => {
        redisCli.rpush(key, values, (err, reply) => {
            err ? reject(err) : resolve(reply);
        });
    });
}

function _setList(key, values) {
    return new Promise((resolve, reject) => {
        _del(key)
            .then(() => _addToList(key, values)
                .then((reply) => resolve(reply)));
    });
}

function _getList(key, func) {
    return new Promise((resolve, reject) => {
        redisCli.lrange(key, 0, -1, (err, reply) => {
            if (func) {
                reply = func(reply);
            }
            err ? reject(err) : resolve(reply);
        });
    });
}

function _getListLength(key) {
    return new Promise((resolve, reject) => {
        redisCli.llen(key, function (err, reply) {
            err ? reject(err) : resolve(reply);
        });
    });
}

function _hmset3(key, field, value) {
    return new Promise((resolve, reject) => {
        redisCli.hmset(key, field, value, (err, reply) => {
            err ? reject(err) : resolve(reply);
        });
    });
}

function _hmset1(arr) {
    return new Promise((resolve, reject) => {
        redisCli.hmset(arr, (err, reply) => {
            err ? reject(err) : resolve(reply);
        });
    });
}

function _hgetall(key, func) {
    return new Promise((resolve, reject) => {
        redisCli.hgetall(key, (err, reply) => {
            if (func) {
                reply = func(reply);
            }
            err ? reject(err) : resolve(reply);
        });
    });
}

function _hdel(key, field) {
    return new Promise((resolve, reject) => {
        redisCli.hdel(key, field, (err, reply) => {
            err ? reject(err) : resolve(reply);
        });
    });
}

function _hkeys(key, func) {
    return new Promise((resolve, reject) => {
        redisCli.hkeys(key, (err, reply) => {
            if (func) {
                reply = func(reply);
            }
            err ? reject(err) : resolve(reply);
        });
    });
}

exp.storeGame = (creatorUsername, rules) => {
    return new Promise((resolve, reject) => {
        redisCli.set(gameStateKey(creatorUsername), 'lobby', (err, reply) => {
            if (err) { reject(); }
            redisCli.set(gameRulesKey(creatorUsername), JSON.stringify(rules), (err, reply) => {
                if (err) { reject(); }
                redisCli.sadd('games:lobby', creatorUsername, (err, reply) => {
                    err ? reject() : resolve();
                });
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
    return _get(gameStateKey(creatorUsername));
};

exp.setGameState = (creatorUsername, state) => {
    return _set(gameStateKey(creatorUsername), state);
};

exp.getGameRules = (creatorUsername) => {
    return _get(gameRulesKey(creatorUsername), (reply) => JSON.parse(reply));
};

exp.addToPlayerCards = (creatorUsername, playerUsername, cards) => {
    let cardsS = cards.map((card) => JSON.stringify(card));
    return _addToList(playerCardsKey(creatorUsername, playerUsername), cardsS);
};

exp.getPlayerCards = (creatorUsername, playerUsername) => {
    return _getList(playerCardsKey(creatorUsername, playerUsername), (reply) => reply.map((card) => JSON.parse(card)));
};

exp.addInvite = (creatorUsername, inviteUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.rpush(invitesKey(creatorUsername), inviteUsername, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.removePlayerCards = (creatorUsername, playerUsername) => {
    return _del(playerCardsKey(creatorUsername, playerUsername));
};

exp.setPlayerCards = (creatorUsername, playerUsername, cards) => {
    let cardsS = cards.map((card) => JSON.stringify(card));
    return _setList(playerCardsKey(creatorUsername, playerUsername), cardsS);
};

exp.removeFromPlayersCards = (creatorUsername, playerUsername, card) => {
    return new Promise((resolve, reject) => {
        redisCli.lrem(playerCardsKey(creatorUsername, playerUsername), 1, JSON.stringify(card), function (err, reply) {
            err ? reject() : resolve();
        });
    });
};

exp.getPlayerCardsNumber = (creatorUsername, playerUsername) => {
    return _getListLength(playerCardsKey(creatorUsername, playerUsername));
};

exp.addInvite = (creatorUsername, inviteUsername) => {
    return _addToList('game:' + creatorUsername + ':invites', inviteUsername);
};
exp.addPlayer = (creatorUsername, playerUsername, status) => {
    return _hmset3(playersKey(creatorUsername), playerUsername, status);
};

exp.addPlayers = (playersArray) => {
    return _hmset1(playersArray);
};

exp.removePlayers = (creatorUsername) => {
    return _del(playersKey(creatorUsername));
};

exp.setPlayers = (playersArray) => {
    return new Promise((resolve, reject) => {
        playersArray[0] = playersKey(playersArray[0]);
        exp.removePlayers(playersArray[0]).then((err, reply) => {
            if (err) {
                reject();
            }
            exp.addPlayers(playersArray).then(() => {
                resolve();
            });
        });
    });
};

exp.removePlayer = (creatorUsername, playerUsername) => {
    return _hdel(playersKey(creatorUsername), playerUsername);
};

exp.getPlayers = (creatorUsername) => {
    return _hgetall(playersKey(creatorUsername));
};


exp.getPlayersUsernames = (creatorUsername) => {
    return _hkeys(playersKey(creatorUsername));
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
                );
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

exp.setPlayerStatus = (creatorUsername, playerUsername, status) => {
    return _hmset3(playersKey(creatorUsername), playerUsername, status);
};

exp.addToLobby = (creatorUsername, playerUsername, ready) => {
    return _hmset3(lobbyKey(creatorUsername), playerUsername, ready);
};

exp.removeFromLobby = (creatorUsername, playerUsername) => {
    return _hdel(lobbyKey(creatorUsername), playerUsername);
};

exp.getLobby = (creatorUsername) => {
    return _hgetall(lobbyKey(creatorUsername), (reply) => {
        Object.keys(reply).map((user, i) =>
            reply[user] = JSON.parse(reply[user])
        )
        return reply;
    });
};

exp.setPlayerLobbyStatus = (creatorUsername, playerUsername, ready) => {
    return _hmset3(lobbyKey(creatorUsername), playerUsername, ready);
};

exp.addToOpenStack = (creatorUsername, cards) => {
    let cardsS = cards.map((card) => JSON.stringify(card));
    return _addToList(openStackKey(creatorUsername), cardsS);
};


exp.deleteOpenStack = (creatorUsername) => {
    return _del(openStackKey(creatorUsername));
};


exp.getOpenStack = (creatorUsername) => {
    return _getList(openStackKey(creatorUsername),
        (reply) => reply.map((card) => JSON.parse(card)));
};

exp.getOpenStackCount = (creatorUsername) => {
    return _getListLength(openStackKey(creatorUsername));
};


exp.setOpenStack = (creatorUsername, cards) => {
    let cardsS = cards.map((card) => JSON.stringify(card));
    return _setList(openStackKey(creatorUsername), cardsS);
};


exp.peakOpenStack = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.lrange(openStackKey(creatorUsername), -1, -1, function (err, reply) {
            err ? reject() : resolve(JSON.parse(reply));
        });
    });
};

exp.addToDrawStack = (creatorUsername, stack) => {
    let cardsS = stack.map((card) => JSON.stringify(card));
    return _addToList(drawStackKey(creatorUsername), cardsS);
};

exp.getDrawStack = (creatorUsername) => {
    return _getList(drawStackKey(creatorUsername),
        (reply) => reply.map((card) => JSON.parse(card)));
};

exp.getDrawStackCount = (creatorUsername) => {
    return _getListLength(drawStackKey(creatorUsername));
};

exp.popDrawStack = (creatorUsername, cardNumber) => {
    return new Promise((resolve, reject) => {
        redisCli.lrange(drawStackKey(creatorUsername), 0, cardNumber - 1, (err, reply) => {
            err ? reject() : redisCli.ltrim(drawStackKey(creatorUsername), cardNumber, -1, (err2, reply2) => {
                    err2 ? reject() : resolve(reply.map((card) => JSON.parse(card)));
                });
        });
    });
};


exp.deleteDrawStack = (creatorUsername) => {
    return _del(drawStackKey(creatorUsername));
};

exp.setDrawStack = (creatorUsername, cards) => {
    let cardsS = cards.map((card) => JSON.stringify(card));
    return _setList(drawStackKey(creatorUsername), cardsS);
};


exp.addLog = (creatorUsername, log) => {
    return _addToList(logKey(creatorUsername), JSON.stringify(log));
};

exp.getLogs = (creatorUsername) => {
    return _getList(logKey(creatorUsername),
        (reply) => reply.map((log) => JSON.parse(log)));
};

exp.removeLogs = (creatorUsername) => {
    return _del(logKey(creatorUsername));
};

exp.getPlayerOnMove = (creatorUsername) => {
    return _get(playerOnMoveKey(creatorUsername));
};

exp.setPlayerOnMove = (creatorUsername, username) => {
    return _set(playerOnMoveKey(creatorUsername), username);
};

exp.getHandStarter = (creatorUsername) => {
    return _get(handStarterKey(creatorUsername));
};

exp.setHandStarter = (creatorUsername, username) => {
    return _set(handStarterKey(creatorUsername), username);
};

exp.getGameList = () => {
    return new Promise((resolve, reject) => {
        redisCli.smembers('games:lobby', (err, reply) => {
            if (err) { reject(err) };
            let games = [];
            reply.forEach((creator, index) => {
                exp.getLobby(creator)
                .then((users) => {
                    exp.getGameRules(creator)
                    .then((rules) => {
                        games.push({
                            lobby: users,
                            rules: rules
                        });
                        if (index === reply.length - 1) {
                            console.log(JSON.stringify(games));
                            resolve(games);
                        }
                    });
                });
            });
        });
    });
};


module.exports = exp;