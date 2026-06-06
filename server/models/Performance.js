import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  period: { type: String, required: true },
  ratings: {
    productivity: { type: Number, min: 1, max: 5, default: 3 },
    quality: { type: Number, min: 1, max: 5, default: 3 },
    communication: { type: Number, min: 1, max: 5, default: 3 },
    teamwork: { type: Number, min: 1, max: 5, default: 3 },
    leadership: { type: Number, min: 1, max: 5, default: 3 },
  },
  overallRating: { type: Number, min: 1, max: 5, default: 3 },
  goals: [{ title: String, status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' } }],
  strengths: { type: String, default: '' },
  improvements: { type: String, default: '' },
  comments: { type: String, default: '' },
  aiSummary: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'submitted', 'acknowledged'], default: 'draft' },
}, { timestamps: true });

export default mongoose.model('Performance', performanceSchema);
