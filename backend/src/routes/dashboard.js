import { Router } from 'express';
import Application from '../models/Application.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncRoute } from '../middleware/asyncRoute.js';
const router=Router();
router.get('/summary',requireAuth,asyncRoute(async(_req,res)=>{
  const [totals]=await Application.aggregate([{$group:{_id:null,total:{$sum:1},selected:{$sum:{$cond:[{$eq:['$status','Selected']},1,0]}},shortlisted:{$sum:{$cond:[{$eq:['$status','Shortlisted']},1,0]}}}}]);
  const byCompany=await Application.aggregate([{$lookup:{from:'drives',localField:'drive',foreignField:'_id',as:'drive'}},{$unwind:'$drive'},{$group:{_id:'$drive.companyName',applications:{$sum:1},selected:{$sum:{$cond:[{$eq:['$status','Selected']},1,0]}},averagePackage:{$avg:'$drive.packageAmount'}}},{$sort:{applications:-1}}]);
  res.json({totals:totals||{total:0,selected:0,shortlisted:0},byCompany});
}));
export default router;
