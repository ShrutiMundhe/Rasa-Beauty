import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './CitySelect.css'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fix leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom terracotta marker
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

function LocationPicker({ onLocationPick }) {
  useMapEvents({
    click(e) {
      onLocationPick(e.latlng)
    }
  })
  return null
}

function CitySelect() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const [markerPos, setMarkerPos] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [detecting, setDetecting] = useState(false)
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]) // India center
  const [mapZoom, setMapZoom] = useState(5)
  const [mapKey, setMapKey] = useState(0)

  // Search cities using OpenStreetMap Nominatim API
  const searchCities = async (query) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}+india&format=json&limit=8&addressdetails=1`
      )
      const data = await res.json()
      const cities = data.filter(item =>
        item.type === 'city' ||
        item.type === 'town' ||
        item.type === 'village' ||
        item.class === 'place'
      ).map(item => ({
        name: item.display_name.split(',')[0],
        fullName: item.display_name,
        state: item.address?.state || '',
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }))
      setSearchResults(cities)
    } catch (err) {
      console.error('Search error:', err)
    }
  }

  // Reverse geocode — get city name from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      const data = await res.json()
      const cityName = data.address?.city ||
                       data.address?.town ||
                       data.address?.village ||
                       data.address?.county ||
                       'Selected Location'
      const state = data.address?.state || ''
      return { name: cityName, state, lat, lng }
    } catch (err) {
      return { name: 'Selected Location', state: '', lat, lng }
    }
  }

  // Detect current location
  const detectLocation = () => {
    setDetecting(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords
          const city = await reverseGeocode(lat, lng)
          setSelectedCity(city)
          setMarkerPos([lat, lng])
          setMapCenter([lat, lng])
          setMapZoom(12)
          setMapKey(prev => prev + 1)
          setSearch(city.name)
          setDetecting(false)
        },
        (err) => {
          alert('Could not detect location. Please search manually.')
          setDetecting(false)
        }
      )
    } else {
      alert('Geolocation not supported by your browser.')
      setDetecting(false)
    }
  }

  // Handle map click
  const handleMapClick = async (latlng) => {
    const { lat, lng } = latlng
    const city = await reverseGeocode(lat, lng)
    setSelectedCity(city)
    setMarkerPos([lat, lng])
    setSearch(city.name)
    setSearchResults([])
  }

  // Handle search result click
  const handleResultClick = (city) => {
    setSelectedCity(city)
    setMarkerPos([city.lat, city.lng])
    setMapCenter([city.lat, city.lng])
    setMapZoom(12)
    setMapKey(prev => prev + 1)
    setSearch(city.name)
    setSearchResults([])
  }

  // Handle search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCities(search)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const handleContinue = async () => {
    if (selectedCity) {
      localStorage.setItem('userCity', JSON.stringify(selectedCity))
      try {
        const token = localStorage.getItem('token')
        const facial = JSON.parse(localStorage.getItem('facialProfile') || '{}')
        const hair = JSON.parse(localStorage.getItem('hairProfile') || '{}')
        const body = JSON.parse(localStorage.getItem('bodyProfile') || '{}')
        const age = localStorage.getItem('userAge')
        
        await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            city: selectedCity,
            skinType: facial.skinType,
            skinConcerns: facial.skinConcerns,
            hairType: hair.hairType,
            hairPorosity: hair.hairPorosity,
            hairConcerns: hair.hairConcerns,
            bodyType: body.bodyType,
            bodyConcerns: body.bodyConcerns,
            age: age ? parseInt(age) : null
          })
        })
      } catch (err) {
        console.error('Failed to sync profile onboarding data to backend:', err)
      }
      navigate('/home')
    }
  }

  return (
    <div className="city-page">

      {/* Header */}
      <div className="city-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }}></div>
        </div>
        <p className="progress-text">Step 5 of 5</p>
      </div>

      <div className="city-split-container">
        
        {/* Left Column: Form & Info */}
        <div className="city-left-col">
          {/* Title */}
          <div className="city-top">
            <h2 className="city-title">Where are you based?</h2>
            <p className="city-sub">
              We use your city's real-time weather to personalise
              your daily tips 🌤️
            </p>
          </div>

          {/* Why we ask */}
          <div className="city-why">
            <div className="why-item">
              <span className="why-icon">💧</span>
              <span className="why-text">Humidity affects frizz and oiliness</span>
            </div>
            <div className="why-item">
              <span className="why-icon">☀️</span>
              <span className="why-text">UV index determines your SPF need</span>
            </div>
            <div className="why-item">
              <span className="why-icon">🌫️</span>
              <span className="why-text">AQI tells us how much protection your skin needs</span>
            </div>
          </div>

          {/* Detect location button */}
          <button
            className="detect-btn"
            onClick={detectLocation}
            disabled={detecting}
          >
            {detecting ? '📍 Detecting...' : '📍 Use my current location'}
          </button>

          {/* Search */}
          <div className="city-search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="city-search"
              placeholder="Search any city in India..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setSelectedCity(null)
              }}
            />
            {search && (
              <button
                className="clear-btn"
                onClick={() => {
                  setSearch('')
                  setSelectedCity(null)
                  setSearchResults([])
                }}
              >✕</button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((city, i) => (
                <div
                  key={i}
                  className="search-result-item"
                  onClick={() => handleResultClick(city)}
                >
                  <span className="result-icon">📍</span>
                  <div>
                    <p className="result-name">{city.name}</p>
                    <p className="result-state">{city.state}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected City Card */}
          {selectedCity && (
            <div className="city-selected-card">
              <div className="city-selected-left">
                <span className="city-selected-emoji">📍</span>
                <div>
                  <p className="city-selected-name">{selectedCity.name}</p>
                  <p className="city-selected-state">{selectedCity.state}</p>
                </div>
              </div>
              <button
                className="city-change-btn"
                onClick={() => {
                  setSelectedCity(null)
                  setSearch('')
                  setMarkerPos(null)
                }}
              >
                Change
              </button>
            </div>
          )}

          {/* Next Button Inline */}
          <div className="city-footer-inline">
            <button
              className={`btn-next ${!selectedCity ? 'disabled' : ''}`}
              onClick={handleContinue}
              disabled={!selectedCity}
            >
              {selectedCity
                ? `Continue with ${selectedCity.name} →`
                : 'Select your city to continue'
              }
            </button>
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="city-right-col">
          <p className="map-hint">
            🗺️ Or tap anywhere on the map to select your location
          </p>
          <MapContainer
            key={mapKey}
            center={mapCenter}
            zoom={mapZoom}
            className="map-container-split"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='© OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker onLocationPick={handleMapClick} />
            {markerPos && (
              <Marker position={markerPos} icon={customIcon}>
                <Popup>
                  <strong>{selectedCity?.name}</strong><br />
                  {selectedCity?.state}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

      </div>

    </div>
  )
}

export default CitySelect