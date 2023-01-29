require('dotenv').config()
require('./mongo.js')

const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')
const Note = require('./models/Note.js')

const app = express()

app.use(express.json())
app.use(cors())
app.use(logger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        return response.json(note)
      }
      response.status(404).end()
    })
    .catch((error) => {
      next(error)
    })
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then((result) => {
    response.json(result)
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  Note.findByIdAndRemove(id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({ error: 'note.content is missing' })
  }

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  })

  newNote.save().then((savedNote) => {
    response.json(savedNote)
  })
})

// middlewares que pasaran despues del next de un error
app.use((error, request, response, next) => {
  console.error(error)
  console.log(error.name)
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'id used is malformed' })
  } else {
    response.status(500).end()
  }
})

app.use((request, response) => {
  response.status(404).json({ error: 'Not Found' })
})

// Using Heroku PORT
const PORT = process.env.PORT || 3001

app.listen(PORT)
console.log(`Server running on port ${PORT}`)
