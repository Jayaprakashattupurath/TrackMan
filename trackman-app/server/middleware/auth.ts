import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
  }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return next(createError('Access denied. No token provided.', 401))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    req.user = decoded
    next()
  } catch (error) {
    next(createError('Invalid token.', 401))
  }
}

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
      req.user = decoded
    } catch (error) {
      // Token is invalid, but we continue without authentication
      console.warn('Invalid token provided for optional auth')
    }
  }

  next()
}
