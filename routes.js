import express from 'express';
import jwt from 'jsonwebtoken';
import validations from './validations';
import Gameplay from './Gameplay/Gameplay';
import { loginAuth, signupAuth } from './auth-check';

var router = express.Router();

// POST login request
router.post('/auth/login', (req, res, next) => {
    // first we validate the input fields
    var validationResult = validations.validateLoginForm(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.error
        });
    }

    // if inputs are valid, we authenticate the user
    // by sending him a JSON web token (jwt)
    loginAuth(req.body, (err, user) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        var payload = { sub: user.id, name: user.username };
        // create a JSON web token
        var token = jwt.sign(payload, 'aips2017jajacmasamitic');

        return res.status(200).json({
            success: true,
            message: "Successful login!",
            token
        });
    })
});

// POST signup request
router.post('/auth/signup', (req, res, next) => {
    // first we validate the input fields
    var validationResult = validations.validateSignupForm(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.error
        });
    }

    // if inputs are valid, we register the user
    // and send him a jwt
    signupAuth(req.body, (err, user) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        var payload = { sub: user.id, name: user.username };
        // create a JSON web token
        var token = jwt.sign(payload, 'aips2017jajacmasamitic');

        return res.status(200).json({
            success: true,
            message: "Successful signup!",
            token
        });
    })
});

router.post('/game/watch', (req, res, next) => {
    Gameplay.getGame(req.body.creatorUsername)
        .then((state) => res.status(200).json({state: state}))
        .catch((reason) => res.status(200).json({success: false, reason: reason}));
});

module.exports = router;