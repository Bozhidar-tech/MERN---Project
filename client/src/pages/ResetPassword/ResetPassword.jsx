// src/components/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ResetPassword() {
    const { t } = useTranslation();
    const [password, setPassword] = useState("");
    const { token } = useParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || t('passwordChangeError'));
                setLoading(false);
                return;
            }

            setLoading(false);
            alert(t('passwordChangeSuccess'));
            navigate('/login');
        } catch (err) {
            setLoading(false);
            setError(t('unexpectedError'));
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center text-white font-semibold my-7'>
                {t('resetPasswordTitle')}
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input
                    type="password"
                    placeholder={t('newPasswordPlaceholder')}
                    className='border p-3 rounded-lg'
                    id='password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    disabled={loading}
                    className='text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                    style={{ backgroundColor: '#00B98E' }}
                >
                    {loading ? t('loadingText') : t('confirmButton')}
                </button>
            </form>
            {error && <p className='text-red-500'>{error}</p>}
        </div>
    );
}
