'use client'

import {
  CalendarIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  PlusIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

interface DashboardStats {
  activities: {
    total: number
    today: number
    thisWeek: number
  }
  tasks: {
    total: number
    completed: number
    pending: number
    overdue: number
  }
  health: {
    workouts: number
    meals: number
    sleepHours: number
  }
  work: {
    hoursToday: number
    projects: number
    billableHours: number
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const mockStats: DashboardStats = {
      activities: {
        total: 156,
        today: 8,
        thisWeek: 42
      },
      tasks: {
        total: 23,
        completed: 15,
        pending: 6,
        overdue: 2
      },
      health: {
        workouts: 12,
        meals: 21,
        sleepHours: 7.5
      },
      work: {
        hoursToday: 6.5,
        projects: 3,
        billableHours: 5.5
      }
    }
    
    setTimeout(() => {
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-blue-600">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's your daily overview.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              <PlusIcon className="w-4 h-4 mr-2" />
              Quick Add
            </button>
            <button className="p-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              <EyeIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Activities Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Activities Today</p>
              <CalendarIcon className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-500">{stats?.activities.today || 0}</p>
            <p className="text-sm text-gray-600">
              {stats?.activities.thisWeek || 0} this week
            </p>
          </div>

          {/* Tasks Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Tasks Completed</p>
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">{stats?.tasks.completed || 0}</p>
            <p className="text-sm text-gray-600">
              {stats?.tasks.pending || 0} pending
            </p>
          </div>

          {/* Health Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Workouts</p>
              <StarIcon className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-500">{stats?.health.workouts || 0}</p>
            <p className="text-sm text-gray-600">
              {stats?.health.sleepHours || 0}h sleep
            </p>
          </div>

          {/* Work Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Work Hours</p>
              <ClockIcon className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-500">{stats?.work.hoursToday || 0}h</p>
            <p className="text-sm text-gray-600">
              {stats?.work.billableHours || 0}h billable
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Morning Workout', time: '7:00 AM', category: 'Exercise', duration: '45 min' },
                  { title: 'Team Meeting', time: '10:00 AM', category: 'Work', duration: '1 hour' },
                  { title: 'Lunch Break', time: '12:30 PM', category: 'Personal', duration: '30 min' },
                  { title: 'Project Review', time: '2:00 PM', category: 'Work', duration: '2 hours' },
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">
                        {activity.time} • {activity.category}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                      {activity.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Progress */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Task Progress</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-700">Project Alpha</p>
                    <p className="text-sm font-medium text-gray-900">75%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-700">Website Redesign</p>
                    <p className="text-sm font-medium text-gray-900">45%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-700">Mobile App</p>
                    <p className="text-sm font-medium text-gray-900">90%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="flex items-center justify-start w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Log Activity
                </button>
                <button className="flex items-center justify-start w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Complete Task
                </button>
                <button className="flex items-center justify-start w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <StarIcon className="w-4 h-4 mr-2" />
                  Log Workout
                </button>
                <button className="flex items-center justify-start w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Start Timer
                </button>
              </div>
            </div>

            {/* Alerts & Notifications */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h2>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      2 Overdue Tasks
                    </p>
                    <p className="text-xs text-gray-600">
                      Project deadline approaching
                    </p>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex gap-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Weekly Goal Progress
                    </p>
                    <p className="text-xs text-gray-600">
                      80% of weekly goals completed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Summary */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-700">Water Intake</p>
                  <p className="text-sm font-medium text-gray-900">6/8 glasses</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-sm text-gray-700">Steps Today</p>
                  <p className="text-sm font-medium text-gray-900">8,432 / 10,000</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-sm text-gray-700">Sleep Quality</p>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    Good
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}