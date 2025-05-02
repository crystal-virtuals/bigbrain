import { LobbyLayout, Section, LobbyContent, LobbyHeader } from '@components/session/lobby';
import { ButtonPrimary as Button } from '@components/button';

function Lobby({ ...props}) {
  const { sessionId, session, game, lock, setLock, advanceGame, stopGame } = props;

  return (
    <LobbyLayout>
      <LobbyHeader sessionId={sessionId} lock={lock} setLock={setLock}/>
      <LobbyContent lock={lock}>
        <Button disabled={lock} onClick={advanceGame}>Start Game</Button>
      </LobbyContent>
    </LobbyLayout>
  );
}

export default Lobby;
