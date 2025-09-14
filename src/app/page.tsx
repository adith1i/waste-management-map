'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { WasteReport } from '@/lib/types'
import MapComponent from '@/components/MapComponent'
import UploadComponent from '@/components/UploadComponent'
import ReportModal from '@/components/ReportModal'

/**
 * Main application page for the Waste Management MVP
 * Features:
 * - MapTiler base map with Deck.gl heatmap overlay
 * - Real-time waste report visualization
 * - Photo upload with geolocation capture
 * - Detailed report viewing modal
 */
export default function Home() {
  // State management for application data and UI
  const [reports, setReports] = useState<WasteReport[]>([])
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  /**
   * Fetches all waste reports from Supabase database
   * Called on initial load and after new uploads
   */
  const fetchReports = useCallback(async () => {
    try {
      setError('')
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setReports(data || [])
    } catch (err) {
      console.error('Error fetching reports:', err)
      setError('Failed to load reports')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Sets up real-time subscription to listen for new reports
   * Automatically updates the heatmap when new data arrives
   */
  useEffect(() => {
    // Initial data fetch
    fetchReports()

    // Set up real-time subscription for new reports
    const channel = supabase
      .channel('reports-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reports',
        },
        (payload) => {
          console.log('New report received:', payload.new)
          // Add new report to existing reports
          setReports((currentReports) => [
            payload.new as WasteReport,
            ...currentReports,
          ])
        }
      )
      .subscribe()

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchReports])

  /**
   * Handles successful photo upload
   * Refreshes the reports data to include the new submission
   */
  const handleUploadSuccess = useCallback(() => {
    fetchReports()
  }, [fetchReports])

  /**
   * Handles report selection from heatmap clicks
   * Opens the detailed report modal
   */
  const handleReportClick = useCallback((report: WasteReport) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }, [])

  /**
   * Closes the report detail modal
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedReport(null)
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading waste reports...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchReports}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Main map view with heatmap overlay */}
      <MapComponent
        reports={reports}
        onReportClick={handleReportClick}
      />

      {/* Upload component positioned in the top-right corner */}
      <div className="absolute top-4 right-4 w-80 z-10">
        <UploadComponent onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Report detail modal */}
      <ReportModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Application footer with stats */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
        <div className="text-sm text-gray-600">
          <div className="font-semibold text-gray-800 mb-1">
            Waste Management System
          </div>
          <div className="flex items-center gap-4">
            <span>📊 {reports.length} total reports</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Live updates</span>
          </div>
        </div>
      </div>

      {/* Instructions overlay for first-time users */}
      {reports.length === 0 && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-md text-center shadow-2xl">
            <div className="text-4xl mb-4">🗺️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome to Waste Management
            </h2>
            <p className="text-gray-600 mb-4">
              Report waste issues by uploading a photo. Your location will be captured automatically and displayed on the heat map.
            </p>
            <div className="text-sm text-gray-500">
              📱 Enable location access • 📷 Take a photo • 🗺️ See real-time updates
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
