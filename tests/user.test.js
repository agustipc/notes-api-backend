const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const { server } = require('../index')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')

describe('add user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({ username: 'username1', passwordHash })

    await user.save()
  })

  test('create a user', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'agustipc',
      name: 'agusti',
      password: 'passw0rd'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if username is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'username1',
      name: 'agusti',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain(
      '`username` to be unique'
    )

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
