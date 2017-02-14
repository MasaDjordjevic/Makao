import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import logger from 'morgan';
import passport from 'passport';
import path from 'path';
import redis from 'redis';
import redisConnect from 'connect-redis';
import sio from 'socket.io';

// external route handlers
import authRoutes from './routes/auth';
import appRoutes from './routes/app';

// mongodb connection logic
import mongoConnect from './models/connect';

// import User schema for now
import User from './models/user';

// passport strategies for login and signup
import localLoginStrategy from './passport/local-login';
import localSignupStrategy from './passport/local-signup';

// authentication check middleware that we will use to secure endpoints
import authCheck from './passport/auth-check';

// external socket.io event/message handlers
import lobbySocket from './sockets/lobbySocket';
import chatSocket from './sockets/chatSocket';

// tell any CSS tooling (such as Material UI) to use all vendor
// prefixes if the user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

let app = express();

// change promises used to native ES6 promises and connect to mongodb
mongoConnect.connect('mongodb://localhost/makao');

// redis client used for saving game state
let redisCli = redis.createClient();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
}
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(passport.initialize());

// load passport strategies
passport.use('local-login', localLoginStrategy);
passport.use('local-signup', localSignupStrategy);

// insert some users if none exist in database
User.count({}, (err, count) => {
    if (count === 0) {
        var users = [
            new User({ username: "jajac", email: "jajac", password: "jajac" }),
            new User({ username: "masa", email: "masa", password: "masa" }),
            new User({ username: "mitic", email: "mitic", password: "mitic" })
        ]

        users.map(x => x.save());
    }
});

app.use((req, res, next) => {
    console.log('REQUEST[' + req.url + '] ' + Date.now());
    next();
});

// forward /auth/* requests to the external route handler (login and signup)
app.use('/auth', authRoutes);
// all other requests have to go through authCheck before forwarding to handler
app.use('/', authCheck, appRoutes);

const server = app.listen(3001, () => {
    console.log('Server listening on port 3001.');
});

const io = sio(server);
io.of('/lobby').on('connection', lobbySocket);
io.of('/chat').on('connection', chatSocket);
