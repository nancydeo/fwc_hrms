import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  description: { type: String, required: true },
  requirements: [String],
  skills: [String],
  experience: { type: String, default: '0-2 years' },
  salary: { min: { type: Number, default: 0 }, max: { type: Number, default: 0 } },
  location: { type: String, default: 'Bangalore, India' },
  type: { type: String, enum: ['full_time', 'part_time', 'contract', 'intern'], default: 'full_time' },
  status: { type: String, enum: ['open', 'closed', 'on_hold'], default: 'open' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicationsCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('JobPosting', jobPostingSchema);
