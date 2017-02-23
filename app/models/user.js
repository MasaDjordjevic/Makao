import mongoose from 'mongoose';
import mbcrypt from 'mongoose-bcrypt';
import Stats from './stats';

// unique: true also creates an index for that field
var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    friends: [String], // list of usernames is enough for now
    friendRequests: [String],
    games: [mongoose.Schema.Types.ObjectId],
    stats: mongoose.Schema.Types.ObjectId
});

// adds password field and automatically encrypts/decrypts
// the string saved in that field using bcrypt
UserSchema.plugin(mbcrypt);

// custom save/create function so a document for Stats gets
// created as well and its id saved in user document
UserSchema.statics.createUser = function(newUserData, callback) {
    let emptyStats = new Stats({});
    emptyStats.save((err) => {
        newUserData.stats = emptyStats._id;
        newUserData.save(newUserData, (err) => {
            if (err) { return callback(err) }
            return callback(null);
        });
    });
};

UserSchema.statics.findByUsername = function(username, callback) {
    this.findOne({ username: username}, (err, user) => {
        return callback(err, user);
    });
};

UserSchema.statics.findByEmail = function(email, callback) {
    this.findOne({ email: email}, (err, user) => {
        return callback(err, user);
    });
};

UserSchema.statics.addFriend = function(username, friendUsername, callback) {
    this.findByUsername(username, (err, user) => {
        if (err) { return callback(err); }
        let requestIndex = user.friendRequests.indexOf(friendUsername);
        if (requestIndex != -1) {
            user.friendRequests.splice(requestIndex, 1);
        }
        user.friends.push(friendUsername);
        user.save((err) => {
            if (err) { return callback(err); }
            return callback(null);
        });
    });
};

UserSchema.statics.addFriendRequest = function(username, sender, callback) {
    this.findByUsername(username, (err, user) => {
        if (err) { return callback(err); }
        if (user.friendRequests.indexOf(sender) !== -1) {
            let error = new Error("Already sent.");
            return callback(error);
        }
        user.friendRequests.push(sender);
        user.save((err) => {
            if (err) { return callback(err) }
            return callback(null);
        });
    });
};

UserSchema.statics.removeFriendRequest = function(username, friendUsername, callback) {
    this.findByUsername(username, (err, user) => {
        if (err) { return callback(err); }
        let requestIndex = user.friendRequests.indexOf(friendUsername);
        if (requestIndex != -1) {
            user.friendRequests.splice(requestIndex, 1);
        }
        user.save((err) => {
            if (err) { return callback(err); }
            return callback(null);
        });
    });
};

UserSchema.statics.insertGame = function(username, gameId, callback) {
    this.findByUsername(username, (err, user) => {
        if (err) { return callback(err); }
        user.games.push(gameId);
        user.save((err) => {
            if (err) { return callback(err); }
            return callback(null);
        });
    });
};

module.exports = mongoose.model('User', UserSchema);