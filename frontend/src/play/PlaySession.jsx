import { useToast } from '@hooks/toast';
import { Loading } from '@pages/public';
import { playerAPI } from '@services/api';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Lobby from './Lobby';

export default function PlaySession() {
  const { sessionId, playerId } = useParams();
  const [playerName, setPlayerName] = useState('');
  const [state, setState] = useState({
    status: 'loading', // 'loading' | 'valid' | 'invalid'
    started: false,
    error: null
  });

  const toastify = useToast();
  const navigate = useNavigate();

  // Validate and get the session status on first render
  useEffect(() => {
    const validate = async () => {
      try {
        console.log('Validating session and player ID...');
        const hasStarted = await playerAPI.getStatus(playerId);
        setState({ status: 'valid', started: hasStarted, error: null });
        // get the player name from local storage
        const storedName = localStorage.getItem(`player-${playerId}`);
        if (storedName) {
          setPlayerName(storedName);
        } else {
          localStorage.setItem(`player-${playerId}`, 'Guest');
        }
      } catch (err) {
        setState({ status: 'invalid', started: false, error: err.message });
      }
    };
    validate();
  }, [sessionId, playerId]);

  // Poll until the game starts
  useEffect(() => {
    if (state.status !== 'valid' || state.started) return;

    const interval = setInterval(async () => {
      try {
        console.log('Polling for game start...');
        const hasStarted = await playerAPI.getStatus(playerId);
        if (hasStarted) setState(prev => ({ ...prev, started: true }));
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [state.status, state.started, playerId]);

  // Handle invalid state
  useEffect(() => {
    if (state.status === 'invalid') {
      toastify.error({
        message: state.error || 'Invalid session or player ID',
        description: 'Please check the link or rejoin the session.'
      });
      navigate('/play');
    }
  }, [state.status]);


  if (state.status === 'loading') return <Loading />;
  if (state.status === 'invalid') return null;

  return state.started ? (
    <h1>Game has started!</h1>
  ) : (
    <Lobby sessionId={sessionId} status={state.started} playerName={playerName} />
  );
}