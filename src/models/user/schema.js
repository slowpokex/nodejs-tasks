import mongoose from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';
import { promisify } from 'util';
import '../product/schema';

const genSaltAsync = promisify(genSalt);
const hashAsync = promisify(hash);
const compareAsync = promisify(compare);

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    required: false,
    default: false,
  },
  title: {
    type: String,
    default: 'Employee',
  },
  displayName: {
    type: String,
    default: 'Anonymous',
  },
  lastName: {
    type: String,
    default: 'Anonymous',
  },
  firstName: {
    type: String,
    default: 'Anonymous',
  },
  password: {
    type: String,
    minlength: 6,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
});

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  return genSaltAsync(SALT_WORK_FACTOR)
    .then(salt => hashAsync(user.password, salt))
    .then((hashValue) => {
      user.password = hashValue;
      next();
    }).catch(err => next(err));
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  return compareAsync(candidatePassword, this.password)
    .then(isMatch => cb(null, isMatch))
    .catch(err => cb(err));
};

export default mongoose.model('User', userSchema);
