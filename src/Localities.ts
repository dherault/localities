import { Server, Socket } from 'socket.io'

type LocalitiesOptions = {
  // port?: number
}

type ActionHandler = (socket: Socket, message: any) => void

export default class Localities {
  io: Server

  actionHandlersRegistry: { [action: string]: ActionHandler }

  constructor(options: LocalitiesOptions) {
    this.io = new Server()
    this.actionHandlersRegistry = {}

    this.io.on('connection', socket => this.handleConnect(socket))
  }

  registerActionHandler(action: string, handler: ActionHandler) {
    this.actionHandlersRegistry[action] = handler
  }

  handleConnect(socket: Socket) {
    console.log(`Connected: ${socket.id}`)

    socket.on('disconnect', () => this.handleDisconnect(socket))

    Object.entries(this.actionHandlersRegistry).forEach(([action, handler]) => {
      socket.on(action, message => handler(socket, message))
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
