import { Socket } from 'socket.io'

import { PlayerModel } from '../db/models/Player'

async function position(player: PlayerModel, socket: Socket, message: any) {
  const { x, y, z } = message

  await player.update({
    positionX: x,
    positionY: y,
    positionZ: z,
  })

  console.log(player.id, x, y, z)
}

export default position
