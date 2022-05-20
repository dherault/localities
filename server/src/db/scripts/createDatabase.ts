import db from '..'

db.sequelize.sync().then(() => {
  console.log('Database created')

  process.exit(0)
})
