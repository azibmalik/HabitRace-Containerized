export function todayISO() {
    const date = new Date();
    return date.toISOString().slice(0, 10);
  }
  
  export function dateToISO(date) {
    return date.toISOString().slice(0, 10);
  }
  
  export function isoAddDays(isoString, deltaDays) {
    const date = new Date(isoString);
    date.setUTCDate(date.getUTCDate() + deltaDays);
    return dateToISO(date);
  }
  
  export function calcStreak(daysArray) {
    if (!Array.isArray(daysArray) || daysArray.length === 0) {
      return 0;
    }
    
    const uniqueDays = new Set(daysArray);
    let streak = 0;
    let currentDay = todayISO();
    
    while (uniqueDays.has(currentDay)) {
      streak += 1;
      currentDay = isoAddDays(currentDay, -1);
    }
    
    return streak;
  }
  
  export function validateHabitTitle(title) {
    if (!title || typeof title !== 'string') {
      return { valid: false, error: 'Title is required' };
    }
    
    const trimmed = title.trim();
    if (trimmed.length === 0) {
      return { valid: false, error: 'Title cannot be empty' };
    }
    
    if (trimmed.length > 100) {
      return { valid: false, error: 'Title must be less than 100 characters' };
    }
    
    return { valid: true, value: trimmed };
  }
  
  export function validateUsername(username) {
    if (!username || typeof username !== 'string') {
      return { valid: false, error: 'Username is required' };
    }
    
    const trimmed = username.trim();
    if (trimmed.length === 0) {
      return { valid: false, error: 'Username cannot be empty' };
    }
    
    if (trimmed.length > 50) {
      return { valid: false, error: 'Username must be less than 50 characters' };
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
    }
    
    return { valid: true, value: trimmed };
  }