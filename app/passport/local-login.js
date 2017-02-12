import jwt from 'jsonwebtoken';
import User from '../models/user';
import { Strategy } from 'passport-local';

var LoginStrategy = new Strategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
        passReqToCallback: true
    },
    (req, email, password, done) => {
        var userData = {
            email: email.trim(),
            password: password.trim()
        };

        // find a user by email address
        User.findOne({ email: userData.email }, (err, user) => {
            if (err) { return done(err); }

            if (!user) {
                var error = new Error('Incorrect email or password.');
                error.name = 'IncorrectCredentialsError';
                return done(error);
            }

            // check password
            user.verifyPassword(userData.password, (err, valid) => {
                if (err) { return done(err); }

                if (!valid) {
                    var error = new Error('Incorrect email or password');
                    error.name = 'IncorrectCredentialsError';
                    return done(error);
                }

                var payload = { sub: user._id };

                // create a JSON web token
                var token = jwt.sign(payload, 'aips2017jajacmasamitic');
                var data = { username: user.username };

                return done(null, token, data);
            });
        });
    }
);

module.exports = LoginStrategy;