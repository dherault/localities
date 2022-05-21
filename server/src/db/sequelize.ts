import { Sequelize } from 'sequelize'

export default new Sequelize(
  'phenomenom',
  'postgres',
  'password',
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  }
)
