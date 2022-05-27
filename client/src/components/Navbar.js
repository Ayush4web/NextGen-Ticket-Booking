import React from 'react'
import logoImg from '../images/logo.png'
import { NavLink } from 'react-router-dom'
const Navbar = () => {
  return (
    <>
      <nav className='navbar'>
        <div className='img'>
          <NavLink to='/'>
            <img src={logoImg} alt='Indian Railways Logo' />
          </NavLink>
        </div>
        <ul className='links'>
          <li>
            <NavLink
              to='/'
              style={({ isActive }) => {
                return {
                  color: isActive ? 'rgb(14, 156, 212) ' : 'rgb(11, 67, 90)',
                  textDecoration: 'none',
                }
              }}
            >
              Buy Tickets
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard'
              style={({ isActive }) => {
                return {
                  color: isActive ? 'rgb(14, 156, 212) ' : 'rgb(11, 67, 90)',
                  textDecoration: 'none',
                }
              }}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/feedback'
              style={({ isActive }) => {
                return {
                  color: isActive ? 'rgb(14, 156, 212) ' : 'rgb(11, 67, 90)',
                  textDecoration: 'none',
                }
              }}
            >
              Feedback
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar
