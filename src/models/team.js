import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const TeamSchema = new Schema({
  created: { type: Date, default: Date.now },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String },
  members: [{
    userId: Schema.Types.ObjectId,
    role: String
  }],
  iconId: String
});

// Delete memberships in users before deleting teams
TeamSchema.pre('remove', () => {
  console.log('Hook called');
});

export const Team = mongoose.model('Team', TeamSchema);
