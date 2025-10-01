import { Router, Request, Response, NextFunction } from 'express'
import { TaskModel } from '../models/Task'
import { CreateTaskRequest } from '../types'
import { createError } from '../middleware/errorHandler'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { 
      limit = 50, 
      offset = 0, 
      status, 
      priority, 
      category,
      dueDate
    } = req.query

    const tasks = await TaskModel.findByUserId(
      req.user!.id,
      parseInt(limit as string),
      parseInt(offset as string),
      status as string,
      priority as string,
      category as string,
      dueDate as string
    )

    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await TaskModel.findById(req.params.id)
    
    if (!task) {
      return next(createError('Task not found', 404))
    }

    // Check if task belongs to user
    if (task.user_id !== req.user!.id) {
      return next(createError('Not authorized to access this task', 403))
    }

    // Get subtasks if any
    const subtasks = await TaskModel.findSubtasks(req.params.id)

    res.json({
      success: true,
      data: {
        ...task,
        subtasks
      }
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const taskData: CreateTaskRequest = req.body

    // Validation
    if (!taskData.title) {
      return next(createError('Title is required', 400))
    }

    // If parent task is specified, verify it exists and belongs to user
    if (taskData.parent_task_id) {
      const parentTask = await TaskModel.findById(taskData.parent_task_id)
      if (!parentTask || parentTask.user_id !== req.user!.id) {
        return next(createError('Parent task not found or not authorized', 400))
      }
    }

    const task = await TaskModel.create(req.user!.id, taskData)

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await TaskModel.findById(req.params.id)
    
    if (!task) {
      return next(createError('Task not found', 404))
    }

    // Check if task belongs to user
    if (task.user_id !== req.user!.id) {
      return next(createError('Not authorized to update this task', 403))
    }

    const updatedTask = await TaskModel.update(req.params.id, req.body)
    
    if (!updatedTask) {
      return next(createError('Failed to update task', 500))
    }

    res.json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await TaskModel.findById(req.params.id)
    
    if (!task) {
      return next(createError('Task not found', 404))
    }

    // Check if task belongs to user
    if (task.user_id !== req.user!.id) {
      return next(createError('Not authorized to delete this task', 403))
    }

    const success = await TaskModel.delete(req.params.id)
    
    if (!success) {
      return next(createError('Failed to delete task', 500))
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Complete task
// @route   PUT /api/tasks/:id/complete
// @access  Private
router.put('/:id/complete', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await TaskModel.findById(req.params.id)
    
    if (!task) {
      return next(createError('Task not found', 404))
    }

    // Check if task belongs to user
    if (task.user_id !== req.user!.id) {
      return next(createError('Not authorized to update this task', 403))
    }

    const { actual_duration_minutes } = req.body

    const updatedTask = await TaskModel.update(req.params.id, {
      status: 'completed',
      actual_duration_minutes
    })
    
    if (!updatedTask) {
      return next(createError('Failed to complete task', 500))
    }

    res.json({
      success: true,
      data: updatedTask,
      message: 'Task completed successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get task statistics
// @route   GET /api/tasks/stats/overview
// @access  Private
router.get('/stats/overview', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await TaskModel.getStats(req.user!.id)

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get overdue tasks
// @route   GET /api/tasks/overdue
// @access  Private
router.get('/overdue', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const overdueTasks = await TaskModel.getOverdueTasks(req.user!.id)

    res.json({
      success: true,
      data: overdueTasks,
      count: overdueTasks.length
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get task categories
// @route   GET /api/tasks/categories
// @access  Private
router.get('/categories', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await TaskModel.getCategories(req.user!.id)

    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    next(error)
  }
})

export default router
