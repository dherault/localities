import { Socket } from 'socket.io'

function position(socket: Socket, message: any) {
  const { x, y, z } = message

  console.log(socket.id, x, y, z)
}

export default position
