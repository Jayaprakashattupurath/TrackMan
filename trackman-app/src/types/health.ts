export interface HealthDataEntry {
  id: string
  date: string
  weight?: number
  bloodPressure?: string
  heartRate?: number
  temperature?: number
  sleepHours?: number
  waterIntake?: number
  steps?: number
  calories?: number
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface HealthMetrics {
  weight: {
    current: number | null
    target: number | null
    trend: 'up' | 'down' | 'stable'
  }
  bloodPressure: {
    systolic: number | null
    diastolic: number | null
    category: 'normal' | 'elevated' | 'high1' | 'high2' | 'crisis'
  }
  heartRate: {
    resting: number | null
    max: number | null
    zone: 'recovery' | 'aerobic' | 'anaerobic' | 'neuromuscular'
  }
  sleep: {
    average: number | null
    target: number | null
    quality: 'poor' | 'fair' | 'good' | 'excellent'
  }
  hydration: {
    daily: number | null
    target: number | null
    status: 'dehydrated' | 'adequate' | 'optimal'
  }
  activity: {
    steps: number | null
    calories: number | null
    target: number | null
  }
}

export interface HealthGoal {
  id: string
  title: string
  description?: string
  category: 'weight' | 'fitness' | 'nutrition' | 'sleep' | 'general'
  targetValue?: number
  targetDate?: string
  currentValue?: number
  unit?: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface HealthReminder {
  id: string
  title: string
  description?: string
  type: 'medication' | 'measurement' | 'exercise' | 'appointment' | 'custom'
  time: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
  isActive: boolean
  lastTriggered?: string
  createdAt: string
  updatedAt: string
}

export interface HealthChartData {
  date: string
  value: number
  label?: string
}

export interface HealthStats {
  totalEntries: number
  dateRange: {
    start: string
    end: string
  }
  averages: {
    weight?: number
    heartRate?: number
    temperature?: number
    sleepHours?: number
    waterIntake?: number
    steps?: number
    calories?: number
  }
  trends: {
    weight?: 'up' | 'down' | 'stable'
    heartRate?: 'up' | 'down' | 'stable'
    sleep?: 'up' | 'down' | 'stable'
    activity?: 'up' | 'down' | 'stable'
  }
}

export type HealthDataColumn = {
  key: keyof HealthDataEntry
  label: string
  type: 'text' | 'number' | 'date' | 'select'
  width: string
  options?: string[]
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface HealthDataFilters {
  dateRange?: {
    start: string
    end: string
  }
  categories?: string[]
  hasData?: boolean
  search?: string
}

export interface HealthDataSort {
  column: keyof HealthDataEntry
  direction: 'asc' | 'desc'
}
