import React, { useState } from 'react'
import { useGlobalContext } from '../context'

import uploadImg from '../images/upload.gif'
import tickImg from '../images/tick.gif'
import errorImg from '../images/error.gif'
import loadingImg from '../images/loading.gif'

const Modal = () => {
  const {
    setModal,
    modal,
    error,
    loading,
    isFeedbackDone,
    setIsFeedbackDone,
    isWebcamAvailable,
    setIsWebcamAvailable,
  } = useGlobalContext()

  return (
    <>
      <div className='overlay'></div>
      <div
        className='card'
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: '10000',
        }}
      >
        <div className='card-body'>
          <img
            src={
              modal.type === 'errorImg'
                ? errorImg
                : modal.type === 'uploadImg'
                ? uploadImg
                : loading
                ? loadingImg
                : !isWebcamAvailable
                ? errorImg
                : tickImg
            }
            style={{ width: '160px', margin: '0 auto', display: 'block' }}
          />

          <div className='text-center'>
            <p className='font-monospace'>{modal.text}</p>

            {loading && (
              <p className='font-monospace '>
                Getting Things Ready, Please Wait... <br />
                This May Take a While.🙄
              </p>
            )}
            {isFeedbackDone && (
              <p className='font-monospace '>
                Thank You.Feedback Submited Succefully.
              </p>
            )}

            {!isWebcamAvailable && !loading && (
              <p className='font-monospace '>
                We Cannot Find Your Webcam,Please Check Your Permissions.
              </p>
            )}
            {modal.type !== 'uploadImg' && !loading && !isFeedbackDone && (
              <button
                className='btn btn-success'
                onClick={() => {
                  setModal({ show: false, type: '', text: '' })
                  setIsFeedbackDone(false)
                  setIsWebcamAvailable(true)
                }}
              >
                Alright👍
              </button>
            )}
            {isFeedbackDone && (
              <button
                className='btn btn-success'
                onClick={() => {
                  setModal({ show: false, type: '', text: '' })
                  setIsFeedbackDone(false)
                }}
              >
                Alright👍
              </button>
            )}
           
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
