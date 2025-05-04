import {
  LobbyLayout,
  LobbyMainSection,
  LobbySecondarySection,
} from '@components/session/lobby';
import { ButtonPrimary as Button } from '@components/button';
import { Heading } from '@components/heading';

function Lobby({ ...props }) {
  const { game, session, sessionId, lock, setLock, advanceGame } = props;

  return (
    <LobbyLayout>
      <LobbyMainSection title="Session ID:" sessionId={sessionId} lock={lock} setLock={setLock}>
        <div className="flex items-center justify-center flex-1">
          <Heading className="flex items-end gap-2">
            <p className="text-base md:text-lg">Waiting for players</p>
            <span className="loading loading-dots loading-sm"></span>
          </Heading>
        </div>
        <div className="flex items-center justify-center py-2">
          <Button disabled={lock} onClick={advanceGame}>
            Start Game
          </Button>
        </div>
      </LobbyMainSection>
      <LobbySecondarySection game={game} session={session} />
    </LobbyLayout>
  );
}

export default Lobby;
