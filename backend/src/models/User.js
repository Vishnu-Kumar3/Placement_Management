import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'coordinator'], default: 'student' },
  studentProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', unique: true, sparse: true }
}, { timestamps: true });
export default mongoose.model('User', schema);
