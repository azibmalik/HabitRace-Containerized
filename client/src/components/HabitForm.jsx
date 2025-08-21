import React,{useState} from 'react';
export default function HabitForm({onAdd}){
  const [title,setTitle]=useState('');
  return (<div style={{display:'flex',gap:8,margin:'12px 0 8px'}}><input className="input" placeholder="e.g., Read 20 minutes" value={title} onChange={e=>setTitle(e.target.value)}/><button className="button primary" onClick={()=>{ if(title.trim()){ onAdd(title.trim()); setTitle(''); }}}>Add</button></div>);
}
