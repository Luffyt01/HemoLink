'use client'

import { Loader } from "@googlemaps/js-api-loader"
import { useEffect, useRef, useState } from "react"
import { MapPin, Loader2, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import axios from 'axios'

interface LocationPickerProps {
  onLocationChange: (location: { lat: number; lng: number }) => void
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
  }>(initialLocation || { lat: 0, lng: 0 })
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Initialize map
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: ["places"]
    })

    loader.load().then(() => {
      if (!mapRef.current) return

      const initialCoords = initialLocation || { lat: 37.7749, lng: -122.4194 }
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: initialCoords,
        zoom: 12,
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
          
          mapInstance.setCenter(position)
          mapInstance.setZoom(15)
          markerInstance.setPosition(position)
          setCurrentLocation(position)
          onLocationChange(position)
          setSearchQuery(place.formatted_address || "")
        })
      }

      // Marker drag events
      markerInstance.addListener("dragend", (e: google.maps.MapMouseEvent) => {
        const position = e.latLng?.toJSON()
        if (position) {
          setCurrentLocation(position)
          onLocationChange(position)
        }
      })

      // Map click events
      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        const position = e.latLng?.toJSON()
        if (position) {
          markerInstance.setPosition(position)
          setCurrentLocation(position)
          onLocationChange(position)
        }
      })

      setMap(mapInstance)
      setMarker(markerInstance)
      setIsLoading(false)
    }).catch((err) => {
      console.error("Failed to load Google Maps", err)
      setError("Failed to load map. Please try again later.")
      setIsLoading(false)
    })
  }, [])

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          
          if (map && marker) {
            map.setCenter(pos)
            map.setZoom(14)
            marker.setPosition(pos)
            setCurrentLocation(pos)
            onLocationChange(pos)
          }
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
        
        console.log(position)
        if (map && marker) {
          map.setCenter(position)
          map.setZoom(15)
          marker.setPosition(position)
          setCurrentLocation(position)
          onLocationChange(position)
          setSearchQuery(place.formatted_address || searchQuery)
        }
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
            disabled={isLoading || isSearching}
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
          {searchQuery && (
            <p className="text-gray-600 truncate">{searchQuery}</p>
          )}
        </div>
      </div>
    </div>
  )}