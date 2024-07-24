import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';

export default function AuthController() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (currentUser) {
        alert("Вече сте влезнали в акаунтът си.");
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [currentUser]);

  if (loading) {
    return <Loading />;
  }

  return currentUser ? <Navigate to="/" /> : <Outlet />;
}