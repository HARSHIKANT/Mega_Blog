import React from 'react'

function Button({
    children,
    type = {type},
    bgColor = 'bg-blue-600',
    textColor = 'text-white',
    className = '',
    ...props
}) {
  return (
    <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} hover:bg-blue-700 transition duration-200 ${className}`} {...props}>
        {children}
    </button>
  )
}

export default Button