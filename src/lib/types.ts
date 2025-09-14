/**
 * Type definition for a waste report record
 * Represents data structure stored in Supabase reports table
 */
export interface WasteReport {
  id: string
  latitude: number
  longitude: number
  photo_url: string
  created_at: string
}

/**
 * Type for creating a new waste report
 * Omits auto-generated fields (id, created_at)
 */
export type CreateWasteReport = Omit<WasteReport, 'id' | 'created_at'>

/**
 * Type for geographical coordinates
 * Used for location data and map positioning
 */
export interface Coordinates {
  latitude: number
  longitude: number
}
