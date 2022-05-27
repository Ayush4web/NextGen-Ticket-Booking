import React, { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import * as faceapi from 'face-api.js'
import Modal from './Modal'
import axios from 'axios'
import { useGlobalContext } from '../context'

const BuyTicket = () => {
  const {
    loading,
    setLoading,
    alert,
    setAlert,
    modal,
    setModal,
    setIsWebcamAvailable,
    isWebcamAvailable,
  } = useGlobalContext()

  const [image, setImage] = useState('')
  const [show, setShow] = useState(false)
  const [passenger, setPassenger] = useState({
    name: '',
    age: '',
    num: '',
    date: '',
  })
  const imageRef = useRef(null)
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const analizeImage = async () => {
    if (imageRef && imageRef.current) {
      const detections = await faceapi
        .detectAllFaces(imageRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()

      if (detections.length == 0) {
        setAlert({
          show: true,
          text: 'No Face Detected, Please Retake Image.',
          type: 'danger',
        })
        return
      }
      if (detections.length > 1) {
        setAlert({
          show: true,
          text: 'More That 1 Faces Detected,Please Retake Image.',
          type: 'danger',
        })
        return
      }

      // for better UX
      setTimeout(() => {
        setAlert({
          show: true,
          text: 'Face Recognized, Please Fill Your Details.',
          type: 'success',
        })
      }, 1000)
    }
  }

  const capture = useCallback(() => {
    setAlert({
      show: true,
      text: 'Recoganizing Your Face, Please Wait!',
      type: 'success',
    })

    setShow(!show)
    const imgsrc = webcamRef.current.getScreenshot()
    setImage(imgsrc)

    analizeImage()
  }, [])

  const retake = (e) => {
    setShow(!show)
    setImage('')
    setAlert({})
  }

  const handleChange = (e) => {
    // Age Validation
    if (
      e.target.name === 'age' &&
      (e.target.value < 0 || e.target.value > 100)
    ) {
      return
    }

    //Number Validation
    if (e.target.name === 'num' && e.target.value.length > 10) {
      return
    }

    // Controlled Form Input
    setPassenger({ ...passenger, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { name, age, num, date } = passenger
    if (!name || !age || !num || !date) {
      setAlert({
        show: true,
        text: 'Please Fill All The Details.',
        type: 'danger',
      })
      return
    }
    setModal({
      show: true,
      type: 'uploadImg',
      text: 'Uploading your Images, Please Wait😮‍💨',
    })

    const reqBody = { ...passenger, imgSrc: image }
    try {

      // Uploading Image
      const { data } = await axios.post('/upload', reqBody)
      setModal({
        show: 'true',
        type: 'tickImg',
        text: 'Ticket Booking Succesfull🤩.You Will Recieve Your Ticket On Your Mobile Number Shortly.',
      })
    } catch (error) {
      setModal({
        show: true,
        type: 'errorImg',
        text: `${error.message}. Please Try Again Later🥺`,
      })
    }

    setPassenger({
      name: '',
      age: '',
      num: '',
      date: '',
    })
    setImage('')
    setAlert({})
  }

  useEffect(() => {
    setLoading(true)
    setAlert({})
     
    // Checking for webcam permissions
    navigator.getMedia = navigator.getUserMedia

    navigator.getMedia(
      { video: true },
      function () {
        setIsWebcamAvailable(true)
      },
      function () {
        setLoading(false)
        setIsWebcamAvailable(false)
      }
    )
  }, [])

  return (
    <>
      {loading && <Modal></Modal>}
      {!isWebcamAvailable && <Modal></Modal>}
      <main style={{ position: 'relative' }}>
        {modal.show && <Modal></Modal>}

        <h3 className='text-center mt-2 mb-0 heading'>
          Welcome To The Next Generation Train Ticket Booking System.
        </h3>

        <div className='body' style={{ position: 'relative' }}>
          <p
            className='text-center mb-0 '
            style={{
              fontFamily: 'monospace',
              fontWeight: '400',
              color: 'rgb(2, 61, 87) ',
            }}
          >
            Align Your Face Inside The Box & Hit Capture.📸
          </p>
          <div className='webcam mt-2'>
            <img
              ref={imageRef}
              src={image}
              className={show ? 'show' : 'hide'}
              style={{ position: 'absolute', top: '0', left: '0' }}
            />
            <canvas
              className='canvas'
              ref={canvasRef}
              style={{
                zIndex: '1000',
                position: 'absolute',
                top: '-10px',
                left: '0',
              }}
            />
            <Webcam
              audio={false}
              mirrored={true}
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              onUserMedia={() => setLoading(false)}
              style={{
                heigth: '100%',
                width: '100%',
                position: 'absolute',
                top: '0',
                left: '0',
              }}
            ></Webcam>
          </div>

          {/* Conditional rendering */}
          
          {alert.show && (
            <p className={`text-${alert.type} text-center`}>{alert.text}</p>
          )}
          {!image ? (
            <button
              onClick={() => capture()}
              className='btn btn-dark w-25 c-btn'
              disabled={loading}
            >
              Capture
            </button>
          ) : (
            <button onClick={() => retake()} className='btn btn-dark c-btn'>
              Retake Image
            </button>
          )}

          <form className='form'>
            <div className='row justify-content-center mt-3'>
              <div className='col-5'>
                <input
                  type='text'
                  name='name'
                  value={passenger.name}
                  onChange={handleChange}
                  className='form-control'
                  placeholder='Name of Passsenger'
                  required
                />
              </div>
              <div className='col-5'>
                <input
                  type='text'
                  name='age'
                  value={passenger.age}
                  onChange={handleChange}
                  className='form-control'
                  placeholder='Age'
                  required
                />
              </div>
            </div>
            <div className='row justify-content-center mt-3'>
              <div className='col-5'>
                <input
                  type='text'
                  name='num'
                  value={passenger.num}
                  onChange={handleChange}
                  className='form-control'
                  placeholder='Contact No.'
                  required
                />
              </div>
              <div className='col-5'>
                <input
                  type='text'
                  name='date'
                  placeholder='Date of Journey'
                  onFocus={(e) => (e.currentTarget.type = 'date')}
                  onBlur={(e) => (e.currentTarget.type = 'text')}
                  value={passenger.date}
                  onChange={handleChange}
                  className='form-control'
                  required
                />
              </div>

              <button
                className='btn btn-primary w-50 my-4'
                type='submit'
                disabled={image === ''}
                onClick={(e) => {
                  handleSubmit(e)
                }}
              >
                Buy Tickets
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}

export default BuyTicket
