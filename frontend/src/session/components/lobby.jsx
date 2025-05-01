import { ButtonPrimary, LinkToggle } from '@components/button';
import { CopyToClipboardLink } from '@components/clipboard';
import { Heading, HeadingBorder } from '@components/heading';
import { Strong, Text } from '@components/text';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/16/solid';
import { splitNumber } from '@utils/helpers';

function ToggleLockLink({ lock, setLock }) {
  return (
    <div
      className="tooltip tooltip-neutral tooltip-bottom"
      data-tip={
        lock
          ? 'Lock this game to prevent more players from joining'
          : 'Unlock this game to allow more players to join'
      }
    >
      <LinkToggle
        textOn="Lock"
        textOff="Unlock"
        isOn={lock}
        setIsOn={setLock}
        iconOn={LockOpenIcon}
        iconOff={LockClosedIcon}
      />
    </div>
  );
}

function SessionId({ sessionId, lock }) {
  if (lock) {
    return (
      <div className="flex flex-col items-center">
        <Text>This game is locked.</Text>
        <Text>Joining is no longer available.</Text>
      </div>
    );
  }

  return (
    <HeadingBorder>
      <div className="flex flex-row items-center justify-center flex-1 gap-3">
        {splitNumber(sessionId).map((number, index) => (
          <div key={index}>{number}</div>
        ))}
      </div>
    </HeadingBorder>
  );
}


export function LobbyHeader({ sessionId, lock, setLock }) {
  const sessionUrl = `${window.location.origin}/play/${sessionId}`;

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2">
      <Strong>Session ID:</Strong>

      {!lock ? (
        <SessionId sessionId={sessionId} />
      ) : (
        <div className="flex flex-col items-center">
          <Text>This game is locked.</Text>
          <Text>Joining is no longer available.</Text>
        </div>
      )}

      <div className="flex flex-row items-center gap-4">
        {!lock && <CopyToClipboardLink value={sessionUrl}/>}
        <ToggleLockLink lock={!lock} setLock={setLock} />
      </div>
    </div>
  );
}


export function LobbyContent({ lock }) {
  return (
    <div className="md:gap-8 flex flex-col items-center justify-between flex-1 w-full gap-4">
      <div className="flex flex-col items-center justify-center flex-1 w-full gap-4">
        <Heading className="flex items-end gap-2">
          <p>Waiting for players</p>
          <span className="loading loading-dots loading-sm"></span>
        </Heading>
      </div>
      <ButtonPrimary disabled={lock}>Start Game</ButtonPrimary>
    </div>
  );
}