import { LinkToggle } from '@components/button';
import { CopyToClipboardLink } from '@components/clipboard';
import { GameMetadata } from '@components/game/card';
import { HeadingBorder, Subheading } from '@components/heading';
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

export function Section({ children, className }) {
  const styles = {
    base: 'dark:bg-black/25 ring-2 ring-green dark:ring-green/50 bg-secondary-100 rounded-2xl overflow-hidden flex flex-col items-center',
    size: 'w-full h-full max-w-2xl',
  };
  return (
    <section className={clsx(styles.base, styles.size, className)}>
      {children}
    </section>
  );
}

export function SectionHeader({ children }) {
  return (
    <div className="h-full w-full px-8 py-8 dark:bg-zinc-950 bg-secondary-200 text-neutral-content">
      {children}
    </div>
  );
}

export function SectionBody({ children, className }) {
  return (
    <div className={clsx('relative w-full h-full px-8 py-8 flex-1', className)}>
      {children}
    </div>
  );
}


export function LobbyMainSection({ title, sessionId, lock, setLock, children }) {
  const sessionUrl = `${window.location.origin}/play/${sessionId}`;

  return (
    <Section className="xl:w-4/6 lg:w-7/12 min-h-[30rem] min-w-[300px]">
      <SectionHeader>
        <div className="flex flex-col items-center justify-center flex-1 h-full gap-4">
          <Strong>{title}</Strong>

          {!lock ? (
            <SessionId sessionId={sessionId} />
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <HeadingBorder size="text-2xl">The ID is hidden</HeadingBorder>
              <Text>This game is locked. Joining is no longer available.</Text>
            </div>
          )}

          <div className="flex flex-row items-center">
            {!lock && (
              <CopyToClipboardLink value={sessionUrl} className="mr-4" />
            )}
            {setLock && <ToggleLockLink lock={!lock} setLock={setLock} />}
          </div>
        </div>
      </SectionHeader>

      <SectionBody className="flex flex-col items-center justify-between gap-4">
        {children}
      </SectionBody>
    </Section>
  );
}

export function LobbySecondarySection({ game, session }) {
  return (
    <Section className="xl:w-2/6 lg:w-5/12 min-h-[30rem]">
      <SectionHeader>
        <div className="flex flex-col items-start justify-start flex-1 h-full gap-4">
          {game.thumbnail && (
            <img
              src={game.thumbnail}
              alt="Game Thumbnail"
              className="size-24 flex-none rounded-lg object-cover"
            />
          )}
          <div className="flex flex-col items-start justify-center w-full gap-4">
            <Strong>{game.name}</Strong>
            <GameMetadata questions={game.questions} />
          </div>
        </div>
      </SectionHeader>
      <SectionBody className="flex flex-col items-start justify-start gap-4 text-neutral-content">
        <Subheading>Players Joined:</Subheading>
        <ul
          role="list"
          className="list list-disc pl-4 text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400"
        >
          {session.players.length > 0 ? (
            session.players.map((player, index) => (
              <li key={index}>{player}</li>
            ))
          ) : (
            <Text>No players joined yet</Text>
          )}
        </ul>
      </SectionBody>
    </Section>
  );
}

export function LobbyLayout({ children }) {
  return (
    <div className="flex grow items-center justify-center p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
      <div className="w-full h-full container mx-auto flex flex-col lg:flex-row gap-8 items-center justify-center lg:max-h-[60rem]">
        {children}
      </div>
    </div>
  );
}
