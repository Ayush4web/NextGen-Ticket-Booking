const CustomApiError = require("./customApiError")

class NotFound extends CustomApiError {
  constructor(msg) {
    super(msg)
    this.statusCode = 404
  }
}

module.exports = NotFound