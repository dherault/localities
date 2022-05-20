import { Socket } from 'socket.io'

import db from '../db'
import { PlayerModel } from '../db/models/Player'

const radius = 12

async function players(player: PlayerModel, socket: Socket) {
  const players = await db.Player.findAll({
    where: {
      positionX: {
        [db.Sequelize.Op.gte]: player.positionX - radius,
        [db.Sequelize.Op.lte]: player.positionX + radius,
      },
      positionY: {
        [db.Sequelize.Op.gte]: player.positionY - radius,
        [db.Sequelize.Op.lte]: player.positionY + radius,
      },
      positionZ: {
        [db.Sequelize.Op.gte]: player.positionZ - radius,
        [db.Sequelize.Op.lte]: player.positionZ + radius,
      },
    },
  })

  socket.emit('players', players
    .filter(p => p.id !== player.id)
    .map(p => ({
      id: p.id,
      positionX: p.positionX,
      positionY: p.positionY,
      positionZ: p.positionZ,
    }))
  )
}

export default players
