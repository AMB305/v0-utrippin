// src/pages/keila/Voice.jsx
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Info, Volume2, Sliders, Mic } from 'lucide-react'
import { sendSpeech } from '../../api/keila'

export default function KeilaVoice() {
  const [recording, setRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const nav = useNavigate()

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRef.current = new MediaRecorder(stream)
      chunksRef.current = []
      
      mediaRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }
      
      mediaRef.current.onstop = async () => {
        setProcessing(true)
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/wav' })
          const { text } = await sendSpeech(blob)
          nav(`/keila/chat?prefill=${encodeURIComponent(text)}`)
        } catch (error) {
          console.error('Speech processing error:', error)
          setProcessing(false)
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRef.current.start()
      setRecording(true)
    } catch (error) {
      console.error('Microphone access error:', error)
    }
  }

  const stop = () => {
    if (mediaRef.current && recording) {
      mediaRef.current.stop()
      setRecording(false)
    }
  }

  const handleMicClick = () => {
    if (recording) {
      stop()
    } else {
      start()
    }
  }

  return (
    <div className="min-h-screen bg-[#101419] flex flex-col items-center p-6">
      {/* top icons */}
      <div className="self-end flex space-x-4 mb-12">
        <BarChart className="text-[#2575fc]" size={24} />
        <Info className="text-white" size={24} />
        <Volume2 className="text-white" size={24} />
        <Sliders className="text-white" size={24} />
      </div>

      {/* visualizer */}
      <div className="flex items-end space-x-2 h-32 w-full justify-center mb-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-2 bg-[#2575fc] rounded transition-all duration-300 ${
              recording 
                ? 'animate-pulse h-16' 
                : 'h-4'
            }`}
            style={{ 
              animationDelay: recording ? `${i * 100}ms` : '0ms',
              height: recording ? `${Math.random() * 60 + 20}px` : '16px'
            }}
          />
        ))}
      </div>

      <p className="text-white text-center mb-8 text-lg px-8">
        {processing 
          ? 'Processing your voice...' 
          : recording 
            ? 'Recording… Tap to stop' 
            : 'Tap the mic to start speaking'
        }
      </p>

      <button
        onClick={handleMicClick}
        disabled={processing}
        className={`p-6 rounded-full transition-all duration-300 ${
          recording 
            ? 'bg-[#2575fc] scale-110' 
            : 'bg-[#1d2029] hover:bg-[#2575fc]'
        } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {processing ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Mic className="text-white" size={24} />
        )}
      </button>
    </div>
  )
}