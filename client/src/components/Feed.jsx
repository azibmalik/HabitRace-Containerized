import React from 'react';
export default function Feed({items}){
  if(!items.length) return <div className="subtle">Nothing yet. Check-ins appear here live.</div>;
  return (<div className="feed">{items.map((evt,idx)=>(<div key={idx} style={{padding:'8px 0',borderBottom:'1px dashed #1f2937'}}><div><strong>{evt.username}</strong> checked in: <em>{evt.title}</em></div><div className="subtle" style={{fontSize:12}}>Day {evt.day}</div></div>))}</div>);
}
