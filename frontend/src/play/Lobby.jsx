import { LobbyLayout, LobbyMainSection } from '@components/session/lobby';
import { Heading } from '@components/heading';
import { ButtonPrimary as Button } from '@components/button';
import { usePlayer } from '@hooks/player';

function Lobby({ sessionId, status }) {
  const { player } = usePlayer();
  return (
    <LobbyLayout>
      <LobbyMainSection
        title="You have joined with Session ID:"
        sessionId={sessionId}
      >
        <div className="flex items-center justify-center flex-1">
          <Heading className="flex items-end gap-2">
            Joining as {player.name}
          </Heading>
        </div>
        <Button disabled={!status} color="light">
          <div className="flex items-end gap-2">
            <span className="text-base text-neutral hidden md:block">
              Waiting for host to start
            </span>
            <span className="text-base text-neutral block md:hidden">
              Waiting
            </span>
            <span className="loading loading-dots loading-sm" />
          </div>
        </Button>
      </LobbyMainSection>
    </LobbyLayout>
  );
}

export default Lobby;
