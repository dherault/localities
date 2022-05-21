import { Socket } from 'socket.io'

import db from '../db'
import { PlayerModel } from '../db/models/Player'

import { positionRadius } from '../configuration'

async function players(player: PlayerModel, socket: Socket) {
  const players = await db.Player.findAll({
    where: {
      connected: true,
      x: {
        [db.Sequelize.Op.gte]: player.x - positionRadius,
        [db.Sequelize.Op.lte]: player.x + positionRadius,
      },
      y: {
        [db.Sequelize.Op.gte]: player.y - positionRadius,
        [db.Sequelize.Op.lte]: player.y + positionRadius,
      },
      z: {
        [db.Sequelize.Op.gte]: player.z - positionRadius,
        [db.Sequelize.Op.lte]: player.z + positionRadius,
      },
    },
  })

  socket.emit('players', players
    .filter(p => p.id !== player.id)
    .map(p => ({
      id: p.id,
      x: p.x,
      y: p.y,
      z: p.z,
      dx: p.dx,
      dy: p.dy,
      dz: p.dz,
    }))
  )
}

export default players
