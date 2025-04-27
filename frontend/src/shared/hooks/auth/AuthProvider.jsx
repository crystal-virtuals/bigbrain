import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const login = (token, credentials) => {
    const { email, name } = credentials;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ email, name }));
    setUser({ email, name });
    navigate('/dashboard');
  }

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/home');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
