import { Page, Section, LobbyContent, LobbyHeader } from '@components/session/lobby';
import { ButtonPrimary as Button } from '@components/button';

function Lobby({ sessionId, lock, setLock }) {
  return (
    <Page>
      <Section>
        <LobbyHeader sessionId={sessionId} lock={lock} setLock={setLock}/>
        <LobbyContent lock={lock}>
          <Button disabled={lock}>Start Game</Button>
        </LobbyContent>
      </Section>
      {/* <Section></Section> */}
    </Page>
  );
}

export default Lobby;
