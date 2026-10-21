import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import Student from '../src/models/Student.js';
import Drive from '../src/models/Drive.js';
import Application from '../src/models/Application.js';

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_management');
const user=await User.findOneAndUpdate({email:'faculty@placement.demo'},{$set:{name:'Placement Faculty',email:'faculty@placement.demo',passwordHash:await bcrypt.hash('PlacementDemo123!',12),role:'coordinator'}},{upsert:true,new:true,setDefaultsOnInsert:true});
const studentData=[
  ['SIT23CS001','Aarav Shah','aarav.shah@example.edu','Computer Science',2027,8.7,0],
  ['SIT23CS002','Mira Patel','mira.patel@example.edu','Computer Science',2027,7.9,0],
  ['SIT23EC003','Kabir Rao','kabir.rao@example.edu','Electronics',2027,8.1,1],
  ['SIT23CS004','Anaya Iyer','anaya.iyer@example.edu','Computer Science',2027,9.2,0],
  ['SIT23ME005','Rohan Desai','rohan.desai@example.edu','Mechanical',2027,7.4,0],
  ['SIT23IT006','Ishita Nair','ishita.nair@example.edu','Information Technology',2027,8.3,0],
  ['SIT23CE007','Dev Mehta','dev.mehta@example.edu','Civil Engineering',2027,7.8,0],
  ['SIT23CH008','Sana Khan','sana.khan@example.edu','Chemical Engineering',2027,8.6,0],
  ['SIT23EE009','Arjun Pillai','arjun.pillai@example.edu','Electrical Engineering',2027,7.6,0],
  ['SIT23DS010','Tara Joshi','tara.joshi@example.edu','Data Science',2027,9.0,0]
];
const students=[];
for(const [rollNo,name,email,department,graduationYear,cgpa,activeBacklogs] of studentData) students.push(await Student.findOneAndUpdate({rollNo},{$set:{rollNo,name,email,department,graduationYear,cgpa,activeBacklogs}},{upsert:true,new:true,setDefaultsOnInsert:true}));
await User.findOneAndUpdate({email:'aarav.student@placement.demo'},{$set:{name:'Aarav Shah',email:'aarav.student@placement.demo',passwordHash:await bcrypt.hash('PlacementStudent123!',12),role:'student',studentProfile:students[0]._id}},{upsert:true,new:true,setDefaultsOnInsert:true});
const driveData=[
  ['Northstar Analytics','Technology','Data Analyst','Pune','BTech/BE, graduating 2027',7.5,0,1200000,'2026-11-15'],
  ['BluePeak Systems','Information Technology','Software Engineer','Pune / Hybrid','CS/IT preferred, graduating 2027',7,0,1500000,'2026-11-20'],
  ['Greenfield Mobility','Automotive','Graduate Engineer Trainee','Pune','Engineering, graduating 2027',7,1,900000,'2026-11-25'],
  ['Cedar Labs','Healthcare Technology','Junior Data Engineer','Pune','Engineering or computing, graduating 2027',7.5,0,1100000,'2026-12-03'],
  ['Summit Financial','Financial Services','Risk Analyst','Mumbai / Hybrid','Graduating 2027',7,0,1250000,'2026-12-05'],
  ['Orion Cloud Services','Cloud Computing','Cloud Support Engineer','Pune / Hybrid','Engineering or computing, graduating 2027',7.5,1,1300000,'2026-12-09'],
  ['Aster Robotics','Robotics','Automation Engineer','Pune','Engineering, graduating 2027',7,0,1150000,'2026-12-11']
];
for(const [companyName,industry,jobTitle,location,eligibility,minCgpa,maxActiveBacklogs,packageAmount,driveDate] of driveData) await Drive.findOneAndUpdate({companyName,jobTitle},{$set:{companyName,industry,jobTitle,location,eligibility,minCgpa,maxActiveBacklogs,packageAmount,driveDate:new Date(`${driveDate}T00:00:00.000Z`),status:'Open',createdBy:user._id}},{upsert:true,new:true,setDefaultsOnInsert:true});
if(await Application.countDocuments()===0){
  const samples=[['SIT23CS001','Data Analyst','Applied'],['SIT23CS002','Data Analyst','Shortlisted'],['SIT23CS001','Software Engineer','Selected'],['SIT23EC003','Graduate Engineer Trainee','Applied'],['SIT23CS004','Software Engineer','Rejected'],['SIT23IT006','Junior Data Engineer','Selected'],['SIT23CE007','Risk Analyst','Selected'],['SIT23CH008','Cloud Support Engineer','Selected'],['SIT23EE009','Automation Engineer','Selected'],['SIT23DS010','Graduate Engineer Trainee','Selected']];
  for(const [rollNo,jobTitle,status] of samples){const student=students.find(s=>s.rollNo===rollNo);const drive=await Drive.findOne({jobTitle});if(student&&drive)await Application.create({student:student._id,drive:drive._id,appliedBy:user._id,status,statusHistory:[{status,note:'Seeded demonstration record'}]});}
}
console.log(`Seed complete: demo coordinator, ${students.length} students and ${driveData.length} open drives.`);
await mongoose.disconnect();
