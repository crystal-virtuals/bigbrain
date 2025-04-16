import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
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
    navigate('/login');
  };

  // if there's no user, show the login form
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
