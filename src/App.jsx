import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import FlightsPage from './pages/FlightsPage'
import HotelsPage from './pages/HotelsPage'
import CarsPage from './pages/CarsPage'
import PackagesPage from './pages/PackagesPage'
import DestinationsPage from './pages/DestinationsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
      </Routes>
    </BrowserRouter>
  )
}