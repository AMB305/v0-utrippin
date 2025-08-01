import React from 'react'
import { MapPin } from 'lucide-react'

export default function UtrippinLogo() {
  return (
    <div className="flex items-center space-x-2">
      <MapPin className="w-6 h-6 text-blue-600" />
      <span className="text-xl font-bold text-blue-600">Utrippin</span>
    </div>
  )
}