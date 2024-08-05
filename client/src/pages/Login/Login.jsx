import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../redux/user/userSlice.js';
import OAuth from '../../components/OAuth/OAuth.jsx';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
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
      dispatch(loginStart());

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (res.ok) {
          dispatch(loginSuccess(data));
          navigate('/');
        } else {
          dispatch(loginFailure(data.message || t('loginError')));
        }
      } catch (error) {
        dispatch(loginFailure(t('loginError')));
      }
    };

    useEffect(() => {
      return () => {
        dispatch(clearError());
        localStorage.clear();
      };
    }, [dispatch]);

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7 text-white'>
                {t('login')}
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input 
                    type="email" 
                    placeholder={t('emailPlaceholder')} 
                    className='border p-3 rounded-lg' 
                    id='email' 
                    onChange={handleChange}
                />
                <div className='relative'>
                    <input 
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('passwordPlaceholder')} 
                        className='border p-3 rounded-lg w-full' 
                        id='password' 
                        onChange={handleChange}
                    />
                    <button 
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2'
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <button 
                    disabled={loading} 
                    className='text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' 
                    style={{ backgroundColor: '#00B98E' }}
                >
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
