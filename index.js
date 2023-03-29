require('dotenv').config()
require('./mongo.js')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')

const app = express()

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const notesRouter = require('./controllers/notes.js')

app.use(express.json())
app.use(cors())
app.use(logger)
app.use(express.static('images'))

Sentry.init({
  dsn: 'https://8d6250e8d9aa466e9c2f1e8802bcac4e@o4504594314166272.ingest.sentry.io/4504690688524288',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(notFound)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

// middlewares que pasaran despues del next de un error
app.use(handleErrors)
// Using Heroku PORT
const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
