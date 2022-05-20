import db from '..'

db.sequelize.drop().then(() => {
  console.log('Database dropped')

  process.exit(0)
})
