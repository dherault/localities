import { Socket } from 'socket.io'

import { PlayerModel } from '../db/models/Player'

async function position(player: PlayerModel, socket: Socket, message: any) {
  const { x, y, z, dx, dy, dz } = message

  await player.update({ x, y, z, dx, dy, dz })

  // console.log(player.id, x, y, z)
}

export default position
