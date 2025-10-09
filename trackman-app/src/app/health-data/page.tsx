'use client'

import {
  PlusIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'
import { useState, useRef, useEffect } from 'react'
import { HealthDataEntry, HealthDataColumn } from '@/types/health'

const columns: HealthDataColumn[] = [
  { key: 'date', label: 'Date', type: 'date', width: 'w-32', required: true },
  { key: 'weight', label: 'Weight (kg)', type: 'number', width: 'w-28', validation: { min: 20, max: 300 } },
  { key: 'bloodPressure', label: 'BP (mmHg)', type: 'text', width: 'w-28' },
  { key: 'heartRate', label: 'HR (bpm)', type: 'number', width: 'w-24', validation: { min: 30, max: 220 } },
  { key: 'temperature', label: 'Temp (°C)', type: 'number', width: 'w-24', validation: { min: 30, max: 45 } },
  { key: 'sleepHours', label: 'Sleep (hrs)', type: 'number', width: 'w-24', validation: { min: 0, max: 24 } },
  { key: 'waterIntake', label: 'Water (L)', type: 'number', width: 'w-24', validation: { min: 0, max: 10 } },
  { key: 'steps', label: 'Steps', type: 'number', width: 'w-24', validation: { min: 0, max: 100000 } },
  { key: 'calories', label: 'Calories', type: 'number', width: 'w-24', validation: { min: 0, max: 10000 } },
  { key: 'notes', label: 'Notes', type: 'text', width: 'w-48' },
]

export default function HealthDataPage() {
  const [healthData, setHealthData] = useState<HealthDataEntry[]>([])
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [isAddingRow, setIsAddingRow] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Date selection states
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1 // 1-12
  
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [yearSearchTerm, setYearSearchTerm] = useState('')
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)
  const [idCounter, setIdCounter] = useState(1000) // Start with a high number to avoid conflicts

  // Helper functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[month - 1]
  }

  const isValidYear = (year: string) => {
    const yearNum = parseInt(year)
    return !isNaN(yearNum) && yearNum >= 1900 && yearNum <= 2100
  }

  const generateYears = () => {
    const years = []
    for (let year = 2020; year <= currentYear + 5; year++) {
      years.push(year)
    }
    return years
  }

  const filteredYears = generateYears().filter(year => 
    year.toString().includes(yearSearchTerm)
  )

  const generateDaysForMonth = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
    const days = []
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    return days
  }

  const generatePrepopulatedData = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
    const prepopulatedData: HealthDataEntry[] = []
    let currentCounter = idCounter
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      prepopulatedData.push({
        id: `health-entry-${currentCounter++}`,
        date: dateString,
      })
    }
    
    // Update the counter for next use
    setIdCounter(currentCounter)
    return prepopulatedData
  }

  // Auto-populate current month on initial load
  useEffect(() => {
    const prepopulatedData = generatePrepopulatedData()
    setHealthData(prepopulatedData)
  }, [])

  const handleCellClick = (rowIndex: number, columnKey: string, currentValue: any) => {
    setEditingCell({ row: rowIndex, col: columnKey })
    setEditingValue(currentValue?.toString() || '')
  }

  const handleCellSave = () => {
    if (!editingCell) return

    const { row, col } = editingCell
    const newValue = editingValue.trim()

    setHealthData(prev => prev.map((item, index) => {
      if (index === row) {
        const updatedItem = { ...item }
        
        // Convert value based on column type
        if (col === 'weight' || col === 'heartRate' || col === 'temperature' || 
            col === 'sleepHours' || col === 'waterIntake' || col === 'steps' || col === 'calories') {
          updatedItem[col as keyof HealthDataEntry] = newValue ? parseFloat(newValue) : undefined
        } else {
          updatedItem[col as keyof HealthDataEntry] = newValue || undefined
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

  const addNewRow = () => {
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    const newRow: HealthDataEntry = {
      id: `health-entry-${idCounter}`,
      date: todayString,
    }
    setIdCounter(prev => prev + 1)
    setHealthData(prev => [...prev, newRow])
    setIsAddingRow(false)
  }

  const populateMonthData = () => {
    const prepopulatedData = generatePrepopulatedData()
    setHealthData(prev => {
      // Filter out existing data for the selected month/year
      const filteredData = prev.filter(item => {
        const itemDate = new Date(item.date)
        const itemYear = itemDate.getFullYear()
        const itemMonth = itemDate.getMonth() + 1
        return !(itemYear === selectedYear && itemMonth === selectedMonth)
      })
      
      // Add new prepopulated data
      return [...filteredData, ...prepopulatedData]
    })
  }

  const deleteSelectedRows = () => {
    setHealthData(prev => prev.filter((_, index) => !selectedRows.has(index)))
    setSelectedRows(new Set())
  }

  const toggleRowSelection = (index: number) => {
    const newSelection = new Set(selectedRows)
    if (newSelection.has(index)) {
      newSelection.delete(index)
    } else {
      newSelection.add(index)
    }
    setSelectedRows(newSelection)
  }

  const selectAllRows = () => {
    if (selectedRows.size === healthData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(healthData.map((_, index) => index)))
    }
  }

  const getCellValue = (item: HealthDataEntry, columnKey: string) => {
    const value = item[columnKey as keyof HealthDataEntry]
    if (value === undefined || value === null) return ''
    return value.toString()
  }

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  // Close year dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.year-dropdown')) {
        setIsYearDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter data for current month/year for statistics
  const getCurrentMonthData = () => {
    return healthData.filter(item => {
      const itemDate = new Date(item.date)
      const itemYear = itemDate.getFullYear()
      const itemMonth = itemDate.getMonth() + 1
      return itemYear === selectedYear && itemMonth === selectedMonth
    })
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                <TableCellsIcon className="w-8 h-8" />
                Health Data Tracker
              </h1>
              <p className="text-gray-600">
                Track your daily health metrics in a spreadsheet-like interface
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Year Dropdown */}
              <div className="relative year-dropdown">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <div className="relative">
                  <input
                    type="text"
                    value={yearSearchTerm}
                    onChange={(e) => {
                      setYearSearchTerm(e.target.value)
                      setIsYearDropdownOpen(true)
                    }}
                    onFocus={() => setIsYearDropdownOpen(true)}
                    placeholder="Search year..."
                    className="w-32 px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <MagnifyingGlassIcon className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                
                {isYearDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredYears.length > 0 ? (
                      filteredYears.map(year => (
                        <button
                          key={year}
                          onClick={() => {
                            setSelectedYear(year)
                            setYearSearchTerm(year.toString())
                            setIsYearDropdownOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                            selectedYear === year ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          {year}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        {isValidYear(yearSearchTerm) ? (
                          <button
                            onClick={() => {
                              setSelectedYear(parseInt(yearSearchTerm))
                              setIsYearDropdownOpen(false)
                            }}
                            className="w-full text-left hover:bg-gray-100"
                          >
                            Use {yearSearchTerm}
                          </button>
                        ) : (
                          'No valid year found'
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Month Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {getMonthName(month)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Populate Month Button */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                <button
                  onClick={populateMonthData}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Populate {getMonthName(selectedMonth)} {selectedYear}
                </button>
              </div>

              <button
                onClick={addNewRow}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Row
              </button>
              {selectedRows.size > 0 && (
                <button
                  onClick={deleteSelectedRows}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete ({selectedRows.size})
                </button>
              )}
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Entries in {getMonthName(selectedMonth)} {selectedYear}</p>
              <p className="text-2xl font-bold text-blue-500">{getCurrentMonthData().length}</p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Avg Weight</p>
              <p className="text-2xl font-bold text-green-500">
                {(() => {
                  const currentData = getCurrentMonthData()
                  const weightData = currentData.filter(item => item.weight)
                  return weightData.length > 0 
                    ? (weightData.reduce((sum, item) => sum + (item.weight || 0), 0) / weightData.length).toFixed(1)
                    : '0'
                })()} kg
              </p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Avg Sleep</p>
              <p className="text-2xl font-bold text-purple-500">
                {(() => {
                  const currentData = getCurrentMonthData()
                  const sleepData = currentData.filter(item => item.sleepHours)
                  return sleepData.length > 0 
                    ? (sleepData.reduce((sum, item) => sum + (item.sleepHours || 0), 0) / sleepData.length).toFixed(1)
                    : '0'
                })()} hrs
              </p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Avg Steps</p>
              <p className="text-2xl font-bold text-orange-500">
                {(() => {
                  const currentData = getCurrentMonthData()
                  const stepsData = currentData.filter(item => item.steps)
                  return stepsData.length > 0 
                    ? Math.round(stepsData.reduce((sum, item) => sum + (item.steps || 0), 0) / stepsData.length)
                    : '0'
                })()}
              </p>
            </div>
          </div>
        </div>

          {/* Spreadsheet Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === healthData.length && healthData.length > 0}
                        onChange={selectAllRows}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    {columns.map((column) => (
                      <th key={column.key} className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${column.width}`}>
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {healthData.map((item, rowIndex) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 ${selectedRows.has(rowIndex) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowIndex)}
                          onChange={() => toggleRowSelection(rowIndex)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      {columns.map((column) => {
                        const isEditing = editingCell?.row === rowIndex && editingCell?.col === column.key
                        const cellValue = getCellValue(item, column.key)
                        
                        return (
                          <td 
                            key={column.key}
                            className={`px-4 py-3 text-sm ${column.width} ${isEditing ? 'p-0' : ''}`}
                          >
                            {isEditing ? (
                              <input
                                ref={inputRef}
                                type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={handleCellSave}
                                onKeyDown={handleKeyDown}
                                className="w-full h-full px-3 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                step={column.type === 'number' ? '0.1' : undefined}
                              />
                            ) : (
                              <div
                                onClick={() => handleCellClick(rowIndex, column.key, item[column.key as keyof HealthDataEntry])}
                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded min-h-[32px] flex items-center"
                              >
                                {cellValue || (
                                  <span className="text-gray-400 italic">
                                    {column.type === 'number' ? '0' : 'Click to edit'}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-2">How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Date Selection</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Select year using the searchable dropdown</li>
                  <li>• Choose month from the month dropdown</li>
                  <li>• Click "Populate Month" to auto-fill all days</li>
                  <li>• Statistics show data for selected month/year</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Data Entry</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click on any cell to edit its value</li>
                  <li>• Press Enter to save or Escape to cancel</li>
                  <li>• Use checkboxes to select rows for bulk operations</li>
                  <li>• Add new rows using the "Add Row" button</li>
                  <li>• Delete selected rows using the "Delete" button</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
