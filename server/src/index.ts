import Localities from './Localities'
import actions from './actions'
import periodics from './periodics'

const server = new Localities()

Object.entries(actions).forEach(([name, handler]) => {
  server.registerActionHandler(name, handler)
})

Object.entries(periodics).forEach(([name, handler]) => {
  server.registerPeriodicHandler(name, handler)
})

server.listen()
