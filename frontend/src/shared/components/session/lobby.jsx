import { LinkToggle } from '@components/button';
import { CopyToClipboardLink } from '@components/clipboard';
import { Heading, HeadingBorder } from '@components/heading';
import { Strong, Text } from '@components/text';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/16/solid';
import { splitNumber } from '@utils/helpers';
import clsx from 'clsx';

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

export function Page({ children }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full h-screen px-2 lg:px-10 py-4 lg:py-10">
      {children}
    </div>
  );
}

export function Section({ children }) {
  return (
    // align center
    <div className="w-full flex-1 h-full lg:max-h-[800px] flex flex-col items-center justify-center">
      <section className="dark:bg-black/25 ring-2 ring-green dark:ring-green/50 bg-secondary-100 rounded-2xl overflow-hidden h-full w-full flex flex-col">
        {children}
      </section>
    </div>
  );
}

export function SectionHeader({ children }) {
  return (
    <div className="px-4 py-5 sm:px-6 w-full dark:bg-zinc-950 bg-secondary-200 text-neutral-content">
      {children}
    </div>
  );
}

export function SectionContent({ children }) {
  return (
    <div className="px-4 py-5 sm:p-6 flex-1 w-full flex flex-col">
      <div className="flex flex-col justify-between flex-1 h-full items-center">
        {children}
      </div>
    </div>
  );
}

export function LobbyHeader({ sessionId, lock, setLock }) {
  const sessionUrl = `${window.location.origin}/play/${sessionId}`;

  return (
    <SectionHeader>
      <div className="flex flex-col items-center justify-center flex-1 gap-2">
        <Strong>Session ID:</Strong>

        {!lock ? (
          <SessionId sessionId={sessionId} />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <HeadingBorder size="text-2xl">The ID is hidden</HeadingBorder>
            <Text>This game is locked. Joining is no longer available.</Text>
          </div>
        )}

        <div className="flex flex-row items-center">
          {!lock && <CopyToClipboardLink value={sessionUrl} className="mr-4" />}
          <ToggleLockLink lock={!lock} setLock={setLock} />
        </div>
      </div>
    </SectionHeader>
  );
}

export function LobbyContent({ lock, children }) {
  return (
    <SectionContent>
      <div className="flex-1 flex items-center justify-center">
        {!lock && (
          <Heading className="flex items-end gap-2">
            <p>Waiting for players</p>
            <span className="loading loading-dots loading-sm"></span>
          </Heading>
        )}
      </div>
      {/* Children (bottom-aligned) */}
      <div className="pb-12"><div>{children}</div></div>
    </SectionContent>
  );
}
