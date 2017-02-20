import mongoose from 'mongoose';
import mbcrypt from 'mongoose-bcrypt';

// unique: true also creates an index for that field
var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    friends: [String], // list of usernames is enough for now
    friendRequests: [String]
});

// adds password field and automatically encrypts/decrypts
// the string saved in that field using bcrypt
UserSchema.plugin(mbcrypt);

UserSchema.statics.findByUsername = function(username, callback) {
    this.findOne({ username: username}, (err, user) => {
        callback(err, user);
    });
}

UserSchema.statics.findByEmail = function(email, callback) {
    this.findOne({ email: email}, (err, user) => {
        callback(err, user);
    });
}

UserSchema.statics.addFriend = function(username, friendUsername, callback) {
    this.findByUsername(username, (err, user) => {
        if (err) { callback(err) }
        let requestIndex = user.friendRequests.indexOf(friendUsername);
        if (requestIndex != -1) {
            user.friendRequests.splice(requestIndex, 1);
        }
        user.friends.push(friendUsername);
        user.save((err) => {
            if (err) { callback(err) }
            callback(null);
        });
    });
}

UserSchema.statics.addFriendRequest = function(username, requestFrom, callback) {
    this.findByUsername(username, (err, user) => {
        if (err) { callback(err) };
        user.friendRequests.push(requestFrom);
        user.save((err) => {
            if (err) { callback(err) }
            callback(null);
        });
    });
}

UserSchema.statics.removeFriendRequest = function(username, friendUsername, callback) {
    this.findByUsername(username, (err, user) => {
        if (err) { callback(err) }
        let requestIndex = user.friendRequests.indexOf(friendUsername);
        if (requestIndex != -1) {
            user.friendRequests.splice(requestIndex, 1);
        }
        user.save((err) => {
            if (err) { callback(err) }
            callback(null);
        });
    });
}

// export the model built around the schema
module.exports = mongoose.model('User', UserSchema);