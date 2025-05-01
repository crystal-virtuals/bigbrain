import { ButtonPrimary, LinkToggle } from '@components/button';
import { CopyToClipboardLink } from '@components/clipboard';
import { Heading, HeadingBorder, Subheading } from '@components/heading';
import { Strong } from '@components/text';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/16/solid';
import { splitNumber } from '@utils/helpers';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function LockToggle({ lock, setLock }) {
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

function SessionId({ sessionId }) {
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

function Header({ sessionId, lock, setLock }) {
  const sessionUrl = `${window.location.origin}/play/${sessionId}`;

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 text-secondary-content">
      <Strong>Session ID:</Strong>

      {!lock ? (
        <SessionId sessionId={sessionId} />
      ) : (
        <Subheading className="text-center">
          <p>This game is locked.</p>
          <p className="text-error dark:text-error">
            Joining is no longer available.
          </p>
        </Subheading>
      )}

      <div className="flex flex-row items-center gap-4">
        {!lock && <CopyToClipboardLink value={sessionUrl} />}
        <LockToggle lock={!lock} setLock={setLock} />
      </div>
    </div>
  );
}

function Section({ header, children }) {
  return (
    <section className="dark:bg-black/25 ring-2 ring-green/50 bg-zinc-100/25 rounded-2xl overflow-hidden w-full flex-1 h-full lg:max-h-[700px]">
      <div className="flex flex-col items-center justify-center mb-8 w-full h-full">
        <div className="px-4 py-5 sm:px-6 w-full dark:bg-zinc-950 bg-secondary-200">
          {header}
        </div>
        <div className="px-4 py-5 sm:p-6 flex-1 w-full bg-secondary-100/20">
          <div className="flex flex-col items-center justify-between flex-1 w-full gap-4 h-full">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function Content({ lock }) {
  return (
    <div className="md:gap-8 flex flex-col items-center justify-between flex-1 w-full gap-4">
      <Heading className="flex items-end gap-2">
        <p>Waiting for players</p>
        <span className="loading loading-dots loading-sm"></span>
      </Heading>
      <ButtonPrimary disabled={lock}>Start Game</ButtonPrimary>
    </div>
  );
}

function AdminSession() {
  const [lock, setLock] = useState(false);
  const { sessionId } = useParams();

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full h-screen px-2 lg:px-10 py-4 lg:py-10">
      <Section
        header={<Header sessionId={sessionId} lock={lock} setLock={setLock} />}
      >
        <Content lock={lock} />
      </Section>

      <Section></Section>
    </div>
  );
}

export default AdminSession;
