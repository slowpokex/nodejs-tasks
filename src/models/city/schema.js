import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    min: 3,
  },
  country: {
    type: String,
    required: true,
    min: 3,
  },
  capital: {
    type: Boolean,
    required: [true, 'Need set capital'],
    default: false,
  },
  location: {
    lat: Number,
    long: Number,
  },
  lastModifiedDate: Date,
});

citySchema.pre('save', function (next) {
  this.lastModifiedDate = new Date();
  next();
});

export default mongoose.model('City', citySchema);
