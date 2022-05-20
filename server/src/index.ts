import Localities from './Localities'
import actions from './actions'

const server = new Localities()

Object.entries(actions).forEach(([action, handler]) => {
  server.registerActionHandler(action, handler)
})

server.listen()
