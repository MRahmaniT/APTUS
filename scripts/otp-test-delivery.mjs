// Loopback-only fake provider for automated tests; never imported by the website/API.
import { createServer } from "node:http";
if(process.env.NODE_ENV!=="test")throw new Error("Test provider only");
const messages=new Map();
createServer(async(req,res)=>{const url=new URL(req.url,"http://127.0.0.1");
 if(req.method==="GET"&&url.pathname==="/messages"){res.setHeader("Content-Type","application/json");return res.end(JSON.stringify(messages.get(url.searchParams.get("to"))||{}));}
 if(req.method!=="POST"||url.pathname!=="/deliver"){res.statusCode=404;return res.end();}
 let text="";for await(const chunk of req){text+=chunk;if(text.length>4096){res.statusCode=413;return res.end();}}
 try{const data=JSON.parse(text);if(data.to.startsWith("fail")){res.statusCode=503;return res.end();}messages.set(data.to,data);res.setHeader("Content-Type","application/json");res.end('{"ok":true}');}catch{res.statusCode=400;res.end();}
}).listen(3002,"127.0.0.1");
