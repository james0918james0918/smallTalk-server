import mongoose from '../config/mongoose-config';
import MemberSchema from './member';


const Schema = mongoose.Schema;

export const TeamSchema = new Schema({
  created: { type: Date, default: Date.now },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String },
  members: [MemberSchema],
  logoId: String,
  owner: { type: String, required: true },
});

// Delete memberships in users before deleting teams
TeamSchema.pre('remove', () => {
  console.log('Hook called');
});

export const Team = mongoose.model('Team', TeamSchema);
