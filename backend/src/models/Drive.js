import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true, maxlength: 160 },
  industry: { type: String, trim: true, maxlength: 100 },
  jobTitle: { type: String, required: true, trim: true, maxlength: 120 },
  location: { type: String, trim: true, maxlength: 120 },
  eligibility: { type: String, trim: true, maxlength: 500 },
  minCgpa: { type: Number, min: 0, max: 10, default: 0 },
  maxActiveBacklogs: { type: Number, min: 0, max: 255, default: 0 },
  packageAmount: { type: Number, required: true, min: 0 },
  driveDate: { type: Date, required: true },
  status: { type: String, enum: ['Draft', 'Open', 'Closed', 'Cancelled'], default: 'Draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
schema.index({ status: 1, driveDate: 1 });
export default mongoose.model('Drive', schema);
