const express = require('express')
const connectDb = require('./db/connect')
const path = require('path')

const app = express()
const cors = require('cors')

require('dotenv').config()
require('express-async-errors')

// Sequrity Packages
const xss = require('xss-clean')
const helmet = require('helmet')
const mongoSanatize = require('express-mongo-sanitize')

// Cloudinary Config
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

const passengerRouter = require('./routes/passengerRoute')

// middlewares
const errorHandlerMiddleware = require('./middlewares/errorHandler')
const notFoundMiddleware = require('./middlewares/notFound')


app.use(cors())
app.use(helmet())
app.use(xss())
app.use(mongoSanatize())

// CSP Fix
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header')
app.use(
  expressCspHeader({
    policies: {
      'default-src': [expressCspHeader.NONE],
      'img-src': [expressCspHeader.SELF],
    },
  })
)  

// Serving Static Build of react for Deployment
app.use(express.static(path.join(__dirname, './client/build')))
app.use(express.json())

// Main Route
app.use('/', passengerRouter)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

const port = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI).then(
      console.log('Connected to DB...')
    )
    app.listen(port, console.log(`Server is listening on port:${port}`))
  } catch (error) {
    console.log(error)
  }
}
start()

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)
