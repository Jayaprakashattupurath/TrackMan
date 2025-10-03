import {
  CogIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

export default function WorkPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-blue-600">
              Work & Productivity
            </h1>
            <p className="text-gray-600">
              Track your work hours, projects, and productivity metrics
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className="max-w-2xl mx-auto">
            <div className="p-12 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="space-y-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <CogIcon className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">Work Tracking Coming Soon</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    We're developing comprehensive work and productivity tracking features including:
                  </p>
                </div>
                
                <div className="space-y-3 max-w-md mx-auto text-left">
                  <div className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Time tracking and project logging</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Billable hours and invoicing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Meeting and appointment scheduling</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Productivity analytics and reports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Client and project management</span>
                  </div>
                </div>

                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Get Notified When Available
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}