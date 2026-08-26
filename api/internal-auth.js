const crypto = require('crypto');

const COOKIE = 'fenix_internal_session';
const TTL_SECONDS = 8 * 60 * 60;

function password(){ return process.env.FENIX_INTERNAL_PASSWORD || ''; }
function sign(value){ return crypto.createHmac('sha256', password()).update(value).digest('base64url'); }
function safeEqual(a,b){
  const A=Buffer.from(String(a||'')); const B=Buffer.from(String(b||''));
  return A.length===B.length && crypto.timingSafeEqual(A,B);
}
function makeToken(){
  const exp = String(Math.floor(Date.now()/1000)+TTL_SECONDS);
  return `${exp}.${sign(exp)}`;
}
function parseCookies(req){
  const out={};
  String(req.headers.cookie||'').split(';').forEach(part=>{const i=part.indexOf('=');if(i>0)out[part.slice(0,i).trim()]=decodeURIComponent(part.slice(i+1).trim())});
  return out;
}
function validSession(req){
  const token=parseCookies(req)[COOKIE]; if(!token) return false;
  const [exp,sig]=String(token).split('.');
  if(!exp||!sig||Number(exp)<Math.floor(Date.now()/1000)) return false;
  return safeEqual(sig,sign(exp));
}
function setCookie(res,token,maxAge){
  res.setHeader('Set-Cookie',`${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`);
}

module.exports = async function handler(req,res){
  if(!password()) return res.status(503).json({error:'Acesso interno ainda não configurado.'});
  if(req.method==='GET') return res.status(200).json({authenticated:validSession(req)});
  if(req.method==='POST'){
    const supplied=String(req.body?.password||'');
    if(!safeEqual(supplied,password())) return res.status(401).json({error:'Senha inválida.'});
    setCookie(res,makeToken(),TTL_SECONDS);
    return res.status(200).json({authenticated:true});
  }
  if(req.method==='DELETE'){
    setCookie(res,'',0);
    return res.status(200).json({authenticated:false});
  }
  return res.status(405).json({error:'Método não permitido.'});
};
