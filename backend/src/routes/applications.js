import { Router } from 'express';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import Drive from '../models/Drive.js';
import { requireAuth } from '../middleware/auth.js';
import { requireCoordinator } from '../middleware/roles.js';
import { asyncRoute } from '../middleware/asyncRoute.js';
import { placementEvents } from '../services/events.js';
import { sendStatusEmail } from '../services/email.js';
const router = Router();
router.use(requireAuth);
router.get('/', asyncRoute(async (req,res)=>{
  const docs=await Application.find().populate('student','rollNo name department cgpa activeBacklogs').populate('drive','companyName jobTitle packageAmount driveDate status').sort({appliedOn:-1});
  const term=String(req.query.search||'').trim().toLowerCase();
  res.json(term?docs.filter(a=>`${a.student?.rollNo} ${a.student?.name} ${a.drive?.companyName} ${a.drive?.jobTitle}`.toLowerCase().includes(term)):docs);
}));
router.post('/', asyncRoute(async (req,res)=>{
  const student=await Student.findById(req.body.studentId);const drive=await Drive.findById(req.body.driveId);
  if(!student||!drive)return res.status(400).json({message:'Choose a valid student and drive.'});
  if(drive.status!=='Open')return res.status(400).json({message:'Applications are accepted only for open drives.'});
  if(student.cgpa<drive.minCgpa||student.activeBacklogs>drive.maxActiveBacklogs)return res.status(400).json({message:'Student does not meet this drive’s CGPA/backlog eligibility.'});
  const sameCompany=await Drive.find({companyName:drive.companyName}).select('_id');
  const duplicate=await Application.exists({student:student._id,drive:{$in:sameCompany.map(d=>d._id)}});
  if(duplicate)return res.status(409).json({message:'Student has already applied to this company.'});
  const app=await Application.create({student:student._id,drive:drive._id,appliedBy:req.user._id,status:'Applied',resumeUrl:req.body.resumeUrl||'',statusHistory:[{status:'Applied',note:'Application created'}]});
  placementEvents.emit('application:created',{applicationId:app._id.toString(),student:student.rollNo});
  res.status(201).json(await app.populate([{path:'student',select:'rollNo name department cgpa activeBacklogs'},{path:'drive',select:'companyName jobTitle packageAmount driveDate status'}]));
}));
router.patch('/:id', requireCoordinator, asyncRoute(async (req,res)=>{
  const allowed=['Applied','Shortlisted','Selected','Rejected','Withdrawn'];const next=String(req.body.status||'');
  if(!allowed.includes(next))return res.status(400).json({message:'Choose a valid application status.'});
  const app=await Application.findById(req.params.id).populate('student');if(!app)return res.status(404).json({message:'Application not found.'});
  app.status=next;app.statusHistory.push({status:next,note:String(req.body.note||'Status updated').trim().slice(0,300)});await app.save();
  try{await sendStatusEmail(app,app.student);}catch(err){console.error('Status email failed:',err.message);}
  res.json(await app.populate('drive','companyName jobTitle packageAmount driveDate status'));
}));
router.delete('/:id', requireCoordinator, asyncRoute(async (req,res)=>{const app=await Application.findByIdAndDelete(req.params.id);if(!app)return res.status(404).json({message:'Application not found.'});res.json({message:'Application deleted.'});}));
export default router;
