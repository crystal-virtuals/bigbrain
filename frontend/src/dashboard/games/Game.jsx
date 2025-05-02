import { EditDeleteGameMenu } from '@components/game';
import {
  Card,
  CardBadge,
  CardBody,
  CardHeader,
  CardIndicator,
  GameMetadata,
  GameThumbnail,
  Link,
} from '@components/game/card';
import { StartGameButton, StopGameButton } from '@components/session';

function MutateGameStateButton({ game }) {
  return (
    <div className="z-2 absolute top-0 left-0 w-full h-full visible">
      <div className="z-3 absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ease-in-out bg-black/60 opacity-0 hover:opacity-100 ">
        <StartGameButton game={game} />
        <StopGameButton game={game} />
      </div>
    </div>
  );
}

function Game({ game, onDelete }) {
  return (
    <>
      <Card active={game.active}>
        <CardHeader>
          {/* Game thumbnail */}
          <GameThumbnail game={game} className="absolute top-0 left-0 z-0 w-full h-full"/>
          {/* Mutate (start/advance/stop) game */}
          <MutateGameStateButton game={game} />
          {game.active && <CardBadge>In Progress</CardBadge>}
        </CardHeader>

        <CardBody>
          {/* Game name */}
          <Link to={`/game/${game.id}`} disabled={game.active}>
            {game.name}
          </Link>
          {/* Game dropdown menu + metadata */}
          <div className="flex flex-row items-center justify-between h-8">
            <GameMetadata questions={game.questions} />
            <EditDeleteGameMenu
              game={game}
              onDelete={onDelete}
              disabled={game.active}
            />
          </div>
        </CardBody>

        {/* Active Game indicator */}
        <CardIndicator active={game.active} />
      </Card>
    </>
  );
}

export default Game;
