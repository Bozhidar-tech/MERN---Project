import React from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Register
      </h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' 
        className='border p-3 rounded-lg' id='username'/>
        <input type="email" placeholder='Email' 
        className='border p-3 rounded-lg' id='email'/>
        <input type="password" placeholder='Password' 
        className='border p-3 rounded-lg' id='password'/>
        <button className='text-white p-3 rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80' style={{ backgroundColor: '#00B98E' }}>Register</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account? </p>
        <Link to='/login'>
        <span className='text-blue-500'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}
