import mongoose from 'mongoose';

var GameSchema = new mongoose.Schema({
    rules: Object,
    date: Date,
    duration: Number,
    players: [String],
    kicked: [String],
    handNum: Number,
    scores: [{}] // mongoose Mixed type
});

module.exports = mongoose.model('Game', GameSchema);