const notFoundMiddleware = (req, res, next) => {
  res.status(404).send('Route Does Not Exits')
}

module.exports = notFoundMiddleware