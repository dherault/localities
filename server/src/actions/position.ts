import { Socket } from 'socket.io'

import db from '../db'

async function position(socket: Socket, message: any) {
  const { x, y, z } = message

  const [player] = await db.Player.findOrCreate({
    where: {
      socketId: socket.id,
      positionX: x,
      positionY: y,
      positionZ: z,
    },
  })

  console.log(player.id, x, y, z)
}

export default position
