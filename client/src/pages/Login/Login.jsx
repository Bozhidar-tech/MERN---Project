import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/user/userSlice.js';
import OAuth from '../../components/OAuth/OAuth.jsx';
import { useTranslation } from 'react-i18next';

export default function Login() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        dispatch(loginStart());
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (data.success === false) {
          dispatch(loginFailure(data.message));
          return;
        }
        dispatch(loginSuccess(data));
        navigate('/');
      } catch (error) {
        dispatch(loginFailure(t('loginError')));
      }
    };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 text-white'>
        {t('login')}
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder={t('emailPlaceholder')} 
        className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder={t('passwordPlaceholder')} 
        className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='text-white p-3 rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80' style={{ backgroundColor: '#00B98E' }}>
          {loading ? t('loading') : t('loginButton')}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5 text-white'>
        <p>{t('registerPrompt')}</p>
        <Link to='/register'>
          <span className='text-blue-500'>{t('registerLink')}</span>
        </Link>
        <Link to='/forgot-password'>
          <span className='text-red-500'>{t('forgotPasswordLink')}</span>
        </Link>
      </div>
      
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
