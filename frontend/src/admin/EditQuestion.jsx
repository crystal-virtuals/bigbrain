import { useOutletContext, useParams } from 'react-router-dom';

function EditQuestion() {
  const { gameId, questionId } = useParams();
  const { user, games, setGames } = useOutletContext();

  return (
    <div>
      Editing question {questionId} of game {gameId}
    </div>
  );
}

export default EditQuestion;