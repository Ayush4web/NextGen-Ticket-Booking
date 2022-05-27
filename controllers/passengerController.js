const fs = require('fs')
const path = require('path')
const Passenger = require('../modals/passenger')
const cloudinary = require('cloudinary').v2

// Twillio Setup
const accountSid = 'AC11fde9515a36108bf02e6d7671327bef'
const authToken = 'caea7d8ac128f04810f45766ce676d64'
const client = require('twilio')(accountSid, authToken)

const createPassenger = async (req, res) => {
  console.log(req.body)
  const { name, imgSrc } = req.body
  let image = ''

  const base64Data = imgSrc.split(',')[1]

  fs.writeFileSync(`./uploads/${name}.jpg`, base64Data, 'base64')
  const imagePath = path.join(__dirname, '../uploads' + `/${name}.jpg`)

  // Uploading Images to Cloud
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      use_filename: true,
    })
    image = result.secure_url
  } catch (error) {
    console.log(error)
  }

  // Creating Passenger
  const passenger = await Passenger.create({ ...req.body, image })

  // Sending Text Messsage
  const to = `91${passenger.num}`
  const text = `Booking Confirmed! Dear, ${passenger.name}, your booking is successful.We wish you a Happy & Save Journey.Thank You.`

  client.messages
    .create({
      body: text,
      messagingServiceSid: 'MG3861655d16a94fd825417a1074017258',
      to: to,
    })
    .then((message) => console.log(message.sid))
    .done()

  res.status(201).send(passenger)
}

const getAllPassengers = async (req, res) => {
  const passenger = await Passenger.find({})
  res.status(200).json(passenger)
}

module.exports = { createPassenger, getAllPassengers }
