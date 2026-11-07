import { createHmac, randomBytes, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { query, withTransaction } from "./db.js";

const secret = process.env.OTP_SECRET || randomBytes(32).toString("hex");
const ttl = 300;
export function otpChannels() {
  return {email:Boolean(process.env.OTP_EMAIL_WEBHOOK_URL),sms:Boolean(process.env.OTP_SMS_WEBHOOK_URL)};
}
function normalize(value) {
  let target=String(value||"").trim().replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632));
  if(target.includes("@")) {
    target=target.toLowerCase();
    if(target.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target))throw Object.assign(new Error("نشانی ایمیل معتبر نیست."),{statusCode:400});
    return {channel:"email",target};
  }
  target=target.replace(/[\s()-]/g,"");
  if(/^09\d{9}$/.test(target))target="+98"+target.slice(1);
  if(target.startsWith("0098"))target="+98"+target.slice(4);
  if(!/^\+[1-9]\d{7,14}$/.test(target))throw Object.assign(new Error("شماره همراه را با پیش‌شماره کشور وارد کنید."),{statusCode:400});
  return {channel:"sms",target};
}
function digest(id,channel,target,code){return createHmac("sha256",secret).update(JSON.stringify([id,channel,target,code])).digest("hex");}
async function deliver(channel,target,code) {
  const endpoint=process.env[channel==="email"?"OTP_EMAIL_WEBHOOK_URL":"OTP_SMS_WEBHOOK_URL"];
  if(!endpoint)throw Object.assign(new Error("ارسال کد در حال حاضر در دسترس نیست. از ورود با رمز عبور استفاده کنید."),{statusCode:503});
  const url=new URL(endpoint);
  if(url.protocol!=="https:"&&!(process.env.NODE_ENV==="test"&&url.protocol==="http:"&&["127.0.0.1","localhost"].includes(url.hostname)))throw new Error("OTP delivery requires HTTPS.");
  const token=process.env[channel==="email"?"OTP_EMAIL_WEBHOOK_TOKEN":"OTP_SMS_WEBHOOK_TOKEN"];
  const response=await fetch(url,{method:"POST",redirect:"error",signal:AbortSignal.timeout(10000),headers:{"Content-Type":"application/json",...(token?{Authorization:"Bearer "+token}:{})},body:JSON.stringify({channel,to:target,code,expiresInSeconds:ttl})});
  if(!response.ok)throw new Error("OTP provider rejected delivery.");
}
export async function requestOtp(value) {
  const {channel,target}=normalize(value);
  if(!otpChannels()[channel])throw Object.assign(new Error("ارسال کد در حال حاضر در دسترس نیست. از ورود با رمز عبور استفاده کنید."),{statusCode:503});
  const id=randomUUID(),code=String(randomInt(100000,1000000));
  await withTransaction(async client=>{
    await client.query("select pg_advisory_xact_lock(hashtextextended($1,0))",[channel+":"+target]);
    const recent=(await client.query("select created_at from otp_challenges where channel=$1 and target=$2 and created_at>now()-interval '10 minutes' order by created_at desc",[channel,target])).rows;
    if(recent.length>=3||(recent[0]&&Date.now()-new Date(recent[0].created_at).getTime()<60000))throw Object.assign(new Error("برای ارسال دوباره کد کمی صبر کنید."),{statusCode:429});
    await client.query("delete from otp_challenges where created_at<now()-interval '1 day'");
    await client.query("update otp_challenges set used_at=now() where channel=$1 and target=$2 and used_at is null",[channel,target]);
    await client.query("insert into otp_challenges(id,channel,target,code_hash,expires_at) values($1,$2,$3,$4,now()+interval '5 minutes')",[id,channel,target,digest(id,channel,target,code)]);
  });
  try { await deliver(channel,target,code); }
  catch {await query("update otp_challenges set used_at=now() where id=$1",[id]);throw Object.assign(new Error("ارسال کد انجام نشد. کمی بعد دوباره تلاش کنید یا با رمز عبور وارد شوید."),{statusCode:503});}
  return {challengeId:id,channel,expiresIn:ttl,retryAfter:60};
}
export async function verifyOtp(id,value,name) {
  if(!/^[0-9a-f-]{36}$/i.test(String(id)))return null;
  const code=String(value||"").replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632));
  const initial=(await query("select channel,target from otp_challenges where id=$1",[id])).rows[0];
  if(!initial)return null;
  return withTransaction(async client=>{
    await client.query("select pg_advisory_xact_lock(hashtextextended($1,0))",[initial.channel+":"+initial.target]);
    const row=(await client.query("select * from otp_challenges where id=$1 for update",[id])).rows[0];
    if(!row||row.used_at||row.attempts>=5||new Date(row.expires_at).getTime()<=Date.now())return null;
    await client.query("update otp_challenges set attempts=attempts+1 where id=$1",[id]);
    const actual=Buffer.from(digest(id,row.channel,row.target,code),"hex"),expected=Buffer.from(row.code_hash,"hex");
    if(!/^\d{6}$/.test(code)||expected.length!==actual.length||!timingSafeEqual(actual,expected))return null;
    let user=(await client.query("select u.* from auth_identities i join users u on u.id=i.user_id where i.channel=$1 and i.target=$2",[row.channel,row.target])).rows[0];
    if(!user&&row.channel==="email")user=(await client.query("select * from users where lower(email)=$1",[row.target])).rows[0];
    if(!user){
      const email=row.channel==="email"?row.target:"sms-"+createHmac("sha256","aptus-phone-identity").update(row.target).digest("hex")+"@identity.aptus.invalid";
      user=(await client.query("insert into users(email,password_hash,name,phone,role) values($1,$2,$3,$4,'member') returning *",[email,"passwordless$"+randomBytes(32).toString("hex"),String(name||"کاربر آپتوس").trim().slice(0,120)||"کاربر آپتوس",row.channel==="sms"?row.target:null])).rows[0];
    }
    await client.query("insert into auth_identities(channel,target,user_id) values($1,$2,$3) on conflict(channel,target) do nothing",[row.channel,row.target,user.id]);
    await client.query("update otp_challenges set used_at=now() where id=$1",[id]);
    return user;
  });
}
