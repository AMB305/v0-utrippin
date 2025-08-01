import React from 'react'
import { MapPin } from 'lucide-react'

export default function UtrippinLogo() {
  return (
    <div className="flex items-center space-x-2">
      <MapPin className="w-6 h-6 text-blue-600" />
      <img src="/logo.svg" alt="Utrippin.ai" className="h-6" />
    </div>
  )
}