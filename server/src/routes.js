import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { calcStreak, todayISO } from './utils.js';
const router = Router();
router.use((req,res,next)=>{
  const db=req.app.get('db'); const username=(req.header('x-user')||'').trim();
  if(!username) return res.status(400).json({error:'Missing x-user header'});
  let user=db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if(!user){const id=uuid(); db.prepare('INSERT INTO users (id, username) VALUES (?, ?)').run(id, username); user={id, username};}
  req.user=user; next();
});
router.post('/habits',(req,res)=>{
  const db=req.app.get('db'); const {title}=req.body;
  if(!title||!title.trim()) return res.status(400).json({error:'Title required'});
  const id=uuid(); const created_at=Date.now();
  db.prepare('INSERT INTO habits (id, user, title, created_at) VALUES (?, ?, ?, ?)').run(id, req.user.id, title.trim(), created_at);
  const habit=db.prepare('SELECT * FROM habits WHERE id = ?').get(id);
  res.json(habit);
});
router.get('/habits',(req,res)=>{
  const db=req.app.get('db');
  const habits=db.prepare('SELECT * FROM habits WHERE user = ? ORDER BY created_at DESC').all(req.user.id);
  if(habits.length===0) return res.json([]);
  const checkinsByHabit=db.prepare('SELECT habit_id, day FROM checkins WHERE habit_id IN ('+habits.map(()=>'?').join(',')+') ORDER BY day ASC').all(...habits.map(h=>h.id));
  const map=new Map(); for(const h of habits) map.set(h.id,[]);
  for(const row of checkinsByHabit) map.get(row.habit_id).push(row.day);
  const withStreaks=habits.map(h=>({...h, streak: calcStreak(map.get(h.id)||[])}));
  res.json(withStreaks);
});
router.post('/habits/:id/checkin',(req,res)=>{
  const db=req.app.get('db'); const {id}=req.params;
  const habit=db.prepare('SELECT * FROM habits WHERE id = ? AND user = ?').get(id, req.user.id);
  if(!habit) return res.status(404).json({error:'Habit not found'});
  const day=todayISO(); const created_at=Date.now();
  try{
    const cid=uuid();
    db.prepare('INSERT INTO checkins (id, habit_id, day, created_at) VALUES (?, ?, ?, ?)')
      .run(cid, id, day, created_at);
  }catch(e){return res.status(409).json({error:'Already checked in today'})}
  req.io.emit('feed:new',{type:'checkin', username:req.user.username, title:habit.title, day});
  const days=db.prepare('SELECT day FROM checkins WHERE habit_id = ? ORDER BY day ASC').all(id).map(r=>r.day);
  res.json({ok:true, streak: calcStreak(days)});
});
router.get('/leaderboard',(req,res)=>{
  const db=req.app.get('db');
  const users=db.prepare('SELECT id, username FROM users').all();
  const habits=db.prepare('SELECT id, user FROM habits').all();
  const checkins=db.prepare('SELECT habit_id, day FROM checkins ORDER BY day ASC').all();
  const daysByHabit=new Map(); for(const h of habits) daysByHabit.set(h.id,[]);
  for(const c of checkins) if(daysByHabit.has(c.habit_id)) daysByHabit.get(c.habit_id).push(c.day);
  const scoreByUser=new Map(users.map(u=>[u.id,0]));
  for(const h of habits){ const streak=calcStreak(daysByHabit.get(h.id)||[]); scoreByUser.set(h.user,(scoreByUser.get(h.user)||0)+streak); }
  const board=users.map(u=>({username:u.username, score: scoreByUser.get(u.id)||0})).sort((a,b)=>b.score-a.score).slice(0,10);
  res.json(board);
});
export default router;
