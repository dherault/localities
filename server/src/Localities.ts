import http from 'http'

import { Server, Socket } from 'socket.io'

type ActionHandlerType = (socket: Socket, message: any) => void

export default class Localities {
  io: Server

  actionHandlersRegistry: { [action: string]: ActionHandlerType }

  constructor() {
    const server = http.createServer()

    this.io = new Server(server, {
      cors: {
        origin: '*', // TODO
      },
    })
    this.actionHandlersRegistry = {}

    this.io.on('connection', socket => this.handleConnect(socket))
  }

  registerActionHandler(action: string, handler: ActionHandlerType) {
    this.actionHandlersRegistry[action] = handler
  }

  handleConnect(socket: Socket) {
    console.log(`Connected: ${socket.id}`)

    socket.on('disconnect', () => this.handleDisconnect(socket))

    Object.entries(this.actionHandlersRegistry).forEach(([action, handler]) => {
      socket.on(action, message => {
        try {
          handler(socket, message)
        }
        catch (error) {
          console.error(error)
        }
      })
    })
  }

  handleDisconnect(socket: Socket) {
    console.log(`Disconnected: ${socket.id}`)
  }

  listen(port = 5001) {
    console.log(`Localities listening on port ${port}`)
    this.io.listen(port)
  }

}
