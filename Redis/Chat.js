import redis from 'redis';

let redisCli = redis.createClient();
let exp = {};

function chatKey(creatorUsername) {
    return 'game:' + creatorUsername + ':chat';
}

exp.addMessage = (creatorUsername, message) => {
    return new Promise((resolve, reject) => {
        redisCli.rpush(chatKey(creatorUsername), JSON.stringify(message), (err, reply) => {
            err ? reject() : resolve();
        })
    });
};

exp.getMessages = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.lrange(chatKey(creatorUsername), 0, -1, (err, reply) => {
            err ? reject() : resolve(reply.map((msg) => JSON.parse(msg)));
        })
    });
};

exp.removeMessages = (creatorUsername) => {
    return new Promise((resolve, reject) => {
        redisCli.del(chatKey(creatorUsername), (err, reply) => {
            err ? reject() : resolve();
        })
    });
};

module.exports = exp;