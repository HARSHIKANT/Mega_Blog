import React from 'react'

function Container({children}) { // you can also destructure children from props
  return (
    <div className='w-full max-w-7xl mx-auto px-4'>{children}</div>
  )
}

export default Container