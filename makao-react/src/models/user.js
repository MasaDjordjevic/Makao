import mongoose from 'mongoose';
import mbcrypt from 'mongoose-bcrypt';

var userSchema = new mongoose.Schema({
    _id: Number,
    username: String,
    email: String,
    friends: [{}]
});

// adds password field and automatically encrypts/decrypts
// the string saved in that field
userSchema.plugin(mbcrypt);

// export the model built around the schema
module.exports = mongoose.model('User', userSchema);