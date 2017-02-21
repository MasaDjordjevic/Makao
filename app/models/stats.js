import mongoose from 'mongoose';

var UserStatsSchema = new mongoose.Schema({
    scores: {type: [Number], default: [0]},
    timeSpent: {type: [Number], default: [0]},
    gamesLeft: {type: Number, default: 0},
    gamesWon: {type: Number, default: 0},
    totalScore: {type: Number, default: 0}
});

UserStatsSchema.statics.updateStats = function(statsId, data, callback) {
    this.findById(statsId, (err, stats) => {
        if (err) { return callback(err) }
        if (data.kicked) { stats.gamesLeft += 1 }
        if (data.winner) { stats.gamesWon += 1 }
        stats.scores[stats.scores.length - 1] += data.gameScore;
        stats.timeSpent[stats.timeSpent.length - 1] += data.timeSpent;
        stats.totalScore += data.gameScore;

        stats.markModified('scores');
        stats.markModified('timeSpent');

        stats.save((err) => {
            if (err) { return callback(err) }
            return callback(null);
        });
    });
}

module.exports = mongoose.model('UserStats', UserStatsSchema);