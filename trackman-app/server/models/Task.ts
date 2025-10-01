import { db, generateId } from '../database/init'
import { Task, CreateTaskRequest } from '../types'

export class TaskModel {
  static async create(userId: string, taskData: CreateTaskRequest): Promise<Task> {
    const id = generateId()
    
    const task: Task = {
      id,
      user_id: userId,
      title: taskData.title,
      description: taskData.description,
      status: 'pending',
      priority: taskData.priority || 'medium',
      due_date: taskData.due_date,
      estimated_duration_minutes: taskData.estimated_duration_minutes,
      category: taskData.category,
      tags: taskData.tags,
      parent_task_id: taskData.parent_task_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const stmt = db.prepare(`
      INSERT INTO tasks (
        id, user_id, title, description, status, priority, due_date, 
        estimated_duration_minutes, category, tags, parent_task_id, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      task.id,
      task.user_id,
      task.title,
      task.description,
      task.status,
      task.priority,
      task.due_date,
      task.estimated_duration_minutes,
      task.category,
      JSON.stringify(task.tags),
      task.parent_task_id,
      task.created_at,
      task.updated_at
    )

    return task
  }

  static async findById(id: string): Promise<Task | null> {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?')
    const row = stmt.get(id) as any

    if (!row) return null

    return {
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : undefined
    }
  }

  static async findByUserId(
    userId: string, 
    limit: number = 50, 
    offset: number = 0,
    status?: string,
    priority?: string,
    category?: string,
    dueDate?: string
  ): Promise<Task[]> {
    let query = 'SELECT * FROM tasks WHERE user_id = ?'
    const params: any[] = [userId]

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    if (priority) {
      query += ' AND priority = ?'
      params.push(priority)
    }

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    if (dueDate) {
      query += ' AND due_date <= ?'
      params.push(dueDate)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const stmt = db.prepare(query)
    const rows = stmt.all(...params) as any[]

    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : undefined
    }))
  }

  static async findSubtasks(parentTaskId: string): Promise<Task[]> {
    const stmt = db.prepare('SELECT * FROM tasks WHERE parent_task_id = ? ORDER BY created_at ASC')
    const rows = stmt.all(parentTaskId) as any[]

    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : undefined
    }))
  }

  static async update(id: string, updateData: Partial<CreateTaskRequest & { status?: string; actual_duration_minutes?: number }>): Promise<Task | null> {
    const task = await this.findById(id)
    if (!task) return null

    const updatedTask = { 
      ...task, 
      ...updateData, 
      updated_at: new Date().toISOString(),
      completed_at: updateData.status === 'completed' ? new Date().toISOString() : task.completed_at
    }

    const stmt = db.prepare(`
      UPDATE tasks 
      SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, 
          estimated_duration_minutes = ?, actual_duration_minutes = ?, 
          category = ?, tags = ?, updated_at = ?, completed_at = ?
      WHERE id = ?
    `)

    stmt.run(
      updatedTask.title,
      updatedTask.description,
      updatedTask.status,
      updatedTask.priority,
      updatedTask.due_date,
      updatedTask.estimated_duration_minutes,
      updatedTask.actual_duration_minutes,
      updatedTask.category,
      JSON.stringify(updatedTask.tags),
      updatedTask.updated_at,
      updatedTask.completed_at,
      id
    )

    return updatedTask
  }

  static async delete(id: string): Promise<boolean> {
    // First delete all subtasks
    const deleteSubtasksStmt = db.prepare('DELETE FROM tasks WHERE parent_task_id = ?')
    deleteSubtasksStmt.run(id)

    // Then delete the main task
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  static async getStats(userId: string) {
    const stats = {
      total: 0,
      pending: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      overdue: 0,
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      }
    }

    // Get counts by status
    const statusStmt = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM tasks 
      WHERE user_id = ? 
      GROUP BY status
    `)
    const statusResults = statusStmt.all(userId) as { status: string; count: number }[]

    statusResults.forEach(result => {
      stats[result.status as keyof typeof stats] = result.count
      stats.total += result.count
    })

    // Get overdue count
    const overdueStmt = db.prepare(`
      SELECT COUNT(*) as count 
      FROM tasks 
      WHERE user_id = ? 
        AND status NOT IN ('completed', 'cancelled') 
        AND due_date < date('now')
    `)
    const overdueResult = overdueStmt.get(userId) as { count: number }
    stats.overdue = overdueResult.count

    // Get counts by priority
    const priorityStmt = db.prepare(`
      SELECT priority, COUNT(*) as count 
      FROM tasks 
      WHERE user_id = ? 
      GROUP BY priority
    `)
    const priorityResults = priorityStmt.all(userId) as { priority: string; count: number }[]

    priorityResults.forEach(result => {
      stats.byPriority[result.priority as keyof typeof stats.byPriority] = result.count
    })

    return stats
  }

  static async getCategories(userId: string): Promise<string[]> {
    const stmt = db.prepare('SELECT DISTINCT category FROM tasks WHERE user_id = ? AND category IS NOT NULL ORDER BY category')
    const rows = stmt.all(userId) as { category: string }[]
    return rows.map(row => row.category)
  }

  static async getOverdueTasks(userId: string): Promise<Task[]> {
    const stmt = db.prepare(`
      SELECT * FROM tasks 
      WHERE user_id = ? 
        AND status NOT IN ('completed', 'cancelled') 
        AND due_date < date('now')
      ORDER BY due_date ASC
    `)
    const rows = stmt.all(userId) as any[]

    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : undefined
    }))
  }
}
