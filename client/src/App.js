import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Splash from './pages/Splash'
import Signup from './pages/Signup'
import Login from './pages/Login'
import FacialCare from './pages/FacialCare'
import FacialCareProducts from './pages/FacialCareProducts'
import HairCare from './pages/HairCare'
import HairCareProducts from './pages/HairCareProducts'
import BodyCare from './pages/BodyCare'
import BodyCareProducts from './pages/BodyCareProducts'
import EyeCareProducts from './pages/EyeCareProducts'
import LipCareProducts from './pages/LipCareProducts'
import CitySelect from './pages/CitySelect'
import AgeSelect from './pages/AgeSelect'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding/facial" element={<FacialCare />} />
          <Route path="/facial-care" element={<FacialCareProducts />} />
          <Route path="/onboarding/hair" element={<HairCare />} />
          <Route path="/hair-care" element={<HairCareProducts />} />
          <Route path="/onboarding/body" element={<BodyCare />} />
          <Route path="/body-care" element={<BodyCareProducts />} />
          <Route path="/eye-care" element={<EyeCareProducts />} />
          <Route path="/lip-care" element={<LipCareProducts />} />
          <Route path="/onboarding/age" element={<AgeSelect />} />
          <Route path="/onboarding/city" element={<CitySelect />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App