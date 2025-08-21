import Database from 'better-sqlite3';
export function initDB(filePath = 'habitrace.db') {
  const db = new Database(filePath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL);
    CREATE TABLE IF NOT EXISTS habits (id TEXT PRIMARY KEY, user TEXT NOT NULL, title TEXT NOT NULL, created_at INTEGER NOT NULL, FOREIGN KEY(user) REFERENCES users(id));
    CREATE TABLE IF NOT EXISTS checkins (id TEXT PRIMARY KEY, habit_id TEXT NOT NULL, day TEXT NOT NULL, created_at INTEGER NOT NULL, UNIQUE(habit_id, day), FOREIGN KEY(habit_id) REFERENCES habits(id));
  `);
  return db;
}
