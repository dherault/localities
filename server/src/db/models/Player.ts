import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from '../sequelize'

export interface PlayerModel extends Model<InferAttributes<PlayerModel>, InferCreationAttributes<PlayerModel>> {
  // Some fields are optional when calling PlayerModel.create() or PlayerModel.build()
  id?: number
  socketId: string
  positionX: number
  positionY: number
  positionZ: number
}

const Player = sequelize.define<PlayerModel>('Player', {
  socketId: {
    type: DataTypes.STRING,
  },
  positionX: {
    type: DataTypes.FLOAT,
  },
  positionY: {
    type: DataTypes.FLOAT,
  },
  positionZ: {
    type: DataTypes.FLOAT,
  },
}, {
})

export default Player
