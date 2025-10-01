export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  avatar_url?: string
  preferences?: UserPreferences
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  notifications: {
    email: boolean
    push: boolean
    reminders: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private'
    dataSharing: boolean
  }
}

export interface Activity {
  id: string
  user_id: string
  title: string
  description?: string
  category: string
  duration_minutes?: number
  date: string
  time_start?: string
  time_end?: string
  location?: string
  tags?: string[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string
  estimated_duration_minutes?: number
  actual_duration_minutes?: number
  category?: string
  tags?: string[]
  parent_task_id?: string
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface HealthEntry {
  id: string
  user_id: string
  type: 'workout' | 'diet' | 'sleep' | 'mood' | 'weight' | 'measurement' | 'symptom'
  title: string
  description?: string
  date: string
  time?: string
  value?: number
  unit?: string
  category?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface WorkEntry {
  id: string
  user_id: string
  type: 'meeting' | 'project' | 'task' | 'break' | 'learning' | 'other'
  title: string
  description?: string
  date: string
  time_start?: string
  time_end?: string
  duration_minutes?: number
  project_name?: string
  client?: string
  billable: boolean
  hourly_rate?: number
  tags?: string[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  category: string
  target_value?: number
  current_value: number
  unit?: string
  target_date?: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  description?: string
  frequency: string
  target_count: number
  category?: string
  color?: string
  icon?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  user_id: string
  date: string
  count: number
  notes?: string
  created_at: string
}

export interface CreateUserRequest {
  email: string
  name: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  preferences?: Partial<UserPreferences>
}

export interface CreateActivityRequest {
  title: string
  description?: string
  category: string
  duration_minutes?: number
  date: string
  time_start?: string
  time_end?: string
  location?: string
  tags?: string[]
  metadata?: Record<string, any>
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string
  estimated_duration_minutes?: number
  category?: string
  tags?: string[]
  parent_task_id?: string
}

export interface CreateHealthEntryRequest {
  type: 'workout' | 'diet' | 'sleep' | 'mood' | 'weight' | 'measurement' | 'symptom'
  title: string
  description?: string
  date: string
  time?: string
  value?: number
  unit?: string
  category?: string
  metadata?: Record<string, any>
}

export interface CreateWorkEntryRequest {
  type: 'meeting' | 'project' | 'task' | 'break' | 'learning' | 'other'
  title: string
  description?: string
  date: string
  time_start?: string
  time_end?: string
  duration_minutes?: number
  project_name?: string
  client?: string
  billable?: boolean
  hourly_rate?: number
  tags?: string[]
  metadata?: Record<string, any>
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
