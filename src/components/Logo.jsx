import React from 'react'
import logo from '../assets/logo.png'

function Logo({width = "100px"}) {
  return (
    <div>
      <img src={logo} alt='Logo' style={{ width: width }} className='rounded-2xl' />
    </div>
  )
}

export default Logo