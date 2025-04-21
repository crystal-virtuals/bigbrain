import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import { Heading } from '@components/heading';

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  // on component mount (first render), check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('user');

    (token && loggedInUser)
      ? setUser(JSON.parse(loggedInUser))
      : setUser(null);

    setLoading(false);
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

  // if loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Heading>Loading {' '}
          <span className="loading loading-dots loading-sm"></span>
        </Heading>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
