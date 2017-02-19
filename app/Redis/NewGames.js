
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

function gameKey(creatorUsername) {
    return 'game:' + creatorUsername;
}

function lobbyKey(creatorUsername) {
    return 'game:' + creatorUsername + ':lobby';
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
    return _hgetall(lobbyKey(creatorUsername));
};

exp.setPlayerLobbyStatus = (creatorUsername, playerUsername, ready) => {
    return _hmset3(lobbyKey(creatorUsername), playerUsername, ready);
};

module.exports = exp;