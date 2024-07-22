import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../../components/OAuth/OAuth.jsx';

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
        setError('Всички полета са задължителни.');
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
          setError(data.message || 'Регистрацията е неуспешна. Моля, опитайте отново.');
          return;
        }
    
        setLoading(false);
        setError(null);
        alert('Регистрацията е успешна!');
        navigate('/login');
      } catch (error) {
        setLoading(false);
        setError('Неочаквана грешка. Моля, опитайте отново.');
      }
    };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-white text-3xl text-center font-semibold my-7'>
        Регистрация
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='Име' 
        className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="email" placeholder='Email' 
        className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Парола' 
        className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='text-white p-3 rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80' style={{ backgroundColor: '#00B98E' }}>{loading ? 'Зареждане...' : 'Регистрация'}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5 text-white'>
        <p>Вече имате регистрация? </p>
        <Link to='/login'>
        <span className='text-blue-500'>Вход</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
