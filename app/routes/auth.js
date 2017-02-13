import express from 'express';
import validator from 'validator';
import passport from 'passport';

var router = express.Router();

function validateLoginForm(data) {
    var error = '';
    var isValid = true;

    if (!data || typeof data.email !== 'string' || data.email.trim().length === 0) {
        isValid = false;
        error = 'Email is required.';
    } else if (!data || typeof data.password !== 'string' || data.password.trim().length === 0) {
        isValid = false;
        error = 'Password is required.';
    }

    return {
        success: isValid,
        error: error
    }
}

function validateSignupForm(data) {
    var error = '';
    let isValid = true;

    if (!data || typeof data.username !== 'string' || data.username.trim().length < 3) {
        isValid = false;
        error = 'Username with at least 3 alphanumeric characters is required.';
    } else if (!data || typeof data.email !== 'string' || !validator.isEmail(data.email)) {
        isValid = false;
        error = 'Valid email address is required.';
    } else if (!data || typeof data.password !== 'string' || data.password.trim().length < 8) {
        isValid = false;
        error = 'Password with at least 8 characters is required.';
    } else if (!data || typeof data.confirmPassword !== 'string' || data.confirmPassword.trim() !== data.password.trim()) {
        isValid = false;
        error = 'Inserted passwords do not match.';
    }

    return {
        success: isValid,
        error: error
    };
}

// POST login request
// using passport 'Custom Callback' feature to allow access of
// req and res objects within the auth callback
router.post('/login', (req, res, next) => {
    // first we validate the input fields
    var validationResult = validateLoginForm(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.error
        });
    }

    // if inputs are valid, we use the passport strategy
    // to auth the user by sending him a JSON web token
    passport.authenticate('local-login', (err, token) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successful login!",
            token
        });
    })(req, res, next);
});

// POST signup request
// using passport 'Custom Callback' feature to allow access of
// req and res objects within the auth callback
router.post('/signup', (req, res, next) => {
    // first we validate the input fields
    var validationResult = validateSignupForm(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.error
        });
    }

    // if inputs are valid, we use the passport strategy
    // to signup and auth the user by sending him a JSON web token
    passport.authenticate('local-signup', (err, token) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successful signup!",
            token
        });
    })(req, res, next);
});

module.exports = router;