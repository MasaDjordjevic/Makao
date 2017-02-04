import path from 'path';
import http from 'http';
import express from 'express';
import session from 'client-sessions';
import logger from 'morgan';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import bodyParser from 'body-parser';
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

let app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('combined'));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use(bodyParser.json());

app.use(session({
    cookieName: 'session',
    secret: 'aips2017jajacmasamitic',
    duration: 120 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));

app.use(function(req, res, next) {
    if (req.session && req.session.user) {
        if (req.url === '/') {
            res.redirect('/home');
        } else {
            next();
        }
    } else {
        let allowed = ['/', '/login', '/signup'];
        if (allowed.indexOf(req.url) !== -1) {
            next();
        } else {
            res.redirect('/');
        }
    }
});

// POST login request
app.post('/login', function(req, res) {
    if (req.body.email && req.body.password) {
        req.session.user = req.body.email;
        res.status(200).send({ redirect: '/home' });
    } else {
        res.status(200).send({ msg: "Invalid credentials." });
    }
});

// POST signup request
app.post('/signup', function(req, res) {
    if (req.body.password === req.body.confirmPassword) {
        req.session.user = req.body.email;
        res.status(200).send({ redirect: '/home' });
    } else {
        res.status(200).send({ msg: "Passwords fields don't match."});
    }
});

app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect('/');
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
