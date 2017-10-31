import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  head: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Review', reviewSchema);
