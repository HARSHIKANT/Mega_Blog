import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = 'text',
    className = '',
    ...props
},ref){
    const id = useId();
    return (
        <div className='w-full'>
            {label && <label className='block mb-1' htmlFor={id}> {label}
                </label>}
            <input type = {type}
                className={`px-3 py-2 border border-gray-300 rounded-md focus:bg-gray-50 outline-none text-black bg-white w-full ${className}`}
                ref = {ref}
                {...props}
                id={id}
                />
        </div>
    )
})

export default Input