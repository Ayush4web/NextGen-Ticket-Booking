class CustomApiError extends Error {
  constructor(msg,statusCode) {
    super(msg)
    this.statusCode = statusCode
  }
}


module.exports = CustomApiError