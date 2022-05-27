const errorHandlerMiddleware = (err, req, res, next) => {
 const defaultError = {
  statusCode: err.statusCode || 500,
  msg:err.message || "Oops! Something Went Wrong At Our Side"
 }

 if (err.name === 'ValidationError') {
   defaultError.statusCode = 400
   defaultError.msg = Object.values(err.errors)
     .map((item) => item.message)
     .join(',')
 }

 if(err.code === 11000) {
  defaultError.statusCode = 400
    defaultError.msg = `${Object.keys(err.keyValue)} has to be unique`
  }
    res.status(defaultError.statusCode).json({ msg: defaultError.msg })
    // res.status(400).json(err)
 next()
}

module.exports =errorHandlerMiddleware