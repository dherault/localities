import http from 'http'

import { Server, Socket } from 'socket.io'

import db from './db'
import { PlayerModel } from './db/models/Player'

import { periodicPeriod } from './configuration'

type ActionHandlerType = (player: PlayerModel, socket: Socket, message: any) => void
type PeriodicHandlerType = (player: PlayerModel, socket: Socket) => void

export default class Localities {
  io: Server

  actionHandlersRegistry: { [action: string]: ActionHandlerType }

  periodicHandlersRegistry: { [action: string]: PeriodicHandlerType }

  socketIdToIntervalId: { [socketId: string]: NodeJS.Timeout }

  constructor() {
    const server = http.createServer()

    this.io = new Server(server, {
      cors: {
        origin: '*', // TODO
      },
    })
    this.actionHandlersRegistry = {}
    this.periodicHandlersRegistry = {}
    this.socketIdToIntervalId = {}

    this.io.on('connection', socket => this.handleConnect(socket))
  }

  registerActionHandler(name: string, handler: ActionHandlerType) {
    this.actionHandlersRegistry[name] = handler
  }

  registerPeriodicHandler(name: string, handler: PeriodicHandlerType) {
    this.periodicHandlersRegistry[name] = handler
  }

  async handleConnect(socket: Socket) {
    console.log(`Connected: ${socket.id}`)

    const [player] = await db.Player.findOrCreate({
      where: {
        socketId: socket.id,
      },
    })

    await player.update({ connected: true })

    socket.on('disconnect', () => this.handleDisconnect(player, socket))

    Object.entries(this.actionHandlersRegistry).forEach(([name, handler]) => {
      socket.on(name, message => {
        try {
          handler(player, socket, message)
        }
        catch (error) {
          console.error(error)
        }
      })
    })

    this.socketIdToIntervalId[socket.id] = setInterval(() => {
      Object.values(this.periodicHandlersRegistry).forEach(handler => {
        handler(player, socket)
      })
    }, periodicPeriod)
  }

  async handleDisconnect(player: PlayerModel, socket: Socket) {
    console.log(`Disconnected: ${socket.id}`)

    await player.update({ connected: false })

    clearInterval(this.socketIdToIntervalId[socket.id])
  }

  listen(port = 5001) {
    console.log(`Localities listening on port ${port}`)
    this.io.listen(port)
  }

}
