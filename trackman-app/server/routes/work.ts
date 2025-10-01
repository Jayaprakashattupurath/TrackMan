import { Router, Request, Response, NextFunction } from 'express'
import { createError } from '../middleware/errorHandler'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// @desc    Get all work entries for user
// @route   GET /api/work
// @access  Private
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement work entries model and routes
    res.json({
      success: true,
      data: [],
      message: 'Work tracking routes coming soon'
    })
  } catch (error) {
    next(error)
  }
})

export default router
