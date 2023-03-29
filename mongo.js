const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

// To use testing db when working with tests
const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

// Conexios a mongodb
mongoose
  .set('strictQuery', false)
  .connect(connectionString)
  .then(() => {
    console.log('Database connected')
  })
  .catch((error) => {
    console.error(error)
  })

process.on('uncaughtException', () => {
  mongoose.disconnect()
})
