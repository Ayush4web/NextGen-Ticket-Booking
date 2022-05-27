const CustomApiError = require("./customApiError")

class UnAutharize extends CustomApiError{
 constructor(msg) {
  super(msg)
  this.statusCode = 401
  }
}

module.exports = UnAutharize