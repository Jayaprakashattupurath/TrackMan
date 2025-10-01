import { Router, Request, Response, NextFunction } from 'express'
import { ActivityModel } from '../models/Activity'
import { CreateActivityRequest } from '../types'
import { createError } from '../middleware/errorHandler'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// @desc    Get all activities for user
// @route   GET /api/activities
// @access  Private
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { 
      limit = 50, 
      offset = 0, 
      category, 
      startDate, 
      endDate 
    } = req.query

    const activities = await ActivityModel.findByUserId(
      req.user!.id,
      parseInt(limit as string),
      parseInt(offset as string),
      category as string,
      startDate as string,
      endDate as string
    )

    res.json({
      success: true,
      data: activities,
      count: activities.length
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get activity by ID
// @route   GET /api/activities/:id
// @access  Private
router.get('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const activity = await ActivityModel.findById(req.params.id)
    
    if (!activity) {
      return next(createError('Activity not found', 404))
    }

    // Check if activity belongs to user
    if (activity.user_id !== req.user!.id) {
      return next(createError('Not authorized to access this activity', 403))
    }

    res.json({
      success: true,
      data: activity
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const activityData: CreateActivityRequest = req.body

    // Validation
    if (!activityData.title || !activityData.category || !activityData.date) {
      return next(createError('Title, category, and date are required', 400))
    }

    const activity = await ActivityModel.create(req.user!.id, activityData)

    res.status(201).json({
      success: true,
      data: activity,
      message: 'Activity created successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
router.put('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const activity = await ActivityModel.findById(req.params.id)
    
    if (!activity) {
      return next(createError('Activity not found', 404))
    }

    // Check if activity belongs to user
    if (activity.user_id !== req.user!.id) {
      return next(createError('Not authorized to update this activity', 403))
    }

    const updatedActivity = await ActivityModel.update(req.params.id, req.body)
    
    if (!updatedActivity) {
      return next(createError('Failed to update activity', 500))
    }

    res.json({
      success: true,
      data: updatedActivity,
      message: 'Activity updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const activity = await ActivityModel.findById(req.params.id)
    
    if (!activity) {
      return next(createError('Activity not found', 404))
    }

    // Check if activity belongs to user
    if (activity.user_id !== req.user!.id) {
      return next(createError('Not authorized to delete this activity', 403))
    }

    const success = await ActivityModel.delete(req.params.id)
    
    if (!success) {
      return next(createError('Failed to delete activity', 500))
    }

    res.json({
      success: true,
      message: 'Activity deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get activity statistics
// @route   GET /api/activities/stats/overview
// @access  Private
router.get('/stats/overview', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query

    const stats = await ActivityModel.getStats(
      req.user!.id,
      startDate as string,
      endDate as string
    )

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get daily activity statistics
// @route   GET /api/activities/stats/daily
// @access  Private
router.get('/stats/daily', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { days = 30 } = req.query

    const stats = await ActivityModel.getDailyStats(req.user!.id, parseInt(days as string))

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get activity categories
// @route   GET /api/activities/categories
// @access  Private
router.get('/categories', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await ActivityModel.getCategories(req.user!.id)

    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    next(error)
  }
})

export default router
