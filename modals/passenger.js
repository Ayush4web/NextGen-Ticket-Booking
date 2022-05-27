const mongoose = require('mongoose')

const PassengerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
  },
  num: {
    type: Number,
    required: true,
  },
  date: String,

  image: {
    type: String,
    required: true,
  },
})


module.exports =  mongoose.model('Passenger', PassengerSchema)