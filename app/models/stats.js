import mongoose from 'mongoose';

var UserStatsSchema = new mongoose.Schema({
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

module.exports = mongoose.model('UserStats', UserStatsSchema);