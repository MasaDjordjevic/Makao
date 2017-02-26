
import redis from 'redis';

let redisCli = redis.createClient();
let exp = {}; //da ne pisem svaki put module.exports

function gameKey(creatorUsername) {
    return 'game:' + creatorUsername;
}

function gameSocketKey(creatorUsername) {
    return 'game:' + creatorUsername  + ':socket';
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

function _sadd(key, member) {
    return new Promise((resolve, reject) => {
        redisCli.sadd(key, member, (err, reply) => {
            err ? reject(err) : resolve(reply);
        });
    });
}

function _srem(key, member) {
    return new Promise((resolve, reject) => {
        redisCli.srem(key, member, (err, reply) => {
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
            if (reply && func) {
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

exp.delGame = (creatorUsername) => {
    return _del(gameKey(creatorUsername));
};

exp.addPendingGame = (creatorUsername) => {
    return _sadd('games:lobby', creatorUsername);
};

exp.addStartedGame = (creatorUsername) => {
    return _sadd('games:started', creatorUsername);
};

exp.remPendingGame = (creatorUsername) => {
    return _srem('games:lobby', creatorUsername);
};

exp.remStartedGame = (creatorUsername) => {
    return _srem('games:started', creatorUsername);
};

exp.getGame = (creatorUsername) => {
    return _get(gameKey(creatorUsername), (game) => JSON.parse(game));
};

exp.setPlayerSocket = (creatorUsername, playerUsername, socketId) => {
    return _hmset3(gameSocketKey(creatorUsername), playerUsername, socketId);
};

exp.getGameSockets = (creatorUsername) => {
    return _hgetall(gameSocketKey(creatorUsername));
};

exp.delGameSockets = (creatorUsername) => {
    return _del(gameSocketKey(creatorUsername));
};

exp.addToLobby = (creatorUsername, playerUsername, ready) => {
    return _hmset3(lobbyKey(creatorUsername), playerUsername, ready);
};

exp.removeFromLobby = (creatorUsername, playerUsername) => {
    return _hdel(lobbyKey(creatorUsername), playerUsername);
};

exp.getLobby = (creatorUsername) => {
    return _hgetall(lobbyKey(creatorUsername), (reply) => {
        let lobbyUsers = [];
        Object.keys(reply).map((user, i) => {
            reply[user] = JSON.parse(reply[user]);
            lobbyUsers.push({
                username: user,
                ready: reply[user]
            });
        });
        return lobbyUsers;
    });
};

exp.delLobby = (creatorUsername) => {
    return _del(lobbyKey(creatorUsername));
};

exp.setPlayerLobbyStatus = (creatorUsername, playerUsername, ready) => {
    return _hmset3(lobbyKey(creatorUsername), playerUsername, ready);
};

exp.delGameInvites = (creatorUsername) => {
    return _del(invitesKey(creatorUsername));
};

exp.addInvite = (creatorUsername, inviteUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.sadd(invitesKey(creatorUsername), inviteUsername, (err, reply) => {
            err ? reject(err) : resolve();
        });
    });
};

exp.remInvite = (creatorUsername, inviteUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.srem(invitesKey(creatorUsername), inviteUsername, (err, reply) => {
            err ? reject(err) : resolve();
        });
    });
};

exp.getPendingGames = () => {
    return exp.getGameList('lobby');
};

exp.getStartedGames = () => {
    return exp.getGameList('started');
};

exp.getGameList = (status) => {
    return new Promise((resolve, reject) => {
        redisCli.smembers('games:' + status, (err, reply) => {
            if (err) { reject(err); }
            let games = [];
            reply.forEach((creator, index) => {
                exp.getGame(creator).then((game) => {
                    game.creator = creator;
                    games.push(game);
                    if (index === reply.length - 1) {
                        resolve(games);
                    }
                });
            });
        });
    });
};

module.exports = exp;