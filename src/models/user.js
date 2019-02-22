import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  teams: [],
  created: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
