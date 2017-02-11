import mongoose from 'mongoose';
import mbcrypt from 'mongoose-bcrypt';
import mongooseAutoIncrement from 'mongoose-auto-increment';

// initialize the auto increment package
mongooseAutoIncrement.initialize(mongoose.connection);

var userSchema = new mongoose.Schema({
    _id: Number,
    username: String,
    email: String,
    friends: [{}]
});

// adds password field and automatically encrypts/decrypts
// the string saved in that field
userSchema.plugin(mbcrypt);

// adds autoincrement plugin (default on _id field)
userSchema.plugin(mongooseAutoIncrement.plugin, { model: 'User', startAt: 1 });

// export the model built around the schema
module.exports = mongoose.model('User', userSchema);