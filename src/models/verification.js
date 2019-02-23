import mongoose, { Schema } from 'mongoose';

export const VerificationEmailSchema = new Schema({
  uuid: { type: String, required: true },
  email: { type: String, required: true },
  expireAt: { type: Date, requried: true },
})

export const VerificationEmail = mongoose.model('VerificationEmail', VerificationEmailSchema);