import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      loginWithToken(token);
      navigate('/dashboard');
    } else {
      // Si no hay token, redirigir al login
      navigate('/login');
    }
  }, [location, navigate, loginWithToken]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold">Autenticando...</h1>
        <p className="text-gray-400">Por favor, espera un momento.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
