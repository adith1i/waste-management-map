import { Coordinates } from '@/lib/types'

/**
 * Gets the user's current location using the browser's geolocation API
 * Requires user permission and HTTPS context
 * @returns Promise<Coordinates> User's current latitude and longitude
 * @throws Error if geolocation is not supported or permission denied
 */
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    // Request current position with high accuracy
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        // Handle different types of geolocation errors
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location access denied by user'))
            break
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable'))
            break
          case error.TIMEOUT:
            reject(new Error('Location request timed out'))
            break
          default:
            reject(new Error('An unknown error occurred while retrieving location'))
            break
        }
      },
      {
        enableHighAccuracy: true, // Request high accuracy GPS
        timeout: 10000, // 10 second timeout
        maximumAge: 300000, // Accept cached location up to 5 minutes old
      }
    )
  })
}
