'use client'

import { useEffect, useState, useCallback } from 'react'
import { Map } from 'react-map-gl/maplibre'
import { DeckGL } from '@deck.gl/react'
import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import { WasteReport } from '@/lib/types'
import { supabase } from '@/lib/supabase'

// MapTiler style URL with API key from environment variables
const MAPTILER_STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`

// Initial map view centered on a default location (India - Chennai area based on the MapTiler URL)
const INITIAL_VIEW_STATE = {
  longitude: 80.45559,
  latitude: 16.29044,
  zoom: 14,
}

interface MapComponentProps {
  reports: WasteReport[]
  onReportClick?: (report: WasteReport) => void
}

/**
 * Main map component that displays MapTiler base map with Deck.gl heatmap overlay
 * Shows waste reports as heat density visualization
 */
export default function MapComponent({ reports, onReportClick }: MapComponentProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)

  // Create heatmap layer from waste reports data
  const layers = [
    new HeatmapLayer({
      id: 'waste-heatmap',
      data: reports,
      getPosition: (d: WasteReport) => [d.longitude, d.latitude],
      getWeight: () => 1, // Each report has equal weight
      radiusPixels: 25, // Heat circle radius in pixels
      intensity: 2, // Increase intensity for better visibility
      threshold: 0.05, // Threshold for fading effect
      colorRange: [
        [255, 255, 204], // Light yellow
        [255, 237, 160], // Yellow
        [254, 217, 118], // Orange-yellow
        [254, 178, 76],  // Orange
        [253, 141, 60],  // Red-orange
        [252, 78, 42],   // Red
        [227, 26, 28],   // Dark red
        [177, 0, 38],    // Very dark red
      ],
      aggregation: 'SUM',
      pickable: true,
      onClick: (info: any) => {
        // Handle click events on heatmap
        if (info.object && onReportClick) {
          onReportClick(info.object)
        }
      },
    }),
  ]

  return (
    <div className="w-full h-full relative">
      {/* Deck.gl overlay with heatmap layer */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        layers={layers}
        controller={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* MapTiler base map */}
        <Map
          mapStyle={MAPTILER_STYLE}
          style={{ width: '100%', height: '100%' }}
        />
      </DeckGL>

      {/* Map controls overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Waste Reports
        </h2>
        <p className="text-sm text-gray-600">
          {reports.length} reports • Heat intensity shows problem areas
        </p>
      </div>
    </div>
  )
}
