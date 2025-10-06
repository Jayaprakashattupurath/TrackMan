'use client'

import {
  CalendarIcon,
  ClockIcon,
  StarIcon,
  CogIcon,
  EyeIcon,
  Bars3Icon,
  XMarkIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: EyeIcon },
  { name: 'Activities', href: '/activities', icon: CalendarIcon },
  { name: 'Tasks', href: '/tasks', icon: ClockIcon },
  { name: 'Health', href: '/health', icon: StarIcon },
  { name: 'Health Data', href: '/health-data', icon: TableCellsIcon },
  { name: 'Work', href: '/work', icon: CogIcon },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const NavLink = ({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = pathname === item.href
    const Icon = item.icon
    
    return (
      <Link href={item.href}>
        <button
          className={cn(
            'flex items-center justify-start w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
            isActive
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <Icon className="w-4 h-4 mr-2" />
          {item.name}
        </button>
      </Link>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="hover:no-underline">
            <h1 className="text-lg font-semibold text-blue-600">
              TrackMan
            </h1>
          </Link>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-700 hover:text-gray-900">
              Profile
            </button>
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={onOpen}
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-blue-600">TrackMan</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.name} onClick={onClose}>
                    <NavLink item={item} />
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <button className="flex items-center justify-start w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                    Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}