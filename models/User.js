const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

// Create the model
const User = model('Note', userSchema)

module.exports = User
