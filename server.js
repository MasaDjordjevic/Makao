import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import logger from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import redis from 'redis';
import sio from 'socket.io';

// external route handler
import routes from './routes';

// mongodb connection logic
import mongoConnect from './models/connect';
import User from './models/user';
import Game from './models/game';
import Stats from './models/stats';

// authentication check middleware that we will use to secure endpoints
import authCheck from './auth-check';

// external socket.io event/message handlers
import appSocket from './sockets/appSocket';
import playSocket from './sockets/playSocket';
import lobbySocket from './sockets/lobbySocket';
import chatSocket from './sockets/chatSocket';
import gameSocket from './sockets/gameSocket';

// redis api
import Games from './Redis/Games';

// tell any CSS tooling (such as Material UI) to use all vendor
// prefixes if the user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

let app = express();

// change promises used to native ES6 promises and connect to mongodb
mongoConnect.connect('mongodb://localhost/makao');

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')));
}
app.use(logger('combined'));
app.use(bodyParser.json());

User.count({}, (err, count) => {
    if (count != 0) { return }
    Game.remove({}, () => {});
    User.remove({}, () => {});
    Stats.remove({}, () => {});
    var users = [
        new User({username: "marko", email: "marko", password: "marko",
                friends: ['masa', 'mitic', 'pera']}),
        new User({username: "jajac", email: "jajac", password: "jajac",
                friends: ['mitic', 'pera', 'mika', 'masa'],
                friendRequests: ['kristina']}),
        new User({username: "masa", email: "masa", password: "masa",
                friends: ['jajac', 'mitic', 'mika']}),
        new User({username: "mitic", email: "mitic", password: "mitic",
                friends: ['masa', 'pera']}),
        new User({username: "pera", email: "pera", password: "pera",
                friends: ['masa', 'mitic']}),
        new User({username: "mika", email: "mika", password: "mika",
                friends: ['masa', 'mitic', 'pera']}),
        new User({username: "darko", email: "darko", password: "darko",
                friends: ['jajac', 'mitic']}),
        new User({username: "kristina", email: "kristina", password: "kristina",
                friends: ['masa', 'mika', 'darko']}),
        new User({username: "jovana", email: "jovana", password: "jovana",
                friends: ['jajac', 'mitic']}),
        new User({username: "ema", email: "ema", password: "ema",
                friends: ['darko', 'masa', 'kristina']}),
    ];

    var statsList = [{}, {}, {}];

    statsList[0].scores = [40, 70, -30, 20, 120, 50, 90, 20, 30];
    statsList[0].totalScore = 410;
    statsList[0].timeSpent = [10, 30, 15, 10, 50, 20, 30, 5, 10];
    statsList[0].totalTimeSpent = 180;
    statsList[0].averageTimeSpent = 20;
    statsList[0].gamesPlayed = 9;
    statsList[0].gamesLeft = 1;
    statsList[0].gamesWon = 4;

    statsList[1].scores = [80, 10, 120, 150, 0, -100, -50, 30];
    statsList[1].totalScore = 240;
    statsList[1].timeSpent = [20, 5, 60, 50, 0, 50, 15, 10];
    statsList[1].totalTimeSpent = 210;
    statsList[1].averageTimeSpent = 26;
    statsList[1].gamesPlayed = 20;
    statsList[1].gamesLeft = 0;
    statsList[1].gamesWon = 6;

    statsList[2].scores = [50, -10, 70, 30, 150, -100, -30, 30];
    statsList[2].totalScore = 190;
    statsList[2].timeSpent = [10, 0, 30, 50, 0, 20, 15, 10];
    statsList[2].totalTimeSpent = 135;
    statsList[2].averageTimeSpent = 18;
    statsList[2].gamesPlayed = 15;
    statsList[2].gamesLeft = 2;
    statsList[2].gamesWon = 2;

    for (var i = 0; i < users.length; i++) {
        User.createUserWithStats(users[i], statsList[i % 3], () => {});
    }
});

app.use(routes);

const server = app.listen(3001, () => {
    console.log('Server listening on port 3001.');
});

const io = sio(server);

io.on('connection', authCheck.socketTokenAuth)
  .on('authenticated', (socket) => appSocket(socket, io));
// passing 'io' to lobbysocket as well for the 'user:invite' message
io.of('/lobby')
  .on('connection', authCheck.socketTokenAuth)
  .on('authenticated', (socket) => lobbySocket(socket, io));
io.of('/chat')
  .on('connection', authCheck.socketTokenAuth)
  .on('authenticated', chatSocket);
io.of('/game')
  .on('connection', authCheck.socketTokenAuth)
  .on('authenticated', (socket) => gameSocket(socket, io));
io.of('/play')
  .on('connection', authCheck.socketTokenAuth)
  .on('authenticated', playSocket);
