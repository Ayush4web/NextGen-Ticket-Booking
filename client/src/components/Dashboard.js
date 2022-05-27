import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import { useGlobalContext } from '../context'
import moment from 'moment'
import Modal from './Modal'

const date = moment().format('YYYY-MM-DD')

const Dashboard = () => {
  const { loading, setLoading, loadLabeledImages, startVideo } =
    useGlobalContext()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const videoHeight = 480
  const videoWidth = 640

  const handleVideoOnPlay = async () => {
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

          if (result.label.split(',')[0] === 'unknown') {
            drawBox = new faceapi.draw.DrawBox(box, {
              label: 'Unknown',
              boxColor: 'red',
            })
          } else if (result.label.split(',')[1] === date) {
            drawBox = new faceapi.draw.DrawBox(box, {
              label: result.label.split(',')[0] + ', ' + '(Valid Ticket)',
              boxColor: 'green',
            })
          } else {
            drawBox = new faceapi.draw.DrawBox(box, {
              label: result.label.split(',')[0] + ', ' + '(Invalid Ticket)',
              boxColor: 'orange',
            })
          }

          drawBox.draw(canvasRef.current)

          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections)
        })
      }
    }, 600)
  }

  useEffect(() => {
    setLoading(true)
    startVideo(videoRef)
  }, [])
  return (
    <>
      <h3 className='text-center mt-2 mb-0 heading'>Dashboard</h3>
      <div className='underline'></div>
      <div className='d-flex justify-content-center mt-2 mb-2 web'>
        {loading && <Modal></Modal>}
        <video
          ref={videoRef}
          height={videoHeight}
          width={videoWidth}
          onPlay={handleVideoOnPlay}
        />
        <canvas
          className='canvas'
          ref={canvasRef}
          style={{ position: 'absolute' }}
        />
      </div>
    </>
  )
}
export default Dashboard
