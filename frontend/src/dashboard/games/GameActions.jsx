import { StartGameButton, StopGameButton } from '@components/session';

export default function GameActions({ game, onStop, onStart }) {
  return (
    <div className="z-3 absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ease-in-out bg-black/60 opacity-0 hover:opacity-100">
      <StartGameButton game={game} onStart={onStart} />
      {game.active && <StopGameButton game={game} onStop={onStop} />}
    </div>
  );
}