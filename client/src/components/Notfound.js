import React from 'react'
import { Link } from 'react-router-dom'
import notFoundImg from '../images/404.gif'
const Notfound = () => {
  return (
    <main className='error text-center'>
      <img src={notFoundImg} alt='' />
      <h3 className='font-monospace' style={{ color: 'rgb(2, 61, 87)' }}>
        You're Lost In Deep Space.
      </h3>
      <Link to='/'>
        <button className='btn btn-dark'>Let's Go Back</button>
      </Link>
    </main>
  )
}

export default Notfound
