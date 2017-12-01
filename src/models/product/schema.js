import mongoose from 'mongoose';
import '../review/schema';

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  reviews: [{
    type: String,
    ref: 'Review',
  }],
  lastModifiedDate: Date,
});

productSchema.pre('save', function (next) {
  this.lastModifiedDate = new Date();
  next();
});

export default mongoose.model('Product', productSchema);
