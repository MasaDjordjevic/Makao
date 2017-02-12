import express from 'express';
import passport from 'passport';

var router = express.Router();

router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

// POST login request
// using passport 'Custom Callback' feature to allow access of
// req and res objects within the auth callback
router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, token, userData) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successful login!",
            token,
            user: userData
        });
    })(req, res, next);
});

// POST signup request
// using passport 'Custom Callback' feature to allow access of
// req and res objects within the auth callback
router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, token, userData) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successful signup!",
            token,
            user: userData
        });
    })(req, res, next);
});

module.exports = router;