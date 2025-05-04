import { PlayerProvider  } from '@hooks/player';
import { Outlet } from 'react-router-dom';

export default function PlayLayout() {
  return (
    <PlayerProvider>
      <Outlet />
    </PlayerProvider>
  );
}
