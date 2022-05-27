const CustomApiError = require("./customApiError")

class BadRequest extends CustomApiError {
  constructor(msg) {
    super(msg)
    this.statusCode = 400
  }
}

module.exports = BadRequest