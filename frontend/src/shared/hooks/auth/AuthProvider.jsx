import { useApi } from '@hooks/api';
import { useToast } from '@hooks/toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const toastify = useToast();
  const api = useApi();

  // Fetch user on first render
  useEffect(() => {
    console.log('Running useEffect to fetch user from localStorage');
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('user');
    if (token && loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      setUser(null);
    }
  }, []);

  const login = async ({ email, password }) => {
    try {
      const { token } = await api.post('/admin/auth/login', { email, password });
      loginUser(token, email);
      toastify.success({
        message: 'Successfully logged in',
        description: 'Welcome back!',
      })
    } catch (error) {
      toastify.error({
        message: 'Invalid input',
        description: 'Please check your credentials and try again.',
      })
      throw error;
    }
  };

  const register = async ({ email, password, name }) => {
    try {
      const { token } = await api.post('/admin/auth/register', { email, password, name });
      loginUser(token, email, name);
      toastify.success({
        message: 'Successfully registered',
        description: `Welcome aboard, ${name}!`,
      })
    } catch (error) {
      toastify.error({
        message: 'Invalid credentials',
        description: 'Please check your input and try again.',
      })
      throw error;
    }
  }

  const logout = async () => {
    await api.post('/admin/auth/logout');
    logoutUser();
    toastify.success({
      message: 'Successfully logged out',
      description: 'See you next time!',
    })
  }

  const loginUser = (token, email, name = '') => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ email, name }));
    setUser({ email, name });
    navigate('/dashboard');
  }

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/home');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
