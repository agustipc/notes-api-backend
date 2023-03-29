const mongoose = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')
const { api, initialNotes, getAllContentFromNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  // parallel
  //   const notesObjects = initialNotes.map((note) => new Note(note))
  //   const promises = notesObjects.map((note) => note.save())
  //   await Promise.all(promises)

  // sequential
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('get', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two notes', async () => {
    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('first note has correct content', async () => {
    const { contents } = await getAllContentFromNotes()

    expect(contents).toContain(initialNotes[0].content)
  })
})

describe('post', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'Proximamente async/await',
      important: true
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }
    await api.post('/api/notes').send(newNote).expect(400)

    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('delete', () => {
  test('note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

    const { contents, response: secondResponse } =
      await getAllContentFromNotes()

    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
    expect(contents).not.toContain(noteToDelete.content)
  })

  test('note can not be deleted when passing wrong id', async () => {
    await api.delete('/api/notes/555556994494541').expect(400)

    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
