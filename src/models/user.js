import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
<<<<<<< HEAD
    _id: Schema.Types.ObjectId,
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type:String, required: true },
    created: {
        type: Date,
        default: Date.now
    }
=======
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
>>>>>>> fcc2aa7a93feafbb771776807ee73766c9ab7b00
});

export const User = mongoose.model('User', UserSchema);
