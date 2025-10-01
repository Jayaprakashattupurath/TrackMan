import { Router, Request, Response, NextFunction } from 'express'
import { createError } from '../middleware/errorHandler'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// @desc    Get all health entries for user
// @route   GET /api/health
// @access  Private
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement health entries model and routes
    res.json({
      success: true,
      data: [],
      message: 'Health tracking routes coming soon'
    })
  } catch (error) {
    next(error)
  }
})

export default router
