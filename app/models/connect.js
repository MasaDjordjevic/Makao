import mongoose from 'mongoose';

module.exports.connect = (uri) => {
  mongoose.connect(uri);
  mongoose.Promise = global.Promise;

  mongoose.connection.on('error', function() {
      console.log('Error: Could not connect to MongoDB. Did you forget to run "mongod"?');
  });
};