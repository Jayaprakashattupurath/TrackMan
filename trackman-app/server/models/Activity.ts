import { db, generateId, formatDate } from '../database/init'
import { Activity, CreateActivityRequest } from '../types'

export class ActivityModel {
  static async create(userId: string, activityData: CreateActivityRequest): Promise<Activity> {
    const id = generateId()
    
    const activity: Activity = {
      id,
      user_id: userId,
      title: activityData.title,
      description: activityData.description,
      category: activityData.category,
      duration_minutes: activityData.duration_minutes,
      date: activityData.date,
      time_start: activityData.time_start,
      time_end: activityData.time_end,
      location: activityData.location,
      tags: activityData.tags,
      metadata: activityData.metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const stmt = db.prepare(`
      INSERT INTO activities (
        id, user_id, title, description, category, duration_minutes, 
        date, time_start, time_end, location, tags, metadata, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      activity.id,
      activity.user_id,
      activity.title,
      activity.description,
      activity.category,
      activity.duration_minutes,
      activity.date,
      activity.time_start,
      activity.time_end,
      activity.location,
      JSON.stringify(activity.tags),
      JSON.stringify(activity.metadata),
      activity.created_at,
      activity.updated_at
    )

    return activity
  }

  static async findById(id: string): Promise<Activity | null> {
    const stmt = db.prepare('SELECT * FROM activities WHERE id = ?')
    const row = stmt.get(id) as any

    if (!row) return null

    return {
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : undefined,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined
    }
  }

  static async findByUserId(
    userId: string, 
    limit: number = 50, 
    offset: number = 0,
    category?: string,
    startDate?: string,
    endDate?: string
  ): Promise<Activity[]> {
    let query = 'SELECT * FROM activities WHERE user_id = ?'
    const params: any[] = [userId]

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    if (startDate) {
      query += ' AND date >= ?'
      params.push(startDate)
    }

    if (endDate) {
      query += ' AND date <= ?'
      params.push(endDate)
    }

    query += ' ORDER BY date DESC, time_start DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const stmt = db.prepare(query)
    const rows = stmt.all(...params) as any[]

    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : undefined,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined
    }))
  }

  static async update(id: string, updateData: Partial<CreateActivityRequest>): Promise<Activity | null> {
    const activity = await this.findById(id)
    if (!activity) return null

    const updatedActivity = { ...activity, ...updateData, updated_at: new Date().toISOString() }

    const stmt = db.prepare(`
      UPDATE activities 
      SET title = ?, description = ?, category = ?, duration_minutes = ?, 
          date = ?, time_start = ?, time_end = ?, location = ?, 
          tags = ?, metadata = ?, updated_at = ?
      WHERE id = ?
    `)

    stmt.run(
      updatedActivity.title,
      updatedActivity.description,
      updatedActivity.category,
      updatedActivity.duration_minutes,
      updatedActivity.date,
      updatedActivity.time_start,
      updatedActivity.time_end,
      updatedActivity.location,
      JSON.stringify(updatedActivity.tags),
      JSON.stringify(updatedActivity.metadata),
      updatedActivity.updated_at,
      id
    )

    return updatedActivity
  }

  static async delete(id: string): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM activities WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  static async getStats(userId: string, startDate?: string, endDate?: string) {
    let query = `
      SELECT 
        category,
        COUNT(*) as count,
        SUM(duration_minutes) as total_duration,
        AVG(duration_minutes) as avg_duration
      FROM activities 
      WHERE user_id = ?
    `
    const params: any[] = [userId]

    if (startDate) {
      query += ' AND date >= ?'
      params.push(startDate)
    }

    if (endDate) {
      query += ' AND date <= ?'
      params.push(endDate)
    }

    query += ' GROUP BY category ORDER BY count DESC'

    const stmt = db.prepare(query)
    return stmt.all(...params)
  }

  static async getDailyStats(userId: string, days: number = 30) {
    const stmt = db.prepare(`
      SELECT 
        date,
        COUNT(*) as activity_count,
        SUM(duration_minutes) as total_duration
      FROM activities 
      WHERE user_id = ? 
        AND date >= date('now', '-${days} days')
      GROUP BY date 
      ORDER BY date DESC
    `)

    return stmt.all(userId)
  }

  static async getCategories(userId: string): Promise<string[]> {
    const stmt = db.prepare('SELECT DISTINCT category FROM activities WHERE user_id = ? ORDER BY category')
    const rows = stmt.all(userId) as { category: string }[]
    return rows.map(row => row.category)
  }
}
