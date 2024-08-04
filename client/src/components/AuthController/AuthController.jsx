import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';
import { useTranslation } from 'react-i18next';

export default function AuthController() {
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (currentUser) {
        alert(t('alreadyLoggedIn'));
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [currentUser, t]);

  if (loading) {
    return <Loading />;
  }

  return currentUser ? <Navigate to="/" /> : <Outlet />;
}
