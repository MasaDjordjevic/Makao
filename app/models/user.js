import mongoose from 'mongoose';
import mbcrypt from 'mongoose-bcrypt';

// unique: true also creates an index for that field
var userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    friends: [String] // list of usernames is enough for now
});

// adds password field and automatically encrypts/decrypts
// the string saved in that field using bcrypt
userSchema.plugin(mbcrypt);

// export the model built around the schema
module.exports = mongoose.model('User', userSchema);