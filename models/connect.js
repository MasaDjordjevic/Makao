import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

module.exports.connect = (uri) => {
    mongoose.connect(uri);

    mongoose.connection.on('error', () => {
        console.log('Error: Could not connect to MongoDB. Did you forget to run "mongod"?');
    });
};