'use client'

import Image from 'next/image'
import { WasteReport } from '@/lib/types'

interface ReportModalProps {
  report: WasteReport | null
  isOpen: boolean
  onClose: () => void
}

/**
 * Modal component for displaying detailed waste report information
 * Shows full-size photo, location coordinates, and timestamp
 */
export default function ReportModal({ report, isOpen, onClose }: ReportModalProps) {
  if (!isOpen || !report) return null

  /**
   * Formats timestamp for display
   */
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  /**
   * Formats coordinates for display with proper precision
   */
  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  /**
   * Opens Google Maps with the report location
   */
  const openInMaps = () => {
    const url = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`
    window.open(url, '_blank')
  }

  /**
   * Handles modal backdrop click to close
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Waste Report Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Modal content */}
        <div className="p-4 overflow-y-auto">
          {/* Photo display */}
          <div className="mb-6">
            <Image
              src={report.photo_url}
              alt="Waste report photo"
              width={500}
              height={256}
              className="w-full h-64 object-cover rounded-lg shadow-md"
              onError={(e) => {
                // Handle broken image
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='
              }}
            />
          </div>

          {/* Report information */}
          <div className="space-y-4">
            {/* Timestamp */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                🕐
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Reported On</h3>
                <p className="text-gray-600">{formatTimestamp(report.created_at)}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                📍
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">Location</h3>
                <p className="text-gray-600 font-mono text-sm">
                  {formatCoordinates(report.latitude, report.longitude)}
                </p>
              </div>
            </div>

            {/* Report ID */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                🆔
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Report ID</h3>
                <p className="text-gray-600 font-mono text-sm">{report.id}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button
              onClick={openInMaps}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              🗺️ Open in Maps
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
