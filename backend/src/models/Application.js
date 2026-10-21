import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  drive: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive', required: true },
  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appliedOn: { type: Date, default: Date.now },
  status: { type: String, enum: ['Applied', 'Shortlisted', 'Selected', 'Rejected', 'Withdrawn'], default: 'Applied' },
  resumeUrl: { type: String, trim: true, maxlength: 500 },
  statusHistory: [{ status: { type: String, required: true }, changedAt: { type: Date, default: Date.now }, note: { type: String, trim: true, maxlength: 300 } }]
}, { timestamps: true });
schema.index({ student: 1, drive: 1 }, { unique: true });
export default mongoose.model('Application', schema);
