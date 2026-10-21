export function requireCoordinator(req,res,next){
  if(req.user?.role!=='coordinator')return res.status(403).json({message:'Coordinator access is required for this action.'});
  next();
}
