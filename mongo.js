const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

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
