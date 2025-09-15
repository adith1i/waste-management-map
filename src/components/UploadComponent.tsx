'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { getCurrentLocation } from '@/utils/geolocation'
import { CreateWasteReport } from '@/lib/types'

interface UploadComponentProps {
  onUploadSuccess: () => void
}

/**
 * Component for uploading waste report photos with automatic location capture
 * Handles photo selection, location detection, and data submission to Supabase
 */
export default function UploadComponent({ onUploadSuccess }: UploadComponentProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Handles file selection and creates preview
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type (only images)
      if (!file.type.startsWith('image/')) {
        setUploadStatus('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus('File size must be less than 5MB')
        return
      }

      setSelectedFile(file)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setUploadStatus('')
    }
  }

  /**
   * Handles the complete upload process: location capture, photo upload, and data submission
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a photo first')
      return
    }

    setIsUploading(true)
    setUploadStatus('Getting your location...')

    try {
      // Step 1: Get current location
      const location = await getCurrentLocation()
      setUploadStatus('Uploading photo...')

      // Step 2: Upload photo to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `photos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('waste-photos')
        .upload(filePath, selectedFile)

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Step 3: Get public URL for the uploaded photo
      const { data: urlData } = supabase.storage
        .from('waste-photos')
        .getPublicUrl(filePath)

      setUploadStatus('Saving report...')

      // Step 4: Save report data to database
      const reportData: CreateWasteReport = {
        latitude: location.latitude,
        longitude: location.longitude,
        photo_url: urlData.publicUrl,
      }

      const { error: dbError } = await supabase
        .from('reports')
        .insert([reportData])

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      // Success! Clear form and notify parent
      setUploadStatus('Report submitted successfully!')
      setSelectedFile(null)
      setPreviewUrl('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Notify parent component to refresh data
      onUploadSuccess()

      // Clear success message after 3 seconds
      setTimeout(() => setUploadStatus(''), 3000)

    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * Clears selected file and preview
   */
  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setUploadStatus('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Report Waste Issue
      </h3>

      {/* File input */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="photo-upload"
          className="block w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-400 transition-colors"
        >
          {selectedFile ? (
            <span className="text-green-600">📷 {selectedFile.name}</span>
          ) : (
            <span className="text-gray-600">📷 Click to select photo</span>
          )}
        </label>
      </div>

      {/* Photo preview */}
      {previewUrl && (
        <div className="mb-4">
          <Image
            src={previewUrl}
            alt="Preview"
            width={300}
            height={128}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {isUploading ? '⏳ Uploading...' : '📍 Submit Report'}
        </button>

        {selectedFile && (
          <button
            onClick={clearSelection}
            disabled={isUploading}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status message */}
      {uploadStatus && (
        <div className={`text-sm p-2 rounded ${
          uploadStatus.includes('success')
            ? 'bg-green-100 text-green-700'
            : uploadStatus.includes('error') || uploadStatus.includes('failed')
            ? 'bg-red-100 text-red-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {uploadStatus}
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-500 mt-2">
        📱 Location access required • 🖼️ Max 5MB image files
      </div>
    </div>
  )
}
