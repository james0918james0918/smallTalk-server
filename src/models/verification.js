import mongoose, { Schema } from 'mongoose';

export const VerificationEmailSchema = new Schema({
  username: { type: String, required: true},
  password: { type: String, required: true},
  uuid: { type: String, required: true },
  email: { type: String, required: true },
  expireAt: { type: Date, requried: true },
})

export const VerificationEmail = mongoose.model('VerificationEmail', VerificationEmailSchema);