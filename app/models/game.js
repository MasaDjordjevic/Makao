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

// export the model built around the schema
module.exports = mongoose.model('Game', GameSchema);