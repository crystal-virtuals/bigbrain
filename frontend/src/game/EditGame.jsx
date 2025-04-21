import { GameLayout } from '@/game';
import { updateGames } from '@/game/utils/api';
import { Field, Label } from '@components/fieldset';
import { EditForm, FileInput, TextInput } from '@components/form';
import { Heading, Subheading } from '@components/heading';
import { Text } from '@components/text';
import { useEditForm } from '@hooks/form/useEditForm';
import { useToast } from '@hooks/toast';
import { useMemo } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

function Card({ children }) {
  return (
    <div className="bg-white dark:bg-pink-100/5 shadow-xs ring-1 ring-zinc-900/5 sm:rounded-xl md:col-span-2">
      {children}
    </div>
  );
}

function EditGameForm({ game, onSubmit }) {
  const props = useEditForm(game, onSubmit);
  const toastify = useToast();

  const handleSubmit = (e) => {
    props.onSubmit(e)
      .then(() => {
        toastify.success('Successfully updated game');
      })
      .catch(() => {
        toastify.error('Failed to update game. Please try again.');
      })
  };

  const { formData, setFormData, handleChange, ...rest} = props;
  const editFormProps = { ...rest, onSubmit: handleSubmit };

  return (
    <>
      <Card>
        <EditForm {...editFormProps}>
          {/* Game name */}
          <Field className="sm:col-span-4">
            <Label htmlFor="name">Name</Label>
            <TextInput
              name="name"
              initialValue={formData.name}
              onChange={(value) => handleChange('name', value)}
              readOnly={props.readOnly}
              disabled={props.disabled}
            />
          </Field>

          {/* Game thumbnail */}
          <Field className="col-span-full">
            <Label htmlFor="thumbnail">Photo</Label>
            <FileInput
              name="thumbnail"
              initialUrl={formData.thumbnail}
              onChange={(file) => handleChange('thumbnail', file)}
              readOnly={props.readOnly}
              disabled={props.disabled}
            />
          </Field>
        </EditForm>
      </Card>
    </>
  );
}


export default function EditGame() {
  const { gameId } = useParams();
  const { games, setGames } = useOutletContext();

  const isEqual = (game, gameId) => {
    return Number(game.id) === Number(gameId);
  };

  // Find the game by ID
  const game = useMemo(() => {
    return games.find(game => isEqual(game, gameId));
  }, [games, gameId]); // only re-run when games or gameId changes

  if (!game) return <p>Game not found</p>;

  // Update the game
  const updateGame = (editedGame) => {
    console.log('Updating game:', editedGame);
    const updatedGames = games.map((g) => (isEqual(g, gameId) ? editedGame : g));
    return updateGames(updatedGames)
      .then(() => {
        setGames(updatedGames);
        return Promise.resolve(editedGame);
      })
      .catch((error) => {
        console.error('Error updating game:', error);
        return Promise.reject(error.data);
      });
  }

  const question = {
    id: 1,
    question: 'What is your favorite color?',
    type: 'checkboxes',
    answers: [
      { id: 1, answer: 'Red' },
      { id: 2, answer: 'Blue' },
      { id: 3, answer: 'Green' },
    ],
  }

  return (
    <GameLayout>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Edit Game</Heading>
      </div>

      <div className="divide-y divide-zinc-900/10 dark:divide-white/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
          {/* Left column */}
          <div className="px-4 sm:px-0">
            <Subheading>Game</Subheading>
            <Text className="mt-1">Edit your game details.</Text>
          </div>
          {/* Right column */}
          <EditGameForm game={game} onSubmit={updateGame}/>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
          {/* Left column */}
          <div className="px-4 sm:px-0">
            <Subheading>Questions</Subheading>
            <Text className="mt-1">Add your questions here.</Text>
          </div>
          {/* Right column */}
          {/* <QuestionForm question={question} onSubmit={null} /> */}
        </div>
      </div>
    </GameLayout>
  );
}
