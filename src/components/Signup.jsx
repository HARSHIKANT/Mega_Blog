import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import authService from '../appwrite/auth.js'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { useForm } from 'react-hook-form'
import { Button, Input, Logo } from './index'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const create = async (data) => {
        setError(null)
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(login({ userData }))
                navigate('/')
            }
        } catch (err) {
            setError(err.message)
        }
    }
  return (
    <div className='flex items-center justify-center'>
        <div className={`mx-auto w-full max-w-lg p-10 bg-gray-100 rounded-xl border border-black/10`}>
            <div className='mb-2 flex justify-center'>
                <span className='inline-block w-full max-w-[100px]'>
                    <Logo width='100px' />
                </span>
            </div>
            <h2 className='text-center text-2xl font-bold leading-tight'>Sign Up to Create an account</h2>
            <p className='mt-2 text-center text-base text-black/60'>
                Already have an account?&nbsp;
                <Link to='/login' className='font-medium text-primary transition-all duration-200 hover:underline'>
                    Sign In
                </Link>
            </p>
            {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
            <form onSubmit={handleSubmit(create)}>
                <div className='space-y-5'>
                    <Input
                        label='Full Name:'
                        placeholder='Enter your full name'
                        {...register('name', { 
                            required: true,
                        })}/>
                    <Input
                        label='Email:'
                        placeholder='Enter your email'
                        type='email'
                        {...register('email', { 
                            required: true, 
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})$/.test(value) || 'Email address must be a valid email address',
                            }
                        })}/>
                    <Input
                        label='Password:'
                        placeholder='Enter your password'
                        type='password'
                        {...register('password', { required: true, })}/>
                    <Button type='submit' className='w-full'>Create Account</Button>
                </div>
            </form>
        </div>
        
    </div>
  )
}

export default Signup