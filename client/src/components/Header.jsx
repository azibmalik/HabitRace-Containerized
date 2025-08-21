import React,{useState} from 'react';
export default function Header({user,onSetUser}){
  const [name,setName]=useState(user||'');
  return (<div className="header"><div><div className="h1">HabitRace</div><div className="subtle">Pick a username to start (demo authentication).</div></div><div style={{marginLeft:'auto',display:'flex',gap:8}}><input className="input" placeholder="your-username" value={name} onChange={e=>setName(e.target.value)}/><button className="button primary" onClick={()=>onSetUser(name.trim())} disabled={!name.trim()}>Use</button></div></div>);
}
