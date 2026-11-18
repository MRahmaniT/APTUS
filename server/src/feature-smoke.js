import assert from "node:assert/strict";
import { query, pool } from "./db.js";
const base="http://127.0.0.1:3000/api";
async function request(path,body,token){const response=await fetch(base+path,{method:body?"POST":"GET",headers:{"Content-Type":"application/json",...(token?{Authorization:"Bearer "+token}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};}
async function code(to){const r=await fetch("http://127.0.0.1:3002/messages?to="+encodeURIComponent(to));return (await r.json()).code;}
const stamp=Date.now();
const channels=await request("/auth/otp/channels");assert.deepEqual(channels.data,{email:true,sms:true});
const email="verify-"+stamp+"@aptus.test";
const issued=await request("/auth/otp/request",{identifier:email});assert.equal(issued.status,202);assert.ok(!("code" in issued.data));
const actual=await code(email);const wrong=actual==="111111"?"222222":"111111";
assert.equal((await request("/auth/otp/verify",{challengeId:issued.data.challengeId,code:wrong})).status,400);
const login=await request("/auth/otp/verify",{challengeId:issued.data.challengeId,code:actual,name:"OTP Test Member"});assert.equal(login.status,200);assert.equal(login.data.user.role,"member");
assert.equal((await request("/auth/otp/verify",{challengeId:issued.data.challengeId,code:actual})).status,400);
assert.equal((await request("/auth/otp/request",{identifier:email})).status,429);
const sms="+98912"+String(stamp).slice(-7);const phone=await request("/auth/otp/request",{identifier:sms});assert.equal(phone.status,202);assert.equal((await request("/auth/otp/verify",{challengeId:phone.data.challengeId,code:await code(sms)})).status,200);
const parallelEmail="parallel-"+stamp+"@aptus.test",parallel=await request("/auth/otp/request",{identifier:parallelEmail}),parallelCode=await code(parallelEmail);
const results=await Promise.all([1,2].map(()=>request("/auth/otp/verify",{challengeId:parallel.data.challengeId,code:parallelCode})));assert.deepEqual(results.map(r=>r.status).sort(),[200,400]);
const expired=await request("/auth/otp/request",{identifier:"expired-"+stamp+"@aptus.test"});await query("update otp_challenges set expires_at=now()-interval '1 second' where id=$1",[expired.data.challengeId]);assert.equal((await request("/auth/otp/verify",{challengeId:expired.data.challengeId,code:await code("expired-"+stamp+"@aptus.test")})).status,400);
const limitedEmail="limited-"+stamp+"@aptus.test",limited=await request("/auth/otp/request",{identifier:limitedEmail}),limitedCode=await code(limitedEmail);for(let i=0;i<5;i++)assert.equal((await request("/auth/otp/verify",{challengeId:limited.data.challengeId,code:limitedCode==="111111"?"222222":"111111"})).status,400);assert.equal((await request("/auth/otp/verify",{challengeId:limited.data.challengeId,code:limitedCode})).status,400);
const manager=(await query("select email from users where role='manager' order by created_at limit 1")).rows[0];const admin=await request("/auth/login",{email:manager.email,password:"Aptus-CI-Password-123!"});assert.equal(admin.status,200);const token=admin.data.session.access_token;
const article=await request("/content",{type:"article",slug:"ci-article",locale:"fa",status:"published",templateKey:"editorial",title:"مقاله آزمایشی",abstract:"چکیده عمومی مقاله",body:"PRIVATE_ARTICLE_BODY",category:"فنی",highlights:[],specs:{},cta:{},seo:{},media:[]},token);assert.equal(article.status,201);
const guest=await request("/content/article/ci-article?locale=fa");assert.equal(guest.data.abstract,"چکیده عمومی مقاله");assert.equal(guest.data.body,"");assert.equal(guest.data.requiresLogin,true);assert.ok(!JSON.stringify(guest.data).includes("PRIVATE_ARTICLE_BODY"));
const listing=await request("/content?type=article&locale=fa");assert.ok(!JSON.stringify(listing.data).includes("PRIVATE_ARTICLE_BODY"));
const full=await request("/content/article/ci-article?locale=fa",null,login.data.session.access_token);assert.equal(full.data.body,"PRIVATE_ARTICLE_BODY");
assert.equal((await request("/content?type=article&locale=fa&includeDrafts=true",null,login.data.session.access_token)).status,403);
const memberToken = login.data.session.access_token;
const project = await request("/content", {
  type:"project", slug:"ci-private-project", locale:"fa", status:"published", templateKey:"case-study",
  title:"پروژه آزمایشی مدیریت", abstract:"معرفی پروژه خصوصی", body:"PRIVATE_PROJECT_BODY",
  coverImage:"/catalog-assets/cover-render3.png", category:"آزمایشی",
},token);
assert.equal(project.status,201);

for (const path of ["/content?type=project&locale=fa", "/content/project/ci-private-project?locale=fa", "/analytics/summary?period=month&date=2026-09"]) {
  assert.equal((await request(path)).status,401);
  assert.equal((await request(path,null,memberToken)).status,403);
  assert.equal((await request(path,null,token)).status,200);
}
const editor = await request("/auth/login",{email:"ci-admin@aptus.test",password:"Aptus-CI-Password-123!"});
assert.equal(editor.data.user.role,"admin");
assert.equal((await request("/content/project/ci-private-project?locale=fa",null,editor.data.session.access_token)).data.body,"PRIVATE_PROJECT_BODY");
const changeRole = await fetch(base+"/profiles/"+login.data.user.id+"/role",{
  method:"PATCH",headers:{"Content-Type":"application/json",Authorization:"Bearer "+editor.data.session.access_token},
  body:JSON.stringify({role:"admin"}),
});
assert.equal(changeRole.status,403);

for (const key of ["codes","books","glossary","articles"]) {
  const settingKey="page:fa:library/"+key;
  await query("insert into site_settings (key,value) values ($1,$2) on conflict (key) do update set value=excluded.value",[
    settingKey,JSON.stringify({title:"منبع فنی آزمایشی",abstract:"معرفی منبع فنی",body:"PRIVATE_LIBRARY_BODY",heroImage:""}),
  ]);
  const path="/settings?key="+encodeURIComponent(settingKey);
  const anon=await request(path);
  assert.equal(anon.status,key==="articles"?200:401);
  assert.ok(!JSON.stringify(anon.data).includes("PRIVATE_LIBRARY_BODY"));
  assert.equal((await request(path,null,memberToken)).data.body,"PRIVATE_LIBRARY_BODY");
}
for (let n=1;n<=4;n++) {
  const news=await request("/content",{
    type:"news",slug:"ci-update-"+n,locale:"fa",status:"published",templateKey:"editorial",
    title:"تازه‌های آزمایشی "+n,abstract:"چکیده آزمایشی مستقل برای بررسی ورق خوردن کارت‌ها و نمایش هم‌زمان دو مطلب در صفحه.",
    body:"خبر آزمایشی مستقل",category:n<=2?"اخبار":"رویداد",
    coverImage:n<=2?"/catalog-assets/cover-render1.jpg":"/catalog-assets/render.png",
    publishedAt:"2026-09-17T08:00:00Z",
  },token);
  assert.equal(news.status,201);
}
const stats=await request("/analytics/summary?period=month&date=2026-09",null,token);
assert.equal(stats.status,200);
assert.ok(stats.data.pages.some(p=>p.path==="/ci-smoke"));
assert.equal((await request("/analytics/summary?period=month&date=2026-99",null,token)).status,400);
console.log("PASS: OTP lifecycle, public summaries, member library access, administrator project/statistics permissions and manager-only role changes.");
await pool.end();
