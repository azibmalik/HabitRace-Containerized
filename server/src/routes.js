import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { calcStreak, todayISO } from './utils.js';

const router = Router();

// User middleware
router.use((req, res, next) => {
  const db = req.app.get('db');
  const username = (req.header('x-user') || '').trim();
  
  if (!username) {
    return res.status(400).json({ error: 'Missing x-user header' });
  }
  
  let user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  
  if (!user) {
    const id = uuid();
    db.prepare('INSERT INTO users (id, username) VALUES (?, ?)').run(id, username);
    user = { id, username };
  }
  
  req.user = user;
  next();
});

// Create habit
router.post('/habits', (req, res) => {
  const db = req.app.get('db');
  const { title } = req.body;
  
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title required' });
  }
  
  const id = uuid();
  const created_at = Date.now();
  
  db.prepare('INSERT INTO habits (id, user, title, created_at) VALUES (?, ?, ?, ?)')
    .run(id, req.user.id, title.trim(), created_at);
  
  const habit = db.prepare('SELECT * FROM habits WHERE id = ?').get(id);
  res.json(habit);
});

// Get habits
router.get('/habits', (req, res) => {
  const db = req.app.get('db');
  const habits = db.prepare('SELECT * FROM habits WHERE user = ? ORDER BY created_at DESC')
    .all(req.user.id);
  
  if (habits.length === 0) {
    return res.json([]);
  }
  
  const placeholders = habits.map(() => '?').join(',');
  const checkinsByHabit = db.prepare(
    `SELECT habit_id, day FROM checkins WHERE habit_id IN (${placeholders}) ORDER BY day ASC`
  ).all(...habits.map(h => h.id));
  
  const checkinsMap = new Map();
  for (const habit of habits) {
    checkinsMap.set(habit.id, []);
  }
  
  for (const row of checkinsByHabit) {
    checkinsMap.get(row.habit_id).push(row.day);
  }
  
  const withStreaks = habits.map(habit => ({
    ...habit,
    streak: calcStreak(checkinsMap.get(habit.id) || [])
  }));
  
  res.json(withStreaks);
});

// Check in habit
router.post('/habits/:id/checkin', (req, res) => {
  const db = req.app.get('db');
  const { id } = req.params;
  
  const habit = db.prepare('SELECT * FROM habits WHERE id = ? AND user = ?')
    .get(id, req.user.id);
  
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }
  
  const day = todayISO();
  const created_at = Date.now();
  
  try {
    const checkinId = uuid();
    db.prepare('INSERT INTO checkins (id, habit_id, day, created_at) VALUES (?, ?, ?, ?)')
      .run(checkinId, id, day, created_at);
  } catch (error) {
    return res.status(409).json({ error: 'Already checked in today' });
  }
  
  req.io.emit('feed:new', {
    type: 'checkin',
    username: req.user.username,
    title: habit.title,
    day
  });
  
  const days = db.prepare('SELECT day FROM checkins WHERE habit_id = ? ORDER BY day ASC')
    .all(id)
    .map(row => row.day);
  
  res.json({ ok: true, streak: calcStreak(days) });
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  const db = req.app.get('db');
  
  const users = db.prepare('SELECT id, username FROM users').all();
  const habits = db.prepare('SELECT id, user FROM habits').all();
  const checkins = db.prepare('SELECT habit_id, day FROM checkins ORDER BY day ASC').all();
  
  const daysByHabit = new Map();
  for (const habit of habits) {
    daysByHabit.set(habit.id, []);
  }
  
  for (const checkin of checkins) {
    if (daysByHabit.has(checkin.habit_id)) {
      daysByHabit.get(checkin.habit_id).push(checkin.day);
    }
  }
  
  const scoreByUser = new Map(users.map(user => [user.id, 0]));
  
  for (const habit of habits) {
    const streak = calcStreak(daysByHabit.get(habit.id) || []);
    const currentScore = scoreByUser.get(habit.user) || 0;
    scoreByUser.set(habit.user, currentScore + streak);
  }
  
  const leaderboard = users
    .map(user => ({
      username: user.username,
      score: scoreByUser.get(user.id) || 0
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  res.json(leaderboard);
});

export default router;