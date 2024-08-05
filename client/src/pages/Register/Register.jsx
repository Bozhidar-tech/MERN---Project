import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../../components/OAuth/OAuth.jsx';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setErrors([t('all_fields_required')]);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);

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
        setErrors(data.errors ? data.errors.map(error => error.msg) : [data.message || t('registration_failed')]);
        return;
      }

      setLoading(false);
      setErrors([]);
      alert(t('registration_successful'));
      navigate('/login');
    } catch (error) {
      setLoading(false);
      setErrors([t('unexpected_error')]);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-white text-3xl text-center font-semibold my-7'>
        {t('register')}
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder={t('name')} 
          className='border p-3 rounded-lg' id='username' onChange={handleChange} />
        <input type="email" placeholder={t('email')} 
          className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type="password" placeholder={t('password')} 
          className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='text-white p-3 rounded-lg uppercase hover:opacity-95 
          disabled:opacity-80' style={{ backgroundColor: '#00B98E' }}>
          {loading ? t('loading') : t('register')}
        </button>
        <OAuth/>
      </form>

      <div className='flex gap-2 mt-5 text-white'>
        <p>{t('already_registered')} </p>
        <Link to='/login'>
          <span className='text-blue-500'>{t('login')}</span>
        </Link>
      </div>
      {errors.length > 0 && (
        <div className='mt-4'>
          {errors.map((error, index) => (
            <p key={index} className='text-red-500'>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
