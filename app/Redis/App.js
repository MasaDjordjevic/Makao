import redis from 'redis';

let redisCli = redis.createClient();
let exp = {};

redisCli.flushdb();

function socketKey(username) {
    return 'socket:' + username;
}

exp.setUserSocket = (username, socketid) => {
    return new Promise((resolve, reject) => {
        redisCli.set(socketKey(username), socketid, (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

exp.getUserSocket = (username) => {
    return new Promise((resolve, reject) => {
        redisCli.get(socketKey(username), (err, reply) => {
            resolve(reply);
        });
    });
};

exp.removeUserSocket = (username) => {
    return new Promise((resolve, reject) => {
        redisCli.del(socketKey(username), (err, reply) => {
            err ? reject() : resolve();
        });
    });
};

module.exports = exp;