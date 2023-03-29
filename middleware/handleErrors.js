const ERROR_HANDLERS = {
  CastError: (res) => res.status(400).send({ error: 'id used is malformed' }),

  ValidationError: (res, error) =>
    res.status(409).send({ error: error.message }),

  JsonWebTokenError: (res) => res.status(401).json({ error: 'invalid token' }),

  TokenExpirerError: (res) => res.status(401).json({ error: 'expired token' }),

  defaultError: (res) => res.status(500).end()
}

module.exports = (error, request, response, next) => {
  console.error('handle error log')
  console.log(error.name)

  const handle = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handle(response, error)
}
