import React, { useState } from 'react'
import { useGlobalContext } from '../context'

import lovedItImg from '../images/lovedIt.gif'
import hatedItImg from '../images/hatedIt.gif'
import neutralImg from '../images/neutral.gif'

const FeedbackModal = () => {
  const { setOpenModel, expressions, name, setIsFeedbackDone } =
    useGlobalContext()
  
  return (
    <>
      <div className='overlay'></div>
      <div
        className='card f-card'
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: '10000',
        }}
      >
        <div className='card-body'>
          <div className='text-center'>
            <h2 style={{ color: 'rgb(2, 61, 87)' }}>{`Hi, ${name} ?`}</h2>
          </div>
          <img
            src={
              expressions.type === 'happy'
                ? lovedItImg
                : expressions.type === 'angry'
                ? hatedItImg
                : neutralImg
            }
            style={{ width: '170px', margin: '0 auto', display: 'block' }}
          />
          <h5 className='font-monospace text-center'>{expressions.text}</h5>
          <div className='d-flex justify-content-between m-2'>
            <button
              className='btn btn-danger'
              onClick={() => setOpenModel(false)}
            >
              Wanna Change👎
            </button>
            <button className='btn btn-success' onClick={() => { setOpenModel(false); setIsFeedbackDone(true)}}>Absolutely👍</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FeedbackModal
