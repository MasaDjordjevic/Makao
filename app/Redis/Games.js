
import redis from 'redis';

let redisCli = redis.createClient();
let exp = {}; //da ne pisem svaki put module.exports

function gameKey(creatorUsername) {
    return 'game:' + creatorUsername;
}

function lobbyKey(creatorUsername) {
    return 'game:' + creatorUsername + ':lobby';
}

function invitesKey(creatorUsername) {
    return 'game:' + creatorUsername + ':invites';
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

exp.setGame = (creatorUsername, game) => {
    return _set(gameKey(creatorUsername), JSON.stringify(game));
};

exp.getGame = (creatorUsername) => {
    return _get(gameKey(creatorUsername), (game) => JSON.parse(game));
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

exp.addInvite = (creatorUsername, inviteUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.rpush(invitesKey(creatorUsername), inviteUsername, (err, reply) => {
            err ? reject() : resolve();
        });
    });
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