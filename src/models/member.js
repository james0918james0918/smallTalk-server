import mongoose from '../config/mongoose-config';

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  userId: Schema.Types.ObjectId,
  role: [String]
});

export default MemberSchema;
