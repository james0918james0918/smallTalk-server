import mongoose from 'mongoose';

// force mongoose to use findOneAndUpdate instead of FindAndModify which is deprecated
mongoose.set('useFindAndModify', false);

export default mongoose;
