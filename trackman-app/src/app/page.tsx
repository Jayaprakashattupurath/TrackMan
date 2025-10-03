'use client'

import {
  CalendarIcon,
  ClockIcon,
  StarIcon,
  CogIcon,
  EyeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function Home() {
  const features = [
    {
      icon: CalendarIcon,
      title: 'Daily Activities',
      description: 'Track your daily routines and habits',
      color: 'blue',
    },
    {
      icon: ClockIcon,
      title: 'Time Management',
      description: 'Monitor how you spend your time',
      color: 'green',
    },
    {
      icon: StarIcon,
      title: 'Health & Fitness',
      description: 'Log workouts, diet, and health metrics',
      color: 'purple',
    },
    {
      icon: CogIcon,
      title: 'Work Tracking',
      description: 'Manage tasks and productivity',
      color: 'orange',
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500',
    }
    return colors[color as keyof typeof colors] || 'text-gray-500'
  }

  const getButtonColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 hover:bg-blue-50',
      green: 'text-green-600 hover:bg-green-50',
      purple: 'text-purple-600 hover:bg-purple-50',
      orange: 'text-orange-600 hover:bg-orange-50',
    }
    return colors[color as keyof typeof colors] || 'text-gray-600 hover:bg-gray-50'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-blue-600">
            Take Control of Your Day
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your activities, manage tasks, monitor health, and boost productivity 
            with our comprehensive personal tracking platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <button className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="w-5 h-5 mr-2" />
                Start Tracking
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="inline-flex items-center px-6 py-3 text-lg font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <EyeIcon className="w-5 h-5 mr-2" />
                View Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need to Track</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tracking tools designed to help you understand and improve your daily life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full"
              >
                <div className="space-y-4 h-full flex flex-col">
                  <feature.icon className={`w-8 h-8 ${getColorClasses(feature.color)}`} />
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm flex-1">
                      {feature.description}
                    </p>
                  </div>
                  <Link href={`/${feature.title.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>
                    <button className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${getButtonColorClasses(feature.color)}`}>
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 text-white">
            <h2 className="text-3xl font-bold">Ready to Start Tracking?</h2>
            <p className="text-lg max-w-2xl mx-auto">
              Join thousands of users who are already improving their lives with TrackMan.
            </p>
            <Link href="/dashboard">
              <button className="inline-flex items-center px-6 py-3 text-lg font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                Get Started Today
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}