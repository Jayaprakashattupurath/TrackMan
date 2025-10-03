'use client'

import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

interface Activity {
  id: string
  title: string
  description?: string
  category: string
  duration_minutes?: number
  date: string
  time_start?: string
  time_end?: string
  location?: string
  tags?: string[]
  created_at: string
}

const categories = [
  'Work',
  'Exercise',
  'Personal',
  'Learning',
  'Social',
  'Health',
  'Hobbies',
  'Travel',
  'Other'
]

export default function ActivityTracker() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration_minutes: '',
    date: new Date().toISOString().split('T')[0],
    time_start: '',
    time_end: '',
    location: '',
    tags: ''
  })

  // Mock data for now
  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        title: 'Morning Workout',
        description: 'Cardio and strength training',
        category: 'Exercise',
        duration_minutes: 45,
        date: new Date().toISOString().split('T')[0],
        time_start: '07:00',
        time_end: '07:45',
        location: 'Home Gym',
        tags: ['cardio', 'strength'],
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Team Meeting',
        description: 'Weekly project review',
        category: 'Work',
        duration_minutes: 60,
        date: new Date().toISOString().split('T')[0],
        time_start: '10:00',
        time_end: '11:00',
        location: 'Conference Room',
        tags: ['meeting', 'project'],
        created_at: new Date().toISOString()
      }
    ]
    setActivities(mockActivities)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newActivity: Activity = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : undefined,
        date: formData.date,
        time_start: formData.time_start || undefined,
        time_end: formData.time_end || undefined,
        location: formData.location,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined,
        created_at: new Date().toISOString()
      }

      setActivities(prev => [newActivity, ...prev])
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        duration_minutes: '',
        date: new Date().toISOString().split('T')[0],
        time_start: '',
        time_end: '',
        location: '',
        tags: ''
      })
      
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id))
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Work': 'bg-blue-100 text-blue-800',
      'Exercise': 'bg-green-100 text-green-800',
      'Personal': 'bg-purple-100 text-purple-800',
      'Learning': 'bg-orange-100 text-orange-800',
      'Social': 'bg-pink-100 text-pink-800',
      'Health': 'bg-red-100 text-red-800',
      'Hobbies': 'bg-yellow-100 text-yellow-800',
      'Travel': 'bg-cyan-100 text-cyan-800',
      'Other': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-blue-600">
              Activity Tracker
            </h1>
            <p className="text-gray-600">
              Track your daily activities and routines
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Activity
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Today's Activities</p>
              <p className="text-2xl font-bold text-blue-500">
                {activities.filter(a => a.date === new Date().toISOString().split('T')[0]).length}
              </p>
              <p className="text-sm text-gray-600">
                {activities
                  .filter(a => a.date === new Date().toISOString().split('T')[0])
                  .reduce((sum, a) => sum + (a.duration_minutes || 0), 0)} minutes
              </p>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-green-500">
                {activities.length}
              </p>
              <p className="text-sm text-gray-600">
                {activities.reduce((sum, a) => sum + (a.duration_minutes || 0), 0)} minutes
              </p>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-purple-500">
                {new Set(activities.map(a => a.category)).size}
              </p>
              <p className="text-sm text-gray-600">
                Different types
              </p>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No activities recorded yet. Add your first activity to get started!
              </p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg text-gray-900">{activity.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(activity.category)}`}>
                          {activity.category}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-gray-600 text-sm">{activity.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                        {activity.time_start && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{activity.time_start}</span>
                          </div>
                        )}
                        {activity.duration_minutes && (
                          <span>{formatDuration(activity.duration_minutes)}</span>
                        )}
                        {activity.location && (
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{activity.location}</span>
                          </div>
                        )}
                      </div>
                      {activity.tags && activity.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          {activity.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(activity.id)}
                        className="p-2 text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Activity Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsModalOpen(false)} />
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Add New Activity</h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Activity Title</label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Morning Workout"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Optional description..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                        <input
                          name="duration_minutes"
                          type="number"
                          value={formData.duration_minutes}
                          onChange={handleInputChange}
                          placeholder="45"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="e.g., Home, Office"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          name="time_start"
                          type="time"
                          value={formData.time_start}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          name="time_end"
                          type="time"
                          value={formData.time_end}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                      <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="e.g., cardio, strength, morning"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? 'Adding...' : 'Add Activity'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}