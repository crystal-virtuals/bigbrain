import { useState, useEffect, useMemo } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Skeleton } from '@components/loading';
import Lobby from './Lobby';

function getSessionState(session) {
  if (!session) return 'invalid';
  if (session.active === false && session.position !== -1) return 'finished';
  if (session.active === true && session.position === -1) return 'not_started';
  if (session.active === true && session.position !== -1) return 'in_progress';
  return 'invalid';
}

// At route /session/:sessionId
// States:
// 1. Lobby
// 2. Start
// 3. Playing (can still advance)
// 4. Results
function AdminSession() {
  const { sessionId } = useParams();
  const { session, game } = useOutletContext();
  const [lock, setLock] = useState(false);

  const state = getSessionState(session);
  if (state === 'finished') {
    // show results
    return (<h1>Results</h1>)
  } else if (state === 'not_started') {
    // show lobby
    return (
      <Lobby sessionId={sessionId} lock={lock} setLock={setLock} />
    );

  } else if (state === 'in_progress') {
    // show "next question" or timer, etc
    return (<h1>In in_progress</h1>)
  }

  return (
    <Lobby sessionId={sessionId} lock={lock} setLock={setLock} />
  );
}

export default AdminSession;
