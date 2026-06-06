import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobPosting: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true },
  candidateName: { type: String, required: true, trim: true },
  candidateEmail: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  resumeText: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  coverLetter: { type: String, default: '' },
  experience: { type: String, default: '' },
  skills: [String],
  education: { type: String, default: '' },
  aiScore: { type: Number, default: 0, min: 0, max: 100 },
  aiSummary: { type: String, default: '' },
  status: {
    type: String,
    enum: ['applied', 'screening', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'],
    default: 'applied'
  },
  interviewDate: { type: Date },
  notes: { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);
