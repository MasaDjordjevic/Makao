import bodyParser from 'body-parser';
import express from 'express';
import expressSession from 'express-session';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import http from 'http';
import logger from 'morgan';
import mongoose from 'mongoose';
import mongooseAutoIncrement from 'mongoose-auto-increment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import redis from 'redis';
import redisConnect from 'connect-redis';

import User from './models/user';

// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

let app = express();

// change promises used to native ES6 promises and connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/makao');
mongoose.connection.on('error', function() {
    console.log('Error: Could not connect to MongoDB. Did you forget to run "mongod"?');
});

// everything needed to make a redis store used for sessions
let rStore = redisConnect(expressSession);
let rSessionClient = redis.createClient();
let rSessionStore = new rStore({
    host: 'localhost',
    port: 6379,
    client: rSessionClient
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('combined'));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use(bodyParser.json());

// using express-sessions package with the created redis store
app.use(expressSession({
    store: rSessionStore,
    secret: 'aips2017jajacmasamitic',
    resave: true,
    saveUninitialized: false
}));

// insert some users if none exist in database
User.count({}, function(err, count) {
    if (count === 0) {
        var users = [
            new User({ username: "jajac", email: "jajac", password: "jajac",
                friends: [{id: 2, username: 'masa'}, {id: 3, username: 'mitic'}]}),
            new User({ username: "masa", email: "masa", password: "masa",
                friends: [{id: 1, username: 'jajac'}]}),
            new User({ username: "mitic", email: "mitic", password: "mitic",
                friends: [{id: 2, username: 'masa'}]})
        ]

        users[0].resetCount(function(err, nextCount){});

        // users.map(x => x.save());
        users[0].save();
        users[1].save();
        users[2].save();
    }
});

app.use(function(req, res, next) {
    if (req.session && req.session.key) {
        if (req.url === '/') {
            res.redirect('/home');
        } else {
            next();
        }
    } else {
        var allowed = ['/', '/login', '/signup'];
        if (allowed.indexOf(req.url) !== -1) {
            next();
        } else {
            res.redirect('/');
        }
    }
});

// POST login request
app.post('/login', function(req, res) {
    User.findOne({ 'email': req.body.email }, function(err, user) {
        if (!user) {
            res.status(200).send({ msg: "User doesn't exist." });
        } else {
            user.verifyPassword(req.body.password, function(err, valid) {
                if (!valid) {
                    res.status(200).send({ msg: "Incorrect password." });
                } else {
                    user = {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    };
                    req.session.key = user;
                    res.status(200).send({ redirect: '/home' });
                }
            });
        }
    });
});

// POST signup request
app.post('/signup', function(req, res) {
    if (!req.body.password || !req.body.confirmPassword) {
        res.status(200).send({ success: false, msg: 'Password missing.' });
    } else if (req.body.password !== req.body.confirmPassword) {
        res.status(200).send({ success: false, msg: 'Passwords do not match.' });
    } else {
        var user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        user.save(function(err) {
            user = {
                id: user._id,
                username: user.username,
                email: user.email
            };
            req.session.key = user;
            res.status(200).send({ redirect: '/home' });
        });
    }
});

app.post('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.status(200).send();
    });
});

app.use(function(req, res) {
    match(
        { routes: routes, location: req.url },
        function(err, redirectLocation, renderProps) {

            if (err) {
                return res.status(500).send(err.message);
            }

            if (redirectLocation) {
                return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            }

            const muiTheme = getMuiTheme({ userAgent: req.headers['user-agent'] });
            let markup;
            if (renderProps) {
                markup = ReactDOM.renderToString(
                    <MuiThemeProvider muiTheme={muiTheme}>
                        <RouterContext {...renderProps}/>
                    </MuiThemeProvider>
                );
            }

            return res.render('index', { markup });
        }
    );
});



app.listen(1337, function() {
    console.log('Listening on port 1337.');
});
