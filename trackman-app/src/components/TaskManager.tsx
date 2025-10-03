'use client'

import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ClockIcon,
  FlagIcon,
  CalendarIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
]

const statuses = [
  { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-800' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' }
]

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all')
  const [sortBy, setSortBy] = useState<'created' | 'due' | 'priority'>('created')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    due_date: '',
    tags: ''
  })

  // Mock data for now
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Write and submit the quarterly project proposal',
        status: 'in_progress',
        priority: 'high',
        due_date: '2024-01-15',
        tags: ['work', 'project'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Review team feedback',
        description: 'Go through all team feedback and implement changes',
        status: 'todo',
        priority: 'medium',
        due_date: '2024-01-20',
        tags: ['work', 'review'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Update documentation',
        description: 'Update API documentation for new features',
        status: 'completed',
        priority: 'low',
        tags: ['documentation'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    setTasks(mockTasks)
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
      if (editingTask) {
        // Update existing task
        const updatedTask: Task = {
          ...editingTask,
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date || undefined,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined,
          updated_at: new Date().toISOString()
        }

        setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task))
      } else {
        // Add new task
        const newTask: Task = {
          id: Date.now().toString(),
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date || undefined,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        setTasks(prev => [newTask, ...prev])
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        tags: ''
      })
      setEditingTask(null)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || '',
      tags: task.tags ? task.tags.join(', ') : ''
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
        : task
    ))
  }

  const filteredAndSortedTasks = tasks
    .filter(task => filter === 'all' || task.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'due':
          if (!a.due_date && !b.due_date) return 0
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

  const getPriorityColor = (priority: Task['priority']) => {
    return priorities.find(p => p.value === priority)?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: Task['status']) => {
    return statuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800'
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    todo: tasks.filter(t => t.status === 'todo').length
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-blue-600">
              Task Manager
            </h1>
            <p className="text-gray-600">
              Organize and track your tasks efficiently
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-500">{taskStats.total}</p>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">To Do</p>
              <p className="text-2xl font-bold text-gray-500">{taskStats.todo}</p>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-500">{taskStats.inProgress}</p>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-500">{taskStats.completed}</p>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Filter:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Tasks</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="created">Created Date</option>
                  <option value="due">Due Date</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                {filter === 'all' ? 'No tasks created yet. Add your first task to get started!' : `No ${filter.replace('_', ' ')} tasks found.`}
              </p>
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <div key={task.id} className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleStatusChange(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          task.status === 'completed' 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {task.status === 'completed' && <CheckIcon className="w-3 h-3" />}
                      </button>
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-medium text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                            <FlagIcon className="w-3 h-3 mr-1" />
                            {priorities.find(p => p.value === task.priority)?.label}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                            {statuses.find(s => s.value === task.status)?.label}
                          </span>
                        </div>
                        
                        {task.description && (
                          <p className="text-gray-600 text-sm">{task.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
                          </div>
                          {task.due_date && (
                            <div className={`flex items-center gap-1 ${isOverdue(task.due_date) ? 'text-red-600' : ''}`}>
                              <ClockIcon className="w-4 h-4" />
                              <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
                              {isOverdue(task.due_date) && <span className="text-red-600 font-medium">(Overdue)</span>}
                            </div>
                          )}
                        </div>
                        
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <TagIcon className="w-4 h-4 text-gray-400" />
                            {task.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => handleEdit(task)}
                      className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id)}
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

        {/* Add/Edit Task Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => {
                setIsModalOpen(false)
                setEditingTask(null)
              }} />
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingTask ? 'Edit Task' : 'Add New Task'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsModalOpen(false)
                        setEditingTask(null)
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Complete project proposal"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {statuses.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {priorities.map(priority => (
                            <option key={priority.value} value={priority.value}>{priority.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                          name="due_date"
                          type="date"
                          value={formData.due_date}
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
                        placeholder="e.g., work, project, urgent"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false)
                          setEditingTask(null)
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
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