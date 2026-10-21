import { createServer } from 'node:http';
import { URL } from 'node:url';

// Standalone Node core HTTP lab example; run with `npm run http-demo`.
const server=createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method==='GET'&&url.pathname==='/api/hello'){
    res.writeHead(200);res.end(JSON.stringify({message:'Hello from Node core HTTP',name:url.searchParams.get('name')||'student'}));return;
  }
  res.writeHead(404);res.end(JSON.stringify({message:'Route not found'}));
});
server.listen(5001,()=>console.log('Node core HTTP demo: http://localhost:5001/api/hello?name=Aarav'));
