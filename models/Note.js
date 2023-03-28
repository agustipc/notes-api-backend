const { Schema, model } = require('mongoose')

// Create the Schema for the model
const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Create the model
const Note = model('Note', noteSchema)

/*
//To get the notes
Note.find({})
  .then((result) => {
    console.log(result)
    mongoose.connection.close()
  })
  .catch((error) => {
    console.error(error)
  })
*/

/*
//To save note
Create a note by using an instance of the model
const note = new Note({
  content: 'MongoDB is incredible',
  date: new Date(),
  important: true
})

// Save note to db
note
  .save()
  .then((result) => {
    console.log(result)

    // Close connection with mongoos after using it
    mongoose.connection.close()
  })
  .catch((error) => {
    console.error(error)
  })
*/

module.exports = Note
