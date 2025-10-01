import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { createError } from '../middleware/errorHandler'

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'trackman.db')
const dbDir = path.dirname(dbPath)

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

export const db = new Database(dbPath)

export const initializeDatabase = async () => {
  try {
    // Enable foreign keys
    db.pragma('foreign_keys = ON')

    // Create tables
    createTables()
    
    // Create indexes
    createIndexes()
    
    console.log('📊 Database initialized successfully')
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw createError('Database initialization failed', 500)
  }
}

const createTables = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      preferences TEXT, -- JSON string for user preferences
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Activities table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      duration_minutes INTEGER,
      date DATE NOT NULL,
      time_start TIME,
      time_end TIME,
      location TEXT,
      tags TEXT, -- JSON array of tags
      metadata TEXT, -- JSON for additional data
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `)

  // Tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      due_date DATE,
      estimated_duration_minutes INTEGER,
      actual_duration_minutes INTEGER,
      category TEXT,
      tags TEXT, -- JSON array of tags
      parent_task_id TEXT, -- For subtasks
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (parent_task_id) REFERENCES tasks (id) ON DELETE CASCADE
    )
  `)

  // Health entries table
  db.exec(`
    CREATE TABLE IF NOT EXISTS health_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('workout', 'diet', 'sleep', 'mood', 'weight', 'measurement', 'symptom')),
      title TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      time TIME,
      value REAL, -- For numeric values like weight, duration, etc.
      unit TEXT, -- For units like kg, minutes, etc.
      category TEXT, -- For subcategories like cardio, strength, etc.
      metadata TEXT, -- JSON for additional data
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `)

  // Work entries table
  db.exec(`
    CREATE TABLE IF NOT EXISTS work_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('meeting', 'project', 'task', 'break', 'learning', 'other')),
      title TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      time_start TIME,
      time_end TIME,
      duration_minutes INTEGER,
      project_name TEXT,
      client TEXT,
      billable BOOLEAN DEFAULT FALSE,
      hourly_rate REAL,
      tags TEXT, -- JSON array of tags
      metadata TEXT, -- JSON for additional data
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `)

  // Goals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      target_value REAL,
      current_value REAL DEFAULT 0,
      unit TEXT,
      target_date DATE,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `)

  // Habits table
  db.exec(`
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      frequency TEXT NOT NULL, -- daily, weekly, monthly
      target_count INTEGER DEFAULT 1,
      category TEXT,
      color TEXT,
      icon TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `)

  // Habit completions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS habit_completions (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      date DATE NOT NULL,
      count INTEGER DEFAULT 1,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(habit_id, date)
    )
  `)
}

const createIndexes = () => {
  // Users indexes
  db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)')
  
  // Activities indexes
  db.exec('CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities (user_id)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_activities_date ON activities (date)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_activities_category ON activities (category)')
  
  // Tasks indexes
  db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks (user_id)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks (due_date)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks (parent_task_id)')
  
  // Health entries indexes
  db.exec('CREATE INDEX IF NOT EXISTS idx_health_user_id ON health_entries (user_id)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_health_date ON health_entries (date)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_health_type ON health_entries (type)')
  
  // Work entries indexes
  db.exec('CREATE INDEX IF NOT EXISTS idx_work_user_id ON work_entries (user_id)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_work_date ON work_entries (date)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_work_type ON work_entries (type)')
  
  // Goals indexes
  db.exec('CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals (user_id)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_goals_category ON goals (category)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_goals_status ON goals (status)')
  
  // Habits indexes
  db.exec('CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits (user_id)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_habits_active ON habits (is_active)')
  
  // Habit completions indexes
  db.exec('CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions (habit_id)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions (date)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON habit_completions (user_id)')
}

// Helper function to generate UUID
export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Helper function to format date for SQLite
export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

// Helper function to format time for SQLite
export const formatTime = (date: Date) => {
  return date.toTimeString().split(' ')[0].substring(0, 5)
}
