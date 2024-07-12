import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {

    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (!formData.username || !formData.email || !formData.password) {
        setError('All fields are required.');
        return;
      }
    
      try {
        setLoading(true);
        setError(null);
    
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        });
    
        const data = await res.json();
    
        if (!res.ok) {
          setLoading(false);
          setError(data.message || 'Registration failed. Please try again.');
          return;
        }
    
        setLoading(false);
        setError(null);
        alert('Registration successful!');
        navigate('/login');
      } catch (error) {
        setLoading(false);
        setError('An unexpected error occurred. Please try again.');
      }
    };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Register
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' 
        className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="email" placeholder='Email' 
        className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Password' 
        className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='text-white p-3 rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80' style={{ backgroundColor: '#00B98E' }}>{loading ? 'Loading...' : 'Register'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account? </p>
        <Link to='/login'>
        <span className='text-blue-500'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
