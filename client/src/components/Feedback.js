import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import loadingImg from '../images/loading.gif'
import Modal from './Modal'
import { useGlobalContext } from '../context'
import FeedbackModal from './FeedbackModal'

const Feedback = () => {
  const {
    loading,
    setLoading,
    alert,
    setAlert,
    loadLabeledImages,
    startVideo,
    setOpenModel,
    openModal,
    expressions,
    setExpressions,
    setName,
    isFeedbackDone,
    closeWebcam,
  } = useGlobalContext()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [detection, setDetection] = useState()

  const videoHeight = 200
  const videoWidth = 250

  const capture = () => {
    setOpenModel(true)
    if (detection[0].expressions.happy > 0.9) {
      setExpressions({
        ...expressions,
        type: 'happy',
        text: 'We Found You Are Loving Our Service.🤩',
      })
    } else if (detection[0].expressions.neutral > 0.9) {
      setExpressions({
        ...expressions,
        type: 'neutral',
        text: 'We Will Be Continously Trying To Match Your Expectations.😃',
      })
    } else if (
      detection[0].expressions.sad > 0.7 ||
      detection[0].expressions.angry > 0.7 ||
      detection[0].disgusted > 0.7
    ) {
      setExpressions({
        ...expressions,
        type: 'angry',
        text: 'So Sorry To See That You Are Not Satisfied By Our Service.😕',
      })
    } else {
      setExpressions({
        ...expressions,
        type: 'neutral',
        text: 'We Will Be Continously Trying To Match Your Expectations.😃',
      })
    }
  }

  const analizeFace = async () => {
    const LabeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.6)
    setLoading(false)
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          videoRef.current
        )
        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        }

        faceapi.matchDimensions(canvasRef.current, displaySize)
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withFaceExpressions()

        if (detections.length > 1) {
          setAlert({
            show: true,
            type: 'danger',
            text: 'More Than 1 Face Detected.',
          })
          return
        }
        if (!detections.length) {
          setAlert({
            show: true,
            type: 'danger',
            text: 'No Face Detected.',
          })
          return
        }

        setDetection(detections)

        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        const results = resizedDetections.map((d) =>
          faceMatcher.findBestMatch(d.descriptor)
        )

        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box

          if (result.distance > 0.45) {
            result._label = 'unknown'
          }

          let drawBox = {}
          if (result.label === 'unknown') {
            setAlert({
              show: true,
              type: 'danger',
              text: "You Haven't Done Any Bookings Lately.",
            })
            drawBox = new faceapi.draw.DrawBox(box, {
              label: 'Unknown',
              boxColor: 'red',
            })
          } else {
            setAlert({
              show: true,
              type: 'success',
              text: 'Face Detected.',
            })

            drawBox = new faceapi.draw.DrawBox(box, {
              label: result.label.split(',')[0],
              boxColor: 'green',
            })
            setName(result.label.split(',')[0])
          }

          drawBox.draw(canvasRef.current)
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections)
        })
      }
    }, 900)
  }

  useEffect(() => {
    setLoading(true)
    startVideo(videoRef)
  }, [])
  return (
    <>
      {loading && <Modal></Modal>}
      {isFeedbackDone && <Modal />}
      {openModal && <FeedbackModal />}
      <h3 className='text-center mt-2 mb-0 heading'>
        Say Goodbye To Long Feedback Forms!👋
      </h3>
      <div className='body pb-2 '>
        <p
          className='text-center pt-2'
          style={{
            fontFamily: 'monospace',
            fontWeight: '400',
            color: 'rgb(2, 61, 87) ',
            margin: '0 1rem',
          }}
        >
          To Give Feedback Just Look Into The Camera & Hit Capture.📸 <br /> We
          Will Detect What You Feel About Our Service.😎
        </p>
        <div className='webcam mt-2 feedback'>
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
          <video
            ref={videoRef}
            height={videoHeight}
            width={videoWidth}
            onPlay={analizeFace}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
            }}
          />
        </div>

        {alert.show && (
          <p className={`text-${alert.type} text-center mt-1`}>{alert.text}</p>
        )}

        <button
          className='btn btn-dark c-btn'
          onClick={capture}
          disabled={alert.type === 'danger'}
        >
          Capture
        </button>
      </div>
    </>
  )
}

export default Feedback
