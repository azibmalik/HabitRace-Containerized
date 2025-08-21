const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
export async function api(path,{method='GET',body,user}={}){
  const headers={'Content-Type':'application/json'}; if(user) headers['x-user']=user;
  const res=await fetch(`${API}${path}`,{method,headers,body:body?JSON.stringify(body):undefined});
  if(!res.ok){const t=await res.text().catch(()=> ''); throw new Error(t || `HTTP ${res.status}`)}
  return res.json();
}
