import { db, generateId } from '../database/init'
import bcrypt from 'bcryptjs'
import { User, CreateUserRequest, UpdateUserRequest, UserPreferences } from '../types'

export class UserModel {
  static async create(userData: CreateUserRequest): Promise<User> {
    const id = generateId()
    const passwordHash = await bcrypt.hash(userData.password, 12)
    
    const user: User = {
      id,
      email: userData.email,
      name: userData.name,
      password_hash: passwordHash,
      preferences: {
        theme: 'system',
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '24h',
        notifications: {
          email: true,
          push: true,
          reminders: true
        },
        privacy: {
          profileVisibility: 'private',
          dataSharing: false
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const stmt = db.prepare(`
      INSERT INTO users (id, email, name, password_hash, preferences, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      user.id,
      user.email,
      user.name,
      user.password_hash,
      JSON.stringify(user.preferences),
      user.created_at,
      user.updated_at
    )

    return user
  }

  static async findByEmail(email: string): Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
    const row = stmt.get(email) as any

    if (!row) return null

    return {
      ...row,
      preferences: row.preferences ? JSON.parse(row.preferences) : undefined
    }
  }

  static async findById(id: string): Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
    const row = stmt.get(id) as any

    if (!row) return null

    return {
      ...row,
      preferences: row.preferences ? JSON.parse(row.preferences) : undefined
    }
  }

  static async update(id: string, updateData: UpdateUserRequest): Promise<User | null> {
    const user = await this.findById(id)
    if (!user) return null

    const updatedUser = { ...user, ...updateData, updated_at: new Date().toISOString() }

    const stmt = db.prepare(`
      UPDATE users 
      SET name = ?, email = ?, preferences = ?, updated_at = ?
      WHERE id = ?
    `)

    stmt.run(
      updatedUser.name,
      updatedUser.email,
      JSON.stringify(updatedUser.preferences),
      updatedUser.updated_at,
      id
    )

    return updatedUser
  }

  static async delete(id: string): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  static async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password_hash)
  }

  static async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const passwordHash = await bcrypt.hash(newPassword, 12)
    const stmt = db.prepare(`
      UPDATE users 
      SET password_hash = ?, updated_at = ?
      WHERE id = ?
    `)

    const result = stmt.run(passwordHash, new Date().toISOString(), id)
    return result.changes > 0
  }

  static async getStats(userId: string) {
    const stats = {
      totalActivities: 0,
      totalTasks: 0,
      totalHealthEntries: 0,
      totalWorkEntries: 0,
      completedTasks: 0,
      activeHabits: 0
    }

    // Get activity count
    const activityStmt = db.prepare('SELECT COUNT(*) as count FROM activities WHERE user_id = ?')
    const activityResult = activityStmt.get(userId) as { count: number }
    stats.totalActivities = activityResult.count

    // Get task counts
    const taskStmt = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?')
    const taskResult = taskStmt.get(userId) as { count: number }
    stats.totalTasks = taskResult.count

    const completedTaskStmt = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = "completed"')
    const completedTaskResult = completedTaskStmt.get(userId) as { count: number }
    stats.completedTasks = completedTaskResult.count

    // Get health entry count
    const healthStmt = db.prepare('SELECT COUNT(*) as count FROM health_entries WHERE user_id = ?')
    const healthResult = healthStmt.get(userId) as { count: number }
    stats.totalHealthEntries = healthResult.count

    // Get work entry count
    const workStmt = db.prepare('SELECT COUNT(*) as count FROM work_entries WHERE user_id = ?')
    const workResult = workStmt.get(userId) as { count: number }
    stats.totalWorkEntries = workResult.count

    // Get active habits count
    const habitsStmt = db.prepare('SELECT COUNT(*) as count FROM habits WHERE user_id = ? AND is_active = 1')
    const habitsResult = habitsStmt.get(userId) as { count: number }
    stats.activeHabits = habitsResult.count

    return stats
  }
}
