import React from 'react';
export default function Leaderboard({board}){
  if(!board.length) return <div className="subtle">No data yet.</div>;
  return (<div>{board.map((row,i)=>(<div className="leader" key={row.username}><div style={{display:'flex',alignItems:'center',gap:8}}><span className="badge">#{i+1}</span><strong>{row.username}</strong></div><div className="tag">{row.score} pts</div></div>))}</div>);
}
