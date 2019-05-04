import mongoose from '../config/mongoose-config';


const Schema = mongoose.Schema;


const MemberSchema = new Schema({
  userId: Schema.Types.ObjectId,
  role: [String]
});

const TeamAnnouncementSchema = new Schema({
  authorId: { type: String, required: true },
  id: { type: String, requried: true }
});

export const TeamSchema = new Schema({
  created: { type: Date, default: Date.now },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String },
  members: [MemberSchema],
  announcements: [TeamAnnouncementSchema],
  logoId: String,
  owner: { type: String, required: true },
});

// Delete memberships in users before deleting teams
TeamSchema.pre('remove', () => {
  console.log('Hook called');
});

export const Team = mongoose.model('Team', TeamSchema);
