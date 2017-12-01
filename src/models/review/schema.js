import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  head: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  lastModifiedDate: Date,
});

reviewSchema.pre('save', function (next) {
  this.lastModifiedDate = new Date();
  next();
});

export default mongoose.model('Review', reviewSchema);
