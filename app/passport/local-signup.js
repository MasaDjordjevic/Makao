import jwt from 'jsonwebtoken';
import User from '../models/user';
import { Strategy } from 'passport-local';

var SignupStrategy = new Strategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
        passReqToCallback: true
    },
    (req, email, password, done) => {
        // check for email conflicts
        User.findOne({email: email}, (err, user) => {
            if (user) {
                var error = new Error('Email is already in use.');
                return done(error);
            }
        });
        // also for username conflicts
        User.findOne({username: req.body.username}, function(err, user) {
            if (user) {
                var error = new Error('Username is already in use.');
                return done(error);
            }
        });

        var userData = {
            email: email.trim(),
            password: password.trim(),
            username: req.body.username.trim()
        };

        var user = new User(userData);

        user.save((err) => {
            if (err) {
                return done(err);
            }

            var payload = { sub: user._id };

            // create a JSON web token
            var token = jwt.sign(payload, 'aips2017jajacmasamitic');

            return done(null, token);
        });
    }
);

module.exports = SignupStrategy;