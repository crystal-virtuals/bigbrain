import { Skeleton } from '@components/loading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/table';
import { useToast } from '@hooks/toast';
import { sessionAPI } from '@services/api';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// A table of up to top 5 users and their scores
function ResultsTable({ players }) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const topPlayers = sortedPlayers.slice(0, 5);

  return (
    <Table dense className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]">
      <TableHead>
        <TableRow>
          <TableHeader>Rank</TableHeader>
          <TableHeader>Player</TableHeader>
          <TableHeader className="text-right">Score</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {topPlayers.map((player, index) => (
          <TableRow key={player.index}>
            <TableCell className="tabular-nums">{index + 1}</TableCell>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell className="text-right tabular-nums">{player.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function Results({ ...props }) {
  const { sessionId, session, game, lock, setLock, advanceGame, stopGame } = props;
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toastify = useToast();

  // Fetch the results of the game
  useEffect(() => {
    if (!sessionId) return;
    const fetchResults = async () => {
      try {
        const ret = await sessionAPI.getResults(sessionId);
        setResults(ret);
        console.log('Fetched results:', ret);
      } catch (error) {
        console.error('Error fetching game results:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [sessionId]);

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    toastify.error({message: error.message});
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold">Results</h1>

    </div>
  );
}
