'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket

export default function Chat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/socket') // Init server

    socket = io({ path: '/api/socketio' })

    socket.on('connect', () => {
      console.log('✅ Socket connected')
    })

    socket.on('message', (msg: string) => {
      setMessages(prev => [...prev, msg])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const sendMessage = () => {
    if (!input.trim()) return
    socket.emit('message', input)
    setMessages(prev => [...prev, `Me: ${input}`])
    setInput('')
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Real-Time Chat</h1>
      <div className="h-64 overflow-y-scroll border mb-4 p-2 bg-gray-100 rounded">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">{msg}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  )
}
