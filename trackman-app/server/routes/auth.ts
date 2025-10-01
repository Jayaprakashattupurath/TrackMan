import { Router, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/User'
import { CreateUserRequest, LoginRequest } from '../types'
import { createError } from '../middleware/errorHandler'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// Generate JWT token
const generateToken = (userId: string, email: string, name: string) => {
  return jwt.sign(
    { id: userId, email, name },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password }: CreateUserRequest = req.body

    // Validation
    if (!email || !name || !password) {
      return next(createError('Please provide email, name, and password', 400))
    }

    if (password.length < 6) {
      return next(createError('Password must be at least 6 characters', 400))
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email)
    if (existingUser) {
      return next(createError('User already exists with this email', 400))
    }

    // Create user
    const user = await UserModel.create({ email, name, password })
    
    // Generate token
    const token = generateToken(user.id, user.email, user.name)

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'User registered successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: LoginRequest = req.body

    // Validation
    if (!email || !password) {
      return next(createError('Please provide email and password', 400))
    }

    // Find user
    const user = await UserModel.findByEmail(email)
    if (!user) {
      return next(createError('Invalid credentials', 401))
    }

    // Validate password
    const isValidPassword = await UserModel.validatePassword(user, password)
    if (!isValidPassword) {
      return next(createError('Invalid credentials', 401))
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.name)

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login successful'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.user!.id)
    if (!user) {
      return next(createError('User not found', 404))
    }

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user

    res.json({
      success: true,
      data: userWithoutPassword
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, preferences } = req.body

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user!.email) {
      const existingUser = await UserModel.findByEmail(email)
      if (existingUser) {
        return next(createError('Email already in use', 400))
      }
    }

    const updatedUser = await UserModel.update(req.user!.id, { name, email, preferences })
    if (!updatedUser) {
      return next(createError('User not found', 404))
    }

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = updatedUser

    res.json({
      success: true,
      data: userWithoutPassword,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validation
    if (!currentPassword || !newPassword) {
      return next(createError('Please provide current and new password', 400))
    }

    if (newPassword.length < 6) {
      return next(createError('New password must be at least 6 characters', 400))
    }

    // Get user
    const user = await UserModel.findById(req.user!.id)
    if (!user) {
      return next(createError('User not found', 404))
    }

    // Validate current password
    const isValidPassword = await UserModel.validatePassword(user, currentPassword)
    if (!isValidPassword) {
      return next(createError('Current password is incorrect', 400))
    }

    // Update password
    const success = await UserModel.updatePassword(req.user!.id, newPassword)
    if (!success) {
      return next(createError('Failed to update password', 500))
    }

    res.json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
router.delete('/account', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body

    // Validation
    if (!password) {
      return next(createError('Please provide your password to delete account', 400))
    }

    // Get user
    const user = await UserModel.findById(req.user!.id)
    if (!user) {
      return next(createError('User not found', 404))
    }

    // Validate password
    const isValidPassword = await UserModel.validatePassword(user, password)
    if (!isValidPassword) {
      return next(createError('Password is incorrect', 400))
    }

    // Delete user (this will cascade delete all related data)
    const success = await UserModel.delete(req.user!.id)
    if (!success) {
      return next(createError('Failed to delete account', 500))
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

export default router
