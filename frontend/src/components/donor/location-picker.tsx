'use client'

import { Loader } from "@googlemaps/js-api-loader"
import { useEffect, useRef, useState } from "react"
import { MapPin, Loader2, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import axios from 'axios'

interface LocationPickerProps {
  onLocationChange: (location: { lat: number; lng: number ,address?: string}) => void
  initialLocation?: { lat: number; lng: number }
}

export default function LocationPicker({ 
  onLocationChange, 
  initialLocation 
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number
    lng: number
  }>(initialLocation || { lat: 20.5937, lng: 78.9629 }) // Default to India coordinates
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("India")
  const [isSearching, setIsSearching] = useState(false)
  const [locationAddress, setLocationAddress] = useState("India")

  // Initialize map and set default location (India)
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: ["places"]
    })

    const initializeMap = async () => {
      try {
        await loader.load()
        if (!mapRef.current) return

        // Set initial coordinates to India if no initialLocation provided
        const initialCoords = initialLocation || { lat: 20.5937, lng: 78.9629 }
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: initialCoords,
          zoom: 5, // Zoom out to show more of India
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        })

        const markerInstance = new google.maps.Marker({
          position: initialCoords,
          map: mapInstance,
          draggable: true,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="36px" height="36px">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>`
            )}`,
            scaledSize: new google.maps.Size(36, 36),
            anchor: new google.maps.Point(18, 36)
          }
        })

        // Initialize Autocomplete
        if (searchInputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(
            searchInputRef.current,
            {
              types: ['geocode'],
              fields: ['geometry', 'name', 'formatted_address']
            }
          )
          
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()
            if (!place.geometry?.location) {
              setError("No details available for this location")
              return
            }
            
            const position = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
            
            updateLocation(position, place.formatted_address || "")
          })
        }

        // Marker drag events
        markerInstance.addListener("dragend", (e: google.maps.MapMouseEvent) => {
          const position = e.latLng?.toJSON()
          if (position) {
            updateLocation(position)
          }
        })

        // Map click events
        mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
          const position = e.latLng?.toJSON()
          if (position) {
            markerInstance.setPosition(position)
            updateLocation(position)
          }
        })

        setMap(mapInstance)
        setMarker(markerInstance)
        
        // Get address for initial location
        if (!initialLocation) {
          await reverseGeocode(initialCoords)
        } else if (initialLocation) {
          await reverseGeocode(initialLocation)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Failed to load Google Maps", err)
        setError("Failed to load map. Please try again later.")
        setIsLoading(false)
      }
    }

    initializeMap()
  }, [])

  // Update all location-related state and UI elements
  const updateLocation = async (position: { lat: number; lng: number }, address?: string) => {
    if (map && marker) {
      map.setCenter(position)
      map.setZoom(13)
      marker.setPosition(position)
    }
    
    setCurrentLocation(position)
    onLocationChange(position)
    
    // If address is provided (from autocomplete), use it, otherwise reverse geocode
    if (address) {
      setLocationAddress(address)
      setSearchQuery(address)
    } else {
      // await reverseGeocode(position)
      await fetchAddress(position.lat,position.lng)
    }
  }

  const reverseGeocode = async (position: { lat: number; lng: number }) => {
    try {
      const geocoder = new google.maps.Geocoder()
      const response = await geocoder.geocode({ location: position })
      
      if (response.results && response.results.length > 0) {
        const address = response.results[0].formatted_address
        setLocationAddress(address)
        setSearchQuery(address)
      } else {
        setLocationAddress("Address not found")
        setSearchQuery("")
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error)
      // setLocationAddress("")
      // setSearchQuery("")
    }
  }
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const options = {
        method: 'GET',
        url: 'https://google-map-places.p.rapidapi.com/maps/api/geocode/json',
        params: {
          latlng: `${lat},${lng}`,
          language: 'en'
        },
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'x-rapidapi-host': 'google-map-places.p.rapidapi.com'
        }
      }

      const response = await axios.request(options)
      if (response.data.status === 'OK' && response.data.results?.[0]) {
        setLocationAddress(response.data.results[0].formatted_address)
        setSearchQuery(response.data.results[0].formatted_address)
      }
    } catch (err) {
      console.error("Reverse geocoding failed:", err)
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          await updateLocation(pos)
          onLocationChange({ ...pos, locationAddress })
          setIsLoading(false)
        },
        (error) => {
          setError("Unable to retrieve your location. Please enable location services.")
          setIsLoading(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser.")
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setError(null)
    
    try {
      const options = {
        method: 'GET',
        url: 'https://google-map-places.p.rapidapi.com/maps/api/place/findplacefromtext/json',
        params: {
          input: searchQuery,
          inputtype: 'textquery',
          fields: 'formatted_address,name,geometry',
          language: 'en'
        },
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'x-rapidapi-host': 'google-map-places.p.rapidapi.com'
        }
      }

      const response = await axios.request(options)
      
      if (response.data.status === 'OK' && response.data.candidates?.length > 0) {
        const place = response.data.candidates[0]
        const position = {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        }
        if (map) {
          map.setZoom(13) // Ensure zoom level is set when searching
        }
        
        await updateLocation(position, place.formatted_address || searchQuery)
      } else {
        setError("Location not found. Please try a different search.")
      }
    } catch (error) {
      console.error("Search error:", error)
      setError("Failed to search location. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative mb-4">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-20"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSearch}
            disabled={isLoading || isSearching || !searchQuery.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>
        
        <div className="relative h-[300px] w-full rounded-lg overflow-hidden border border-gray-200">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10 p-4">
              <p className="text-red-500 text-center">{error}</p>
            </div>
          )}
          
          <div 
            ref={mapRef} 
            className="h-full w-full"
            style={{ display: isLoading || error ? 'none' : 'block' }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          {isLoading ? "Detecting..." : "Use My Current Location"}
        </Button>

        <div className="flex-1 bg-gray-50 px-4 py-2 rounded-md text-sm">
          <p className="font-medium text-gray-700">Selected Location:</p>
          <p className="text-gray-600">
            {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
          </p>
          {locationAddress && (
            <p className="text-gray-600 truncate overflow-hidden text-clip text-pretty">{locationAddress}</p>
          )}
        </div>
      </div>
    </div>
  )
}