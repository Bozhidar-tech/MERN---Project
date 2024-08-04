import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        setLoading(true);

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
                setError(data.message || t('emailSendError'));
                setLoading(false);
                return;
            }

            setError(null);
            alert(t('emailSentSuccess'));
            navigate('/');
        } catch (err) {
            setError(t('unexpectedError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-white text-3xl text-center font-semibold my-7'>
                {t('forgotPassword')}
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input 
                    type="email" 
                    placeholder={t('emailPlaceholder')} 
                    className='border p-3 rounded-lg' 
                    id='email' 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <button 
                    disabled={loading} 
                    className='text-white p-3 rounded-lg uppercase hover:opacity-95 
                    disabled:opacity-80' 
                    style={{ backgroundColor: '#00B98E' }}
                >
                    {loading ? t('loading') : t('sendEmail')}
                </button>
            </form>
            {error && <p className='text-red-500'>{error}</p>}
        </div>
    );
}
