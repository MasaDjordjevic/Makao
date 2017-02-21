import mongoose from 'mongoose';

var GameSchema = new mongoose.Schema({
    rules: [{}],
    date: Date,
    duration: Number,
    players: [String],
    kicked: [String],
    handNum: Number,
    scores: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model('Game', GameSchema);