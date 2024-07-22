import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });
      
          const data = await response.json();
      
          if (!response.ok) {
            setLoading(false);
            setError(data.message || 'Неуспашно изпращане на имейл');
            return;
          } 

          setLoading(false);
          setError(null);
          alert('Съобщението е изпратено успешно!');
          navigate('/');
        } catch (err) {
            setLoading(false);
            setError('Неочаквана грешка. Моля, опитайте отново.');
        }
      };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-white text-3xl text-center font-semibold my-7'>
        Забравена парола
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='Email' 
        className='border p-3 rounded-lg' id='email' onChange={(e)=> setEmail(e.target.value)}/>
        <button disabled={loading} className='text-white p-3 rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80' style={{ backgroundColor: '#00B98E' }}>{loading ? 'Зареждане...' : 'Изпрати email'}</button>
      </form>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
