import mongoose from '../config/mongoose-config';
import { Team } from './team';
// import User from './user';

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  created: { type: Date, default: Date.now },
  title: { type: String, required: true },
  content: { type: String },
  authorId: { type: String, required: true },
  teamId: { type: String, required: true }
});

// /*
//   Add the id of the announcement to the author,
//   and also it has to be appended to the team as well
// */
// AnnouncementSchema.post('save', async function () {
//   try {
//     await Team.updateOne(
//       { _id: this.teamId },
//       {
//         $push: {
//           announcements: {
//             _id: this._id,
//             authorId: this.authorId,
//           }
//         }
//       },
//       // update does not run validators by default
//       { runValidators: true }
//     );
//   } catch (e) {
//     console.log('error in post', e);
//     // Throw the error to the real handler
//     throw e;
//   }
// });

export const Announcement = mongoose.model('Announcement', AnnouncementSchema);
