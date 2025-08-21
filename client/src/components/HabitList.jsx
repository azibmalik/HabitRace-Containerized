import React from 'react';
export default function HabitList({habits,onCheckin}){
  if(!habits.length) return <div className="subtle" style={{marginTop:8}}>No habits yet.</div>;
  return (<ul className="list">{habits.map(h=>(<li key={h.id}><div><div className="h2">{h.title}</div><div className="subtle">Current streak: <span className="badge">{h.streak} day{h.streak===1?'':'s'}</span></div></div><div style={{display:'flex',gap:8}}><button className="button" onClick={()=>onCheckin(h.id)}>Check-in Today</button></div></li>))}</ul>);
}
