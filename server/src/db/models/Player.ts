import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from '../sequelize'

export interface PlayerModel extends Model<InferAttributes<PlayerModel>, InferCreationAttributes<PlayerModel>> {
  // Some fields are optional when calling PlayerModel.create() or PlayerModel.build()
  id?: number
  socketId: string
  connected: boolean
  channel: number
  x: number
  y: number
  z: number
  dx: number
  dy: number
  dz: number
}

const Player = sequelize.define<PlayerModel>('Player', {
  socketId: {
    type: DataTypes.STRING,
  },
  connected: {
    type: DataTypes.BOOLEAN,
  },
  channel: {
    type: DataTypes.INTEGER,
  },
  x: {
    type: DataTypes.FLOAT,
  },
  y: {
    type: DataTypes.FLOAT,
  },
  z: {
    type: DataTypes.FLOAT,
  },
  dx: {
    type: DataTypes.FLOAT,
  },
  dy: {
    type: DataTypes.FLOAT,
  },
  dz: {
    type: DataTypes.FLOAT,
  },
}, {
})

export default Player
