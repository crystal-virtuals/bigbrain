import { Layout } from '@components/session/layout';
import { LobbyLayout, LobbyMainSection } from '@components/session/lobby';
import { Heading } from '@components/heading';
import { ButtonPrimary as Button } from '@components/button';

function Lobby({ sessionId, playerName, status }) {
  return (
    <Layout>
      <LobbyLayout>
        <LobbyMainSection title='You have joined with Session ID:' sessionId={sessionId}>
          <div className="flex items-center justify-center flex-1">
            <Heading className="flex items-end gap-2">
              Joining as: {playerName}
            </Heading>
          </div>
          <Button disabled={!status} color='light'>
            <div className="flex items-end gap-2">
              Waiting for host to start
              <span className="loading loading-dots loading-sm" />
            </div>
          </Button>
        </LobbyMainSection>
      </LobbyLayout>
    </Layout>
  );
}

export default Lobby;
