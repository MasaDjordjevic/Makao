import mongoose from 'mongoose';
import mbcrypt from 'mongoose-bcrypt';
import Stats from './stats';

// unique: true also creates an index for that field
var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    friends: [String],
    friendRequests: [String],
    games: [mongoose.Schema.Types.ObjectId],
    stats: mongoose.Schema.Types.ObjectId
});

// adds password field and automatically encrypts/decrypts
// the string saved in that field using bcrypt
UserSchema.plugin(mbcrypt);

UserSchema.statics.findByUsername = function(username, callback) {
    return this.findOne({ username: username}, callback);
};

UserSchema.statics.findByEmail = function(email, callback) {
    return this.findOne({ email: email}, callback);
};

// custom save/create function so a document for Stats gets
// created as well and its id saved in user document
UserSchema.statics.createUser = function(newUserData, callback) {
    let stats = new Stats({ username: newUserData.username });
    return stats.save((err) => {
        if (err) { return callback(err) }
        newUserData.stats = stats._id;
        newUserData.save(newUserData, (err) => {
            return callback(err);
        });
    });
};

UserSchema.statics.createUserWithStats = function(newUserData, userStats, callback) {
    userStats.username = newUserData.username;
    let stats = new Stats(userStats);
    return stats.save((err) => {
        if (err) { return callback(err) }
        newUserData.stats = stats._id;
        newUserData.save(newUserData, (err) => {
            return callback(err);
        });
    });
}

UserSchema.statics.addFriend = function(username1, username2, callback) {
    let error = null;
    this.update({ username: username1 }, {
        $pull: { friendRequests: username2 },
        $addToSet: { friends: username2 }
    }, (err) => error = err);
    if (error) { return callback(error) }

    this.update({ username: username2 }, {
        $pull: { friendRequests: username1 },
        $addToSet: { friends: username1 }
    }, (err) => error = err);
    if (error) { return callback(error) }

    return callback(null);
};

UserSchema.statics.addFriendRequest = function(username, sender, callback) {
    return this.update({ username: username }, { $addToSet: { friendRequests: sender }}, callback);
};

UserSchema.statics.removeFriendRequest = function(username, friendUsername, callback) {
    return this.update({ username: username }, { $pull: { friendRequests: sender }}, callback);
};

UserSchema.statics.insertGame = function(username, gameId, callback) {
    return this.update({ username: username }, { $addToSet: { games: gameId }}, callback);
};

module.exports = mongoose.model('User', UserSchema);