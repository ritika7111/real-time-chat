// pages/api/socket.ts
import { Server as NetServer } from 'http'
import { Server as IOServer } from 'socket.io'
import type { NextApiRequest } from 'next'
import type { NextApiResponseWithSocket } from '@/types/next'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log('🔌 Initializing Socket.IO...')

    const io = new IOServer(res.socket.server as NetServer, {
      path: '/api/socketio',
    })

    io.on('connection', (socket) => {
      console.log('✅ A user connected')

      socket.on('message', (msg: string) => {
        console.log('📨 Received:', msg)
        socket.broadcast.emit('message', msg)
      })

      socket.on('disconnect', () => {
        console.log('❌ A user disconnected')
      })
    })

    res.socket.server.io = io
  }

  res.end()
}
