import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ['admin', 'senior_manager', 'hr_recruiter', 'employee'],
    default: 'employee'
  },
  avatar: { type: String, default: '' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  phone: { type: String, default: '' },
  designation: { type: String, default: '' },
  dateOfJoining: { type: Date, default: Date.now },
  salary: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'on_leave', 'terminated'], default: 'active' },
  skills: [String],
  address: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  employeeId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
