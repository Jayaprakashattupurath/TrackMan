import { Router, Request, Response, NextFunction } from 'express'
import { UserModel } from '../models/User'
import { createError } from '../middleware/errorHandler'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await UserModel.getStats(req.user!.id)

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
})

export default router
