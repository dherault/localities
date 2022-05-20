import { Sequelize } from 'sequelize'

export default new Sequelize(
  'localhost:5432',
  'postgres',
  'password',
  {
    host: 'localhost',
    dialect: 'postgres',
  }
)
