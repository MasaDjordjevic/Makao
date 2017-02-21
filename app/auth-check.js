import User from './models/user';
import socketioJwt from 'socketio-jwt';

let exp = {};

// helper function to extract only necessary
// user data for returning callbacks
function getUserInfo(userModel) {
    let userInfo = {
        id: userModel._id,
        username: userModel.username,
        friends: userModel.friends
    }
    return userInfo;
}

exp.loginAuth = (data, callback) => {
    let email = data.email.trim();
    let password = data.password.trim();

    User.findByEmail(email, (err, user) => {
        if (err) { return callback(err); }

        if (!user) {
            let error = new Error('User with that email does not exist.');
            return callback(error);
        }

        user.verifyPassword(password, (err, valid) => {
            if (err) { return callback(err); }

            if (!valid) {
                let error = new Error('Incorrect password.');
                return callback(error);
            }

            return callback(null, getUserInfo(user));
        });
    });
};

exp.signupAuth = (data, callback) => {
    let userData = {
        email : data.email.trim(),
        username : data.username.trim(),
        password : data.password.trim()
    }

    User.findByEmail(userData.email, (err, user) => {
        if (err) { return callback(err); }

        if (user) {
            let error = new Error('Email is already in use.');
            return callback(error);
        }

        User.findByUsername(userData.username, (err, user) => {
            if (err) { return callback(err); }

            if (user) {
                let error = new Error('Username is already in use.');
                return callback(error);
            }

            let newUser = new User(userData);
            User.createUser(newUser, (err) => {
                if (err) { return callback(err); }

                return callback(null, getUserInfo(newUser));
            });
        });
    });
};

exp.socketTokenAuth = socketioJwt.authorize({
    secret: 'aips2017jajacmasamitic',
    timeout: 1000 * 60 * 60
});

// exp.socketUserAuth = (userId, callback) => {
//     User.findById(userId, (err, user) => {
//         if (err || !user) {
//             return callback(new Error("User not found."));
//         } else {
//             // attach user info to socket
//             return callback(null, getUserInfo(user));
//         }
//     });
// };

module.exports = exp;