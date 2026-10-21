import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true, trim: true, uppercase: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, lowercase: true, trim: true },
  department: { type: String, required: true, trim: true },
  graduationYear: { type: Number, required: true, min: 2000, max: 2100 },
  cgpa: { type: Number, required: true, min: 0, max: 10 },
  activeBacklogs: { type: Number, required: true, min: 0, max: 255, default: 0 }
}, { timestamps: true });
export default mongoose.model('Student', schema);
