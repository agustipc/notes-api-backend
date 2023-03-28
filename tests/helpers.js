const supertest = require('supertest')

const { app } = require('../index')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Aprendiendo FullStack JS',
    important: true,
    date: new Date()
  },
  {
    content: 'Using Jest on testing',
    import: false,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map((note) => note.content),
    response
  }
}

module.exports = {
  getAllContentFromNotes,
  api,
  initialNotes
}