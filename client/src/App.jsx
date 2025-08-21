import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from './api';
import Header from './components/Header.jsx';
import HabitForm from './components/HabitForm.jsx';
import HabitList from './components/HabitList.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Feed from './components/Feed.jsx';

const SOCKET_URL = (import.meta.env.VITE_API_BASE && 
  import.meta.env.VITE_API_BASE.replace(/https?:\/\//, 'ws://')) || 
  'ws://localhost:4000';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return localStorage.getItem('habitrace:user') || '';
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return '';
    }
  });
  
  const [habits, setHabits] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const socket = useMemo(() => {
    return io(SOCKET_URL, { transports: ['websocket'] });
  }, []);

  useEffect(() => {
    socket.on('feed:new', (event) => {
      setFeed(prevFeed => [event, ...prevFeed].slice(0, 100));
    });

    return () => socket.disconnect();
  }, [socket]);

  useEffect(() => {
    if (!user) return;

    async function loadUserData() {
      setLoading(true);
      setError(null);
      
      try {
        const [habitsData, leaderboardData] = await Promise.all([
          api('/api/habits', { user }),
          api('/api/leaderboard', { user })
        ]);
        
        setHabits(habitsData);
        setLeaderboard(leaderboardData);
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user]);

  async function addHabit(title) {
    try {
      const habit = await api('/api/habits', {
        method: 'POST',
        body: { title },
        user
      });
      
      setHabits(prevHabits => [habit, ...prevHabits]);
    } catch (err) {
      console.error('Failed to add habit:', err);
      setError('Failed to add habit. Please try again.');
    }
  }

  async function checkinHabit(habitId) {
    try {
      const result = await api(`/api/habits/${habitId}/checkin`, {
        method: 'POST',
        user
      });
      
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === habitId
            ? { ...habit, streak: result.streak }
            : habit
        )
      );
      
      const leaderboardData = await api('/api/leaderboard', { user });
      setLeaderboard(leaderboardData);
    } catch (err) {
      console.error('Failed to check in habit:', err);
      setError('Failed to check in. Please try again.');
    }
  }

  function handleSetUser(newUser) {
    setUser(newUser);
    try {
      localStorage.setItem('habitrace:user', newUser);
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ alignItems: 'stretch' }}>
        <div className="grow">
          <div className="card" style={{ marginBottom: 16 }}>
            <Header user={user} onSetUser={handleSetUser} />
          </div>
          
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="h1">Your Habits</div>
            <div className="subtle">Create habits and keep your streak alive.</div>
            
            {error && (
              <div style={{ 
                color: '#ef4444', 
                padding: '8px', 
                marginBottom: '8px',
                background: '#fef2f2',
                borderRadius: '4px'
              }}>
                {error}
              </div>
            )}
            
            {user ? (
              <HabitForm onAdd={addHabit} disabled={loading} />
            ) : (
              <div className="subtle">Enter a username above to begin.</div>
            )}
            
            {loading ? (
              <div className="subtle" style={{ marginTop: 8 }}>Loading...</div>
            ) : (
              <HabitList habits={habits} onCheckin={checkinHabit} />
            )}
          </div>
        </div>
        
        <div className="grow">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="h1">Live Feed</div>
            <div className="subtle" style={{ marginBottom: 8 }}>
              See check-ins in real time.
            </div>
            <Feed items={feed} />
          </div>
          
          <div className="card">
            <div className="h1">Leaderboard</div>
            <div className="subtle" style={{ marginBottom: 8 }}>
              Top users by total current streak.
            </div>
            <Leaderboard board={leaderboard} />
          </div>
        </div>
      </div>
    </div>
  );
}