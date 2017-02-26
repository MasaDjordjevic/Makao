import validator from 'validator';

let exp = {};

exp.validateLoginForm = (data) => {
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

exp.validateSignupForm = (data) => {
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

module.exports = exp;