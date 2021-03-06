import mongoose from 'mongoose';

export const connectToDatabase = () => {
  mongoose.connect('mongodb://127.0.0.1:27017/smallTalkDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Successfully connected to MongoDB');
  }).catch((error) => {
    console.log('Failed to connect to MongoDB, error: ', error.message);
    process.exit(1);
  });
};
