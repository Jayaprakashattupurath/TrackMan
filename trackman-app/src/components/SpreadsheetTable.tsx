'use client'

import { useState, useRef, useEffect } from 'react'

export interface SpreadsheetColumn<T = any> {
  key: keyof T
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox'
  width: string
  options?: string[]
  required?: boolean
  readonly?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface SpreadsheetTableProps<T = any> {
  data: T[]
  columns: SpreadsheetColumn<T>[]
  onDataChange: (data: T[]) => void
  onRowSelect?: (selectedRows: Set<number>) => void
  onRowDelete?: (rowsToDelete: number[]) => void
  enableSelection?: boolean
  enableBulkDelete?: boolean
  className?: string
}

export default function SpreadsheetTable<T extends { id: string }>({
  data,
  columns,
  onDataChange,
  onRowSelect,
  onRowDelete,
  enableSelection = true,
  enableBulkDelete = true,
  className = '',
}: SpreadsheetTableProps<T>) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: keyof T } | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCellClick = (rowIndex: number, columnKey: keyof T, currentValue: any) => {
    const column = columns.find(col => col.key === columnKey)
    if (column?.readonly) return

    setEditingCell({ row: rowIndex, col: columnKey })
    setEditingValue(currentValue?.toString() || '')
  }

  const handleCellSave = () => {
    if (!editingCell) return

    const { row, col } = editingCell
    const newValue = editingValue.trim()
    const column = columns.find(c => c.key === col)

    setData(prev => prev.map((item, index) => {
      if (index === row) {
        const updatedItem = { ...item }
        
        // Convert value based on column type
        if (column?.type === 'number') {
          updatedItem[col as keyof T] = newValue ? parseFloat(newValue) : undefined
        } else if (column?.type === 'checkbox') {
          updatedItem[col as keyof T] = newValue === 'true' as any
        } else {
          updatedItem[col as keyof T] = newValue as any
        }
        
        return updatedItem
      }
      return item
    }))

    setEditingCell(null)
    setEditingValue('')
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setEditingValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellSave()
    } else if (e.key === 'Escape') {
      handleCellCancel()
    }
  }

  const setData = (updater: (prev: T[]) => T[]) => {
    const newData = updater(data)
    onDataChange(newData)
  }

  const toggleRowSelection = (index: number) => {
    const newSelection = new Set(selectedRows)
    if (newSelection.has(index)) {
      newSelection.delete(index)
    } else {
      newSelection.add(index)
    }
    setSelectedRows(newSelection)
    onRowSelect?.(newSelection)
  }

  const selectAllRows = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
      onRowSelect?.(new Set())
    } else {
      const newSelection = new Set(data.map((_, index) => index))
      setSelectedRows(newSelection)
      onRowSelect?.(newSelection)
    }
  }

  const deleteSelectedRows = () => {
    const rowsToDelete = Array.from(selectedRows)
    setData(prev => prev.filter((_, index) => !selectedRows.has(index)))
    setSelectedRows(new Set())
    onRowDelete?.(rowsToDelete)
    onRowSelect?.(new Set())
  }

  const getCellValue = (item: T, columnKey: keyof T) => {
    const value = item[columnKey]
    if (value === undefined || value === null) return ''
    return value.toString()
  }

  const renderCellContent = (item: T, column: SpreadsheetColumn<T>, rowIndex: number) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.col === column.key
    const cellValue = getCellValue(item, column.key)

    if (isEditing) {
      if (column.type === 'select' && column.options) {
        return (
          <select
            ref={inputRef}
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onBlur={handleCellSave}
            onKeyDown={handleKeyDown}
            className="w-full h-full px-3 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            {column.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )
      }

      return (
        <input
          ref={inputRef}
          type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={handleCellSave}
          onKeyDown={handleKeyDown}
          className="w-full h-full px-3 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          step={column.type === 'number' ? '0.1' : undefined}
          min={column.validation?.min}
          max={column.validation?.max}
        />
      )
    }

    if (column.type === 'checkbox') {
      const isChecked = Boolean(item[column.key])
      return (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              setData(prev => prev.map((item, index) => 
                index === rowIndex 
                  ? { ...item, [column.key]: !isChecked }
                  : item
              ))
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      )
    }

    return (
      <div
        onClick={() => handleCellClick(rowIndex, column.key, item[column.key])}
        className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded min-h-[32px] flex items-center ${
          column.readonly ? 'cursor-default hover:bg-transparent' : ''
        }`}
      >
        {cellValue || (
          <span className="text-gray-400 italic">
            {column.type === 'number' ? '0' : column.readonly ? '' : 'Click to edit'}
          </span>
        )}
      </div>
    )
  }

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {enableSelection && (
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={selectAllRows}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th key={String(column.key)} className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${column.width}`}>
                  {column.label}
                  {column.required && <span className="text-red-500 ml-1">*</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, rowIndex) => (
              <tr 
                key={item.id} 
                className={`hover:bg-gray-50 ${selectedRows.has(rowIndex) ? 'bg-blue-50' : ''}`}
              >
                {enableSelection && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(rowIndex)}
                      onChange={() => toggleRowSelection(rowIndex)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => {
                  const isEditing = editingCell?.row === rowIndex && editingCell?.col === column.key
                  
                  return (
                    <td 
                      key={String(column.key)}
                      className={`px-4 py-3 text-sm ${column.width} ${isEditing ? 'p-0' : ''}`}
                    >
                      {renderCellContent(item, column, rowIndex)}
                    </td>
                  )
                })}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td 
                  colSpan={columns.length + (enableSelection ? 1 : 0)} 
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No data available. Add some entries to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {enableBulkDelete && selectedRows.size > 0 && (
        <div className="px-4 py-3 bg-red-50 border-t border-red-200 flex items-center justify-between">
          <span className="text-sm text-red-700">
            {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={deleteSelectedRows}
            className="text-sm text-red-700 hover:text-red-900 font-medium"
          >
            Delete Selected
          </button>
        </div>
      )}
    </div>
  )
}
