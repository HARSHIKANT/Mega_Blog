import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { login as authlogin } from '../store/authSlice'
import {Button,Input,Logo} from './index'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth.js'
import { set, useForm } from 'react-hook-form'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit} = useForm()
    const [error, setError] = useState(null)
    
    const login = async (data) =>{
        setError(null)
        console.log("Login form submitted with:", data)   // 👈 check if submit works

        try {
            const session = await authService.login(data.email, data.password)
            console.log("Session:", session)              // 👈 check if session is returned

            if(session) {
                const userData = await authService.getCurrentUser()
                console.log("User Data:", userData)       // 👈 check if user data is fetched

                if(userData) dispatch(authlogin( {userData} ))
                console.log("Redirecting...")         // 👈 check if we reach here
                window.location.href = "/"
            }
        } catch (err) {
            setError(err.message)
        }
    }

  return (
    <div className='flex items-center justify-center w-full'>
        <div className='mx-auto w-full max-w-lg p-10 bg-gray-100 rounded-xl border-black/10'>
            <div className='mb-2 flex justify-center'>
                <span className='inline-block w-full max-w-[100px]'>
                    <Logo width='100px' />
                </span>
            </div>
            <h2 className='text-center text-2xl font-bold leading-tight'>Sign in to your account</h2>
            <p className='mt-2 text-center text-base text-black/60'>
                Don&apos;t have any account?&nbsp;
                <Link to ='/signup' className='font-medium text-primary transition-all duration-200 hover:underline'>
                    Sign Up
                </Link>
            </p>
            {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
            <form onSubmit={handleSubmit(login)} className='mt-8'>
                <div className='space-y-5'>
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
                        {...register('password', { 
                            required: true, 
                        })}/>
                    <Button type='submit' className='w-full'>
                        Sign In
                    </Button>

                </div>
            </form>
        </div>
    </div>
  )
}

export default Login