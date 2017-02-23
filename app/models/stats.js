import mongoose from 'mongoose';

var UserStatsSchema = new mongoose.Schema({
    username: String,
    scores: {type: [Number], default: [0]},
    totalScore: {type: Number, default: 0},
    timeSpent: {type: [Number], default: [0]},
    totalTimeSpent: {type: Number, default: 0},
    averageTimeSpent: {type: Number, default: 0},
    gamesPlayed: {type: Number, default: 0},
    gamesLeft: {type: Number, default: 0},
    gamesWon: {type: Number, default: 0}
});

UserStatsSchema.statics.getStats = function(username, callback) {
    mongoose.model('User').findByUsername(username, (err, user) => {
        if (err) { return callback(err) }
        this.findById(user.stats, (err, stats) => {
            let userStats = {
                scores: stats.scores,
                totalScore: stats.totalScore,
                timeSpent: stats.timeSpent,
                totalTimeSpent: stats.totalTimeSpent,
                averageTimeSpent: stats.averageTimeSpent,
                gamesPlayed: stats.gamesPlayed,
                gamesLeft: stats.gamesLeft,
                gamesWon: stats.gamesWon
            }
            return callback(err, userStats);
        });
    });
}

UserStatsSchema.statics.updateStats = function(statsId, data, callback) {
    this.findById(statsId, (err, stats) => {
        if (err) { return callback(err) }
        if (data.kicked) { stats.gamesLeft += 1 }
        if (data.won) { stats.gamesWon += 1 }
        stats.gamesPlayed += 1;
        stats.scores[stats.scores.length - 1] += data.gameScore;
        stats.totalScore += data.gameScore;
        stats.timeSpent[stats.timeSpent.length - 1] += data.timeSpent;
        stats.totalTimeSpent += data.timeSpent;
        stats.averageTimeSpent = Math.round(stats.totalTimeSpent / stats.gamesPlayed);

        stats.markModified('scores');
        stats.markModified('timeSpent');

        stats.save((err) => {
            if (err) { return callback(err) }
            return callback(null);
        });
    });
};

UserStatsSchema.statics.getLeaderboards = function(username, callback) {
    mongoose.model('User').findByUsername(username, (err, user) => {
        if (err) { return callback(err) }
        this.find({}, (err, allStats) => {
            if (err) { return callback(err) }

            let global = [], friends = [];
            allStats.forEach((userStats) => {
                let isFriend = user.friends.indexOf(userStats.username) !== -1;
                let entry = {
                    username: userStats.username,
                    score: userStats.totalScore
                }

                if (user.username === userStats.username) {
                    friends.push(entry);
                }

                if (isFriend) {
                    friends.push(entry);
                }

                // clone the object and save ref to that clone
                entry = Object.assign({}, entry);
                entry.friend = isFriend;
                global.push(entry);
            });

            global.sort((a, b) => b.score - a.score);
            friends.sort((a, b) => b.score - a.score);

            let meGlobal = global.findIndex(item => item.username === username);
            let meFriends = friends.findIndex(item => item.username === username);

            if (global.length > 10) global = global.slice(0, 10);
            if (friends.length > 10) friends = friends.slice(0, 10);

            return callback(null, {
                global: global,
                friends: friends,
                meGlobal: meGlobal,
                meFriends: meFriends
            });
        });
    });
}

module.exports = mongoose.model('UserStats', UserStatsSchema);