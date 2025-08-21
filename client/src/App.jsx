import React,{useEffect,useMemo,useState} from 'react';
import { io } from 'socket.io-client';
import { api } from './api';
import Header from './components/Header.jsx';
import HabitForm from './components/HabitForm.jsx';
import HabitList from './components/HabitList.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Feed from './components/Feed.jsx';
const SOCKET_URL=(import.meta.env.VITE_API_BASE && import.meta.env.VITE_API_BASE.replace(/https?:\/\//,'ws://')) || 'ws://localhost:4000';
export default function App(){
  const [user,setUser]=useState(localStorage.getItem('habitrace:user')||'');
  const [habits,setHabits]=useState([]);
  const [board,setBoard]=useState([]);
  const [feed,setFeed]=useState([]);
  const socket=useMemo(()=> io(SOCKET_URL,{transports:['websocket']}),[]);
  useEffect(()=>{ socket.on('feed:new',evt=> setFeed(f=>[evt,...f].slice(0,100))); return ()=> socket.disconnect(); },[socket]);
  useEffect(()=>{ if(!user) return; (async()=>{ try{ const hs=await api('/api/habits',{user}); setHabits(hs); const lb=await api('/api/leaderboard',{user}); setBoard(lb);}catch(e){console.error(e)} })(); },[user]);
  async function addHabit(title){ const h=await api('/api/habits',{method:'POST', body:{title}, user}); setHabits(hs=>[h,...hs]); }
  async function checkin(id){ const res=await api(`/api/habits/${id}/checkin`,{method:'POST', user}); setHabits(hs=> hs.map(h=> h.id===id?{...h, streak:res.streak}:h)); const lb=await api('/api/leaderboard',{user}); setBoard(lb); }
  return (<div className="container"><div className="row" style={{alignItems:'stretch'}}><div className="grow"><div className="card" style={{marginBottom:16}}><Header user={user} onSetUser={(u)=>{setUser(u); localStorage.setItem('habitrace:user',u);}}/></div><div className="card" style={{marginBottom:16}}><div className="h1">Your Habits</div><div className="subtle">Create habits and keep your streak alive.</div>{user? <HabitForm onAdd={addHabit}/> : <div className="subtle">Enter a username above to begin.</div>}<HabitList habits={habits} onCheckin={checkin}/></div></div><div className="grow"><div className="card" style={{marginBottom:16}}><div className="h1">Live Feed</div><div className="subtle" style={{marginBottom:8}}>See check-ins in real time.</div><Feed items={feed}/></div><div className="card"><div className="h1">Leaderboard</div><div className="subtle" style={{marginBottom:8}}>Top users by total current streak.</div><Leaderboard board={board}/></div></div></div></div>); }
